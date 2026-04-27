const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers["api-token"];
    const userAgent = req.headers["user-agent"];
    const message = "Nice try buddy😄";
    if (!token || !userAgent) return res.status(401).json({ message });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.fingerprint !== req.headers["user-agent"]) {
      return res.status(401).json({ message });
    }
    req.user = decoded;
    next();
  } catch ({ message }) {
    res.status(500).json({ message, status: 0 });
  }
};

module.exports = authMiddleware;
