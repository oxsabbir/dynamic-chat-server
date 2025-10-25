export const databaseConfig: {
  DATABASE_URL: string;
  DATABASE_PASSWORD: string;
} = {
  DATABASE_URL: process.env.DATABASE_URL || "",
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || "",
};
