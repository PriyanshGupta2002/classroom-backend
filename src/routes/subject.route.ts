import { Router } from "express";
import { getAllSubjects } from "../controllers/subject.controller";
import { requireAuth } from "../middleware/requireAuth";
const router = Router();

router.use(requireAuth);
router.route("/").get(getAllSubjects);

export default router;
