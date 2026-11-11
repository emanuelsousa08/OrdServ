import { prisma } from "../db/prisma.js";

export const ordemServicoRepository = {
  async criar(dados) {
    return prisma.ordemServico.create({
      data: dados,
    });
  },

  async listarTodas() {
    return prisma.ordemServico.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async buscarPorId(id) {
    return prisma.ordemServico.findUnique({
      where: { id },
    });
  },

  async atualizarStatus(id, status) {
    return prisma.ordemServico.update({
      where: { id },
      data: { status },
    });
  },
};
