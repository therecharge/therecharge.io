import React from "react";
import styled from "styled-components";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
//store
import { useRecoilState } from "recoil";
import {
  web3State,
  providerState,
  accountState,
  networkState,
  requireNetworkState,
} from "../../../store/web3";

function ConnectWallet({ text = "Wallet Connect" }) {
  const [web3, setWeb3] = useRecoilState(web3State);
  const [provider, setProvder] = useRecoilState(providerState);
  const [account, setAccount] = useRecoilState(accountState);
  const [network, setNetwork] = useRecoilState(networkState);
  const [requireNetwork] = useRecoilState(requireNetworkState);

  /* Setting WalletConnect */
  const providerOptions = {
    metamask: {
      id: "injected",
      name: "MetaMask",
      type: "injected",
      check: "isMetaMask",
    },
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        rpc: {
          128: "https://http-mainnet.hecochain.com",
          256: "https://http-testnet.hecochain.com",
        },
        infuraId: "3fc11d1feb8944229a1cfba7bd62c8bc", // Required
        network: "mainnet",
        qrcodeModalOptions: {
          mobileLinks: [
            "rainbow",
            "metamask",
            "argent",
            "trust",
            "imtoken",
            "pillar",
          ],
        },
      },
    },
  };
  let web3Modal = new Web3Modal({
    // network: "mainnet",
    // network: "ropsten",
    cacheProvider: true,
    providerOptions,
  });

  function changeNetwork() {
    console.log("Change!");
    let rpc = {
      0x80: {
        id: 1,
        jsonrpc: "2.0",
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x80",
            chainName: "Heco Chain",
            rpcUrls: ["https://http-mainnet.hecochain.com"],
            nativeCurrency: {
              name: "HT",
              symbol: "HT",
              decimals: 18,
            },
            blockExplorerUrls: ["https://hecoinfo.com/"],
          },
        ],
      },
    };
    window.ethereum.request(rpc[requireNetwork]);
  }
  async function onDisconnect(event) {
    if (!event && web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    await web3Modal.clearCachedProvider();
  }

  function connectEventHandler(provider) {
    if (!provider.on) {
      return;
    }
    provider.on("open", async (info) => {
      console.log("info", info);
    });
    provider.on("accountsChanged", async (accounts) => {
      console.log(accounts);
      setAccount(accounts[0]);
    });
    provider.on("chainChanged", async (chainId) => {
      console.log(chainId);
      setNetwork(chainId);
    });
    provider.on("disconnect", async (error) => {
      onDisconnect(true);
    });
  }
  function isChainCorrect() {
    // console.log(network, requireNetwork);
    return network == requireNetwork;
  }
  async function connect() {
    // console.log("Connect!");
    let provider = await web3Modal.connect();
    setProvder(provider);
    const web3 = new Web3(provider);
    setWeb3(web3);
    const accounts = await web3.eth.getAccounts();
    const network = await web3.eth.getChainId();
    setAccount(accounts[0]);
    setNetwork(network);

    connectEventHandler(provider);
  }
  function getAccount() {
    if (!isChainCorrect()) return "Wrong Network";
    // console.log(network, requireNetwork);
    let ret = account.slice(0, 8) + "..." + account.slice(-6);
    return ret;
  }
  return (
    <Button
      onClick={() =>
        account && !isChainCorrect() ? changeNetwork() : connect()
      }
    >
      <span className="Roboto_30pt_Black">{account ? getAccount() : text}</span>
    </Button>
  );
}

const Button = styled.div`
  display: flex;
  width: 100%;
  height: 70px;
  border: 2px solid #ffb900;
  border-radius: 210px;
  span {
    margin: auto auto;
    display: table-cell;
  }
`;

export default ConnectWallet;
