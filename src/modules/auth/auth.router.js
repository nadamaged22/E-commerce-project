import { Router } from "express";
import * as pc from '../auth/controller/registration.js'
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as validators from '../auth/auth.validation.js'
const router = Router()


router.post('/signup',validation(validators.signup),pc.SignUP)
router.patch('/confirmemail',validation(validators.confirmEmail),pc.confirmEmail)
router.post('/signin',validation(validators.signIn),pc.signIn)
router.patch('/sendCode',validation(validators.sendCode),pc.sendCode)
router.patch('/resetpass',validation(validators.ResetPassword),pc.ResetPassword)
export default router