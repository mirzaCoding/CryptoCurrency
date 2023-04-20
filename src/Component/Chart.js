import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Bar, BarChart, Tooltip } from 'recharts';
import moment from 'moment';
// import ticker from 'ticker'

function Chart() {
  const [coinList, setCoinList] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [selectedCoinName, setSelectedCoinName] = useState('');
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState('line')
  const [dateRange, setDateRange] = useState({ start: moment().subtract(1, 'month'), end: moment() });
  // 
  const [isTickerRunning, setIsTickerRunning] = useState([]);

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
      fetch(`https://api.coingecko.com/api/v3/coins/${selectedCoin}/market_chart/range?vs_currency=usd&from=${startDate}&to=${endDate}`)
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
    startTicker();
    return () => {
      stopTicker();
    };
  }, [selectedCoin, dateRange]);

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
    setChartType(e.target.value)
  }


  useEffect(() => {
    const intervalId = setInterval(() => {
      // your ticker logic here
    }, 1000);
    return () => clearInterval(intervalId);
  }, [isTickerRunning]);

  const startTicker = useCallback(() => {
    if (!isTickerRunning) {
      setIsTickerRunning(true);
    }
  }, [isTickerRunning]);

  const stopTicker = useCallback(() => {
    if (isTickerRunning) {
      setIsTickerRunning(false);
    }
  }, [isTickerRunning]);


  return (
    <div>

      <div className='d-flex justify-content-end me-1 mt-2' >

        <select onChange={handleDateRangeChange} class="form-select form-select-lg mb-3" style={{ width: "120px" }}>
          <option value="1day">1 day</option>
          <option value="1week">1 week</option>
          <option value="1month">1 month</option>
          <option value="1year">1 year</option>
        </select>
        <select value={selectedCoin} onChange={handleCoinChange} class="form-select form-select-lg mb-3 ms-2" style={{ width: "120px" }}>
          <option>Cryptocurrency</option>
          {coinList.map((coin) => (
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
            <YAxis dataKey="date" tickFormatter={(unixTime) => moment.unix(unixTime).format("MMM YYYY")} type="category" />
            <Tooltip />
            <Bar dataKey="price" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      )}


    </div>
  )
}
export default Chart