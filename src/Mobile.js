/* Components */
import Gnb from "./Component/Mobile/Gnb";
import Home from "./Component/Mobile/Home";
import About from "./Component/Mobile/About";
import Recharge from "./Component/Mobile/Recharge";
import Defi from "./Component/Mobile/Defi";
import Station from "./pages/Defi/Station";
import Swap from "./pages/Defi/Swap";
import Docs from "./Component/Mobile/Docs";
/* Libraries */
import React from "react";
import { Route, Switch } from "react-router-dom";
import i18next from "./locale/i18n";

const Mobile = React.memo(({ toast }) => {

  const getTitle = () => {
    const path = window.location.pathname.split("/")[1];
    const path2 = window.location.pathname.split("/")[2];

    switch (path) {
      case "about":
        return "About";
      case "recharge":
        return "Recharge Token";
      case "defi":
        if (path2 === "station") return "Charging Station"
        else if (path2 === "swap") return "Charging Swap"
        else return "De-Fi";
      case "docs":
        return "Documents";
      default:
        return "";
    }
  };

  return (
    <div className={"desktop " + getTitle()}>
      <Gnb getTitle={getTitle} />

      <Switch>
        <Route path="/docs/:viewNum" component={Docs}></Route>
        <Route path="/defi/station" component={() => <Station toast={toast} />}></Route>
        <Route path="/defi/swap" component={() => <Swap toast={toast} />}></Route>
        <Route path="/defi" component={() => (<Defi toast={toast} />)}></Route>
        <Route path="/recharge" component={Recharge}></Route>
        <Route path="/about" component={About}></Route>
        <Route path="/" component={Home}></Route>
      </Switch>
      <style jsx global>{`
          body {
            width: 100%;
            margin: 0px;
            padding: 0px;
            font-family: "Roboto", sans-serif;
            background-color: #03051d;
          }
          div {
            outline: none;
          }
          .desktop {
            display: flex;
            width: 100%;
            // background: url(/bg_main_bottom.svg);
            background-color: #02051c;
            // background-size: cover;
            // background-position: bottom 0px center;
          }
          .about {
            // background: url(/bg_about_bottom.svg);
            background-color: #02051c;
            // background-size: cover;
            // background-position: bottom 0px center;
          }
          .recharge {
            // background: url(/bg_recharge_bottom.svg);
            background-color: #02051c;
            // background-size: cover;
            // background-position: bottom 0px center;
          }
          .station {
            // background: url(/bg_station_bottom.svg);
            background-color: #02051c;
            // background-size: cover;
            // background-position: bottom 0px center;
          }
          .docs {
            // background: none;
            background-color: #02051c;
            // background-size: cover;
            // background-position: bottom 0px center;
          }
          body::-webkit-scrollbar {
            width: 5px;
          }
          body::-webkit-scrollbar-thumb {
            background-color: #2f3542;
            border-radius: 3px;
          }
          body::-webkit-scrollbar-track {
            background-color: #02051c;
            border-radius: 3px;
          }
          .ToastHub___StyledAnimatedDiv-sc-1y0i8xl-1 {
            margin-top: 10px;
          }
          .ToastHub___StyledDiv-sc-1y0i8xl-0 {
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

export default Mobile;
