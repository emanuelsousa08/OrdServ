import { ordemServicoRepository } from "../repositories/ordemServico.repository.js";

function criarErro(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

export const ordemServicoService = {
  async criar(dados) {
    if (
      !dados.numero ||
      !dados.cliente ||
      !dados.equipamento ||
      !dados.problema
    ) {
      throw criarErro(
        "Número, cliente, equipamento e problema são obrigatórios.",
        400,
      );
    }

    return ordemServicoRepository.criar(dados);
  },

  async listarTodas() {
    return ordemServicoRepository.listarTodas();
  },

  async buscarPorId(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw criarErro("ID inválido.", 400);
    }

    const ordem = await ordemServicoRepository.buscarPorId(id);

    if (!ordem) {
      throw criarErro("Ordem de serviço não encontrada.", 404);
    }

    return ordem;
  },

  async atualizarStatus(id, status) {
    const statusValidos = ["EM_ANALISE", "EM_EXECUCAO", "CONCLUIDA"];

    if (!statusValidos.includes(status)) {
      throw criarErro("Status inválido.", 400);
    }

    await this.buscarPorId(id);

    return ordemServicoRepository.atualizarStatus(id, status);
  },
};
