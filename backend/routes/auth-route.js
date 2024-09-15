import express from 'express';
import { sayHello } from "../controllers/auth-controller.js"; 

const router = express.Router();

router.get('/', sayHello);

export default router; 
