import { Router } from "express";
import Billet from "../models/Billet.js";
import Avion from "../models/Avion.js";
import Vol from "../models/Vol.js";
import Passager from "../models/Passager.js";
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

        res.redirect("/api/billet")
    } catch (err) {
        // await session.abortTransaction();
        session.endSession();
    }
});
router.get("/", async (req, res) => {
    try {
        const billets = await Billet.find().populate("volId").populate("passagerId");

        const billetAnnulee = billets.filter(b => b.statut === "Annulé")

        const billetsParClasse = {};
        billets.forEach(b => {
            const classe = b.classe || "Inconnu";
            if (!billetsParClasse[classe]) billetsParClasse[classe] = [];
            billetsParClasse[classe].push(b);
        });

        let classeLaPlusVendue = null;
        let maxCount = 0;

        for (const [classe, liste] of Object.entries(billetsParClasse)) {
            if (liste.length > maxCount) {
                maxCount = liste.length;
                classeLaPlusVendue = classe;
            }
        };

        const CA = billets.reduce((sum, b) => sum + (b.prix || 0), 0);


        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const venteDuMois = billets.filter(b => {
            const vente = new Date(b.dateReservation);
            return vente >= startOfMonth && vente <= endOfMonth;
        })


        res.render("billet/index", { billets, venteDuMois, CA, classeLaPlusVendue, billetAnnulee });
    } catch (err) {

    }
});
router.get("/new", async (req, res) => {
    try {
        const vols = await Vol.find({ status: ["Prévu", "Retardé"] });
        const passagers = await Passager.find();
        res.render("billet/new", { vols, passagers });
    } catch (err) {

    }
});
router.put("/:id/toggle", async (req, res) => {
    const session = await mongoose.startSession();
    try {
        const billet = await Billet.findById(req.params.id).session(session);
        const vol = await Vol.findById(billet.volId).session(session);
        const avion = await Avion.findById(vol.avionId).session(session);

        if (billet.statut === "Confirmé") {
            billet.statut = "Annulé"
            avion.placeRestantes += 1;
        } else {
            if (avion.placeRestantes <= 0) throw new Error("Impossible de confirmer : il n'y a plus de place disponible");
            billet.statut = "Confirmé";
            avion.placeRestantes -= 1;
        }
        await billet.save({ session });
        await avion.save({ session });
        session.endSession();

        res.redirect("/api/billet");
    } catch (err) {
        session.endSession();
    }
});
router.delete("/:id", async (req, res) => {
    const session = await mongoose.startSession();
    // session.startTransaction();

    try {
        const billet = await Billet.findById(req.params.id).session(session);
        if (!billet) throw new Error("Billet non trouvé");

        const vol = await Vol.findById(billet.volId).session(session);
        if (!vol) throw new Error("Vol introuvable");

        const avion = await Avion.findById(vol.avionId).session(session);
        if (!avion) throw new Error("Avion introuvable");

        avion.placeRestantes += 1;
        await avion.save({ session });

        await Billet.findByIdAndDelete(req.params.id).session(session);

        // await session.commitTransaction();
        session.endSession();

        res.redirect("/api/billet")
    } catch {
        // await session.abortTransaction();
        session.endSession();
        res.status(400).json({ error: err.message });
    }
});
// router.post("/", async (req, res) => {
//     const session = await mongoose.startSession();
//     // session.startTransaction();
//     try {
//         const { volId, passagerId, numeroSiege, classe, prix, dateReservation, modePaiement, statut } = req.body;
//         const vol = await Vol.findById(volId).session(session);
//         if (!vol) throw new Error("Il n'y a pas de vol prévu");
//         const avion = await Avion.findById(vol.avionId).session(session);
//         if (!avion) throw new Error("Cet avion est introuvable");
//         if (avion.placeRestantes <= 0) throw new Error("Ce vol est complet");
//         avion.placeRestantes -= 1;
//         await avion.save({ session });

//         const billet = await Billet.create(
//             [{ volId, passagerId, numeroSiege, classe, prix, dateReservation, modePaiement, statut }],
//             { session }
//         );

//         // await session.commitTransaction();
//         session.endSession();

//         return res.status(201).json(billet[0]);
//     } catch (err) {
//         // await session.abortTransaction();
//         session.endSession();
//         return res.status(400).json({ error: err.message })
//     }
// });

// router.delete("/:id", async (req, res) => {
//     const session = await mongoose.startSession();
//     // session.startTransaction();

//     try {

//         const billet = await Billet.findById(req.params.id).session(session);
//         if (!billet) throw new Error("Billet non trouvé");
//         const avion = await Avion.findById(billet.avionId).session(session);

//         avion.placeRestantes += 1;
//         await avion.save({ session });

//         await Billet.findByIdAndDelete(req.params.id).session(session);

//         // await session.commitTransaction();
//         session.endSession();

//         return res.json({ message: "Voyage annulé" });
//     } catch {
//         // await session.abortTransaction();
//         session.endSession();
//         res.status(400).json({ error: err.message });
//     }
// });

export default router;