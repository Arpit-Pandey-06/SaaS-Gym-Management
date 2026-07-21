import { body } from "express-validator";

const branchValidator = ()=>{
    return [
        body("branch_name")
            .trim()
            .notEmpty()
            .withMessage("Branch name is need to filled"),
        body("business_email")
            .trim()
            .notEmpty()
            .withMessage("email need to be filled")
            .isEmail()
            .withMessage("Mail is need be valid"),
        body("business_phone")
            .trim()
            .notEmpty()
            .withMessage("Message need to be filled")
            .isLength({max:10,min:10})
            .withMessage("phone number should be valid"),
        body("address")
            .trim()
            .notEmpty(),
        body("city")
            .trim()
            .notEmpty()
            .withMessage("City field should be filled"),
        body("state")
            .trim()
            .notEmpty()
            .withMessage("state field should be filled"),
        body("state")
            .trim()
            .notEmpty()
            .withMessage("state field should be filled"),
        body("country")
            .trim()
            .notEmpty()
            .withMessage("country field should be filled"),
        body("postal_code")
            .trim()
            .notEmpty()
            .withMessage("postal_code field should be filled"),
        body("opening_time")
            .trim()
            .notEmpty()
            .withMessage("opening time field should be filled"),
         body("closing_time")
            .trim()
            .notEmpty()
            .withMessage("closing time field should be filled"),
        body("capacity")
            .optional()
            .isNumeric()
        

]}
export {branchValidator}