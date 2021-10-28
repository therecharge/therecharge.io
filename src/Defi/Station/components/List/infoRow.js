import styled, { css } from "styled-components";

export default function Info({ left, right, direction = "" }) {
  return (
    <Container direction={direction}>
      <div className={`${window.innerWidth > 1088 ? "Roboto_20pt_Light" : "Roboto_30pt_Light"} left`}>{left}</div>
      <div className={`${window.innerWidth > 1088 ? "Roboto_20pt_Black" : "Roboto_30pt_Black"} right`}>{right}</div>
    </Container>
  );
}

const Container = styled.div`
${props => {
    return css`
  display: flex;
  color: white;
  flex-direction: ${props.direction};
  margin-bottom: ${props.direction ? "64px" : ""};
  .left {
    margin: auto auto;
    margin-left: ${props.direction ? "" : 0};
    margin-bottom: ${props.direction ? "16px" : ""};

    @media (min-width: 1088px) {
      margin-left: 0px;
      margin-bottom: 0px;
    }
  }
  .right {
    margin: auto auto;
    margin-right: ${props.direction ? "" : 0};

    @media (min-width: 1088px) {
      margin-right: 0px;
    }
  }

  @media (min-width: 1088px) {
    display: flex;
    flex-direction: row;
  }`
  }}
`;
