import { ethers } from "ethers";

/**
 * Transfer land ownership on blockchain
 * @param {Object} contract - Ethers contract instance with signer
 * @param {number} plotId - Plot ID
 * @param {string} newOwnerName - New owner's name
 * @param {string} newOwnerNationalId - New owner's national ID
 * @param {string} deedCID - IPFS CID of the deed document
 * @returns {Promise<Object>} Transaction receipt
 */
export const transferLandOwnership = async (
  contract,
  plotId,
  newOwnerName,
  newOwnerNationalId,
  deedCID
) => {
  if (!contract) {
    throw new Error("Contract not initialized");
  }

  if (!plotId || plotId <= 0) {
    throw new Error("Invalid plot ID");
  }

  if (!newOwnerName || newOwnerName.trim() === "") {
    throw new Error("Owner name is required");
  }

  if (!newOwnerNationalId || newOwnerNationalId.trim() === "") {
    throw new Error("National ID is required");
  }

  if (!deedCID || deedCID.trim() === "") {
    throw new Error("Deed CID is required");
  }

  try {
    // Estimate gas to check if transaction will succeed
    const gasEstimate = await contract.transferOwnership.estimateGas(
      plotId,
      newOwnerName,
      newOwnerNationalId,
      deedCID
    );

    // Call contract function
    const tx = await contract.transferOwnership(
      plotId,
      newOwnerName,
      newOwnerNationalId,
      deedCID,
      {
        gasLimit: gasEstimate * BigInt(120) / BigInt(100), // Add 20% buffer
      }
    );

    // Wait for transaction confirmation
    const receipt = await tx.wait();

    return {
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
    };
  } catch (error) {
    console.error("Transfer ownership error:", error);
    
    // Parse error message
    let errorMessage = "Transaction failed";
    if (error.reason) {
      errorMessage = error.reason;
    } else if (error.message) {
      if (error.message.includes("user rejected")) {
        errorMessage = "Transaction rejected by user";
      } else if (error.message.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for gas";
      } else {
        errorMessage = error.message;
      }
    }

    throw new Error(errorMessage);
  }
};

/**
 * Register new land on blockchain (registrar only)
 * @param {Object} contract - Ethers contract instance with signer
 * @param {number} plotId - Plot ID
 * @param {string} location - Land location
 * @param {string} ownerName - Owner's name
 * @param {string} ownerNationalId - Owner's national ID
 * @param {string} deedCID - IPFS CID of the deed document
 * @returns {Promise<Object>} Transaction receipt
 */
export const registerLand = async (
  contract,
  plotId,
  location,
  ownerName,
  ownerNationalId,
  deedCID
) => {
  if (!contract) {
    throw new Error("Contract not initialized");
  }

  if (!plotId || plotId <= 0) {
    throw new Error("Invalid plot ID");
  }

  if (!location || location.trim() === "") {
    throw new Error("Location is required");
  }

  if (!ownerName || ownerName.trim() === "") {
    throw new Error("Owner name is required");
  }

  if (!ownerNationalId || ownerNationalId.trim() === "") {
    throw new Error("National ID is required");
  }

  if (!deedCID || deedCID.trim() === "") {
    throw new Error("Deed CID is required");
  }

  try {
    // Estimate gas
    const gasEstimate = await contract.registerLand.estimateGas(
      plotId,
      location,
      ownerName,
      ownerNationalId,
      deedCID
    );

    // Call contract function
    const tx = await contract.registerLand(
      plotId,
      location,
      ownerName,
      ownerNationalId,
      deedCID,
      {
        gasLimit: gasEstimate * BigInt(120) / BigInt(100),
      }
    );

    const receipt = await tx.wait();

    return {
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
    };
  } catch (error) {
    console.error("Register land error:", error);
    
    let errorMessage = "Registration failed";
    if (error.reason) {
      errorMessage = error.reason;
    } else if (error.message) {
      if (error.message.includes("Only registrar allowed")) {
        errorMessage = "Only registrar can register land";
      } else if (error.message.includes("user rejected")) {
        errorMessage = "Transaction rejected by user";
      } else {
        errorMessage = error.message;
      }
    }

    throw new Error(errorMessage);
  }
};

/**
 * Get ownership history for a plot with blockchain verification details
 * @param {Object} contract - Ethers contract instance (read-only OK)
 * @param {number} plotId - Plot ID
 * @returns {Promise<Array>} Ownership history with verification data
 */
