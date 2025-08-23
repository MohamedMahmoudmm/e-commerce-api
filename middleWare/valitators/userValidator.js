import { body } from "express-validator";

export const signUpValidator = [
  body("name").isLength({ min: 3, max: 20 }).withMessage("Name must be 3-20 characters"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  body("age").isInt({ min: 5, max: 60 }).withMessage("Age must be between 5 and 60")
];

export const updateValidator = [
  body("name").optional().isLength({ min: 3, max: 20 }).withMessage("Name must be 3-20 characters"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  body("age").optional().isInt({ min: 5, max: 60 }).withMessage("Age must be between 5 and 60")
];
