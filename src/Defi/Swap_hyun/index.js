import React, { useEffect } from 'react';
import styled from 'styled-components';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { changeNetwork } from '../../Components/Common/utils/Wallets';

import { useRecoilState } from 'recoil';
import { web3State, providerState, accountState, networkState } from '../../store/web3';

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

const Swap = () => {
  const [web3, setWeb3] = useRecoilState(web3State);
  const [provider, setProvider] = useRecoilState(providerState);
  const [account, setAccount] = useRecoilState(accountState);
  const [network, setNetwork] = useRecoilState(networkState);

  const providerOptions = {
    metamask: {
      id: 'injected',
      name: 'MetaMask',
      type: 'injected',
      check: 'isMetaMask',
    },
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        rpc: {
          56: 'https://bsc-dataseed.binance.org/', // BSC
          97: 'https://data-seed-prebsc-1-s1.binance.org:8545', // BSC-testnet
          321: 'https://rpc-mainnet.kcc.network', // KCC
          322: 'https://rpc-testnet.kcc.network', // KCC-testnet
        },
        infuraId: '3fc11d1feb8944229a1cfba7bd62c8bc', // Required
        network: 'mainnet',
        qrcodeModalOptions: {
          mobileLinks: ['rainbow', 'metamask', 'argent', 'trust', 'imtoken', 'pillar'],
        },
      },
    },
  };

  let web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions,
  });

  function connectEventHandler(provider) {
    if (!provider.on) {
      return;
    }
    provider.on('open', async (info) => {
      console.log('Wallet Connected!');
    });
    provider.on('accountsChanged', async (accounts) => {
      setAccount(accounts[0]);
      console.log('Account Changed');
      console.log(accounts);
    });
    provider.on('chainChanged', async (chainId) => {
      setNetwork(chainId);
      console.log('Chain Id Changed');
      console.log(chainId);
    });
    provider.on('disconnect', async (error) => {
      onDisconnect(true);
      console.log('Wallet lose connection.');
    });
  }

  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  async function onDisconnect(event) {
    if (!event && web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    setAccount(undefined);
    setProvider(undefined);
    setNetwork(undefined);
    await web3Modal.clearCachedProvider();
  }

  async function connect() {
    if (!window.ethereum && isMobile()) {
      window.open('https://metamask.app.link/dapp/defi.therecharge.io/bridge/', '_blank');
      return;
    }

    while (window.document.querySelectorAll('[id=WEB3_CONNECT_MODAL_ID]').length > 1) {
      window.document.querySelectorAll('[id=WEB3_CONNECT_MODAL_ID]')[1].remove();
    }

    let provider = await web3Modal.connect();
    setProvider(provider);
    const web3 = new Web3(provider);
    setWeb3(web3);
    const accounts = await web3.eth.getAccounts();
    const network = await web3.eth.getChainId();
    setAccount(accounts[0]);
    setNetwork(network);
    alert(network);

    connectEventHandler(provider);
  }

  useEffect(() => {
    connect();

    if (network !== 321) {
      changeNetwork(321);
    }
  }, []);

  const availableForm = (number) => {
    const result = number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    return result;
  };

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
          <H.Amount>{availableForm(dummyData.amount.amount)}</H.Amount>
          <H.AmountLine />
          <H.MaxBtn>MAX</H.MaxBtn>
        </H.AmountBox>
        <H.AmountRightUnderLabel>Available: {availableForm(dummyData.available)} RCG</H.AmountRightUnderLabel>
        <H.AmountRightUnderLabel color="#ffb900">Minimum: {dummyData.Minimum} RCG</H.AmountRightUnderLabel>
        <H.SwapBtn>
          <H.BtnText>Swap</H.BtnText>
        </H.SwapBtn>
        <H.FeeWrap>
          <H.DescText>Transfer Fee</H.DescText>
          <H.DescText>{availableForm(dummyData.amount.amount * dummyData.fee)}RCG</H.DescText>
        </H.FeeWrap>
        {UnderDesc.map(({ id, desc }) => {
          return <H.DescText id={id}>{desc}</H.DescText>;
        })}
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
  Amount: styled.span`
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
