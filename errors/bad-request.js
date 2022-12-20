const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./custom-api");

//----------------------
class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

//----------------------
const generateBadRequestError = (errorMessage) => {
  return new BadRequestError(errorMessage);
};

//----------------------
module.exports = { generateBadRequestError, BadRequestError };
