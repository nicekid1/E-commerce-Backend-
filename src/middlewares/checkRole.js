const checkRole = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: User not authenticated" });
  }
  if (req.user.role === "admin") next();
  else res.status(403).json({ message: "Unauthorized access: Admin only" });
};

module.exports = checkRole;
