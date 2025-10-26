import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/extra";
export const generateJwtToken = function (payload: object) {
  if (!jwtSecret) return;
  const token = jwt.sign(payload, jwtSecret);
  return token;
};

export const verifyJwtSignature = function (token: string, jwtSecret: string) {
  const decode = jwt.verify(token, jwtSecret);
  return decode;
};
