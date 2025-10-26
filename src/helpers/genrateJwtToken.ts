import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/extra";
const generateJwtToken = function (payload: object) {
  if (!jwtSecret) return;
  const token = jwt.sign(payload, jwtSecret);
  return token;
};

export default generateJwtToken;
