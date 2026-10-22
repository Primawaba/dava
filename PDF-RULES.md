# Revisão de regras — PDF e CONQUER

> Referência adicional: [RISE — índice de regras e conflitos](RISE-RULES.md). Este arquivo continua documentando DELVE; não representa sozinho todas as fontes do CONQUER.

A tabela da revisão 1.1 abaixo é histórica; as decisões atuais de conexões, IA e barricadas estão em ADAPTATION.md e na atualização 1.11.0 ao final deste documento.

Referência: `DELVE November 8th Checked Version Pages.pdf`, de Anna Blackwell, fornecido pelo usuário. As páginas abaixo são os números impressos no livreto, não o índice de páginas do leitor de PDF. CONQUER permanece a base para custos, unidades e conteúdo; as alterações explícitas pedidas pelo usuário têm prioridade.

| Fonte | Regra conferida | Implementação na revisão 1.1 |
| --- | --- | --- |
| p. 9, Liquids and gases | Fluxo ocorre ao descobrir, não ao começar combate | Propagação e efeitos resolvidos na descoberta e ao abrir conexões |
| p. 9 | Líquidos alcançam duas células laterais e descem; gases sobem | Fluxo ortogonal, com ocupação persistente e barreiras |
| p. 9 | Escavar de cima para dentro de um reservatório não o derrama | Origem descoberta por cima fica contida; gases sempre se espalham |
| p. 19, formação 2♣ | Veneno derrota imediatamente; gás cegante bloqueia ataques à distância | Tipos têm efeitos separados; gás cegante não mata por envenenamento |
| p. 9 | Gás inflamável explode ao atingir forge, inn ou barracks | Forja, Taverna e Quartel são os gatilhos; todas as salas da nuvem são danificadas |
| p. 43, referência rápida | Magma danifica toda sala inundada; drenagem custa 20♦ | Dano imediato, drenagem e reparo separados |
| p. 43 | Salas inundadas precisam ser drenadas por 5♦ para voltar a funcionar | Sala mantém sua construção, mas perde função enquanto ocupada por perigo |
| p. 43 | Reparar custa metade do valor, arredondada para baixo | Custo de reparo usa divisão inteira inferior |
| p. 16, Pump | Líquido não atravessa nem danifica essa sala | A própria célula bloqueia fluidos; não protege salas vizinhas por proximidade |
| p. 18, barricadas | Defensiva bloqueia tiro e fluidos/gases; ofensiva não | Verificação de fluxo, navegação e linha de tiro respeita a diferença |
| p. 19, cristais | Carta por turno; valor + profundidade; A♦ esgota a descoberta | Produção variável e caverna esgotada transitável, sem novas construções |
| p. 8 e p. 43, Ranged | Alcance de duas salas; mover e atirar são ações separadas | Atiradores terminam o trecho até o centro da sala antes de disparar |
| CONQUER, Progresso na Superfície; pedido do usuário | Superfície não exige exploração; andares precisam de sustentação | Construção direta, custo acrescido de altura, térreo no chão e apoio vertical obrigatório |
| Pedido do usuário | Tiro exige corredor reto, sem aproveitar arredondamento de uma esquina | Teste usa posições contínuas reais; não permite eixos diagonais ou cantos |
| Pedido do usuário | Melhor defesa do portão | Guarnição permanente e interceptação perto do objetivo, sem perseguição global |
| Pedido do usuário | Bloquear recrutamento suicida por motim | Estado vermelho, ação desabilitada e validação da moral prevista antes de cobrar |
| Pedido do usuário | Monstros grandes não devem virar grupos pequenos | Uma entidade para dragão, golem guardião, troll, rainha, verme e elemental |

O combate continua sendo uma adaptação em tempo real com IA. A campanha, os planos condensados e as demais escolhas digitais permanecem descritos em `ADAPTATION.md`. Esta revisão não afirma reproduzir integralmente todas as tabelas de DELVE.

## Coringas: diferença ainda pendente

