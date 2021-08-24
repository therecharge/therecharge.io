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
//store
import { useRecoilState } from "recoil";
import {
  accountState,
  networkState,
  requireNetworkState,
} from "../../../../store/web3";
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
    FUP: 0,
  });

  const loadBalance = async () => {
    const ETH = new Web3(
      "https://mainnet.infura.io/v3/636c3521d0f648d5b1789cd9388a182f"
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
      balanceBNB;

    RCGeth = new ETH.eth.Contract(
      ERC20_ABI,
      "0xe74be071f3b62f6a4ac23ca68e5e2a39797a3c30"
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
      [balanceRCG,
        balanceHRCRCG,
        balanceBEPRCG,
        balanceETH,
        balanceHT,
        balanceBNB] = await Promise.all([
          RCGeth.methods.balanceOf(account).call(),
          RCGht.methods.balanceOf(account).call(),
          RCGbep.methods.balanceOf(account).call(),
          ETH.eth.getBalance(account),
          HECO.eth.getBalance(account),
          BNB.eth.getBalance(account)
        ]);

      balanceRCG = makeNum(weiToEther(balanceRCG));
      balanceHRCRCG = makeNum(weiToEther(balanceHRCRCG));
      balanceBEPRCG = makeNum(weiToEther(balanceBEPRCG));
      balanceETH = makeNum(weiToEther(balanceETH));
      balanceHT = makeNum(weiToEther(balanceHT));
      balanceBNB = makeNum(weiToEther(balanceBNB));

      setTokensBalance({
        ...tokensBalance,
        "ERC RCG": balanceRCG,
        "HRC RCG": balanceHRCRCG,
        "BEP RCG": balanceBEPRCG,
        ETH: balanceETH,
        HT: balanceHT,
        BNB: balanceBNB,
      });
    }
  };

  useEffect(() => {
    if (!account) return;
    loadBalance();
  }, [account])

  return (
    <Container>
      <Content>
        <span className="Roboto_40pt_Black">My Asset</span>
        {account && network == requireNetwork
          ? (<List>
            <Balance Image={RCGeth} symbol="RCG" balance={tokensBalance["ERC RCG"]} />
            <Balance Image={RCGht} symbol="RCG" balance={tokensBalance["HRC RCG"]} />
            <Balance Image={RCGbnb} symbol="RCG" balance={tokensBalance["BEP RCG"]} />
            <Balance Image={ETH} symbol="ETH" balance={tokensBalance.ETH} />
            <Balance Image={HT} symbol="HT" balance={tokensBalance.HT} />
            <Balance Image={BNB} symbol="BNB" balance={tokensBalance.BNB} />
            <Balance Image={FUP} symbol="FUP" balance={tokensBalance.FUP} />
          </List>)
          : <List>
            <WalletConnect
              need="2"
              notConnected="Connect Wallet for My Asset"
              wrongNetwork="Change network for My Asset"
              m="auto"
              w="540px"
            />
          </List>}
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
}
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
  }
`;
const Content = styled.div`
  margin: 20px 60px 20px 60px;
  width: 100%;
  display: flex;
  gap: 20px;
  flex-direction: column;
  span {
    margin: 0 auto;
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
`;

export default React.memo(Asset);
