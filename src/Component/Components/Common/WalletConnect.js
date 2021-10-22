import React from "react";
import styled, { css } from "styled-components";
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
  h = "80px",
  radius = "210px",
  border = "2px solid #ffb900",
  bgColor,
  hcolor = "var(--yellow)",
  fontsize = "",
  fontClass = "",
  onClick = () => { },
  toast = () => { },
}) {
  const [web3, setWeb3] = useRecoilState(web3State);
  const [provider, setProvider] = useRecoilState(providerState);
  const [account, setAccount] = useRecoilState(accountState);
  const [network, setNetwork] = useRecoilState(networkState);
  const [requireNetwork] = useRecoilState(requireNetworkState);

  // function isOnClickFunctionDetected() {
  //   if (onClick.toString() == "()=>{}") return false;
  //   return true;
  // }

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
          1: "https://eth-mainnet.alchemyapi.io/v2/2wgBGtGnTm3s0A0o23RY0BtXxgow1GAn",
          3: "https://eth-ropsten.alchemyapi.io/v2/vn-ib6FVXaweiMUDJkOmOkXQm1jPacAj",
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
    setAccount(undefined);
    setProvider(undefined);
    setNetwork(undefined);
    await web3Modal.clearCachedProvider();

    // let els = document.querySelectorAll('[id=WEB3_CONNECT_MODAL_ID]')
    // while (els.length>1) {
    //     document.querySelectorAll('[id=WEB3_CONNECT_MODAL_ID]')[1].remove();
    // }
  }
  function onClickEvent() {
    if (onClick.toString().length < 13) onDisconnect();
    else onClick();
  }

  function connectEventHandler(provider) {
    if (!provider.on) {
      return;
    }
    provider.on("open", async (info) => {
      toast("Wallet Connected!");
      console.log("info", info);
    });
    provider.on("accountsChanged", async (accounts) => {
      // console.log(accounts);
      setAccount(accounts[0]);
      toast("Account Changed");
    });
    provider.on("chainChanged", async (chainId) => {
      // console.log(chainId);
      setNetwork(chainId);
      toast("Chain Id Changed");
    });
    provider.on("disconnect", async (error) => {
      onDisconnect(true);
      toast("Wallet lose connection.");
    });
  }
  function isChainCorrect() {
    // console.log(network, requireNetwork);
    if (!window.ethereum) {
      setNetwork(requireNetwork);
      return true;
    }
    return (typeof network === 'string' ? parseInt(network, 16) : network) == requireNetwork;
  }
  async function connect() {
    while (
      window.document.querySelectorAll("[id=WEB3_CONNECT_MODAL_ID]").length > 1
    ) {
      window.document
        .querySelectorAll("[id=WEB3_CONNECT_MODAL_ID]")[1]
        .remove();
    }
    // console.log("Connect!");
    // console.log("asdf", web3Modal);
    let provider = await web3Modal.connect();
    setProvider(provider);
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
      // props={
      text={undefined}
      w={w}
      m={m}
      h={h}
      radius={radius}
      border={border}
      bgColor={bgColor}
      hcolor={hcolor}
      fontsize={fontsize}
      fontClass={fontClass}
      // }
      className={isDisable() ? "disable" : ""}
      onClick={() => {
        switch (need) {
          case "0":
            onClickEvent();
            break;
          case "1":
            account ? onClickEvent() : connect();
            break;
          case "2":
            if (account && isChainCorrect()) onClickEvent();
            else if (!account) connect();
            else if (!isChainCorrect()) changeNetwork(requireNetwork);
            break;
        }
      }}
    >
      <span
        className={
          fontClass || window.innerWidth > 1088
            ? "Roboto_20pt_Black"
            : "Roboto_30pt_Black"
        }
      >
        {need === "0" && text}
        {need === "1" && !isDisable() &&
          (account ? getAccount() : notConnected)}
        {need === "2" && !isDisable() &&
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

const Button = styled.div`
  ${(props) => {
    return css`
      display: flex;
      background-color: ${props.bgColor};
      width: ${props.w};
      &:hover {
        background-color: ${props.hcolor};
        box-shadow: 0 0 10px 0 rgba(255, 255, 255, 0.5);
      }
      margin: ${props.m};
      height: ${props.h};
      border: ${props.border};
      border-radius: ${props.radius};
      cursor: pointer;
      span {
        margin: auto auto;
        display: table-cell;
        white-space: break-spaces;

        @media (min-width: 1088px) {
          font-size: ${props.account
        ? props.fontsize
        : props.text === "APPROVE" || props.text === "PLUG-IN"
          ? "20px"
          : props.fontsize};
        }
      }

      &.disable {
        cursor: not-allowed;
      }

      @media (min-width: 1088px) {
        width: ${props.border === "3px solid #9314B2"
        ? "540px"
        : props.border === "4px solid #9314B2"
          ? "474px"
          : props.border === "locked"
            ? "474px"
            : props.notConnected === "Connect Wallet for data"
              ? "420px"
              : "310px"};
        // margin: auto;
        margin-top: ${props.border === "4px solid #9314B2" ? "40px" : ""};
        height: ${props.border === "4px solid #9314B2" ? "60px" : ""};
      }
    `;
  }};
`;

export default React.memo(ConnectWallet);
