import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import { PINATA_JWT } from "../../config/pinataClient.js";

const PINATA_FILE_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";
const PINATA_JSON_URL = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

/**
 * Upload a file to IPFS via Pinata (Registrar only)
 * @param {Object} file - Multer file object with path and originalname
 * @param {Object} registrarInfo - Registrar user info for metadata
 * @returns {Promise<Object>} Pinata response containing IpfsHash
 */
const uploadFile = async (file, registrarInfo = {}) => {
  if (!file || !file.path) {
    throw new Error("No file provided");
  }

  const data = new FormData();
  data.append("file", fs.createReadStream(file.path), file.originalname);

  // Add metadata about the registrar who uploaded it
  if (registrarInfo.email) {
    const metadata = JSON.stringify({
      name: file.originalname,
      keyvalues: {
        uploadedBy: registrarInfo.email,
        uploadedAt: new Date().toISOString(),
        registrarId: registrarInfo.id,
      },
    });
    data.append("pinataMetadata", metadata);
  }

  const response = await axios.post(PINATA_FILE_URL, data, {
    maxBodyLength: Infinity,
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
      ...data.getHeaders(),
    },
  });

  // Clean up temporary file
  try {
    fs.unlinkSync(file.path);
  } catch (err) {
    console.warn("Failed to delete temporary file:", err.message);
  }

  return response.data; // Contains IpfsHash
};

/**
 * Upload JSON metadata to IPFS via Pinata (Registrar only)
 * @param {Object} metadata - JSON object to upload
 * @param {Object} registrarInfo - Registrar user info
 * @returns {Promise<Object>} Pinata response containing IpfsHash
 */
const uploadJSON = async (metadata, registrarInfo = {}) => {
  if (!metadata || typeof metadata !== "object") {
    throw new Error("No metadata provided");
  }

  // Add registrar info to the metadata
  const enrichedMetadata = {
    ...metadata,
    _registrar: {
      uploadedBy: registrarInfo.email,
      uploadedAt: new Date().toISOString(),
      registrarId: registrarInfo.id,
    },
  };

  const response = await axios.post(PINATA_JSON_URL, enrichedMetadata, {
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
      "Content-Type": "application/json",
    },
  });

  return response.data; // Contains IpfsHash
};

export default {
  uploadFile,
  uploadJSON,
};
