import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

function Slider({ setParams, params }) {
  const { t } = useTranslation();
  const pressDummy = [
    {
      image: "medium1",
      title: t("About/Medium/1/title"),
      url: t("About/Medium/1/url"),
    },
    {
      image: "medium2",
      title: t("About/Medium/2/title"),
      url: t("About/Medium/2/url"),
    },
    {
      image: "medium3",
      title: t("About/Medium/3/title"),
      url: t("About/Medium/3/url"),
    },
    {
      image: "medium4",
      title: t("About/Medium/4/title"),
      url: t("About/Medium/4/url"),
    },
    {
      image: "medium5",
      title: t("About/Medium/5/title"),
      url: t("About/Medium/5/url"),
    },
    {
      image: "medium6",
      title: t("About/Medium/6/title"),
      url: t("About/Medium/6/url"),
    },
    {
      image: "medium7",
      title: t("About/Medium/7/title"),
      url: t("About/Medium/7/url"),
    },
    {
      image: "medium8",
      title: t("About/Medium/8/title"),
      url: t("About/Medium/8/url"),
    },
    {
      image: "medium9",
      title: t("About/Medium/9/title"),
      url: t("About/Medium/9/url"),
    },
  ];
  return (
    <Container>
      <Content>
        {pressDummy.map((news) => (
          <News image={news.image} title={news.title} url={news.url} />
        ))}
      </Content>
    </Container>
  );
}

function News({ image, title, url }) {
  return (
    <div
      className="box"
      style={{ cursor: "pointer" }}
      onClick={() => {
        window.open(url, "_blank");
      }}
    >
      <img src={`${image}.png`} />
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
