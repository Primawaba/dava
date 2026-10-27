# CONQUER · Crônicas do Abismo

## Correção 1.21.1 — profundidade dos bandidos

A força das invasões agora usa a profundidade do local válido mais profundo para o surgimento dos bandidos. A extensão automática da cratera, incluindo seu vão seco, não entra no cálculo. Salas danificadas, perigosas ou sem rota transitável também não inflam a força. Cada bandido continua com 15 STR e os intervalos permanecem de 5–8 turnos.


## Atualização 1.21.0 — acampamentos inimigos

Áreas ocupadas têm reserva própria começando em zero. Por turno recebem **maior profundidade + quantidade de salas**, recrutam pelas construções tomadas usando o custo normal ou, sem recrutadores, replicam a unidade mais forte que conseguem pagar pelo valor de sua força. Sobras ficam guardadas. As estruturas são preservadas e os ocupantes passeiam em seus domínios; reconectar desperta as tropas reais, incluindo reforços, e só a vitória libera as salas.

[Regras e compatibilidade da ocupação](reports/OCUPACAO-1.21.md). Esta versão substitui as limitações de guarnições genéricas e dano por tomada documentadas no relatório histórico 1.20.


## Atualização 1.20.0 — cerco, persuasão e prioridade de engajamento

Virotes de cerco atravessam todos os inimigos alinhados até um bloqueio e interrompem sobreviventes por um segundo. A Sala de persuasão interroga ao final do turno, descarta o ocupante após a primeira tentativa e recebe prisioneiros de Solitárias por uma escolha no mapa. Aliados corpo a corpo avançam na frente, do maior HP atual ao menor; atiradores seguem atrás na mesma frente.

[Regras, validação e análise do takeover existente](reports/COMBATE-E-PERSUASAO-1.20.md). O takeover é uma ocupação limitada de áreas isoladas, com guarnições persistentes e retomada por reconexão; o relatório detalha também as lacunas, sem apresentá-lo como uma economia inimiga completa.


## Atualização 1.19.0 — invasões, territórios e variedade narrativa

- Bandidos racionais invadem na exploração após intervalos de 5–8 turnos, junto das ameaças da descoberta. Cada bandido tem 15 de força; o grupo cobre uma força-alvo de 15 + 5 × profundidade, arredondando para cima. Surgem no ponto mais profundo com caminho transitável até a fortaleza.
- Ao atacar um guardião territorial, os defensores avançam primeiro. O guardião reage no próprio território. O Cristal do Vazio e suas extensões recebem material roxo escuro.
- Coringas entram no baralho apenas quando a fortaleza alcança profundidade 5; profundidades de outros planos não antecipam isso.
- Cada categoria de registro da crônica tem pelo menos cinco formulações, alternadas sem consumir a aleatoriedade do jogo. O texto permanece igual no diário, na exportação e após salvar/carregar. Registros antigos recebem variações em ordem cronológica.


Jogo single player de exploração, construção e defesa de uma fortaleza subterrânea. Interface em português, combate em tempo real com IA, partidas reproduzíveis por semente e distribuição web instalável (PWA).


## Atualização 1.18.0 — camadas por sala e mortos-vivos em combate

- Apenas o K♣ usado numa descoberta real avança a camada. A nova fronteira vale para salas ainda não descobertas na mesma profundidade ou abaixo. Salas anteriores, inclusive construções, conservam seu próprio identificador. Históricos dos planos ficam separados do mapa base.
- Efeitos e recompensas consultam a sala de origem. Magma aquece líquidos localmente; Cemitério avalia o local da morte; Linhas Arcanas avalia a sala que lançou a magia; Riquezas/Rastejantes avaliam o produtor ou a nova descoberta. A Masmorra resolve uma segunda carta de espadas numa sala adjacente disponível.
- Tint base de cada camada combinado com o material da sala, líquidos, gases e corredores. As ilustrações das salas foram preservadas.
- 238 novos sprites transparentes: 34 tipos em cada uma das sete camadas especiais, incluindo espécies que podem se amotinar. Normal mantém os sprites anteriores. Fontes geradas e recortes reproduzíveis em `art/layers` e `npm run build:layer-art`.
- Cemitério, Lápide e gêmeos reanimam inimigos imediatamente, na posição exata em que morreram, durante o mesmo combate. São mortos-vivos da espécie original e não podem ser capturados. Cada corpo só retorna uma vez; efeitos simultâneos não criam cópias. Isso substitui o retorno após a escolha de captura da versão 1.17.1.

