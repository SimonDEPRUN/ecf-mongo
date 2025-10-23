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
        const avion = await Avion.findByIdAndUpdate(req.params.id, req.body);
        res.redirect("/api/avion");
    } catch (err) {

    }
});
router.get("/", async (req, res) => {
    try {
        const avions = await Avion.find();
        res.render("avion/index", { avions });
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