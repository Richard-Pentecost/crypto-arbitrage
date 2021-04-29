import React, { useState, useEffect } from 'react';
import CoinbasePro from 'coinbase-pro';
import classes from '../styles/Home.module.scss';
import config from '../config.json';

const KEY = config.CB_API_KEY;
const SECRET = config.CB_API_SECRET;
const PASSPHRASE = config.CB_API_PASSPHRASE;
const WS_URL = config.CB_WS_URL;

const Home = () => {
  const [coinbasePrice, setCoinbasePrice] = useState('');

  useEffect(() => {
    const websocket = new CoinbasePro.WebsocketClient(
      ['BTC-USD'],
      WS_URL,
      { key: KEY, secret: SECRET, passphrase: PASSPHRASE },
      { channels: ['user', 'hearbeat', 'ticker'] },
    );
    console.log(websocket);
  }, []);

  return (
    <div className={classes.container}>{coinbasePrice}</div>
  );
};

export default Home;
