import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const pressDummy = [
  {
    image: "pressBox",
    title: "Scam Alert! Watch out The Recharge Telegram scam channel",
  },
  {
    image: "pressBox",
    title: "Scam Alert! Watch out The Recharge Telegram scam channel",
  },
  {
    image: "pressBox",
    title: "Scam Alert! Watch out The Recharge Telegram scam channel",
  },
  {
    image: "pressBox",
    title: "Scam Alert! Watch out The Recharge Telegram scam channel",
  },
];

function Slider({ setParams, params }) {
  const [t] = useTranslation();
  return (
    <Container>
      <Content>
        {pressDummy.map((news) => (
          <News image={news.image} title={news.title} />
        ))}
      </Content>
    </Container>
  );
}

function News({ image, title }) {
  return (
    <div className="box" style={{ cursor: "pointer" }}>
      <img src={`${image}.svg`} />
      <p
        className={
          window.innerWidth > 1088
            ? "Roboto_20pt_Regular_L"
            : "Roboto_30pt_Regular_L"
        }
      >
        {title}
      </p>
    </div>
  );
}

const Container = styled.div`
  margin-top: 40px;
  display: flex;
  width: 100%;

  @media (min-width: 1088px) {
    display: flex;
    justify-content: center;
    // width: 1088px;
  }
`;
const Content = styled.div`
  display: flex;
  max-width: 1088px;
  // white-space: nowrap;
  overflow: auto;
  gap: 0px 20px;
  border
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  a {
    color: white;
  }
  div {
    &:hover{
      background-color: var(--Regular-20);
      border-radius: 10px;
    }
  }
  .box {
    width: 326px;

  }
  .disable {
    cursor: not-allowed;
    opacity: 0.5;
  }

  @media (min-width: 1088px) {
    gap: 10px;
  }
`;

export default React.memo(Slider);
