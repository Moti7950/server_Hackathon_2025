import express from "express";
import userRoute from "./routes/user.routes"

const serverIntelligenceAttack = express();

serverIntelligenceAttack.use(express.json());

serverIntelligenceAttack.use("/users", userRoute);

export default serverIntelligenceAttack;