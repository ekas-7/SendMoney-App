import express from 'express';
import authMiddleware from "../middlewares/auth-middleware.js";
import { updateUser ,searchUsers } from '../controllers/update-controller.js';

const router = express.Router();

router.put("/", authMiddleware, updateUser);
router.get("/allUsers",searchUsers);

export default router;
