# Reconstrução de CONQUER

O motor e a interface são novos. Reutilizam-se os dados de conteúdo conferidos e as ilustrações aprovadas, incluindo cavernas e passagens anteriores à versão 1.15. Nenhum instalador de protótipos ou estado de interface do motor anterior participa do novo jogo.

Decisões expressas do usuário prevalecem sobre CONQUER, DELVE e RISE. Os documentos são referências de design.

Contratos obrigatórios:
- Um comando de exploração produz exatamente um plano de descoberta, aplicado atomicamente. Portal planar é singleton; somente Passagem Profunda/Portais Gêmeos produzem um par explícito.
- Salas, áreas e passagens são entidades distintas. Adjacência não cria uma conexão. Toda navegação, tiro e fluxo usa o mesmo grafo.
- Renderização não pode alterar o estado do jogo, consumir RNG ou criar conteúdo.
- Eventos e escolhas são uma fila persistente. Descoberta, cartas, recursos e efeitos terminam antes do combate; derrota anima antes da carta de evento.
- Regras consultam definições de área, nunca inferem o conteúdo de extensões a partir da aparência.
- Sem recrutar para motim imediato; tolerância local é separada da moral global.
- Três gemas; inimigos removidos na derrota, cinco guardiões restaurados. Derrota contra o Cristal do Vazio é definitiva.
- Fontes de fluido indrenáveis; pontes mantêm a fonte. Crateras não substituem salas existentes. Barricadas barram fluidos e gases.
- Guardiões bloqueiam a área inteira; criaturas grandes são entidades únicas. Escavadores primeiro abrem um túnel ascendente.
- Construções na superfície exigem apoio. Construções maiores exigem escolha de continuidade.
- NPCs não são tropas. Profissionais retornam à oficina pelos corredores; recurso recebe 2–3 trabalhadores.
- PC/mobile, salvamento, carregamento, opções, exportação de fortaleza e HTML autossuficiente.

A publicação depende de testes de regras, geração repetida, invariantes, fluxos reais de interface, partida até o fim e distribuição offline.
