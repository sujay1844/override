'use client'
import React, { useState, useEffect } from 'react';

const URL = "http://localhost:8000/data";

interface Data {
    date_time: string;
    value: number;
    ishighlighted: boolean;
}

export default function DataEntry() {
    const [data, setData] = useState<Data[]>([]);

    useEffect(() => {
        fetch(URL)
            .then((response) => response.json())
            .then((data) => setData(data))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Data</h1>
            <div className="grid grid-cols-1 gap-2">
                {data.map((d) => (
                    <div
                        key={d.date_time}
                    className={`p-2 border rounded-lg flex flex-row gap-5 ${
                            d.ishighlighted
                                ? 'bg-red-700 text-white'
                                : 'bg-gray-200'
                        }`}
                    >
                        <p className="font-semibold">{d.date_time}</p>
                        <p className="text-lg">{d.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
