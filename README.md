# CONQUER · Crônicas do Abismo

Jogo single player de exploração, construção e defesa de uma fortaleza subterrânea. Interface em português, combate em tempo real com IA, partidas reproduzíveis por semente e distribuição web instalável (PWA).

## Baixar e abrir no computador

1. Na página do repositório no GitHub, clique em **Code → Download ZIP**.
2. Extraia o ZIP baixado.
3. Na pasta extraída, abra **JOGAR-CONQUER.html** com Chrome ou Edge.
4. Clique em **Nova fortaleza**.

Esse HTML contém o jogo inteiro e não precisa de instalação ou servidor. No GitHub, clicar no nome do HTML mostra seu código; baixe o ZIP antes de abri-lo no computador.


## Exploração por setas — versão 1.3.0

- Clique em uma seta que parte de uma sala ativa para explorar imediatamente naquela direção. A descoberta abre **somente essa passagem**; estar ao lado de outra sala não cria ligação.
- Setas douradas entre salas conhecidas permitem abrir uma passagem depois. Não há custo de recursos nem carta de descoberta; a ação segue o mesmo avanço de turno da exploração, incluindo produção normal.
- O painel de cada sala oferece as mesmas direções com botões acessíveis por teclado. Quando várias salas apontam ao mesmo espaço, é necessário escolher uma origem.
- Movimento, caminhos de invasão, tiros, líquidos, gases e explosões respeitam as passagens efetivamente abertas. Uma parede sem passagem bloqueia a conexão mesmo com um caminho alternativo ao redor.
- A superfície continua sendo construída diretamente. Cada construção nova recebe uma ligação: preferencialmente à sala ativa abaixo, ou a outra sala ativa vizinha; não se conecta automaticamente a todas as vizinhas.
- Salvamentos antigos preservam o mapa anterior, convertendo uma única vez as antigas adjacências em passagens explícitas. Nos novos saves, as paredes ainda fechadas continuam fechadas ao carregar.

O visual usa portas nas bordas e trechos curtos em pixel art. Entre cavernas, as paredes são cavernosas e o vão é escuro; em ligações mistas, a metade construída termina no meio e a outra metade é cavernosa. Entre duas salas construídas, todo o corredor é construído e recebe uma tocha com chama discreta. Movimento reduzido congela a chama. Ruínas com arquitetura preservada (como criptas e bibliotecas antigas) usam acabamento construído.

Execute `npm run test:directions` para verificar a interação por mouse, toque, teclado e persistência das ligações. `npm run test:passages` confere os materiais, encaixes e os três casos arquitetônicos.

## Testar sem instalar nada

O arquivo `JOGAR-CONQUER.html` na raiz do repositório é a edição pronta para abrir. Também é gerado como `releases/CONQUER-Jogar.html`; abra esse arquivo com Chrome ou Edge no computador. Ele contém o código, as fontes, a ilustração de abertura e as 273 artes de salas e 34 sprites. Não precisa descompactar, instalar Node, acessar a internet ou iniciar servidor. Clique em **Nova fortaleza** para começar. Use **Salvar** e, para preservar uma cópia independente do navegador, **Exportar jogo**.

Essa edição reúne todos os recursos no próprio HTML e usa JavaScript clássico para permitir abertura por `file://`. A execução com a rede desativada é validada pelo teste autônomo. A política administrativa do Chromium desta máquina bloqueia a navegação por `file://`; nesse ambiente, o teste renderiza o mesmo HTML em um documento de loopback interceptado, sem servidor e sem buscar recursos externos. As restrições de pré-visualização de arquivos no Android/iOS dependem do aplicativo usado para abrir o HTML; a versão web hospedada continua sendo o caminho indicado para testar em aparelhos móveis reais.

Para gerar e verificar novamente essa edição:

```sh
npm run build:standalone
npm run test:standalone
```

O checksum fica em `releases/CONQUER-Jogar.sha256`. As instruções HTTP abaixo se referem à edição web com arquivos separados; a edição `CONQUER-Jogar.html` já possui tudo embutido.

## Jogar e desenvolver

