const mongoose = require("mongoose");
require("dotenv").config();

const DB_URL = process.env.MONGO_URL;

// mongoose.set("debug", true); // It prints what query runs on the server

mongoose
  .connect(DB_URL)
  .then(() => console.log("DB Connected Successfully!"))
  .catch((err) => console.log(err));
