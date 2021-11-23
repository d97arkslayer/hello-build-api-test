import {login, signup} from "../controllers/user_controller";
import * as express from "express";

const router = express.Router();

router.post('/', signup)
router.post('/login', login);

export default router;
