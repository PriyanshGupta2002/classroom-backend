import { Request, Response } from "express";
import { db } from "../db";
import { departments } from "../db/schema";

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const departmentsList = await db.select().from(departments);
    return res.status(200).json({
      message: "Departments fetched successfully",
      data: departmentsList,
    });
  } catch (error) {
    console.log(`GET /departments error:${error}`);
    res.status(500).json({ error: "Failed to get departments" });
  }
};
