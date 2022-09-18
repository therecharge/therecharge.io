import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
//components
// import Image from "./List/image.js";
import Row from './List/row.js';
/* Libraries */
import {
  getChargerList,
  createContractInstance,
  // getTokenInfo,
  getChargerInfo,
} from '../../../lib/read_contract/Station';
import { fromWei, toBN } from 'web3-utils';
/* Store */
import { web3ReaderState } from '../../../store/read-web3';
import {getAllContracts, getAssaplayUsd, getCoingecko, getPenUsd} from '../../../api/contract';
import moment from 'moment'
import {bscAbi, pancakeAbi} from "../../../constants";
import Web3 from "web3";
import _ from 'underscore'
// import { ReactComponent as DropdownClose } from "./List/assets/dropdown-close.svg";
// import { ReactComponent as DropdownOpen } from "./List/assets/dropdown-open.svg";

Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

const bufferArray = ['5.2 BSC Locked', '5.2 BSC Flexible'];

const loading_data = [
  {
    address: '0x0',
    // apy: "-",
    name: 'Loading List..',
    period: [1625022000, 14400],
    redemtion: 200,
    symbol: ['RCG', 'RCG'],
    token: [
      '0xe74be071f3b62f6a4ac23ca68e5e2a39797a3c30', // 이더리움 토큰주소
      '0xe74be071f3b62f6a4ac23ca68e5e2a39797a3c30',
    ],
    tvl: '-',
    type: 'flexible',
    network: 'ERC',
  },
];
const chargerInfo = [
  {
    address: '0x0',
    // apy: "-",
    name: 'There is currently no Charger List available.',
    period: [1625022000, 14400],
    redemtion: 200,
    symbol: ['RCG', 'RCG'],
    token: [
      '0xe74be071f3b62f6a4ac23ca68e5e2a39797a3c30', // 이더리움 토큰주소
      '0xe74be071f3b62f6a4ac23ca68e5e2a39797a3c30',
    ],
    tvl: '-',
    type: 'flexible',
    network: 'ERC',
  },
];
//
function List({ /*type, list,*/ params, toast, network, setTvl }) {
  const [t] = useTranslation();
  const [fullList, setFullList] = useState(loading_data);
  const [chList, setChList] = useState(loading_data);

  const [bscInfo, setBscInfo] = useState(null);
  const [bscPrice, setBscPrice] = useState(null);
  const [allContractInfo, setAllContractInfo] = useState([]);


  // const [isOpen, setOpen] = useState(false);
  const [web3_R] = useRecoilState(web3ReaderState);
  const NETWORKS = require('../../../lib/networks.json');

  const loadChargerList = async () => {
    const priceData = await axios.post(`https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2`, {
      query: 'query{pairs(where:{id:"0x9c20be0f142fb34f10e33338026fb1dd9e308da3"}) { token0Price token1Price }}',
    });

    const web3 = new Web3('https://bsc-dataseed1.binance.org:443');
    const contract = new web3.eth.Contract(bscAbi, '0x9A908063f7345905A43D35740D00d46ddb5F411d');
    const pancakeContract = new web3.eth.Contract(pancakeAbi, '0x9A908063f7345905A43D35740D00d46ddb5F411d')

    const response = await axios.get('https://api.pancakeswap.info/api/v2/tokens/0xe9e7cea3dedca5984780bafc599bd69add087d56');
    const BUSD_Price = response.data.data.price
    const quantityInfo = await contract.methods.getReserves().call();
    const pancakeTotalSupply = await pancakeContract.methods.totalSupply().call()

    const RCG_PRICE = makeNum(priceData.data.data.pairs[0].token0Price);

    /**
     * 1. 모든 차져리스트를 받는다
     *  1-1. 각 네트워크에 대한 web3, 풀어드레스를 받는다
     *  1-2. 각 네트워크에 대한 차져 리스트를 받을 수 있다.
     *
     * {
     *    ERC: [],
     *    BEP: [],
     *    HRC: [],
     * }
     *
     * 2. 모든 차져리스트에 대한 인스턴스 생성
     * 3. 모든 차져 인스턴스에 대한 인포 받기
     * 4. 네트워크, 타입에 따라 필터링 진행
     */

    const realignArray = (insertIdx, deleteIdx, arr) => {
      const insertData = arr[deleteIdx];
      arr.splice(deleteIdx, 1);
      arr.insert(1, insertData);
      return arr;
    };

    const ETH_WEB3 = web3_R.ERC;
    const BEP_WEB3 = web3_R.BEP;
    const HRC_WEB3 = web3_R.HRC;
    const KCC_WEB3 = web3_R.KCC
    const ALL_WEB3 = [ETH_WEB3, BEP_WEB3, HRC_WEB3, KCC_WEB3];

    const NETWORK = NETWORKS['mainnet'];
    // const TOKEN_ADDRESS = NETWORK.tokenAddress[network]; //
    const ETH_CHARGERLIST_ADDRESS = NETWORK.chargerListAddress.ERC;
    const BEP_CHARGERLIST_ADDRESS = NETWORK.chargerListAddress.BEP;
    const HRC_CHARGERLIST_ADDRESS = NETWORK.chargerListAddress.HRC; //
    const KCC_CHARGERLIST_ADDRESS = NETWORK.chargerListAddress.KCC;

    const CHARGERLIST_ABI = require('../../../lib/read_contract/abi/chargerList.json');
    const TOKEN_ABI = require('../../../lib/read_contract/abi/erc20.json');
    const CHARGER_ABI = require('../../../lib/read_contract/abi/charger.json');


    const ETH_CHARGERLIST_INSTANCE = createContractInstance(ETH_WEB3, ETH_CHARGERLIST_ADDRESS, CHARGERLIST_ABI);
    const BEP_CHARGERLIST_INSTANCE = createContractInstance(BEP_WEB3, BEP_CHARGERLIST_ADDRESS, CHARGERLIST_ABI);
    const HRC_CHARGERLIST_INSTANCE = createContractInstance(HRC_WEB3, HRC_CHARGERLIST_ADDRESS, CHARGERLIST_ABI); //

    const getList = async () => {
      const allContract = await getAllContracts();
      const _allContract = _.flatten(Object.keys(allContract.chargeList).map((key, i) => {
        return allContract.chargeList[key];
      }))
      setAllContractInfo(_allContract)


      const ETH_CHARGER_LIST = allContract.chargeList.ETH.map((item) => item.address);
      const BEP_CHARGER_LIST = allContract.chargeList.BSC.map((item) => item.address);
      const HRC_CHARGER_LIST = allContract.chargeList.HECO.map((item) => item.address);
      const KCC_CHARGER_LIST = allContract.chargeList.KCC.map((item) => item.address);

      // const ETH_CHARGER_LIST = await getChargerList(ETH_CHARGERLIST_INSTANCE);
      // const BEP_CHARGER_LIST_2 = await getChargerList(BEP_CHARGERLIST_INSTANCE);
      // const HRC_CHARGER_LIST = await getChargerList(HRC_CHARGERLIST_INSTANCE); //

      const ALL_NETWORK_CHARGERLIST = [ETH_CHARGER_LIST, BEP_CHARGER_LIST, HRC_CHARGER_LIST, KCC_CHARGER_LIST];

      if (ETH_CHARGER_LIST.length === 0 && BEP_CHARGER_LIST.length === 0) return setChList(chargerInfo);

      let ALL_RESULTS = {
        0: [],
        1: [],
        2: [], //
        3: []
      };



      const ALL_CHARGER_INSTANCES = ALL_NETWORK_CHARGERLIST.map((CHARGERLIST, network) => {
        return CHARGERLIST.map((CHARGER_ADDRESS) =>
          createContractInstance(ALL_WEB3[network], CHARGER_ADDRESS, CHARGER_ABI)
        );
      });

      const ALL_CHARGERS_INFO = await Promise.all(
        ALL_CHARGER_INSTANCES.map(async (CHARGER_INSTANCES) => {
          return Promise.all(CHARGER_INSTANCES.map((INSTANCE) => getChargerInfo(INSTANCE)));
        })
      );


      ALL_CHARGERS_INFO.map((CHARGERS_INFO, network) => {
        CHARGERS_INFO.map((INFO, i) => {
          ALL_RESULTS[network][i] = INFO;
        });
      });

      const ALL_REWARDS_AMOUNT = await Promise.all(
        ALL_NETWORK_CHARGERLIST.map(async (CHARGERLIST, network) => {
          return Promise.all(
            CHARGERLIST.map((CHARGER_ADDRESS, i) => {
              const REWARDTOKEN_INSTANCE = createContractInstance(
                ALL_WEB3[network],
                ALL_RESULTS[network][i].rewardToken,
                TOKEN_ABI
              );
              return REWARDTOKEN_INSTANCE.methods.balanceOf(CHARGER_ADDRESS).call();
            })
          );
        })
      );
      const ALL_REWARDS_SYMBOL = await Promise.all(
        ALL_NETWORK_CHARGERLIST.map((CHARGERLIST, network) => {
          return Promise.all(
            CHARGERLIST.map((CHARGER_ADDRESS, i) => {
              const TOKEN_INSTANCE = createContractInstance(
                ALL_WEB3[network],
                ALL_RESULTS[network][i].rewardToken,
                TOKEN_ABI
              );
              return TOKEN_INSTANCE.methods.symbol().call();
            })
          );
        })
      );

      const ALL_STAKES_SYMBOL = await Promise.all(
        ALL_NETWORK_CHARGERLIST.map((CHARERLIST, network) => {
          return Promise.all(
            CHARERLIST.map((CHARGER_ADDRESS, i) => {
              const TOKEN_INSTANCE = createContractInstance(
                ALL_WEB3[network],
                ALL_RESULTS[network][i].stakeToken,
                TOKEN_ABI
              );
              return TOKEN_INSTANCE.methods.symbol().call();
            })
          );
        })
      );
      const ALL_STAKES_BASEPERCENT = await Promise.all(
        ALL_NETWORK_CHARGERLIST.map((CHARGERLIST, network) => {
          return Promise.all(
            CHARGERLIST.map(async (CHARGER_ADDRESS, i) => {
              if (ALL_STAKES_SYMBOL[network][i] != 'RCG') return 0;
              const TOKEN_INSTANCE = createContractInstance(
                ALL_WEB3[network],
                ALL_RESULTS[network][i].stakeToken,
                TOKEN_ABI
              );
              return TOKEN_INSTANCE.methods.basePercent().call();
            })
          );
        })
      );

      const coingeckoUSD = await getCoingecko();
      const penUsd = await getPenUsd();
      const assaplayUsd = await getAssaplayUsd();

      await ALL_NETWORK_CHARGERLIST.map(async (CHARGERLIST, network) => {
        let net;
        switch (network) {
          case 0:
            net = 'ERC';
            break;
          case 1:
            net = 'BEP';
            break;
          case 2:
            net = 'HRC';
            break;
          case 3:
            net = 'KCC'
            break;
        }


        await CHARGERLIST.map((CHARGER_ADDRESS, i) => {
          // 11.12 풀을 위해 임시적으로 사용됩니다.
          if (ALL_RESULTS[network][i].name === '11.2 Premier Locked Pool 300') {
            ALL_RESULTS[network][i].name = '11.12 Premier Locked Pool 200';
          } else if (ALL_RESULTS[network][i].name === '11.2 Locked Pool 200') {
            ALL_RESULTS[network][i].name = '11.12 Locked Pool 100';
          }

          ALL_RESULTS[network][i].address = CHARGER_ADDRESS;
          ALL_RESULTS[network][i].status = loadActiveStatus(ALL_RESULTS[network][i]);
          // 컨트랙트에서 미니멈 값을 제대로 주기 전까지 일시적으로 사용합니다.
          ALL_RESULTS[network][i].minimum = fromWei(ALL_RESULTS[network][i].limit, 'ether');
          ALL_RESULTS[network][i].seq = allContract.chargeList.BSC[i].seq;
          ALL_RESULTS[network][i].rewardAmount = ALL_REWARDS_AMOUNT[network][i];
          ALL_RESULTS[network][i].basePercent = ALL_STAKES_BASEPERCENT[network][i];
          ALL_RESULTS[network][i].symbol = [ALL_REWARDS_SYMBOL[network][i], ALL_STAKES_SYMBOL[network][i]];
          ALL_RESULTS[network][i].network = net;
          ALL_RESULTS[network][i].apy =
              bufferArray.includes(ALL_RESULTS[network][i].name) ? getAPY(
                      ALL_RESULTS[network][i].totalSupply,
                      ALL_RESULTS[network][i].rewardAmount -
                      (ALL_RESULTS[network][i].rewardToken == ALL_RESULTS[network][i].stakeToken
                          ? ALL_RESULTS[network][i].totalSupply
                          : 0),
                      ALL_RESULTS[network][i].DURATION,
                      ALL_RESULTS[network][i].name,
                      ALL_RESULTS[network][i].network,
                      ALL_RESULTS[network][i]
                  ) :
                  renewalGetAPY(ALL_RESULTS[network][i], coingeckoUSD, allContract, BUSD_Price, quantityInfo, pancakeTotalSupply, penUsd, assaplayUsd)
          ;
          ALL_RESULTS[network][i].isLP = ALL_RESULTS[network][i].name.includes('LP');
          ALL_RESULTS[network][i].isLocked = ALL_RESULTS[network][i].name.includes('Locked');
          ALL_RESULTS[network][i].poolTVL = renewalTVL(ALL_RESULTS[network][i].totalSupply, coingeckoUSD ,ALL_RESULTS[network][i].symbol)
            // ALL_RESULTS[network][i].isLP && ALL_RESULTS[network][i].network === 'BEP'
            //   ? 25.6082687419 * Number(fromWei(ALL_RESULTS[network][i].totalSupply, 'ether')) * RCG_PRICE
            //   : ALL_RESULTS[network][i].isLP && ALL_RESULTS[network][i].network === 'ERC'
            //   ? 4272102.29339 * Number(fromWei(ALL_RESULTS[network][i].totalSupply, 'ether'))
            //   : Number(fromWei(ALL_RESULTS[network][i].totalSupply, 'ether')) * RCG_PRICE;
        });
      });


      // 1. pool type에 따라 필터링 진행
      // let test = updatedList.filter((charger) =>
      //   charger.name.includes(params.type)
      // ); //
      let ALL_LIST = [];
      for (let network in ALL_RESULTS) {
        ALL_RESULTS[network].map((charger) => {
          if (charger.name === '9.3 Locked Pool 500' || charger.name === '9.15 BSC Zero-Burning Pool 20') {
          } else {
            ALL_LIST.push(charger);
          }
        });
      }
      let tvl = 0;
      ALL_LIST.map((charger) => (tvl += Number(fromWei(charger.totalSupply, 'ether'))));

      setTvl(tvl * RCG_PRICE);
      // if (params.type === "Locked") {
      //   // 해당 풀타입이 없을 때
      //   let catchZeroPool = [];
      //   // bep Loced 예외처리 Zero 잡기
      //   catchZeroPool = updatedList.filter((charger) =>
      //     charger.name.includes("Zero")
      //   );
      //   if (catchZeroPool.length !== 0) {
      //     test.unshift(catchZeroPool[0]);
      //   }
      // }

      // ALL_LIST.sort((charger1, charger2) => charger2.startTime - charger1.startTime);
      // ALL_LIST.sort((charger1, charger2) => charger2.apy - charger1.apy);

      // UNISWAP LP POOL을 위해 임시적으로 사용합니다.

      // ALL_LIST.reverse()
      // console.log("ALL_LIST", ALL_LIST)
      // let lastCharger = ALL_LIST.pop()
      // ALL_LIST.unshift(lastCharger)

      // console.log('ALL_LIST', ALL_LIST);
      // if (ALL_LIST.length > 1 && ALL_LIST[5].name === '2.3 Pancake LP Locked -  High Yield') {
      //   ALL_LIST = realignArray(1, 5, ALL_LIST);
      // }
      if (ALL_LIST.length === 0) {
        setChList(chargerInfo);
        setFullList(chargerInfo);
      } else {
        setChList(ALL_LIST);
        setFullList(ALL_LIST);
      }
    };
    getList();

    return;
  };

  const filterByNetwork = (chargerList) => {
    return chargerList.filter((charger) => charger.network === network);
  };
  const filterByType = (chargerList) => {
    if (params.isLP) {
      return chargerList.filter((charger) => charger.name.includes(params.type) && charger.name.includes('LP'));
    } else {
      return chargerList.filter((charger) => charger.name.includes(params.type) && !charger.name.includes('LP'));
    }
  };

  const renewalTVL = (totalSupply, coingecko, symbol) => {
    // console.log(parseInt(fromWei(totalSupply, 'ether')), coingecko, symbol, 'tvl')


    if(symbol.includes('PEN') && !symbol.includes('RCG')) {
      return parseInt(fromWei(totalSupply, 'ether') )* 0.024.toLocaleString()
    }
    const total = parseInt(fromWei(totalSupply, 'ether'),10);
    return total * coingecko.toLocaleString();
  }

  const bootstrap = async () => {
    const web3 = new Web3('https://bsc-dataseed1.binance.org:443');
    const contract = new web3.eth.Contract(bscAbi, '0x9A908063f7345905A43D35740D00d46ddb5F411d');
    const price = await axios.get('https://api.pancakeswap.info/api/v2/tokens/0xe9e7cea3dedca5984780bafc599bd69add087d56');
    const data = await contract.methods.getReserves().call()
    setBscInfo(data);
  }

  useEffect(() => {
    bootstrap()
  },[])

  // Whenever Staking type is changed, reload Pool list
  useEffect(async () => {
    setChList(loading_data);
    try {
      await loadChargerList();
    } catch (err) {
      console.log(err, 'error');
    }
  }, []);
  useEffect(async () => {
    try {
      let list;
      if (network === 'ALL' && params.type === 'ALL') {
        setChList(fullList);
      } else if (network !== 'ALL' && params.type === 'ALL') {
        list = await filterByNetwork(fullList);
      } else if (network === 'ALL' && params.type !== 'ALL') {
        list = await filterByType(fullList);
      } else {
        list = await filterByNetwork(fullList);
        list = await filterByType(list);
      }
      if (list.length === 0) {
        setChList(chargerInfo);
      } else {
        setChList(list);
      }
    } catch (err) {
      console.log(err);
    }
  }, [params, network]);

  const updateChargerInfoList = () => {
    loadChargerList();
  };

  function allAreEqual(array) {
    const result = array.every(element => {
      if (element === array[0]) {
        return true;
      }
    });

    return result;
  }

  const renewalGetAPY =  (item, coingecko, allContract, busdPrice, quantityInfo, pancakeTotalSupply, penUsd, assaUsd) => {
    const endTime = Number(item.startTime) + Number(item.DURATION);
    const currentTime = Number(moment(new Date()).unix())
    const duration = endTime - currentTime
    const nums = 0.000000000000000001;
    console.log(item.symbol, item.name , '123123123123123123')

    const year = 365 * 24 * 60 * 60;

    if(item.name === '6.2 RCG Locked Pool - ASSA Reward') {

      const _allContract = _.flatten(Object.keys(allContract.chargeList).map((key, i) => {
        return allContract.chargeList[key];
      }))

      const filteredData = _allContract.filter((list, i) => {
        return  item.name === list.name
      })
      const totalReward = filteredData[0].liquidity * assaUsd;
      const totalSupply = Number(fromWei(item.totalSupply));

      const totalDeposit = totalSupply * coingecko;

      const result = (year / Number(item.DURATION)) * (totalReward / totalDeposit) * 100;
      return result;
    }

    // console.log(coingecko, 'coinc', item)

    // if(item.symbol.includes('PEN') && !item.symbol.includes('RCG')) {
    //   console.log(coingecko, 'coinc', item.symbol);
    //   const totalReward = (Number(item.rewardAmount) - Number(item.totalSupply)) * penCoin
    //   const totalDeposit = Number(item.totalSupply) * penCoin;
    //   const result =  (year / Number(item.DURATION)) * (totalReward / totalDeposit);
    //   return result;
    //
    // }
    if(item.name.includes('LP')) {

      const rechargeQuantity = Number(fromWei(quantityInfo['0'])) ;
      const busdQuantity = Number(fromWei(quantityInfo['1']))
      const convertTotalSupply = Number(fromWei(pancakeTotalSupply));
      const rechargeUSD = rechargeQuantity * coingecko;
      const busdUSD = busdQuantity * busdPrice
      const lpPrice = (rechargeUSD + busdUSD) / convertTotalSupply
      const _allContract = _.flatten(Object.keys(allContract.chargeList).map((key, i) => {
        return allContract.chargeList[key];
      }))
      const filteredData = _allContract.filter((list, i) => {
        return  item.name === list.name
      })

      const totalReward = filteredData[0]?.liquidity * coingecko;
      const totalSupply = Number(fromWei(item.totalSupply)) * lpPrice;


      return (year / Number(item.DURATION)) * (totalReward / totalSupply) * 100;

    }



    if(allAreEqual(item.symbol)) {
      // const totalReward = (Number(item.rewardAmount) - Number(item.totalSupply));
      // const totalDeposit = Number(item.totalSupply);
      //
      // const result =  (year / duration) * (totalReward / totalDeposit) * 100;
      // // console.log(result, 'result', year / Number(item.DURATION), totalReward, totalDeposit, totalReward/totalDeposit, item );
      // return result;

      const _allContract = _.flatten(Object.keys(allContract.chargeList).map((key, i) => {
        return allContract.chargeList[key];
      }))

      const filteredData = _allContract.filter((list, i) => {
        return  item.name === list.name
      })

      const totalSupply = Number(fromWei(item.totalSupply));
      console.log(filteredData, item.name, totalSupply)

      const result = (year / Number(item.DURATION)) * (filteredData[0]?.liquidity / totalSupply) * 100;

      return result;
    }

    if(!allAreEqual(item.symbol) && !item.name.includes('LP')) {
      const _allContract = _.flatten(Object.keys(allContract.chargeList).map((key, i) => {
        return allContract.chargeList[key];
      }))
      const filteredData = _allContract.filter((list, i) => {
        return  item.name === list.name
      })
      const totalReward = filteredData[0].liquidity * penUsd;
      const totalSupply = Number(fromWei(item.totalSupply));

      const totalDeposit = totalSupply* coingecko;

      const result = (year / Number(item.DURATION)) * (totalReward / totalDeposit) * 100;
      return result;

      // const totalReward = (Number(item.rewardAmount) - Number(item.totalSupply)) * penCoin;
      // const totalDeposit = Number(item.totalSupply)* coingecko;
      //
      // const result =  (year / duration) * (totalReward / totalDeposit) * 100;
      // return result;
    }


    const totalReward = (Number(item.rewardAmount) - Number(item.totalSupply)) * coingecko;
    const totalDeposit = Number(item.totalSupply) * coingecko;

    const result =  (year / Number(item.DURATION)) * (totalReward / totalDeposit);

    // console.log(result, 'result', year / Number(item.DURATION), totalReward, totalDeposit, totalReward/totalDeposit, item );
    return result;



    return result;
  }

  const getAPY = (totalSupply, rewardAmount, DURATION, name, network, item) => {
    if(item.name === '4.17 RCG Locked Pool - PEN Reward') {
      return 304.49;
    }
    const Year = 1 * 365 * 24 * 60 * 60;

    if (
      name === '11.12 Pancake LP Locked Pool 300' ||
      name === '11.12 Premier Locked Pool 200' ||
      name === '11.12 Locked Pool 100'
    ) {
      return 0;
    }

    if (name.includes('LP')) {
      if (network === 'BEP') {
        // console.log(((((rewardAmount * (Year / DURATION)) / totalSupply) * 100) / 25).toString())
        return ((((rewardAmount * (Year / DURATION)) / totalSupply) * 100) / 25.6328762768).toString();
      } else if (network === 'ERC') {
        // console.log(toBN(rewardAmount))
        // console.log(fromWei(rewardAmount, "ether"))
        // console.log(((((rewardAmount * (Year / DURATION)) / totalSupply) * 100) / 31).toString())
        // return ((((rewardAmount * (Year / DURATION)) / totalSupply) * 100) / 31).toString();
        return ((((rewardAmount * (Year / DURATION)) / totalSupply) * 100) / 966514.761619).toString();
      }
    } else {
      return (((rewardAmount * (Year / DURATION)) / totalSupply) * 100).toString();
    }
  };

  const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  };


  console.log(chList, 'chList')

  return (
    <Container>
      <Content>
        <RowContainer>
          {chList.map((charger, index) => {
            return (
              <div
                // className={params.isLP === true ? "disable" : ""}
                style={charger.name === 'Loading List..' ? { cursor: 'not-allowed' } : {}}
              >
                <div style={{ cursor: 'pointer' }}>
                  <Row
                    key={charger.name}
                    index={index}
                    status={charger.status} // active or not
                    name={charger.name}
                    tvl={charger.totalSupply}
                    apy={charger.apy}
                    info={charger}
                    limit={charger.limit}
                    params={params} // 버튼에 대한 분기처리 때문에 필요
                    toast={toast}
                    period={loadPoolPeriod(charger.startTime, charger.DURATION)}
                    poolNet={charger.network}
                    startTime={charger.startTime}
                    poolTVL={charger.poolTVL}
                    allContractInfo={allContractInfo}
                  />
                </div>
              </div>
            );
          })}
        </RowContainer>
      </Content>
    </Container>
  );
}

