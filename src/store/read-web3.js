import { atom } from "recoil";
import Web3 from "web3";

const NETWORKS = require("../lib/networks.json");

let Web3_Reader = {
  ERC: new Web3(NETWORKS["mainnet"].network["ERC"].rpcUrls[0]),
  HRC: new Web3(NETWORKS["mainnet"].network["HRC"].rpcUrls[0]),
  BEP: new Web3(NETWORKS["mainnet"].network["BEP"].rpcUrls[0]),
};

export const web3ReaderState = atom({
  key: "web3Reader",
  default: Web3_Reader,
  dangerouslyAllowMutability: true,
});
