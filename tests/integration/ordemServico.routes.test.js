import { afterAll, describe, expect, it } from "vitest";
import request from "supertest";

import app from "../../src/app.js";
import { prisma } from "../../src/db/prisma.js";

const numerosCriados = [];
let sequencia = 0;

function dadosOrdem() {
  sequencia++;

  const numero = `TESTE-INTEGRACAO-${Date.now()}-${sequencia}`;
  numerosCriados.push(numero);

  return {
    numero,
    cliente: "Cliente de Teste",
    telefone: "88999999999",
    equipamento: "Notebook",
    marcaModelo: "Dell Inspiron",
    problema: "Não liga",
  };
}

async function cadastrarOrdem(dados = dadosOrdem()) {
  return request(app).post("/api/ordens-servico").send(dados);
}

afterAll(async () => {
  if (numerosCriados.length > 0) {
    await prisma.ordemServico.deleteMany({
      where: {
        numero: {
          in: numerosCriados,
        },
      },
    });
  }

  await prisma.$disconnect();
});

describe("POST /api/ordens-servico", () => {
  it("deve cadastrar uma ordem de serviço", async () => {
    const dados = dadosOrdem();
    const response = await cadastrarOrdem(dados);

    expect(response.status).toBe(201);
    expect(response.body.numero).toBe(dados.numero);
    expect(response.body.cliente).toBe(dados.cliente);
    expect(response.body.status).toBe("EM_ANALISE");
  });

  it("deve rejeitar dados obrigatórios ausentes", async () => {
    const response = await cadastrarOrdem({
      cliente: "Cliente de Teste",
      equipamento: "Notebook",
      problema: "Não liga",
    });

    expect(response.status).toBe(400);
  });

  it("não deve permitir números de OS duplicados", async () => {
    const dados = dadosOrdem();

    const primeiraResposta = await cadastrarOrdem(dados);
    const segundaResposta = await cadastrarOrdem(dados);

    expect(primeiraResposta.status).toBe(201);
    expect(segundaResposta.status).toBe(409);
  });
});

describe("GET /api/ordens-servico", () => {
  it("deve listar as ordens de serviço", async () => {
    const dados = dadosOrdem();
    await cadastrarOrdem(dados);

    const response = await request(app).get("/api/ordens-servico");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.some((ordem) => ordem.numero === dados.numero)).toBe(
      true,
    );
  });
});

describe("GET /api/ordens-servico/:id", () => {
  it("deve consultar uma ordem pelo ID", async () => {
    const cadastro = await cadastrarOrdem();

    const response = await request(app).get(
      `/api/ordens-servico/${cadastro.body.id}`,
    );

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(cadastro.body.id);
  });

  it("deve rejeitar um ID inválido", async () => {
    const response = await request(app).get("/api/ordens-servico/abc");

    expect(response.status).toBe(400);
  });

  it("deve retornar 404 para uma ordem inexistente", async () => {
    const response = await request(app).get("/api/ordens-servico/2147483647");

    expect(response.status).toBe(404);
  });
});

describe("PATCH /api/ordens-servico/:id/status", () => {
  it("deve atualizar o status de uma ordem", async () => {
    const cadastro = await cadastrarOrdem();

    const response = await request(app)
      .patch(`/api/ordens-servico/${cadastro.body.id}/status`)
      .send({ status: "EM_EXECUCAO" });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("EM_EXECUCAO");
  });

  it("deve rejeitar um status inválido", async () => {
    const cadastro = await cadastrarOrdem();

    const response = await request(app)
      .patch(`/api/ordens-servico/${cadastro.body.id}/status`)
      .send({ status: "CANCELADA" });

    expect(response.status).toBe(400);
  });

  it("deve retornar 404 ao atualizar uma ordem inexistente", async () => {
    const response = await request(app)
      .patch("/api/ordens-servico/2147483647/status")
      .send({ status: "EM_EXECUCAO" });

    expect(response.status).toBe(404);
  });
});
