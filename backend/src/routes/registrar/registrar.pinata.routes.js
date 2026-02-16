import express from "express";
import multer from "multer";
import registrarPinataController from "../../controllers/registrar/registrar.pinata.controller.js";
import verifyRegistrar from "../../middlewares/registrar.auth.middleware.js";
import HTTP_STATUS from "../../../utils/http.js";
import { ApiError } from "../../../utils/ApiError.js";

const router = express.Router();

// Configure multer for file uploads (using memory storage for serverless compatibility)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
});

// Multer error handling middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          new ApiError(
            HTTP_STATUS.BAD_REQUEST,
            "File size exceeds 100MB limit",
          ),
        );
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          new ApiError(
            HTTP_STATUS.BAD_REQUEST,
            'Invalid field name. Use "file" as the form field name',
          ),
        );
    }
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json(new ApiError(HTTP_STATUS.BAD_REQUEST, err.message));
  }
  next(err);
};

/**
 * @route POST /api/v1/registrar/pinata/file
 * @desc Upload a file to IPFS (Registrar only - requires authentication)
 * @access Protected - Registrar only
 * @headers Authorization: Bearer <token>
 * @formField file - The file to upload (required)
 */
router.post(
  "/file",
  verifyRegistrar,
  upload.single("file"),
  handleMulterError,
  registrarPinataController.uploadFile,
);

/**
 * @route POST /api/v1/registrar/pinata/json
 * @desc Upload JSON metadata to IPFS (Registrar only - requires authentication)
 * @access Protected - Registrar only
 * @headers Authorization: Bearer <token>
 */
router.post("/json", verifyRegistrar, registrarPinataController.uploadJSON);

export default router;