const loadPoolPeriod = (startTime, duration) => {
  let ret = '21.01.01 00:00:00 ~ 21.01.30 00:00:00((UTC+9)+9)';
  const endTime = Number(startTime) + Number(duration);

  const formatter = (timestamp) => {
    var d = new Date(Number(timestamp) * 1000);
    const z = (x) => {
      return x.toString().padStart(2, '0');
    };
    return `${new String(d.getFullYear()).substr(2, 3)}.${z(d.getMonth() + 1)}.${z(d.getDate())} ${z(d.getHours())}:${z(
      d.getMinutes()
    )}:${z(d.getSeconds())}`;
  };
  ret = `${formatter(startTime)} ~ ${formatter(endTime)}`;
  return ret;
};

const loadActiveStatus = ({ totalSupply, startTime, DURATION, limit, name }) => {
  startTime = Number(startTime);
  DURATION = Number(DURATION);
  let NOW = new Date().getTime() / 1000;

  // 11.1 풀을 위해 일시적으로 사용합니다.
  if (name.includes('11.1 ')) return 'Inactive';

  if (name.includes('10.1 ')) return 'Inactive';

  if (name.includes('11.12 ')) return 'Closed';

  if (NOW < startTime) return 'Inactive';

  if (NOW > startTime + DURATION) return 'Closed';
  // 리미트 설정 이전까지 잠정 주석처리 합니다.
  // if (limit != "0" && totalSupply >= limit) return "Close";
  return 'Active';
};
function makeNum(str = '0', decimal = 4) {
  let newStr = str;
  if (typeof newStr === 'number') newStr = str.toString();
  let arr = newStr.split('.');
  if (arr.length == 1 || arr[0].length > 8) return arr[0];
  else {
    return arr[0] + '.' + arr[1].substr(0, decimal);
  }
}

