import { Schema, model } from "mongoose";

const volSchema = new Schema({
    numero: { type: String, required: true },
    origine: { type: String, required: true },
    destination: { type: String, required: true },
    dateDepart: { type: Date, required: true },
    dateArrivee: { type: Date, required: true },
    avion: { type: Schema.Types.ObjectId, ref: "Avion", required: true },
    status: { type: String, enum: ["Prévu", "Retardé", "Terminé", "Annulé"], default: "Prévu" }
}, { timestamps: true })

export default model("Vol", volSchema);