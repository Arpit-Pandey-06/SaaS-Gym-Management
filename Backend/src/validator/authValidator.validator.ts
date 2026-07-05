import { body } from "express-validator";
import { ApiError } from "../utils/ApiError.utils.ts";

 const validateRequest = ()=>{
    return [
    body("full_name")
        .trim()
        .notEmpty()
        .withMessage("Full name is required")
        .isLength({min:5,max:56})
        .withMessage("Name should be minimum length 5 and maximum 56"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Emails is required")
        .isEmail()
        .withMessage("Email is not email format"),

    body("role")
        .trim()
        .notEmpty()
        .withMessage("Role is required"),
    
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({min:5,max:20})
        .withMessage("password should be minimum length 5 and maximum 20"),
    
    body("gym_name")
        .trim()
        .notEmpty()
        .withMessage("Gym name is required"),
    
    body("business_email")
        .trim()
        .notEmpty()
        .withMessage("Emails is required")
        .isEmail()
        .withMessage("Email is not email format"),
    
    ]
 } 



export {
    validateRequest
}