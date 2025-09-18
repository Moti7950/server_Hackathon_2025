import express from "express";
import userRoute from "./routes/user.routes.js";
import locationRoutes from "./routes/locations.routes.js";
import SuspiciousRouter from "./routes/suspicious.routes.js";
import cors from "cors";
import locationsDB from "../lib/supabase.js";
import pingRoutes from "./routes/ping.routes.js";


const serverIntelligenceAttack = express();

serverIntelligenceAttack.use(cors());

serverIntelligenceAttack.use(cors());
serverIntelligenceAttack.use(express.json());

// Middleware ping
serverIntelligenceAttack.use("/ping", pingRoutes);


// Middleware to log request method and URL
serverIntelligenceAttack.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

//users routes
serverIntelligenceAttack.use("/users", userRoute);

export default serverIntelligenceAttack;
