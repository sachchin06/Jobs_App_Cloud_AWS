const jwt_decode = require("jwt-decode");
const { UnauthenticatedError } = require("../errors");
const User = require("../models/User");

const auth = async (req, res, next) => {
  //check header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authorization Invalid");
  }

  const token = authHeader.split(" ")[1];
  // console.log(token);
  try {
    let payload = jwt_decode(token);
    // console.log(payload.sub);
    // console.log(payload.email);
    //attach the user with job routes
    const user = await User.findOne({
      key: payload.sub,
    });

    // console.log(user);

    req.user = { email: user.username };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authorization Invalid");
  }
};

module.exports = auth;
