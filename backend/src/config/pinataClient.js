import HTTP_STATUS from "../../utils/http.js";
import { ApiError } from "../../utils/ApiError.js";

const { PINATA_JWT } = process.env;

if (!PINATA_JWT) {
  throw new ApiError(
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    "PINATA_JWT is not defined in environment variables",
  );
}

export { PINATA_JWT };
