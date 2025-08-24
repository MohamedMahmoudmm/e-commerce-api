import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const auth = async (req, res, next) => {
  try {
    let token = req.headers.token;
    if (!token) return res.status(401).json({ message: "No token provided" });

    let decoded = jwt.verify(token, "mearn");

    let user = await userModel.findOne({ _id: decoded._id, token });
    if (!user) {
      return res.status(401).json({ message: "Token is invalid or logged out" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};