import { Router } from "express";

import checkAuth from "../middleware/check-auth";

import {
  Users_get_all,
  Users_get_user,
  Users_user_signup,
  Users_user_login,
  Users_reset_password,
  Users_delete_user,
} from "../controllers/user";

const router = Router();

//Making get request to /user
router.get("/", Users_get_all);

//Making get request to /user/(id that user provides) and Searching by ID
router.get("/:userId", Users_get_user);

//Making post request to /user/signup  REGISTRATION
router.post("/signup", Users_user_signup);

//Making post request to /user/login AUTHENTICATION(LOG IN)
router.post("/login", Users_user_login);

//Making post request to /user/reset-password RESET PASSWORD
router.post("/reset-password", Users_reset_password);

//Making delete request to /user/(id that user provided)
router.delete("/:userId", checkAuth, Users_delete_user);

export default router;
