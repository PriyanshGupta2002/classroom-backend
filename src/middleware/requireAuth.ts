import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    console.log(session);

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // attach user/session to request
    req.user = session.user;
    req.session = session.session;

    console.log("req.user", req.user);

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid session",
    });
  }
};
