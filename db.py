from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://sujay:B8BbdtNo0m7H7w9D@cluster0.tg5w5bp.mongodb.net/?retryWrites=true&w=majority"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client['water_leak']
collection = db['sensor_data']

collection.delete_many({})

data = {
    "date_time": "2021-07-24 00:00:00",
    "value": 0.5,
    "ishighlighted": False
}

collection.insert_one(data)