import { Router } from "express";
import Project from "../models/Project.js";
import requireAuth from "../middleware/requireAuth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try { res.json(await Project.find({ user: req.userId }).sort({ createdAt: -1 })); }
  catch (error) { next(error); }
});

router.post("/", async (req, res, next) => {
  try {
    const title = String(req.body.title || "").trim();
    if (!title) return res.status(400).json({ message: "Project title is required." });
    const technologies = Array.isArray(req.body.technologies)
      ? req.body.technologies.map(x => String(x).trim().slice(0, 40)).filter(Boolean).slice(0, 12)
      : [];
    const item = await Project.create({
      user: req.userId, title,
      description: String(req.body.description || "").slice(0, 700),
      technologies,
      link: String(req.body.link || "").slice(0, 300)
    });
    res.status(201).json(item);
  } catch (error) { next(error); }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await Project.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!deleted) return res.status(404).json({ message: "Project not found." });
    res.json({ message: "Project deleted." });
  } catch (error) { next(error); }
});

export default router;
