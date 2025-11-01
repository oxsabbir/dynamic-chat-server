import jwt from "jsonwebtoken";
import {
  JWT_SECRET_ACCESS,
  JWT_SECRET_REFRESH,
  JWT_ACCESS_EXPIRES,
  JWT_REFRESH_EXPIRES,
} from "../config/extra";

interface DecodeType extends jwt.JwtPayload {
  userId: string;
  fullName: string;
  email: string;
  iat: number;
  exp: number;
}

export const generateJwtToken = function (
  payload: object,
  tokenType: "refresh" | "access" = "access"
) {
  const JWT_EXPIRES =
    tokenType === "access" ? JWT_ACCESS_EXPIRES : JWT_REFRESH_EXPIRES;

  const JWT_SECRET =
    tokenType === "access" ? JWT_SECRET_ACCESS : JWT_REFRESH_EXPIRES;

  if (!JWT_SECRET || !JWT_EXPIRES) return;
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES as any,
  });

  return token;
};

export const verifyJwtSignature = function (
  token: string,
  tokenType: "access" | "refresh" = "access"
) {
  const JWT_SECRET =
    tokenType === "access" ? JWT_SECRET_ACCESS : JWT_REFRESH_EXPIRES;

  if (!JWT_SECRET) return;
  return jwt.verify(token, JWT_SECRET) as DecodeType;
};
