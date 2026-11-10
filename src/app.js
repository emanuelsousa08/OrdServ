import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import healthRoutes from "./routes/health.routes.js";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(pinoHttp());

app.use("/api/health", healthRoutes);

export default app;