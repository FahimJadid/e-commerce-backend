const express = require("express");
const app = express();

require("dotenv").config();
const connectToDatabase = require("./config/database");
const PORT = process.env.PORT || 4040;
const authRouter = require("./routes/authRoutes");

app.get("/", (req, res) => {
  res.send(`<h1>Hi! I am Backend!</h1>`);
});

app.use("/api/v1/user", authRouter);

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server listening on port: ${PORT}`);
    });
    await connectToDatabase();
  } catch (error) {
    console.error("Error starting the server: ", error.message);
    process.exit(1);
  }
};

startServer();
