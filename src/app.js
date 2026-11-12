import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import healthRoutes from "./routes/health.routes.js";
import ordemServicoRoutes from "./routes/ordemServico.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { httpRequestsTotal, register } from "./metrics/prometheus.js";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(pinoHttp());

app.use((req, res, next) => {
  if (req.path === "/metrics") {
    return next();
  }

  res.on("finish", () => {
    httpRequestsTotal.inc({
      method: req.method,
      status_code: String(res.statusCode),
    });
  });

  next();
});

app.use("/api/health", healthRoutes);
app.use("/api/ordens-servico", ordemServicoRoutes);

app.get("/metrics", async (req, res, next) => {
  try {
    res.set("Content-Type", register.contentType);
    res.send(await register.metrics());
  } catch (error) {
    next(error);
  }
});

app.use(errorMiddleware);

export default app;
