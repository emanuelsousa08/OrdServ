# ADR 0001: Adoção do Repository Pattern

- **Status:** Aceito
- **Data:** 11/11/2026

## Contexto

A aplicação OrdServ utiliza o Prisma ORM para realizar operações de persistência no PostgreSQL.

Para manter a organização do código e separar as responsabilidades, a aplicação foi estruturada em camadas:

- **Routes:** definem os endpoints da API.
- **Controllers:** recebem as requisições HTTP e coordenam as respostas.
- **Services:** concentram as regras de negócio e validações.
- **Repositories:** centralizam as operações de acesso aos dados.
- **Database:** disponibiliza a conexão com o banco por meio do Prisma.

Era necessário evitar que as regras de negócio ficassem diretamente acopladas às operações de persistência.

## Decisão

Adotar o **Repository Pattern**, mantendo as operações de acesso ao banco de dados em uma camada específica de repositórios.

No OrdServ, o service de ordens de serviço utiliza o repository para consultar, cadastrar e atualizar registros, sem executar diretamente as operações do Prisma.

Os controllers, por sua vez, delegam o processamento das requisições aos services.

## Consequências

### Positivas

- Separação clara entre regras de negócio e persistência.
- Centralização das operações realizadas no banco de dados.
- Maior facilidade para testar os services utilizando repositórios simulados (mocks).
- Organização e manutenção do código facilitadas.

### Trade-offs

- A arquitetura possui mais arquivos e camadas do que uma implementação direta.
- Alterações em determinadas operações podem exigir ajustes em mais de uma camada.
- O repository atual utiliza o Prisma diretamente, portanto a implementação ainda possui dependência dessa tecnologia.

## Referências

- Código-fonte: `src/services/ordemServico.service.js`
- Repositório: `src/repositories/ordemServico.repository.js`
- Controller: `src/controllers/ordemServico.controller.js`
