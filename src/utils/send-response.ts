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

export const errorMessage = function (
  statusCode: number = 500,
  messsage: string
) {
  return {
    statusCode,
    messsage,
  };
};
