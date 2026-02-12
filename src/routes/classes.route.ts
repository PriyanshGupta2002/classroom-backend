import { Router } from "express";
import { addClasses } from "../controllers/classes.controller";

const router = Router();

router.route("/").post(addClasses);

export default router;
