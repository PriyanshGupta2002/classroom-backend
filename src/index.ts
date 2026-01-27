import express from "express";
import { db } from "./db";
// import { demoUsers } from "./db/schema";
import { eq } from "drizzle-orm";

const app = express();
const PORT = 8000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello from the classroom backend!" });
});

// CRUD routes for demo_users

// // CREATE: POST /users
// app.post("/users", async (req, res) => {
//   try {
//     const { name, email } = req.body;
//     if (!name || !email) {
//       return res.status(400).json({ error: "Name and email are required" });
//     }
//     const [newUser] = await db
//       .insert(demoUsers)
//       .values({ name, email })
//       .returning();
//     res.status(201).json(newUser);
//   } catch (error) {
//     console.error("Error creating user:", error);
//     res.status(500).json({ error: "Failed to create user" });
//   }
// });

// // READ: GET /users
// app.get("/users", async (req, res) => {
//   try {
//     const users = await db.select().from(demoUsers);
//     res.json(users);
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ error: "Failed to fetch users" });
//   }
// });

// // READ: GET /users/:id
// app.get("/users/:id", async (req, res) => {
//   try {
//     const id = parseInt(req.params.id);
//     if (isNaN(id)) {
//       return res.status(400).json({ error: "Invalid user ID" });
//     }
//     const user = await db.select().from(demoUsers).where(eq(demoUsers.id, id));
//     if (user.length === 0) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     res.json(user[0]);
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     res.status(500).json({ error: "Failed to fetch user" });
//   }
// });

// // UPDATE: PUT /users/:id
// app.put("/users/:id", async (req, res) => {
//   try {
//     const id = parseInt(req.params.id);
//     if (isNaN(id)) {
//       return res.status(400).json({ error: "Invalid user ID" });
//     }
//     const { name, email } = req.body;
//     if (!name || !email) {
//       return res.status(400).json({ error: "Name and email are required" });
//     }
//     const [updatedUser] = await db
//       .update(demoUsers)
//       .set({ name, email })
//       .where(eq(demoUsers.id, id))
//       .returning();
//     if (!updatedUser) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     res.json(updatedUser);
//   } catch (error) {
//     console.error("Error updating user:", error);
//     res.status(500).json({ error: "Failed to update user" });
//   }
// });

// // DELETE: DELETE /users/:id
// app.delete("/users/:id", async (req, res) => {
//   try {
//     const id = parseInt(req.params.id);
//     if (isNaN(id)) {
//       return res.status(400).json({ error: "Invalid user ID" });
//     }
//     await db.delete(demoUsers).where(eq(demoUsers.id, id));
//     res.status(204).send();
//   } catch (error) {
//     console.error("Error deleting user:", error);
//     res.status(500).json({ error: "Failed to delete user" });
//   }
// });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
