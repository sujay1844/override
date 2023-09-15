SERVER_URL = 'http://localhost:8000'

import pandas as pd
import numpy as np

from fastapi import FastAPI
import requests
import asyncio

import time

df = pd.read_csv('train.csv')
len_df = df.shape[0]

frac = 1
idx = 0

async def send_data_periodically():
    while True:
        await asyncio.sleep(1)

        global idx
        if idx >= len_df:
            return

        row = df.iloc[idx].copy()
        row.pressure = row.pressure * frac
        data = {
            "date_time": row.date_time,
            "pressure": row.pressure
        }
        print("sending", row.date_time)
        requests.post(SERVER_URL+'/new', json=data)
        idx += 1

loop = asyncio.get_event_loop()
loop.create_task(send_data_periodically())

app = FastAPI()

@app.get("/ping")
def read_root():
    return {"message": "pong"}

@app.get("/leak")
def leak():
    global frac
    frac = 0.7
    return {"frac": frac}

@app.get("/fix")
def fix():
    global frac
    frac = 1
    return {"frac": frac}