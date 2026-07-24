import { body } from "express-validator";

const update_branchValidator = ()=>{
    return [
        body("branch_name")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("Branch name is need to filled"),
        body("business_email")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("email need to be filled")
            .isEmail()
            .withMessage("Mail is need be valid"),
        body("business_phone")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("Message need to be filled")
            .isLength({max:10,min:10})
            .withMessage("phone number should be valid"),
        body("address")
            .optional()
            .trim()
            .notEmpty(),
        body("city")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("City field should be filled"),
        body("state")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("state field should be filled"),
        body("state")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("state field should be filled"),
        body("country")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("country field should be filled"),
        body("postal_code")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("postal_code field should be filled"),
        body("opening_time")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("opening time field should be filled"),
         body("closing_time")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("closing time field should be filled"),
        body("capacity")
            .optional()
            .isNumeric()
        

]}
export {update_branchValidator}