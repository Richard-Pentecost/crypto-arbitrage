import { useState, useRef, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './Home';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
import Layout from '../components/Layout';
import Dashboard from '../components/Dashboard';
import { formatData } from '../utils/formatData';
import '../styles/App.scss';

function App() {
  const [currencies, setCurrencies] = useState([]);
  const [pair, setPair] = useState('');
  const [price, setPrice] = useState('0.00');
  const [pastData, setPastData] = useState({});

  const ws = useRef(null);

  let first = useRef(false);
  const url = 'https://api.pro.coinbase.com';

  useEffect(() => {
    ws.current = new WebSocket("wss://ws-feed.pro.coinbase.com");
    let pairs = [];

    const apiCall = async () => {
      await fetch(url + "/products")
        .then(res => res.json())
        .then(data => pairs = data);

      let filtered = pairs.filter(pair => pair && pair.quote_currency === 'USD');

      filtered = filtered.sort((a, b) => {
        if (a.base_currency < b.base_currency) {
          return -1;
        }
        if (a.base_currency > b.base_currency) {
          return 1;
        }
        return 0;
      });

      setCurrencies(filtered);

      first.current = true;
    };
    apiCall();
  }, []);

  useEffect(() => {
    if (!first.current) {
      console.log('returning on first render');
      return;
    }

    console.log('running pair change');
    const msg = {
      type: 'subscribe',
      product_ids: [pair],
      channels: ['ticker'],
    };
    ws.current.send(JSON.stringify(msg));

    let historicalDataUrl = `${url}/products/${pair}/candles?granularity=86400`;
    const fetchHistoricalData = async () => {
      let dataArr = [];
      await fetch(historicalDataUrl)
        .then(res => res.json())
        .then(data => dataArr = data);
      let formattedData = formatData(dataArr);
      setPastData(formattedData);
    };


    fetchHistoricalData();

    ws.current.onmessage = event => {
      const data = JSON.parse(event.data);
      if (data.type !== 'ticker') {
        console.log('non ticker event', event);
        return;
      };
      // console.log(data);
      if (data.product_id === pair) {
        setPrice(data.price);
      }
    };
  }, [pair]);

  const handleSelect = event => {
    const unsubMsg = {
      type: 'unsubscribe',
      product_ids: [pair],
      channels: ['ticker'],
    };
    ws.current.send(JSON.stringify(unsubMsg));

    setPair(event.target.value);
  };  

  return (
    <div className='App'>
      {
        <select name='currency' value={pair} onChange={handleSelect}>
          {currencies.map((cur, idx) => {
              return <option key={idx} value={cur.id}>{cur.display_name}</option>
          })}
        </select>
      }
      <Dashboard price={price} data={pastData} />
    </div>
  )

  // const [coinbasePrice, setCoinbasePrice] = useState('');

  // useEffect(() => {
    
  //   setCoinbasePrice(response.spot);
  // }, []);

  // return (
  //   <div className="App">
  //     <Layout>
  //       <Switch>
  //         <Route exact path='/' component={Home} />
  //       </Switch>
  //     </Layout>
  //   </div>
  // );
}

export default App;
