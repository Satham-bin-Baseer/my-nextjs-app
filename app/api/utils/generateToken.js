const jwt = require("jsonwebtoken");

const generateToken = (userData, req) => {
  const fingerprint = req.headers["user-agent"]; // On login - include user-agent in token (Ex. user-agent:Mozilla/Chrome)
  const token = jwt.sign({ ...userData, fingerprint }, process.env.JWT_SECRET);
  return token;
};

module.exports = generateToken;
