import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, default: "", maxlength: 700 },
  technologies: [{ type: String, maxlength: 40 }],
  link: { type: String, default: "", maxlength: 300 }
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
