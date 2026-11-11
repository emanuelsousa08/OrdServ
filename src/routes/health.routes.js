import { Router } from "express";
import { prisma } from "../db/prisma.js";

const router = Router();

// Teste da API
router.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    application: "OrdServ",
    message: "API funcionando corretamente.",
  });
});

// Teste da conexão com PostgreSQL
router.get("/db", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "OK",
      database: "PostgreSQL",
      message: "Conexão com o banco de dados estabelecida.",
    });
  } catch (error) {
    req.log.error({ err: error }, "Falha na conexão com PostgreSQL");

    res.status(503).json({
      status: "ERROR",
      database: "PostgreSQL",
      message: "Não foi possível conectar ao banco de dados.",
    });
  }
});

export default router;
