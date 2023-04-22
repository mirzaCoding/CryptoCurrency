import React, { useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Bar, BarChart, Tooltip } from 'recharts';
import moment from 'moment';

function Chart({vName}) {
  const [coinList, setCoinList] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState('');
  const [selectedCoinName, setSelectedCoinName] = useState('');
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState('line');
  const [dateRange, setDateRange] = useState({ start: moment().subtract(1, 'month'), end: moment() });
  // const ] = useState('USD');

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/coins/list')
      .then(response => response.json())
      .then(data => {
        setCoinList(data);
        setSelectedCoin(data[0].id);
      });
  }, []);

  useEffect(() => {
    const startDate = moment(dateRange.start).unix();
    const endDate = moment(dateRange.end).unix();

    if (selectedCoin) {
      fetch(`https://api.coingecko.com/api/v3/coins/${selectedCoin}/market_chart/range?vs_currency=${vName}&from=${startDate}&to=${endDate}`)
        .then(response => response.json())
        .then(data => {
          const chartData = data.prices.map(price => {
            const [timestamp, priceValue] = price;
            const date = new Date(timestamp);
            return { date, price: priceValue };
          });
          setChartData(chartData);
        });
    }

  }, [selectedCoin, dateRange, vName]);

  const handleCoinChange = (event) => {
    const selectedCoinId = event.target.value;
    setSelectedCoin(selectedCoinId);

    const selectedCoinObj = coinList.find(coin => coin.id === selectedCoinId);
    setSelectedCoinName(selectedCoinObj ? selectedCoinObj.name : '');
  };

  const handleDateRangeChange = (event) => {
    const range = event.target.value;

    switch (range) {
      case '1day':
        setDateRange({ start: moment().subtract(1, 'day'), end: moment() });
        break;
      case '1week':
        setDateRange({ start: moment().subtract(1, 'week'), end: moment() });
        break;
      case '1month':
        setDateRange({ start: moment().subtract(1, 'month'), end: moment() });
        break;
      case '1year':
        setDateRange({ start: moment().subtract(1, 'year'), end: moment() });
        break;
      default:
        setDateRange({ start: moment().subtract(1, 'month'), end: moment() });
        break;
    }
  };

  const handleSelectChange = (e) => {
    setChartType(e.target.value);
  };

  return (
    <div>
      <div className='d-flex justify-content-between me-1 mt-2 ms-2'>
        <div>
          <h4><b style={{ color: "blue", width: "10px", height: "10px", borderRadius: '10px' }}>.</b>{vName}</h4>
        </div>
        <div className='d-flex'>
          <select onChange={handleDateRangeChange} className="form-select form-select-lg mb-3" style={{ width: "120px" }}>
            <option value="1day">1 day</option>
            <option value="1week">1 week</option>
            <option value="1month">1 month</option>
            <option value="1year">1 year</option>
          </select>
          <select value={selectedCoin} onChange={handleCoinChange} class="form-select form-select-lg mb-3 ms-2" style={{ width: "120px" }}>
            <option>Cryptocurrency</option>
            {coinList && coinList.map((coin) => (
              <option key={coin.id} value={coin.id}>
                {coin.name}
              </option>
            ))}
          </select>
          <select value={chartType} onChange={handleSelectChange} class="form-select form-select-lg mb-3 ms-2" style={{ width: "150px" }} >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="horizontalBar">Horizontal Bar Chart</option>
          </select>
        </div>
      </div>

      <div className='d-flex justify-content-end me-4' style={{ color: "blue" }}>
        <h5> {selectedCoinName}</h5>
      </div>




      {chartType === 'line' ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart width={0} height={0} data={chartData}>
            <Line type="monotone" dataKey="price" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" tickFormatter={(unixTime) => moment.unix(unixTime).format("MMM")} />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      ) : chartType === 'bar' ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart width={0} height={0} data={chartData}>
            <XAxis dataKey="date" tickFormatter={(unixTime) => moment.unix(unixTime).format("MMM YYYY")} />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Bar dataKey="price" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width='100%' height={400}>
          <BarChart layout="vertical" data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="date" tickFormatter={(unixTime) => moment.unix(unixTime).format(" DD MMMM")} type="category" />
            <Tooltip />
            <Bar dataKey="price" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      )}


    </div>
  )
}
export default Chart