No DELVE, páginas impressas 33–36, o coringa preto desperta uma Monstruosidade Antiga; o vermelho gera um artefato lendário e pode revelar o Cristal do Vazio. Depois de usados, os coringas ficam fora do baralho por cinco turnos. Nesta versão digital, entram duas cartas iguais na profundidade 5 e ambas concedem recompensa genérica; não há distinção de cores, eventos próprios ou espera de cinco turnos. A vitória atual continua vinculada ao guardião na profundidade 12.

## Criatura invencível — CONQUER.odt, tabela natural, entrada 12

Regra do documento: “Criatura Invencível bloqueando a sala. Pode ser morta apenas por efeitos de morte instantânea (Líquidos, explosões, etc)”. A revisão 1.5.0 implementa uma criatura neutra imóvel, bloqueio de passagem e morte instantânea explícita. Foi retirada a adaptação anterior de aprisionamento por 20♦, que não tinha base nessa regra.

## Revisão solicitada pelo jogador — 1.6.0

Cavernas naturais não recebem dano estrutural; apenas construções são danificadas por magma e explosões. Barricadas, tanto defensivas quanto ofensivas, pertencem a uma passagem e bloqueiam líquidos e gases naquela aresta enquanto intactas. Essas instruções do jogador prevalecem sobre as adaptações digitais anteriores.

## CONQUER — Resquícios 24 e pedidos da revisão 1.7.0

“Masmorra Rival, ocupando 1d10+2 espaços. Compre uma carta para definir o que há em cada espaço, tratando-as como se fossem ♠. [...] Ao fim do combate, obtenha 10♦ para cada espaço [...] (Caso não haja combate, tesouro nenhum é obtido)”. Implementado com revelação automática, uma origem por passagem e defensores do mesmo lado. No limite físico do mapa a geração preserva salas existentes.

Resquícios 10: o golem da forja só inicia combate quando atacado, agora por ação explícita. Resquícios 9: a checagem por turno do portal não deve depender da produção ou ligação à base. Nesta adaptação a estabilização permite expedições; só selar interrompe as invasões. Os pedidos do jogador adicionam bloqueio 3×3 da câmara selada, abertura automática por dano, duas fases visuais do dragão e escala grande para golems aliados e cerco.

## Atualização 1.11.0: múltiplas casas

| Fonte | Tamanho ou relação aplicada | Decisão digital |
| --- | --- | --- |
| PDF pp. 11–16; CONQUER, Museu/Templo | Museu e Templo: 2; Criadouro: 4 | Área atômica, custo e capacidade únicos; módulos conectados e reparáveis |
| PDF pp. 19–20; CONQUER, Naturais 4–8 | Rio, magma, lago, cristal e cratera | Tipos permanentes; rio/fluxo até 5 casas pelo ODT; lago/poço 1d4; cristal 1d2; cratera vertical até y=30 |
| CONQUER, Naturais 7/17/19 | Ninho 1d2, termas/colmeia 1d4 | STR por área; termas +2 moral/casa; rainha adicional ao ocupar 4 |
| PDF pp. 21–22; CONQUER, Resquícios 1/5/8/13/14/17/19 | Vila, mina, biblioteca, covil, elevador, cidade e labirinto | Geração contínua tipada sem nova carta; mina usa a maior profundidade; shaft vertical |
| CONQUER, Resquício 24 | Masmorra rival 1d10+2 | Preservado o gerador próprio; cada carta interna ocupa uma casa e não infla recursivamente o tamanho |
| Pedido atual do usuário | Fontes nunca drenáveis; somente pontes | Prevalece sobre as regras genéricas de drenagem de salas inundadas |
| Pedidos atuais do usuário | Cavernas 89/7/3/1%; covis por força; porta cobre encaixe | Exceções de design mantidas e testadas |

As tabelas completas de magias, Wyrd, invenções, artefatos e condições dos planos ainda têm simplificações digitais; a presença de uma arte ou de uma área maior não implica implementação integral de seus efeitos. O relatório solicitado fará essa distinção por mecânica.
