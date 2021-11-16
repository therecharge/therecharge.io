import styled from "styled-components";
import { ReactComponent as RCGeth } from "./assets/RCGETH.svg";
export default function Balance({
  Image = RCGeth,
  symbol = "RCG",
  balance = "100,000.000",
}) {
  return (
    <Container>
      <div className="img">
        <Image style={{ width: "100%", height: "100%" }} />
      </div>
      <Left className={window.innerWidth > 1088 ? "Roboto_20pt_Regular" : "Roboto_25pt_Regular"}>{symbol}</Left>
      <Right className={window.innerWidth > 1088 ? "Roboto_20pt_Light" : "Roboto_25pt_Light"}>{balance}</Right>
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  width: 100%;

  .img {
    width: 60px;
    height: 60px;

    @media (min-width: 1088px) {
      width: 30px;
      height: 30px;
    }
  }
`;
const Left = styled.div`
  margin: auto 0;
  margin-left: 14pt;
`;
const Right = styled.div`
  margin: auto 0;
  margin-left: auto;
  margin-right: 0px;
`;
