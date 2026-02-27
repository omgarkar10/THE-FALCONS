import os
from datetime import datetime, timedelta
from uuid import uuid4

from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

try:
    from google import genai
    from google.genai.types import HttpOptions
except ImportError:
    genai = None
    HttpOptions = None

from mock_data import (
    MOCK_INVENTORY,
    MOCK_SENSOR_READINGS,
    MOCK_ALERTS,
    MOCK_SILO_STATUS,
    MOCK_DASHBOARD_STATS,
    MOCK_ANALYTICS,
    MOCK_CONSUMER_DATA,
    MOCK_LOGISTICS,
    MOCK_WAREHOUSE_DIRECTORY,
)

load_dotenv()


def create_app() -> Flask:
    app = Flask(__name__)

    # Basic config
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret-key")

    # Allow frontend dev server
    CORS(
        app,
        resources={r"/api/*": {"origins": [
            "http://localhost:5173", "http://127.0.0.1:5173",
            "http://localhost:5174", "http://127.0.0.1:5174",
            "http://localhost:5175", "http://127.0.0.1:5175"
        ]}},
        supports_credentials=True,
    )

    # In-memory "database" for demo purposes
    users = {
        "admin@agrovault.io": {
            "_id": "demo-admin",
            "name": "Admin Manager",
            "email": "admin@agrovault.io",
            "password": "admin123",
            "role": "warehouse",
        },
        "niket@farm.io": {
            "_id": "demo-consumer",
            "name": "Niket Farmer",
            "email": "niket@farm.io",
            "password": "farmer123",
            "role": "consumer",
        },
    }

    # In-memory inventory store seeded from mock data
    inventory = {item["_id"]: dict(item) for item in MOCK_INVENTORY}

    # --------------------
    # Helper functions
    # --------------------

    def make_token(user_id: str) -> str:
        # For now this is just a dummy opaque token. Frontend only checks presence.
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

        if email in users:
            return jsonify({"message": "User already exists"}), 400

        user_id = str(uuid4())
        user = {
            "_id": user_id,
            "name": name,
            "email": email,
            "password": password,
            "role": role,
        }
        users[email] = user

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

        user = users.get(email)

        # If user doesn't exist yet, auto-create it so any random
        # email/password can log in for demo purposes.
        if not user:
            user_id = str(uuid4())
            user = {
                "_id": user_id,
                "name": (email.split("@")[0] or "User").title(),
                "email": email,
                "password": password,
                "role": "consumer",
            }
            users[email] = user
        else:
            # For demo we keep things simple and just update the password,
            # so any password works once you know the email.
            user["password"] = password

        token = make_token(user["_id"])
        response_user = {k: v for k, v in user.items() if k != "password"}
        return jsonify({"user": response_user, "token": token}), 200

    # --------------------
    # Inventory routes
    # --------------------

    @app.get("/api/inventory")
    def get_inventory():
        category = request.args.get("category")
        items = list(inventory.values())
        if category:
            items = [item for item in items if item.get("category") == category]
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
        inventory[item_id] = new_item
        return jsonify(new_item), 201

    @app.get("/api/inventory/<item_id>")
    def get_inventory_item(item_id: str):
        item = inventory.get(item_id)
        if not item:
            return jsonify({"message": "Item not found"}), 404
        return jsonify(item), 200

    @app.put("/api/inventory/<item_id>")
    def update_inventory_item(item_id: str):
        if item_id not in inventory:
            return jsonify({"message": "Item not found"}), 404
        data = request.get_json(force=True)
        item = inventory[item_id]
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
                item[key] = data[key]
        item["lastChecked"] = current_time_iso()
        inventory[item_id] = item
        return jsonify(item), 200

    @app.delete("/api/inventory/<item_id>")
    def delete_inventory_item(item_id: str):
        if item_id not in inventory:
            return jsonify({"message": "Item not found"}), 404
        deleted = inventory.pop(item_id)
        return jsonify({"deleted": deleted}), 200

    # --------------------
    # Analytics routes
    # --------------------

    @app.get("/api/analytics/dashboard")
    def analytics_dashboard():
        return jsonify(MOCK_DASHBOARD_STATS), 200

    @app.get("/api/analytics/trends")
    def analytics_trends():
        return jsonify(MOCK_ANALYTICS.get("storageTrends", [])), 200

    @app.get("/api/analytics/loss")
    def analytics_loss():
        return jsonify(MOCK_ANALYTICS.get("lossAnalysis", [])), 200

    @app.get("/api/analytics/consumer")
    def analytics_consumer():
        return jsonify(MOCK_CONSUMER_DATA.get("stats", {})), 200

    # --------------------
    # Sensor routes
    # --------------------

    @app.get("/api/sensors/readings")
    def sensor_readings():
        return jsonify(MOCK_SENSOR_READINGS), 200

    @app.get("/api/sensors/alerts")
    def sensor_alerts():
        severity = request.args.get("severity")
        alerts = list(MOCK_ALERTS)
        if severity:
            alerts = [a for a in alerts if a.get("severity") == severity]
        return jsonify(alerts), 200

    @app.get("/api/sensors/silos")
    def sensor_silos():
        return jsonify(MOCK_SILO_STATUS), 200

    @app.put("/api/sensors/alerts/<alert_id>/acknowledge")
    def acknowledge_alert(alert_id: str):
        found = False
        for alert in MOCK_ALERTS:
            if alert["_id"] == alert_id:
                alert["acknowledged"] = True
                alert["acknowledgedAt"] = current_time_iso()
                found = True
                break
        if not found:
            return jsonify({"message": "Alert not found"}), 404
        return jsonify({"message": "Alert acknowledged"}), 200

    # --------------------
    # Logistics & directory (optional extras)
    # --------------------

    @app.get("/api/logistics")
    def logistics():
        return jsonify(MOCK_LOGISTICS), 200

    @app.get("/api/warehouses")
    def warehouses():
        return jsonify(MOCK_WAREHOUSE_DIRECTORY), 200

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
        return jsonify({"status": "ok", "time": current_time_iso()}), 200

    return app


if __name__ == "__main__":
    flask_app = create_app()
    port = int(os.environ.get("PORT", "5000"))
    flask_app.run(host="0.0.0.0", port=port, debug=True)