Requer Node.js 20 ou posterior para o servidor local e as ferramentas. O jogo publicado precisa apenas de um navegador moderno, sem conta ou serviço de backend.

```sh
cd /workspace/dava
npm ci --cache /tmp/conquer-npm
npm run dev
```

O servidor usa a porta 4173. `PORT=8080 npm run dev` escolhe outra porta. A versão de desenvolvimento serve os arquivos de `public/` automaticamente. Para testar instalação e offline, use a versão compilada:

```sh
npm run build
npm start
```

O build não usa bundler, CDN, API externa ou dependências de produção. Pode ser executado sem `npm ci`; as dependências de desenvolvimento só são necessárias para os testes de navegador. Abra o jogo através de um servidor HTTP, pois módulos JavaScript não funcionam de maneira confiável por `file://`.

## Distribuição

`npm run build` gera `dist/`. Hospede **o conteúdo dessa pasta** em um servidor estático com HTTPS, preservando a estrutura dos caminhos. Também funciona sob um subdiretório. Para itch.io, envie o ZIP web e selecione jogo HTML com `index.html` na raiz. O host deve servir `.js` com MIME JavaScript e `.webmanifest` como JSON/manifesto.

O service worker armazena todos os recursos locais e permite reabrir o jogo offline depois do primeiro carregamento completo. O cache recebe uma versão derivada do conteúdo de cada build. Processos Node não são necessários no servidor de produção. A instalação na tela inicial depende dos recursos do navegador; no iOS, use a opção de adicionar à tela inicial no Safari. O pacote é web/PWA, **não contém instaladores nativos EXE, APK ou IPA**.

Gerar novamente o ZIP de distribuição:

```sh
npm run build
node scripts/release.mjs
```

O resultado fica em `releases/conquer-web-1.7.0.zip`, com `index.html` na raiz. O arquivo de checksums fica ao lado do pacote.

## Conteúdo e controles

- Campanha com início, vitória e derrota; três dificuldades e sementes de mundo.
- Baralho com 52 cartas; coringas adicionados na profundidade 5.
- 90 tipos de salas e descobertas, cada um com **3 ilustrações PNG em pixel art**, além de 3 imagens do terreno de superfície: 273 assets de sala. Dois atlas raster originais gerados sustentam as artes das salas e os 33 arquivos de sprites de unidades e inimigos. A variante é escolhida ao descobrir/construir, preservada no save e não muda a cada frame.
- 41 salas construíveis, pré-requisitos e efeitos descritos diretamente no catálogo.
- 15 tipos de unidades, cada um com sprite próprio; capacidade compartilhada, moral e motins. Recrutamentos que causariam motim imediato aparecem em vermelho e são bloqueados sem cobrar recursos.
- Dois defensores ficam de guarnição no portão/trono. As demais tropas interceptam rotas de invasão com caminhos estáveis e evitam perigos letais.
- Monstros grandes são entidades individuais, com tamanho proporcional; criptas, colmeias, vilas, minas e outros eventos usam espécies próprias.
- Combate automático com caminhos ortogonais, pausa tática, velocidades 0,5× / 1× / 2×, ataques corpo a corpo, flechas, orbes, frascos e virotes de cerco.
- Linha de tiro, escudos de clérigos, hospitais, armadilhas, barricadas, pontes levadiças e passagens secretas.
- Líquidos e gases com efeitos imediatos, mesmo fora de combate. Magma danifica salas; drenar preserva a construção e não substitui reparos. Gás inflamável explode ao tocar Forja, Taverna ou Quartel.
- Superfície construída diretamente, sem carta de exploração; térreo apoiado no chão e andares acima exigem sala de apoio. O botão Encerrar turno permite continuar construindo sem escavar.
- 13 expedições opcionais, com artefatos permanentes.
- Autosave e três espaços manuais. Exportação/importação JSON entre dispositivos e exportação da crônica em texto. Dados permanecem locais, sem sincronização por conta.
- Sons sintetizados, controle de volume, opção de reduzir movimento e pausa ao ocultar a janela.

