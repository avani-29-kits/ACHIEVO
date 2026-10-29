import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  category: { type: String, default: "Milestone", maxlength: 60 },
  issuer: { type: String, default: "", maxlength: 120 },
  date: { type: String, default: "" },
  description: { type: String, default: "", maxlength: 600 }
}, { timestamps: true });

export default mongoose.model("Achievement", achievementSchema);
