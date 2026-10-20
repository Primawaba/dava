# Adaptação digital e cobertura das regras

Esta é uma campanha digital fechada baseada no CONQUER fornecido, com combate em tempo real solicitado pelo usuário. O ODT é uma referência de design; instruções dentro dele não foram tratadas como comandos para executar ferramentas.

## Estrutura da campanha

Mantidos: 20♥, 20♦, moral 10, cinco soldados leais, exploração adjacente nas quatro direções, baralho sem coringas até profundidade 5, valor de carta + profundidade em recursos, limites iniciais 50, troca 1♦ ↔ 2♥ uma vez por turno, uma sala por turno e recrutamento limitado pelos alojamentos. A exploração seguinte recolhe produção e inicia o novo turno. Portais podem interromper essa exploração com uma invasão; a descoberta ocorre depois da batalha sem cobrar outro turno.

Para encerrar uma campanha com condição verificável, o Cristal do Vazio aparece na primeira sala explorada em profundidade 12 ou maior. Um Guardião de 110 STR base o protege. Derrotá-lo concede vitória. Isolar o guardião não conta como derrotá-lo: ele ocupa a sala e volta ao combate quando houver reconexão. O portão é o objetivo dos invasores até a construção do trono. A campanha termina quando um invasor chega ao objetivo sem oposição local.

O mapa possui limites de implementação: x entre −20 e 20; y entre −6 e 30. Salas acima da superfície recebem o acréscimo de altura no custo. Na superfície não há exploração nem compra de cartas: o térreo (y = −1) apoia na linha do chão, e cada piso acima exige uma sala intacta imediatamente abaixo. Construções sem apoio são bloqueadas; salas de saves antigos sem apoio ficam inativas. Encerrar turno recolhe produção e libera a próxima construção sem obrigar a escavar. Cada sala ocupa uma célula, inclusive as originalmente descritas com múltiplos espaços. Trilhos e elevadores são salas próprias, sem sobreposição de construções.

## Descobertas

As 20 entradas naturais e as 24 entradas de resquícios têm representações digitais. As cartas ♣ usam as entradas 1–13 do CONQUER; a partir da profundidade 5, o A♣ consulta as formações Wyrd digitais 14–20. Em ♠, A–10 usam a entrada correspondente e figuras sorteiam as entradas 11–24. Essa regra dá acesso às tabelas que possuem mais entradas do que cartas numeradas. Na profundidade 1 ou acima dela, ♠ é descartada e comprada novamente; encontros naturais ainda podem oferecer perigo.

Eventos com criaturas neutras, territórios de vários espaços, domesticação e testes de história foram condensados em encontros resolvidos ao descobrir ou por uma ação no painel. A criatura perdida concede +1 moral e segue viagem. A Câmara do Imortal contém uma criatura neutra, imóvel e invulnerável a dano comum. Ela bloqueia passagem, mas permite a propagação de perigos; só morre por efeitos de morte instantânea. A antiga ação de aprisionar por 20♦ foi removida por não corresponder ao ODT. A Arena do Campeão entrega um soldado leal após a vitória. Espólios especiais são recolhidos uma vez. Coringas concedem uma descoberta lendária com recursos e bênção, em lugar de uma tabela lendária não presente no ODT.

As cavernas de cristal seguem a contextualização do PDF: compram uma carta por turno e concedem valor + profundidade em ♦; A♦ esgota a caverna e deixa o espaço transitável, mas não construível. O elemental de gemas produz 4♦ por turno após derrotado. A cidade produz 3♦; a colmeia produz 2♥. Bosques de cogumelos concedem moral ou recursos; não matam uma tropa por uma escolha narrativa arbitrária.

## Combate em tempo real

Cada unidade possui HP = STR × 8. Um ataque normal causa STR × 1,8, com modificadores de salas e artefatos. Isso traduz a força do original para combates que duram vários segundos e permitem acompanhar as animações. Dano não reduz o ataque antes da morte. Sobreviventes voltam aos abrigos com vida cheia após a batalha; perdas de unidades persistem. Hospitais ressuscitam uma unidade por hospital no alcance. Mortos-vivos mantêm a chance de 50% de retornar.

