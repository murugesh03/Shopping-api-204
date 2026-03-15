const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  // Authentication logic here

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Unauthorized");
  }
  console.log("Received token:", authHeader);
  const token = authHeader.split(" ")[1];
  console.log("Extracted token:", authHeader.split(" "));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send("Invalid token");
  }
}
module.exports = authMiddleware;
