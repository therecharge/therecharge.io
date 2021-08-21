export function changeNetwork(requireNetwork) {
  console.log("Change!");
  let rpc = {
    0x80: {
      id: 1,
      jsonrpc: "2.0",
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x80",
          chainName: "Heco Chain",
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
  };
  window.ethereum.request(rpc[requireNetwork]);
}
