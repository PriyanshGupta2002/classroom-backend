import type { Request, Response } from "express";
import { db } from "../db";
import { classes, enrollments, user } from "../db/schema";
import { and, eq } from "drizzle-orm";
export const enrollStudent = async (req: Request, res: Response) => {
  try {
    const userRole = req?.user;
    console.log(userRole);
    if (userRole?.role !== "student") {
      return res
        .status(400)
        .json({ message: "Only students have access to join a class" });
    }
    const { classId, studentId, inviteCode } = req.body;

    const isValidClass = await db
      .select()
      .from(classes)
      .where(and(eq(classes.id, classId), eq(classes.inviteCode, inviteCode)));

    if (!isValidClass) {
      return res
        .status(400)
        .json({ message: "Invalid Invite Code or Class", success: false });
    }

    const [student] = await db
      .select()
      .from(user)
      .where(eq(user.id, studentId));

    if (!student) {
      return res
        .status(404)
        .json({ message: "No student found with this id", success: false });
    }

    if (student?.id !== req.user?.id) {
      return res.status(403).json({
        message: "You can only enroll yourself to the class not somebody else",
        success: false,
      });
    }

    await db.insert(enrollments).values({
      classId,
      studentId,
    });

    return res.status(200).json({
      message: "You have successfully enrolled to the class",
      success: true,
    });
  } catch (error) {
    console.log("Error while enrolling to a class", error);
    return res.status(500).json({ message: error, success: false });
  }
};
