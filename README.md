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

Node.js, Express 5, Prisma ORM, PostgreSQL 16, Docker, Swagger UI, OpenAPI 3.1, Vitest, Supertest, ESLint, Pino, Prometheus e GitHub Actions.

## Como rodar

### Pré-requisitos

- Docker Desktop instalado e em execução.
- Git, para clonar o repositório.
- Node.js 24, necessário apenas para executar a API localmente, fora do Docker.

### Obter o projeto

Clone o repositório e acesse a pasta:

```bash
git clone https://github.com/emanuelsousa08/OrdServ.git
cd OrdServ
```

### Configuração

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure as variáveis de ambiente, incluindo a senha do PostgreSQL e a `DATABASE_URL`.

### Opção 1: Executar com Docker Compose

Construa a imagem e inicie os serviços:

```bash
docker compose up -d --build
```

O Docker Compose inicia:

- PostgreSQL 16;
- API OrdServ.

A API executa as migrações pendentes do Prisma durante sua inicialização.

Verifique o estado dos serviços:

```bash
docker compose ps
```

Para acompanhar os logs:

```bash
docker compose logs -f
```

Para encerrar os serviços:

```bash
docker compose down
```

Os dados do PostgreSQL são armazenados em um volume Docker nomeado, preservando a persistência entre recriações dos containers. O comando `docker compose down` não remove esse volume.

### Opção 2: Executar localmente

Instale as dependências:

```bash
npm ci
```

Inicie somente o banco de dados:

```bash
docker compose up -d db
```

Gere o Prisma Client e execute as migrações:

```bash
npx prisma generate
npx prisma migrate deploy
```

Inicie a API em modo desenvolvimento:

```bash
npm run dev
```

Ou em modo produção:

```bash
npm start
```

A API ficará disponível em `http://localhost:3000`.

## Documentação da API

A documentação interativa é disponibilizada pelo Swagger UI:

`http://localhost:3000/api-docs/`

A especificação OpenAPI 3.1 está disponível em:

[`docs/openapi.yaml`](./docs/openapi.yaml)

A documentação contempla os seis endpoints da aplicação, incluindo parâmetros, schemas, requisições e respostas.

## Como testar

Executar os testes automatizados:

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

## Testes de desempenho

O projeto possui um smoke test desenvolvido com k6 para verificar os endpoints da API e medir o tempo de resposta.

Os resultados e as instruções de execução estão documentados em [`docs/desempenho.md`](./docs/desempenho.md).

## Endpoints

| Método | Rota                             | Descrição                                    |
| ------ | -------------------------------- | -------------------------------------------- |
| GET    | `/api/health`                    | Verifica o funcionamento da API              |
| GET    | `/api/health/db`                 | Verifica a conexão com PostgreSQL            |
| POST   | `/api/ordens-servico`            | Cadastra uma ordem de serviço                |
| GET    | `/api/ordens-servico`            | Lista todas as ordens                        |
| GET    | `/api/ordens-servico/:id`        | Consulta uma ordem por ID                    |
| PATCH  | `/api/ordens-servico/:id/status` | Atualiza o status de uma ordem               |
| GET    | `/metrics`                       | Disponibiliza métricas no formato Prometheus |

## Exemplos de uso

Os exemplos a seguir utilizam `curl` e consideram a API em execução local na porta 3000.

### Verificar a disponibilidade da API

```bash
curl http://localhost:3000/api/health
```

### Verificar a conexão com o banco de dados

```bash
curl http://localhost:3000/api/health/db
```

### Cadastrar uma ordem de serviço

```bash
curl -X POST http://localhost:3000/api/ordens-servico \
  -H "Content-Type: application/json" \
  -d '{
    "numero": "OS-001",
    "cliente": "Cliente Exemplo",
    "equipamento": "Computador",
    "problema": "Computador não inicia",
    "telefone": "88999999999",
    "marcaModelo": "Dell OptiPlex",
    "diagnostico": "Aguardando análise",
    "valor": 150
  }'
```

A resposta apresenta os dados da ordem cadastrada, incluindo seu ID e status inicial.

### Listar ordens de serviço

```bash
curl http://localhost:3000/api/ordens-servico
```

### Consultar uma ordem pelo ID

Substitua `1` pelo ID retornado no cadastro:

```bash
curl http://localhost:3000/api/ordens-servico/1
```

### Atualizar o status de uma ordem

```bash
curl -X PATCH http://localhost:3000/api/ordens-servico/1/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "EM_EXECUCAO"
  }'
```

Os valores permitidos são `EM_ANALISE`, `EM_EXECUCAO` e `CONCLUIDA`.

### Consultar métricas

```bash
curl http://localhost:3000/metrics
```

A resposta apresenta as métricas no formato de exposição do Prometheus, incluindo `http_requests_total`, que contabiliza as requisições HTTP por método e código de resposta.

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
Dockerfile       imagem da API
docker-compose.yaml  serviços da aplicação
.dockerignore    arquivos ignorados no build
```

## Demonstração online

A aplicação está hospedada no Render e pode ser acessada pelos seguintes endereços:

| Recurso | Endereço |
| --- | --- |
| API REST | https://ordserv-api.onrender.com |
| Documentação interativa (Swagger UI) | https://ordserv-api.onrender.com/api-docs/ |
| Health check da API | https://ordserv-api.onrender.com/api/health |
| Health check do PostgreSQL | https://ordserv-api.onrender.com/api/health/db |
| Métricas Prometheus | https://ordserv-api.onrender.com/metrics |

### Limitações do ambiente de demonstração

> **Aviso:** esta implantação possui finalidade exclusivamente acadêmica e demonstrativa. A aplicação não deve ser considerada um sistema destinado à operação em ambientes reais de produção.

A hospedagem utiliza os recursos gratuitos do Render, que possuem algumas limitações:

- **Suspensão por inatividade:** o serviço da API entra em suspensão após 15 minutos sem receber requisições. A primeira chamada após esse período pode levar cerca de um minuto para responder, devido à inicialização do serviço.
- **Persistência do banco de dados:** a instância gratuita do PostgreSQL possui validade de 30 dias a partir de sua criação. Portanto, a permanência dos registros não é garantida indefinidamente.
- **Disponibilidade:** não há garantia de funcionamento contínuo, pois o serviço está sujeito às limitações do plano gratuito.
- **Armazenamento local:** o sistema de arquivos do serviço da API é efêmero. Os dados da aplicação são armazenados no PostgreSQL, não nesse armazenamento local.

Essas limitações são próprias da infraestrutura gratuita utilizada para disponibilizar a demonstração e não representam garantias de disponibilidade, persistência ou continuidade operacional de um ambiente de produção.

## Autoria

Projeto individual de Emanuel Sousa. Confira em [`CONTRIBUTORS.md`](./CONTRIBUTORS.md).
