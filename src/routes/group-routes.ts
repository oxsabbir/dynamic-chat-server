import { Router } from "express";
import {
  createGroup,
  getAllGroups,
  getGroup,
  removeGroup,
  manageMembers,
  updateGroup,
} from "../controller/group-controller";

const groupRouter = Router();

groupRouter.get("/", getAllGroups);
groupRouter.post("/", createGroup);
groupRouter.get("/:id", getGroup);
groupRouter.patch("/:id", updateGroup);
groupRouter.post("/add-member/:id", manageMembers("add"));
groupRouter.patch("/remove-member/:id", manageMembers("remove"));
groupRouter.delete("/:id", removeGroup);

export default groupRouter;
