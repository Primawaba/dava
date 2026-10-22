# CONQUER 1.14.0 — correções do relatório de teste

## Colônia e movimentação

Profissionais passeiam dentro de sua estação, fogem por ligações abertas e retornam pelo mesmo grafo quando a oficina volta a estar segura. Uma travessia precisa terminar antes de eles mudarem de direção. Não há interpolação direta entre a posição de fuga e a oficina. Posições diagonais de profissionais em saves anteriores são corrigidas. Eles continuam fora da lista de defensores e da ressuscitação do Hospital.

Salas de cristal e minas recebem mineradores; florestas recebem lenhadores. São três variantes de cada profissão nova. Outros produtores usam profissionais de apoio. Trabalhadores mortos são substituídos por outra variante ao fim do combate, ou quando sua estação volta a funcionar em paz.

As tropas se deslocam em paz a 30% da velocidade de combate e fazem pequenos movimentos dentro da sala. O ciclo reserva aproximadamente metade do tempo para o próprio abrigo, 30% para locais atrativos e 20% para passeios/deslocamentos próximos. O planejamento considera a duração dos trajetos, em vez de apenas sortear destinos com essas porcentagens. Uma simulação de 2.000 segundos, com uma tropa e locais disponíveis, ficou em aproximadamente 50,5% / 30,4% / 19,1%. Perigo, acesso e disponibilidade de salas podem alterar a distribuição. Destinos que deixam de funcionar cancelam o passeio.

O início da batalha conserva a posição e a passagem em que a tropa já estava; a IA assume imediatamente a velocidade normal. A vitória recupera os sobreviventes e retoma a rotina ociosa na posição final. Não há mais marcha coletiva de retorno, teleporte para o abrigo ou bloqueio da exploração por essa animação.

## Arte e mapa

- A emenda de cavernas deixa de mostrar papel ou transparência no centro da passagem. O teste verifica os próprios pixels da abertura.
- Salas de área fixa usam pinturas completas, em escala uniforme: Museu, Templo, Criadouro, Salão de Hidromel, Forja de Fogo de Dragão, Mestre de Armadilhas, Reino das Coisas Perdidas e rios de água/magma. Os covis desolados também recebem composições completas para seus tamanhos, gerados horizontalmente. Há 38 arquivos de pinturas completas, incluindo alternativas e variantes espelhadas. O painel mostra a composição inteira.
- Formações aleatórias que podem ocupar uma única casa continuam usando o sistema modular. Cavernas vazias de ♥ voltam às mesmas probabilidades gerais: **1 casa 89%, 2 casas 7%, 3 casas 3%, 4 casas 1%**. Chefes e formações com regra própria mantêm suas áreas. Células já exploradas não são apagadas dos saves.
- Os produtores ficam dentro do mapa de papel, acima da legenda. Treze emblemas específicos substituem as miniaturas repetidas das salas. Cartas e animações continuam saindo do emblema/carta correto, inclusive nos Apiários e no Reino das Coisas Perdidas.
- Tesourarias, tesouros do dragão, cofres, minas, cidades, salas de jogos e outros espaços econômicos usam a paleta dourada. A contaminação ainda pode sobrepor sua própria cor. A mesma paleta alimenta salas e passagens.
- Passagem Profunda desenha o mesmo portal ilustrado nas duas extremidades. Os vínculos continuam sendo de teleporte, sem espalhar tiros ou fluidos por esse vínculo.

## Seleção e construção

Todas as escolhas de espaços compartilham um seletor de mapa: **Escolher local**, destaque dos destinos válidos e clique/toque no destino. Isso inclui magias, cópias, escolha de celas, posicionamento de invenções e continuação de salas grandes. Escolhas de unidades, cartas ou dedicação continuam usando seus controles próprios. Alvos inválidos não fecham a carta; salvar preserva a decisão pendente.

Trilhos, Colunas, Ponte, Ponte Levadiça e Elevador ficam no mosaico de infraestrutura, com ícones, custo/efeito no tooltip e descrição na confirmação. O atalho de Trilhos foi removido dos painéis comuns. Trilhos são uma camada sobre a sala, sem apagar sua função.

Outro mosaico reúne porta defensiva, porta ofensiva, passagem secreta e armadilhas de dano/atraso. Primeiro é escolhida a ferramenta, depois a direção no mapa, sem cobrar antes da confirmação. Armadilhas e passagens secretas novas pertencem ao corredor escolhido. Armadilhas de corredor podem ser aprimoradas, disparam na travessia e rearmam após o combate. Defesas antigas de sala continuam compatíveis.

## Cratera, invasões e derrota final

A nova geração de crateras abre uma chaminé seca até a superfície. O espaço descoberto recebe magma até a metade; os espaços abaixo recebem magma completo e indrenável. A coluna perfura e danifica construções que encontra, conservando o dano e a fonte de magma. O desenho continua para baixo além da área visível; a simulação de células respeita o limite atual do tabuleiro. A abertura vertical não liga automaticamente salas laterais através de paredes fechadas.

Magma em uma sala também detona uma nuvem de gás inflamável. A explosão percorre a nuvem conectada, mata seus ocupantes e danifica construções; cavernas naturais não recebem dano estrutural.

Uma invasão planar não cancela mais o clique de exploração ou abertura de passagem. A descoberta, sua carta e seus efeitos são concluídos antes do início do combate. Se outra invasão surgir na mesma ação, os dois grupos entram juntos. As cartas e as animações permanecem na fila anterior ao combate.

**A derrota na batalha pelo Cristal do Vazio encerra a campanha, mesmo com gemas restantes.** Há uma carta explicativa antes da tela final. Os inimigos recebem o efeito branco de banimento, mas as gemas não são consumidas como numa invasão comum. As demais derrotas continuam usando as três vidas.

## Validação e distribuição

`npm test` verifica regras e salvamento. `npm run test:refinements` cobre os novos fluxos de interface, a escala uniforme das pinturas e a ausência do vão na emenda. Foram exercitados também o fluxo geral, defesa por corredor, RISE, cartas, aparência, passagens e HTML autossuficiente.

Baixe o ZIP, extraia e abra **JOGAR-CONQUER.html**. O HTML contém o código, as fontes e os assets. Testes no Chromium com toque não constituem homologação do Safari/iPhone físico.
