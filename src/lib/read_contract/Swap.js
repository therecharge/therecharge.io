import { fromWei, toWei } from "web3-utils";

// Create contract instance (web3, Address, Abi ) => return (contract_instance)
export const createContractInstance = (web3, address, abi) => {
  return new web3.eth.Contract(abi, address);
};

// Get Swap Available Amount (token_instance) => return (available)
export const getSwapAvailableTokenAmount = async (
  swapTokenInstance,
  account
) => {
  const available = await swapTokenInstance.methods.balanceOf(account).call();
  return fromWei(available, "ether");
};