**PC:** arrastar para mover o mapa; roda ou +/− para zoom; E para explorar; Espaço para pausar combate; F para centralizar; Esc para menu; Ctrl/Cmd+S salva no espaço 1. O canvas aceita setas e Enter para selecionar salas. Menus permitem navegação por teclado e retêm foco no diálogo.

**Mobile:** toque para selecionar; arraste com um dedo para mover; pinça ou botões +/− para zoom. Informações essenciais aparecem no painel selecionado e não dependem de hover. O layout responde à orientação e a janelas pequenas.

## Regras e decisões de adaptação

Referências fornecidas pelo usuário: `CONQUER.odt` para regras e `DELVE November 8th Checked Version Pages.pdf`, de Anna Blackwell, para direção visual. O PDF não foi incluído no jogo. A ilustração de abertura foi gerada para este projeto usando a referência de linguagem visual; salas e personagens são pixel art raster original gerada para esta revisão; ícones e efeitos têm desenho próprio. Consulte [ADAPTATION.md](ADAPTATION.md) para as diferenças detalhadas entre o documento e a versão digital.

Consulte também [PDF-RULES.md](PDF-RULES.md) para a revisão de regras a partir das páginas do PDF. O documento CONQUER menciona várias tabelas não anexadas. Esta implementação faz escolhas explícitas para fechar a campanha: objetivo na profundidade 12, magias e invenções condensadas, eventos resolvidos automaticamente, ocupação de uma célula por sala e expedições planares sem mapas separados. **Não é uma transcrição integral de todas as regras do documento.**

## Verificação e limites da entrega

```sh
npm test
npm run build
npm run test:browser
```

Os testes de navegador usam o Chromium do sistema em `/usr/bin/chromium`. Defina `CHROMIUM_PATH` para usar outra instalação. Alternativamente, instale uma versão compatível do Chromium via Playwright e passe seu caminho. Não é necessário baixar navegadores para jogar ou gerar `dist/`.

O relatório de navegador e as capturas ficam em `artifacts/`. A suíte cobre o fluxo real de criar, explorar, construir, recrutar, salvar, recarregar, exportar/importar, combater, alterar opções e abrir offline. Executa janelas desktop, mobile com toque, horizontal e 360×640. Os testes do motor cobrem os caminhos e as 16 combinações de corredores, custos, moral, perigos, restauração de estado, expedições e os finais.

Validação executada em Chromium Linux e emulação de viewport/toque. **Não houve homologação em hardware Android/iOS, Safari, Firefox ou lojas.** Os testes não garantem ausência universal de bugs nem substituem playtests de balanceamento e acessibilidade com pessoas. Para lançamento comercial, ainda cabem homologação dos dispositivos-alvo, revisão dos direitos do título/regras e revisão editorial. Não foi presumida uma licença sobre os documentos de referência; não foi adicionada uma licença que conceda direitos sobre eles.

## Organização

| Caminho | Finalidade |
| --- | --- |
| `src/data.js` | Conteúdo, custos, requisitos, unidades e planos |
| `src/engine.js` | Simulação determinística e validação de salvamentos |
| `src/render.js` | Canvas, câmera, corredores, personagens e projéteis |
| `src/app.js` | Interface, diálogos, controles e persistência |
| `src/audio.js` | Efeitos sonoros com Web Audio |
| `public/assets/rooms/` | 273 ilustrações PNG em pixel art |
| `scripts/pixel-art.mjs` | Pipeline reproduzível dos atlas raster para PNGs de salas e sprites |
| `scripts/build.mjs` | Build estático e service worker offline |
| `tests/` | Regressões do motor e testes de navegador |

O parâmetro `?test=1` habilita uma API local de inspeção para os testes automatizados. Não habilita rede, contas nem serviços remotos.

A fonte DejaVu Serif é redistribuída sob os termos em `public/assets/FONT-LICENSE.txt`.

### Passagens — revisão 1.1.1

Conexões horizontais, verticais, entradas e grades usam nove módulos PNG de pixel art, com faixa interna contínua e desenho sem suavização. Os nomes das salas se afastam dos poços verticais.

