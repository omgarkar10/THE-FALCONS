import os
from datetime import datetime
from uuid import uuid4

from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash

try:
    from google import genai
    from google.genai.types import HttpOptions
except ImportError:
    genai = None
    HttpOptions = None

from db import get_db

load_dotenv()


def create_app() -> Flask:
    app = Flask(__name__)

    # Basic config
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret-key")

    # Allow frontend dev server from any device on local net
    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=True,
    )

    # --------------------
    # Helper functions
    # --------------------

    def db():
        return get_db()

    def make_token(user_id: str) -> str:
        return f"token-{user_id}-{uuid4()}"

    def current_time_iso() -> str:
        return datetime.utcnow().isoformat() + "Z"

    # --------------------
    # Auth routes
    # --------------------

    @app.post("/api/auth/signup")
    def signup():
        data = request.get_json(force=True)
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")
        role = data.get("role", "consumer")

        if not all([name, email, password]):
            return jsonify({"message": "Name, email and password are required"}), 400

        if db().users.find_one({"email": email}):
            return jsonify({"message": "User already exists"}), 400

        user_id = str(uuid4())
        user = {
            "_id": user_id,
            "name": name,
            "email": email,
            "password": generate_password_hash(password),
            "role": role,
        }
        db().users.insert_one(user)

        token = make_token(user_id)
        response_user = {k: v for k, v in user.items() if k != "password"}
        return jsonify({"user": response_user, "token": token}), 201

    @app.post("/api/auth/login")
    def login():
        data = request.get_json(force=True)
        email = data.get("email")
        password = data.get("password") or ""

        if not email:
            return jsonify({"message": "Email is required"}), 400

        user = db().users.find_one({"email": email})

        if not user:
            # Auto-create for demo purposes (any email/password can log in)
            user_id = str(uuid4())
            user = {
                "_id": user_id,
                "name": (email.split("@")[0] or "User").title(),
                "email": email,
                "password": generate_password_hash(password),
                "role": "consumer",
            }
            db().users.insert_one(user)
        else:
            # For demo: accept any password — just verify if it matches the hash,
            # and if not, update the stored hash so the next login works too.
            if not check_password_hash(user["password"], password):
                db().users.update_one(
                    {"_id": user["_id"]},
                    {"$set": {"password": generate_password_hash(password)}},
                )

        token = make_token(user["_id"])
        response_user = {k: v for k, v in user.items() if k != "password"}
        return jsonify({"user": response_user, "token": token}), 200

    # --------------------
    # Inventory routes
    # --------------------

    @app.get("/api/inventory")
    def get_inventory():
        category = request.args.get("category")
        query = {"category": category} if category else {}
        items = list(db().inventory.find(query))
        return jsonify(items), 200

    @app.post("/api/inventory")
    def create_inventory_item():
        data = request.get_json(force=True)
        item_id = str(uuid4())
        new_item = {
            "_id": item_id,
            "name": data.get("name", "Unnamed Item"),
            "category": data.get("category", "Uncategorized"),
            "location": data.get("location", "Unknown"),
            "quantity": data.get("quantity", 0),
            "unit": data.get("unit", "tons"),
            "qualityStatus": data.get("qualityStatus", "Good"),
            "lastChecked": current_time_iso(),
            "temperature": data.get("temperature", 22.0),
            "humidity": data.get("humidity", 60),
        }
        db().inventory.insert_one(new_item)
        return jsonify(new_item), 201

    @app.get("/api/inventory/<item_id>")
    def get_inventory_item(item_id: str):
        item = db().inventory.find_one({"_id": item_id})
        if not item:
            return jsonify({"message": "Item not found"}), 404
        return jsonify(item), 200

    @app.put("/api/inventory/<item_id>")
    def update_inventory_item(item_id: str):
        data = request.get_json(force=True)
        update_fields = {}
        for key in [
            "name",
            "category",
            "location",
            "quantity",
            "unit",
            "qualityStatus",
            "temperature",
            "humidity",
        ]:
            if key in data:
                update_fields[key] = data[key]
        update_fields["lastChecked"] = current_time_iso()

        result = db().inventory.find_one_and_update(
            {"_id": item_id},
            {"$set": update_fields},
            return_document=True,
        )
        if not result:
            return jsonify({"message": "Item not found"}), 404
        return jsonify(result), 200

    @app.delete("/api/inventory/<item_id>")
    def delete_inventory_item(item_id: str):
        deleted = db().inventory.find_one_and_delete({"_id": item_id})
        if not deleted:
            return jsonify({"message": "Item not found"}), 404
        return jsonify({"deleted": deleted}), 200

    # --------------------
    # Analytics routes
    # --------------------

    @app.get("/api/analytics/dashboard")
    def analytics_dashboard():
        doc = db().dashboard_stats.find_one({"_id": "current"}, {"_id": 0})
        return jsonify(doc or {}), 200

    @app.get("/api/analytics/trends")
    def analytics_trends():
        doc = db().analytics.find_one({"_id": "current"}, {"_id": 0})
        return jsonify((doc or {}).get("storageTrends", [])), 200

    @app.get("/api/analytics/loss")
    def analytics_loss():
        doc = db().analytics.find_one({"_id": "current"}, {"_id": 0})
        return jsonify((doc or {}).get("lossAnalysis", [])), 200

    @app.get("/api/analytics/consumer")
    def analytics_consumer():
        doc = db().consumer_data.find_one({"_id": "current"}, {"_id": 0})
        return jsonify((doc or {}).get("stats", {})), 200

    @app.get("/api/analytics/full")
    def analytics_full():
        doc = db().analytics.find_one({"_id": "current"}, {"_id": 0})
        return jsonify(doc or {}), 200

    # --------------------
    # Consumer data route
    # --------------------

    @app.get("/api/consumer")
    def consumer_data():
        doc = db().consumer_data.find_one({"_id": "current"}, {"_id": 0})
        return jsonify(doc or {}), 200

    # --------------------
    # Sensor routes
    # --------------------

    @app.get("/api/sensors/readings")
    def sensor_readings():
        doc = db().sensor_readings.find_one({"_id": "current"}, {"_id": 0})
        return jsonify(doc or {}), 200

    @app.get("/api/sensors/alerts")
    def sensor_alerts():
        severity = request.args.get("severity")
        query = {"severity": severity} if severity else {}
        alerts = list(db().alerts.find(query))
        return jsonify(alerts), 200

    @app.get("/api/sensors/silos")
    def sensor_silos():
        silos = list(db().silo_status.find({}, {"_id": 0}))
        return jsonify(silos), 200

    @app.put("/api/sensors/alerts/<alert_id>/acknowledge")
    def acknowledge_alert(alert_id: str):
        result = db().alerts.update_one(
            {"_id": alert_id},
            {"$set": {"acknowledged": True, "acknowledgedAt": current_time_iso()}},
        )
        if result.matched_count == 0:
            return jsonify({"message": "Alert not found"}), 404
        return jsonify({"message": "Alert acknowledged"}), 200

    # --------------------
    # Logistics & directory
    # --------------------

    @app.get("/api/logistics")
    def logistics():
        doc = db().logistics.find_one({"_id": "current"}, {"_id": 0})
        return jsonify(doc or {}), 200

    @app.get("/api/warehouses")
    def warehouses():
        items = list(db().warehouses.find({}))
        return jsonify(items), 200

    # --------------------
    # Gemini chat route
    # --------------------

    SYSTEM_PROMPT = """You are AgroVault AI Assistant, a helpful chatbot for a smart agricultural warehouse management platform. You help warehouse managers and consumers with:
- Inventory management and stock queries
- Sensor readings and environmental monitoring
- Logistics and shipment tracking
- Quality reports and crop storage best practices
- General agricultural storage knowledge
Keep responses concise and helpful. Use bullet points when listing multiple items."""

    def build_gemini_client():
        api_key = os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY")
        if not api_key or genai is None:
            return None
        if HttpOptions is not None:
            http_options = HttpOptions(api_version="v1")
            return genai.Client(api_key=api_key, http_options=http_options)
        return genai.Client(api_key=api_key)

    @app.post("/api/chat")
    def chat():
        client = build_gemini_client()
        if client is None:
            return (
                jsonify(
                    {
                        "message": "Gemini client is not configured. Install 'google-genai' and set GOOGLE_API_KEY or GEMINI_API_KEY.",
                    }
                ),
                500,
            )

        data = request.get_json(force=True)
        message = data.get("message", "").strip()
        history = data.get("history", [])

        if not message:
            return jsonify({"message": "Message is required"}), 400

        contents = []
        for msg in history:
            role = "user" if msg.get("role") == "user" else "model"
            contents.append({"role": role, "parts": [{"text": msg.get("content", "")}]})
        contents.append({"role": "user", "parts": [{"text": message}]})

        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=contents,
                system_instruction={"parts": [{"text": SYSTEM_PROMPT}]},
                generation_config={"temperature": 0.7, "max_output_tokens": 1024},
            )
        except Exception as exc:
            return jsonify({"message": f"Error calling Gemini API: {exc}"}), 500

        text = getattr(response, "text", None)
        if not text:
            try:
                candidates = getattr(response, "candidates", None) or []
                if candidates and getattr(candidates[0], "content", None):
                    parts = getattr(candidates[0].content, "parts", None) or []
                    if parts and getattr(parts[0], "text", None):
                        text = parts[0].text
            except Exception:
                text = None

        if not text:
            return jsonify({"message": "No text response from Gemini."}), 500

        return jsonify({"reply": text}), 200

    # --------------------
    # Health check
    # --------------------

    @app.get("/api/health")
    def health():
        try:
            db().command("ping")
            db_status = "connected"
        except Exception:
            db_status = "disconnected"
        return jsonify({"status": "ok", "time": current_time_iso(), "database": db_status}), 200

    return app


if __name__ == "__main__":
    flask_app = create_app()
    port = int(os.environ.get("PORT", "5000"))
    flask_app.run(host="0.0.0.0", port=port, debug=True)
