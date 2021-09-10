/* Components */
import Gnb from "./Component/Desktop/Gnb";
import Home from "./Component/Desktop/Home";
import About from "./Component/Desktop/About";
import Recharge from "./Component/Desktop/Recharge";
import Defi from "./Component/Desktop/Defi";
import Docs from "./Component/Desktop/Docs";
import Station from "./pages/Defi/Station";
import Swap from "./pages/Defi/Swap";
/* Libraries */
import React from "react";
import { Route, Switch } from "react-router-dom";
// import styled from "styled-components";
import { withTranslation } from "react-i18next";
import i18next from "./locale/i18n";

const Desktop = React.memo(({ toast, t }) => {

  return (
    <div className="desktop">
      <Gnb />
      <Switch>
        <Route path="/docs/:viewNum" component={Docs}></Route>
        <Route
          path="/defi/station"
          component={() => (
            <Station toast={toast} />
          )}>
        </Route>
        <Route
          path="/defi/swap"
          component={() => (
            <Swap toast={toast} />
          )}>
        </Route>
        <Route path="/defi" component={() => (<Defi toast={toast} />)}></Route>
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
}
  ,
  (prevProps, nextProps) => {
    return true;
  }
);

export default withTranslation()(Desktop);
