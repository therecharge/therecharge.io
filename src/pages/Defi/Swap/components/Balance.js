import styled from "styled-components";
import { ReactComponent as RCGeth } from "./assets/RCGETH.svg";
export default function Balance({
  Image = RCGeth,
  symbol = "RCG",
  balance = "100,000.000",
}) {
  return (
    <Container>
      <Image />
      <Left className="Roboto_30pt_Regular">{symbol}</Left>
      <Right className="Roboto_30pt_Light">{balance}</Right>
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  width: 100%;
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
