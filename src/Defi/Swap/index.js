// import React, { useEffect, useState } from 'react';
// import styled from 'styled-components';
// import { fromWei, toWei } from 'web3-utils';
// import Web3 from 'web3';
// import { useGetBridges, useGetBalance } from '../../api/hooks/queries/bridge';
// import { QueryClient, QueryClientProvider } from 'react-query';
// import { useRecoilState } from 'recoil';
// import { accountState, networkState, providerState, requireNetworkState, web3State } from '../../store/web3';
// import { uniqBy } from 'lodash';
// import { changeNetwork } from '../../Components/Common/utils/Wallets';
// import Web3Modal from 'web3modal';
// import WalletConnectProvider from '@walletconnect/web3-provider';
// import { createContractInstance } from '../../lib/read_contract/Swap';

// const ERC20_ABI = require('../../lib/read_contract/abi/erc20.json');

// function SwapDetail() {
//   const [web3, setWeb3] = useRecoilState(web3State);
//   const [provider, setProvider] = useRecoilState(providerState);
//   const [account, setAccount] = useRecoilState(accountState);
//   const [network, setNetwork] = useRecoilState(networkState);
//   const [requireNetwork, setRequireNetwork] = useRecoilState(requireNetworkState);

//   const [bridges, setBridges] = useState([]);
//   const [selected, setSelected] = useState({
//     toNetwork: {},
//     fromNetwork: {},
//   });

//   const [selectedFromNetworkChainId, setSelectedFromNetworkChainId] = useState(null);
//   const [selectedToNetwork, setSelectedToNetwork] = useState(null);

//   const [userAvailable, setUserAvailable] = useState('0');
//   const [contractAvailable, setContractAvailable] = useState('0');

//   const [amount, setAmount] = useState(0);

//   /* Setting WalletConnect */
//   const providerOptions = {
//     metamask: {
//       id: 'injected',
//       name: 'MetaMask',
//       type: 'injected',
//       check: 'isMetaMask',
//     },
//     walletconnect: {
//       package: WalletConnectProvider, // required
//       options: {
//         rpc: {
//           1: 'https://eth-mainnet.alchemyapi.io/v2/2wgBGtGnTm3s0A0o23RY0BtXxgow1GAn',
//           3: 'https://eth-ropsten.alchemyapi.io/v2/vn-ib6FVXaweiMUDJkOmOkXQm1jPacAj',
//           56: 'https://bsc-dataseed.binance.org/',
//           128: 'https://http-mainnet.hecochain.com',
//           256: 'https://http-testnet.hecochain.com',
//         },
//         infuraId: '3fc11d1feb8944229a1cfba7bd62c8bc', // Required
//         network: 'mainnet',
//         qrcodeModalOptions: {
//           mobileLinks: ['rainbow', 'metamask', 'argent', 'trust', 'imtoken', 'pillar'],
//         },
//       },
//     },
//   };

//   const web3Modal = new Web3Modal({
//     cacheProvider: true,
//     providerOptions,
//   });

//   const queryGetBridges = useGetBridges();

//   const fromNetworks = uniqBy(
//     bridges.map((bridge) => bridge.fromNetwork),
//     (network) => network.chainId
//   );

//   const queryGetUserBalance = useGetBalance(
//     {
//       networkUrl: selected.fromNetwork.url,
//       contract: selected.inTokenContract,
//       address: account,
//     },
//     selected != null
//   );

//   const queryGetContractBalance = useGetBalance(
//     {
//       networkUrl: selected.toNetwork.url,
//       contract: selected.outTokenContract,
//       address: selected.address,
//     },
//     selected != null
//   );

//   const isChainCorrect = () => {
//     if (!window.ethereum) {
//       setNetwork(requireNetwork);
//       return true;
//     }
//     return (typeof network === 'string' ? parseInt(network, 16) : network) === requireNetwork;
//   };

//   const isMobile = () => {
//     return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
//   };

//   const connect = async () => {
//     if (!window.ethereum && isMobile()) {
//       window.open('https://metamask.app.link/dapp/defi.therecharge.io/', '_blank');
//       return;
//     }

//     while (window.document.querySelectorAll('[id=WEB3_CONNECT_MODAL_ID]').length > 1) {
//       window.document.querySelectorAll('[id=WEB3_CONNECT_MODAL_ID]')[1].remove();
//     }

//     let provider = await web3Modal.connect();
//     setProvider(provider);
//     const web3 = new Web3(provider);
//     setWeb3(web3);
//     const accounts = await web3.eth.getAccounts();
//     const network = await web3.eth.getChainId();
//     setAccount(accounts[0]);
//     setNetwork(network);

//     connectEventHandler(provider);
//   };

//   const connectEventHandler = (provider) => {
//     if (!provider.on) {
//       return;
//     }
//     provider.on('accountsChanged', async (accounts) => {
//       setAccount(accounts[0]);
//     });
//     provider.on('chainChanged', async (chainId) => {
//       setNetwork(chainId);
//     });
//     provider.on('disconnect', async (error) => {
//       onDisconnect(true);
//     });
//   };

