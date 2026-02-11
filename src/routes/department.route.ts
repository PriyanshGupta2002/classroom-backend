import Router from "express";
import { getDepartments } from "../controllers/department.controller";
import { arcjectVerify } from "../middleware/arcjetMiddleware";

const router = Router();

router.route("/").get(getDepartments);

export default router;
