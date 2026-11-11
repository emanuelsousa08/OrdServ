import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import healthRoutes from "./routes/health.routes.js";
import ordemServicoRoutes from "./routes/ordemServico.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(pinoHttp());

app.use("/api/health", healthRoutes);
app.use("/api/ordens-servico", ordemServicoRoutes);

app.use(errorMiddleware);

export default app;
