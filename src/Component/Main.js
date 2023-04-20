import { Line, LineChart, XAxis, BarChart, Bar, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment'
import DatePicker from "react-datepicker"
// import ChartSelector from './ChartSelector'

const coins = [
  { name: 'Bitcoin', value: 'bitcoin' },
  { name: 'Ethereum', value: 'ethereum' },
  { name: 'Polygon', value: 'polygon' },
  { name: 'Binance Coin', value: 'binancecoin' },
  { name: 'BNB', value: 'bnb' },
  { name: 'USD Coin', value: 'usdcoin' },
  { name: 'Lido Staked Ether', value: 'Lidostakedethr' },
  { name: 'XRP', value: 'xrp' },
  { name: 'Tether', value: 'tether' }
];



const Main = (props) => {
  const [dateRange, setDateRange] = useState({
    start: moment().subtract(7, 'days').toDate(),
    end: moment().toDate()
  });
  const [formattedData, setFormattedData] = useState([]);
  const [coinNames, setCoinNames] = useState(['bitcoin']);
  const [timeRange, setTimeRange] = useState('week');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCoin, setSelectedCoin] = useState('');
  const [chartType, setChartType] = useState('line');
  useEffect(() => {

    axios.get(`https://api.coingecko.com/api/v3/coins/${coinNames[0]}/market_chart/range?vs_currency=${selectedCoin}&from=${moment(dateRange.start).unix()}&to=${moment(dateRange.end).unix()}`)
      .then(res => {
        const formattedData = res.data.prices.map(price => {
          return {
            date: moment(price[0]).format('MMM YYYY'),
            price: price[1]
          };
        });
        setFormattedData(formattedData);
      })
      .catch(err => console.log(err));
  }, [coinNames, dateRange]);


  // const handleSearchInputChange = (event) => {
  //   setSearchQuery(event.target.value);
  // }


  // const handleCoinSelectionChange = (event) => {
  //   setSelectedCoin(event.target.value);
  // }


  // const onChangeHandler = (e) => {
  // setSearch(e.target.value)
  // }




  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    const endDate = moment().toDate();
    let startDate = null;
    switch (range) {
      case 'day':
        startDate = moment().subtract(1, 'day').toDate();
        break;
      case 'week':
        startDate = moment().subtract(7, 'days').toDate();
        break;
      case 'month':
        startDate = moment().subtract(1, 'month').toDate();
        break;
      case 'year':
        startDate = moment().subtract(1, 'year').toDate();
        break;
      default:
        startDate = moment().subtract(7, 'days').toDate();
        break;
    }
    setDateRange({ start: startDate, end: endDate });
  };


  const handleSelectChange = (event) => {
    setChartType(event.target.value);
  };



  return (
    <div>



      <div className='row d-flex'>
        <div className='col-md-2 mb-1 mt-1'>
          {/* <select value={selectedCoin} onChange={handleCoinSelectionChange}>
            {coinNames.map((coinName) => (
              <option key={coinName} onChange={handleCoinSelectionChange} value={coinName}>{coinName}</option>
            ))}
          </select> */}
          {/* <button onClick={() => coins(selectedCoin, dateRange)}>Search</button> */}
        </div>
        <div className='col-md-10 mb-1 mt-1'>
          {/* <form  >
           <input type="text" value={searchQuery} onChange={handleSearchInputChange} /> 
          </form> */}
        </div>
        <div>
        </div>
      </div>

      <div className='d-flex justify-content-end'>
        <div className='me-2'>
          <select value={timeRange} class="form-select form-select-sm" onChange={(e) => handleTimeRangeChange(e.target.value)}>
            <option value="day">1 day</option>
            <option value="week">1 week</option>
            <option value="month">1 month</option>
            <option value="year">1 year</option>
          </select>
        </div>

        {/* <div className='d-flex '>
          <label className='d-flex'>Start Date:
            <DatePicker selected={dateRange.start} style={{ border: "1px solid grey", borderRadius: "5px" }} onChange={date => setDateRange({ ...dateRange, start: date })} />
          </label>
          <label className='d-flex ms-2'>End Date:
            <DatePicker selected={dateRange.end} onChange={date => setDateRange({ ...dateRange, end: date })} />
          </label>
        </div> */}

        <div className='col-md-2'>
        </div>
      </div>
      <div>
        <div className='d-flex'><h5>{coins.find(c => c.value === coinNames[0]).name}</h5></div>
        <select value={chartType} onChange={handleSelectChange}>
          <option value="line">Line Chart</option>
          <option value="bar">Bar Chart</option>
        </select>
        {chartType === 'line' ? (
          <LineChart width={800} height={400} data={formattedData}>
            <XAxis dataKey="date" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#8884d8" />
          </LineChart>
        ) : (
          <BarChart width={800} height={400} data={formattedData}>
            <XAxis dataKey="date" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Bar dataKey="price" fill="#8884d8" />
          </BarChart>
        )}
      </div>
    </div>
  );
};

export default Main;