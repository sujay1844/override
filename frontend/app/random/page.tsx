'use client';
import React, { useState, useEffect } from "react";
import Chart from "@/lib/Chart";

interface DataPoint {
  index: number;
  value: number;
  ishighlighted: boolean;
}

const App: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([
    { index: 0, value: 0, ishighlighted: false },
    { index: 1, value: 0, ishighlighted: false },
    { index: 2, value: 0, ishighlighted: false },
    { index: 3, value: 0, ishighlighted: false },
    { index: 1, value: 0, ishighlighted: false },
    { index: 2, value: 0, ishighlighted: false },
    { index: 0, value: 0, ishighlighted: false },
    { index: 1, value: 0, ishighlighted: false },
    { index: 2, value: 0, ishighlighted: false },
    { index: 0, value: 0, ishighlighted: false },
    { index: 1, value: 0, ishighlighted: false },
    { index: 2, value: 0, ishighlighted: false },
    { index: 0, value: 0, ishighlighted: false },
    { index: 1, value: 0, ishighlighted: false },
    { index: 2, value: 0, ishighlighted: false },
    { index: 0, value: 0, ishighlighted: false },
    { index: 1, value: 0, ishighlighted: false },
    { index: 2, value: 0, ishighlighted: false },
    { index: 0, value: 0, ishighlighted: false },
    { index: 1, value: 0, ishighlighted: false },
    { index: 2, value: 0, ishighlighted: false },
    { index: 0, value: 0, ishighlighted: false },
    { index: 1, value: 0, ishighlighted: false },
    { index: 2, value: 0, ishighlighted: false },
  ]);


  useEffect(() => {
    const generateDataPoint = () => {
      const newDataPoint: DataPoint = {
        index: data.length,
        value: Math.random() * 100, // Example random value
        ishighlighted: Math.random() > 0.5, // Example random boolean value
      };
      return newDataPoint;
    }
    const addNewDataPoint = () => {
      const newDataPoint = generateDataPoint();

      setData((prevData) => [...prevData.slice(1), newDataPoint]);
    };

    const intervalId = setInterval(addNewDataPoint, 1000); // Add a new point every second

    return () => clearInterval(intervalId);
  }, [data]);

  return (
    <div className="App">
      <Chart data={data} width={800} height={300} />
    </div>
  );
};

export default App;
