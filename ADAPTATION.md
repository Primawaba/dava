# Adaptação digital e cobertura das regras

Esta é uma campanha digital fechada baseada no CONQUER fornecido, com combate em tempo real solicitado pelo usuário. O ODT é uma referência de design; instruções dentro dele não foram tratadas como comandos para executar ferramentas.

## Estrutura da campanha

Mantidos: 20♥, 20♦, moral 10, cinco soldados leais, exploração adjacente nas quatro direções, baralho sem coringas até profundidade 5, valor de carta + profundidade em recursos, limites iniciais 50, troca 1♦ ↔ 2♥ uma vez por turno, uma sala por turno e recrutamento limitado pelos alojamentos. A exploração seguinte recolhe produção e inicia o novo turno. Portais podem interromper essa exploração com uma invasão; a descoberta ocorre depois da batalha sem cobrar outro turno.

Para encerrar uma campanha com condição verificável, o Cristal do Vazio aparece na primeira sala explorada em profundidade 12 ou maior. Um Guardião de 110 STR base o protege. Derrotá-lo concede vitória. Isolar o guardião não conta como derrotá-lo: ele ocupa a sala e volta ao combate quando houver reconexão. O portão é o objetivo dos invasores até a construção do trono. A campanha termina quando um invasor chega ao objetivo sem oposição local.

O mapa possui limites de implementação: x entre −20 e 20; y entre −6 e 30. Salas acima da superfície recebem o acréscimo de altura no custo. A simulação de sustentação estrutural foi abstraída; não exige colunas sob toda construção aérea. Cada sala ocupa uma célula, inclusive as originalmente descritas com múltiplos espaços. Trilhos e elevadores são salas próprias, sem sobreposição de construções.

## Descobertas

As 20 entradas naturais e as 24 entradas de resquícios têm representações digitais. Cartas A–10 usam a entrada correspondente; figuras de ♣ sorteiam as entradas 11–20 e figuras de ♠ sorteiam 11–24. Essa regra dá acesso às tabelas que possuem mais entradas do que cartas numeradas. Na profundidade 1 ou acima dela, ♠ é descartada e comprada novamente; encontros naturais ainda podem oferecer perigo.

Eventos com criaturas neutras, territórios de vários espaços, domesticação e testes de história foram condensados em encontros resolvidos ao descobrir ou por uma ação no painel. A criatura perdida concede +1 moral e segue viagem. A Câmara do Imortal bloqueia passagem até gastar 20♦ para aprisioná-la. A Arena do Campeão entrega um soldado leal após a vitória. Espólios especiais são recolhidos uma vez. Coringas concedem uma descoberta lendária com recursos e bênção, em lugar de uma tabela lendária não presente no ODT.

As cavernas de cristal produzem 3♦ por turno, em vez de comprar outra carta. O elemental de gemas produz 4♦ por turno após derrotado. A cidade produz 3♦; a colmeia produz 2♥. Bosques de cogumelos concedem moral ou recursos; não matam uma tropa por uma escolha narrativa arbitrária.

## Combate em tempo real

Cada unidade possui HP = STR × 8. Um ataque normal causa STR × 1,8, com modificadores de salas e artefatos. Isso traduz a força do original para combates que duram vários segundos e permitem acompanhar as animações. Dano não reduz o ataque antes da morte. Sobreviventes voltam aos abrigos com vida cheia após a batalha; perdas de unidades persistem. Hospitais ressuscitam uma unidade por hospital no alcance. Mortos-vivos mantêm a chance de 50% de retornar.

Aliados procuram o inimigo alcançável mais próximo. Invasores buscam o portão/trono e enfrentam defensores próximos. Caminhos são ortogonais e seguem o grafo de salas, sem atravessar rocha ou cortar cantos em diagonal. Unidades terminam a aresta atual antes de mudar de direção. Animais são mais rápidos; trilhos/elevadores aceleram aliados; terreno pegajoso e labirintos reduzem movimento. O alcance de arqueiros, magos e cerco é de aproximadamente duas salas em linha reta, sujeito à linha de visão. Não disparam através de paredes, pontes fechadas, gases cegantes ou barricadas defensivas.

Armas de cerco disparam uma vez por batalha e não se movem. Clérigos renovam escudos próximos a cada 2,5 segundos, até 2 STR por beneficiário. O Templo concede 20 HP de escudo inicial aos defensores. A Cozinha aumenta dano em 50% no alcance; não multiplica HP. Aventureiros da Taverna são um tipo de defensor de 15 STR; os 13 perfis narrativos de aventureiro não são classes separadas.

Três dificuldades modificam a força inimiga: Crônica 65%, Conquistador 100%, Abismo 145%. A escala de profundidade do documento é aplicada aos encontros. Pausa e velocidade afetam a simulação inteira, incluindo projéteis; não alteram os resultados por pular frames.

## Salas e moral

