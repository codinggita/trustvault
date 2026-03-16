const { readStore } = require("../utils/store");

async function requireAuth(req, res, next) {
  const authorizationHeader = req.headers.authorization || "";
  const token = authorizationHeader.startsWith("Bearer ")
    ? authorizationHeader.slice("Bearer ".length).trim()
    : "";

  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  const store = await readStore();
  const session = store.sessions.find((entry) => entry.token === token);

  if (!session) {
    return res.status(401).json({ message: "Your session has expired. Please log in again." });
  }

  const user = store.users.find((entry) => entry.id === session.userId);

  if (!user) {
    return res.status(401).json({ message: "Unable to find your account." });
  }

  req.authToken = token;
  req.user = user;

  return next();
}

module.exports = {
  requireAuth,
};
