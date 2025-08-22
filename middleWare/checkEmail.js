import userModel from "../models/userModel.js";

export const checkEmail = async (req, res, next) => {
    let findUser =await userModel.findOne({email : req.body.email})
    if(findUser)  return res.status(409).json({message:"User already exist"})
    next();
};