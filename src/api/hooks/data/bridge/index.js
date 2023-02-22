import axios from '../../api'
import Web3 from 'web3'
import ERC20_ABI from '../../../../lib/read_contract/abi/erc20.json'

export const fetchGetBridges = async () => {
  const { data } = await axios.get('/bridge')
  return data
}

export const fetchGetBalance = async ({ networkUrl, contract, address }) => {
  const web3 = new Web3(networkUrl)
  const contractInstance = new web3.eth.Contract(ERC20_ABI, contract)
  const balance = await contractInstance.methods.balanceOf(address).call()
  return balance
}
