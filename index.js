import express from "express";
import { connect } from "mongoose";
// import cors from "cors";
import methodeoverride from "method-override";


import avionRoutes from "./routes/avionRoutes.js"
import billetRoutes from "./routes/billetRoutes.js"
import volRoutes from "./routes/volRoutes.js"
import passagerRoutes from "./routes/passagerRoutes.js"


const app = express();


app.use(express.json());
// app.use(cors());
app.use(methodeoverride("_method"));
app.use(express.urlencoded({ extended: true }));



connect("mongodb://127.0.0.1:27017/TP_ecf")
    .then(() => console.log("connecté à MongoDB"))
    .catch(err => console.error("Erreur MongoDB : ", err));


app.set("view engine", "ejs");
// app.set("views", "./views");

app.use("/api/avion", avionRoutes);
app.use("/api/billet", billetRoutes);
app.use("/api/passager", passagerRoutes);
app.use("/api/vol", volRoutes);

app.get("/", (req, res) => res.send("API MongoDB en Node.js"));
app.listen(3000, () => console.log("Serveur lancé sur http://localhost:3000"));