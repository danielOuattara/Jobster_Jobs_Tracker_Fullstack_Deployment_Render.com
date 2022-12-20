const CustomAPIError = require("./custom-api");
const {
  UnauthenticatedError,
  generateUnauthenticatedError,
} = require("./unauthenticated");
const { NotFoundError, generateNotFoundError } = require("./not-found");
const { BadRequestError, generateBadRequestError } = require("./bad-request");
const { ServerError, generateServerError } = require("./server-error.js");

module.exports = {
  CustomAPIError,
  UnauthenticatedError,
  generateUnauthenticatedError,
  NotFoundError,
  generateNotFoundError,
  BadRequestError,
  generateBadRequestError,
  ServerError,
  generateServerError,
};
