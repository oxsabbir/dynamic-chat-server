import { Router } from "express";
import {
  createGroup,
  getAllGroups,
  getGroup,
} from "../controller/group-controller";

const groupRouter = Router();

groupRouter.get("/get-all-groups", getAllGroups);
groupRouter.get("/get-group/:id", getGroup);
groupRouter.post("/create", createGroup);

export default groupRouter;
