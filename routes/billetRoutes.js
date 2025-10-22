import { Router } from "express";
import Billet from "../models/Billet.js";
import Avion from "../models/Avion.js";
import Vol from "../models/Vol.js";
import mongoose from "mongoose";

const router = Router();

router.post("/", async (req, res) => {
    const session = await mongoose.startSession();
    // session.startTransaction();
    try {
        const { volId, passagerId, numeroSiege, classe, prix, dateReservation, modePaiement, statut } = req.body;
        const vol = await Vol.findById(volId).session(session);
        if (!vol) throw new Error("Il n'y a pas de vol prévu");
        const avion = await Avion.findById(vol.avionId).session(session);
        if (!avion) throw new Error("Cet avion est introuvable");
        if (avion.placeRestantes <= 0) throw new Error("Ce vol est complet");
        avion.placeRestantes -= 1;
        await avion.save({ session });

        const billet = await Billet.create(
            [{ volId, passagerId, numeroSiege, classe, prix, dateReservation, modePaiement, statut }],
            { session }
        );

        // await session.commitTransaction();
        session.endSession();

        return res.status(201).json(billet[0]);
    } catch (err) {
        // await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ error: err.message })
    }
});

router.delete("/:id", async (req, res) => {
    const session = await mongoose.startSession();
    // session.startTransaction();

    try {

        const billet = await Billet.findById(req.params.id).session(session);
        if (!billet) throw new Error("Billet non trouvé");
        const avion = await Avion.findById(billet.avionId).session(session);

        avion.placeRestantes += 1;
        await avion.save({ session });

        await Billet.findByIdAndDelete(req.params.id).session(session);

        // await session.commitTransaction();
        session.endSession();

        return res.json({ message: "Voyage annulé" });
    } catch {
        // await session.abortTransaction();
        session.endSession();
        res.status(400).json({ error: err.message });
    }
});

export default router;