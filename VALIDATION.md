# Validação da entrega

## Edição de teste em arquivo único

`releases/CONQUER-Jogar.html` reúne código, estilos, fontes e todas as imagens em um HTML autônomo, sem módulos externos e sem service worker. `npm run build:standalone` reproduz o arquivo e seu SHA-256.

`npm run test:standalone` aprovou 7 verificações: recursos embutidos, 273 imagens de salas, 33 sprites e 9 módulos de passagens, nova campanha com exploração/construção/recrutamento, persistência após recarga, exportação/importação, combate automático real, viewport com toque de 390px e ausência de exceções ou requisições de rede externas. Relatório em `artifacts/standalone-results.json`.

A política administrativa deste Chromium bloqueia navegações `file://`. A suíte registra esse limite e testa o mesmo HTML em uma navegação de loopback interceptada pelo Playwright, sem servidor ou recursos externos, com a rede desativada. Portanto, a execução do HTML foi validada, mas a navegação direta por `file://` não pôde ser homologada neste navegador gerenciado. O arquivo foi inspecionado para confirmar que não contém imports, scripts ou assets locais dependentes de servidor.

## Revisão 1.1 — regras e pixel art

Além das 21 verificações gerais, **8 verificações da revisão** foram aprovadas no navegador: construir na superfície sem carta, recusar andares sem apoio, bloquear recrutamento em vermelho, reabilitar recrutamento após festival, renderizar salas em pixel art e monstros grandes, drenar construção preservando tipo/dano, operar o painel por toque e ausência de exceções. Resultado em `artifacts/revisions-browser-results.json`.

Os testes de motor adicionados verificam guarnição, movimento ortogonal sem oscilação, rotas alternativas, tiro sem arredondamento de esquinas, perigos imediatos fora de combate, direção de descoberta de líquidos, drenagem/reparo, tipos de inimigos, monstros indivisíveis, sprites distintos, conversão de saves anteriores, produção de cristais e integridade de atributos visuais importados.

As capturas `revision-surface.png`, `revision-red-recruitment.png`, `revision-pixel-art-and-monsters.png` e `revision-mobile-recruitment.png` documentam os novos comportamentos. Atlas de origem gerados e PNGs exportados são mantidos no repositório; o build web exclui os atlas brutos porque usa somente os recortes prontos.

Uma medição sintética com 50 salas e 43 unidades na máquina de teste passou de aproximadamente 23 para 3 ms por atualização da simulação após reutilizar rotas dentro do mesmo frame. Isso não constitui homologação de FPS em aparelhos físicos.

## Resultados executados

- **50 testes do motor aprovados**, sem falhas ou testes ignorados.
- **21 verificações de navegador aprovadas**, sem exceções JavaScript não tratadas.
- Verificação direcionada adicional aprovada: salvar pelo menu inicial, salvar após reiniciar o navegador e layout mobile desse menu. Resultado em `artifacts/title-save-results.json`.
- Build estático: 321 arquivos mais o service worker.
- 90 tipos de sala, 41 construções, 15 unidades, 13 expedições, 273 ilustrações PNG de sala/terreno e 33 sprites PNG.

O relatório completo da execução de navegador está em `artifacts/browser-results.json`. As capturas `01` a `11` registram menu, fortaleza, corredores, combate, regras, telas mobile, vitória e derrota.

## Motor

Cobertura: inicialização e semente; 52 cartas e coringas; todas as 16 conexões de corredores; exploração protegida no primeiro andar; fronteiras e conectividade; custos e pré-requisitos; capacidade compartilhada de recrutamento; desconto de oficina; limites de estoque; troca; motins; propagação de água e gás; drenagem e ponte; linha de visão; combate por IA e projéteis; pausa; derrota; Hospital; saves em combate; rejeição de saves inválidos; vitória do guardião; tomada e reconexão sem falsa vitória; explosão de gás; câmara imortal; prisioneiro antigo; importação adulterada; expedições; integridade das três artes de cada sala; batalhas em 20 sementes.

## Navegador

Executado com Chromium do sistema em Linux, via Playwright:

| Contexto | Verificação |
| --- | --- |
| Desktop 1440×1000 | Menu, arte, campanha nova, tutorial, exploração, construção, recrutamento, saves e carregamento |
| Combate real | Invasores e defensores por IA, projéteis, pausa sem avanço de relógio, retomada, resolução, vitória contra o guardião e derrota do portão |
| Persistência | Recarregar o navegador, continuar campanha, importar/exportar JSON, opções e redução de movimento |
| Offline | Service worker ativo, rede desabilitada, recarga completa e retomada de campanha |
| Mobile 390×844, toque emulado | Menu, campanha, exploração, construção, recrutamento, painel, zoom e ajuda |
| Mobile horizontal 844×390 | Layout sem overflow horizontal |
| Mobile 360×640 | Mapa utilizável e ausência de overflow horizontal |
| Todos | Nenhuma exceção JavaScript não tratada |

Foram observados e corrigidos durante a validação: navegação offline da raiz com parâmetros; passagens verticais que não recortavam totalmente a borda inferior; vitória indevida ao isolar o guardião; retomada de invasão em salas reconectadas; validação de unidades caídas e valores de velocidade/expedição em saves.

## Limites

Não testado em aparelhos físicos, Safari, Firefox, lojas ou leitores de tela com usuários. Não há certificação de desempenho em dispositivos de baixo custo nem estudo de balanceamento com jogadores. Não foram gerados instaladores nativos. Consulte `ADAPTATION.md` para as regras condensadas e diferentes das referências.

