import * as dotenv from "dotenv";
dotenv.config();

import serverApp from "./app";
import mongoose from "mongoose";
import { databaseConfig } from "./config/db-cofig";

// connecting to database
mongoose
  .connect(
    databaseConfig.DATABASE_URL.replace(
      "<PASSWORD>",
      databaseConfig.DATABASE_PASSWORD
    )
  )
  .then(() => console.log("DATABASE CONNECTED SUCCESSFULLY"));

serverApp.listen(4000, () => {
  console.log("Server listening at port 4000");
});

process.on("unhandledRejection", (err: Error) => {
  console.log(err.message, err.name);
  serverApp.close(() => {
    process.exit(1);
  });
});
