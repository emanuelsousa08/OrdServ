# Teste de Desempenho

## Objetivo

Realizar um smoke test da API OrdServ utilizando o k6, verificando a disponibilidade dos endpoints e medindo o tempo de resposta das requisições HTTP.

## Configuração do teste

- Ferramenta: k6.
- Ambiente: execução local.
- Usuários virtuais: 1.
- Duração: 10 segundos.
- Endpoint de saúde: `GET /api/health`.
- Endpoint principal: `GET /api/ordens-servico`.

## Critérios de aceitação

- Percentil 95 (p95) inferior a 500 ms.
- Taxa de requisições com falha inferior a 1%.
- Taxa de verificações (checks) superior a 99%.

## Resultados

**Data:** 11/11/2026.

| Métrica                  |    Resultado |
| ------------------------ | -----------: |
| Requisições HTTP         |           20 |
| Iterações concluídas     |           10 |
| Checks aprovados         | 100% (40/40) |
| Requisições com falha    |           0% |
| Tempo médio de resposta  |     11,75 ms |
| Tempo máximo de resposta |    188,68 ms |
| p90                      |      4,32 ms |
| p95                      |     20,39 ms |

## Conclusão

O smoke test foi executado com sucesso. Todos os checks foram aprovados e não foram registradas falhas nas requisições.

O p95 medido foi de 20,39 ms, abaixo do limite estabelecido de 500 ms.

Os resultados demonstram que os endpoints testados responderam corretamente durante a execução do teste.

**Observação:** este teste representa uma verificação básica de desempenho em ambiente local, com apenas um usuário virtual. Não caracteriza um teste de carga ou estresse, nem permite concluir como a aplicação se comportaria sob alta concorrência.
