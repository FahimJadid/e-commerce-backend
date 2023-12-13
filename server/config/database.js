const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {});
    console.log(`Database Connected Successfully...`);
  } catch (error) {
    console.error("Failed!!! Error connecting  to the Database", error.message);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