**Coringas:** ambos ainda concedem a mesma recompensa genérica. Não estão implementados os eventos distintos do coringa preto (Monstruosidade Antiga) e vermelho (artefato lendário, com possibilidade de Cristal do Vazio), nem a retirada por cinco turnos descrita no DELVE.

### Corredores procedurais — revisão 1.2.0

Cada conexão é gerada em tempo de execução por um shader de pixels em software (Canvas 2D). A máscara alarga as entradas, distorce as paredes em pixels e preserva o caminho central reto. O acabamento mistura materiais das duas salas e amostra o grão de suas ilustrações; trilhos, escoras, raízes, favos, juntas, ossos e cristais aparecem conforme o conteúdo. Água, brasas e gases têm animação discreta, desativada por movimento reduzido.

O gerador usa dez famílias de materiais. Construção, variante visual, dano e contaminação entram na chave do cache; o resultado é estável ao salvar/carregar. Um cache LRU de até 256 conexões evita recalcular as texturas a cada quadro. A geometria da simulação e as regras de tiro continuam alinhadas à faixa central. A implementação funciona sem WebGL, tanto no build web quanto no HTML único offline.

`npm run test:passages` verifica os encaixes, as transições de materiais, a atualização do cache, a estabilidade visual e o movimento reduzido.

### Proteção inicial — versão 1.3.1

Novas descobertas de magma e crateras vulcânicas na faixa inicial (linha do portão e primeira camada subterrânea, até dois espaços para cada lado) resultam em uma caverna segura. A substituição acontece antes de fluidos ou danos serem aplicados. Além dessa faixa, e a partir da segunda camada subterrânea, os encontros de magma continuam normais.

### Recompensas animadas — versão 1.4.0

Cada unidade efetivamente recebida gera um símbolo: ♥ para recursos e ♦ para riquezas. Na exploração, eles saem do naipe da carta revelada, percorrem trajetórias curvas até o símbolo do placar e incrementam o contador individualmente ao chegar. Produção, magias, espólios e trocas também emitem símbolos; quando não há carta, a origem visual é a sala selecionada ou o mapa.

Os ganhos continuam disponíveis imediatamente para construir, recrutar e salvar. Somente a apresentação do contador é escalonada. O limite do estoque é respeitado: se couberem apenas três recursos, voam três símbolos. Ganhos simultâneos e gastos durante o voo são conciliados com o saldo real. Carregar outra partida, voltar ao menu ou ocultar a janela encerra os efeitos pendentes. Movimento reduzido aplica os números sem animação de voo.

A camada de efeitos usa Canvas 2D, com um item por unidade e glifos reutilizados. Não captura mouse/toque, não é gravada no save e está incluída no HTML autônomo. Execute `npm run test:resource-flights` para validar a interação e a contagem.

### Primeira fileira — versão 1.4.1

O Túnel de escavador não é gerado na linha do portão nem na primeira camada subterrânea, independentemente da distância lateral. A carta correspondente revela uma caverna vazia sem escavador e sem combate. A partir da segunda camada, o encontro continua normal.

### Câmara do Imortal e retaliação — versão 1.5.0

A descoberta coloca uma criatura neutra imóvel sobre a sala, com sprite próprio e símbolo ∞. Ela bloqueia a passagem e não ataca a base nem inicia combate. Dano comum não a fere; líquidos letais, gás venenoso e explosões a eliminam por morte instantânea. A ação de pagar 20♦ para aprisioná-la foi removida. Saves antigos com essa câmara são migrados ao carregar.

Foi corrigido o contato corpo a corpo: chefes de alcance 0,5 já não podem golpear soldados de alcance 0,42 sem que estes consigam revidar. A revisão preserva as restrições de paredes e corredores; a partir da versão 1.6.0 todos os defensores participam da distribuição por frentes. Chefes com projéteis continuam tendo vantagem de alcance sobre espadas.

`npm run test:immortal` valida o bloqueio passivo, persistência, morte por líquido e retaliação no navegador. `npm run build:immortal-art` reproduz o sprite pixelado a partir da ilustração de origem gerada, mantida fora do pacote web final.

