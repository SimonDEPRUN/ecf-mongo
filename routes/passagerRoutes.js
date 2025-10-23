import { Router } from "express";
import Passager from "../models/Passager.js";
const router = Router();

router.post("/", async (req, res) => {
    try {
        const passager = await Passager.create(req.body);
        res.redirect("/api/passager")
    } catch (err) {

    }
});
router.get("/new", async (req, res) => {
    try {
        res.render("passager/new");
    } catch (err) {

    }
});
router.get("/", async (req, res) => {
    const passagers = await Passager.find();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const passagersDuMois = passagers.filter(p => {
        const inscription = new Date(p.dateInscription);
        return inscription >= startOfMonth && inscription <= endOfMonth;
    });

    res.render("passager/index", { passagers, passagersDuMois })
});

router.get("/:id/update", async (req, res) => {
    try {
        const passager = await Passager.findById(req.params.id);
        res.render("passager/edit", { passager })
    } catch (err) {

    }
});
router.put("/:id", async (req, res) => {
    try {
        const passager = await Passager.findByIdAndUpdate(req.params.id, req.body);
        res.redirect("/api/passager")
    } catch (err) {

    }
});
router.delete("/:id", async (req, res) => {
    try {

        const passager = await Passager.findByIdAndDelete(req.params.id);
        res.redirect("/api/passager")
    } catch (err) {

    }
});
// router.post("/", async (req, res) => {
//     try {
//         const passager = new Passager(req.body);
//         const savedpassager = await passager.save();
//         res.status(201).json(savedpassager);
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// })
// router.get("/", async (req, res) => {
//     const passagers = await Passager.find();
//     res.json(passagers);
// })

// router.get("/:id", async (req, res) => {
//     try {
//         const passager = await Passager.findById(req.params.id);
//         if (!passager) return res.status(404).json({ error: "Passager non trouvé" });
//         res.json(passager)
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// })
// router.put("/:id", async (req, res) => {
//     try {
//         const passager = await Passager.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!passager) return res.status(404).json({ error: "Passager non trouvé" });
//         res.json(passager)
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// })
// router.delete("/:id", async (req, res) => {
//     try {

//         const passager = await Passager.findByIdAndDelete(req.params.id);
//         if (!passager) return res.status(404).json({ error: "Passager non trouvé" });
//         res.json({ message: "Passager Annulé" });
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// })

export default router;