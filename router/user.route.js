import express  from "express";
import { checkEmail } from "../middleWare/checkEmail.js";
import { login, signUp, verifyAccount ,logout, updateUser } from "../controllers/userController.js";
import { auth } from "../middleWare/auth.js";


const userRouter = express.Router();

userRouter.post("/signup", checkEmail, signUp);
userRouter.post("/login", login);
userRouter.post("/logout", auth, logout)
userRouter.put("/update", auth, updateUser);
userRouter.get("/verify/:email", verifyAccount);

export default userRouter;