[Regras, cores, migração e validação](reports/CAMADAS-1.18.md). `npm run test:layers` cobre o fluxo em desktop, toque e HTML offline. Salvamentos existentes continuam suportados; novas fronteiras são guardadas por mundo e por profundidade.

## Correção 1.17.1 — retorno do Cemitério e captura

O Cemitério recriava inimigos antes da decisão de captura, deixando uma cópia hostil mesmo quando o jogador capturava o original. A decisão agora é resolvida antes do retorno: capturados não ressurgem como inimigos. Os não capturados podem retornar uma única vez com metade da força, arredondada para baixo; a segunda derrota encerra esse retorno. Essa limitação é uma adaptação digital explícita para evitar uma sequência repetitiva de combates com a mesma criatura. O retorno tem carta de evento própria, e escolhas pendentes continuam válidas ao salvar/carregar.

Validação: 356 testes de regras; reprodução do Lar de criatura grande no Cemitério, com captura e recusa, em desktop, toque e HTML offline. Execute `npm run test:graveyard` para repetir o fluxo. Nenhuma alteração nas artes das salas nem no mecanismo de descoberta das camadas.

## Atualização 1.17.0 — desempenho, pesquisa e crônica

- Pesquisa em **Construções → Pesquisas**: sete projetos básicos de Tier 0 desde o início. Cada Informação obtida com um interrogatório bem-sucedido concede 1 ponto, além do efeito original da carta de RISE. Projetos de Tier 1/2/3 custam 1/2/3 informações. Um projeto do tier anterior abre acesso ao próximo; requisitos específicos continuam valendo. Engenharia militar, alvenaria e recrutamento de prisioneiros são pacotes. Solitária mantém Tier 1, mas seu pacote com Contratação tem acesso Tier 3.
- Salvamentos anteriores à pesquisa mantêm todos os projetos já disponíveis. Uma campanha nova usa a progressão desde o começo. Inventos e recompensas especiais continuam ligados às suas descobertas.
- Capturas ocupadas podem ser substituídas na tela após a vitória. O ocupante anterior só é descartado ao confirmar. Prisão cheia permite escolher qual prisioneiro sai; Canil preserva espécie e força do novo aliado. Cancelar conserva os anteriores.
- Crônica narrativa, incluindo releitura dos registros antigos, em ordem cronológica no diário e na exportação.
- Iluminação com máscaras reutilizáveis, orçamento por quadro e caches limitados; caminhos reutilizados com invalidação de mapa/perigos/imunidades; NPCs sincronizados uma vez por atualização. Artes aprovadas preservadas.

`npm run test:progression` verifica pesquisa, substituição, diário e HTML offline em desktop e toque. `npm run test:performance` exercita 64 salas e 96 rodadas de produção. Detalhes em [notas da versão](reports/ATUALIZACAO-1.17.md).

## Atualização 1.16.0 — captura e guarnições locais

- Tela de captura após a vitória, com sprites dos derrotados e atribuição por estrutura. Um inimigo não pode ser duplicado; cada estrutura recebe até uma nova captura por batalha. Escolhas são aplicadas juntas ao confirmar e podem ser salvas ainda pendentes.
- Persuasão captura e interroga seu próprio ocupante, sem exigir Solitária. Solitária mantém candidatos para Contratação. A tentativa de recrutamento esvazia a cela em sucesso, falha ou negociação; recusar pagamento não devolve o candidato.
- Canil recruta cães e captura monstros específicos como aliados imediatos, preservando espécie e força. “Fera” genérica saiu das opções de recrutamento. Criadouro reproduz a espécie da matriz pela ação da sala.
- Ratos permanecem nos esgotos, combatem apenas oponentes que entram neles e não participam das frentes móveis nem das expedições. A força móvel do HUD os exclui.
- Prisões guardam capturas reais, sem produzir ocupantes automaticamente. Contenção rompida libera as espécies efetivamente presas.

