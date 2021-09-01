import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Dropdown from "./Dropdown";
import WalletConnect from "../../../../Component/Components/Common/WalletConnect";
import Popup from "./popup";
//store
import { useRecoilState } from "recoil";
import { requireNetworkState } from "../../../../store/web3";

import { ReactComponent as RCGeth } from "./assets/RCGETH.svg";
import { ReactComponent as RCGbnb } from "./assets/RCGBNB.svg";
import { ReactComponent as RCGht } from "./assets/RCGHT.svg";
import { ReactComponent as FUP } from "./assets/FUP.svg";
import { ReactComponent as Active } from "./assets/swap_arrow.svg";
import { ReactComponent as Inactive } from "./assets/swap_arrow_deactive.svg";

function AssetSwap({ toast }) {
  const [t] = useTranslation();
  const [requireNetwork, setRequireNetwork] = useRecoilState(
    requireNetworkState
  );
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [recipe, setRecipe] = useState({
    from: {
      token: "RCG",
      network: "(Huobi ECO Chain Network)",
      image: RCGht,
      index: 0,
    },
    to: {
      token: "RCG",
      network: "(Ethereum Network)",
      image: RCGeth,
      index: 0,
    },
    swapAmount: "",
    chainId: {
      "(Ethereum Network)": 3, // ropsten으로 변경됨
      "(Huobi ECO Chain Network)": 128,
      "(Binance Smart Chain Network)": 56,
    },
    tokenAddress: {
      3: "0x76E7BE90D0BF6bfaa2CA07381169654c6b45793F", // "0xe74be071f3b62f6a4ac23ca68e5e2a39797a3c30", // 기존 이더리움 토큰주소
      128: "0xbddC276CACC18E9177B2f5CFb3BFb6eef491799b",
      56: "0x2D94172436D869c1e3c094BeaD272508faB0d9E3",
    },
    conversionFee: {
      3: 5,
      128: 0.5,
      56: 0.5,
    },
  });

  const fromList = [
    ["RCG", "(Huobi ECO Chain Network)", RCGht],
    ["RCG", "(Ethereum Network)", RCGeth],
    ["RCG", "(Binance Smart Chain Network)", RCGbnb],
    ["PiggyCell Point", "", FUP],
  ];
  const toList1 = [
    ["RCG", "(Ethereum Network)", RCGeth],
    ["RCG", "(Binance Smart Chain Network)", RCGbnb],
  ];
  const toList2 = [
    ["RCG", "(Huobi ECO Chain Network)", RCGht],
    ["RCG", "(Binance Smart Chain Network)", RCGbnb],
  ];
  const toList3 = [
    ["RCG", "(Huobi ECO Chain Network)", RCGht],
    ["RCG", "(Ethereum Network)", RCGeth],
  ];
  const toList4 = [["RCG", "(Huobi ECO Chain Network)", RCGht]];

  useEffect(() => {
    setRequireNetwork(recipe.chainId[recipe.from.network]);
  }, []);

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
          {recipe.from.token !== "PiggyCell Point" ? <Active /> : <Inactive />}
        </Arrow>
        <Dropdown
          recipe={recipe}
          setRecipe={setRecipe}
          Image={recipe.to.image}
          symbol={recipe.to.token}
          network={recipe.to.network}
          unselectedList={
            recipe.from.index === 0
              ? toList1
              : recipe.from.index === 1
              ? toList2
              : recipe.from.index === 2
              ? toList3
              : recipe.from.index === 3
              ? toList4
              : []
          }
          title="TO"
        />
        {recipe.from.token !== "PiggyCell Point" ? (
          <WalletConnect
            need="2"
            bgColor="var(--gray-30)"
            border="4px solid var(--gray-30)"
            hcolor=""
            // notConnected="Connect Wallet for swap"
            notConnected="Connect Wallet for My Asset"
            // wrongNetwork="Change network for swap"
            wrongNetwork="'SWAP' will be open soon"
            m="40px auto"
            radius="20px"
            w="540px"
            // h="60px"
            fontsize="20px"
            text="'SWAP' will be open soon"
            onClick={() => console.log("")}
            // onClick={() => setPopupOpen(!isPopupOpen)}
          />
        ) : (
          <WalletConnect
            need="3"
            bgColor="var(--gray-30)"
            border="none"
            hcolor=""
            notConnected="Not supported yet"
            wrongNetwork="Not supported yet"
            m="40px auto"
            radius="20px"
            w="540px"
            // h="60px"
            fontsize="20px"
            text="'SWAP' will be open soon"
            disable={true}
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
