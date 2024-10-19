import { Router } from "express";
import indeed from "../controllers.js/indeed.controller.js";

const router = Router()

router.post("/indeed", indeed)


export default router