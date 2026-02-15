"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { getContractAddress, getNetworkConfig, DEFAULT_NETWORK } from "@/config/blockchain";
import LandRegistryABI from "@/contracts/LandRegistry.json";

const Web3Context = createContext(undefined);

// Provides Web3 wallet connection and smart contract interaction
export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Initialize read-only provider for viewing data without wallet
  useEffect(() => {
    const initReadOnlyProvider = async () => {
      try {
        // Use public RPC for read-only operations
        const readOnlyProvider = new ethers.JsonRpcProvider(
          "https://sepolia.infura.io/v3/" + process.env.NEXT_PUBLIC_INFURA_KEY
        );
        setProvider(readOnlyProvider);
      } catch (err) {
        console.error("Failed to initialize read-only provider:", err);
      }
    };

    if (!provider) {
      initReadOnlyProvider();
    }
  }, [provider]);

  // Connect to MetaMask wallet
  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask to use this dApp");
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        throw new Error("No accounts found. Please unlock MetaMask");
      }

      // Create provider and signer
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const network = await web3Provider.getNetwork();
      const currentChainId = Number(network.chainId);

      // Verify network - if wrong network, attempt to switch
      if (currentChainId !== DEFAULT_NETWORK.chainIdDecimal) {
        try {
          // Request network switch
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: DEFAULT_NETWORK.chainId }],
          });
        } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: DEFAULT_NETWORK.chainId,
                    chainName: DEFAULT_NETWORK.name,
                    nativeCurrency: {
                      name: "Sepolia ETH",
                      symbol: "ETH",
                      decimals: 18,
                    },
                    rpcUrls: [DEFAULT_NETWORK.rpcUrl],
                    blockExplorerUrls: [DEFAULT_NETWORK.blockExplorer],
                  },
                ],
              });
            } catch (addError) {
              throw new Error("Failed to add Sepolia network to MetaMask");
            }
          } else {
            throw new Error("Failed to switch to Sepolia network. Please switch manually in MetaMask");
          }
        }

        // After switching, need to get provider again
        const newWeb3Provider = new ethers.BrowserProvider(window.ethereum);
        const newNetwork = await newWeb3Provider.getNetwork();
        const newChainId = Number(newNetwork.chainId);

        if (newChainId !== DEFAULT_NETWORK.chainIdDecimal) {
          throw new Error("Network switch failed. Please manually switch to Sepolia in MetaMask");
        }
      }

      // Get signer after network is confirmed
      const web3Signer = await web3Provider.getSigner();
      const finalNetwork = await web3Provider.getNetwork();
      const finalChainId = Number(finalNetwork.chainId);

      // Get contract address
      const contractAddress = getContractAddress(finalChainId);
      if (!contractAddress) {
        throw new Error("Contract address not configured for this network");
      }

      // Initialize contract
      const landRegistryContract = new ethers.Contract(
        contractAddress,
        LandRegistryABI.abi,
        web3Signer
      );

      setAccount(accounts[0]);
      setProvider(web3Provider);
      setSigner(web3Signer);
      setContract(landRegistryContract);
      setChainId(finalChainId);

      return accounts[0];
    } catch (err) {
      const errorMessage = err.message || "Failed to connect wallet";
      setError(errorMessage);
      console.error("Wallet connection error:", err);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setSigner(null);
    setContract(null);
    setChainId(null);
    setError(null);
    
    // Reinitialize read-only provider
    const readOnlyProvider = new ethers.JsonRpcProvider(
      "https://sepolia.infura.io/v3/" + process.env.NEXT_PUBLIC_INFURA_KEY
    );
    setProvider(readOnlyProvider);
  }, []);

  // Get read-only contract instance (no wallet needed)
  const getReadOnlyContract = useCallback(() => {
    if (!provider) return null;

    try {
      const contractAddress = getContractAddress(DEFAULT_NETWORK.chainIdDecimal);
      if (!contractAddress) return null;

      return new ethers.Contract(
        contractAddress,
        LandRegistryABI.abi,
        provider
      );
    } catch (err) {
      console.error("Failed to create read-only contract:", err);
      return null;
    }
  }, [provider]);

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
      }
    };

    const handleChainChanged = () => {
      // Reload the page when chain changes
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [account, disconnectWallet]);

  // Auto-connect if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      if (!window.ethereum) return;

      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length > 0) {
          await connectWallet();
        }
      } catch (err) {
        console.error("Auto-connect failed:", err);
      }
    };

    autoConnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const value = {
    account,
    provider,
    signer,
    contract,
    chainId,
    isConnecting,
    error,
    isConnected: !!account,
    networkConfig: chainId ? getNetworkConfig(chainId) : DEFAULT_NETWORK,
    connectWallet,
    disconnectWallet,
    getReadOnlyContract,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

// Custom hook to access Web3 context
export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};
