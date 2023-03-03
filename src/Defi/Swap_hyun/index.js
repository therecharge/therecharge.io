import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useGetBridges } from '../../api/hooks/queries/bridge';
import { fromWei, toWei } from 'web3-utils';

const dummyData = {
  available: 12345,
  Minimum: 10,
  from: {
    img: '/logo_kcc.png',
    name: 'KCC',
    type: 'Network',
  },
  to: {
    img: 'logo_bnb_active.png',
    name: 'BNB',
    type: 'Network',
  },
  amount: {
    img: 'img_rcg_40px.svg',
    name: 'RCG',
    amount: 100000,
  },
  fee: 0.003,
};
const UnderDesc = [
  {
    id: 1,
    desc: 'Tokens are sent to the same address.',
  },
  {
    id: 2,
    desc: 'Estimated Time of Crosschain Arrival is 10-30 min',
  },
];

const SwapDetail = () => {
  const [bridges, setBridges] = useState([]);
  const [amount, setAmount] = useState('');
  const queryGetSwapData = useGetBridges();

  useEffect(() => {
    if (queryGetSwapData.isSuccess) {
      setBridges(queryGetSwapData.data.bridges);
    }
  }, []);
  const amountToStr = (value) => {
    const result = Number(value)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, '$&,');
    return result;
  };
  const amountToNum = (value) => {
    if (value === '') {
      return;
    } else {
      const result = value.replace(/,/g, '').split('.')[0] + '.' + value.split('.')[1].substring(0, 2);
      return result;
    }
  };
  const changeAmount = (e) => {
    const value = e.target.value;
    setAmount(value);
  };
  console.log(fromWei('10000000', 'ether'));
  console.log(bridges);
  if (queryGetSwapData.isFetching || queryGetSwapData.isLoading) return <h1>is Loading...</h1>;
  return (
    <H.ContentWrap>
      <H.SwapBox>
        <H.SwapTitle>Recharge Swap</H.SwapTitle>
        <H.BoxContainer>
          <H.BoxWrap>
            <H.BoxLabel>From</H.BoxLabel>
            <H.BoxToken>
              <H.BoxLogo src={dummyData.from.img} alt="FromLogo" />
              <H.BoxTitle>{dummyData.from.name}</H.BoxTitle>
              <H.DescText color="#afafaf">{dummyData.from.type}</H.DescText>
            </H.BoxToken>
          </H.BoxWrap>
          <H.ChangeBtn src="/btn_switch.png" />
          <H.BoxWrap>
            <H.BoxLabel>To</H.BoxLabel>
            <H.BoxToken>
              <H.BoxLogo src={dummyData.to.img} alt="ToLogo" />
              <H.BoxTitle>{dummyData.to.name}</H.BoxTitle>
              <H.DescText color="#afafaf">{dummyData.to.type}</H.DescText>
            </H.BoxToken>
          </H.BoxWrap>
        </H.BoxContainer>
        <H.BoxLabel>Asset / Amount</H.BoxLabel>
        <H.AmountBox>
          <H.AmountLogo src={dummyData.amount.img} alt="AmountLogo" />
          <H.AmountTitle>{dummyData.amount.name}</H.AmountTitle>
          <H.Amount
            value={amount}
            onChange={changeAmount}
            onBlur={() => setAmount(amountToStr(amount))}
            onFocus={() => setAmount(amountToNum(amount))}
          />
          <H.AmountLine />
          <H.MaxBtn>MAX</H.MaxBtn>
        </H.AmountBox>
        <H.AmountRightUnderLabel>Available: {amountToStr(dummyData.available)} RCG</H.AmountRightUnderLabel>
        <H.AmountRightUnderLabel color="#ffb900">Minimum: {dummyData.Minimum} RCG</H.AmountRightUnderLabel>
        <H.SwapBtn>
          <H.BtnText>Swap</H.BtnText>
        </H.SwapBtn>
        <H.FeeWrap>
          <H.DescText>Transfer Fee</H.DescText>
          <H.DescText>{amountToStr(dummyData.amount.amount * dummyData.fee)}RCG</H.DescText>
        </H.FeeWrap>
        {UnderDesc.map(({ id, desc }) => {
          return <H.DescText id={id}>{desc}</H.DescText>;
        })}
      </H.SwapBox>
    </H.ContentWrap>
  );
};

