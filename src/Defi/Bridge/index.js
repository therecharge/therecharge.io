import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { changeNetwork } from '../../Components/Common/utils/Wallets';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useGetBridges } from '../../api/hooks/queries/bridge';
import { fromWei, toWei } from 'web3-utils';
import { useRecoilState } from 'recoil';
import { web3State, providerState, accountState, networkState } from '../../store/web3';

const ERC20_ABI = require('../abis/ERC20ABI.json');

const networkInfo = {
  tBNB: {
    img: 'logo_bnb_active.png',
    name: 'BNB',
    type: 'TestNetwork',
  },
  BNB: {
    img: 'logo_bnb_active.png',
    name: 'BNB',
    type: 'Network',
  },
  tKCS: {
    img: '/logo_kcc.png',
    name: 'KCC',
    type: 'TestNetwork',
  },
  KCS: {
    img: '/logo_kcc.png',
    name: 'KCC',
    type: 'Network',
  },
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

// export const Bridges = () => {
//   const queryGetBridge = useGetBridges();
//   const [bridges, setBridges] = useState([]);
//   const [network] = useRecoilState(networkState);

//   useEffect(() => {
//     if (queryGetBridge.isSuccess) {
//       console.log('queryGetSwapData is success');
//       setBridges(queryGetBridge.data.bridges);
//       // connect();
//       if (bridges.length === 0) {
//         return;
//       }
//       if (network !== 321) {
//         changeNetwork(321);
//       }
//     }
//   }, [queryGetBridge.isSuccess]);
// };

const SwapDetail = () => {
  const [bridges, setBridges] = useState([]);
  const [currentBridge, setCurrentBridge] = useState();
  const [amount, setAmount] = useState(0);
  const [avail, setAvail] = useState(0);
  const [currentNetwork, setCurrentNetwork] = useState(322);
  const queryClient = new QueryClient();

  const queryGetBridge = useGetBridges();

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

  const connect = async () => {
    if (!window.ethereum && isMobile()) {
      window.open('https://metamask.app.link/dapp/defi.therecharge.io/bridge/', '_blank');
      return;
    }
    while (window.document.querySelectorAll('[id=WEB3_CONNECT_MODAL_ID]').length > 1) {
      window.document.querySelectorAll('[id=WEB3_CONNECT_MODAL_ID]')[1].remove();
    }
    try {
      const provider = await web3Modal.connect();
      setProvider(provider);
      const web3 = new Web3(provider);
      setWeb3(web3);
      const accounts = await web3.eth.getAccounts();
      const network = await web3.eth.getChainId();
      setAccount(accounts[0]);
      setNetwork(network);
      const currentBridge = queryGetBridge.data.bridges.filter((item) => item.fromNetwork.chainId === network)[0];
      if (currentBridge === undefined) {
        // 브릿지 목록에서 현재 네트워크 못 찾을때
        return;
      }
      setCurrentBridge(currentBridge);

      connectEventHandler(provider);

      await connected(network, currentBridge, accounts);
    } catch (error) {
      console.error('error:', error);
    }
  };

  const connected = async (network, currentBridge, accounts) => {
    console.log('connected -> currentBridge');
    console.log(network);
    console.log(currentBridge);
    if (currentBridge === undefined) {
      return;
    }

    // avail 계산
    const web3 = new Web3(currentBridge.fromNetwork.url);
    const contract = new web3.eth.Contract(ERC20_ABI, currentBridge.inTokenContract);
    const balance = await contract.methods.balanceOf(accounts[0]).call();
    setAvail(fromWei(balance));
  };

  useEffect(() => {
    changeNetwork(currentNetwork);
    connect();
  }, [currentNetwork]);

  useEffect(() => {
    if (network !== 322) {
      changeNetwork(322);
    }
  }, []);

  useEffect(() => {
    if (queryGetBridge.isSuccess) {
      console.log(queryGetBridge);
      setBridges(queryGetBridge.data.bridges);
      connect();
      if (bridges.length === 0) {
        return;
      }
    }
  }, [queryGetBridge.isSuccess]);

  if (!queryGetBridge.isSuccess) {
    return <h1>Loading...</h1>;
  }

  // 스왑버튼 누를 때 실행
  const letsSwap = async () => {
    if (currentBridge === undefined) {
      return;
    }
    // 현재 네트워크 맞는지 한번 더 확인

    const testAmount = 1;
    // const weiAmount = toWei(amount.toString(), 'ether');
    const weiAmount = toWei(testAmount.toString(), 'ether');

    const web3 = new Web3(currentBridge.fromNetwork.url);
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 300000;
    const nonce = await web3.eth.getTransactionCount(account, 'pending');
    const contract = new web3.eth.Contract(ERC20_ABI, currentBridge.inTokenContract);
    const data = contract.methods.transfer(currentBridge.address, weiAmount).encodeABI();
    const tx = {
      from: account,
      to: currentBridge.address,
      gas: gasLimit,
      gasPrice: gasPrice,
      data: data,
      nonce: nonce,
    };

    const signedTx = await web3.eth.signTransaction(tx);
    const txHash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log(`Transaction hash: ${txHash}`);
  };

  const connectEventHandler = (provider) => {
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
  };

  const onDisconnect = async (event) => {
    if (!event && web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    setAccount(undefined);
    setProvider(undefined);
    setNetwork(undefined);
    await web3Modal.clearCachedProvider();
  };

  const weiToEther = (value) => {
    return fromWei(value, 'ether');
  };

  const amountToStr = (value) => {
    if (value === 0) {
      return '0.00';
    } else if (!value) {
      return;
    } else {
      const result = Number(value)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,');
      if (Number(value) > Number(avail)) {
        return Number(avail)
          .toFixed(2)
          .replace(/\d(?=(\d{3})+\.)/g, '$&,');
      } else {
        return result ?? '';
      }
    }
  };
  const amountToNum = (value) => {
    if (!value) {
      return;
    } else {
      const result = value.replace(/,/g, '').split('.')[0] + '.' + value.split('.')[1].substring(0, 2);
      return result ?? '';
    }
  };
  const changeSwapNetwork = () => {
    console.log('click');
    console.log(network);
    console.log(currentNetwork);
    if (network === 322) {
      setCurrentNetwork(97);
    } else {
      setCurrentNetwork(322);
    }
  };

  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  return (
    <H.ContentWrap>
      {currentBridge && (
        <H.SwapBox>
          <H.SwapTitle>Recharge Swap</H.SwapTitle>
          <H.BoxContainer>
            <H.BoxWrap>
              <H.BoxLabel>From</H.BoxLabel>
              <H.BoxToken>
                <H.BoxLogo src={networkInfo[currentBridge.fromNetwork.currency].img} alt="FromLogo" />
                <H.BoxTitle>{networkInfo[currentBridge.fromNetwork.currency].name}</H.BoxTitle>
                <H.DescText color="#afafaf">{networkInfo[currentBridge.fromNetwork.currency].type}</H.DescText>
              </H.BoxToken>
            </H.BoxWrap>
            <H.ChangeBtn src="/btn_switch.png" onClick={() => changeSwapNetwork()} />
            <H.BoxWrap>
              <H.BoxLabel>To</H.BoxLabel>
              <H.BoxToken>
                <H.BoxLogo src={networkInfo[currentBridge.toNetwork.currency].img} alt="ToLogo" />
                <H.BoxTitle>{networkInfo[currentBridge.toNetwork.currency].name}</H.BoxTitle>
                <H.DescText color="#afafaf">{networkInfo[currentBridge.toNetwork.currency].type}</H.DescText>
              </H.BoxToken>
            </H.BoxWrap>
          </H.BoxContainer>
          <H.BoxLabel>Asset / Amount</H.BoxLabel>
          <H.AmountBox>
            <H.AmountLogo src="/img_rcg_40px.svg" alt="AmountLogo" />
            <H.AmountTitle>{currentBridge.symbol}</H.AmountTitle>
            <H.Amount
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onBlur={() => setAmount(amountToStr(amount))}
              onFocus={() => setAmount(amountToNum(amount))}
            />
            <H.AmountLine />
            <H.MaxBtn onClick={() => setAmount(amountToStr(avail))}>MAX</H.MaxBtn>
          </H.AmountBox>
          <H.AmountRightUnderLabel>
            Available: {amountToStr(avail)} {currentBridge.symbol}
          </H.AmountRightUnderLabel>
          <H.AmountRightUnderLabel color="#ffb900">Minimum: 10 {currentBridge.symbol}</H.AmountRightUnderLabel>
          <H.SwapBtn onClick={() => letsSwap()}>
            <H.BtnText>Swap</H.BtnText>
          </H.SwapBtn>
          <H.FeeWrap>
            <H.DescText>Transfer Fee</H.DescText>
            <H.DescText>
              {amountToStr(weiToEther(currentBridge.minFee))} {currentBridge.symbol}
            </H.DescText>
          </H.FeeWrap>
          {UnderDesc.map(({ id, desc }) => {
            return <H.DescText id={id}>{desc}</H.DescText>;
          })}
        </H.SwapBox>
      )}
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
    cursor: pointer;
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