[Grupos de desbloqueio, com tiers preservados](reports/GRUPOS-DE-DESBLOQUEIO.md) · [Relatório de balanceamento](reports/BALANCEAMENTO-CONSTRUCOES-1.15.1.md). O relatório descreve a especificação original, implementada na versão 1.17.0.

Validação: 335 testes de regras, 21 verificações gerais de navegador e um fluxo específico de captura em desktop, toque 390 px, salvar/carregar e HTML offline. `npm run test:captivity` executa esse fluxo.

## Atualização 1.15.1 — arte anterior restaurada

Cavernas e passagens voltam às ilustrações e aos encaixes usados na versão 1.14. As correções de regras, os novos profissionais, as tooltips e o tint procedural da versão 1.15 foram preservados. O novo autotiling visual deixou de ser usado no mapa.

## Atualização 1.15.0 — cavernas modulares e tint procedural

Novo autotiling de cavernas por conexões explícitas, máscaras de 47 configurações e peças em pixels sem deformar ilustrações. O tint usa avaliação procedural por pixel com transições de material, iluminação local e brilho pulsante; funciona em Canvas 2D no HTML offline.

Mineiros e lenhadores têm sprites sépia novos, transparência corrigida e grupos de 2–3 por espaço de recurso. Guardiões bloqueiam também as extensões de suas salas. Bônus de área aumentam a tolerância individual, separados da moral global. Tavernas atraem os aventureiros específicos da tabela e oferecem um festival para repor um aventureiro perdido. Tooltips próprias substituem as do navegador.

A expansão de novas crateras para antes de qualquer sala existente, sem substituí-la. Pontes e pontes levadiças também podem atravessar os trechos secos.

Veja [detalhes e validação da versão 1.15](ATUALIZACAO-1.15.md).

## Atualização 1.14.0 — correções do relatório de teste

NPCs circulam na própria estação e fogem/retornam pelos corredores; mineradores e lenhadores têm sprites próprios. Tropas passeiam mais devagar, priorizam o abrigo e retomam o idle após vencer. Salas grandes usam pinturas completas sem esticar, cavernas vazias voltam às chances 89%/7%/3%/1%, produtores ganham emblemas próprios dentro do mapa e salas de riqueza recebem dourado.

Escolhas de locais usam o mapa. Infraestrutura e defesas têm mosaicos de ícones. Crateras distinguem chaminé seca, borda pela metade e magma indrenável abaixo, perfurando construções. Magma detona gás inflamável, invasões não cancelam a exploração e a derrota no Cristal do Vazio encerra a campanha mesmo com gemas.

Veja [detalhes e validação da versão 1.14](ATUALIZACAO-1.14.md). Os registros seguintes descrevem versões anteriores.

## Atualização 1.13.0 — colônia e regras avançadas

Encaixes e cores corrigidos, rios horizontais, caverna de ♥ com quatro painéis, profissionais, tropas passeando, produção ilustrada, armadilhas, captura opcional e grades de prisão. A revisão também adiciona tabelas de magia/invenções, coringas distintos, transporte sobreposto, Wyrd e mapas planares persistentes.

Veja a [cobertura dos pedidos, dos dois relatórios e os limites de fidelidade](ATUALIZACAO-1.13.md). Os registros abaixo descrevem versões anteriores.

## Atualização 1.12.0 — regras de CONQUER esclarecidas por RISE

Conforto e motim por abrigo, prisioneiros reais, Persuasão/Informação, Contratação negociada, dedicação e sacrifício em altares, encontros territoriais, domesticação, desafios e labirintos agora têm regras próprias e escolhas na interface. Clérigos podem ser instalados nas salas de interação; selar portal exige seu sacrifício. Veja [implementação, fontes e limites](RISE-IMPLEMENTATION.md).

## Atualização 1.11.0

