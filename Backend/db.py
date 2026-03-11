import os
import logging
from pymongo import MongoClient

_client = None
_db = None

class MockCollection:
    def __init__(self, name):
        self.name = name
        self._data = {}

    def find_one(self, query):
        for item in self._data.values():
            if all(item.get(k) == v for k, v in query.items()):
                return item
        return None

    def insert_one(self, document):
        doc_id = document.get("_id", str(len(self._data)))
        self._data[doc_id] = document
        return type('obj', (object,), {'inserted_id': doc_id})

    def find(self, query=None):
        if not query:
            return list(self._data.values())
        results = []
        for item in self._data.values():
            if all(item.get(k) == v for k, v in query.items()):
                results.append(item)
        return results

    def find_one_and_update(self, query, update, return_document=True):
        item = self.find_one(query)
        if item and "$set" in update:
            item.update(update["$set"])
            return item
        return None

    def find_one_and_delete(self, query):
        item = self.find_one(query)
        if item:
            del self._data[item["_id"]]
            return item
        return None
    
    def update_one(self, query, update):
        item = self.find_one(query)
        if item and "$set" in update:
            item.update(update["$set"])
            return type('obj', (object,), {'matched_count': 1})
        return type('obj', (object,), {'matched_count': 0})

    def update_many(self, query, update):
        items = self.find(query)
        for item in items:
            if "$set" in update:
                item.update(update["$set"])
        return type('obj', (object,), {'matched_count': len(items)})

    def delete_many(self, query):
        items = self.find(query)
        for item in items:
            del self._data[item["_id"]]
        return type('obj', (object,), {'deleted_count': len(items)})

class MockDB:
    def __init__(self):
        self._collections = {}

    def __getattr__(self, name):
        if name not in self._collections:
            self._collections[name] = MockCollection(name)
        return self._collections[name]

    def command(self, cmd):
        if cmd == "ping":
            return {"ok": 1.0}
        return {}

def get_db():
    """Return the agrovault database handle, creating the connection on first call."""
    global _client, _db
    if _db is None:
        uri = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
        try:
            # Try to connect with a short timeout
            _client = MongoClient(uri, serverSelectionTimeoutMS=2000)
            _client.server_info() # Force connection check
            _db = _client["agrovault"]
            logging.info("Connected to MongoDB at %s", uri)
        except Exception as e:
            logging.warning("Could not connect to MongoDB, using Mock Database: %s", e)
            _db = MockDB()
            
            # Application will start with empty collections
            logging.info("Mock Database initialized (empty).")
                
    return _db
