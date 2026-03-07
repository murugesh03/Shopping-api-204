function authMiddleware(req, res, next) {
  // Authentication logic here

  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  next();
}
module.exports = authMiddleware;
