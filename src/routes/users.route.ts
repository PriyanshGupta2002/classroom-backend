import { Router } from "express";
import { getAllUsers } from "../controllers/user.controller";
import { requireAuth } from "../middleware/requireAuth";
const router = Router();

router.use(requireAuth);

router.route("/").get(getAllUsers);

export default router;
