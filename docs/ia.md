# Uso de Inteligência Artificial

## Ferramenta utilizada

ChatGPT.

Durante o desenvolvimento do OrdServ, utilizei o ChatGPT em diferentes etapas do projeto, desde a análise dos requisitos até a implementação, os testes e a documentação.

A ferramenta teve participação ativa na elaboração de soluções e na produção de partes do código, conforme as necessidades que surgiram ao longo do trabalho.

## Prompts relevantes

A seguir, estão alguns dos principais prompts utilizados durante o desenvolvimento. Eles representam as solicitações feitas para orientar a análise, a implementação e a validação dos diferentes requisitos do projeto.

### 1. Análise dos requisitos e planejamento

> Analise os requisitos do Projeto B e compare com o estado atual do projeto OrdServ. Identifique o que já foi atendido e o que ainda precisa ser implementado, sem propor funcionalidades fora do escopo solicitado pelo professor.

### 2. Arquitetura e padrões de projeto

> Analise a estrutura do projeto e verifique se a separação entre controllers, services e repositories está adequada. Avalie a aplicação do SOLID e identifique qual padrão de projeto está efetivamente implementado, sem atribuir características que não estejam presentes no código.

### 3. Testes e cobertura

> Revise a configuração do Vitest e os testes unitários e de integração. Verifique se os testes cobrem as regras de negócio, se a integração percorre as camadas da aplicação e se os limites mínimos de cobertura estão configurados corretamente.

### 4. Integração contínua e operação

> Analise o workflow do GitHub Actions e verifique se ele executa instalação das dependências, validação, lint e testes. Revise também a configuração de logs estruturados e as variáveis de ambiente necessárias para executar a aplicação.

### 5. Métricas e SLO

> Oriente a implementação de uma métrica HTTP no formato Prometheus e a definição de um SLO simples de disponibilidade. Considere as limitações de uma aplicação sem armazenamento histórico de métricas.

### 6. Documentação técnica

> Com base no código-fonte, ajude a elaborar o README, o ADR e a especificação OpenAPI. Documente somente os endpoints, campos, validações e respostas que realmente existem na aplicação.

### 7. Teste de desempenho

> Oriente a criação de um smoke test utilizando k6 para verificar os endpoints da API e medir o percentil 95 (p95) do tempo de resposta. Ajude a interpretar os resultados reais e documentar as evidências, sem inventar métricas.

## Participação no desenvolvimento

O ChatGPT não foi utilizado somente para tirar dúvidas. Ao longo do projeto, também contribuiu diretamente com a elaboração de trechos de código, configurações, testes automatizados, métricas e documentação.

Minha participação consistiu em apresentar os requisitos, fornecer o contexto do projeto, direcionar o desenvolvimento, analisar as sugestões, realizar as alterações no ambiente de trabalho e executar os testes para verificar os resultados.

O desenvolvimento aconteceu de forma colaborativa, com a inteligência artificial auxiliando na produção técnica, enquanto as decisões e validações foram conduzidas por mim durante o processo.
