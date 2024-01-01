const User = require("../models/UserModel");

const createUser = async (req, res) => {
  try {
    const email = req.body.email;
    const findUser = await User.findOne({ email });

    if (!findUser) {
      const newUser = await User.create(req.body);
      res.json(newUser);
    } else {
      res.json({
        message: "User already exists",
        success: false,
      });
    }
  } catch (error) {
    console.error("Error creating user: ", error.message);
    res.json({
      message: "Error creating user",
      success: false,
    });
  }
};

module.exports = { createUser };
