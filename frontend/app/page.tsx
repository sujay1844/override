'use client';
import React, { useState, useEffect, useRef } from "react";
import Chart from "@/lib/Chart";
import Image from "next/image";

interface DataPoint {
    value: number;
    ishighlighted: boolean;
}
const WEBSOCKET_URL = "ws://localhost:8000/dash";
const socket = new WebSocket(WEBSOCKET_URL);

socket.onopen = () => {
    console.log("WebSocket connection established");
}


socket.onclose = () => {
    console.log("WebSocket connection closed");
};

socket.onerror = (error) => {
    console.error("WebSocket error:", error);
}

const App: React.FC = () => {
    const alertRef = useRef<HTMLDivElement>(null);
    const threshold = 12;
    const initialData = [{ value: 0, ishighlighted: false }];
    for (let i = 0; i < 24; i++) {
        initialData.push({ value: 0, ishighlighted: false });
    }
    const [data, setData] = useState<DataPoint[]>(initialData);
    socket.onmessage = (event) => {
        try {
            const newDataPoint: DataPoint = JSON.parse(event.data) as DataPoint;

            setData((prevData) => [...prevData.slice(1), newDataPoint]);

        } catch (error) {
            console.error("Error parsing WebSocket data:", error);
        }
    };

    useEffect(() => {
        // if last threshold values are highlighted then send alert
        const lastThresholdValues = data.slice(-threshold);
        const isHighlighted = lastThresholdValues.every((d) => d.ishighlighted);
        if (isHighlighted) {
            alertRef.current?.classList.remove("hidden");
        } else {
            alertRef.current?.classList.add("hidden");
        }
    }, [data])

    return (
        <div className="flex flex-col justify-center items-center">
            <h1 className="text-5xl p-5">Water leak detector</h1>
            <div className="flex justify-center items-center">
                <Chart data={data} width={800} height={300} />
            </div>
            <div ref={alertRef} className="flex flex-row flashing-element bg-red-700 text-white p-5 text-6xl rounded-md items-center justify-center gap-3 hidden">
                <Image src="/warning-sign-white.svg" alt="Warning" width={80} height={80} />
                <p>Leak detected</p>
            </div>
            <div className="flex flex-row gap-5">
                <button className="border border-black p-2 rounded-xl bg-blue-300" onClick={async () => {
                    await fetch("http://localhost:4000/leak")
                }}>Simulate leak</button>
                <button className="border border-black p-2 rounded-xl bg-blue-300" onClick={async () => {
                    await fetch("http://localhost:4000/fix")
                }}>Fix leak</button>

            </div>
        </div>
    );
};

export default App;
