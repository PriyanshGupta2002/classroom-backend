import { Router } from "express";
import { getAllSubjects } from "../controllers/subject.controller";
const router = Router();

router.route("/").get(getAllSubjects);

export default router;
