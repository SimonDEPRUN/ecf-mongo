import { Router } from "express";
import Avion from "../models/Avion.js";
const router = Router();

router.post("/", async (req, res) => {
    try {
        const avion = await Avion.create(req.body);
        res.redirect("/api/avion");
    } catch (err) {

    }
});
router.put("/:id", async (req, res) => {
    try {
        const { model, compagnie, capacite } = req.body;

        const enService = req.body.enService === "on" ? true : false;

        await Avion.findByIdAndUpdate(req.params.id, { model, compagnie, capacite, enService });
        res.redirect("/api/avion");
    } catch (err) {

    }
});
router.get("/", async (req, res) => {
    try {
        const avions = await Avion.find().sort({ compagnie: 1 });

        const enService = avions.filter(a => a.enService);
        const horsService = avions.filter(a => !a.enService);
        const sumES = enService.length;
        const sumHS = horsService.length;

        const capaciteTotal = avions.reduce((sum, a) => sum + a.placeRestantes, 0);

        const avionsParCompagnie = {};
        avions.forEach(a => {
            if (!avionsParCompagnie[a.compagnie]) {
                avionsParCompagnie[a.compagnie] = [];
            }
            avionsParCompagnie[a.compagnie].push(a);
        });

        res.render("avion/index", { avions, enService, horsService, capaciteTotal, avionsParCompagnie, sumES, sumHS });
    } catch (err) {

    }
});
router.get("/new", async (req, res) => {
    try {
        res.render("avion/new");
    } catch (err) {

    }
});
router.get("/:id/update", async (req, res) => {
    try {
        const avion = await Avion.findById(req.params.id);
        res.render("avion/edit", { avion });
    } catch (err) {

    }
});
router.delete("/:id", async (req, res) => {
    await Avion.findByIdAndDelete(req.params.id);
    res.redirect("/api/avion");
})

export default router;