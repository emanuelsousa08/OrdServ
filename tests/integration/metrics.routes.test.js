import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app.js";

describe("Métricas da aplicação", () => {
  it("deve disponibilizar métricas no formato Prometheus", async () => {
    const response = await request(app).get("/metrics");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("text/plain");
    expect(response.text).toContain("http_requests_total");
  });

  it("deve contabilizar requisições HTTP comuns", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);

    const metrics = await request(app).get("/metrics");

    expect(metrics.text).toContain(
      'http_requests_total{method="GET",status_code="200"}',
    );
  });
});