O pacote web e seu checksum são gerados por `scripts/release.mjs`. O servidor de desenvolvimento e o build foram executados localmente; nenhum serviço externo recebeu publicação.

## Revisão 1.1.1 — passagens em pixel art

`npm run test:passages` aprovou 6.144 amostras de faixa interna opaca nas 16 combinações de conexão, em zoom 0,5 / 1 / 1,5 / 2, sem exceções. As amostras cobrem entradas, repetições horizontais e poços verticais; os nomes ficam fora dos poços. Captura geral das combinações: `artifacts/passages-16-masks.png`. A captura de fortaleza foi revisada visualmente. Os 50 testes do motor, 21 verificações gerais de navegador e 7 verificações do HTML autônomo também passaram nesta revisão.

## Revisão 1.2.0 — geração procedural adaptada às salas

`npm run test:passages` aprovou 200 combinações de materiais/orientação (10 × 10 × 2), com faixa central opaca, dez resultados visuais distintos na galeria de transições, cache com limite e reutilização, atualização ao construir/inundar, retorno ao visual anterior após drenagem, geração determinística, animação de água e congelamento por movimento reduzido. Também aprovou as 6.144 amostras das 16 máscaras em quatro níveis de zoom. Capturas em `artifacts/procedural-materials-desktop.png` e `artifacts/procedural-materials-mobile.png`; nenhuma rolagem horizontal na viewport de 390px. A captura desktop foi revisada visualmente.

Canvas 2D realiza o processamento de máscara, distorção, materiais e iluminação em baixa resolução; não foi introduzida dependência de WebGL. A validação de navegador é feita em Chromium, incluindo emulação mobile; não representa homologação em todos os aparelhos físicos.

## Revisão 1.3.0 — setas, passagens explícitas e portas

- **63 testes do motor aprovados**: 50 cenários anteriores com ligações explicitamente abertas em seus fixtures, mais 13 cenários que usam o motor real sem conexões automáticas. Cobrem origem escolhida, destino ambíguo, parede entre salas vizinhas, abertura posterior sem nova sala/carta/recurso, turno, tiros sem atravessar paredes, líquidos e gases, explosão isolada, construção na superfície, bloqueios por combate, persistência, migração e rejeição de grafos inválidos.
- **8 verificações direcionais no navegador**: clique imediato na seta; descoberta adjacente sem atalho; ausência de corredor atrás da seta de abertura; conexão posterior sem descoberta/recompensa; save; escolha de origem por teclado; toque em viewport de 390px; ausência de exceções. Relatório `artifacts/directions-results.json`.
- **3.264 amostras de continuidade** nas 16 máscaras e quatro zooms para os novos corredores curtos; 200 pares de materiais/orientação e três casos arquitetônicos. Tocha animada somente entre duas salas construídas, além do teste de movimento reduzido.
- Capturas `directions-before-opening.png`, `directions-after-opening.png`, `directions-mobile.png` e `doorway-architecture-cases.png` documentam a interação e o acabamento. Casos arquitetônicos e setas foram revisados visualmente.

O teste de seleção na superfície também cobre mudanças de câmera: o hit-test das setas calcula a posição atual, mesmo antes do próximo frame. Os limites de homologação do navegador e de `file://` continuam descritos acima.

Na compilação final 1.3.0 também passaram as **21 verificações gerais do navegador**, **8 verificações da revisão anterior** e **7 verificações do HTML autônomo**. O HTML único e o build web incluem o novo grafo de passagens, os controles direcionais e as portas com acabamento contextual.

## Revisão 1.3.1 — magma perto do portão

66 testes do motor aprovados. Os novos casos forçam as duas origens de magma (4♣ com resultado lava e 8♣/cratera), em ambos os lados e no centro da faixa inicial, verificando sala segura, ausência de contaminação/dano ao portão e sobrevivência dos guardas. Casos de fronteira confirmam que magma/cratera continuam possíveis fora de dois espaços laterais e na segunda camada. O cenário de drenagem/reparo de magma foi deslocado para a segunda camada para continuar verificando o perigo real.

## Revisão 1.4.0 — símbolos de ganho e contador progressivo

**69 testes do motor aprovados.** Novos testes verificam os valores de ganho emitidos após limite de estoque, ausência de ganho para perdas, persistência imediata do saldo e as duas direções de troca.

**10 verificações de navegador para as recompensas:** exatamente 14 copas partem da carta enquanto o contador permanece em 20; o valor passa por números intermediários; termina em 34 sem partículas restantes; 14 ouros chegam ao placar de riquezas; limite do estoque gera somente três partículas quando só há três vagas; recompensas sobrepostas e gasto durante o voo terminam no saldo correto; carregar cancela efeitos antigos sem duplicar ganhos; movimento reduzido elimina o voo; toque em 390px funciona sem interceptação ou overflow; ausência de exceções. Relatório em `artifacts/resource-flights-results.json`.

Capturas `resource-hearts-in-flight.png` e `resource-flights-mobile.png`. A captura desktop foi revisada visualmente. O teste controla o relógio do navegador para conferir a quantidade antes da primeira chegada e o valor durante a animação.

A compilação final 1.4.0 também aprovou as 21 verificações gerais do navegador e as 7 verificações do HTML autônomo offline.

## Revisão 1.4.1 — túnel do escavador

71 testes do motor aprovados. A carta J♣ é forçada na linha do portão e primeira camada, do limite oeste ao leste (incluindo posições além da faixa protegida de magma): revela caverna, não deixa recompensa de combate pendente, não gera inimigo e preserva os guardas. Na segunda camada, o túnel e seu verme único continuam sendo gerados.
