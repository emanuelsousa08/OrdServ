import { Counter, register } from "@prometheus-io/client";

export const httpRequestsTotal = new Counter({
  name: "http_requests_total",
  help: "Total de requisições HTTP recebidas pela aplicação.",
  labelNames: ["method", "status_code"],
});

export { register };
