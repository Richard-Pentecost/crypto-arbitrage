import React from 'react';
import { Line } from 'react-chartjs-2';

const Dashboard = ({ price, data }) => {
  const opts = {
    tooltips: {
      intersect: false,
      mode: 'index',
    },
    responsive: true,
    maintainAspectRatio: false,
  }

  if (price === "0.00") {
    return <h2>Please select currency pair</h2>;
  }
  
  return (
    <div className='dashboard'>
      <h2>${price}</h2>
      <div className="chart-container">
        <Line data={data} option={opts} />
      </div>
    </div>
  );
};

export default Dashboard;
