# CONQUER 1.15.0

A atualização reúne o relatório de teste e a reconstrução do sistema de cavernas e tint.

## Cavernas e materiais

- Autotiling por bitmask: quatro passagens cardinais e quatro cantos condicionais, normalizados nas 47 configurações usuais de blob tiling. Vizinhança sem passagem nunca abre uma parede. Cantos amplos exigem as ligações do circuito e uma formação compartilhada.
- Geometria calculada em pixels, com campo de distância e portas padronizadas. Bordas usam ruído determinístico em coordenadas do mundo, compartilhado pelas peças. Nenhuma ilustração é deformada para alcançar outra.
- Três novas pinturas de cavernas vazias; ilustrações específicas das demais descobertas preservadas. Peças ocupam a célula de 180×144, com paredes, chão e encaixes gerados juntos. Salas de pintura completa e crateras conservam seus renderizadores próprios.
- As junções que tocam cavernas usam a nova geometria. Transições para construções recebem alvenaria na metade construída e rocha na metade natural. Portas, grades e armadilhas continuam associados às passagens reais.
- Tint procedural por pixel: interpolação suave de paletas nas bordas conectadas, contaminação com transição de profundidade, luzes locais com queda suave e pulsação. O mesmo avaliador colore a arte existente, sem retângulos de cor sobre o mapa. Luzes são indexadas por região e resultados usam caches limitados.
- A implementação funciona como um fragment shader em software, sobre Canvas 2D. Não exige WebGL nem recursos externos no HTML offline. Movimento reduzido estabiliza os efeitos.

## Correções do relatório

- Mineiros e lenhadores refeitos em pixel art sépia. Os seis sprites usam transparência real com alfa binário; o exportador não remove destaques claros do interior dos personagens. Grupos persistentes de 2–3 profissionais por espaço de recurso; continuam fora da força e do número de defensores.
- Bloqueios de criaturas imortais, golems passivos e guardiões territoriais resolvem a sala principal através das referências da formação. Extensões não permitem contornar o bloqueio. Também corrigido o salvamento após eliminar um golem ainda passivo.
- Arena e Parlatório mantêm moral global. Jogos (+10), Taverna (+5), Esgoto (+20) e Lavanderia (+2 para unidades de abrigos) aumentam tolerância individual no alcance. O limite de motim diminui conforme a posição atual; a previsão de recrutamento usa o abrigo escolhido. Os bônus locais podem permitir tolerar moral negativa, sem inflar o placar global.
- Descrições de hover próprias, com contraste, quebra de linha, limites de tela, suporte a foco por teclado e Escape. Controles dinâmicos e botões desabilitados recebem as mesmas descrições; títulos nativos são removidos.
- Taverna sorteia exatamente um dos 13 aventureiros, com nome, força e poder próprios, apresentados numa carta. A opção genérica foi retirada do recrutamento e da invocação. Uma taverna vazia pode atrair outro aventureiro por 10♦. O Batedor pode escolher um acompanhante; o Druida muda para o abrigo da criatura domesticada.
- Novas crateras param antes de qualquer espaço existente, natural ou construído; não substituem nem perfuram essas salas. Respeitam a superfície e câmaras seladas. Magma continua indrenável abaixo da descoberta; a chaminé acima permanece seca. Se não houver obstáculo abaixo, o desenho continua além do limite visível.
- Ponte e ponte levadiça podem ser construídas nos trechos secos, preservam o vão e não criam uma fonte de magma. A ponte aparece sobre a cratera e na imagem do painel; a levadiça representa também seu estado fechado.

## Validação

- 318 testes automatizados de regras, incluindo quantidade e persistência dos profissionais, guardiões e extensões, tolerância local, os 13 aventureiros, acompanhante do Batedor, crateras, pontes e normalização das máscaras.
- Teste visual dedicado verifica todas as 47 configurações e 1.024 amostras nas junções, em dois eixos e oito materiais. Verifica também alfa dos sprites, tooltips, pulsação, movimento reduzido e viewport de 390 px.
- Regressão de navegador, escolha de locais, regras RISE e HTML autossuficiente: exploração, recrutamento, combate, salvamento e exportação de imagem. O teste offline usa o documento HTML idêntico interceptado em loopback porque o ambiente de teste bloqueia navegação file://; não faz solicitações externas.
- Viewport mobile em Chromium; não equivale a uma execução em um iPhone físico com Safari.

## Distribuição e reprodução

Extraia o ZIP do repositório e abra `JOGAR-CONQUER.html`. Os salvamentos anteriores continuam no formato 1. Expansões de crateras antigas já persistidas não são reconstruídas retroativamente.

Fontes de arte novas: `public/assets/cave-terrain-source.png` e `public/assets/professionals-source.png`. Os comandos `npm run build:cave-terrain-art` e `npm run build:professional-art` reproduzem os recortes, sem deformação. `npm run test:autotile` executa a verificação visual dedicada.
