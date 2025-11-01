import crypto from "crypto";

export const getHashedString = (value: string) =>
  crypto.createHash("sha256").update(value).digest("hex");
