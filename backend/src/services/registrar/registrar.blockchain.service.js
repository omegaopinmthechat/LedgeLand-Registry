import { contract, networkConfig } from "../../config/blockchainClient.js";

/**
 * Register a new land on the blockchain
 * @param {Object} landData - Land registration data
 * @param {number} landData.plotId - Unique plot identifier
 * @param {string} landData.location - Land location
 * @param {string} landData.ownerName - Owner's full name
 * @param {string} landData.nationalId - Owner's national ID
 * @param {string} landData.deedCID - IPFS CID of the deed document
 * @returns {Promise<Object>} Transaction receipt with details
 */
const registerLand = async ({ plotId, location, ownerName, nationalId, deedCID }) => {
  try {
    console.log(`📝 Registering land on blockchain...`);
    console.log(`   Plot ID: ${plotId}`);
    console.log(`   Location: ${location}`);
    console.log(`   Owner: ${ownerName} (ID: ${nationalId})`);
    console.log(`   Deed CID: ${deedCID}`);

    // Call the smart contract function
    const tx = await contract.registerLand(
      plotId,
      location,
      ownerName,
      nationalId,
      deedCID
    );

    console.log(`⏳ Transaction submitted: ${tx.hash}`);

    // Wait for transaction confirmation
    const receipt = await tx.wait();

    console.log(`✅ Land registered successfully!`);
    console.log(`   Block: ${receipt.blockNumber}`);
    console.log(`   Gas used: ${receipt.gasUsed.toString()}`);

    return {
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      explorerUrl: `${networkConfig.blockExplorer}/tx/${receipt.hash}`,
    };
  } catch (error) {
    console.error(`❌ Error registering land:`, error);
    
    // Parse error message for user-friendly output
    let errorMessage = error.message;
    if (error.reason) {
      errorMessage = error.reason;
    } else if (error.message?.includes("Land already exists") || error.message?.includes("Land already registered")) {
      errorMessage = "This plot ID is already registered on the blockchain";
    } else if (error.message?.includes("execution reverted")) {
      errorMessage = "Transaction failed: Smart contract execution reverted";
    }

    throw new Error(errorMessage);
  }
};

/**
 * Transfer land ownership on the blockchain
 * @param {Object} transferData - Transfer data
 * @param {number} transferData.plotId - Plot identifier
 * @param {string} transferData.newOwnerName - New owner's full name
 * @param {string} transferData.newNationalId - New owner's national ID
 * @param {string} transferData.deedCID - IPFS CID of the new deed document
 * @returns {Promise<Object>} Transaction receipt with details
 */
const transferOwnership = async ({ plotId, newOwnerName, newNationalId, deedCID }) => {
  try {
    console.log(`🔄 Transferring land ownership on blockchain...`);
    console.log(`   Plot ID: ${plotId}`);
    console.log(`   New Owner: ${newOwnerName} (ID: ${newNationalId})`);
    console.log(`   Deed CID: ${deedCID}`);

    // Call the smart contract function
    const tx = await contract.transferOwnership(
      plotId,
      newOwnerName,
      newNationalId,
      deedCID
    );

    console.log(`⏳ Transaction submitted: ${tx.hash}`);

    // Wait for transaction confirmation
    const receipt = await tx.wait();

    console.log(`✅ Ownership transferred successfully!`);
    console.log(`   Block: ${receipt.blockNumber}`);
    console.log(`   Gas used: ${receipt.gasUsed.toString()}`);

    return {
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      explorerUrl: `${networkConfig.blockExplorer}/tx/${receipt.hash}`,
    };
  } catch (error) {
    console.error(`❌ Error transferring ownership:`, error);
    
    // Parse error message for user-friendly output
    let errorMessage = error.message;
    if (error.reason) {
      errorMessage = error.reason;
    } else if (error.message?.includes("Land does not exist") || error.message?.includes("not registered")) {
      errorMessage = "This plot ID is not registered on the blockchain";
    } else if (error.message?.includes("execution reverted")) {
      errorMessage = "Transaction failed: Smart contract execution reverted";
    }

    throw new Error(errorMessage);
  }
};

/**
 * Get ownership history for a plot
 * @param {number} plotId - Plot identifier
 * @returns {Promise<Array>} Array of ownership records
 */
const getOwnershipHistory = async (plotId) => {
  try {
    console.log(`🔍 Fetching ownership history for plot ${plotId}...`);

    const history = await contract.getOwnershipHistory(plotId);

    const formattedHistory = history.map((record) => ({
      ownerName: record.ownerName,
      nationalId: record.nationalId,
      deedCID: record.deedCID,
      timestamp: Number(record.timestamp),
      date: new Date(Number(record.timestamp) * 1000).toISOString(),
      verified: true, // All records from blockchain are verified
      ipfsUrl: `https://gateway.pinata.cloud/ipfs/${record.deedCID}`,
    }));

    console.log(`✅ Found ${formattedHistory.length} ownership record(s)`);

    return formattedHistory;
  } catch (error) {
    console.error(`❌ Error fetching ownership history:`, error);
    throw new Error(error.message);
  }
};

/**
 * Get current owner of a plot
 * @param {number} plotId - Plot identifier
 * @returns {Promise<Object>} Current owner information
 */
const getCurrentOwner = async (plotId) => {
  try {
    console.log(`🔍 Fetching current owner for plot ${plotId}...`);

    const [ownerName, nationalId] = await contract.getCurrentOwner(plotId);

    console.log(`✅ Current owner: ${ownerName} (ID: ${nationalId})`);

    return {
      ownerName,
      nationalId,
    };
  } catch (error) {
    console.error(`❌ Error fetching current owner:`, error);
    throw new Error(error.message);
  }
};

/**
 * Get land details
 * @param {number} plotId - Plot identifier
 * @returns {Promise<Object>} Land information
 */
const getLandDetails = async (plotId) => {
  try {
    console.log(`🔍 Fetching land details for plot ${plotId}...`);

    const land = await contract.lands(plotId);

    console.log(`✅ Land details retrieved`);

    return {
      plotId: Number(land.plotId),
      location: land.location,
      exists: land.exists,
      currentOwnerName: land.currentOwnerName,
      currentOwnerNationalId: land.currentOwnerNationalId,
    };
  } catch (error) {
    console.error(`❌ Error fetching land details:`, error);
    throw new Error(error.message);
  }
};

export default {
  registerLand,
  transferOwnership,
  getOwnershipHistory,
  getCurrentOwner,
  getLandDetails,
};
