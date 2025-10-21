import express from "express";

const app = express();

app.use(express.json());

app.get("/", () => {
  console.log("Server is running");
});

export default app;