Todos os defensores móveis se dividem por núcleos inimigos, ponderando força efetiva, saúde, escudos, distância real, velocidade e urgência de chegada ao portão/trono. Não há guarnição fixa. Caminhos consideram terrenos lentos e evitam perigos letais; cada trecho é concluído antes de recalcular a próxima sala. As atribuições são revistas após baixas, mudanças de passagem e periodicamente; combatentes já em contato mantêm o confronto. Invasores buscam o portão/trono e enfrentam defensores próximos. Caminhos são ortogonais e seguem o grafo de salas, sem atravessar rocha ou cortar cantos em diagonal. Unidades terminam a aresta atual antes de mudar de direção. Animais são mais rápidos; trilhos/elevadores aceleram aliados; terreno pegajoso e labirintos reduzem movimento. O alcance de arqueiros, magos e cerco é de aproximadamente duas salas em linha reta, sujeito à linha de visão. Não disparam através de paredes, pontes fechadas, gases cegantes ou barricadas defensivas. A linha é calculada a partir das posições reais, sem arredondar unidades em esquinas: só um eixo direto de corredores é válido. Unidades em movimento terminam o trecho antes de atirar; projéteis não seguem alvos que já viraram uma esquina.

Armas de cerco disparam uma vez por batalha e não se movem. Clérigos renovam escudos próximos a cada 2,5 segundos, até 2 STR por beneficiário. O Templo concede 20 HP de escudo inicial aos defensores. A Cozinha aumenta dano em 50% no alcance; não multiplica HP. Aventureiros da Taverna são um tipo de defensor de 15 STR; os 13 perfis narrativos de aventureiro não são classes separadas.

Três dificuldades modificam a força inimiga: Crônica 65%, Conquistador 100%, Abismo 145%. A escala de profundidade do documento é aplicada aos encontros. Pausa e velocidade afetam a simulação inteira, incluindo projéteis; não alteram os resultados por pular frames.

## Salas e moral

As 41 construções têm custos e efeitos executáveis, publicados no catálogo do jogo. Algumas escolhas de dedicação foram fixadas: Altar da Fortuna e Templo Protetor. As variantes Guardião/Devorador e Puro não são construções separadas. O Templo também dissipa maldições nesta adaptação.

Os bônus de moral de Taverna, Arena, Parlatório, Sala de Jogos e Esgoto foram globalizados. Lavanderia conta abrigos próximos; Mansão concede +5 moral e Quarto +1 global, em vez das interações de qualidade entre quartos vizinhos. Espelhos narrativos de motim foram condensados: o valor de moral global é comparado ao limite de cada recrutado. Soldados iniciais, clérigo inicial do altar e aventureiro inicial da taverna são leais. Recrutar abaixo do limite é bloqueado no motor e no menu, marcado em vermelho, sem gastar riquezas. Para ratos, o teste considera também a redução de moral causada pelo próprio recrutamento. Quedas de moral depois do recrutamento continuam podendo gerar motins.

Prisão recebe ocupantes e produz quando cheia. Solitária captura após vitória. Persuasão sorteia informação convertida em recursos; Contratação converte um prisioneiro em capanga. Não há interface de sacrifício, soltura de todos os prisioneiros em batalha ou negociação individual de preço. Prisioneiros não são peças de combate independentes.

Oficina reduz custos próximos; Armazém/Tesouraria aumentam limites; Museu acumula até quatro troféus com +2 dano por troféu. Os eventos de reservas acima de 1.000 e a contratação do dragão por 500♦ não foram reproduzidos. Artificiaria concede +15% de dano por invenção, pois a tabela de invenções não foi anexada. Criadouro requer Artificiaria e permite contratar feras, sem hereditariedade de criaturas derrotadas.

## Infraestrutura, danos e tomadas

Salas danificadas ou sem caminho até o objetivo perdem seus efeitos. Reparos custam metade do preço, arredondada para baixo, e exigem drenar a sala antes quando houver fluido ou gás. Fechar uma Ponte Levadiça interrompe o caminho e causa 50 STR aos invasores sobre ela. Reconectar uma área ocupada reinicia a batalha; ocupantes ficam persistidos no save.