function convert(n) {
  var sign = +n < 0 ? '-' : '',
    toStr = n.toString();
  if (!/e/i.test(toStr)) {
    return n;
  }
  var [lead, decimal, pow] = n
    .toString()
    .replace(/^-/, '')
    .replace(/^([0-9]+)(e.*)/, '$1.$2')
    .split(/e|\./);
  return +pow < 0
    ? sign + '0.' + '0'.repeat(Math.max(Math.abs(pow) - 1 || 0, 0)) + lead + decimal
    : sign +
        lead +
        (+pow >= decimal.length
          ? decimal + '0'.repeat(Math.max(+pow - decimal.length || 0, 0))
          : decimal.slice(0, +pow) + '.' + decimal.slice(+pow));
}

const Container = styled.div`
  // margin-top: 20px;
  margin-bottom: 120px;
  display: flex;
  width: 100%;
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 1088px;

  img {
    height: 60px;
    margin: auto;
    @media (min-width: 1088px) {
      margin: 0;
      align-items: flex-end
    }
  }
  div{
  }
  p {
    color: white;
    // margin: auto;
    margin-top: 20px;

    @media (min-width: 1088px) {
      margin: 0;
      margin-left: 10px;
      margin-bottom: 0px;
  }
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: 1088px) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }
`;
const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
const RowContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 30px 0px 30px;

  @media (min-width: 1088px) {
    margin: 0px;
    margin-top: 40px;
  }

  .disable {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const TotalValue = styled.div``;
const Line = styled.div`
  height: 2px;
  margin: 40px 10px 0px 10px;
  width: auto;
  background-color: #9314b2;
  box-shadow: 0px 0px 20px 0.5px white;
`;

// const DropDownWrapper = styled.div`
// display:flex;
// justify-content: flex-end;
// `;
// const NetWork = styled.div``;
// const Text = styled.div``;
// const Box = styled.div`
// width: 196px;
// height: 42px;
// // margin: 8px 0 0 302px;
// // padding: 0 0 0 2px;
// object-fit: contain;
// border-radius: 30px;
// background-color: var(--black-30);
// `;
// const Type = styled.div``;
// const Sortby = styled.div``;
// const BoxContainer = styled.div`
// display:flex;
// `;
// const Button = styled.div``;
// const Btn = styled.div``

export default List;
