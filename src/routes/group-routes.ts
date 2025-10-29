import { Router } from "express";
import { createGroup } from "../controller/group-controller";

const groupRouter = Router();

groupRouter.post("/create", createGroup);

export default groupRouter;
