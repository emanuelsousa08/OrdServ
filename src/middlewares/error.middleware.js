export function errorMiddleware(error, req, res, next) {
  req.log.error({ err: error }, "Erro na requisição");

  const statusCode =
    error.statusCode ||
    (error.code === "P2002" ? 409 : 500);

  const messages = {
    400: "Dados inválidos ou incompletos.",
    404: "Ordem de serviço não encontrada.",
    409: "Já existe uma ordem de serviço com esses dados.",
    500: "Erro interno do servidor.",
  };

  return res.status(statusCode).json({
    status: "ERROR",
    message: messages[statusCode] || messages[500],
  });
}