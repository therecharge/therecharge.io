// 해당 도메인의 목표는 '컨트랙트에 접근하여 Read/Write하는 것'이다.
// 컨트랙트에 접근하려면 무엇이 필요한가? provider
// 어떤 정보를 알 수 있는가? networkId, account
// 토스트 띄울 수 있어야 하니까. 토스트 세팅하는 아톰도 있어야 한다.
// const { atom } = require("recoil");
import { async } from "@aragon/ui/dist/ToastHub";
import { atom } from "recoil";
import Web3 from "web3";
const ERC20_ABI = require("../Component/Desktop/Defi/abis/ERC20ABI.json");

const ETH = new Web3("https://mainnet.infura.io/v3/636c3521d0f648d5b1789cd9388a182f");
const BNB = new Web3("https://bsc-dataseed.binance.org/");
const HECO = new Web3("https://http-mainnet.hecochain.com");

let ethInstance = new ETH.eth.Contract(ERC20_ABI, "0xb6Ea0d1C92700b3Dc95dB19183DE95dF76994f37");
let ethMethods = ethInstance.methods;
let bepInstance = new BNB.eth.Contract(ERC20_ABI, "0xf88bf2a6af4255EE9862B1aC8891402F6d0952EC");
let bepMethods = bepInstance.methods;
let ethPools, bepPools, hecPools

const loadPools = async () => {
  ethPools = await ethMethods;

  // console.log("Get ethereum pools from contract :", ethMethods);

  console.log(ethPools)

  // console.log("Get binanceChain pools from contract :", bepMethods);
}

loadPools();


export const web3State = atom({
  key: "web3",
  default: undefined,
  dangerouslyAllowMutability: true,
});
export const providerState = atom({
  key: "provider",
  default: undefined,
  dangerouslyAllowMutability: true,
});
export const accountState = atom({
  key: "account",
  default: undefined,
});
export const networkState = atom({
  key: "network",
  default: undefined,
});
export const requireNetworkState = atom({
  key: "requireNetwork",
  default: 0x1,
});
