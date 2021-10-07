import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import AboutSlider from "../../Components/Common/Slider/AboutSlider";

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
  ];
  return (
    <Container>
      <Content>
        {pressDummy.map((news) => (
          <News image={news.image} title={news.title} url={news.url} />
        ))}
      </Content>
      {/* 위 내용은 잠시 보류. 아무 컨텐츠 없이 빈 div 띄워놓음 */}
      <AboutSlider>
        <SliderContent>
          <div
            className="slide"
            onClick={() => {
              window.open(t("About/Medium/1/url"), "_blank");
            }}
          >
            <img
              src="/medium1.png"
              style={{ width: "305px", height: "173px" }}
            />
            <div
              className={
                window.innerWidth > 1088
                  ? "Roboto_20pt_Regular_L"
                  : "Roboto_30pt_Regular_L"
              }
              style={{ width: "305px" }}
            >
              {t("About/Medium/1/title")}
            </div>
          </div>
          <div
            className="slide"
            onClick={() => {
              window.open(t("About/Medium/2/url"), "_blank");
            }}
          >
            <img
              src="/medium2.png"
              style={{ width: "305px", height: "173px" }}
            />
            <div
              className={
                window.innerWidth > 1088
                  ? "Roboto_20pt_Regular_L"
                  : "Roboto_30pt_Regular_L"
              }
              style={{ width: "305px" }}
            >
              {t("About/Medium/2/title")}
            </div>
          </div>
          <div
            className="slide"
            onClick={() => {
              window.open(t("About/Medium/3/url"), "_blank");
            }}
          >
            <img
              src="/medium3.png"
              style={{ width: "305px", height: "173px" }}
            />
            <div
              className={
                window.innerWidth > 1088
                  ? "Roboto_20pt_Regular_L"
                  : "Roboto_30pt_Regular_L"
              }
              style={{ width: "305px" }}
            >
              {t("About/Medium/3/title")}
            </div>
          </div>
        </SliderContent>
        <SliderContent>
          <div
            className="slide"
            onClick={() => {
              window.open(t("About/Medium/4/url"), "_blank");
            }}
          >
            <img
              src="/medium4.png"
              style={{ width: "305px", height: "173px" }}
            />
            <div
              className={
                window.innerWidth > 1088
                  ? "Roboto_20pt_Regular_L"
                  : "Roboto_30pt_Regular_L"
              }
              style={{ width: "305px" }}
            >
              {t("About/Medium/4/title")}
            </div>
          </div>
          <div
            className="slide"
            onClick={() => {
              window.open(t("About/Medium/5/url"), "_blank");
            }}
          >
            <img
              src="/medium5.png"
              style={{ width: "305px", height: "173px" }}
            />
            <div
              className={
                window.innerWidth > 1088
                  ? "Roboto_20pt_Regular_L"
                  : "Roboto_30pt_Regular_L"
              }
              style={{ width: "305px" }}
            >
              {t("About/Medium/5/title")}
            </div>
          </div>
          <div
            className="slide"
            onClick={() => {
              window.open(t("About/Medium/6/url"), "_blank");
            }}
          >
            <img
              src="/medium6.png"
              style={{ width: "305px", height: "173px" }}
            />
            <div
              className={
                window.innerWidth > 1088
                  ? "Roboto_20pt_Regular_L"
                  : "Roboto_30pt_Regular_L"
              }
              style={{ width: "305px" }}
            >
              {t("About/Medium/6/title")}
            </div>
          </div>
        </SliderContent>
        <SliderContent>
          <div
            className="slide"
            onClick={() => {
              window.open(t("About/Medium/7/url"), "_blank");
            }}
          >
            <img
              src="/medium7.png"
              style={{ width: "305px", height: "173px" }}
            />
            <div
              className={
                window.innerWidth > 1088
                  ? "Roboto_20pt_Regular_L"
                  : "Roboto_30pt_Regular_L"
              }
              style={{ width: "305px" }}
            >
              {t("About/Medium/7/title")}
            </div>
          </div>
          <div
            className="slide"
            onClick={() => {
              window.open(t("About/Medium/8/url"), "_blank");
            }}
          >
            <img
              src="/medium8.png"
              style={{ width: "305px", height: "173px" }}
            />
            <div
              className={
                window.innerWidth > 1088
                  ? "Roboto_20pt_Regular_L"
                  : "Roboto_30pt_Regular_L"
              }
              style={{ width: "305px" }}
            >
              {t("About/Medium/8/title")}
            </div>
          </div>
          <div
            className="slide"
            onClick={() => {
              window.open(t("About/Medium/9/url"), "_blank");
            }}
          >
            <img
              src="/medium9.png"
              style={{ width: "305px", height: "173px" }}
            />
            <div
              className={
                window.innerWidth > 1088
                  ? "Roboto_20pt_Regular_L"
                  : "Roboto_30pt_Regular_L"
              }
              style={{ width: "305px" }}
            >
              {t("About/Medium/9/title")}
            </div>
          </div>
        </SliderContent>
      </AboutSlider>
    </Container>
  );
}

function News({ image, title, url }) {
  return (
    <div className="box">
      <div style={{ width: "327px" }} />
      <p
        className={
          window.innerWidth > 1088
            ? "Roboto_20pt_Regular_L"
            : "Roboto_30pt_Regular_L"
        }
      ></p>
    </div>
  );
}

const Container = styled.div`
  flex-direction: column;
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

const SliderContent = styled.div`
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
  .disable {
    cursor: not-allowed;
    opacity: 0.5;
  }

  @media (min-width: 1088px) {
    gap: 10px;
  }
`;

export default React.memo(Slider);