Armadilhas de dano causam 10 STR por nível ao primeiro invasor; atraso imobiliza por 2 segundos por nível. Rearmam após a batalha; armadilheiros rearmam as próximas durante a luta. Nível 3 obstrui a passagem. Barricadas defensivas bloqueiam invasores e tiro; ofensivas retaliam ataques. Passagens secretas bloqueiam a rota inimiga. Para simplificar o catálogo, a instalação de passagens secretas exige Pedraria. Não há captura de salas com geração infinita de recrutados invasores.

Líquidos propagam-se até duas células lateralmente e para baixo; gases sobem. Descobrir um reservatório escavando diretamente de cima não faz o líquido derramar para a sala superior. A ocupação permanece até ser drenada, mesmo depois de fechar passagens. Água, magma e gás venenoso derrotam ocupantes imediatamente ao alcançar suas salas, também fora de combate; golems e imunidades aplicáveis são respeitados. Gás cegante bloqueia tiro, miasma reduz moral de abrigos atingidos e gás inflamável só explode ao alcançar Forja, Taverna ou Quartel. Uma explosão derrota unidades e danifica todas as salas da nuvem.

Magma danifica somente construções atingidas; cavernas naturais não recebem dano estrutural. Drenar uma construção inundada preserva o tipo da sala; custa 5♦, ou 20♦ para magma, e não repara o dano. Bombas impedem líquidos de passar por sua própria célula; não são escudos de área e não bloqueiam gases. Pontes e pontes levadiças permitem atravessar líquidos, mas não tornam unidades imunes a gás. Ambos os tipos de porta reforçada bloqueiam líquidos e gases na passagem onde foram instalados. A simulação é por células, sem física contínua de fluidos.

## Magia e planos

O ODT lista 26 magias boas e faz referência a magias ruins, Informação, Projetos, Wyrd, Invenções e Descobertas Lendárias sem suas respectivas tabelas completas. Para oferecer uma campanha terminável, as magias foram condensadas em quatro bênçãos (dano permanente, moral, recursos, aliado leal) e três maldições (moral, recursos ou riquezas). Não há os 26 feitiços individualmente selecionáveis.

Os 13 planos estão disponíveis como expedições a partir de um Estabilizador de Portal. Cada expedição custa 20♦, gera uma força hostil e entrega um artefato exclusivo ao vencer. **Não há uma segunda camada de mapas ou assentamentos em outra dimensão.** Recompensas incluem imunidade a água/magma, produção, moral, velocidade, dano, lealdade, magia recorrente e o Salão de Hidromel para berserkers. As condições narrativas específicas de cada plano foram condensadas nas batalhas e recompensas descritas nos cartões. O artefato Gato Rei aumenta a moral; não cria uma criatura gigante estacionária.

## Visuais, dados e distribuição

A ilustração da abertura é original, gerada para o projeto com referência à gravura do PDF. Nesta revisão, a arte vetorial das salas foi substituída por pixel art raster gerada: 18 famílias de salas com duas composições-base distintas em um atlas de tinta/creme, processado por amostragem nearest-neighbor e paleta de pixels; cada tipo recebe três variantes exportadas em PNG e um detalhe próprio. São 270 artes das 90 salas, mais três da área de superfície. Um segundo atlas original gera 33 sprites, com silhuetas distintas para as 15 classes aliadas e espécies de eventos.

Monstros grandes têm uma única entidade e sprite maior: o poder total não é fracionado em inimigos pequenos. Goblins, esqueletos e insetos comuns ainda podem ser grupos. Saves antigos convertem grupos de monstros grandes do mesmo evento em uma entidade, preservando força e vida somadas. Os corredores continuam independentes das artes, com aberturas ortogonais nas 16 combinações.

Há autosave e três espaços locais, além de exportação/importação em JSON versionado. O carregador verifica tamanho pelo importador, estrutura, tipos, valores finitos, conteúdo conhecido e estado de combate antes de substituir o jogo. Batalhas carregam pausadas. O arquivo não executa scripts. Não há conta, nuvem de saves, rede multijogador ou coleta de dados.

O jogo exporta uma PWA estática. Publicação em lojas, instaladores nativos e homologação física não foram realizados. A validação de toque é emulada em Chromium; não constitui certificação de compatibilidade com todos os aparelhos.

