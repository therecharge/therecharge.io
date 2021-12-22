import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Dropdown from "./Dropdown";
import WalletConnect from "../../../Components/Common/WalletConnect";
import { SolanaAdapter } from "../../../Components/Common/SolanaAdapter";
import Popup from "./popup";
//store
import { useRecoilState } from "recoil";
import { requireNetworkState } from "../../../store/web3";
import { accountState, solAccountState } from "../../../store/web3";

import { ReactComponent as RCGeth } from "./assets/RCGETH.svg";
import { ReactComponent as RCGbnb } from "./assets/RCGBNB.svg";
import { ReactComponent as RCGht } from "./assets/RCGHT.svg";
import { ReactComponent as RCGsol } from "./assets/RCGSOL.svg";
import { ReactComponent as FUP } from "./assets/FUP.svg";
import { ReactComponent as Active } from "./assets/swap_arrow.svg";
import { ReactComponent as Inactive } from "./assets/swap_arrow_deactive.svg";

//Libraraies
import axios from "axios";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
const web3 = require("@solana/web3.js");

function AssetSwap({ toast }) {
  const [t] = useTranslation();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [requireNetwork, setRequireNetwork] = useRecoilState(
    requireNetworkState
  );
  const [account] = useRecoilState(accountState);
  const [solAddress, setSolAddress] = useRecoilState(solAccountState);
  const [addresses, setAddresses] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [recipeId, setRecipeId] = useState("");
  const [bridgeAddress, setBridgeAddress] = useState("");

  const [recipe, setRecipe] = useState({
    from: {
      token: "RCG",
      network: "(Ethereum Network)",
      image: RCGeth,
      index: 0,
    },
    to: {
      token: "RCG",
      network: "(Binance Smart Chain Network)",
      image: RCGbnb,
      index: 1,
    },
    swapAmount: "",
    chainId: {
      "(Ethereum Network)": 1,
      "(Huobi ECO Chain Network)": 128,
      "(Binance Smart Chain Network)": 56,
      "(Solana Network)": 100,
      "": 1,
    },
    network: {
      "(Ethereum Network)": "ERC",
      "(Huobi ECO Chain Network)": "HRC",
      "(Binance Smart Chain Network)": "BEP",
      "(Solana Network)": "SOL",
      "": 1,
    },
    tokenAddress: {
      1: "0xe74be071f3b62f6a4ac23ca68e5e2a39797a3c30", // "0x76E7BE90D0BF6bfaa2CA07381169654c6b45793F", // 랍스텐 토큰주소
      128: "0xbddC276CACC18E9177B2f5CFb3BFb6eef491799b",
      56: "0x2D94172436D869c1e3c094BeaD272508faB0d9E3",
    },
    conversionFee: {
      //12.23 edited
      1: 5,
      128: 0.5,
      56: 0.5,
      100: 0.3,
    },
  });

  const fromList = [
    // ["RCG", "(Huobi ECO Chain Network)", RCGht],
    ["RCG", "(Ethereum Network)", RCGeth],
    ["RCG", "(Binance Smart Chain Network)", RCGbnb],
    ["RCG", "(Solana Network)", RCGsol],
    ["PiggyCell Point", "", FUP],
  ];

  const toList = [
    // ["RCG", "(Huobi ECO Chain Network)", RCGht],
    ["RCG", "(Ethereum Network)", RCGeth],
    ["RCG", "(Binance Smart Chain Network)", RCGbnb],
    ["RCG", "(Solana Network)", RCGsol],
    // ["PiggyCell Point", "", FUP],
  ];

  const toList2 = [["RCG", "(Binance Smart Chain Network)", RCGbnb]];

  const getRecipeId = async () => {
    //set SwapFromTo
    let swapFrom, swapTo;
    if (recipe.from.network === "(Ethereum Network)") swapFrom = "ETH";
    if (recipe.from.network === "(Binance Smart Chain Network)")
      swapFrom = "BSC";
    if (recipe.from.network === "(Solana Network)") swapFrom = "SOL";

    if (recipe.to.network === "(Ethereum Network)") swapTo = "ETH";
    if (recipe.to.network === "(Binance Smart Chain Network)") swapTo = "BSC";
    if (recipe.to.network === "(Solana Network)") swapTo = "SOL";

    await setSolAddress(publicKey.toString());
    await setAddresses(
      swapFrom === "SOL"
        ? [publicKey.toString(), account]
        : [account, publicKey.toString()]
    );
    console.log("addresses", addresses);

    let result = await axios.post("https://sol-bridge.therecharge.io/create", {
      chain: [swapFrom, swapTo],
      address:
        swapFrom === "SOL"
          ? [publicKey.toString(), account]
          : [account, publicKey.toString()],
    });

    console.log(result);
    await setRecipeId(result.data.id);
    await setBridgeAddress(result.data.bridge);
  };

  useEffect(() => {
    setRequireNetwork(recipe.chainId[recipe.from.network]);
  }, []);

  // useEffect(() => {
  //   // setRequireNetwork(recipe.chainId[recipe.from.network]);
  //   getSolanaAccount();
  //   getRecipeId();
  //   sendRCG();
  // }, [solAccount]);

  return (
    <Container>
      <Content>
        {isPopupOpen && (
          <Popup
            recipe={recipe}
            setRecipe={setRecipe}
            close={() => {
              setPopupOpen(false);
            }}
            toast={toast}
            isPopupOpen={isPopupOpen}
            recipeId={recipeId}
            bridgeAddress={bridgeAddress}
            addresses={addresses}
          />
        )}
        <Dropdown
          recipe={recipe}
          setRecipe={setRecipe}
          Image={recipe.from.image}
          symbol={recipe.from.token}
          network={recipe.from.network}
          unselectedList={fromList}
          title="FROM"
        />
        {/* {recipe.from.network === "(Solana Network)" ? (
          //  && !solAccount
          <div
            style={{
              display: "flex",
              marginTop: "5px",
              justifyContent: "flex-end",
            }}
          >
            <SolanaAdapter />
          </div>
        ) : (
          <div />
        )} */}
        <Arrow
          style={
            recipe.from.token === "PiggyCell Point"
              ? {
                  width: "60px",
                  height: "60px",
                  margin: "40px auto",
                  cursor: "not-allowed",
                }
              : {
                  width: "60px",
                  height: "60px",
                  margin: "40px auto",
                  cursor: "pointer",
                }
          }
          onClick={
            recipe.from.token === "PiggyCell Point"
              ? () => {}
              : () => {
                  setRecipe({
                    ...recipe,
                    from: recipe.to,
                    to: recipe.from,
                    swapAmount: "",
                  });
                  setRequireNetwork(recipe.chainId[recipe.to.network]);
                }
          }
        >
          {recipe.from.token === "PiggyCell Point" ? <Inactive /> : <Active />}
        </Arrow>
        <Dropdown
          recipe={recipe}
          setRecipe={setRecipe}
          Image={recipe.to.image}
          symbol={recipe.to.token}
          network={recipe.to.network}
          unselectedList={
            recipe.from.token === "PiggyCell Point" ? toList2 : toList
          }
          title="TO"
        />

        {recipe.from.token !== "PiggyCell Point" ? (
          <WalletConnect
            need={recipe.from.network === "(Solana Network)" ? "1" : "2"}
            bgColor="var(--purple)"
            border="4px solid #9314B2"
            // bgColor="var(--gray-30)"
            // border="4px solid var(--gray-30)"
            hcolor=""
            notConnected="Connect Wallet for swap"
            wrongNetwork="Change network for swap"
            // notConnected="Connect Wallet"
            // wrongNetwork="'SWAP' will be open soon"
            m="40px auto"
            radius="20px"
            w="540px"
            // h="60px"
            fontsize="20px"
            // text="'SWAP' will be open soon"
            // onClick={() => console.log("")}
            text="SWAP"
            onClick={async () => {
              if (
                recipe.from.network === "(Solana Network)" ||
                recipe.to.network === "(Solana Network)"
              ) {
                await getRecipeId();
                setPopupOpen(!isPopupOpen);
              }
              setPopupOpen(!isPopupOpen);
            }}
          />
        ) : (
          <WalletConnect
            need="1"
            bgColor="var(--purple)"
            border="4px solid #9314B2"
            // bgColor="var(--gray-30)"
            // border="none"
            hcolor=""
            notConnected="Connect Wallet for swap"
            wrongNetwork="Change network for swap"
            // notConnected="Not supported yet"
            // wrongNetwork="Not supported yet"
            m="40px auto"
            radius="20px"
            w="540px"
            // h="60px"
            fontsize="20px"
            text="SWAP"
            // text="'SWAP' will be open soon"
            // disable={true}
            onClick={() => setPopupOpen(!isPopupOpen)}
          />
        )}
      </Content>
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  margin: 40px 50px 50px 50px;
  height: fit-content;
  background-color: #1c1e35;
  border-radius: 10px;

  @media (min-width: 1088px) {
    justify-content: center;
    width: 714px;
    // height: 704px;
    height: 670px;
    margin: 0px 0px 0px 20px;
  }
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: fit-content;
  margin: 40px 40px 40px 40px;

  @media (min-width: 1088px) {
    padding: 60px 0;
    margin: 0 120px;
  }
`;
const Arrow = styled.div`
  display: flex;

  &:hover {
    border-radius: 5px;
    box-shadow: 0 0 10px 0 rgba(255, 255, 255, 0.5);
  }
`;

export default React.memo(AssetSwap);
