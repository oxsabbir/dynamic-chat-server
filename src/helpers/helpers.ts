import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/extra";

export const generateJwtToken = function (userId: string) {
  if (!jwtSecret) return;
  const token = jwt.sign({ userId }, jwtSecret);
  return token;
};
