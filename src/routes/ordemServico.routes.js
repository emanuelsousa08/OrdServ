import { Router } from "express";
import { ordemServicoController } from "../controllers/ordemServico.controller.js";

const router = Router();

router.post("/", ordemServicoController.criar);
router.get("/", ordemServicoController.listarTodas);
router.get("/:id", ordemServicoController.buscarPorId);
router.patch("/:id/status", ordemServicoController.atualizarStatus);

export default router;
