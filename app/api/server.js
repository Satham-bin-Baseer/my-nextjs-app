const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("mongo-sanitize");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const globalRouter = require("./router/router");
require("./config/db");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(helmet()); // Automatically sets secure HTTP response headers

// NoSQL injection protection
app.use((req, res, next) => {
  req.body = mongoSanitize(req.body);
  req.params = mongoSanitize(req.params);
  req.query = mongoSanitize(req.query);
  next();
});

app.use(
  cors({
    origin: process.env.FE_DOMAIN,
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);
app.use(authMiddleware);
app.use(globalRouter);

app.listen(5000, () => console.log("Server running on port 5000"));
