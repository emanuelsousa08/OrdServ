import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import swaggerUi from "swagger-ui-express";
import { parse } from "yaml";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import healthRoutes from "./routes/health.routes.js";
import ordemServicoRoutes from "./routes/ordemServico.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { httpRequestsTotal, register } from "./metrics/prometheus.js";

const app = express();

const openApiPath = fileURLToPath(
  new URL("../docs/openapi.yaml", import.meta.url),
);

const openApiDocument = parse(
  readFileSync(openApiPath, "utf8"),
);

const defaultCsp = helmet.contentSecurityPolicy();

const swaggerCsp = helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    baseUri: ["'self'"],
    fontSrc: ["'self'", "https:", "data:"],
    formAction: ["'self'"],
    frameAncestors: ["'self'"],
    imgSrc: ["'self'", "data:"],
    objectSrc: ["'none'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    scriptSrcAttr: ["'none'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
  },
});

app.use(helmet({ contentSecurityPolicy: false }));

app.use((req, res, next) => {
  const isSwagger =
    req.path === "/api-docs" ||
    req.path.startsWith("/api-docs/");

  return (isSwagger ? swaggerCsp : defaultCsp)(
    req,
    res,
    next,
  );
});

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

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(openApiDocument),
);

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
