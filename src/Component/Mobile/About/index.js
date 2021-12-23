import { useEffect, useState } from "react";
import styled from "styled-components";
import Modal from "./modal";
import { withTranslation } from "react-i18next";

import Slider from "./Slider";

function About({ t }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [firstVideo, setFirstVideo] = useState(false);
  const [secondVideo, setSecondVideo] = useState(false);
  const disableVideoStyle = {
    position: "absolute",
    zIndex: "-100",
    top: 0,
    width: 0,
    height: 0,
    left: 0,
  };

  const run = (type) => {
    if (type == "firstVideo") {
      setFirstVideo(true);
      // let videoPlayer = document.getElementById(type);
      // let nextVideoName = "/roll/w3r.mp4";
      // videoPlayer.src = nextVideoName;
      // videoPlayer.loop = true;
      // videoPlayer.play();
    } else if (type == "secondVideo") {
      setSecondVideo(true);
      // let videoPlayer = document.getElementById(type);
      // let nextVideo = "/roll/w4r.mp4"
      // videoPlayer.src = nextVideo;
      // videoPlayer.loop = true;
      // videoPlayer.play();
    }
  };

  const handleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <Container
      style={
        modalOpen
          ? {
              position: "fixed",
              // width: "100%",
              // backgroundColor: "#02051c",
            }
          : {}
      }
    >
      <Content id="aboutSection1">
        <div className="first">
          <div className="theme text Roboto_50pt_Black_Mobile">Ecosystem</div>
          <div className="content">
            {!firstVideo && (
              <video
                id="firstVideo"
                preload="auto"
                autoPlay
                muted
                playsInline
                width="620px"
                height="862px"
                onEnded={() => run("firstVideo")}
              >
                <source id="firstSource" src="/open/m3o.mp4" type="video/mp4" />
                Sorry, your browser doesn't support embedded videos.
              </video>
            )}
            <video
              id="firstVideo"
              loop
              preload="auto"
              style={firstVideo ? undefined : disableVideoStyle}
              autoPlay
              playsInline
              muted
              width="620px"
              height="862px"
            >
              <source id="firstSource" src="/roll/m3r.mp4" type="video/mp4" />
              Sorry, your browser doesn't support embedded videos.
            </video>
            {/* <img
              src="/aboutECO_mobile.png"
              style={{ marginBottom: "40px", width: "620px", height: "862px" }}
            /> */}
          </div>
          <div
            className="text text Roboto_30pt_Regular_Mobile"
            style={{ margin: "40px 50px" }}
          >
            {t("About/Ecosystem")}
          </div>
          <div
            className="moreDetails text Roboto_30pt_Regular_Detail"
            onClick={() => handleModal()}
          >
            More details<span>〉</span>
          </div>
        </div>
      </Content>
      <Content id="aboutSection2">
        <div className="second">
          <div className="theme text Roboto_50pt_Black_Mobile">
            Recharge Virtuous Cycle
          </div>
          <div className="content">
            {!secondVideo && (
              <video
                id="secondVideo"
                preload="auto"
                autoPlay
                muted
                playsInline
                width="584px"
                height="460px"
                onEnded={() => run("secondVideo")}
              >
                <source
                  id="secondSource"
                  src="/open/m4o.mp4"
                  type="video/mp4"
                />
                Sorry, your browser doesn't support embedded videos.
              </video>
            )}
            <video
              id="secondVideo"
              loop
              preload="auto"
              style={secondVideo ? undefined : disableVideoStyle}
              autoPlay
              muted
              playsInline
              width="584px"
              height="460px"
            >
              <source id="secondSource" src="/roll/m4r.mp4" type="video/mp4" />
              Sorry, your browser doesn't support embedded videos.
            </video>
            {/* <img
              src="/aboutRVC_mobile.png"
              style={{ margin: "80px auto", width: "584px", height: "460px" }}
            /> */}
          </div>
          <div
            className="text text Roboto_30pt_Regular_Mobile"
            style={{ margin: "0 50px", marginBottom: "180px" }}
          >
            {t("About/Recharge-Virtuous-Cycle")}
          </div>
        </div>
      </Content>
      <Content id="aboutSection3">
        <div className="third">
          <div className="theme text Roboto_50pt_Black">Team members</div>
          <div className="members">
            <div
              className="nft"
              style={{ cursor: "pointer" }}
              onClick={() => {
                window.open(
                  "https://www.bakeryswap.org/#/exchange/artworkInfo/16350/0/1?type=111&level=v3",
                  "_blank"
                );
              }}
            >
              <img
                style={{ width: "169px", height: "238px" }}
                src="./aboutJaylee.png"
              />
            </div>
            <div className="member">
              <div className="name text Roboto_30pt_Black_L">
                {t("About/Member/jayLee/title")}
              </div>
              <div className="desc text Roboto_25pt_Regular">
                {t("About/Member/jayLee/content")}
              </div>
            </div>
          </div>
          <div className="members">
            <div
              className="nft"
              // style={{ cursor: "pointer" }}
              // onClick={() => {
              //   window.open(
              //     "https://www.bakeryswap.org/#/exchange/artworkInfo/17054/0/1?type=111&level=v3",
              //     "_blank"
              //   );
              // }}
            >
              <img
                style={{ width: "169px", height: "238px" }}
                src="./aboutJakekim.png"
              />
            </div>
            <div className="member">
              <div className="name text Roboto_30pt_Black_L">
                {t("About/Member/jakeKim/title")}
              </div>
              <div className="desc text Roboto_25pt_Regular">
                {t("About/Member/jakeKim/content")}
              </div>
            </div>
          </div>
          <div className="members">
            <div
              className="nft"
              style={{ cursor: "pointer" }}
              onClick={() => {
                window.open(
                  "https://www.bakeryswap.org/#/exchange/artworkInfo/17054/0/1?type=111&level=v3",
                  "_blank"
                );
              }}
            >
              <img
                style={{ width: "169px", height: "238px" }}
                src="./aboutEk.png"
              />
            </div>
            <div className="member">
              <div className="name text Roboto_30pt_Black_L">
                {t("About/Member/ethanKang/title")}
              </div>
              <div className="desc text Roboto_25pt_Regular">
                {t("About/Member/ethanKang/content")}
              </div>
            </div>
          </div>
        </div>
      </Content>
      <Content id="aboutSection4">
        <div className="third">
          <div className="theme text Roboto_50pt_Black">Advisors</div>
          <div className="members">
            <div
              className="nft"
              style={{ cursor: "pointer" }}
              onClick={() => {
                window.open(
                  "https://www.bakeryswap.org/#/exchange/artworkInfo/17052/0/1?type=111&level=v3",
                  "_blank"
                );
              }}
            >
              <img
                style={{ width: "169px", height: "238px" }}
                src="/aboutSinhaeLee.png"
              />
            </div>
            <div className="member">
              <div className="name text Roboto_30pt_Black_L">
                {t("About/Advisor/SinhaeLee/title")}
              </div>
              <div className="desc text Roboto_25pt_Regular">
                {t("About/Advisor/SinhaeLee/content")}
              </div>
            </div>
          </div>
          <div className="members">
            <div
              className="nft"
              style={{ cursor: "pointer" }}
              onClick={() => {
                window.open(
                  "https://www.bakeryswap.org/#/exchange/artworkInfo/16348/0/1?type=111&level=v3",
                  "_blank"
                );
              }}
            >
              <img
                style={{ width: "169px", height: "238px" }}
                src="/aboutJonathanLee.png"
              />
            </div>
            <div className="member">
              <div className="name text Roboto_30pt_Black_L">
                {t("About/Advisor/JonathanLee/title")}
              </div>
              <div className="desc text Roboto_25pt_Regular">
                {t("About/Advisor/JonathanLee/content")}
              </div>
            </div>
          </div>
          <div className="members">
            <div
              className="nft"
              // style={{ cursor: "pointer" }}
              // onClick={() => {
              //   window.open(
              //     "https://www.bakeryswap.org/#/exchange/artworkInfo/16348/0/1?type=111&level=v3",
              //     "_blank"
              //   );
              // }}
            >
              <img
                style={{ width: "169px", height: "238px" }}
                src="/aboutSeungbum.png"
              />
            </div>
            <div className="member">
              <div className="name text Roboto_30pt_Black_L">
                {t("About/Advisor/Seungbum/title")}
              </div>
              <div className="desc text Roboto_25pt_Regular">
                {t("About/Advisor/Seungbum/content")}
              </div>
            </div>
          </div>
          <div className="members">
            <div
              className="nft"
              // style={{ cursor: "pointer" }}
              // onClick={() => {
              //   window.open(
              //     "https://www.bakeryswap.org/#/exchange/artworkInfo/16348/0/1?type=111&level=v3",
              //     "_blank"
              //   );
              // }}
            >
              <img
                style={{ width: "169px", height: "238px" }}
                src="/aboutJason.png"
              />
            </div>
            <div className="member">
              <div className="name text Roboto_30pt_Black_L">
                {t("About/Advisor/aboutJason/title")}
              </div>
              <div className="desc text Roboto_25pt_Regular">
                {t("About/Advisor/aboutJason/content")}
              </div>
            </div>
          </div>
        </div>
      </Content>
      <Content id="aboutSection5">
        <div className="fifth">
          <div className="theme text Roboto_50pt_Black_Mobile">Medium</div>
          <Slider />
        </div>
      </Content>
      <Content id="aboutSection6">
        <div className="fourth">
          <div className="theme text Roboto_50pt_Black_Mobile">
            Recharge is on
          </div>
          <div className="partners">
            <div className="tier">
              <div
                className="partner"
                onClick={() => {
                  window.open(
                    "https://app.uniswap.org/#/swap?inputCurrency=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&outputCurrency=0xe74be071f3b62f6a4ac23ca68e5e2a39797a3c30",
                    "_blank"
                  );
                }}
              >
                <div className="logo">
                  <img
                    alt=""
                    src="/aboutUniswap.png"
                    style={{ height: "70px", width: "60.8px" }}
                  />
                </div>
                <div className="desc">
                  <div className="text Roboto_20pt_Regular_Mobile">
                    {t("About/Recharge-is-on/1")}
                  </div>
                </div>
              </div>
              <div
                className="partner"
                onClick={() => {
                  window.open(
                    "https://coinmarketcap.com/currencies/recharge/",
                    "_blank"
                  );
                }}
              >
                <div className="logo">
                  <img
                    src="/aboutCMC.png"
                    style={{ height: "70px", width: "68.9px" }}
                  />
                </div>
                <div className="desc text Roboto_20pt_Regular">
                  <div className="text  text Roboto_20pt_Regular_Mobile">
                    {t("About/Recharge-is-on/2")}
                  </div>
                </div>
              </div>
            </div>
            <div className="tier">
              <div
                className="partner"
                onClick={() => {
                  window.open(
                    "https://www.coingecko.com/en/coins/recharge",
                    "_blank"
                  );
                }}
              >
                <div className="logo">
                  <img
                    src="/ic_coingecko.svg"
                    style={{ height: "70px", width: "66.4px" }}
                  />
                </div>
                <div className="desc text Roboto_20pt_Regular">
                  <div className="text Roboto_20pt_Regular_Mobile">
                    {t("About/Recharge-is-on/3-1")}
                  </div>
                </div>
              </div>

              <div
                className="partner"
                onClick={() => {
                  window.open(
                    "https://nomics.com/assets/rcg-recharge?utm_source=twitter&utm_medium=bot&utm_campaign=new_asset&utm_content=rcg&d=1630561474",
                    "_blank"
                  );
                }}
              >
                <div className="logo">
                  <img
                    alt=""
                    src="/aboutNomics.png"
                    style={{ height: "70px", width: "66.4px" }}
                  />
                </div>
                <div className="desc text Roboto_20pt_Regular">
                  <div className="text Roboto_20pt_Regular_Mobile">
                    {t("About/Recharge-is-on/6")}
                  </div>
                </div>
              </div>
            </div>
            <div className="tier">
              <div
                className="partner"
                onClick={() => {
                  window.open(
                    "https://xangle.io/project/RCG/key-info",
                    "_blank"
                  );
                }}
              >
                <div className="logo">
                  <img
                    alt=""
                    src="/aboutXangle.png"
                    style={{ height: "70px", width: "66.4px" }}
                  />
                </div>
                <div className="desc text Roboto_20pt_Regular">
                  <div className="text Roboto_20pt_Regular_Mobile">
                    {t("About/Recharge-is-on/3")}
                  </div>
                </div>
              </div>
              <div
                className="partner"
                onClick={() => {
                  window.open("https://cobak.co.kr/community/146", "_blank");
                }}
              >
                <div className="logo">
                  <img
                    src="/aboutCobak.png"
                    style={{
                      height: "42.2px",
                      width: "100px",
                      marginTop: "21px",
                      marginBottom: "7px",
                    }}
                  />
                </div>

                <div className="desc text Roboto_16pt_Regular">
                  <div className="text Roboto_20pt_Regular_Mobile">
                    {t("About/Recharge-is-on/4")}
                  </div>
                </div>
              </div>
            </div>
            <div className="tier">
              <div
                className="partner"
                onClick={() => {
                  window.open(
                    "https://snapshot.org/#/therecharge.eth",
                    "_blank"
                  );
                }}
              >
                <div className="logo">
                  <img
                    src="/aboutSnap.png"
                    style={{ height: "70px", width: "58.5px" }}
                  />
                </div>
                <div className="desc text Roboto_16pt_Regular">
                  <div className="text Roboto_20pt_Regular_Mobile">
                    {t("About/Recharge-is-on/5")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Content>
      <Modal modalOpen={modalOpen} handleModal={handleModal} />
    </Container>
  );
}
const Container = styled.div`
  margin: auto auto;
  width: 720px;
  overflow-x: hidden;
  // background-color: #02051c;
  // background-image: (/bg_about.svg);
`;
const Content = styled.div`
  display: flex;

  .text {
    white-space: pre-line;
  }
  .first {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    margin-top: 60px;

    .theme {
      margin: 120px auto;
      text-shadow: 0 0 40px rgba(255, 255, 255, 0.5);
    }

    .content {
      display: flex;
      margin: auto auto;
      img {
        margin: auto auto;
      }
    }
    .text {
      margin: 40px auto;
    }
    .moreDetails {
      width: 230px;
      margin: 0 auto;
      margin-bottom: 60px;
      border-bottom: 1px solid var(--yellow);
      span {
        margin-left: 10px;
      }
    }
  }

  .second {
    display: flex;
    margin: auto auto;
    flex-direction: column;

    .theme {
      margin: 120px auto;
      text-shadow: 0 0 40px rgba(255, 255, 255, 0.5);
    }

    .content {
      display: flex;
      margin: 0 auto;
      margin-bottom: 80px;
      img {
        margin: auto auto;
      }
    }

    .text {
      margin-bottom: 180px;
    }
  }

  .third {
    display: flex;
    margin: 0 auto;
    flex-direction: column;

    .theme {
      margin: 120px auto;
      text-shadow: 0 0 40px rgba(255, 255, 255, 0.5);
    }

    .members {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-bottom: 16px;

      .nft{
        display: flex;
        margin: 40px auto 16px auto;
        width: 169px;
        height: 237.7px;
        // margin-right: 14px;
      }

        .member {
          display: flex;
          flex-direction: column;
          width: 620px;
          height: 310px;
          padding: 40px;
          box-sizing: border-box;
          border-radius: 10px;
          background-color: var(--black-30);

          .name {
            margin: 0;
            margin-bottom: 16px;
          }
        }
      }
    }
  }

  .fourth {
    display: flex;
    flex-direction: column;
    margin: 0 auto;

    .theme {
      margin: 120px auto;
      text-shadow: 0 0 40px rgba(255, 255, 255, 0.5);
    }

    .partners {
      display: flex;
      flex-direction: column;
      margin: 0 auto;
      margin-bottom: 180px;

      .tier {
        display: flex;

        .partner {
          display: flex;
          flex-direction: column;
          width: 310px;
          height: 182px;

          .logo {
            margin: 20px auto;
          }

          .desc {
            display: flex;
            flex-direction: column;

            div {
              margin: auto auto;
            }
          }
        }
        .partner:active {
          background-color: rgba(255, 255, 255, 0.2);
        }
      }
    }
  }

  .fifth {
    display: flex;
    flex-direction: column;
    width: 720px;

    .theme {
      margin: 120px auto;
      text-shadow: 0 0 40px rgba(255, 255, 255, 0.5);
    }
  }
`;

export default withTranslation()(About);
