// import userModel from "../models/userModel.js";

export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({status:"fail", message: "Admin access only" });
  }
};
