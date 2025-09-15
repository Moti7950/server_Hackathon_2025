import express from "express";
import userRoute from "./routes/user.routes.js";
import locationRoutes from "./routes/locations.routes.js";
import cors from "cors";
import locationsDB from "../lib/supabase.js";

const serverIntelligenceAttack = express();

serverIntelligenceAttack.use(cors());

serverIntelligenceAttack.use(express.json());

serverIntelligenceAttack.use("/users", userRoute);

serverIntelligenceAttack.use("/locations", locationRoutes);

export default serverIntelligenceAttack;
