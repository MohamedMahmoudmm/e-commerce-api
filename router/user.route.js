import express  from "express";
import { checkEmail } from "../middleWare/checkEmail.js";
import { login, signUp, verifyAccount ,logout, updateUser, forgotPassword, resetPassword, getUserProfile } from "../controllers/userController.js";
import { auth } from "../middleWare/auth.js";
import { signUpValidator, updateValidator } from "../middleWare/valitators/userValidator.js";
import { handleValidationErrors } from "../middleWare/handleValidationErrors.js";


const userRouter = express.Router();

userRouter.post("/signup",signUpValidator,handleValidationErrors, checkEmail, signUp);
userRouter.post("/login", login);
userRouter.post("/logout", auth, logout)
userRouter.put("/update",updateValidator,handleValidationErrors, auth, updateUser);
userRouter.get("/verify/:token", verifyAccount);
userRouter.get("/profile", auth, getUserProfile); 
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);

export default userRouter;
