import Router from "express";
import { enrollStudent } from "../controllers/enrollments.controller";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.use(requireAuth);

router.route("/").post(enrollStudent);

export default router;
