import jwt from "jsonwebtoken";
import Users from "../models/users.model.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const user = await Users.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Auth middleware error:", error.message);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export { protectRoute };
