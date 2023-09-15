'use client';
import React, { useState, useEffect } from "react";
import Chart from "@/lib/Chart";

interface DataPoint {
    value: number;
    ishighlighted: boolean;
}


const App: React.FC = () => {
    const [data, setData] = useState<DataPoint[]>([
        {  value: 0, ishighlighted: false },
        {  value: 0, ishighlighted: false },
        {  value: 0, ishighlighted: false },
        {  value: 0, ishighlighted: false },
        {  value: 0, ishighlighted: false },
        {  value: 0, ishighlighted: false },
        {  value: 0, ishighlighted: false },
        {  value: 0, ishighlighted: false },
        {  value: 0, ishighlighted: false },
        {  value: 0, ishighlighted: false },
        {  value: 0, ishighlighted: false },
        {  value: 0, ishighlighted: false },
        {  value: 0, ishighlighted: false },
        {  value: 0, ishighlighted: false },
        {  value: 0, ishighlighted: false },
        {  value: 0, ishighlighted: false },
        {  value: 0, ishighlighted: false },
        {  value: 0, ishighlighted: false },
        {  value: 0, ishighlighted: false },
        {  value: 0, ishighlighted: false },
        {  value: 0, ishighlighted: false },
        {  value: 0, ishighlighted: false },
        {  value: 0, ishighlighted: false },
        {  value: 0, ishighlighted: false },
        // Initialize with some initial data points
    ]);
    const WEBSOCKET_URL = "ws://localhost:8000/dash"; // Replace with your WebSocket server URL
    useEffect(() => {
        const socket = new WebSocket(WEBSOCKET_URL);

        socket.onopen = () => {
            console.log("WebSocket connection established");
        }

        socket.onmessage = (event) => {
            // Parse and handle incoming data from the WebSocket server
            try {
                const newDataPoint: DataPoint = JSON.parse(event.data) as DataPoint;

                setData((prevData) => [...prevData.slice(1), newDataPoint]);

                // socket.send("data received");
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

    return (
        <div className="App">
            <Chart data={data} width={800} height={300} />
        </div>

    );
};

export default App;
