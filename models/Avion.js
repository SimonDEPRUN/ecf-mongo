import { Schema, model } from "mongoose";

const avionSchema = new Schema({
    model: { type: String, required: true },
    compagnie: { type: String, required: true },
    capacite: { type: Number, max: 10, required: true },
    placeRestantes: { type: Number },
    enService: { type: Boolean, default: true }
}, { timestamps: true })

export default model("Avion", avionSchema);