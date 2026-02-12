import { Request, Response } from "express";
import { db } from "../db";
import { classes, subjects } from "../db/schema";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";

export const addClasses = async (req: Request, res: Response) => {
  try {
    const {
      name,
      teacherId,
      subjectId,
      capacity,
      description,
      status,
      bannerUrl,
      bannerCldPubId,
    } = req.body;

    const doesSubjectIdExists = await db
      .select()
      .from(subjects)
      .where(eq(subjectId, subjects.id));

    if (!doesSubjectIdExists) {
      return res.status(400).json({ message: "Invalid Subject Id" });
    }

    const [createdClass] = await db
      .insert(classes)
      .values({
        name,
        teacherId,
        subjectId,
        capacity,
        bannerUrl,
        bannerCldPubId,
        description,
        status,
        inviteCode: nanoid(8),
        schedules: [],
      })
      .returning({
        id: classes.id,
      });

    if (!createdClass) {
      throw new Error("Cannot create class right now");
    }
    return res.status(201).json({ data: createdClass });
  } catch (error) {
    console.error(`POST /classes error ${error}`);
    res.status(500).json({ error });
  }
};
