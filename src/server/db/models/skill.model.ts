import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  name: { type: String },
  rating: { type: Number },
});

export const Skill =
  mongoose.models.Skill ?? mongoose.model("Skill", skillSchema);
