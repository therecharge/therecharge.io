import { APICore } from "./index";
import axios from "axios";

const api = new APICore();

export const getAllContracts = async () => {
  return await api.get("/blockchain/contracts?enabled=true").then((resp) => resp.data.data);
};

export const getCoingecko = async () => {
  return await axios.get('https://api.coingecko.com/api/v3/coins/recharge').then(resp => resp.data.market_data.current_price.usd);
}

