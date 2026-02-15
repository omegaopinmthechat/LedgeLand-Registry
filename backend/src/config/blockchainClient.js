import { ethers } from "ethers";
import { config } from "dotenv";

config();

// Network configuration
const NETWORKS = {
  sepolia: {
    name: "Sepolia Testnet",
    rpcUrl: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    chainId: 11155111,
    blockExplorer: "https://sepolia.etherscan.io",
  },
};

// Smart contract ABI
const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "plotId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "ownerName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "deedCID",
        "type": "string"
      }
    ],
    "name": "LandRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "plotId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "newOwnerName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "deedCID",
        "type": "string"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_plotId",
        "type": "uint256"
      }
    ],
    "name": "getCurrentOwner",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_plotId",
        "type": "uint256"
      }
    ],
    "name": "getOwnershipHistory",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "ownerName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "nationalId",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "deedCID",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct LandRegistry.OwnerRecord[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "lands",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "plotId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "location",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "exists",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "currentOwnerName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "currentOwnerNationalId",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_plotId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_location",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_ownerName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_nationalId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_deedCID",
        "type": "string"
      }
    ],
    "name": "registerLand",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "registrar",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_plotId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_newOwnerName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_newNationalId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_newDeedCID",
        "type": "string"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Validate environment variables
const requiredEnvVars = {
  ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
  NETWORK: process.env.NETWORK || "sepolia",
};

for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    throw new Error(`${key} is not defined in environment variables`);
  }
}

// Get network configuration
const networkName = process.env.NETWORK || "sepolia";
const networkConfig = NETWORKS[networkName];

if (!networkConfig) {
  throw new Error(`Unsupported network: ${networkName}`);
}

// Initialize provider and wallet
const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Initialize contract instance
const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  CONTRACT_ABI,
  wallet
);

console.log(`✅ Blockchain client initialized`);
console.log(`   Network: ${networkConfig.name}`);
console.log(`   Contract: ${process.env.CONTRACT_ADDRESS}`);
console.log(`   Wallet: Connected`);

export { provider, wallet, contract, networkConfig };
