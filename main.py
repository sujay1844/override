import pandas as pd
import numpy as np

import tensorflow as tf
from tensorflow.keras.models import Sequential

from fastapi import FastAPI
from fastapi import WebSocket, WebSocketDisconnect
from pydantic import BaseModel

class WSManager:
    def __init__(self):
        self.websocket = None

    def set_websocket(self, websocket):
        self.websocket = websocket

    async def send_json(self, data):
        print("sending data")
        if self.websocket:
            await self.websocket.send_json(data)
        else:
            print("No websocket connection")
manager = WSManager()

app = FastAPI()

model = tf.keras.models.load_model('autoencoder.keras')

# From the training data
is_outlier = lambda x: x < 0.35750232411031924 or x > 0.659694164843159

def preprocess(date_time: str, pressure: float):
    date_time = pd.to_datetime(date_time)
    year = date_time.year
    month = date_time.month
    day = date_time.day
    hour = date_time.hour
    day_of_week = date_time.dayofweek
    weekend = date_time.weekday() // 4

    return np.array([pressure, year, month, day, hour, day_of_week, weekend]).reshape(1, -1)

def check_if_outlier(date_time: str, pressure: float, model: Sequential, is_outlier: callable):
    data = preprocess(date_time, pressure)
    pred = model.predict(data)
    error = pred - data
    return is_outlier(error[0, 0])


@app.get("/ping")
async def read_root():
    await manager.send_json({"message": "Hello World"})
    return {"message": "pong"}

class NewData(BaseModel):
    date_time: str
    pressure: float

@app.post("/new")
async def new_data(new_data: NewData):
    date_time = new_data.date_time
    pressure = new_data.pressure
    result = check_if_outlier(date_time, pressure, model, is_outlier)
    output_data = {
        # "index": str(date_time),
        "value": str(pressure),
        "ishighlighted": int(result),
    }
    print(output_data)
    await manager.send_json(output_data)
    
    print(output_data['is_outlier'])

@app.websocket("/dash")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    manager.set_websocket(ws)
    print("Client connected")
    try:
        while True:
            # await manager.send_json({"message": "Hello World"})
            await ws.receive_text()
    except WebSocketDisconnect:
        print("Client disconnected")
        await ws.close()
        manager.set_websocket(None)
    