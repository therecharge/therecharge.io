export function changeNetwork(requireNetwork) {


  let rpc = {
    0x1: {
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x1" }],
    },
    0x3: {
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x3" }],
    },
    0x80: {
      id: 1,
      jsonrpc: "2.0",
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x80",
          chainName: "Huobi ECO Chain",
          rpcUrls: ["https://http-mainnet.hecochain.com"],
          nativeCurrency: {
            name: "HT",
            symbol: "HT",
            decimals: 18,
          },
          blockExplorerUrls: ["https://hecoinfo.com/"],
        },
      ],
    },
    0x38: {
      id: 1,
      jsonrpc: "2.0",
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x38",
          chainName: "Binance Smart Chain",
          rpcUrls: ["https://bsc-dataseed.binance.org"],
          nativeCurrency: {
            name: "BNB",
            symbol: "BNB",
            decimals: 18,
          },
          blockExplorerUrls: ["https://bscscan.com//"],
        },
      ],
    },

    0x141: {
      id: 1,
      jsonrpc: "2.0",
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x141",
          chainName: "KCC-MAINNET",
          rpcUrls: ["https://rpc-mainnet.kcc.network"],
          nativeCurrency: {
            name: "KCC",
            symbol: "KCS",
            decimals: 18,
          },
          blockExplorerUrls: ["https://scan.kcc.io/"],
        },
      ],
    },
  };
  console.log(requireNetwork, 'requireNetwork', rpc["56"])

  if (window.ethereum) window.ethereum.request(rpc[requireNetwork]);
  else {
    alert("Change Network not support.\r\nPlease change network your self");
  }
}
