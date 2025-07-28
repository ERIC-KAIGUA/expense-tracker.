import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import getDashboardData from "./dashboardController.js";


const router = Router()

router.get("/dashboard",authMiddleware,getDashboardData);

export default router