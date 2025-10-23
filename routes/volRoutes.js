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
    try {
        const vols = await Vol.find().populate("avionId");

        const statusOrder = ["Prévu", "Retardé", "Terminé", "Annulé"];

        vols.sort((a, b) => {
            const statusDiff = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
            if (statusDiff !== 0) return statusDiff;


            const compA = a.avionId?.compagnie?.toLowerCase() || "";
            const compB = b.avionId?.compagnie?.toLowerCase() || "";
            return compA.localeCompare(compB);
        });

        const statusVol = {};
        statusOrder.forEach(status => {
            statusVol[status] = vols.filter(v => v.status === status);
        });

        const volsParCompagnie = {};
        vols.forEach(v => {
            const comp = v.avionId?.compagnie || "Inconnu";
            if (!volsParCompagnie[comp]) volsParCompagnie[comp] = [];
            volsParCompagnie[comp].push(v);
        });

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const volsDuMois = vols.filter(v => {
            const depart = new Date(v.dateDepart);
            return depart >= startOfMonth && depart <= endOfMonth;
        });


        res.render("vol/index", { vols, statusVol, volsParCompagnie, volsDuMois });
    } catch (err) { }
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