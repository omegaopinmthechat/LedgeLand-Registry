import express from "express";
import blockchainController from "../controllers/registrar/registrar.blockchain.controller.js";

const router = express.Router();

// Public blockchain read operations (no authentication required)
// These are read-only operations that don't modify blockchain state

// Get ownership history for a plot
router.get("/history/:plotId", blockchainController.getOwnershipHistory);

// Get current owner of a plot
router.get("/owner/:plotId", blockchainController.getCurrentOwner);

// Get land details
router.get("/land/:plotId", blockchainController.getLandDetails);

export default router;
