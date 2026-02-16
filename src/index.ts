import AgentAPI from "apminsight";

AgentAPI.config();

import express from "express";
import subjectRouter from "./routes/subject.route.js";
import classesRouter from "./routes/classes.route.js";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import departmentRouter from "./routes/department.route.js";
import usersRouter from "./routes/users.route.js";
import enrollmentsRouter from "./routes/enrollment.route.js";
import { securityMiddleware } from "./middleware/arcjetMiddleware.js";
import { auth } from "./lib/auth.js";
// import cookieParser from "cookie-parser";

const app = express();
const PORT = 8000;

if (!process.env.FRONTEND_URL) {
  throw new Error("FRONTEND_URL is not set in .env file");
}
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());
// app.use(cookieParser());

// app.use(securityMiddleware);

app.get("/", (req, res) => {
  res.json({ message: "Hello from the classroom backend!" });
});

app.use("/api/subjects", subjectRouter);
app.use("/api/departments", departmentRouter);
app.use("/api/users", usersRouter);
app.use("/api/classes", classesRouter);
app.use("/api/enrollments", enrollmentsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
