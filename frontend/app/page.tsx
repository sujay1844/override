'use client'
import React, { useState, useEffect } from 'react';
import Chart from '@/lib/Chart';

function App() {
  const width = 1000;
  const height = 500;
  const [data, setData] = useState<number[]>([10, 20, 15, 25, 30, 45, 40, 50, 60, 50, 40, 30, 20, 10]);

  const updateData = () => {
    // Remove the oldest entry and append a new entry
    setData(prevData => {
      const newData = prevData.slice(1); // Remove the first element
      const newValue = Math.random() * 20 + 10; // Generate a new value
      newData.push(newValue); // Append the new value
      return newData;
    });
  };

  useEffect(() => {
    // Update the data every second (for example)
    const interval = setInterval(updateData, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <Chart data={data} width={width} height={height}/>
    </div>
  );
}

export default App;
