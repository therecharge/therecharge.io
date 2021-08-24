import React from "react";
import styled from "styled-components";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { changeNetwork } from "./utils/Wallets";
//store
import { useRecoilState } from "recoil";
import {
  web3State,
  providerState,
  accountState,
  networkState,
  requireNetworkState,
} from "../../../store/web3";

function ConnectWallet({
  need = "0", // 1 = Need wallet Connect, 2 = Need correct network
  disable = false,
  notConnected = "Wallet Connect",
  wrongNetwork = "Wrong Network!",
  text = undefined,
  w = "540px",
  m = "",
  radius = "210px",
  border = "2px solid #ffb900",
  bgColor = "",
  onClick = () => { },
  fontsize = ""
}) {
  const [web3, setWeb3] = useRecoilState(web3State);
  const [provider, setProvder] = useRecoilState(providerState);
  const [account, setAccount] = useRecoilState(accountState);
  const [network, setNetwork] = useRecoilState(networkState);
  const [requireNetwork] = useRecoilState(requireNetworkState);

  const Button = styled.div`
    display: flex;
    background-color: ${bgColor};
    width: ${w};
    margin: ${m};
    height: 80px;
    border: ${border};
    border-radius: ${radius};
    cursor: pointer;
    span {
      margin: auto auto;
      display: table-cell;
      
      @media (min-width: 1088px) {
        font-size: ${account ? fontsize : (text === "APPROVE" || text === "PLUG-IN" ? "20px" : fontsize)};
      }
    }

    @media (min-width: 1088px) {
      width: ${border === "3px solid #9314B2" ? "540px" : notConnected === "Connect Wallet for data" ? "420px" : "310px"};
      margin: auto;
    }
`;
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
    if (text) return text;
    // console.log(network, requireNetwork);
    let ret = account.slice(0, 8) + "..." + account.slice(-6);
    return ret;
  }
  function isDisable() {
    if (!disable) return false;
    switch (need) {
      case "0":
        return false;
      case "1":
        if (account) return false;
      case "2":
        if (account && isChainCorrect()) return false;
    }
    return true;
  }
  return (
    <Button
      className={isDisable() ? "disable" : ""}
      onClick={() => {
        switch (need) {
          case "0":
            onClick();
            break;
          case "1":
            account ? onClick() : connect();
            break;
          case "2":
            if (account && isChainCorrect()) onClick();
            else if (!account) connect();
            else if (!isChainCorrect()) changeNetwork(requireNetwork);
            break;
        }
      }}
    >
      <span className="Roboto_30pt_Black">
        {need === "0" && text}
        {need === "1" &&
          !isDisable() &&
          (account ? getAccount() : notConnected)}
        {need === "2" &&
          !isDisable() &&
          (account
            ? isChainCorrect()
              ? getAccount()
              : wrongNetwork
            : notConnected)}
        {isDisable() && text}
      </span>
    </Button>
  );
}

export default ConnectWallet;