import React from 'react';
import styled from 'styled-components';

const Swap = () => {
  return (
    <H.ContentWrap>
      <H.SwapBox>
        <H.SwapTitle>Recharge Swap</H.SwapTitle>
        <H.BoxContainer>
          <H.BoxWrap>
            <H.BoxLabel>From</H.BoxLabel>
            <H.BoxToken></H.BoxToken>
          </H.BoxWrap>
          <H.ChangeBtn src="/btn_switch.png" />
          <H.BoxWrap>
            <H.BoxLabel>To</H.BoxLabel>
            <H.BoxToken></H.BoxToken>
          </H.BoxWrap>
        </H.BoxContainer>
        <H.BoxLabel>Asset / Amount</H.BoxLabel>
        <H.AmountBox></H.AmountBox>
        <H.AmountRightUnderLabel>Available: 0,000,000.00 RCG</H.AmountRightUnderLabel>
        <H.AmountRightUnderLabel color="#ffb900">Minimum: 000 RCG</H.AmountRightUnderLabel>
        <H.SwapBtn>
          <H.BtnText>Swap</H.BtnText>
        </H.SwapBtn>
        <H.FeeWrap>
          <H.DescText>Transfer Fee</H.DescText>
          <H.DescText>0.00 RCG</H.DescText>
        </H.FeeWrap>
        <H.DescText>Tokens are sent to the same address.</H.DescText>
        <H.DescText>Estimated Time of Crosschain Arrival is 10-30 min</H.DescText>
      </H.SwapBox>
    </H.ContentWrap>
  );
};

export default Swap;

const H = {
  ContentWrap: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  `,
  SwapBox: styled.div`
    display: flex;
    flex-direction: column;
    width: 600px;
    height: 690px;
    margin-top: 135px;
    padding: 51px 40px 88px;
    object-fit: contain;
    border-radius: 20px;
    border: solid 1px #366a72;
    background-color: #1b1d27;
  `,
  SwapTitle: styled.span`
    width: 100%;
    height: 32px;
    margin: 0 81px 0 0;
    font-family: Roboto;
    font-size: 24px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
    text-align: left;
    color: #fff;
  `,
  BoxContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  BoxWrap: styled.div`
    display: flex;
    flex-direction: column;
  `,
  BoxLabel: styled.span`
    height: 21px;
    margin-top: 40px;
    font-family: Roboto;
    font-size: 16px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.31;
    letter-spacing: normal;
    text-align: left;
    color: #afafaf;
  `,
  BoxToken: styled.div`
    width: 220px;
    height: 70px;
    margin: 9px 0 0 0;
    padding: 16px 42px 16.3px 20px;
    object-fit: contain;
    border-radius: 10px;
    border: solid 1px #7e7e7e;
  `,
  ChangeBtn: styled.img`
    margin-top: 70px;
    object-fit: contain;
  `,
  AmountBox: styled.div`
    width: 520px;
    height: 60px;
    margin: 9px 0 0;
    padding: 16px 24px 15.5px 24px;
    object-fit: contain;
    border-radius: 10px;
    border: solid 1px #7e7e7e;
  `,
  AmountRightUnderLabel: styled.div`
    width: 100%;
    height: 21px;
    margin-top: 8px;
    font-family: Roboto;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.88;
    letter-spacing: normal;
    text-align: right;
    color: ${({ color }) => (color ? `${color}` : '#fff')};
  `,
  SwapBtn: styled.button`
    width: 520px;
    height: 60px;
    margin: 40px 0 7px;
    padding: 14px 231px;
    object-fit: contain;
    border-radius: 10px;
    border: none;
    background-color: #00c9e8;
  `,
  BtnText: styled.span`
    width: 100%;
    height: 32px;
    font-family: Roboto;
    font-size: 24px;
    font-weight: 900;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
    text-align: center;
    color: #fff;
  `,
  FeeWrap: styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
  `,
  DescText: styled.span`
    height: 19px;
    margin-top: 9px;
    font-family: Roboto;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.36;
    letter-spacing: normal;
    text-align: left;
    color: #fff;
  `,
};
