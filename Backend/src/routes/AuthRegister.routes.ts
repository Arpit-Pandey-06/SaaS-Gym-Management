import AuthRegister from "../controller/authRegister.controller.ts";
import { Router } from "express";
import {validateRequest} from "../validator/authValidator.validator.ts"
import {validate} from "../middleware/validation.middleware.ts"

const route = Router()

route.post("/register",validateRequest(),validate,AuthRegister.RegisterOwner)

export default route 