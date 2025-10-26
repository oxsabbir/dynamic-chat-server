import jwt from "jsonwebtoken";
import { JWT_EXPIRES, JWT_SECRET } from "../config/extra";

interface DecodeType extends jwt.JwtPayload {
  userId: string;
  fullName: string;
  email: string;
  iat: number;
  exp: number;
}

export const generateJwtToken = function (payload: object) {
  if (!JWT_SECRET || !JWT_EXPIRES) return;
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES as any,
  });
  return token;
};

export const verifyJwtSignature = function (token: string) {
  if (!JWT_SECRET) return;
  return jwt.verify(token, JWT_SECRET) as DecodeType;
};

export const checkTokenExpiry = function (expiryTime: number) {
  const time = new Date(expiryTime);
};
