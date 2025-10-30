import { Router } from "express";
import {
  createGroup,
  getAllGroups,
  getGroup,
  removeGroup,
  manageMembers,
} from "../controller/group-controller";

const groupRouter = Router();

groupRouter.get("/", getAllGroups);
groupRouter.get("/:id", getGroup);
groupRouter.post("/", createGroup);
groupRouter.post("/add-member/:id", manageMembers("add"));
groupRouter.post("/remove-member/:id", manageMembers("remove"));
groupRouter.delete("/:id", removeGroup);

export default groupRouter;
