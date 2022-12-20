const User = require("../models/UserModel");
const { StatusCodes } = require("http-status-codes");
const {
  generateBadRequestError,
  generateUnauthenticatedError,
  generateNotFoundError,
} = require("../errors");
//-------------------------------------------------------------------------------

const register = async (req, res) => {
  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
      token: user.createJWT(),
    },
  });
};

//-------------------------------------------------------------------------------
const login = async (req, res) => {
  // check data
  if (!req.body.email || !req.body.password) {
    return next(generateBadRequestError("Email and Password are required !"));
  }
  // check user exists !
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(generateUnauthenticatedError("User unknown!"));
  }
  // check password !
  const validPassword = await user.comparePassword(req.body.password);
  if (!validPassword) {
    return next(generateUnauthenticatedError("User unknown!"));
  }
  //All OK : send token
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
      token: user.createJWT(),
    },
  });
};

// -----------------------------------------------------------
const updateUser = async (req, res) => {
  if (
    !req.body.email ||
    !req.body.name ||
    !req.body.lastName ||
    !req.body.location
  ) {
    return next(
      generateBadRequestError(
        "Email, Name, LastName and Location are all required !",
      ),
    );
  }

  const user = await User.findByIdAndUpdate(req.user.userId, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(generateNotFoundError(`No User found ${req.user.name} `));
  }

  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
      token: user.createJWT(),
    },
  });
};

module.exports = {
  register,
  login,
  updateUser,
};
