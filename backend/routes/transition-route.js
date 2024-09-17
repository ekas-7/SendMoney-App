import express from 'express';
import { getBalance, transferFunds } from '../controllers/transition-controller.js';
import transferFundsMiddleware from '../middlewares/transition-middleware.js';

const router = express.Router();


router.put("/", transferFundsMiddleware, transferFunds);
router.get("/getBalance", getBalance);

export default router;
