import os

from pymongo import MongoClient

_client = None
_db = None


def get_db():
    """Return the agrovault database handle, creating the connection on first call."""
    global _client, _db
    if _db is None:
        uri = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
        _client = MongoClient(uri)
        _db = _client["agrovault"]
    return _db
