import { Router } from "express";
import Vol from "../models/Vol.js";
import Billet from "../models/Billet.js";
import Avion from "../models/Avion.js";
const router = Router();

router.post("/", async (req, res) => {
    try {
        const { avionId } = req.body;
        const avion = await Avion.findById(avionId);

        const volData = {
            ...req.body,
            placeRestantes: avion.capacite
        }
        const vol = await Vol.create(volData);
        res.redirect("/api/vol")
    } catch (err) {
    }
});
router.put("/:id", async (req, res) => {
    try {
        const vol = await Vol.findByIdAndUpdate(req.params.id, req.body);
        res.redirect("/api/vol");
    } catch (err) {

    }
});
router.get("/", async (req, res) => {
    const vols = await Vol.find().populate("avionId");
    res.render("vol/index", { vols })
});
router.get("/new", async (req, res) => {
    try {
        const avions = await Avion.find({ enService: true }).sort({ compagnie: 1 });
        res.render("vol/new", { avions });
    } catch (err) {

    }
});
router.get("/:id/update", async (req, res) => {
    try {
        const vol = await Vol.findById(req.params.id);
        res.render("vol/edit", { vol });
    } catch (err) {

    }
});
router.delete("/:id", async (req, res) => {
    try {
        const billetExist = await Billet.exists({ volId: req.params.id });
        if (billetExist) return res.status(201).json({ message: "Suppresion impossible. Des places ont été réservé." });
        await Vol.findByIdAndDelete(req.params.id);
        res.redirect("/api/vol");
    } catch (err) {

    }
});
// router.post("/", async (req, res) => {
//     try {
//         const vol = new Vol(req.body);
//         const savedvol = await vol.save();
//         res.status(201).json(savedvol);
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// })
// router.get("/", async (req, res) => {
//     const vols = await Vol.find();
//     res.json(vols);
// })

// router.get("/:id", async (req, res) => {
//     try {
//         const vol = await Vol.findById(req.params.id);
//         if (!vol) return res.status(404).json({ error: "Vol non trouvé" });
//         res.json(vol)
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// })
// router.put("/:id", async (req, res) => {
//     try {
//         const vol = await Vol.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!vol) return res.status(404).json({ error: "Vol non trouvé" });
//         res.json(vol)
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// })
// router.delete("/:id", async (req, res) => {
//     try {
//         const billetExist = await Billet.exists({ volId: req.params.id });
//         if (billetExist) return res.status(201).json({ message: "Suppresion impossible. Des places ont été réservé." });
//         const vol = await Vol.findByIdAndDelete(req.params.id);
//         if (!vol) return res.status(404).json({ error: "Vol non trouvé" });
//         res.json({ message: "Vol Annulé" });
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// })

export default router;