# Eventos periódicos — 1.22.0

O mesmo agendamento de 5–8 turnos agora sorteia um evento, em vez de sempre gerar bandidos. Continua sendo resolvido na exploração real da fortaleza, junto dos efeitos da descoberta; esperar ou abrir apenas uma passagem conhecida não consome o evento. O calendário de salvamentos anteriores é preservado.

São chances iguais entre os tipos disponíveis. Andarilhos estão sempre disponíveis. Bandidos exigem um local válido, quebra de barragem exige uma frente capaz de avançar e desabamento exige uma caverna elegível. Não se sorteia um evento sem alvo para gastar o intervalo sem efeito.

## Bandidos

Mantêm 15 STR por combatente e dimensionamento pela profundidade válida para surgimento. Crateras e outros espaços inválidos continuam excluídos.

## Quebra de barragem

Escolhe uma frente atualmente afetada por água, magma ou gás e avança por até dois espaços adicionais, sorteados entre continuações possíveis. A frente pode se ramificar. Não abre corredores nem atravessa paredes.

Preserva as regras existentes: líquidos descem ou avançam lateralmente, gases sobem ou avançam lateralmente; o plano de gravidade diferente mantém sua exceção. Portas reforçadas e passagens fechadas contêm o avanço. Pontes e bombas fechadas mantêm a proteção contra líquidos, e uma drenagem que bloqueia a origem continua respeitada. A proteção normal de uma ponte contra líquidos não a torna imune a gás. Água transformada pela camada vulcânica, dano de magma, mortes ambientais e explosão de gás inflamável são aplicados normalmente. O resultado persiste no salvamento.

## Desabamento

O primeiro alvo é uma caverna vazia, sem uma ligação direta aberta para uma construção. Extensões de chefes, construções, cavernas especiais e cavernas esgotadas não são tratadas como cavernas vazias.

O desabamento continua pela caverna vazia imediatamente abaixo se existe uma passagem vertical. Repete sem limite de cadeia arbitrário, até encontrar uma interrupção ou proteção. Uma construção comum vizinha impede a escolha inicial quando ligada por passagem; a propagação vertical segue a regra das cavernas vazias. Pilares são a proteção explícita contra toda a cadeia.

**Pilares protegem seu próprio espaço e as quatro casas ortogonais vizinhas, mesmo sem ligação por corredor.** Essa proteção impede o primeiro alvo e interrompe uma cadeia descendente. Construção subterrânea já era permitida e continua exigindo Alvenaria/Pedraria e seu custo normal. A carta informa a dica dos pilares.

As salas atingidas viram escombros permanentes, com três novas ilustrações de 128×86 pixels. Não podem ser atravessadas, construídas nem escavadas, e interrompem linhas de tiro e propagação ambiental. Unidades e NPCs presentes morrem. Corpos soterrados não reanimam dentro do obstáculo. Partes da fortaleza podem perder a conexão. Domínios de ocupação deixam de contar os espaços destruídos. Pilares e salas construídas não viram escombros por esse evento.

## Andarilhos

Uma carta com decisão obrigatória guarda o tamanho do grupo (3–5) no salvamento.

- **Acolher:** adiciona esse número de capangas leais com abrigo no portão de entrada. A moral global cai 2, uma única vez. Eles usam o comportamento normal dos defensores e podem sair do portão para engajar ameaças.
- **Recusar:** tem 50% de chance de uma invasão pelo espaço válido mais profundo. A tropa hostil usa o mesmo tamanho de grupo e a força normal de capangas. A outra possibilidade é partir sem combate. Recusar não altera a moral.

A escolha e todos os resultados são comunicados por cartas, que aguardam resolução antes da simulação de combate. A perda de moral ainda pode causar motim entre outras tropas não leais.

## Arte e verificação

As três artes de escombros foram geradas para o projeto, com paleta e acabamento compatíveis com as cavernas atuais. Fonte: `art/world-events/collapse-source.png`. `npm run build:collapse-art` recorta, reduz sem suavização e limita a paleta; não altera as cavernas anteriores.

Testes cobrem o calendário, seleção, propagação protegida e persistente, explosões, bloqueios por escombros, mortes, cadeias e pilares vizinhos, construção subterrânea e as duas escolhas dos andarilhos. O fluxo de navegador inclui desktop, toque e HTML offline; o pacote PC é verificado depois de extraído.

Validação concluída: **440 testes de regras**, **21 verificações gerais de navegador**, os eventos em desktop/toque/HTML offline e o pacote PC extraído passaram. As 765 imagens de execução do renderizador foram carregadas, incluindo as três artes novas. O teste portátil usa interceptação dos arquivos extraídos com a rede desligada porque a política deste ambiente bloqueia navegação file://.
