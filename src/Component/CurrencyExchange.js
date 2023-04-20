import { useState, useEffect } from 'react';

function CurrencyExchange() {
  const [cryptoData, setCryptoData] = useState([]);
  const [nationalCurrency, setNationalCurrency] = useState('usd');
  const [convertedNationalCurrency, setConvertedNationalCurrency] = useState('eur');
  const [cryptoAmount, setCryptoAmount] = useState('');

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`https://api.coingecko.com/api/v3/exchange_rates`);
      const data = await response.json();
      setCryptoData(data.rates);
    }
    fetchData();
  }, []);

  function handleCryptoAmountChange(e) {
    setCryptoAmount(e.target.value);
  }

  function calculateNationalCurrencyAmount() {
    if (cryptoAmount && cryptoData[nationalCurrency] && cryptoData[convertedNationalCurrency]) {
      const exchangeRate = cryptoData[convertedNationalCurrency].value / cryptoData[nationalCurrency].value;
      return cryptoAmount * exchangeRate;
    } else {
      return '';
    }
  }

  function handleConvertedNationalCurrencyChange(e) {
    setConvertedNationalCurrency(e.target.value);
  }

  //   function handleCryptoAmountChangee(e){
  //     setCryptoAmount(e.target.value)
  //   }

  return (
    <div>
      <h1> Exchange Rates</h1>
      <div>
        <label className='d-flex me-3' style={{ color: "orange" }}>
          Sell:
          <select value={nationalCurrency} class="form-select form-select-lg ms-2 mb-2" style={{ width: "80px", backgroundColor: 'grey' }} onChange={(e) => setNationalCurrency(e.target.value)}>
            {Object.entries(cryptoData).map(([currency, data]) => (
              <option className='me-3' key={currency} value={currency}>
                {`${currency.toUpperCase()} (${data.name})`}
              </option>
            ))}
          </select>
          <input className='ms-2' type="number" value={cryptoAmount} style={{ width: "80px" }} onChange={handleCryptoAmountChange} />
        </label>
        <div className='d-flex me-3 '>

          <label className='d-flex me-3 mb-3 ' style={{ color: "green" }}> Buy:
            <select value={convertedNationalCurrency} class="form-select form-select-lg ms-2" style={{height:"50px", width:'80px', backgroundColor: 'grey' }} onChange={handleConvertedNationalCurrencyChange}>
              {Object.entries(cryptoData).map(([currency, data]) => (
                <option key={currency} value={currency}>
                  {`${currency.toUpperCase()} (${data.name})`}
                </option>
              ))}
            </select>
            <p className='ms-2' style={{ width: "80px" }}>{`${calculateNationalCurrencyAmount()} ${convertedNationalCurrency.toUpperCase()}`}</p>
          </label>

        </div>
      </div>
    </div>
  );
}

export default CurrencyExchange;