- Cavernas vazias: **89%** com 1 espaço, **7%** com 2, **3%** com 3 e **1%** com 4. Chefes e formações com tamanho próprio usam suas regras específicas.
- Construções e salas de várias casas têm encaixes ilustrados sem deformação. Barricadas cobrem a abertura inteira, substituem a tocha e mantêm bloqueios de movimento, tiros, líquidos e gases. O material e a contaminação de cada lado determinam a cor do encaixe.
- Cada casa extra de covil continua o cenário do chefe, com o mesmo material e tint; não repete a criatura nem concede recompensas adicionais. Covis já salvos recebem a ligação visual ao cenário principal.
- Fontes naturais de água, magma e crateras **não podem ser drenadas**. Só salas atingidas pelo fluxo podem ser drenadas. Construir uma ponte mantém a fonte e desenha a ponte sobre sua arte; a fonte continua existindo e pode alimentar novas passagens.
- Formações com tamanho próprio: rios e fluxos de magma até 5 casas, lagos/poços 1d4, cristais e ninhos 1d2, fontes termais/colmeias/vilas/minas/cidades/labirintos 1d4, bibliotecas antigas 1d2, covis desolados 1d4+2, poços de elevador até 1d4 casas verticais e crateras até o limite inferior do mapa. Não sobrescrevem casas existentes e respeitam câmaras seladas e o início protegido de magma.
- Museu e Templo ocupam 2 casas; Criadouro ocupa 4. Uma construção paga um preço, mantém uma capacidade e reserva sua área inteira. Dano em qualquer módulo suspende a função da sala. Pré-visualizações de disponibilidade não alteram a semente.
- Vitória: tropas voltam caminhando pelos caminhos abertos, com fileiras espaçadas. Derrota: inimigos ficam brancos e se desfazem em partículas junto com a gema. A carta espera a animação terminar, inclusive com movimento reduzido.

Os formatos geométricos não mudam os custos já adaptados do jogo. O mapa continua no papel, sem os fundos adicionais removidos anteriormente. Na versão offline, uma transição visual em andamento não é reexecutada ao carregar: o salvamento guarda o resultado já resolvido da batalha.

## Referências de regras

O texto CONQUER é complementado por DELVE e pelo novo [RISE: A Game of Spreading Evil](RISE-RULES.md), com índice de páginas e orientação para conflitos entre as fontes. O [PDF de RISE](references/RISE.pdf) está preservado no repositório.

## Revisão das regras

O [relatório de mecânicas da versão 1.11.0](RELATORIO-MECANICAS.md) compara a implementação com CONQUER e DELVE, preserva as alterações solicitadas e prioriza correções e próximos incrementos. A implementação atual e suas adaptações estão relacionadas em [ATUALIZACAO-1.13.md](ATUALIZACAO-1.13.md).

## Baixar e abrir no computador

