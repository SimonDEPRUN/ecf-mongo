import { Schema, model } from "mongoose";

const billetSchema = new Schema({
    volId: { type: Schema.Types.ObjectId, ref: "Vol", required: true },
    passagerId: { type: Schema.Types.ObjectId, ref: "Passager", required: true },
    numeroSiege: { type: String, required: true },
    classe: { type: String, enum: ["Economie", "Affaires", "Première"], default: "Economie" },
    prix: { type: Number, min: [0, "le prix doit être positif"] },
    dateReservation: { type: Date, required: true, default: Date.now },
    modePaiement: { type: String, enum: ["CB", "Paypal", "Espèces"] },
    statut: { type: String, enum: ["Confirmé", "Annulé"], default: "Confirmé" },
}, { timestamps: true })

export default model("Billet", billetSchema);