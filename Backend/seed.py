"""
Seed script — populates the agrovault MongoDB database from mock_data.py.

Usage:
    python seed.py

Idempotent: drops each collection before inserting.
"""

import os
import sys

from dotenv import load_dotenv
from pymongo import MongoClient, ASCENDING
from werkzeug.security import generate_password_hash

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

uri = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(uri)
db = client["agrovault"]

# ── helpers ──────────────────────────────────────────────────────────────────

def seed_collection(name, docs):
    """Drop then insert a list of documents."""
    db.drop_collection(name)
    if docs:
        db[name].insert_many(docs)
    print(f"  {name}: {len(docs)} docs")


def seed_single_doc(name, doc, doc_id="current"):
    """Drop then insert a single document with a fixed _id."""
    db.drop_collection(name)
    doc_copy = dict(doc)
    doc_copy["_id"] = doc_id
    db[name].insert_one(doc_copy)
    print(f"  {name}: 1 doc (_id={doc_id!r})")


# ── seed ─────────────────────────────────────────────────────────────────────

def main():
    print("Seeding agrovault database...")

    # Users (demo accounts with hashed passwords)
    demo_users = [
        {
            "_id": "demo-admin",
            "name": "Admin Manager",
            "email": "admin@agrovault.io",
            "password": generate_password_hash("admin123"),
            "role": "warehouse",
        },
        {
            "_id": "demo-consumer",
            "name": "Niket Farmer",
            "email": "niket@farm.io",
            "password": generate_password_hash("farmer123"),
            "role": "consumer",
        },
    ]
    seed_collection("users", demo_users)

    # Inventory
    seed_collection("inventory", [dict(d) for d in MOCK_INVENTORY])

    # Alerts
    seed_collection("alerts", [dict(d) for d in MOCK_ALERTS])

    # Sensor readings — single document
    seed_single_doc("sensor_readings", MOCK_SENSOR_READINGS)

    # Silo status — uses "id" not "_id", so store as-is (Mongo auto-adds _id)
    seed_collection("silo_status", [dict(d) for d in MOCK_SILO_STATUS])

    # Single-doc collections
    seed_single_doc("dashboard_stats", MOCK_DASHBOARD_STATS)
    seed_single_doc("analytics", MOCK_ANALYTICS)
    seed_single_doc("consumer_data", MOCK_CONSUMER_DATA)
    seed_single_doc("logistics", MOCK_LOGISTICS)

    # Warehouses — preserve string _id
    seed_collection("warehouses", [dict(d) for d in MOCK_WAREHOUSE_DIRECTORY])

    # ── indexes ──────────────────────────────────────────────────────────────
    print("\nCreating indexes...")
    db.users.create_index("email", unique=True)
    db.inventory.create_index("category")
    db.alerts.create_index("severity")
    print("  users.email (unique)")
    print("  inventory.category")
    print("  alerts.severity")

    print(f"\nDone — 10 collections seeded in '{db.name}'.")


if __name__ == "__main__":
    main()
