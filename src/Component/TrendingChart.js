import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell } from 'recharts'
// import {format} from 'date-fns'
// import { getCryptoData } from './Api'
import axios from 'axios';



const TrendingChart = () => {
  const [coinData, setCoinData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/search/trending`
      );
      const top3Coins = response.data.coins.slice(0, 3)// Get only the top 3 coins
      setCoinData(top3Coins);
      console.log(top3Coins)
    };
    fetchData();
  }, []);
  return (
    <div className='row'>
      <div className='col-8'>
      <h2>Top 3 Trending Coins by Market Cap Rank</h2>
      <div className=' d-flex justify-content-between' >
        <div className=' mb-4 ' style={{}}>
          <PieChart width={300} height={300}>
            <Pie
              data={coinData}

              dataKey="item.market_cap_rank"
              nameKey="item.name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label={(entry) => entry.item.market_cap_rank}
            >
              {coinData.map((entry, index) => (
                <Cell key={`cell-${index.market_cap_rank}`} fill={index === 0 ? '#0088FE' : index === 1 ? '#00C49F' : '#FFBB28'} />
              ))}
            </Pie>
            
          </PieChart>
        </div>
        <div className=' mt-3 ms-4'>
          {coinData && coinData.map((col, index) => {
            return (
              <ul key={`list-${index}`}>
                <li style={{ color: index === 0 ? '#0088FE' : index === 1 ? '#00C49F' : '#FFBB28' }}>
                  {col.item.name} 
                 
                </li>
              </ul>
            )
          })}
          </div>
        </div>
      </div>
    </div>
  );
}
export default TrendingChart