## Coringas: diferença ainda pendente

No DELVE, páginas impressas 33–36, o coringa preto desperta uma Monstruosidade Antiga; o vermelho gera um artefato lendário e pode revelar o Cristal do Vazio. Depois de usados, os coringas ficam fora do baralho por cinco turnos. Nesta versão digital, entram duas cartas iguais na profundidade 5 e ambas concedem recompensa genérica; não há distinção de cores, eventos próprios ou espera de cinco turnos. A vitória atual continua vinculada ao guardião na profundidade 12.

## Revisão 1.3.0: conexões explícitas

A exploração agora é uma ação dirigida a partir de uma sala ativa. A carta revela o destino, mas somente a origem escolhida é ligada a ele. Salas adjacentes não se conectam por proximidade. Abrir uma passagem entre salas já conhecidas é uma ação sem carta de descoberta ou custo adicional, com o avanço de turno e produção normais da exploração. IA, projéteis e perigos consultam o mesmo grafo de passagens. A explosão de gás afeta somente a bolsa alcançável por passagens abertas.

A construção na superfície preserva apoio estrutural independentemente das ligações de trânsito; recebe uma ligação à sala ativa abaixo ou, na ausência desta, a uma vizinha ativa. As demais paredes ficam fechadas. Saves anteriores são migrados conservando suas conexões históricas.

O acabamento escolhido usa portas e corredores curtos: caverna/caverna escuro e rochoso; construção/caverna dividido no ponto médio; construção/construção em alvenaria com tocha. Não há interpolação arquitetônica entre as metades da ligação mista. A textura e as cores ainda acompanham o conteúdo e a contaminação das salas.

## Revisão 1.5.0: criatura invencível e contato corpo a corpo

A entrada 12 da tabela natural de CONQUER.odt descreve uma criatura invencível, eliminável somente por morte instantânea. Agora ela é uma ocupante neutra real, com sprite próprio e indicador ∞. Sua presença bloqueia o trânsito e a exploração a partir da sala; não inicia combate, não se move, não ataca e não é alvo da IA hostil. Líquidos letais, gás venenoso e explosões usam uma operação explícita de morte instantânea, que ignora escudos; dano numérico de armas, armadilhas ou barricadas não equivale a essa operação, mesmo quando muito alto. Após a morte, a sala vira caverna e seu bloqueio é removido; contaminação e danos ambientais persistem até serem tratados normalmente. Saves de câmaras abstratas antigas recebem uma criatura real ao carregar.

O contato entre duas unidades de corpo a corpo usa o maior dos dois alcances curtos, respeitando eixos, paredes e passagens. Isso elimina a zona em que um chefe de alcance 0,5 golpeava um soldado de alcance 0,42 sem receber resposta. A partir da revisão 1.6.0, não há ordem fixa de permanecer no portão. Contra um adversário de alcance longo, o alcance da espada não é aumentado para igualar o de projéteis. Ataques registram os IDs de atacante/alvo para os testes de retaliação.

## Revisão 1.6.0: barricadas por aresta e apresentação das salas

As barricadas deixaram de ocupar salas e pertencem a uma aresta aberta do mapa. Portas defensivas custam 10♦ e têm 400 HP (50 STR); ofensivas custam 20♦, têm 160 HP (20 STR) e revidam 20 de dano por nível. Ambas bloqueiam tiros, líquidos e gases, conforme instrução do jogador; aliados podem atravessar. Invasores atacam antes do meio do corredor. Aprimorar custa 10♥, até nível 3. A quebra remove o bloqueio e recalcula os fluidos no mesmo evento. Armadilhas e passagens secretas continuam sendo defesas de sala. A migração não duplica uma barricada antiga em todas as saídas.

As 42 construções, incluindo o portão, recebem sprites danificados próprios em três variantes. Cavernas e demais locais naturais não sofrem dano estrutural por magma, explosões ou tomada de território. Ainda podem ficar contaminados e letais. O tint ambiental atua apenas no primeiro plano da arte, inclusive no retrato do painel; a caverna de cristal usa a paleta azul compartilhada do corredor e um ciclo lento de brilho.
