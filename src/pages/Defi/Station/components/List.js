import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
// import { useRecoilState } from "recoil";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
//components
import Image from "./List/image.js";
import Row from "./List/row.js";
// import {
//   poolInfoState,
//   selState,
//   periodState,
// } from "../../../../store/pool.js";

const loading_data = [
  {
    address: "0x0",
    apy: 0.0,
    name: "Loading List..",
    period: [1625022000, 14400],
    redemtion: 200,
    symbol: ["RCG", "RCG"],
    token: [
      "0x76E7BE90D0BF6bfaa2CA07381169654c6b45793F", // ropsten 토큰주소
      "0x76E7BE90D0BF6bfaa2CA07381169654c6b45793F",
    ],
    tvl: 0,
    type: "flexible",
  },
]

function List({ /*type, list,*/ params, toast }) {
  const [t] = useTranslation();
  const [chList, setChList] = useState(loading_data);
  const [sel, setSelCharger] = useState(0);
  // const [sel, setSelCharger] = useState(0);
  // const [poolInfo, setPoolInfo] = useRecoilState(poolInfoState);
  // const [period, setPeriod] = useRecoilState(periodState);

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
            name: "There is currently no Charger List available.",
            apy: "0",
            period: [1625022000, 14400],
            redemtion: 200,
            symbol: ["RCG", "RCG"],
            token: [
              "0x76E7BE90D0BF6bfaa2CA07381169654c6b45793F",
              "0x76E7BE90D0BF6bfaa2CA07381169654c6b45793F",
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
                Number(data.apy) > 0
                  ? Number(data.apy) >= 1000000
                    ? "999999+"
                    : `${makeNum(Number(data.apy))}`
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
    setChList(loading_data);
    try {
      await loadChargerList();
    } catch (err) {
      console.log(err);
    }
  }, [params]);

  const updateChargerInfoList = () => {
    loadChargerList();
  };

  const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  };

  // useInterval(() => updateChargerInfoList(), 10000);

  return (
    <Container>
      <Content>
        <Title>
          <Image params={params} />
          <p className={window.innerWidth > 1088 ? "Roboto_30pt_Black" : "Roboto_40pt_Black"}>Charger List</p>
        </Title>
        <RowContainer>
          {chList.map((charger, index) => {
            return (
              <div
                // sel 하면 안됨 -> 2개 이상 오픈했을 경우에는?
                // 각 row에서 디테일 오픈 시 각자 loadmethod 되도록 해야하지 않을까?
                // 미리 전체 로드할 때 과부하 가능성 있음
                onClick={() => {
                  // setSelCharger(index);
                }}
                className={params.isLP ? "disable" : ""}

              >
                <Row
                  key={index}
                  status={charger.status} // active or not
                  name={charger.name}
                  apy={charger.apy}
                  info={charger}
                  params={params} // 버튼에 대한 분기처리 때문에 필요
                  toast={toast}
                // chList={chList} // 전체 리스트 왜?
                // sel={sel} // 선택 해야만 하는가?
                />
              </div>
            );
          })}
        </RowContainer>
      </Content>
    </Container>
  );
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
  if (period[0] > new Date().getTime() / 1000 || period[0] + period[1] < new Date().getTime() / 1000) {
    return "Inactive";
  }
  if (period[0] + period[1] >= new Date().getTime() / 1000) {
    if (!limit || limit > tvl) {
      return "Active";
    } else {
      return "Close";
    }
  }
};
function makeNum(str, decimal = 4) {
  let newStr = str;
  if (typeof newStr === "number") newStr = str.toString();
  let arr = newStr.split(".");
  if (arr.length == 1 || arr[0].length > 8) return arr[0];
  else {
    return arr[0] + "." + arr[1].substr(0, decimal);
  }
};

const Container = styled.div`
  margin-top: 40px;
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
  margin: 40px 30px 0px 30px;


  @media (min-width: 1088px) {
    margin: 0px;
    margin-top: 40px;
  }

  .disable {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export default React.memo(List);
