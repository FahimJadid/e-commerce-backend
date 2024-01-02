const jwt = require("jsonwebtoken");

const generateRefreshToken = (id) => {
  // payload(id) of the token
  const payload = {
    user: {
      id: id,
    },
  };

  // secret key
  const secretKey = process.env.JWT_SECRET;

  // options
  const options = {
    expiresIn: "3d",
  };

  // Sign the token
  const refreshToken = jwt.sign(payload, secretKey, options);
  return refreshToken;
};

module.exports = generateRefreshToken;
