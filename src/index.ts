import express from "express";
import subjectRouter from "./routes/subject.route";
import cors from "cors";
const app = express();
const PORT = 8000;

app.use(express.json());
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

app.get("/", (req, res) => {
  res.json({ message: "Hello from the classroom backend!" });
});

app.use("/api/subjects", subjectRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