### Frentes de combate, portas e estados visuais — versão 1.6.0

Não há guardas presos ao portão. A IA agrupa inimigos próximos que se comunicam por passagens, estima força com saúde/escudos e melhorias, avalia o tempo de deslocamento real e divide os defensores entre frentes alcançáveis. Prioriza ameaças próximas do objetivo quando não há tropas suficientes, destina mais força aos grupos maiores e redistribui após baixas. Unidades em contato corpo a corpo mantêm o confronto, e mudanças de rota respeitam a aresta em andamento. Arqueiros buscam linha de tiro direta; armas de cerco estacionárias só contam onde alcançam. Ordens antigas de guarda são convertidas ao carregar.

As barricadas agora são portas reforçadas em **uma passagem escolhida**, no centro do túnel e no lugar da tocha. No painel da sala, use **Portas nos corredores** para instalar ou aprimorar cada lado. Ambas bloqueiam invasores, tiros, líquidos e gases; aliados atravessam. Invasores param diante da porta e a atacam. A porta ofensiva revida. Ao ser destruída, o bloqueio cessa e os perigos ambientais se propagam imediatamente. Custos e resistências anteriores foram preservados. Barricadas antigas de sala são migradas para um corredor em direção ao portão, quando disponível.

Contaminação altera os pixels da própria sala, sem retângulos transparentes: água, magma e cada gás têm acabamento próprio. O fundo de papel permanece intacto. A caverna de cristal compartilha a paleta azul do corredor e um brilho lento de oito segundos, congelado por movimento reduzido. O painel lateral mostra os mesmos estados.

Somente construções podem sofrer dano estrutural; cavernas naturais continuam sujeitas a contaminação e perigos, mas não a dano. Foram geradas **126 artes danificadas para os 42 tipos de construção**, três variantes por tipo. Reparar restaura a arte intacta. Saves antigos removem marcas de dano indevidas em cavernas naturais.

Comandos adicionais: `npm run test:tactics-doors`, `npm run test:room-appearance` e `npm run build:damaged-art`. O atlas danificado de origem é mantido no repositório, mas excluído do pacote web. Tint e brilho são calculados em baixa resolução e reutilizados em cache.

### Paletas das salas — versão 1.6.1

Todas as salas agora recebem tint nos próprios pixels usando a mesma paleta de material do corredor que chega até elas. O tratamento também vale para variantes danificadas e retratos no painel. Papel, transparência e detalhes da pixel art são preservados. Efeitos de contaminação continuam sobre essa base; o pulso lento permanece exclusivo da caverna de cristal.

### Formação no chão das salas — versão 1.6.2

Personagens ficam na parte inferior da sala. Tropas numerosas formam fileiras progressivamente mais altas, alternadas lateralmente em zigue-zague, desenhadas do fundo para a frente. A formação considera o tamanho dos sprites e se desfaz gradualmente ao entrar nos corredores; posições lógicas, alcance e pathfinding permanecem iguais. Projéteis e impactos acompanham a altura visual das salas.

### Fossos contínuos — versão 1.6.3

Fossos de elevador e elevadores conectados verticalmente formam uma coluna contínua em pixel art: paredes texturizadas, guias e cabos atravessam a fronteira dos tiles. A textura usa coordenadas do mundo para evitar reinícios nas emendas. Tampas aparecem apenas nas extremidades; não se criam ligações entre salas adjacentes sem passagem aberta. Portas de corredor permanecem visíveis e funcionais.

### Escavador e revisão visual dos fossos — versão 1.6.4

O verme escavador sobe cavando, um trecho por vez, antes de seguir a IA normal até o portão. Espaços desconhecidos se tornam cavernas vazias; a primeira sala já descoberta encerra a escavação ao ser alcançada. Todas as passagens abertas permanecem, inclusive se o monstro morrer. Não há cartas, turnos ou recompensas extras, nem ligações laterais automáticas. Portas, perigos ambientais e pausa continuam funcionando. Saves preservam o trecho em andamento. Se não houver sala acima na coluna, o limite é a linha do chão: não são criadas salas flutuantes. `npm run test:burrowing` verifica o comportamento no navegador.

