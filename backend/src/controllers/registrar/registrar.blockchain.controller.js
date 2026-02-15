import blockchainService from "../../services/registrar/registrar.blockchain.service.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { ApiError } from "../../../utils/ApiError.js";

/**
 * Register a new land on the blockchain
 * POST /api/v1/registrar/blockchain/register
 */
const registerLand = async (req, res, next) => {
  try {
    const { plotId, location, ownerName, nationalId, deedCID } = req.body;

    // Validate required fields
    if (!plotId || !location || !ownerName || !nationalId || !deedCID) {
      throw new ApiError(400, "All fields are required: plotId, location, ownerName, nationalId, deedCID");
    }

    // Validate plotId is a number
    const plotIdNum = parseInt(plotId);
    if (isNaN(plotIdNum) || plotIdNum <= 0) {
      throw new ApiError(400, "Plot ID must be a positive number");
    }

    // Validate nationalId format (basic validation)
    if (nationalId.length < 5) {
      throw new ApiError(400, "National ID must be at least 5 characters");
    }

    // Register land on blockchain
    const result = await blockchainService.registerLand({
      plotId: plotIdNum,
      location,
      ownerName,
      nationalId,
      deedCID,
    });

    res.status(201).json(
      new ApiResponse(201, result, "Land registered successfully on blockchain")
    );
  } catch (error) {
    console.error("❌ Controller Error:", error);
    console.error("Error stack:", error.stack);
    
    if (error instanceof ApiError) {
      next(error);
    } else {
      // Pass through user-friendly error messages without additional prefix
      const errorMessage = error.message || "Failed to register land on blockchain";
      next(new ApiError(500, errorMessage));
    }
  }
};

/**
 * Transfer land ownership on the blockchain
 * POST /api/v1/registrar/blockchain/transfer
 */
const transferOwnership = async (req, res, next) => {
  try {
    const { plotId, newOwnerName, newNationalId, deedCID } = req.body;

    // Validate required fields
    if (!plotId || !newOwnerName || !newNationalId || !deedCID) {
      throw new ApiError(400, "All fields are required: plotId, newOwnerName, newNationalId, deedCID");
    }

    // Validate plotId is a number
    const plotIdNum = parseInt(plotId);
    if (isNaN(plotIdNum) || plotIdNum <= 0) {
      throw new ApiError(400, "Plot ID must be a positive number");
    }

    // Validate nationalId format (basic validation)
    if (newNationalId.length < 5) {
      throw new ApiError(400, "National ID must be at least 5 characters");
    }

    // Transfer ownership on blockchain
    const result = await blockchainService.transferOwnership({
      plotId: plotIdNum,
      newOwnerName,
      newNationalId,
      deedCID,
    });

    res.status(200).json(
      new ApiResponse(200, result, "Land ownership transferred successfully on blockchain")
    );
  } catch (error) {
    console.error("❌ Transfer Controller Error:", error);
    
    if (error instanceof ApiError) {
      next(error);
    } else {
      // Pass through user-friendly error messages without additional prefix
      const errorMessage = error.message || "Failed to transfer land ownership on blockchain";
      next(new ApiError(500, errorMessage));
    }
  }
};

/**
 * Get ownership history for a plot
 * GET /api/v1/registrar/blockchain/history/:plotId
 */
const getOwnershipHistory = async (req, res, next) => {
  try {
    const { plotId } = req.params;

    // Validate plotId
    const plotIdNum = parseInt(plotId);
    if (isNaN(plotIdNum) || plotIdNum <= 0) {
      throw new ApiError(400, "Plot ID must be a positive number");
    }

    // Get ownership history from blockchain
    const history = await blockchainService.getOwnershipHistory(plotIdNum);

    res.status(200).json(
      new ApiResponse(200, { history }, "Ownership history retrieved successfully")
    );
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      const errorMessage = error.message || "Failed to retrieve ownership history";
      next(new ApiError(500, errorMessage));
    }
  }
};

/**
 * Get current owner of a plot
 * GET /api/v1/registrar/blockchain/owner/:plotId
 */
const getCurrentOwner = async (req, res, next) => {
  try {
    const { plotId } = req.params;

    // Validate plotId
    const plotIdNum = parseInt(plotId);
    if (isNaN(plotIdNum) || plotIdNum <= 0) {
      throw new ApiError(400, "Plot ID must be a positive number");
    }

    // Get current owner from blockchain
    const owner = await blockchainService.getCurrentOwner(plotIdNum);

    res.status(200).json(
      new ApiResponse(200, owner, "Current owner retrieved successfully")
    );
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      const errorMessage = error.message || "Failed to retrieve current owner";
      next(new ApiError(500, errorMessage));
    }
  }
};

/**
 * Get land details
 * GET /api/v1/registrar/blockchain/land/:plotId
 */
const getLandDetails = async (req, res, next) => {
  try {
    const { plotId } = req.params;

    // Validate plotId
    const plotIdNum = parseInt(plotId);
    if (isNaN(plotIdNum) || plotIdNum <= 0) {
      throw new ApiError(400, "Plot ID must be a positive number");
    }

    // Get land details from blockchain
    const land = await blockchainService.getLandDetails(plotIdNum);

    res.status(200).json(
      new ApiResponse(200, land, "Land details retrieved successfully")
    );
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      const errorMessage = error.message || "Failed to retrieve land details";
      next(new ApiError(500, errorMessage));
    }
  }
};

export default {
  registerLand,
  transferOwnership,
  getOwnershipHistory,
  getCurrentOwner,
  getLandDetails,
};
