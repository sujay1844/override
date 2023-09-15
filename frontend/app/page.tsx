'use client';
import React, { useState, useEffect } from "react";
import Chart from "@/lib/Chart";

interface DataPoint {
    value: number;
    ishighlighted: boolean;
}

const App: React.FC = () => {
    const threshold = 12;
    const initialData = [{ value: 0, ishighlighted: false }];
    for(let i = 0; i < 24; i++) {
        initialData.push({ value: 0, ishighlighted: false });
    }
    const [data, setData] = useState<DataPoint[]>(initialData);
    const WEBSOCKET_URL = "ws://localhost:8000/dash";
    useEffect(() => {
        const socket = new WebSocket(WEBSOCKET_URL);

        socket.onopen = () => {
            console.log("WebSocket connection established");
        }

        socket.onmessage = (event) => {
            try {
                const newDataPoint: DataPoint = JSON.parse(event.data) as DataPoint;

                setData((prevData) => [...prevData.slice(1), newDataPoint]);

            } catch (error) {
                console.error("Error parsing WebSocket data:", error);
            }
        };

        socket.onclose = () => {
            console.log("WebSocket connection closed");
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        }
        return () => {
            socket.close();
        }
    });

    useEffect(() => {
        // if last threshold values are highlighted then send alert
        const lastThresholdValues = data.slice(-threshold);
        const isHighlighted = lastThresholdValues.every((d) => d.ishighlighted);
        if (isHighlighted) {
            alert("Leak detected!");
        }
    }, [data])

    return (
        <div className="App">
            <Chart data={data} width={800} height={300} />
        </div>
    );
};

export default App;
