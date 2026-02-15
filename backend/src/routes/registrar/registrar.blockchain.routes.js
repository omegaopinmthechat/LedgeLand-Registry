import express from "express";
import blockchainController from "../../controllers/registrar/registrar.blockchain.controller.js";
import verifyRegistrar from "../../middlewares/registrar.auth.middleware.js";

const router = express.Router();

// All blockchain routes require registrar authentication
router.use(verifyRegistrar);

// Register new land on blockchain
router.post("/register", blockchainController.registerLand);

// Transfer land ownership on blockchain
router.post("/transfer", blockchainController.transferOwnership);

// Get ownership history for a plot
router.get("/history/:plotId", blockchainController.getOwnershipHistory);

// Get current owner of a plot
router.get("/owner/:plotId", blockchainController.getCurrentOwner);

// Get land details
router.get("/land/:plotId", blockchainController.getLandDetails);

export default router;
