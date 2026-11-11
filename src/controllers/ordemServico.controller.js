import { ordemServicoService } from "../services/ordemServico.service.js";

export const ordemServicoController = {
  async criar(req, res) {
    const ordem = await ordemServicoService.criar(req.body);

    return res.status(201).json(ordem);
  },

  async listarTodas(req, res) {
    const ordens = await ordemServicoService.listarTodas();

    return res.status(200).json(ordens);
  },

  async buscarPorId(req, res) {
    const id = Number(req.params.id);

    const ordem = await ordemServicoService.buscarPorId(id);

    return res.status(200).json(ordem);
  },

  async atualizarStatus(req, res) {
    const id = Number(req.params.id);
    const status = req.body?.status;

    const ordem = await ordemServicoService.atualizarStatus(id, status);

    return res.status(200).json(ordem);
  },
};
