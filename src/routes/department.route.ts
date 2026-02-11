import Router from "express";
import { getDepartments } from "../controllers/department.controller";
const router = Router();

router.route("/").get(getDepartments);

export default router;