O visual dos fossos volta às ilustrações cavernosas anteriores, com suas três variantes. Nas ligações verticais, apenas as tampas internas são retiradas; uma emenda com dithering entre os pixels das duas salas mantém a textura nítida. A coluna geométrica de trilhos da versão 1.6.3 foi substituída.

As fileiras de tropas agora compartilham uma grade fixa: fileiras alternadas deslocam meia coluna, inclusive quando estão incompletas. Isso corrige o realinhamento indevido da segunda fileira em grupos de 6 a 9 unidades.

### Título único do elevador — versão 1.6.5

Cada sequência de fossos/elevadores ligada verticalmente mostra apenas um título, “Elevador”, no tile inferior. Os títulos dos tiles superiores são omitidos. Uma parede sem passagem divide as sequências; salas isoladas mantêm seu nome original e os detalhes continuam disponíveis no painel.

### Travessia em fila — versão 1.6.6

Unidades do mesmo lado seguem em fila nos corredores, com espaço entre os personagens e sem ultrapassar aliados mais lentos. A fila vale nas quatro direções, respeita portas e aliados parados em combate e se libera dentro da sala de destino para recompor a formação. Unidades grandes recebem mais espaço. O progresso é preservado pelos saves. `npm run test:corridor-queue` verifica a travessia no navegador.

### Descobertas, portais e arte própria — versão 1.7.0

- A masmorra rival revela automaticamente **1d10+2 espaços**, incluindo a origem. Cada carta é tratada como ♠. O crescimento usa espaços livres e abre somente as passagens de origem; não substitui salas existentes. Os defensores compartilham o lado inimigo. Havendo combate, a vitória rende **10♦ por espaço**, sujeito à capacidade de armazenamento; sem combate não há tesouro da masmorra. Se uma câmara selada impedir o crescimento, ele continua automaticamente quando ela é aberta.
- As 46 salas naturais/de encontro do novo manifesto têm **duas composições próprias e uma terceira variante espelhada**, em vez de compartilhar famílias genéricas. O poço dos desejos tem poço, telhado e balde; criptas têm sarcófagos; colmeias têm favos; bibliotecas têm estantes. Os quatro atlas de origem e o manifesto permitem reproduzir os 138 PNGs. Dragões e fossos têm tratamento próprio.
- O covil do dragão tem três pares de artes: dragão dormindo sobre ouro num palácio em ruínas; depois do despertar, as mesmas ruínas sem dragão nem tesouro. A criatura passa a agir como unidade separada, e a sala não permite mais roubar ouro. O estado persiste no save.
- O golem da forja surge **passivo**. A ação **Atacar golem** torna o mesmo guardião hostil. Vencê-lo libera a forja para recrutamento. Golems aliados usam o mesmo tamanho 2 do guardião; armas de cerco têm tamanho 2,6. Saves antigos atualizam os tamanhos aliados.
- Elevadores mantêm as dimensões originais das ilustrações. Apenas o trecho de ligação recebe paredes e apoios de pixel art, sem esticar a sala. O título continua apenas no tile inferior de cada sequência.
- A câmara selada bloqueia novas descobertas no seu **3×3**, incluindo diagonais. Salas já conhecidas, suas funções e suas passagens permanecem disponíveis. Selecionar a câmara destaca a área. Abrir libera a maldição e remove o bloqueio; dano por magma, explosões ou invasão abre o selo automaticamente, sem transformar cavernas em salas danificáveis.
- A rolagem de invasão de **25% por turno** agora é independente de produção, conexão com a base e estabilização. Portais estabilizados continuam sujeitos a invasões; selar o portal encerra o risco. Cada portal é verificado uma vez por turno, com resultado no diário e no painel. Uma invasão interrompe a descoberta antes de gastar carta ou criar a sala solicitada.

Novos comandos: `npm run test:discoveries`, `npm run build:unique-art` e `npm run build:dragon-art`. O HTML único inclui as novas artes, sem baixar imagens durante a partida.
