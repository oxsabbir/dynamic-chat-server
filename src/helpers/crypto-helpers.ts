import crypto from "crypto";

export const getHashedString = (value: string) =>
  crypto.createHash("sha256").update(value).digest("hex");

export const randomHasedString = () => crypto.randomBytes(32).toString("hex");
