import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

export const options = {
  vus: 1,
  duration: "10s",
  thresholds: {
    http_req_duration: ["p(95)<500"],
    http_req_failed: ["rate<0.01"],
    checks: ["rate>0.99"],
  },
};

export default function () {
  const health = http.get(`${BASE_URL}/api/health`);

  check(health, {
    "Health retorna HTTP 200": (r) => r.status === 200,
    "Health retorna status OK": (r) => r.json("status") === "OK",
  });

  const ordens = http.get(`${BASE_URL}/api/ordens-servico`);

  check(ordens, {
    "Listagem retorna HTTP 200": (r) => r.status === 200,
    "Listagem retorna um array": (r) => Array.isArray(r.json()),
  });

  sleep(1);
}
