import { Schema, model } from "mongoose";

const avionSchema = new Schema({
    model: { type: String, required: true },
    compagnie: { type: String, required: true },
    capacite: { type: Number, max: 10, required: true },
    placeRestantes: {
        type: Number,
        default: 10,
        validate: {
            validator: function (value) {
                return value <= this.capacite;
            },
            message: "Il ne peut pas y avoir plus de place disponible que la capacité de l'appareil"
        }
    },
    enService: { type: Boolean, default: true }
}, { timestamps: true })

export default model("Avion", avionSchema);