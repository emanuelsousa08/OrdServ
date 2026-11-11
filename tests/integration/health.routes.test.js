import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { prisma } from "../../src/db/prisma.js";

describe("GET /api/health", () => {
  it("deve retornar 200 e confirmar que a API está funcionando", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      status: "OK",
      application: "OrdServ",
      message: "API funcionando corretamente.",
    });
  });
});

describe("GET /api/health/db", () => {
  it("deve confirmar a conexão com PostgreSQL", async () => {
    const response = await request(app).get("/api/health/db");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      status: "OK",
      database: "PostgreSQL",
      message: "Conexão com o banco de dados estabelecida.",
    });
  });

  it("deve retornar 503 quando a conexão com PostgreSQL falhar", async () => {
    vi.spyOn(prisma, "$queryRaw").mockRejectedValueOnce(
      new Error("Falha simulada na conexão"),
    );

    const response = await request(app).get("/api/health/db");

    expect(response.status).toBe(503);

    expect(response.body).toEqual({
      status: "ERROR",
      database: "PostgreSQL",
      message: "Não foi possível conectar ao banco de dados.",
    });
  });
});
