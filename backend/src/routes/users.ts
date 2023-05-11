import express from "express";
import * as UserController from "../controllers/users";
import { requiresAuth, requiresAdmin } from "../middleware/auth";

const router = express.Router();

router.get("/", requiresAuth, UserController.getAuthenticatedUser);

router.post("/signup", UserController.signUp);

router.post("/login", UserController.login);

router.post("/logout", UserController.logout);

router.get("/doctors", UserController.getDoctors);


router.get("/users", requiresAdmin, UserController.getAllUsers);

router.get("/:userId", requiresAdmin, UserController.getUser);

router.post("/", UserController.createUser);

router.patch("/:userId", UserController.updateUser);

router.delete("/:userId", UserController.deleteUser);

export default router;