const Swap = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <SwapDetail />
    </QueryClientProvider>
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
    width: 318px;
    height: 511px;
    margin: 108px 36px 104px;
    padding: 36px 17px 58px 16px;
    object-fit: contain;
    border-radius: 20px;
    border: solid 1px #366a72;
    background-color: #1b1d27;
    @media screen and (min-width: 1088px) {
      width: 600px;
      height: 690px;
      margin-top: 135px;
      padding: 51px 40px 88px;
    }
  `,
  SwapTitle: styled.span`
    width: 125px;
    height: 24px;
    margin: 0 1px 29px 0;
    font-family: Roboto;
    font-size: 18px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
    text-align: left;
    color: #fff;
    @media screen and (min-width: 1088px) {
      width: 100%;
      height: 32px;
      margin: 0 81px 0 0;
      font-size: 24px;
    }
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
    height: 16px;
    margin: 0px 0px 10px 0;
    font-size: 12px;
    line-height: 1.33;
    font-family: Roboto;
    font-size: 16px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    text-align: left;
    color: #afafaf;
    @media screen and (min-width: 1088px) {
      height: 21px;
      margin-top: 40px;
      line-height: 1.31;
    }
  `,
  BoxToken: styled.div`
    display: flex;
    width: 126px;
    height: 50px;
    margin: 0 0 30px;
    padding: 16px 20px 15px 10px;
    object-fit: contain;
    border-radius: 10px;
    border: solid 1px #7e7e7e;
    @media screen and (min-width: 1088px) {
      width: 220px;
      height: 70px;
      margin: 9px 0 0 0;
      padding: 16px 42px 16.3px 20px;
    }
  `,
  BoxLogo: styled.img`
    width: 20px;
    height: 18.9px;
    object-fit: contain;
    @media screen and (min-width: 1088px) {
      width: 40px;
      height: 40px;
      margin: 0 8px 0 0;
    }
  `,
  BoxTitle: styled.span`
    width: 27px;
    height: 19px;
    margin: 0 5px 0 8px;
    font-family: Roboto;
    font-size: 14px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.36;
    letter-spacing: normal;
    text-align: left;
    color: #fff;
    @media screen and (min-width: 1088px) {
      width: 47px;
      height: 32px;
      margin: 3px 7px 2.7px 12px;
      font-size: 24px;
      line-height: 1.33;
    }
  `,
  ChangeBtn: styled.img`
    width: 15px;
    height: 15px;
    margin-top: 0px;
    object-fit: contain;
    @media screen and (min-width: 1088px) {
      width: 26px;
      height: 26px;
      margin-top: 70px;
    }
  `,
  AmountBox: styled.div`
    display: flex;
    justify-content: center;
    width: 285px;
    height: 50px;
    margin: 3px 0 8px;
    padding: 11.5px 10px 10.5px;
    object-fit: contain;
    border-radius: 10px;
    border: solid 1px #7e7e7e;
    @media screen and (min-width: 1088px) {
      width: 520px;
      height: 60px;
      margin: 9px 0 0;
      padding: 16px 24px 15.5px 24px;
    }
  `,
  AmountLogo: styled.img`
    width: 20px;
    height: 20px;
    margin-top: 2.5px;
    object-fit: contain;
    @media screen and (min-width: 1088px) {
      width: 28px;
      height: 28px;
      margin-top: 0px;
    }
  `,
  AmountTitle: styled.span`
    width: 28px;
    height: 19px;
    margin: 4.5px 0px 4.5px 8px;
    font-family: Roboto;
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.36;
    letter-spacing: normal;
    text-align: center;
    color: #fff;
    @media screen and (min-width: 1088px) {
      width: 39px;
      height: 26px;
      margin: 0 0 0 16px;
      font-size: 20px;
      line-height: 1.3;
      text-align: left;
    }
  `,
  // AmountInput: styled.input`
  //   width: 98px;
  //   height: 19px;
  //   margin: 4.5px 10px 4.5px 65px;
  //   font-family: Roboto;
  //   font-size: 14px;
  //   font-weight: 500;
  //   font-stretch: normal;
  //   font-style: normal;
  //   line-height: 1.36;
  //   letter-spacing: normal;
  //   text-align: right;
  //   color: #fff;
  //   @media screen and (min-width: 1088px) {
  //     width: 315px;
  //     height: 26px;
  //     margin: 0 16px 0 0;
  //     font-size: 20px;
  //     line-height: 1.3;
  //   }
  // `,
  Amount: styled.input`
    width: 98px;
    height: 19px;
    margin: 4.5px 10px 4.5px 65px;
    font-family: Roboto;
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.36;
    letter-spacing: normal;
    text-align: right;
    color: #fff;
    decoration: none;
    background-color: transparent;
    border: none;
    @media screen and (min-width: 1088px) {
      width: 315px;
      height: 26px;
      margin: 0 16px 0 0;
      font-size: 20px;
      line-height: 1.3;
    }
  `,
  AmountLine: styled.img`
    width: 0;
    height: 28px;
    object-fit: contain;
    border: solid 1px #7e7e7e;
    @media screen and (min-width: 1088px) {
      margin: 0.5px 0 0;
    }
  `,
  MaxBtn: styled.span`
    width: 26px;
    height: 16px;
    margin: 0 0 0 10px;
    font-family: Roboto;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 2.5;
    letter-spacing: normal;
    text-align: center;
    color: #fff;
    @media screen and (min-width: 1088px) {
      width: 34px;
      height: 21px;
      margin: 0px 0 3.5px 16px;
      font-size: 16px;
      line-height: 1.88;
    }
  `,
  AmountRightUnderLabel: styled.div`
    width: 100%;
    height: 16px;
    margin: 8px 10px 3px 0;
    font-size: 12px;
    line-height: 2.5;
    font-family: Roboto;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    text-align: right;
    color: ${({ color }) => (color ? color : '#fff')};
    @media screen and (min-width: 1088px) {
      height: 21px;
      margin-top: 8px;
      font-size: 16px;
      line-height: 1.88;
    }
  `,
  SwapBtn: styled.button`
    width: 285px;
    height: 40px;
    margin: 30px 0 25px;
    padding: 10px 122px 9px 123px;
    object-fit: contain;
    border-radius: 10px;
    background-color: #00c9e8;
    border: none;
    @media screen and (min-width: 1088px) {
      width: 520px;
      height: 60px;
      margin: 40px 0 7px;
      padding: 14px 231px;
    }
  `,
  BtnText: styled.span`
    width: 100%;
    height: 21px;
    font-family: Roboto;
    font-size: 16px;
    font-weight: 900;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.31;
    letter-spacing: normal;
    text-align: center;
    color: #fff;
    @media screen and (min-width: 1088px) {
      height: 32px;
      font-size: 24px;
      line-height: 1.33;
    }
  `,
  FeeWrap: styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
  `,
  DescText: styled.span`
    height: 13px;
    margin-top: 4px;
    font-family: Roboto;
    font-size: 10px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.3;
    letter-spacing: normal;
    text-align: left;
    color: ${({ color }) => (color ? color : '#fff')};
    @media screen and (min-width: 1088px) {
      height: 19px;
      margin-top: 9px;
      font-size: 14px;
      line-height: 1.36;
    }
  `,
};
