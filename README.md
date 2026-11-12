### Nível do Projeto: B

# OrdServ

API REST para gerenciamento de ordens de serviço, permitindo cadastrar, consultar e atualizar o status dos atendimentos.

**Fluxo principal:** cadastrar ordem de serviço → consultar ordens → acompanhar atendimento → atualizar status.

## Regras de negócio

1. Número, cliente, equipamento e problema são campos obrigatórios.
2. Cada ordem de serviço possui um número único.
3. O status inicial é `EM_ANALISE`.
4. Os status disponíveis são `EM_ANALISE`, `EM_EXECUCAO` e `CONCLUIDA`.
5. Não é possível consultar uma ordem de serviço com ID inválido ou inexistente.
6. A listagem apresenta as ordens mais recentes primeiro.

## Tecnologias

Node.js, Express 5, Prisma ORM, PostgreSQL 16, Docker Compose, Vitest, Supertest, ESLint, Pino e GitHub Actions.

## Como rodar

### Pré-requisitos

- Node.js
- Docker Desktop
- Git

### Configuração

Clone o repositório e acesse a pasta:

```bash
git clone https://github.com/emanuelsousa08/OrdServ.git
cd OrdServ
```

Instale as dependências:

```bash
npm ci
```

Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure a senha do PostgreSQL e a variável `DATABASE_URL`.

### Banco de dados

Inicie o PostgreSQL:

```bash
docker compose up -d
```

Gere o Prisma Client e execute as migrações:

```bash
npx prisma generate
npx prisma migrate deploy
```

### Executar a API

Modo desenvolvimento:

```bash
npm run dev
```

Modo produção:

```bash
npm start
```

A API ficará disponível em `http://localhost:3000`.

## Como testar

Executar os testes:

```bash
npm test
```

Verificar cobertura:

```bash
npm run coverage
```

Executar o ESLint:

```bash
npm run lint
```

O pipeline CI do GitHub Actions executa as verificações de lint e cobertura de testes.

## Métrica e SLO

A aplicação disponibiliza métricas no endpoint `GET /metrics`, utilizando o formato Prometheus.

A métrica `http_requests_total` contabiliza as requisições HTTP por método e código de resposta, exceto as requisições ao próprio endpoint `/metrics`.

**SLO de disponibilidade:**

- Meta: 99%.
- Janela de avaliação: 7 dias.
- Critério: proporção de requisições que não retornam erros HTTP 5xx em relação ao total de requisições.

O cálculo pode ser realizado no Prometheus utilizando a métrica `http_requests_total`.

**Limitação:** a métrica é armazenada em memória e reiniciada junto com a aplicação. Como não há coleta e armazenamento histórico configurados neste projeto, o SLO representa uma meta operacional, não uma disponibilidade histórica efetivamente medida.

## Endpoints

| Método | Rota                             | Descrição                         |
| ------ | -------------------------------- | --------------------------------- |
| GET    | `/api/health`                    | Verifica o funcionamento da API   |
| GET    | `/api/health/db`                 | Verifica a conexão com PostgreSQL |
| POST   | `/api/ordens-servico`            | Cadastra uma ordem de serviço     |
| GET    | `/api/ordens-servico`            | Lista todas as ordens             |
| GET    | `/api/ordens-servico/:id`        | Consulta uma ordem por ID         |
| PATCH  | `/api/ordens-servico/:id/status` | Atualiza o status de uma ordem    |

## Estrutura

```text
src/
  controllers/   controle das requisições
  db/            conexão com o banco de dados
  middlewares/   tratamento de erros
  repositories/  acesso aos dados
  routes/        rotas da API
  services/      regras de negócio
tests/           testes automatizados
prisma/          schema e migrações
docs/            documentação técnica
```

## Autoria

Projeto individual de Emanuel Sousa.
