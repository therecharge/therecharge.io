import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Web3 from "web3";
import { fromWei, toWei } from "web3-utils";
import Balance from "./Balance";
import WalletConnect from "../../../../Component/Components/Common/WalletConnect";
import { ReactComponent as RCGeth } from "./assets/RCGETH.svg";
import { ReactComponent as RCGht } from "./assets/RCGHT.svg";
import { ReactComponent as RCGbnb } from "./assets/RCGBNB.svg";
import { ReactComponent as ETH } from "./assets/ETH.svg";
import { ReactComponent as HT } from "./assets/HT.svg";
import { ReactComponent as BNB } from "./assets/BNB.svg";
import { ReactComponent as FUP } from "./assets/FUP.svg";
import { ReactComponent as FUP1 } from "./assets/FUP1.svg";
//store
import { useRecoilState } from "recoil";
import {
  accountState,
  networkState,
  requireNetworkState,
} from "../../../../store/web3";
import axios from "axios";
const ERC20_ABI = require("../../../../Component/Desktop/Defi/abis/ERC20ABI.json");

function Asset({ setParams }) {
  const [t] = useTranslation();
  const [account] = useRecoilState(accountState);
  const [network] = useRecoilState(networkState);
  const [requireNetwork] = useRecoilState(requireNetworkState);
  const [tokensBalance, setTokensBalance] = useState({
    "ERC RCG": 0,
    "HRC RCG": 0,
    "BEP RCG": 0,
    ETH: 0,
    HT: 0,
    BNB: 0,
    FUP1: 0,
  });

  const loadBalance = async () => {
    const ETH = new Web3(
      // "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161" // ropsten
      // "https://mainnet.infura.io/v3/636c3521d0f648d5b1789cd9388a182f" // 이더리움 메인넷
      "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
    );
    const HECO = new Web3("https://http-mainnet.hecochain.com");
    const BNB = new Web3("https://bsc-dataseed.binance.org/");

    let RCGeth,
      RCGht,
      RCGbep,
      balanceRCG,
      balanceHRCRCG,
      balanceBEPRCG,
      balanceETH,
      balanceHT,
      balanceBNB
    // balanceFUP;

    RCGeth = new ETH.eth.Contract(
      ERC20_ABI,
      "0xe74be071f3b62f6a4ac23ca68e5e2a39797a3c30" // 이더리움 토큰주소
    );

    RCGht = new HECO.eth.Contract(
      ERC20_ABI,
      "0xbddC276CACC18E9177B2f5CFb3BFb6eef491799b"
    );

    RCGbep = new BNB.eth.Contract(
      ERC20_ABI,
      "0x2D94172436D869c1e3c094BeaD272508faB0d9E3"
    );

    if (account) {
      [
        balanceRCG,
        balanceHRCRCG,
        balanceBEPRCG,
        balanceETH,
        balanceHT,
        balanceBNB,
        // balanceFUP
      ] = await Promise.all([
        RCGeth.methods.balanceOf(account).call(),
        RCGht.methods.balanceOf(account).call(),
        RCGbep.methods.balanceOf(account).call(),
        ETH.eth.getBalance(account),
        HECO.eth.getBalance(account),
        BNB.eth.getBalance(account),
        // axios.get(`https://fup.bridge.therecharge.io/point/${account}`)
      ]);

      balanceRCG = makeNum(weiToEther(balanceRCG));
      balanceHRCRCG = makeNum(weiToEther(balanceHRCRCG));
      balanceBEPRCG = makeNum(weiToEther(balanceBEPRCG));
      balanceETH = makeNum(weiToEther(balanceETH));
      balanceHT = makeNum(weiToEther(balanceHT));
      balanceBNB = makeNum(weiToEther(balanceBNB));
      // balanceFUP = balanceFUP.data.balance;
      // console.log("balanceFUP", balanceFUP)

      setTokensBalance({
        ...tokensBalance,
        "ERC RCG": balanceRCG,
        "HRC RCG": balanceHRCRCG,
        "BEP RCG": balanceBEPRCG,
        ETH: balanceETH,
        HT: balanceHT,
        BNB: balanceBNB,
        // FUP1: balanceFUP,
      });
    }
    // console.log(tokensBalance);
  };

  const loadFupBalance = async () => {
    let balanceFUP;

    try {
      balanceFUP = await axios.get(`https://fup.bridge.therecharge.io/point/${account}`)
    } catch (err) {
      balanceFUP = { data: { balance: 0 } }
    }
    balanceFUP = balanceFUP.data.balance;
    // console.log("balanceFUP", balanceFUP);

    setTokensBalance({
      ...tokensBalance,
      FUP1: balanceFUP,
    });
  }

  useEffect(() => {
    if (!account) return;
    loadBalance();
    loadFupBalance();
  }, [account]);

  return (
    <Container>
      <Content>
        <span className="Roboto_30pt_Black theme">My Asset</span>
        <Line />
        {account ? (
          <List>
            <Balance
              Image={RCGeth}
              symbol="RCG"
              balance={tokensBalance["ERC RCG"]}
            />
            <Balance
              Image={RCGht}
              symbol="RCG"
              balance={tokensBalance["HRC RCG"]}
            />
            <Balance
              Image={RCGbnb}
              symbol="RCG"
              balance={tokensBalance["BEP RCG"]}
            />
            <Balance Image={ETH} symbol="ETH" balance={tokensBalance.ETH} />
            <Balance Image={HT} symbol="HT" balance={tokensBalance.HT} />
            <Balance Image={BNB} symbol="BNB" balance={tokensBalance.BNB} />
            <Balance Image={FUP1} symbol="FUP" balance={tokensBalance.FUP1} />
          </List>
        ) : (
          <List>
            <WalletConnect
              need="2"
              notConnected="Connect Wallet"
              wrongNetwork="Change network for My Asset"
              text="PLUG-IN"
              m="auto"
              w=""
              fontsize="20px"
            />
          </List>
        )}
      </Content>
    </Container>
  );
}

const makeNum = (str, decimal = 4) => {
  let newStr = str;
  if (typeof newStr === "number") newStr = str.toString();
  let arr = newStr.split(".");
  if (arr.length == 1 || arr[0].length > 8) return arr[0];
  else {
    return arr[0] + "." + arr[1].substr(0, decimal);
  }
};
const weiToEther = (wei) => {
  return fromWei(wei, "ether");
};

const Container = styled.div`
  margin: 60px 50px 0px 50px;
  border-radius: 10px;
  display: flex;
  height: 350px;
  background-color: #1c1e35;
  @media (min-width: 1088px) {
    justify-content: center;
    width: 354px;
    height: inherit;
    margin: 0px 0 0 0;
  }
`;
const Content = styled.div`
  margin: 60px 60px;
  width: 100%;
  display: flex;
  gap: 20px;
  flex-direction: column;
  .theme {
    margin: 0 auto;
  }
  @media (min-width: 1088px) {
    gap: 0px;
  }
`;

const Line = styled.div`
  display: none;
  @media (min-width: 1088px) {
    display: block;
    width: 100%;
    height: 1px;
    margin: 20px 0;
    background-color: #fff;
  }
`;
const List = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  // background-color: white;
  white-space: nowrap;
  overflow: auto;
  gap: 14px;
  span {
    width: 500px;
  }
  @media (min-width: 1088px) {
    span {
      width: 100%;
    }
  }
`;

export default React.memo(Asset);
