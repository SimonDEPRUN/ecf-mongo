import express from "express";
import { connect } from "mongoose";
import cors from "cors";
import avionRoutes from "./routes/avionRoutes.js"
import billetRoutes from "./routes/billetRoutes.js"
import volRoutes from "./routes/volRoutes.js"
import passagerRoutes from "./routes/passagerRoutes.js"

const app = express();
app.use(express.json());

app.use("/avions", avionRoutes);
app.use("/billets", billetRoutes);
app.use("/passagers", passagerRoutes);
app.use("/vols", volRoutes);

app.use(cors());
connect("mongodb://127.0.0.1:27017/TP_ecf")
    .then(() => console.log("connecté à MongoDB"))
    .catch(err => console.error("Erreur MongoDB : ", err));

app.get("/", (req, res) => res.send("API MongoDB en Node.js"));
app.listen(3000, () => console.log("Serveur lancé sur http://localhost:3000"));