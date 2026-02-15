// Blockchain configuration for Land Registry smart contract

export const NETWORKS = {
  sepolia: {
    chainId: "0xaa36a7", // 11155111 in hex
    chainIdDecimal: 11155111,
    name: "Sepolia Testnet",
    rpcUrl: `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY || ""}`,
    blockExplorer: "https://sepolia.etherscan.io",
  },
};

// Contract addresses by network
export const CONTRACT_ADDRESSES = {
  sepolia: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "",
};

// Get contract address for current network
export const getContractAddress = (chainId) => {
  switch (chainId) {
    case 11155111:
      return CONTRACT_ADDRESSES.sepolia;
    default:
      throw new Error(`Unsupported network: ${chainId}`);
  }
};

// Get network config
export const getNetworkConfig = (chainId) => {
  switch (chainId) {
    case 11155111:
      return NETWORKS.sepolia;
    default:
      throw new Error(`Unsupported network: ${chainId}`);
  }
};

// Default network for the application
export const DEFAULT_NETWORK = NETWORKS.sepolia;
