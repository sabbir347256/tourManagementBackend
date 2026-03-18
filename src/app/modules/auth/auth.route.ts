import { Router } from "express";
import { AuthController } from "./auth.controller";


const router = Router();

router.post('/login',AuthController.credentialLogin)
router.post('/refreshToken',AuthController.getNewAccessToken)

export const AuthRouter = router;