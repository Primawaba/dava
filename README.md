# CONQUER · Crônicas do Abismo

Versão de teste 2.0: reconstrução do motor, da interface e da geração do mapa. Jogo solo de exploração, construção e defesa subterrânea, em português, com combate em tempo real.

## Abrir no computador

1. [Baixe o ZIP do projeto](https://github.com/Primawaba/dava/archive/refs/heads/main.zip?v=2.0.0).
2. Extraia o ZIP.
3. Abra **JOGAR-CONQUER.html** com dois cliques. Esse arquivo contém o jogo, a fonte e as imagens e funciona sem instalação ou servidor.

O `index.html` é a entrada para desenvolvimento e hospedagem. Para jogar localmente, use **JOGAR-CONQUER.html**.

No iPhone/iPad, a prévia de HTML no app Arquivos pode bloquear JavaScript. Use a versão hospedada no Safari: [abrir o jogo](https://raw.githack.com/Primawaba/dava/main/JOGAR-CONQUER.html). O Safari real ainda precisa de validação em aparelho.

## O que mudou

- Estado, comandos, descobertas e regras separados da apresentação. Comandos inválidos não alteram a partida. O desenho não cria salas nem consome a aleatoriedade.
- Conexões explícitas nas quatro direções. Cada tile recebe uma das 16 configurações de aberturas, recortadas e incorporadas ao próprio sprite antes de desenhar o mapa. As bordas seguem o mesmo contrato, como peças de Carcassonne. Não há sprite de corredor sobreposto às duas salas, nem deformação das ilustrações.
- Arte anterior das cavernas preservada, salas com identidade própria e novas ilustrações para os encontros Wyrd. Tint procedural acompanha conteúdo, perigos e materiais vizinhos.
- Fila persistente de cartas para descobertas, recursos, magia, invasões, motins e escolhas. A batalha espera a fila e as animações. Seleção de locais acontece no mapa.
- IA usa o mesmo grafo das passagens, divide frentes por força e distância e exige linha reta para tiros. Chefes permanecem criaturas individuais. Profissionais usam corredores para fugir e voltar às oficinas.
- Fontes indrenáveis, pontes, barricadas, gases, magma, crateras, áreas guardadas, prisões, três gemas e derrota definitiva contra o Cristal do Vazio.
- Menu, três slots de salvamento, exportação/importação da jornada, opções, layout mobile e exportação da fortaleza em PNG sem interface.

Os salvamentos 2.0 usam um formato novo. Os slots da versão anterior permanecem no navegador, mas não são importados automaticamente pelo novo motor.

## Referências e escopo

CONQUER.odt é a referência principal de design. DELVE e RISE complementam suas tabelas e mecânicas; as decisões expressas do jogador prevalecem. Os documentos são referências, não instruções de execução.

Esta é uma reconstrução **para teste**, não uma certificação de produto final. O motor inclui mapas planares separados, grupos de expedição, retorno, invasões e recompensas. A fidelidade de todos os modificadores exclusivos dos treze planos ainda exige uma revisão específica; não se deve considerar essa parte uma reprodução completa do documento. Balanceamento e campanhas extensas também precisam de testes de jogo reais.

Consulte [os contratos da reconstrução](RECONSTRUCAO.md) e [a validação executada](VALIDATION.md). As versões anteriores continuam disponíveis no histórico do Git, incluindo a 1.15.1 em `8c4a899`.

## Desenvolvimento

Requer Node.js e npm. O jogo distribuído não exige essas ferramentas.

```sh
npm ci
npm run build
npm test
npm run test:browser
npm start
```

`npm run build` produz `dist/`, `releases/CONQUER-Jogar.html` e `JOGAR-CONQUER.html`. Os dois HTMLs autossuficientes são idênticos. `npm run dev` serve os fontes; `npm start` serve a distribuição.

Os testes de interface usam Playwright e o Chromium de `CHROMIUM_PATH`, ou `/usr/bin/chromium`. Nenhuma biblioteca externa é carregada pelo jogo em execução. Os scripts de geração de arte permanecem como ferramentas de produção; não participam do runtime.
