import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
//components
import Image from "./List/image.js";
import Row from "./List/row.js";
import {
  poolInfoState,
  selState,
  periodState,
} from "../../../../store/pool.js";

function List({ /*type, list,*/ params }) {
  const [t] = useTranslation();
  const [chList, setChList] = useState([
    {
      address: "0x00",
      name: "Now Loading",
      apy: "000",
      period: [1625022000, 14400],
      redemtion: 200,
      symbol: ["RCG", "RCG"],
      token: [
        "0xbddC276CACC18E9177B2f5CFb3BFb6eef491799b",
        "0xbddC276CACC18E9177B2f5CFb3BFb6eef491799b",
      ],
      tvl: 0,
      type: "flexible",
    },
    {
      address: "0x0",
      apy: 0.0,
      name: "Loading...",
      period: [1625022000, 14400],
      redemtion: 200,
      symbol: ["RCG", "RCG"],
      token: [
        "0xbddC276CACC18E9177B2f5CFb3BFb6eef491799b",
        "0xbddC276CACC18E9177B2f5CFb3BFb6eef491799b",
      ],
      tvl: 0,
      type: "flexible",
    },
  ]);
  const [sel, setSelCharger] = useState(0);
  const [poolInfo, setPoolInfo] = useRecoilState(poolInfoState);
  const [period, setPeriod] = useRecoilState(periodState);

  const loadChargerList = async () => {
    try {
      // GET Pool list(Charging list) from back by staking type(Flexible/Locked and LP or not)
      let { data } = await axios.get(
        `https://bridge.therecharge.io/charger/list/type/${params.type.toLowerCase()}`
      );
      // pool 미제공 시 data 값 확인 후 분기 처리
      if (data.length === 0) {
        setChList([
          {
            address: "0x00",
            name: "No supplied pool",
            apy: "0",
            period: [1625022000, 14400],
            redemtion: 200,
            symbol: ["RCG", "RCG"],
            token: [
              "0xbddC276CACC18E9177B2f5CFb3BFb6eef491799b",
              "0xbddC276CACC18E9177B2f5CFb3BFb6eef491799b",
            ],
            tvl: 0,
            type: "flexible",
          },
        ]);
        return;
      }

      // GET each Pool information from back
      let returnValue = await Promise.all(
        data.map(async (d) => {
          try {
            let { data } = await axios.get(
              `https://bridge.therecharge.io/charger/info/${d.address}`
            );
            let tempTime = loadPoolPeriod(data.period[0], data.period[1]);
            let status = loadActiveStatus(data);
            return {
              ...d,
              ...data,
              name: `${data.name.substring(0, 13)}`,
              apy:
                data.apy > 0
                  ? data.apy > 1000
                    ? "999+"
                    : `${data.apy.toFixed(4)}`
                  : 0,
              status: status,
              timeStamp: tempTime,
            };
          } catch (err) {
            console.log(err);
          }
        })
      );
      setChList(returnValue);
    } catch (err) {
      console.log(err);
      console.log("There are no supplied pools");
    }
    return;
  };

  // Whenever Staking type is changed, reload Pool list
  useEffect(async () => {
    // setOnLoading(true);
    try {
      await loadChargerList();
    } catch (err) {
      console.log(err);
    }
  }, [params]);

  return (
    <Container>
      <Content>
        <Title>
          <Image params={params} />
          <p className="Roboto_40pt_Black">Charger List</p>
        </Title>
        <RowContainer>
          {/* <Row status="Active" name="Test" apy="100" />
          <Row status="Inactive" />
          <Row status="Active" /> */}
          {chList.map((charger, index) => {
            return (
              <Row
                key={index}
                status={charger.status}
                name={charger.name}
                apy={charger.apy}
                info={charger}
                params={params}
              />
            );
          })}
        </RowContainer>
      </Content>
    </Container>
  );
}

function makeNum(str, decimal = 4) {
  let newStr = str;
  if (typeof newStr === "number") newStr = str.toString();
  let arr = newStr.split(".");
  if (arr.length == 1 || arr[0].length > 8) return arr[0];
  else {
    return arr[0] + "." + arr[1].substr(0, decimal);
  }
}

const loadPoolPeriod = (startTime, duration) => {
  let ret = "21.01.01 00:00:00 ~ 21.01.30 00:00:00(GMT)";
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

const loadActiveStatus = ({ tvl, period, limit }) => {
  if (period[0] + period[1] >= new Date().getTime() / 1000) {
    if (!limit || limit > tvl) {
      return "Active";
    } else {
      return "Close";
    }
  } else {
    return "Inactive";
  }
};

const Container = styled.div`
  margin-top: 40px;
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
  p {
    color: white;
    margin: auto;
    margin-top: 20px;

    @media (min-width: 1088px) {
      margin: 0;
      margin-left: 20px;
      margin-bottom: 0px;
  }
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: 1088px) {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-end;
  }
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 40px 50px 0px 50px;

  @media (min-width: 1088px) {
    margin: 0px;
    margin-top: 40px;
  }
`;

export default React.memo(List);
