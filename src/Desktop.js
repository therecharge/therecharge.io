/* Components */
import Gnb from "./Gnb/desktop";
import Home from "./Defi/desktop";
import Station from "./Defi/Station";
import Swap from "./Defi/Swap";
/* Modules */
import React, { useMemo } from "react";
import { Route, Switch } from "react-router-dom";
import { useRecoilState } from "recoil";
/* Libraries */
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import {
  getLedgerWallet,
  getPhantomWallet,
  getSlopeWallet,
  getSolflareWallet,
  getSolletExtensionWallet,
  getSolletWallet,
  getTorusWallet,
} from "@solana/wallet-adapter-wallets";
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

const App = React.memo(
  ({ toast, t }) => {
    // setting solana wallet
    const network = WalletAdapterNetwork["mainnet-beta"];
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const wallets = useMemo(
      () => [
        getPhantomWallet(),
        getSlopeWallet(),
        getSolflareWallet(),
        getTorusWallet(),
        getLedgerWallet(),
        getSolletWallet({ network }),
        getSolletExtensionWallet({ network }),
      ],
      [network]
    );
    return (
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <div className="App">
            <Gnb />
            <Switch>
              <Route
                path="/station"
                component={() => <Station toast={toast} />}
              ></Route>
              <Route
                path="/swap"
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
        </WalletProvider>
      </ConnectionProvider>
    );
  },
  (prevProps, nextProps) => {
    return true;
  }
);

export default App;
