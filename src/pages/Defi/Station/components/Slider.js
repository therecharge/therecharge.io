import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

function Slider({}) {
  const [t] = useTranslation();
  return (
    <Container>
      <Content>
        <Button type="flexible" text="Flexible Staking" />
        <Button type="flexible" text="LP Flexible Staking" />
        <Button type="locked" text="Locked Staking" />
        <Button type="locked" text="LP Locked Staking" />
      </Content>
    </Container>
  );
}
const Container = styled.div`
  margin-top: 40px;
  display: flex;
  width: 100%;
`;
const Content = styled.div`
  display: flex;
  max-width: 1188px;
  white-space: nowrap;
  overflow: auto;
  a {
    color: white;
  }
`;

export default React.memo(Slider);

function Button({ type, text }) {
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
  `;
  return (
    <Container>
      <img
        src={
          type === "locked"
            ? "/ic_lockedstaking.svg"
            : "/ic_flexiblestaking.svg"
        }
      />
      <p className="Roboto_30pt_Black">{text}</p>
    </Container>
  );
}
