import { Router } from "express";
import Achievement from "../models/Achievement.js";
import requireAuth from "../middleware/requireAuth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try { res.json(await Achievement.find({ user: req.userId }).sort({ createdAt: -1 })); }
  catch (error) { next(error); }
});

router.post("/", async (req, res, next) => {
  try {
    const title = String(req.body.title || "").trim();
    if (!title) return res.status(400).json({ message: "Achievement title is required." });
    const item = await Achievement.create({
      user: req.userId, title,
      category: String(req.body.category || "Milestone").slice(0, 60),
      issuer: String(req.body.issuer || "").slice(0, 120),
      date: String(req.body.date || "").slice(0, 30),
      description: String(req.body.description || "").slice(0, 600)
    });
    res.status(201).json(item);
  } catch (error) { next(error); }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await Achievement.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!deleted) return res.status(404).json({ message: "Achievement not found." });
    res.json({ message: "Achievement deleted." });
  } catch (error) { next(error); }
});

export default router;
