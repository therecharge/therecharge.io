import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
//components
// import Image from "./List/image.js";
import Row from "./List/row_locker.js";
/* Libraries */
import {
  getChargerList,
  createContractInstance,
  // getTokenInfo,
  getChargerInfo,
} from "../../../lib/read_contract/Station";
import { fromWei } from "web3-utils";
/* Store */
import { web3ReaderState } from "../../../store/read-web3";
// import { ReactComponent as DropdownClose } from "./List/assets/dropdown-close.svg";
// import { ReactComponent as DropdownOpen } from "./List/assets/dropdown-open.svg";
const loading_data = [
  {
    address: "0x0",
    // apy: "-",
    name: "Loading List..",
    period: [1625022000, 14400],
    redemtion: 200,
    symbol: ["RCG", "RCG"],
    token: [
      "0xe74be071f3b62f6a4ac23ca68e5e2a39797a3c30", // 이더리움 토큰주소
      "0xe74be071f3b62f6a4ac23ca68e5e2a39797a3c30",
    ],
    tvl: "-",
    type: "flexible",
    network: "ERC",
  },
];
const chargerInfo = [
  {
    address: "0x0",
    // apy: "-",
    name: "There is currently no Charger List available.",
    period: [1625022000, 14400],
    redemtion: 200,
    symbol: ["RCG", "RCG"],
    token: [
      "0xe74be071f3b62f6a4ac23ca68e5e2a39797a3c30", // 이더리움 토큰주소
      "0xe74be071f3b62f6a4ac23ca68e5e2a39797a3c30",
    ],
    tvl: "-",
    type: "flexible",
    network: "ERC",
  },
];

function List({
  /*type, list,*/
  params,
  toast,
  network,
  loadPrivateChargerList,
  privateTvl,
  setPrivateTvl,
  chListPrivate,
  setChListPrivate,
  fullListPrivate,
  setFullListPrivate,
}) {
  const [t] = useTranslation();

  const filterByNetwork = (chargerList) => {
    return chargerList.filter((charger) => charger.network === network);
  };
  const filterByType = (chargerList) => {
    if (params.isLP) {
      return chargerList.filter(
        (charger) =>
          charger.name.includes(params.type) && charger.name.includes("LP")
      );
    } else {
      return chargerList.filter(
        (charger) =>
          charger.name.includes(params.type) && !charger.name.includes("LP")
      );
    }
  };

  // Whenever Staking type is changed, reload Pool list
  useEffect(async () => {
    setChListPrivate(loading_data);
    try {
      await loadPrivateChargerList();
    } catch (err) {
      console.log(err);
    }
  }, []);
  useEffect(async () => {
    try {
      let list;
      if (network === "ALL" && params.type === "ALL") {
        setChListPrivate(fullListPrivate);
      } else if (network !== "ALL" && params.type === "ALL") {
        list = await filterByNetwork(fullListPrivate);
      } else if (network === "ALL" && params.type !== "ALL") {
        list = await filterByType(fullListPrivate);
      } else {
        list = await filterByNetwork(fullListPrivate);
        list = await filterByType(list);
      }
      if (list.length === 0) {
        setChListPrivate(chargerInfo);
      } else {
        setChListPrivate(list);
      }
    } catch (err) {
      console.log(err);
    }
  }, [params, network]);

  return (
    <Container>
      <Content>
        <RowContainer>
          {chListPrivate.map((charger, index) => {
            return (
              <div
                // className={params.isLP === true ? "disable" : ""}
                style={
                  charger.name === "Loading List.."
                    ? { cursor: "not-allowed" }
                    : {}
                }
              >
                <div style={{ cursor: "pointer" }}>
                  <Row
                    key={charger.name}
                    index={index}
                    status={charger.status} // active or not
                    name={charger.name}
                    tvl={charger.totalSupply}
                    apy={charger.apy}
                    info={charger}
                    limit={charger.limit}
                    params={params} // 버튼에 대한 분기처리 때문에 필요
                    toast={toast}
                    period={loadPoolPeriod(charger.startTime, charger.DURATION)}
                    poolNet={charger.network}
                    poolTVL={charger.poolTVL}
                  />
                </div>
              </div>
            );
          })}
        </RowContainer>
      </Content>
    </Container>
  );
}

const loadPoolPeriod = (startTime, duration) => {
  let ret = "21.01.01 00:00:00 ~ 21.01.30 00:00:00((UTC+9)+9)";
  const endTime = Number(startTime) + Number(duration);

  const formatter = (timestamp) => {
    var d = new Date(Number(timestamp) * 1000);
    const z = (x) => {
      return x.toString().padStart(2, "0");
    };
    return `${new String(d.getFullYear()).substr(2, 3)}.${z(
      d.getMonth() + 1
    )}.${z(d.getDate())} ${z(d.getHours())}:${z(d.getMinutes())}:${z(
      d.getSeconds()
    )}`;
  };
  ret = `${formatter(startTime)} ~ ${formatter(endTime)}`;
  return ret;
};

const loadActiveStatus = ({ totalSupply, startTime, DURATION, limit }) => {
  startTime = Number(startTime);
  DURATION = Number(DURATION);
  let NOW = new Date().getTime() / 1000;
  // console.log(limit, totalSupply);
  if (NOW < startTime) return "Inactive";

  if (NOW > startTime + DURATION) return "Close";

  if (limit != "0" && totalSupply >= limit) return "Close";
  return "Active";
};
function makeNum(str = "0", decimal = 4) {
  let newStr = str;
  if (typeof newStr === "number") newStr = str.toString();
  let arr = newStr.split(".");
  if (arr.length == 1 || arr[0].length > 8) return arr[0];
  else {
    return arr[0] + "." + arr[1].substr(0, decimal);
  }
}

const Container = styled.div`
  // margin-top: 20px;
  margin-bottom: 120px;
  display: flex;
  width: 100%;
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 1088px;

  img {
    height: 60px;
    margin: auto;
    @media (min-width: 1088px) {
      margin: 0;
      align-items: flex-end
    }
  }
  div{
  }
  p {
    color: white;
    // margin: auto;
    margin-top: 20px;

    @media (min-width: 1088px) {
      margin: 0;
      margin-left: 10px;
      margin-bottom: 0px;
  }
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: 1088px) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }
`;
const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
const RowContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 30px 0px 30px;

  @media (min-width: 1088px) {
    margin: 0px;
    margin-top: 40px;
  }

  .disable {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const TotalValue = styled.div``;
const Line = styled.div`
  height: 2px;
  margin: 40px 10px 0px 10px;
  width: auto;
  background-color: #9314b2;
  box-shadow: 0px 0px 20px 0.5px white;
`;

// const DropDownWrapper = styled.div`
// display:flex;
// justify-content: flex-end;
// `;
// const NetWork = styled.div``;
// const Text = styled.div``;
// const Box = styled.div`
// width: 196px;
// height: 42px;
// // margin: 8px 0 0 302px;
// // padding: 0 0 0 2px;
// object-fit: contain;
// border-radius: 30px;
// background-color: var(--black-30);
// `;
// const Type = styled.div``;
// const Sortby = styled.div``;
// const BoxContainer = styled.div`
// display:flex;
// `;
// const Button = styled.div``;
// const Btn = styled.div``

export default List;
