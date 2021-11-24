import {login, signup, getFavorites, addFavorite, deleteFavorite} from "../controllers/user_controller";
import * as express from "express";
import {auth} from "../middlewares/auth-user";

const router = express.Router();

// Route for signup
router.post("/", signup)
// Route for login
router.post("/login", login);
// Route for get favorites by user
router.get("/favorites", auth, getFavorites);
// Route for add new favorite by user
router.post("/favorites", auth, addFavorite);
// Route for delete a favorite by user
router.delete("/favorites", auth, deleteFavorite);

export default router;
