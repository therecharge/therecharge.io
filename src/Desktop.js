/* Components */
import Gnb from "./Component/Desktop/Gnb";
import Home from "./Component/Desktop/Home";
import About from "./Component/Desktop/About";
import Recharge from "./Component/Desktop/Recharge";
import Defi from "./Component/Desktop/Defi";
import Docs from "./Component/Desktop/Docs";
import Station from "./pages/Defi/Station";
import Swap from "./pages/Defi/Swap";
/* Modules */
import React from "react";
import { Route, Switch } from "react-router-dom";
import { useRecoilState } from "recoil";
/* Libraries */
import {
  getChargerList,
  createContractInstance,
  getTokenInfo,
  getChargerInfo,
} from "./lib/read_contract/Station";
// import styled from "styled-components";
import { withTranslation } from "react-i18next";
import i18next from "./locale/i18n";
/* Store */
import { web3ReaderState } from "./store/read-web3";

const Desktop = React.memo(
  ({ toast, t }) => {
    // const NETWORKS = require("./lib/networks.json");
    // const [web3_R] = useRecoilState(web3ReaderState);
    // console.log("READER WEB3: ", web3_R);

    // // create charger list contract instance
    // const web3_ERC = web3_R["ERC"];
    // const address_chargerList_ERC =
    //   NETWORKS[process.env.REACT_APP_VERSION].chargerListAddress["ERC"];
    // const abi_chargerList = require("./lib/read_contract/abi/chargerList.json");
    // const chargerListInstance = createContractInstance(
    //   web3_ERC,
    //   address_chargerList_ERC,
    //   abi_chargerList
    // );
    // console.log("chargerListInstance ", chargerListInstance);
    // // create token contract instance
    // const address_token_ERC =
    //   NETWORKS[process.env.REACT_APP_VERSION].tokenAddress["ERC"];
    // const abi_erc = require("./lib/read_contract/abi/erc20.json");
    // const tokenInstance = createContractInstance(
    //   web3_ERC,
    //   address_token_ERC,
    //   abi_erc
    // );
    // console.log("tokenInstance ", tokenInstance);
    // // get charger list
    // const getList = async () => {
    //   const list = await getChargerList(chargerListInstance);
    //   console.log("charger List", list);
    // };
    // const charger_list = getList();
    // // create charger instance
    // const address_charger_ERC = "0x2658757cE2B5Ff083254B773C14f3a59ceA0E824";
    // const abi_charger = require("./lib/read_contract/abi/charger.json");
    // const chargerInstance = createContractInstance(
    //   web3_ERC,
    //   address_charger_ERC,
    //   abi_charger
    // );
    // console.log("chargerInstance ", chargerInstance);
    // // get token information
    // const getCharger = async () => {
    //   const info = await getChargerInfo(web3_ERC, chargerInstance);
    //   console.log("charger Info", info);
    // };
    // getCharger();

    return (
      <div className="desktop">
        <Gnb />
        <Switch>
          <Route path="/docs/:viewNum" component={Docs}></Route>
          <Route
            path="/defi/station"
            component={() => <Station toast={toast} />}
          ></Route>
          <Route
            path="/defi/swap"
            component={() => <Swap toast={toast} />}
          ></Route>
          <Route path="/defi" component={() => <Defi toast={toast} />}></Route>
          <Route path="/recharge" component={Recharge}></Route>
          <Route path="/about" component={About}></Route>
          <Route path="/" component={Home}></Route>
        </Switch>
        <style jsx global>{`
          .desktop {
            display: flex;
            background-color: #02051c;
            min-height: 100vh;
          }
          .home {
            width: 100%;
            min-width: 1088px;
            // overflow: hidden;
            // background: url(/bg_main_bottom.svg);
            background-color: #02051c;
            // background-size: cover;
            // background-position: bottom 0px center;
          }
          .about {
            width: 100%;
            min-width: 1088px;
            // background: url(/bg_about_bottom.svg);
            background-color: #02051c;
            // background-size: cover;
            // background-position: bottom 0px center;
          }
          .recharge {
            width: 100%;
            min-width: 1088px;
            // background: url(/bg_recharge_bottom.svg);
            background-color: #02051c;
            // background-size: cover;
            // background-position: bottom 0px center;
          }
          .defi {
            width: 100%;
            min-width: 1088px;
            // background: url(/bg_station_bottom.svg);
            background-color: #02051c;
            // background-size: cover;
            // background-position: bottom 0px center;
          }
          .docs {
            width: 100%;
            min-width: 1088px;
            // background: url(/gb_docs_bottom.svg);
            background-color: #02051c;
            // background-size: cover;
            // background-position: bottom 0px center;
          }
          body::-webkit-scrollbar {
            width: 2px;
          }
          body::-webkit-scrollbar-thumb {
            background-color: #2f3542;
            border-radius: 1px;
          }
          body::-webkit-scrollbar-track {
            background-color: #02051c;
            border-radius: 1px;
          }
          .ToastHub___StyledAnimatedDiv-sc-1y0i8xl-1 {
            margin-top: 10px;
          }
          .ToastHub___StyledDiv2-sc-1y0i8xl-2 {
            font-size: 15px;
            height: 110%;
            padding: 5px 20px;
          }
        `}</style>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return true;
  }
);

export default withTranslation()(Desktop);
