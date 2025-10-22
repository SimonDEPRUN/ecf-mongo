import { Router } from "express";
import Passager from "../models/Passager.js";
const router = Router();

router.post("/", async (req, res) => {
    try {
        const passager = new Passager(req.body);
        const savedpassager = await passager.save();
        res.status(201).json(savedpassager);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})
router.get("/", async (req, res) => {
    const passagers = await Passager.find();
    res.json(passagers);
})

router.get("/:id", async (req, res) => {
    try {
        const passager = await Passager.findById(req.params.id);
        if (!passager) return res.status(404).json({ error: "Passager non trouvé" });
        res.json(passager)
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})
router.put("/:id", async (req, res) => {
    try {
        const passager = await Passager.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!passager) return res.status(404).json({ error: "Passager non trouvé" });
        res.json(passager)
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})
router.delete("/:id", async (req, res) => {
    try {

        const passager = await Passager.findByIdAndDelete(req.params.id);
        if (!passager) return res.status(404).json({ error: "Passager non trouvé" });
        res.json({ message: "Passager Annulé" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

export default router;