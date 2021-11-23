import {login, signup} from "../controllers/user_controller";
import * as express from "express";

const router = express.Router();

// Route for signup
router.post('/', signup)
// Route for login
router.post('/login', login);

export default router;
