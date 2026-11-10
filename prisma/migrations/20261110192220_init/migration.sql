-- CreateEnum
CREATE TYPE "StatusOS" AS ENUM ('EM_ANALISE', 'EM_EXECUCAO', 'CONCLUIDA');

-- CreateTable
CREATE TABLE "OrdemServico" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "cliente" TEXT NOT NULL,
    "telefone" TEXT,
    "equipamento" TEXT NOT NULL,
    "marcaModelo" TEXT,
    "problema" TEXT NOT NULL,
    "diagnostico" TEXT,
    "status" "StatusOS" NOT NULL DEFAULT 'EM_ANALISE',
    "valor" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrdemServico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrdemServico_numero_key" ON "OrdemServico"("numero");
