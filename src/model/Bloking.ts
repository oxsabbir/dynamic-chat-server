import mongoose, { Schema, model } from "mongoose";
import { Blocking } from "../types";

const blockingSchema = new Schema<Blocking>({
  blocker: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  blocked: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default model("Blocking", blockingSchema);
