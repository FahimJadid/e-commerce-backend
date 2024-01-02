const jwt = require("jsonwebtoken");

const generateToken = (id) => {
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
  const token = jwt.sign(payload, secretKey, options);
  return token;
};

module.exports = generateToken;
