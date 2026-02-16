import { Request, Response } from "express";
import { db } from "../db";
import { classes, departments, subjects, user } from "../db/schema";
import { nanoid } from "nanoid";
import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import { string } from "better-auth/*";

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

export const getClassDetails = async (req: Request, res: Response) => {
  const classId = Number(req.params.id);
  if (!Number.isFinite(classId)) {
    return res.status(400).json({ message: "No class found", success: false });
  }
  try {
    const [classDetails] = await db
      .select({
        ...getTableColumns(classes),
        subject: {
          ...getTableColumns(subjects),
        },
        department: {
          ...getTableColumns(departments),
        },
        teacher: {
          ...getTableColumns(user),
        },
      })
      .from(classes)
      .leftJoin(subjects, eq(subjects.id, classes.subjectId))
      .leftJoin(user, eq(user.id, classes.teacherId))
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .where(eq(classes.id, classId));

    if (!classDetails) {
      return res.status(404).json({ message: "No Class found" });
    }

    return res.status(200).json({ data: classDetails });
  } catch (error) {
    console.log("Erorr while creating class", error);
    return res.status(500).json({ message: error });
  }
};

export const getClasses = async (req: Request, res: Response) => {
  try {
    const { search, subject, teacher, page = 1, limit = 10 } = req.query;
    const currentPage = Math.max(1, parseInt(String(page), 10)) || 1;
    const limitPerPage = Math.min(
      Math.max(1, parseInt(String(limit), 10) || 10),
      100,
    ); // Max 100 records per page
    const offset = (currentPage - 1) * limitPerPage;
    let filterConditions = [];

    if (search) {
      filterConditions.push(
        or(
          ilike(classes.name, `%${search}%`),
          ilike(classes.inviteCode, `%${search}%`),
        ),
      );
    }

    if (subject) {
      const subjectPattern = `%${String(subject).replace(/[%_]/g, "\\$&")}%`;
      filterConditions.push(ilike(subjects.name, subjectPattern));
    }

    if (teacher) {
      const teacherPattern = `%${String(teacher).replace(/[%_]/g, "\\$&")}%`;
      filterConditions.push(ilike(user.name, teacherPattern));
    }

    const whereClause =
      filterConditions.length > 0 ? and(...filterConditions) : undefined;
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(classes)
      .leftJoin(subjects, eq(classes.subjectId, subjects.id))
      .leftJoin(user, eq(classes.teacherId, user.id))
      .where(whereClause);

    const totalCount = countResult[0]?.count ?? 0;

    const classesList = await db
      .select({
        ...getTableColumns(classes),
        subject: { ...getTableColumns(subjects) },
        teacher: { ...getTableColumns(user) },
      })
      .from(classes)
      .leftJoin(subjects, eq(classes.subjectId, subjects.id))
      .leftJoin(user, eq(classes.teacherId, user.id))
      .where(whereClause)
      .orderBy(desc(classes.createdAt))
      .limit(limitPerPage)
      .offset(offset);

    res.status(200).json({
      data: classesList,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage),
      },
    });
  } catch (e) {
    console.error(`GET /classes error: ${e}`);
    res.status(500).json({ error: "Failed to get classes" });
  }
};

export const enrollToClass = async (req: Request, res: Response) => {};
