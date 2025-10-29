import { Response } from "express";
export default function sendResponse(
  res: Response,
  statusCode: number,
  message: string,
  data: object
) {
  res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
}
