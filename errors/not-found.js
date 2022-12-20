const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./custom-api");

//----------------------
class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

//----------------------
const generateNotFoundError = (errorMessage) => {
  return new NotFoundError(errorMessage);
};

//----------------------
module.exports = { generateNotFoundError, NotFoundError };
