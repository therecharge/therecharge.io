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
    justify-content: center;
  }
`;
const Content = styled.div`
  display: flex;
  max-width: 1088px;
  // white-space: nowrap;
  overflow: auto;
  gap: 0px 20px;
  margin: 0 50px;
  border
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  img {
    width: 380px;
    height: 200px;
  }
  p {
    margin-top: 16px;
    color: white;
  }
  div {
    &:hover{
      background-color: var(--black-20);
      border-radius: 10px;
    }
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
