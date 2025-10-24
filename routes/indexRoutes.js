import { Router } from "express";
import Billet from "../models/Billet.js";
import Avion from "../models/Avion.js";
import Vol from "../models/Vol.js";
import Passager from "../models/Passager.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const volActifs = await Vol.countDocuments({ status: { $in: ["Prévu", "Retardé"] } });

        const enService = await Avion.countDocuments({ enService: true });

        const passagersTotal = await Passager.countDocuments();

        const billetsVendu = await Billet.countDocuments({ statut: "Confirmé" });

        const billetsConfirmes = await Billet.find({ statut: "Confirmé" });
        const CA = billetsConfirmes.reduce((sum, b) => sum + (b.prix || 0), 0);

        const totalBillets = await Billet.countDocuments();
        const billetsAnnules = await Billet.countDocuments({ statut: "Annulé" });
        const tauxAnnulation = totalBillets > 0 ? ((billetsAnnules / totalBillets) * 100).toFixed(2) : 0;

        res.render("index", { volActifs, enService, passagersTotal, billetsVendu, CA, tauxAnnulation });
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
});

export default router;