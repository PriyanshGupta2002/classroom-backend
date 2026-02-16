import { Router } from "express";
import {
  addClasses,
  getClassDetails,
  getClasses,
} from "../controllers/classes.controller";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();
router.use(requireAuth);

router.route("/").post(addClasses);
router.route("/").get(getClasses);
router.route("/:id").get(getClassDetails);

export default router;
