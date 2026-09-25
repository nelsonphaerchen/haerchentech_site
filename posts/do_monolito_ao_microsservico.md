---
title: Do Monolito ao Microsserviço
date: 2026-09-25
description: Por Que Todo DevOps Deveria Aprender System Design
---

# Do Monolito ao Microsserviço: Por Que Todo DevOps Deveria Aprender System Design

Com a chegada das ferramentas de IA, o dia a dia de quem trabalha com infraestrutura e DevOps mudou drasticamente. Tarefas que antes consumiam uma semana inteira — como escrever scripts de Terraform e Ansible ou configurar pipelines de CI/CD manualmente — hoje são resolvidas em meio dia.

Claro que a IA não faz milagres sozinha: sem conhecimento técnico prévio para escrever bons prompts e validar o código gerado, você corre o risco de criar recursos fantasmas ou deletar e reiniciar serviços críticos por engano. Mas, quando usada com critério, a IA libera algo valiosíssimo: **tempo**.

E a pergunta que fica é: o que fazer com esse tempo livre?

---

## Por que decidi estudar System Design?

Em vez de apenas preencher a rotina com mais tarefas repetitivas, resolvi investir em algo que costuma ser negligenciado no universo de infraestrutura: **System Design** (Design de Sistemas).

Você pode pensar: *"Mas System Design não é coisa de desenvolvedor?"*

Sim e não. Afinal, a própria sigla DevOps une *Dev* e *Ops*. Entender como as aplicações são construídas por dentro nos ajuda a enxergar muito mais longe. Para colocar isso em prática, comecei a desenvolver minhas próprias aplicações usando **Python, FastAPI e React**. Nada mirabolante, apenas o necessário para dominar a ponte entre código e infraestrutura.

Foi aí que os dilemas arquiteturais começaram a aparecer.

---

## O Dilema: Projetar o Futuro sem Falir no Presente

Quando comecei a estruturar meu projeto, vieram os questionamentos:
* Faço um monolito ou divido em microsserviços?
* Preciso de um servidor único ou múltiplos servidores?
* Vale a pena colocar uma camada de cache com Redis na frente do banco logo de início?

Minha meta era construir uma ferramenta capaz de suportar **100 mil usuários no futuro**, mas que no presente mal tinha **um** usuário (eu mesmo). 

Se eu montasse uma estrutura gigante desde o primeiro dia — com múltiplos microsserviços, cluster Kubernetes multizona e Redis na frente do banco —, eu teria uma fatura altíssima na nuvem para atender requisições praticamente nulas. Seria a clássica armadilha da otimização prematura.

---

## Monolito Consciente: O Meio-Termo Perfeito

A solução para esse dilema foi adotar o conceito de **Monolito Consciente**:

1. **Visão de Microsserviço no Código:** Separe claramente o *frontend* do *backend*, use chamadas via API REST e utilize um banco de dados externo completo (evitando soluções temporárias como SQLite se a intenção for escalar).
2. **Infraestrutura de Monolito na Execução:** Rode tudo em uma única máquina simples enquanto a demanda for baixa.

Dessa forma, você não investe pesado em infraestrutura agora, mas deixa o sistema completamente preparado para quando a migração for necessária. Quando a carga aumentar, bastará faturar a transição: separar os serviços de frontend e backend, adicionar um *load balancer*, criar réplicas do banco de dados e inserir a camada de cache. 

Tudo isso **sem precisar reescrever uma linha de código**.

---

## O Verdadeiro Valor do DevOps no Design de Arquitetura

Historicamente, quando a definição de infraestrutura fica inteiramente nas mãos de quem só programa, é comum surgirem pedidos como *"precisamos de um Redis aqui"* sem uma análise real de latência ou necessidade.

Quando o profissional de DevOps domina *System Design*, ele ganha voz ativa para:
* **Reduzir custos:** Evitando o provisionamento desnecessário de clusters e serviços caros.
* **Garantir escalabilidade saudável:** Planejando o crescimento de forma sustentável e previsível.
* **Decidir com base em dados:** Questionando o *porquê* e o *para quê* de cada componente antes de aprovar a arquitetura.

---

## Conclusão

Não tente resolver problemas de escala que você ainda não tem. Mas **nunca deixe de planejar** a sua aplicação para o momento em que esses problemas surgirem. 

Aprender *System Design* muda a forma como enxergamos o ciclo de vida do software e a relação entre infraestrutura e código. Se você trabalha com DevOps, fica a recomendação: estude arquitetura de sistemas e entenda como cada peça do quebra-cabeça se encaixa. O seu bolso (e o da sua empresa) agradecem!