import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Main, ToastHub, Toast, textStyle } from "@aragon/ui";
import { RecoilRoot } from "recoil";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

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

ReactDOM.render(
  <React.StrictMode>
    <Main layout={false} scrollView={true} theme={false}>
      <ToastHub>
        <Toast>
          {(toast) => {
            return (
              <div>
                <BrowserRouter>
                  <RecoilRoot>
                    <App />
                  </RecoilRoot>
                </BrowserRouter>
              </div>
            );
          }}
        </Toast>
      </ToastHub>
    </Main>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
