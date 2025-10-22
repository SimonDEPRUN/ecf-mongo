import { Router } from "express";
import Avion from "../models/Avion.js";
const router = Router();

router.post("/", async (req, res) => {
    try {
        const avion = new Avion(req.body);
        const savedAvion = await avion.save();
        res.status(201).json(savedAvion);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})
router.get("/", async (req, res) => {
    const avions = await Avion.find();
    res.json(avions);
})
router.get("/:id", async (req, res) => {
    try {
        const avion = await Avion.findById(req.params.id);
        if (!avion) return res.status(404).json({ error: "Avion non trouvé" });
        res.json(avion)
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})
router.put("/:id", async (req, res) => {
    try {
        const avion = await Avion.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!avion) return res.status(404).json({ error: "Avion non trouvé" });
        res.json(avion)
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})
router.delete("/:id", async (req, res) => {
    try {

        const avion = await Avion.findByIdAndDelete(req.params.id);
        if (!avion) return res.status(404).json({ error: "Avion non trouvé" });
        res.json({ message: "avion Annulé" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

export default router;