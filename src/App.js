import logo from "./logo.svg";
import "./App.css";

/* Components */
import Gnb from "./Gnb";
import Home from "./Defi";
import Station from "./Defi/Station";
import Swap from "./Defi/Swap";
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

function App({ toast, t }) {
  return (
    <div className="App">
      <Gnb />
      <Switch>
        <Route
          path="/defi/station"
          component={() => <Station toast={toast} />}
        ></Route>
        <Route
          path="/defi/swap"
          component={() => <Swap toast={toast} />}
        ></Route>
        <Route path="/" component={Home}></Route>
      </Switch>
      <style jsx global>{`
        .App {
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
}

export default App;
