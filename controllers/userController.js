import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt" 
import sendEmail from "../email/email.js";


export const signUp =  async(req,res)=>{
    req.body.password = await bcrypt.hash(req.body.password,8);    
    let addUser = await userModel.insertMany(req.body);
    addUser[0].password = undefined;
    sendEmail(req.body.email)
    res.status(201).json({message:"User sign up successfully",user:addUser})
}

export const login = async(req,res)=>{
    let findUser = await userModel.findOne({email : req.body.email})
    if(!findUser || !bcrypt.compareSync(req.body.password, findUser.password)){
        return res.status(422).json({message:"Invalid email or password"})
    }
    if(findUser.isConfirmed === false){
        return res.status(403).json({message:"Account not verified"})
    }
          if (findUser.token) {
    return res.status(400).json({ message: "User already logged in " });
  }
    let token = jwt.sign(
        {_id : findUser._id, role: findUser.role, email: findUser.email}, "mearn"
    )
    await userModel.findByIdAndUpdate(findUser._id, { token });
    return res.json({message:"User login successfully", user:findUser, token:token})
}

export const logout = async (req, res) => {
  let token = req.headers.token;
  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }
  let user = await userModel.findOne({ token });
  if (!user) {
    return res.status(401).json({ message: "Invalid token" });
  }
  await userModel.findByIdAndUpdate(user._id, { token: null });
  return res.status(200).json({ message: "User logged out successfully" });
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body;
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 8);
    }
    const updatedUser = await userModel.findByIdAndUpdate(userId,updates,{ new: true }).select("-password -token");
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

export const verifyAccount = async(req,res)=>{
    jwt.verify(req.params.email,"myEmail",async(err,decoded)=>{
        if(err) {
            return res.status(401).json({message:"Invalid token"});
        }
        await userModel.findOneAndUpdate({email:decoded},{isConfirmed:true})  
        res.status(200).json({message:"Account verified successfully"})
    })
}


