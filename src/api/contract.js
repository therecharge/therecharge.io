import { APICore } from './index';
import axios from 'axios';

const api = new APICore();

export const getAllContracts = async () => {
  return await api.get('/blockchain/contracts?enabled=true').then((resp) => resp.data.data);
};

export const getRcgUsd = async () => {
  return await axios
    .get('https://api.coingecko.com/api/v3/coins/recharge')
    .then((resp) => resp.data.market_data.current_price.usd)
    .catch((err) => {
      return 0;
    });
};

export const getPenUsd = async () => {
  return await axios
    .get('https://api.coingecko.com/api/v3/coins/protocon')
    .then((resp) => resp.data.market_data.current_price.usd)
    .catch((err) => {
      return 0;
    });
};

export const getAssaplayUsd = async () => {
  return await axios
    .get('https://api.coingecko.com/api/v3/coins/assaplay')
    .then((resp) => resp.data.market_data.current_price.usd)
    .catch((err) => {
      return 0;
    });
};

export const getKusUsd = async () => {
  return await axios
    .get('https://api.coingecko.com/api/v3/coins/kuswap')
    .then((resp) => resp.data.market_data.current_price.usd)
    .catch((err) => {
      return 0;
    });
}
