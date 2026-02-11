import express from "express";
import registrarAuthController from "../../controllers/registrar/registrar.auth.controller.js";

const router = express.Router();

router.post("/login", registrarAuthController.login);
router.post("/create", registrarAuthController.create);

export default router;
