import { NextFunction, Response } from "express";
import { ZodError, z } from "zod";

// generic middleware factory
export default async function validate<T extends z.ZodSchema>(
  schema: T,
  inputData: any,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = await schema.parseAsync(inputData);
    return parsed;
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        status: "validation-error",
        errors: error.issues.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      });
    }
    // unexpected error → forward to global handler
    next(error);
  }
}
