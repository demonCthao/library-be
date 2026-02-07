import { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions/http.exception";

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  console.log("🚀 ~ errorMiddleware ~ err:", err)
  if (err instanceof HttpException) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
      errors: err.errors ?? null,
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}