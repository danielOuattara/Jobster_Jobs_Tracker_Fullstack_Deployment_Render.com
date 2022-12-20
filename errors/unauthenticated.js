const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./custom-api");

//----------------------
class UnauthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

//----------------------
const generateUnauthenticatedError = (errorMessage) => {
  return new UnauthenticatedError(errorMessage);
};

//----------------------
module.exports = { generateUnauthenticatedError, UnauthenticatedError };