export const getOwnershipHistory = async (contract, plotId) => {
  if (!contract) {
    throw new Error("Contract not initialized");
  }

  if (!plotId || plotId <= 0) {
    throw new Error("Invalid plot ID");
  }

  try {
    // Get ownership history from contract
    const history = await contract.getOwnershipHistory(plotId);

    // Get blockchain events for verification
    const registeredFilter = contract.filters.LandRegistered(plotId);
    const transferredFilter = contract.filters.OwnershipTransferred(plotId);

    const [registeredEvents, transferredEvents] = await Promise.all([
      contract.queryFilter(registeredFilter),
      contract.queryFilter(transferredFilter),
    ]);

    // Combine all events and sort by block number
    const allEvents = [...registeredEvents, ...transferredEvents].sort(
      (a, b) => a.blockNumber - b.blockNumber
    );

    // Format the history data with blockchain verification
    return history.map((record, index) => {
      const event = allEvents[index];
      return {
        ownerName: record.ownerName,
        nationalId: record.nationalId,
        deedCID: record.deedCID,
        timestamp: Number(record.timestamp),
        date: new Date(Number(record.timestamp) * 1000).toLocaleString(),
        ipfsUrl: `https://gateway.pinata.cloud/ipfs/${record.deedCID}`,
        // Blockchain verification data
        transactionHash: event?.transactionHash || null,
        blockNumber: event?.blockNumber || null,
        explorerUrl: event?.transactionHash 
          ? `https://sepolia.etherscan.io/tx/${event.transactionHash}`
          : null,
        blockExplorerUrl: event?.blockNumber
          ? `https://sepolia.etherscan.io/block/${event.blockNumber}`
          : null,
        verified: !!event?.transactionHash,
      };
    });
  } catch (error) {
    console.error("Get ownership history error:", error);
    
    if (error.message.includes("Land does not exist")) {
      throw new Error("Plot ID not found");
    }
    
    throw new Error("Failed to fetch ownership history");
  }
};

/**
 * Get current owner of a plot (gas-free view function)
 * @param {Object} contract - Ethers contract instance (read-only OK)
 * @param {number} plotId - Plot ID
 * @returns {Promise<Object>} Current owner {name, nationalId}
 */
export const getCurrentOwner = async (contract, plotId) => {
  if (!contract) {
    throw new Error("Contract not initialized");
  }

  if (!plotId || plotId <= 0) {
    throw new Error("Invalid plot ID");
  }

  try {
    const [ownerName, nationalId] = await contract.getCurrentOwner(plotId);
    return {
      ownerName,
      nationalId,
    };
  } catch (error) {
    console.error("Get current owner error:", error);
    
    if (error.message.includes("Land does not exist")) {
      throw new Error("Plot ID not found");
    }
    
    throw new Error("Failed to fetch current owner");
  }
};

/**
 * Get land details (gas-free view function)
 * @param {Object} contract - Ethers contract instance (read-only OK)
 * @param {number} plotId - Plot ID
 * @returns {Promise<Object>} Land details
 */
export const getLandDetails = async (contract, plotId) => {
  if (!contract) {
    throw new Error("Contract not initialized");
  }

  if (!plotId || plotId <= 0) {
    throw new Error("Invalid plot ID");
  }

  try {
    const land = await contract.lands(plotId);

    if (!land.exists) {
      throw new Error("Plot ID not found");
    }

    return {
      plotId: Number(land.plotId),
      location: land.location,
      exists: land.exists,
      currentOwnerName: land.currentOwnerName,
      currentOwnerNationalId: land.currentOwnerNationalId,
    };
  } catch (error) {
    console.error("Get land details error:", error);
    throw new Error("Failed to fetch land details");
  }
};

/**
 * Format wallet address for display
 * @param {string} address - Wallet address
 * @returns {string} Shortened address
 */
export const formatAddress = (address) => {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * Format transaction hash for display
 * @param {string} hash - Transaction hash
 * @returns {string} Shortened hash
 */
export const formatTxHash = (hash) => {
  if (!hash) return "";
  return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
};

/**
 * Format national ID for display
 * @param {string} nationalId - National ID
 * @returns {string} Masked national ID
 */
export const formatNationalId = (nationalId) => {
  if (!nationalId) return "";
  if (nationalId.length <= 4) return nationalId;
  return `${nationalId.substring(0, 3)}***${nationalId.substring(nationalId.length - 2)}`;
};
