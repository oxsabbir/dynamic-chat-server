import { Router } from "express";
import {
  addMember,
  createGroup,
  getAllGroups,
  getGroup,
  removeGroup,
} from "../controller/group-controller";

const groupRouter = Router();

groupRouter.get("/", getAllGroups);
groupRouter.get("/:id", getGroup);
groupRouter.post("/", createGroup);
groupRouter.post("/add-member/:id", addMember);
groupRouter.delete("/:id", removeGroup);

export default groupRouter;
