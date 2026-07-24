import Branch_Controller from "../controller/branch.controller.ts";
import {Router} from 'express'
import {branchValidator} from '../validator/branch.validator.ts'
import {validate} from '../middleware/validation.middleware.ts'
import {accesstokenVerify} from '../middleware/tokenVerifaction.middleware.ts'
import {authorize} from "../middleware/authorize.middleware.ts"
import {update_branchValidator} from "../validator/branch_update.validator.ts"

const route = Router()


route.post("/register",branchValidator(),validate,accesstokenVerify,authorize("Owner"),Branch_Controller.register_branch)
route.get("/allbranch",accesstokenVerify,authorize("Owner","Manager"),Branch_Controller.all_branch)
route.get("/:branch_code",accesstokenVerify,authorize("Owner"),Branch_Controller.get_branch)
route.patch("/update/:branch_code",update_branchValidator(),validate,accesstokenVerify,authorize("Owner"),Branch_Controller.update_branch)
route.patch("/delete/:branch_code",accesstokenVerify,authorize("Owner"),Branch_Controller.delet_branch)

export default route