import registrarPinataService from "../../services/registrar/registrar.pinata.service.js";
import HTTP_STATUS from "../../../utils/http.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

/**
 * Upload a file to IPFS (Registrar only)
 * @route POST /api/v1/registrar/pinata/file
 */
const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const registrarInfo = {
      id: req.user.id,
      email: req.user.email,
      fullName: req.user.user_metadata?.full_name,
    };

    if (!file) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(new ApiError(HTTP_STATUS.BAD_REQUEST, "File is required"));
    }

    const data = await registrarPinataService.uploadFile(file, registrarInfo);

    return res
      .status(HTTP_STATUS.CREATED)
      .json(
        new ApiResponse(
          HTTP_STATUS.CREATED,
          {
            cid: data.IpfsHash,
            pinSize: data.PinSize,
            timestamp: data.Timestamp,
            ipfsUrl: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`,
          },
          "File uploaded to IPFS successfully",
        ),
      );
  } catch (error) {
    console.error("Registrar Pinata file upload error:", error.message, error);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(
        new ApiError(
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          error.message || "File upload failed",
        ),
      );
  }
};

/**
 * Upload JSON metadata to IPFS (Registrar only)
 * @route POST /api/v1/registrar/pinata/json
 */
const uploadJSON = async (req, res) => {
  try {
    const metadata = req.body;
    const registrarInfo = {
      id: req.user.id,
      email: req.user.email,
      fullName: req.user.user_metadata?.full_name,
    };

    if (!metadata || Object.keys(metadata).length === 0) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          new ApiError(HTTP_STATUS.BAD_REQUEST, "JSON metadata is required"),
        );
    }

    const data = await registrarPinataService.uploadJSON(
      metadata,
      registrarInfo,
    );

    return res
      .status(HTTP_STATUS.CREATED)
      .json(
        new ApiResponse(
          HTTP_STATUS.CREATED,
          {
            cid: data.IpfsHash,
            pinSize: data.PinSize,
            timestamp: data.Timestamp,
            ipfsUrl: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`,
          },
          "JSON uploaded to IPFS successfully",
        ),
      );
  } catch (error) {
    console.error("Registrar Pinata JSON upload error:", error.message, error);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(
        new ApiError(
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          error.message || "JSON upload failed",
        ),
      );
  }
};

export default {
  uploadFile,
  uploadJSON,
};
