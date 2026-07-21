import Branch_Controller from "../controller/branch.controller.ts";
import {Router} from 'express'
import {branchValidator} from '../validator/branch.validator.ts'
import {validate} from '../middleware/validation.middleware.ts'
import {accesstokenVerify} from '../middleware/tokenVerifaction.middleware.ts'
import {authorize} from "../middleware/authorize.middleware.ts"

const route = Router()


route.post("/register",branchValidator(),validate,accesstokenVerify,authorize("Owner"),Branch_Controller.register_branch)
route.get("/allbranch",accesstokenVerify,authorize("Owner","Manager"),Branch_Controller.all_branch)
route.get("/branch/:branch_code",accesstokenVerify,authorize("Owner"),Branch_Controller.get_branch)


export default route