const { BadRequestError } = require("../errors");
//---------------------------------------------------

const checkTestUser = (req, res, next) => {
  if (req.user.isTestUser) {
    throw new BadRequestError("Test User detected. Read Only Approved");
  }
  next();
};

module.exports = checkTestUser;
