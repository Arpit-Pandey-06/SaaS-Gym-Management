import AuthRegister from "../controller/authRegister.controller.ts";
import { Router } from "express";
import {validateRequest} from "../validator/authValidator.validator.ts"
import {validate} from "../middleware/validation.middleware.ts"
import {accesstokenVerify} from "../middleware/tokenVerifaction.middleware.ts"
import { authorize } from "../middleware/authorize.middleware.ts";

const route = Router()

route.post("/register",validateRequest(),validate,AuthRegister.RegisterOwner)
route.post("/login",AuthRegister.loginUser)
route.get("/me",accesstokenVerify,AuthRegister.getCurrentUser)
route.post("/refresh",AuthRegister.RefreshToken)
route.post("/logout",AuthRegister.Logout)

export default route  