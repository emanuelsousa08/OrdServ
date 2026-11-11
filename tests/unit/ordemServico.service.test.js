import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/repositories/ordemServico.repository.js", () => ({
  ordemServicoRepository: {
    criar: vi.fn(),
    listarTodas: vi.fn(),
    buscarPorId: vi.fn(),
    atualizarStatus: vi.fn(),
  },
}));

import { ordemServicoRepository } from "../../src/repositories/ordemServico.repository.js";
import { ordemServicoService } from "../../src/services/ordemServico.service.js";

const dadosValidos = {
  numero: "OS-001",
  cliente: "Cliente de Teste",
  equipamento: "Computador",
  problema: "Não liga",
};

const ordemExistente = {
  id: 1,
  ...dadosValidos,
  status: "EM_ANALISE",
};

describe("ordemServicoService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("criar", () => {
    it("deve criar uma ordem com dados válidos", async () => {
      ordemServicoRepository.criar.mockResolvedValue(ordemExistente);

      const resultado = await ordemServicoService.criar(dadosValidos);

      expect(resultado).toEqual(ordemExistente);
      expect(ordemServicoRepository.criar).toHaveBeenCalledWith(dadosValidos);
    });

    it("deve rejeitar dados obrigatórios ausentes", async () => {
      await expect(
        ordemServicoService.criar({ numero: "OS-001" }),
      ).rejects.toMatchObject({ statusCode: 400 });

      expect(ordemServicoRepository.criar).not.toHaveBeenCalled();
    });
  });

  describe("listarTodas", () => {
    it("deve retornar todas as ordens", async () => {
      ordemServicoRepository.listarTodas.mockResolvedValue([ordemExistente]);

      const resultado = await ordemServicoService.listarTodas();

      expect(resultado).toEqual([ordemExistente]);
      expect(ordemServicoRepository.listarTodas).toHaveBeenCalledOnce();
    });
  });

  describe("buscarPorId", () => {
    it("deve retornar uma ordem existente", async () => {
      ordemServicoRepository.buscarPorId.mockResolvedValue(ordemExistente);

      const resultado = await ordemServicoService.buscarPorId(1);

      expect(resultado).toEqual(ordemExistente);
      expect(ordemServicoRepository.buscarPorId).toHaveBeenCalledWith(1);
    });

    it("deve rejeitar um ID inválido", async () => {
      await expect(
        ordemServicoService.buscarPorId(0),
      ).rejects.toMatchObject({ statusCode: 400 });

      expect(ordemServicoRepository.buscarPorId).not.toHaveBeenCalled();
    });

    it("deve rejeitar uma ordem inexistente", async () => {
      ordemServicoRepository.buscarPorId.mockResolvedValue(null);

      await expect(
        ordemServicoService.buscarPorId(999),
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe("atualizarStatus", () => {
    it("deve atualizar o status de uma ordem existente", async () => {
      const ordemAtualizada = {
        ...ordemExistente,
        status: "EM_EXECUCAO",
      };

      ordemServicoRepository.buscarPorId.mockResolvedValue(ordemExistente);
      ordemServicoRepository.atualizarStatus.mockResolvedValue(ordemAtualizada);

      const resultado = await ordemServicoService.atualizarStatus(
        1,
        "EM_EXECUCAO",
      );

      expect(resultado).toEqual(ordemAtualizada);
      expect(ordemServicoRepository.buscarPorId).toHaveBeenCalledWith(1);
      expect(ordemServicoRepository.atualizarStatus).toHaveBeenCalledWith(
        1,
        "EM_EXECUCAO",
      );
    });

    it("deve rejeitar um status inválido", async () => {
      await expect(
        ordemServicoService.atualizarStatus(1, "CANCELADA"),
      ).rejects.toMatchObject({ statusCode: 400 });

      expect(ordemServicoRepository.atualizarStatus).not.toHaveBeenCalled();
    });

    it("deve rejeitar a atualização de uma ordem inexistente", async () => {
      ordemServicoRepository.buscarPorId.mockResolvedValue(null);

      await expect(
        ordemServicoService.atualizarStatus(999, "CONCLUIDA"),
      ).rejects.toMatchObject({ statusCode: 404 });

      expect(ordemServicoRepository.atualizarStatus).not.toHaveBeenCalled();
    });
  });
});
