# CONQUER · Crônicas do Abismo

Jogo single player de exploração, construção e defesa de uma fortaleza subterrânea. Interface em português, combate em tempo real com IA, partidas reproduzíveis por semente e distribuição web instalável (PWA).

## Baixar e abrir no computador

1. Na página do repositório no GitHub, clique em **Code → Download ZIP**.
2. Extraia o ZIP baixado.
3. Na pasta extraída, abra **JOGAR-CONQUER.html** com Chrome ou Edge.
4. Clique em **Nova fortaleza**.

Esse HTML contém o jogo inteiro e não precisa de instalação ou servidor. No GitHub, clicar no nome do HTML mostra seu código; baixe o ZIP antes de abri-lo no computador.

## Testar sem instalar nada

O arquivo `JOGAR-CONQUER.html` na raiz do repositório é a edição pronta para abrir. Também é gerado como `releases/CONQUER-Jogar.html`; abra esse arquivo com Chrome ou Edge no computador. Ele contém o código, as fontes, a ilustração de abertura e as 273 artes de salas e 33 sprites. Não precisa descompactar, instalar Node, acessar a internet ou iniciar servidor. Clique em **Nova fortaleza** para começar. Use **Salvar** e, para preservar uma cópia independente do navegador, **Exportar jogo**.

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

O resultado fica em `releases/conquer-web-1.2.0.zip`, com `index.html` na raiz. O arquivo de checksums fica ao lado do pacote. Este trabalho não publica nem envia conteúdo a serviços externos.

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