[Baixar o pacote de jogo para PC (ZIP)](https://raw.githubusercontent.com/Primawaba/dava/main/CONQUER-PC.zip).

1. No ZIP baixado, escolha **Extrair tudo**.
2. Abra **JOGAR-CONQUER.html** na pasta extraída, com Chrome ou Edge.
3. Mantenha a pasta **jogo** junto do HTML.

O pacote contém apenas cinco arquivos de execução, sem fontes de desenvolvimento, PDFs ou atlas de produção. Não abra o HTML dentro do ZIP. Não exige instalação nem servidor. O HTML de entrada tem aproximadamente 9 KiB; código e arte ficam em arquivos separados, evitando o documento de 31 MiB da entrega anterior. O tamanho total do jogo permanece semelhante: esta mudança reduz o documento processado pela prévia do Explorador, sem remover artes.

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

A distribuição recomendada é **CONQUER-PC.zip**. Extraia todo o conteúdo e abra **JOGAR-CONQUER.html**; a pasta **jogo** deve permanecer ao lado dele. O JavaScript é clássico, compatível com abertura local sem servidor. Todos os recursos gráficos do canvas usam data URLs, preservando exportação PNG sem bloqueio de origem.

A edição monolítica opcional continua sendo gerada em `releases/CONQUER-Jogar.html`, mas não é mais o HTML da raiz nem o download recomendado. Ela tem cerca de 31 MiB.

```sh
npm run build:standalone
npm run test:portable
npm run test:standalone
```

O teste portátil extrai o ZIP gerado e verifica os arquivos extraídos. A política administrativa do Chromium deste ambiente bloqueia navegação `file://`; nessa situação, cada arquivo extraído é servido por interceptação de requisições com a rede desativada. Isso verifica a execução no navegador, mas não reproduz o Explorador do Windows. Pré-visualizadores de arquivos em celulares podem bloquear JavaScript; a versão hospedada é indicada nesse caso.

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

O resultado fica em `releases/conquer-web-1.8.0.zip`, com `index.html` na raiz. O arquivo de checksums fica ao lado do pacote.

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

Consulte também [PDF-RULES.md](PDF-RULES.md) para a revisão de regras a partir das páginas do PDF. O documento CONQUER menciona várias tabelas não anexadas. Esta implementação mantém a campanha base na profundidade 12. Desde a versão 1.13, há magias e invenções distintas, eventos com escolhas, salas de várias casas e mapas separados para os planos. Consulte o registro atual para as adaptações restantes. **Não é uma transcrição integral de todas as regras do documento.**

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

### Encaixe das salas e túneis — versão 1.7.1

As novas artes de descobertas e os dois estados do dragão recebem enquadramento uniforme em execução: margens de papel são removidas, o conteúdo é centralizado e a escala preserva as proporções. O espaço visual volta a aproximar o dos sprites antigos, sem alterar posições do tabuleiro. As bocas dos corredores examinam a silhueta da sala em cada direção e avançam até ela para cobrir recuos, mantendo a paleta e a arquitetura de cada extremidade. Somente passagens abertas recebem essas entradas. O enquadramento vale também para os retratos do painel e é reutilizado em cache. `npm run test:room-framing` verifica a área ocupada e as junções nas quatro direções.

### Cartas de efeitos e decisões — versão 1.8.0

Magias boas/ruins, proteção do templo, artefatos, colheitas, conversões, motins, invasões, explosões, recuperações e outros efeitos de evento agora têm cartas com nome e descrição. Elas formam uma fila: **carta de baralho → animações de recursos → cartas de efeito → combate**. A simulação aguarda a apresentação, sem alterar a pausa manual anterior. Desativar as cartas de exploração nas opções não desativa os eventos.

Efeitos informativos podem avançar por **Continuar** ou após o tempo de leitura; passar o mouse sobre a carta interrompe esse avanço automático. Decisões obrigatórias não fecham por tempo nem por Esc. A prisão antiga permite escolher entre manter ou libertar a criatura. O guerreiro leal recebido por magia permite escolher seu destino por botões ou pelo mapa, com salas válidas destacadas. Um alvo inválido não encerra a carta. Se o alvo deixou de existir, a carta informa isso e oferece uma saída explícita.

Fila e decisões pendentes ficam no save. Carregar reapresenta o que falta, sem conceder os recursos ou tropas novamente. O combate só começa depois da última carta e respeita a pausa que já estava ativa. `npm run test:event-cards` verifica a ordem, as decisões e o fluxo em PC/mobile.

## Cavernas, pintura do mapa e cartas — versão 1.9.0

- Cada descoberta de caverna vazia sorteia 1/2/3/4 espaços com probabilidades de **89%/7%/3%/1%**. Os módulos são revelados juntos, sem novas cartas, recompensas ou turnos. A expansão respeita os limites, as câmaras seladas e as salas existentes; pode ser menor quando faltar espaço. Somente módulos do mesmo grupo compartilham o interior aberto. Construir em um módulo restabelece suas paredes e corredores.
- Covis de chefes usam a força total do encontro, com profundidade e dificuldade: abaixo de 30 STR, 1 espaço; 30–59, 2; 60–99, 3; 100+, 4. A ilustração especial e o chefe único permanecem na sala principal. Dragão adormecido e golem passivo usam a força que terão em combate. Escavações do verme não geram expansões recursivas.
- Na versão 1.10.0, todos os espaços voltam ao fundo de papel: os preenchimentos de tijolos/preto e o shader de tinta da versão 1.9.0 foram removidos. O miasma continua roxo nas salas e passagens.
- **Exportar imagem**, no menu de pausa ou no botão de download do mapa, gera PNG da fortaleza inteira sem interface. A prévia permite baixar ou compartilhar a imagem; no iPhone também pode ser salva com toque prolongado. A exportação limita dimensão e área para evitar exceder a memória de canvas de aparelhos móveis.
- As cartas têm **53 ilustrações quadradas** em pixel art, associadas ao evento, incluindo cada resultado de magia e cada artefato planar. A fila, animações de recursos e escolhas obrigatórias continuam funcionando.
- Ao lado dos defensores aparece a soma da força nominal das tropas aliadas vivas, igual à força do painel Tropas; criaturas neutras, inimigos e unidades derrotadas não entram na soma.

### iPhone / Safari

O HTML baixado pode abrir no **Quick Look do app Arquivos**, que mostra a tela estática sem executar o jogo. Isso não equivale a abrir uma página no Safari. Para jogar no iPhone, abra a versão web em um endereço HTTPS:

**https://raw.githack.com/Primawaba/dava/main/JOGAR-CONQUER.html**

Esse endereço usa o serviço externo RawGitHack para servir o HTML público deste repositório; sua disponibilidade depende desse serviço. O link foi preparado, mas não pôde ser acessado neste ambiente por bloqueio de rede. Os salvamentos locais pertencem ao endereço usado; para transferir uma jornada, exporte e importe seu JSON.

Há fallback para altura `vh`, redimensionamento sem `ResizeObserver`, navegação sem `Array.at` e armazenamento indisponível. Testes Chromium com toque e recursos removidos passaram. **Safari/WebKit real não foi validado**: o download do WebKit foi bloqueado com HTTP 403; um teste em iPhone continua necessário.

Validação desta versão: `npm test`, `npm run test:terrain`, `npm run test:event-cards`, `npm run test:directions`, `npm run test:browser` e `npm run test:standalone`. Para regenerar as ilustrações a partir das folhas de arte: `npm run build:event-art`.

## Revisão visual — versão 1.10.0

As cavernas voltaram a usar os mesmos três sprites detalhados anteriores, incluindo rochas, estalactites e piso. Cada módulo é desenhado como uma sala normal. Dentro de uma mesma caverna de vários espaços, peças ilustradas exclusivas unem os módulos na horizontal ou na vertical: duas alternativas por orientação, recorte central e escala uniforme, sem esticar nem deformar imagens. As uniões são desenhadas depois das salas para manter os encaixes visíveis; paredes entre grupos diferentes continuam fechadas. Construir em um módulo volta a usar o corredor normal. Os quatro recortes e sua folha de origem podem ser regenerados com `npm run build:cavern-art`.

Foram retirados os fundos adicionais de tijolos e preto, a borda de tinta e a remoção de papel dos sprites. O mapa e as ilustrações voltaram ao papel anterior. As probabilidades de tamanho, chefes únicos, exportação PNG, cartas e indicador de força permanecem.

### Três gemas do portão

A campanha começa com três vidas, desenhadas como gemas sobre o portão. Uma derrota de combate destrói uma gema com partículas e mostra uma carta ilustrada. Todos os inimigos ativos e guarnições hostis desaparecem; os guardiões soldados alojados no portão voltam a ser exatamente cinco, leais e com vida completa. Outros aliados sobreviventes e criaturas neutras permanecem. A campanha continua nas duas primeiras derrotas; só a terceira causa game over. A derrota não gera vitória, espólios, cura do hospital ou artefato de expedição. Salvar e carregar preserva as gemas. Salvamentos antigos em andamento recebem três; campanhas antigas já encerradas continuam encerradas. Movimento reduzido usa menos partículas e duração curta. Se o guardião do Vazio desapareceu numa derrota, sua sala permite desafiá-lo novamente, sem conceder o cristal automaticamente. Testes: `npm run test:lives`.
