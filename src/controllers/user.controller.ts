import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import { Request, Response } from "express";
import { user } from "../db/schema";
import { db } from "../db";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { search, role, page = 1, limit = 10 } = req.query;
    const currentPage = Math.max(1, parseInt(String(page), 10) || 1);
    const limitPerPage = Math.min(
      Math.max(1, parseInt(String(limit), 10) || 10),
      100,
    );
    const offset = (currentPage - 1) * limitPerPage;

    const filterConditions: any[] = [];

    if (search) {
      const condition = or(
        ilike(user.name, `%${search}%`),
        ilike(user.email, `%${search}%`),
      );
      filterConditions.push(condition);
    }

    if (role) {
      filterConditions.push(eq(user.role, role as any));
    }

    const whereClause =
      filterConditions.length > 0 ? and(...filterConditions) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(user)
      .where(whereClause);

    const totalCount = countResult[0]?.count ?? 0;

    const usersList = await db
      .select({
        ...getTableColumns(user),
      })
      .from(user)
      .where(whereClause)
      .orderBy(desc(user.createdAt))
      .limit(limitPerPage)
      .offset(offset);

    return res.status(200).json({
      data: usersList,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: +totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage),
      },
    });
  } catch (error) {
    console.log(`GET /users error:${error}`);
    res.status(500).json({ error: "Failed to get users" });
  }
};
