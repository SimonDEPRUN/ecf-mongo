import { Router } from "express";
import Billet from "../models/Billet.js";
import Avion from "../models/Avion.js";
const router = Router();

router.post("/", async (req, res) => {
    try {
        const billet = new Billet(req.body);
        const avion = Avion.findById(req.body.avionId);
        if (!avion) return res.status().json({ error: "L'avion demandé n'existe pas" });
        if (avion.placeRestantes <= 0) return res.status().json({ error: "Ce vol est complet" });

        avion.placeRestantes -= 1;

        const savedBillet = await billet.save();
        res.status(201).json(savedBillet);

    } catch {
        res.status(400).json({ error: err.message });
    }
});
router.get("/", async (req, res) => {
    const billets = await Billet.find();
    res.json(billets)
});
router.get("/:id", async (req, res) => {
    try {
        const billet = await Billet.findById(req.params.id);
        if (!billet) return res.status(404).json({ error: "Billet non trouvé" });
        res.json(billet);
    } catch {
        res.status(400).json({ error: err.message });
    }
});
router.put("/:id", async (req, res) => {
    try {
        const billet = await Billet.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!billet) return res.status(404).json({ error: "Billet non trouvé" });
        res.json(billet)
    } catch {
        res.status(400).json({ error: err.message });
    }
});
router.delete("/:id", async (req, res) => {
    try {

        const billet = await Billet.findById(req.params.id);
        if (!billet) return res.status(404).json({ error: "Billet non trouvé" });
        const avion = await Avion.findById(billet.avionId);
        avion.placeRestantes += 1;
        await Billet.findByIdAndDelete(req.params.id);
        res.json({ message: "Voyage annulé" });
    } catch {
        res.status(400).json({ error: err.message });
    }
});

export default router;