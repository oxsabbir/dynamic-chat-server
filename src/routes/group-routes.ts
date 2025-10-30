import { Router } from "express";
import {
  createGroup,
  getAllGroups,
  getGroup,
} from "../controller/group-controller";

const groupRouter = Router();

groupRouter.get("/", getAllGroups);
groupRouter.get("/:id", getGroup);
groupRouter.post("/", createGroup);

export default groupRouter;
