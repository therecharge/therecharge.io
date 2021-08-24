import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

function Slider({ setParams }) {
  const [t] = useTranslation();
  return (
    <Container>
      <Content>
        <Button setParams={setParams} type="Flexible" text="Flexible Staking" />
        <Button
          setParams={setParams}
          type="Flexible"
          text="LP Flexible Staking"
        />
        <Button setParams={setParams} type="Locked" text="Locked Staking" />
        <Button setParams={setParams} type="Locked" text="LP Locked Staking" />
      </Content>
    </Container>
  );
}
const Container = styled.div`
  margin-top: 40px;
  display: flex;
  width: 100%;

  @media (min-width: 1088px) {
    justify-content: center;
  }
`;
const Content = styled.div`
  display: flex;
  max-width: 1088px;
  white-space: nowrap;
  overflow: auto;
  a {
    color: white;
  }

  @media (min-width: 1088px) {
    gap: 10px;
  }
`;

export default React.memo(Slider);

function Button({ type, text, setParams }) {
  const Container = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 300px;
    height: 350px;
    background-color: #1c1e35;
    margin: 0px 10px 0px 10px;
    img {
      margin: auto auto;
      margin-bottom: 0px;
      height: 60px;
    }
    p {
      margin: auto auto;
      margin-top: 20px;
    }
    @media (min-width: 1088px) {
      min-width: 260px;
      margin: 0;
      // gap: 5px;
    }
  `;
  let params;
  if (type === "Locked") {
    if (text.includes("LP")) {
      params = {
        type: "Locked",
        isLP: true,
        address: "0x",
      };
    } else {
      params = {
        type: "Locked",
        isLP: false,
        address: "0x",
      };
    }
  } else {
    if (text.includes("LP")) {
      params = {
        type: "Flexible",
        isLP: true,
        address: "0x",
      };
    } else {
      params = {
        type: "Flexible",
        isLP: false,
        address: "0x",
      };
    }
  }
  return (
    <Container onClick={() => setParams(params)}>
      <img
        src={
          type === "Locked"
            ? text.includes("LP")
              ? "/ic_lockedstaking_lp.svg"
              : "/ic_lockedstaking.svg"
            : text.includes("LP")
            ? "/ic_flexiblestaking_lp.svg"
            : "/ic_flexiblestaking.svg"
        }
      />
      <p className="Roboto_30pt_Black">{text}</p>
    </Container>
  );
}
