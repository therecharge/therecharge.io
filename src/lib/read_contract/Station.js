// Create contract instance (web3, Address, Abi ) => return (contract_instance)
export const createContractInstance = (web3, address, abi) => {
  return new web3.eth.Contract(abi, address);
};

// Get chargers list (chargerList_contractI) => return [charger1_address, charger2_address, charger3_address]
export const getChargerList = async (chargerListInstance) => {
  const chargerList = await chargerListInstance.methods.get().call();
  return chargerList;
};

// Get token info (token_instance) => return {redemtion, symbol}

export const getTokenInfo = async (token_instance) => {
  const Promises = [
    await token_instance.methods.basePercent().call(),
    await token_instance.methods.symbol().call(),
  ];
  const result = await Promise.all(Promises);
  return result;
};

// Get charger info (charger_address) => return {charger_info}
// => store 형태로 저장
// => Defi/station 에서 store에 접근해서 데이터 로드
// return data = {
//   limit: "40000",
//   token: [
//     "0xe74bE071f3b62f6A4aC23cA68E5E2A39797A3c30",
//     "0xe74bE071f3b62f6A4aC23cA68E5E2A39797A3c30",
//   ],
//   redemtion: 200,
//   symbol: ["RCG", "RCG"],
//   apy: 1065.9542517667592,
//   period: [1630659600, 2332800],
//   address: "0x3151F5c0cbEB09d0166E815F9c5e5acAFB0681EF",
//   tvl: "14914.127648",
//   name: "9.3 Locked Pool 500",
//   type: "locked",
// };
export const getChargerInfo = async (
  charger_instance,
  methods = [
    "stakeToken",
    "rewardToken",
    "limit",
    "startTime",
    "DURATION",
    "name",
    "totalSupply",
  ]
) => {
  const promises = await methods.map((method) => {
    return charger_instance.methods[method].call().call();
  });
  const methodsResult = await Promise.all(promises);
  let res = {};
  methods.map((method, i) => {
    res[method] = methodsResult[i];
  });
  return res;
};
