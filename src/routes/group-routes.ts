import { Router } from "express";
import {
  createGroup,
  getAllGroups,
  getGroup,
  removeGroup,
} from "../controller/group-controller";

const groupRouter = Router();

groupRouter.get("/", getAllGroups);
groupRouter.get("/:id", getGroup);
groupRouter.post("/", createGroup);
groupRouter.delete("/:id", removeGroup);

export default groupRouter;