As 41 construções têm custos e efeitos executáveis, publicados no catálogo do jogo. Algumas escolhas de dedicação foram fixadas: Altar da Fortuna e Templo Protetor. As variantes Guardião/Devorador e Puro não são construções separadas. O Templo também dissipa maldições nesta adaptação.

Os bônus de moral de Taverna, Arena, Parlatório, Sala de Jogos e Esgoto foram globalizados. Lavanderia conta abrigos próximos; Mansão concede +5 moral e Quarto +1 global, em vez das interações de qualidade entre quartos vizinhos. Espelhos narrativos de motim foram condensados: o valor de moral global é comparado ao limite de cada recrutado. Soldados iniciais, clérigo inicial do altar e aventureiro inicial da taverna são leais. Recrutar abaixo do limite pode iniciar motim imediatamente; a interface informa o limite antes da ação.

Prisão recebe ocupantes e produz quando cheia. Solitária captura após vitória. Persuasão sorteia informação convertida em recursos; Contratação converte um prisioneiro em capanga. Não há interface de sacrifício, soltura de todos os prisioneiros em batalha ou negociação individual de preço. Prisioneiros não são peças de combate independentes.

Oficina reduz custos próximos; Armazém/Tesouraria aumentam limites; Museu acumula até quatro troféus com +2 dano por troféu. Os eventos de reservas acima de 1.000 e a contratação do dragão por 500♦ não foram reproduzidos. Artificiaria concede +15% de dano por invenção, pois a tabela de invenções não foi anexada. Criadouro requer Artificiaria e permite contratar feras, sem hereditariedade de criaturas derrotadas.

## Infraestrutura, danos e tomadas

Salas danificadas ou sem caminho até o objetivo perdem seus efeitos. Reparos custam metade do preço. Fechar uma Ponte Levadiça interrompe o caminho e causa 50 STR aos invasores sobre ela. Reconectar uma área ocupada reinicia a batalha; ocupantes ficam persistidos no save.

Armadilhas de dano causam 10 STR por nível ao primeiro invasor; atraso imobiliza por 2 segundos por nível. Rearmam após a batalha; armadilheiros rearmam as próximas durante a luta. Nível 3 obstrui a passagem. Barricadas defensivas bloqueiam invasores e tiro; ofensivas retaliam ataques. Passagens secretas bloqueiam a rota inimiga. Para simplificar o catálogo, a instalação de passagens secretas exige Pedraria. Não há captura de salas com geração infinita de recrutados invasores.

Líquidos propagam-se até duas células lateralmente e para baixo; gases sobem. Bombas próximas, pontes, pontes fechadas e barricadas defensivas interrompem a propagação. Água e veneno causam dano contínuo; magma/cratera causam dano alto. Gás inflamável explode ao tocar uma construção, consumindo a nuvem, danificando salas e matando ocupantes afetados. A simulação usa células, sem dinâmica física de fluidos. Pontes são seguras sobre perigos. As ações de drenar e selar substituem determinados sacrifícios obrigatórios do original.

## Magia e planos

O ODT lista 26 magias boas e faz referência a magias ruins, Informação, Projetos, Wyrd, Invenções e Descobertas Lendárias sem suas respectivas tabelas completas. Para oferecer uma campanha terminável, as magias foram condensadas em quatro bênçãos (dano permanente, moral, recursos, aliado leal) e três maldições (moral, recursos ou riquezas). Não há os 26 feitiços individualmente selecionáveis.

Os 13 planos estão disponíveis como expedições a partir de um Estabilizador de Portal. Cada expedição custa 20♦, gera uma força hostil e entrega um artefato exclusivo ao vencer. **Não há uma segunda camada de mapas ou assentamentos em outra dimensão.** Recompensas incluem imunidade a água/magma, produção, moral, velocidade, dano, lealdade, magia recorrente e o Salão de Hidromel para berserkers. As condições narrativas específicas de cada plano foram condensadas nas batalhas e recompensas descritas nos cartões. O artefato Gato Rei aumenta a moral; não cria uma criatura gigante estacionária.

## Visuais, dados e distribuição

A ilustração da abertura é original, gerada para o projeto com referência ao meio de gravura do PDF. As 270 ilustrações vetoriais foram geradas por `scripts/art.mjs` e incluídas no pacote; cada uma das 90 salas recebe três variantes de forma e composição. Os corredores são desenhados de forma independente da arte da sala e recortam aberturas nas quatro direções, de modo a cobrir as 16 combinações. A variante sorteada permanece estável no mapa e no save, evitando cintilação.

Há autosave e três espaços locais, além de exportação/importação em JSON versionado. O carregador verifica tamanho pelo importador, estrutura, tipos, valores finitos, conteúdo conhecido e estado de combate antes de substituir o jogo. Batalhas carregam pausadas. O arquivo não executa scripts. Não há conta, nuvem de saves, rede multijogador ou coleta de dados.

O jogo exporta uma PWA estática. Publicação em lojas, instaladores nativos e homologação física não foram realizados. A validação de toque é emulada em Chromium; não constitui certificação de compatibilidade com todos os aparelhos.