//   const onDisconnect = async (event) => {
//     if (!event && web3 && web3.currentProvider && web3.currentProvider.close) {
//       await web3.currentProvider.close();
//     }
//     setAccount(undefined);
//     setProvider(undefined);
//     setNetwork(undefined);
//     await web3Modal.clearCachedProvider();
//   };

//   const onChangeFromNetwork = async (fromNetworkChainId) => {
//     if (!account) {
//       connect();
//     } else {
//       setRequireNetwork(fromNetworkChainId);
//       if (!isChainCorrect()) {
//         const promise = changeNetwork(fromNetworkChainId);
//         if (promise != null) {
//           await promise;
//           setSelectedFromNetworkChainId(fromNetworkChainId);
//         }
//       } else {
//         setSelectedFromNetworkChainId(fromNetworkChainId);
//       }
//     }
//   };

//   const onSelect = (sk) => {
//     // TODO: user current network
//     const bridge = bridges.find((bridge) => bridge.sk === sk);
//     if (bridge != null) {
//       setSelected(bridge);
//     }
//   };

//   const onChangeAmount = (e) => {
//     const amount = Math.min(Math.min(parseFloat(userAvailable), parseFloat(e.target.value)), contractAvailable);
//     setAmount(amount);
//   };

//   const exchange = async () => {
//     if (web3 == null) return;

//     if (amount > 0) {
//       const wei = toWei(amount.toString(), 'ether');
//       const contract = createContractInstance(web3, selected.inTokenContract, ERC20_ABI);
//       await contract.methods.transfer(selected.address, wei).send({ from: account, value: '0' });
//     }
//     // if (amount > 0) {
//     //   const wei = toWei(amount.toString())
//     //   const contractInstance = new web3.eth.Contract(ERC20_ABI, selected.inTokenContract)
//     //   await contractInstance.methods.approve(amount).transfer(selected.address, wei).send()
//     // }
//   };

//   useEffect(() => {
//     if (queryGetBridges.isSuccess) {
//       setBridges(queryGetBridges.data.bridges);
//       // TODO: only user network
//       // onSelect(bridges[0].sk)
//     }

//     if (queryGetUserBalance.isSuccess) {
//       setUserAvailable(queryGetUserBalance.data);
//     }

//     if (queryGetContractBalance.isSuccess) {
//       setContractAvailable(queryGetContractBalance.data);
//     }
//   });

//   return (
//     <Container>
//       <Content>
//         <div style={{ 'margin-top': '100px', color: 'white', 'font-size': '30px' }}>
//           <select
//             onChange={(e) => {
//               onChangeFromNetwork(e.target.value);
//             }}
//           >
//             <option>선택 ({fromNetworks.length})</option>
//             {fromNetworks.map((fromNetwork) => {
//               return <option value={fromNetwork.chainId}>{fromNetwork.name}</option>;
//             })}
//           </select>
//           <br />
//           <select
//             onChange={(e) => {
//               onSelect(e.target.value);
//             }}
//           >
//             <option>선택</option>
//             {bridges
//               .filter((bridge) => bridge.fromNetwork.chainId == selectedFromNetworkChainId)
//               .map((bridge) => {
//                 return (
//                   <option value={bridge.sk}>
//                     {bridge.toNetwork.name} ({bridge.symbol})
//                   </option>
//                 );
//               })}
//           </select>
//           <br />
//           <br />
//           <input type="number" min="0" onChange={onChangeAmount} value={amount} color={'red'} />
//           <br />
//           <button>Max</button>
//           <button onClick={exchange}>exchange</button>- bridges : {JSON.stringify(bridges)} <br />
//           <br />- fromNetworks : {JSON.stringify(fromNetworks)} <br />
//           <br />- selectedFromNetwork : {selectedFromNetworkChainId}
//           <br />
//           <br />- selected : {JSON.stringify(selected)}
//           <br />
//           <br />- user available : {fromWei(userAvailable)} ({selected.symbol}) <br />
//           <br />- contract available : {fromWei(contractAvailable)} ({selected.symbol}) <br />
//           <br />- provider : {JSON.stringify(provider)} <br />- network : {JSON.stringify(network)}
//         </div>
//       </Content>
//     </Container>
//   );
// }

// function Swap(props) {
//   const queryClient = new QueryClient();
//   return (
//     <QueryClientProvider client={queryClient}>
//       <SwapDetail />
//     </QueryClientProvider>
//   );
// }

// const Container = styled.div`
//   display: flex;
//   justify-content: center;
//   width: 100vw;
//   height: fit-content;

//   @media (min-width: 1088px) {
//     margin-top: 100px;
//   }
// `;

// const Content = styled.div`
//   display: flex;
//   width: 100%;
//   max-width: 1088px;
//   height: 100%;
//   flex-direction: column;

//   a {
//     color: white;
//   }

//   .pool-title1 {
//     display: none;
//     text-align: center;
//     margin: 120px 0 80px 0;
//     text-shadow: 0 0 40px rgba(255, 255, 255, 0.5);

//     @media (min-width: 1088px) {
//       display: block;
//     }
//   }
// `;

import React from 'react';
import { Redirect } from 'react-router-dom';

function Swap() {
  const shouldRedirect = true;
  if (shouldRedirect) {
    return <Redirect to="/swap" />;
  }

  return <div></div>;
}

export default React.memo(Swap);
