# Relatório de balanceamento das construções — CONQUER 1.15.1

**Base analisada:** versão restaurada, commit `4818c36872511b213c0e8df97e9be30634a97498`. **Data:** 26/10/2026.

## Diagnóstico

A progressão militar básica está relativamente legível. O maior desequilíbrio está nos multiplicadores econômicos e nos bônus que afetam muitas unidades: **Oficina, Cozinha, Parlatório e Sala de Jogos entregam poder desproporcionalmente cedo**. Na outra ponta, **Quarto, artilharia e o uso militar do Laboratório** oferecem retorno baixo diante das alternativas.

Os tiers abaixo expressam função e impacto estratégico, não uma sequência obrigatória de construção nem uma nota de qualidade. Uma construção especializada pode ser fraca fora de seu contexto. O custo atual nem sempre corresponde ao tier de seu efeito: isso é justamente parte do diagnóstico.

A análise cobre **41 construções do catálogo comum**, as seis instalações de invenções, o Salão de Hidromel e as cinco defesas de corredor. Formações naturais, salas apenas descobertas e recompensas ambientais não entram como compras comuns. O Portão é a estrutura inicial, fora da classificação de investimento.

**Legenda:** ♥ recursos; ♦ riquezas. Preços das tabelas são os nominais do catálogo, por construção inteira. Templo e Museu ocupam duas casas; Criadouro ocupa quatro. Oficina, altura na superfície e efeitos especiais podem modificar o preço. O custo das tropas, pesquisa, instalação e pré-requisitos vem além da construção.

Esta é uma análise do código executado, apoiada em verificações controladas do motor. Não é uma medição de taxa de vitória em campanhas nem uma simulação estatística de todo o combate. Ao usar retorno econômico, considero produção ativa, espaço nas reservas e ausência de perdas excepcionais.

## Tier 0 — O Básico

Estruturas que sustentam o início e a primeira expansão. São um conjunto de ferramentas: não é necessário construir todas imediatamente. A partida já começa com cinco guardas leais e 20♥/20♦; depósitos tornam-se necessários quando o limite inicial de 50 começa a restringir a expansão.

| Construção | Custo | Papel e avaliação |
|---|---:|---|
| **Quartel** | 8♥ | Referência da economia militar. Dez vagas para soldados/arqueiros; baixo investimento inicial e unidades fáceis de comparar. Bom parâmetro para precificar alternativas. |
| **Canil** | 5♥ | Alternativa inicial móvel: cães rápidos e com menor exigência de moral. Na revisão de captura, o Canil recebe monstros específicos derrotados como aliados imediatos, além de recrutar cães. |
| **Cabana** | 5♥ | Abrigo barato para desleais, até 30 STR e dez ocupantes. Resolve acesso à mão de obra militar; não oferece uma unidade poderosa por si só. |
| **Armazém** | 20♥ | Aumenta o teto de recursos em 50. É infraestrutura de capacidade, não produção. Forte quando o jogador perde coleta por estar no limite; fraco se construído muito antes disso. |
| **Tesouraria** | 20♥ | Aumenta o teto de riquezas em 50. O papel inicial é básico; a contratação de dragão com reservas de 500♦ é uma especialização tardia da mesma estrutura. |
| **Ponte** | 5♥ | Ferramenta fundamental para atravessar fontes indrenáveis. Barata de propósito: cobrar muito para contornar uma descoberta perigosa transformaria exploração em punição. |
| **Sala de persuasão** | 25♥ | Movida para Tier 0 por decisão de design: será a entrada do sistema de informações que destranca estruturas. Na revisão de captura, recebe seu próprio prisioneiro sem depender da Solitária. A rolagem de Informação existente continua em 25%; a futura pesquisa por conhecimento ainda precisa ser definida. |

**Dependência resolvida por decisão do autor:** Interrogatório tem captura própria no Tier 0. Solitária mantém Tier 1 e serve ao recrutamento. Consulte `GRUPOS-DE-DESBLOQUEIO.md` para os pacotes, preservando os tiers.

**Leitura:** manter acesso fácil a esse grupo. Armazém e Tesouraria não deveriam virar compras obrigatórias no primeiro turno; seu valor surge com o crescimento da economia.

## Tier 1 — Avanços

Introduzem subsistemas, novos papéis ou soluções locais. Em geral, precisam de tropas, posicionamento, descobertas ou tempo para render.

| Construção | Custo | Papel e avaliação |
|---|---:|---|
| **Biblioteca** | 15♥ | Introduz magos e concede uma magia boa ao construir. Boa entrada no sistema mágico. Construções repetidas também concedem magia: merece acompanhar a possibilidade de acumular bibliotecas vazias apenas pelo efeito inicial. |
| **Forja** | 10♥ + 14♦ | Abre armadilhas, armadilheiros e cerco. O valor está no que permite comprar depois; seus desbloqueios não são poder gratuito. |
| **Posto de cerco** | 10♥ | Amplia a implantação de artilharia, mas exige Forja e armas compradas à parte. O disparo único limita muito a força da opção atual. |
| **Laboratório** | 5♥ + 10♦ | Introduz alquimistas. Militarmente, eles custam caro para o que entregam. Com Transmutação, a estrutura muda de função e passa a sustentar uma estratégia de Tier 3. |
| **Solitária** | 15♥; 5♥ junto à Prisão | Entrada no sistema de captura. É uma ferramenta preparatória: capturar não converte imediatamente o inimigo. Grades, segurança e acomodação futura importam. |
| **Prisão** | 30♥ | Acumula prisioneiros até vinte e, cheia, produz 20♦ por produção. Tem retorno tardio e risco de fuga; não deve ser avaliada como geradora de 20♦ desde o primeiro turno. |
| **Quarto** | 20♥ | Suporta 50 STR, dez ocupantes e reduz o limite de motim em um. Custa quatro Cabanas por apenas 1,67× o teto de força de uma: parece caro fora de mapas muito apertados. |
| **Dormitório** | 5♥ | Adiciona duas vagas a cada abrigo ortogonal adjacente. Bom em centros densos; ruim ao lado de um único Quartel. Não aumenta o teto de STR das moradias com limite de conforto. |
| **Lavanderia** | 10♥ | +2 de tolerância para unidades dos abrigos cobertos, com verificação local de posição. Benefício modesto, útil perto de um limiar de motim; compete mal com os grandes bônus atuais. |
| **Arena** | 25♥ | +5 de moral global e resposta a amotinados que a atravessem. A parte de contenção depende do caminho. Seu valor fica ofuscado pelo Parlatório. |
| **Pedraria** | 20♥ | Desbloqueia barricadas e parte da infraestrutura avançada. É um investimento de acesso; o custo das defesas vem depois. |
| **Colunas** | 1♥ | Apoio auxiliar, dependente de Pedraria. Não são uma compra universal de abertura: salas apoiadas também podem sustentar construções acima. |
| **Elevador** | 5♥ | Melhora deslocamento aliado. O valor depende do tráfego efetivo; não aumenta dano ou produção diretamente. |
| **Trilhos** | 5♥ por instalação | Aceleram deslocamento, exigem Forja e podem coexistir com o conteúdo da sala. Carrinhos Armados elevam essa rede a uma especialização posterior. |
| **Bomba de fluido** | 8♥ | Prevenção localizada do fluxo de líquidos. Precisa ser colocada adequadamente; não drena uma fonte natural, não protege automaticamente vizinhos e não substitui defesa contra gás. |

**Leitura:** há boa variedade, mas Quarto e Laboratório precisam de identidade mais competitiva. O Posto de cerco só merece crescer de tier se a artilharia passar a compensar seu custo total.

## Tier 2 — Power Options

Opções com salto perceptível de poder quando usadas em sua condição correta. **Cozinha e Galeria de Esgoto estão aqui pelo efeito, embora tenham preços baixos para esse impacto.**

| Construção | Custo | Papel e avaliação |
|---|---:|---|
| **Cozinha** | 8♥ | +50% de dano aliado em 3×3. Excelente retorno quando cobre vários defensores. É um multiplicador de exército com preço de estrutura básica. Várias cozinhas não multiplicam esse bônus sobre a mesma unidade. |
| **Parlatório** | 20♥ | +15 de moral global e 2♦ por produção. Combina estabilidade ampla e renda, sem custo recorrente. É um dos maiores candidatos a ajuste. |
| **Sala de Jogos** | 20♥ + 10♦ | +10 de tolerância local e 5♦ por abrigo no alcance. A produção aceita abrigos vazios e pode acumular entre salas: grande potencial de crescimento econômico excessivo. |
| **Galeria de Esgoto** | 16♥ | +20 de tolerância local, alojamento para ratos e chance de gerar ratos gratuitos. Única por fortaleza. Muito eficiente no alcance; cada rato reduz a moral global, então o crescimento tem custo indireto. |
| **Sala de inspeção** | 15♥ | Dobra a recompensa de descobertas ♦ dentro de 5×5. Ótima numa frente ainda inexplorada; perde valor numa região já revelada. O efeito não é renda passiva infinita. |
| **Hospital** | 15♥ + 10♦ | Recupera uma unidade morta por combate no alcance. Mais valioso para tropas caras, raras ou insubstituíveis. Como sobreviventes já se curam ao vencer, seu diferencial é ressurreição, não cura comum. |
| **Taverna** | 30♥ + 10♦ | +5 de tolerância local e um aventureiro com habilidade própria. Pode oferecer capacidades de Tier 3, mas o sorteio tem grande variância. Não equivale a comprar um combatente genérico de força média. |
| **Mansão** | 50♥ + 20♦ | Abriga uma unidade de até 180 STR. Excelente para um convertido poderoso; ruim como substituto de habitação comum. Prejudica moradias vizinhas e exige planejamento de baixa densidade. |
| **Sala de quebra-cabeça** | 12♥ + 5♦ | Exige Pedraria e Forja. Reduz em 65% a velocidade inimiga na sala. Em uma passagem obrigatória com cobertura de tiro, aumenta bastante o tempo de ataque dos defensores. |
| **Ponte levadiça** | 15♥ | Acrescenta controle da conexão à travessia. Permite organizar circulação e isolamento, mas fechar a passagem pode desconectar também suas salas. Não é uma Ponte simplesmente superior em qualquer lugar. |

**Leitura:** este grupo deveria exigir decisões de orçamento. Hoje algumas opções dão retorno tão rápido que se aproximam de compras automáticas.

## Tier 3 — Especializações

Estruturas que mudam a forma de planejar a fortaleza, converter recursos ou obter poder. Não são necessariamente as melhores compras em qualquer partida.

| Construção | Custo | Mudança estratégica e condição |
|---|---:|---|
| **Oficina** | 15♥ | Reduz pela metade os dois custos das construções de sala cobertas em 5×5. Permite um distrito inteiro mais eficiente. O efeito é de Tier 3, mas está acessível cedo e sem pré-requisitos: hoje tende a ser obrigatória demais. |
| **Altar** | 20♥ | Inclui um clérigo. **Fortuna** é economia incremental, mais próxima de Tier 1; **Guardião** é defesa de Tier 2; **Devorador** transforma uma unidade e cinco de moral em magia boa, criando uma especialização de Tier 3. Não convém atribuir o mesmo poder às três dedicações. |
| **Templo protetor** | 20♥ + 20♦; 2 casas | Pureza contém uma maldição; Protetor converte 5♦ em escudo de 20 STR para uma unidade no alcance. Exige clérigo instalado, comprado ou realocado. Permite preparar proteção para peças valiosas, em vez de ampliar apenas o número de tropas. |
| **Setor de contratação** | 20♥ + 10♦ | Exige Solitária. Permite aproveitar força e espécie de um inimigo capturado. Converte vitórias em novas opções militares, mas depende de captura, resultado favorável, moradia e tolerância suficientes. |
| **Museu** | 50♥ + 50♦; 2 casas | Após matar uma criatura grande, cada Museu ativo tem 25% de chance de registrar espécie. Concede +10 STR de bônus contra uma espécie registrada às unidades no alcance. É especialização de confronto, não +2 de dano universal como sugere a descrição antiga. Um soldado de 5 STR passa a atacar como 15 STR contra a espécie coberta, sem receber a vida de uma unidade de 15 STR. |
| **Artificiaria** | 100♥ + 50♦ | Exige Forja, Biblioteca e Armazém, além de 50♦ por pesquisa. Abre invenções que mudam exploração, defesa e tropas. O valor está na árvore desbloqueada, com sorteios ruins ou repetidos como risco. |
| **Criadouro** | 80♥; 4 casas | Exige Artificiaria e Feromônios. Usa uma criatura como matriz para recrutamentos com metade de sua força e traços. É multiplicação de uma captura rara; com uma matriz fraca, pode ser um investimento péssimo. |
| **Sala do trono** | 100♥ + 100♦ | Exige Armazém e Tesouraria. Muda o objetivo dos inimigos, permitindo reorganizar a geografia defensiva. Seu preço é alto para uma construção que não concede força direta. |
| **Estabilizador planar** | 50♥, sobre Portal | Abre expedições aos treze planos e suas recompensas. Acesso a outro ciclo de progressão. A viagem custa 20♦ e o portal continua sujeito a invasões. |

**Leitura:** a classificação de Tier 3 indica acesso a uma estratégia, não sucesso automático. Matriz, troféus, alvos de captura e geometria precisam existir para que o investimento faça sentido.

## Instalações especiais e defesas

As seis instalações de invenções têm preço nominal **0♥/0♦ para colocação após desbloqueio**. Isso não significa acesso gratuito: o custo está na Artificiaria, pesquisa, sorteio e espaço. As duas oficinas maiores ocupam duas casas. Não são compras regulares do catálogo.

| Instalação | Tier | Avaliação |
|---|---:|---|
| Salão de Concertos | 3 | Manipula o destino dos invasores e favorece uma armadilha geográfica. A atração atual termina quando um inimigo alcança o foco; não tratar como controle permanente garantido. |
| Cervejaria Secreta | 3 | Dobra a força dos aventureiros. Há um acúmulo indevido confirmado ao construir cópias; esse excesso não deve ser considerado poder legítimo do tier. |
| Forja de Fogo de Dragão | 3 | Invenção concede +5 STR a arqueiros e +20 a cerco. O arqueiro-base vai de 3 para 8 STR: salto de aproximadamente 167%. O desbloqueio, o bônus e a instalação devem ser avaliados juntos. |
| Oficina do Mestre de Armadilhas | 3 | Libera nível 4, ampliando uma estratégia dedicada a defesas e rearme. |
| Portão de Ender | 3 | Aniquila criaturas aliadas e inimigas não neutras. É uma ferramenta extrema e custosa para o próprio exército, não uma vitória gratuita. |
| Localizador de Minério | 3 | Permite escolher entre duas cartas de exploração, com coringas obrigatórios. Controle de risco e de economia tem valor maior que um pequeno bônus fixo de coleta. |
| Salão de Hidromel | 3 | Recompensa planar de duas casas. Berserkers de 15 STR por 5♦ têm três vezes a força nominal por moeda de soldados de 5 STR por 5♦. Acesso e motim se o salão for danificado são contrapesos importantes. |

| Defesa de corredor | Custo inicial | Tier | Avaliação |
|---|---:|---:|---|
| Barricada defensiva | 10♦; exige Pedraria | 1 | 400 HP iniciais, bloqueia invasores, tiros, líquidos e gases. Forte proteção econômica de uma passagem. |
| Barricada ofensiva | 20♦; exige Pedraria | 2 | 160 HP iniciais e retaliação. Troca resistência por dano; não é melhoria direta da defensiva. |
| Armadilha de dano | 20♥; exige Forja | 1 → 2 | 80 HP de dano por nível. Níveis maiores passam a ser investimento de poder; aprimorar custa 20♥ por nível. |
| Armadilha de atraso | 15♥; exige Forja | 1 → 2 | Dois segundos de atordoamento por nível. Pode superar dano bruto com bastante cobertura de fogo. |
| Passagem secreta | 50♦; exige Pedraria | 3 | Altera a navegação inimiga e permite rotas aliadas distintas. Há inimigos especiais e tomadas de salas a considerar; não é proteção absoluta. |

Barricadas chegam ao nível 3, com 10♥ por aprimoramento. Armadilhas chegam ao nível 4 com a invenção correspondente. **Rearme por armadilheiro ou magia pode transformar uma combinação de defesas de Tier 1/2 numa estratégia de Tier 3.** Barricadas bloqueiam tiros: colocar arqueiros atrás de uma porta fechada não garante que eles atinjam o inimigo do outro lado.

## Comparações quantitativas

Para comparar dois recursos, uso a taxa de troca de referência **2♥ = 1♦**. Assim, `custo equivalente = ♥/2 + ♦`. Isso é custo de oportunidade, não uma moeda real única: há uma troca por turno, limites de reserva, espaço e diferença no momento de obtenção dos recursos.

### Oficina: efeito excepcional por 15♥

O motor confirmou estes preços dentro do alcance:

| Construção | Sem Oficina | Com Oficina | Economia |
|---|---:|---:|---:|
| Quartel | 8♥ | 4♥ | 4♥ |
| Mansão | 50♥ + 20♦ | 25♥ + 10♦ | 25♥ + 10♦ |
| Artificiaria | 100♥ + 50♦ | 50♥ + 25♦ | 50♥ + 25♦ |
| Sala do trono | 100♥ + 100♦ | 50♥ + 50♦ | 50♥ + 50♦ |

Quatro Quartéis cobertos economizam 16♥ e já compensam os 15♥ da Oficina. Uma única Mansão coberta economiza 45♥ equivalentes. O custo também ocupa uma casa e um turno de construção, mas o desconto é permanente. Descontos de várias Oficinas não se multiplicam entre si. Defesas e ações com preço próprio não recebem automaticamente esse desconto.

### Cozinha: melhora um exército existente sem ocupar suas vagas

Com 50 STR aliados cobertos, o bônus equivale aproximadamente ao dano de mais 25 STR, sem oferecer a vida desses combatentes. A 5♦ por soldado de 5 STR, comprar 25 STR adicionais custaria 25♦, além de vagas e da construção militar. A Cozinha custa 8♥, ou 4♦ equivalentes. Não é equivalência completa — depende de cobertura e não acrescenta HP —, mas a diferença de eficiência é grande.

### Sala de Jogos: retorno muito rápido e sem população

Custo: 20♥ + 10♦, ou 20♦ equivalentes.

| Abrigos cobertos | Renda bruta por produção | Retorno simples do custo equivalente |
|---:|---:|---:|
| 1 | 5♦ | 4 produções |
| 2 | 10♦ | 2 produções |
| 3 | 15♦ | 1,33 produção |
| 4 | 20♦ | 1 produção |

**Um teste com dois abrigos sem ocupantes produziu 10♦.** Os números da tabela não incluem o custo de erguer esses abrigos caso ainda não existam, nem perdas, limites de reserva e a penalidade K♦. Ainda assim, a tolerância vem como benefício adicional e sobreposições podem pagar novamente pelos mesmos abrigos. Em contraste, uma Prisão inicialmente vazia exige cerca de vinte produções para encher e só então começa a pagar sua renda passiva. A perda por K♦ aparece na exploração; não encontrei aplicação universal dessa penalidade para toda compra de carta.

### Parlatório: renda e estabilidade na mesma compra

Por 20♥, concede +15 de moral global e 2♦ por produção. Seu equivalente de 10♦ retorna em cinco produções, sem atribuir valor à moral. A Arena custa 25♥ e fornece +5 global, mais contenção de motim. Um Parlatório levou a moral-base de 10 para 25 no teste; dois levaram a 40. Não encontrei a morte do mais forte por K♥ implementada nessa versão, e uma compra controlada de K♥ não feriu os defensores.

### Inspeção e Fortuna

Num baralho comum sem coringas, aproximadamente um quarto das descobertas é ♦. Com valor médio 7 e profundidade 3, Inspeção acrescenta cerca de `0,25 × (7 + 3) = 2,5♦` por descoberta dentro do alcance. Seus 15♥ equivalem a 7,5♦: retorno aproximado de três descobertas locais. É uma estimativa de expectativa, não uma garantia, e precisa haver território inexplorado coberto.

Fortuna acrescenta 3♦ numa descoberta ♦: aproximadamente 0,75♦ por descoberta coberta, antes de sinergias. É uma opção incremental, significativamente menos transformadora que Devorador. O clérigo incluído no Altar também tem valor; comparar apenas essa renda subestimaria o pacote.

### Artilharia: força nominal não equivale a dano entregue

Sem bônus, uma arma de cerco de 30♦ dispara uma vez e causa `30 × 1,8 = 54 HP`. Seis arqueiros custam os mesmos 30♦ e somam 32,4 HP por salva; duas salvas totalizam 64,8 HP, com intervalo de 1,35 segundo entre elas, antes de deslocamento de projéteis. Cerco possui mais vida por vaga, imunidades e concentração de dano, enquanto arqueiros ocupam mais lugares. Mesmo assim, o disparo único enfraquece muito a justificativa de artilharia como opção de dano superior.

### Pesquisa e Taverna: incluir o custo e a variância reais

Forja, Biblioteca, Armazém e Artificiaria somam **145♥ + 64♦**, ou **136,5♦ equivalentes**; a primeira pesquisa acrescenta 50♦. Isso desconsidera Oficina, outros investimentos e custos de colocar uma invenção. A ordem e o posicionamento podem reduzir bastante esse total; pré-requisitos já construídos para outras funções não devem ser cobrados novamente como investimento incremental. Uma pesquisa não garante a invenção desejada.

A força nominal média dos treze aventureiros é aproximadamente **20,1 STR**, mas inclui Escudeiro de 100 STR que não ataca e Bêbado de 5 STR que também não luta. A média não é uma estimativa de DPS. Druida, Médico e Bruxa podem valer muito mais por suas habilidades; Mercenário cobra 5♦ por turno. A Taverna precisa ser avaliada como um sorteio de papéis.

## Problemas que precisam ser separados de ajustes de preço

1. **Cervejaria Secreta acumula multiplicações por construção.** Duas colocações gratuitas após desbloqueio elevaram um aventureiro controlado de 10 → 20 → 40 STR, sem consumir o turno normal de construção. Repetir cópias produz crescimento exponencial. O bônus deveria ser aplicado uma vez por unidade, ou a instalação deveria ser única; aumentar seu preço não resolve a causa.
2. **Descrições não representam todas as regras atuais.** Museu não é bônus universal de +2; Templo tem dedicações e clérigo como condição; Taverna não entrega o aventureiro genérico do cadastro de unidades. Corrigir apresentação é necessário antes de coletar opiniões sobre equilíbrio.
3. **Parlatório não apresenta o contrapeso K♥ previsto no documento.** Isso aumenta sua força real. É necessário decidir explicitamente se a regra será restaurada ou substituída por outro contrapeso; não precificar como se a perda já ocorresse.
4. **Sala de Jogos remunera vagas vazias e admite sobreposição de receita.** Isso incentiva construir abrigos para dinheiro, em vez de alojar tropas.
5. **Escudos, dano e STR não são a mesma medida.** Protetor adiciona 160 HP de escudo por 5♦, sem aumentar dano. Cerco de 30 STR não causa automaticamente 30 STR de baixas no disparo. Comparações devem usar o efeito executado.

## Recomendações de balanceamento

São hipóteses para testar, não alterações aplicadas nem preços já validados.

| Prioridade | Alvo | Primeiro experimento sugerido |
|---|---|---|
| **Crítica** | Cervejaria | Tornar o efeito idempotente e definir se a instalação pode ter cópias. |
| **Alta** | Oficina | Testar desconto de 25%–30% no preço atual **ou** manter 50% com custo/acesso maior. Não combinar todos os nerfs de uma vez. |
| **Alta** | Cozinha | Testar custo de 18♥–22♥ mantendo 50%, **ou** manter custo baixo com bônus de 25%. Preservar cobertura e ausência de acúmulo. |
| **Alta** | Sala de Jogos | Pagar apenas por abrigos ocupados; testar 2♦ por abrigo, teto de 6♦–8♦ por sala e impedir duplicar o pagamento do mesmo abrigo. |
| **Alta** | Parlatório | Resolver primeiro o contrapeso ausente. Se a renda permanecer, testar +5 a +8 de moral global para reduzir a superioridade sobre a Arena. Evitar equilibrar apenas adicionando perdas instantâneas mais severas. |
| **Média** | Quarto | Testar preço de 10♥–12♥, preservando 50 STR e a redução de um no limite de motim. |
| **Média** | Artilharia | Testar mais disparos limitados ou dano de área; definir se seu papel é explosão, controle ou tanque imóvel. Não usar apenas STR nominal como argumento de força. |
| **Média** | Alquimistas | Dar utilidade própria aos frascos, ou reduzir custo de recrutamento. Hoje o arqueiro compete favoravelmente em preço, alcance, vida e dano sustentado; a menor exigência de moral do alquimista não compensa tudo. |
| **Alta no novo sistema** | Persuasão e captura | Garantir o primeiro ciclo de captura, confinamento e obtenção de conhecimento; evitar que os atuais 25% de sucesso controlem sozinhos a progressão obrigatória. Separar conhecimento permanente dos resultados aleatórios da tabela de Informação. |

Eu começaria pelos acúmulos e pelos quatro multiplicadores de abertura. Fortalecer todas as construções fracas antes disso apenas elevaria a escala geral sem resolver a estratégia dominante.

## Progressões que os tiers deveriam permitir

- **Exército convencional:** Quartel → Forja/Pedraria → Cozinha e Hospital → Museu ou armamentos especiais.
- **Captura e criaturas:** Canil e captura de monstros → matriz do Criadouro; Solitária + Contratação formam um ramo separado para candidatos inteligentes.
- **Engenharia defensiva:** Pedraria/Forja → barricadas e armadilhas → atraso, rotas e rearme → Mestre de Armadilhas.
- **Economia e magia:** depósitos → Inspeção ou Fortuna → distrito de Oficina → Artificiaria ou Devorador.
- **Exploração de alto risco:** tropa estável → preparação de escudos/controle → Estabilizador → recompensas planares.

O problema atual é que várias dessas rotas tendem a convergir cedo para **Oficina + Parlatório + Cozinha**, com Sala de Jogos abastecendo o crescimento. O objetivo dos ajustes deve ser tornar outras aberturas viáveis, preservando a personalidade das construções.

## Rastreabilidade e limites

Fontes principais: `src/data.js` (preços/catálogo), `src/engine.js` (custos, produção, capacidades e combate), `src/rise.js` (conforto, contratação e altares), `src/colony.js` (tolerância local e áreas), `src/advanced-rules.js` (magias, Museu e invenções), `src/encounters.js` (aventureiros), `src/chronicle.js` (Transmutação/dragão) e `src/interactions.js` (defesas de corredor). Consultei o texto extraído de CONQUER para distinguir intenção e implementação.

Verificações pontuais reproduziram desconto da Oficina, moral de um e dois Parlatórios, compra de K♥, renda de Jogos com abrigos vazios, separação entre tolerância local e moral da Galeria, duplicação da Cervejaria e bônus por espécie do Museu. Troféus repetidos da mesma espécie no mesmo Museu não multiplicam o bônus: a checagem é por presença da espécie.

O Laboratório com Transmutação, a Tesouraria com dragão e as redes de trilhos com Carrinhos Armados são estados especializados de construções de tier inferior; isso não torna sua versão inicial uma opção de Tier 3. As avaliações assumem campanha normal, sem runas, camadas especiais, relíquias ou recompensas planares previamente adquiridas, salvo quando indicadas.

A análise original não alterou o jogo. A revisão posterior de captura implementa as decisões do autor, descritas em `GRUPOS-DE-DESBLOQUEIO.md`, sem mudar os tiers.


## Revisão de design — desbloqueios por informações de prisioneiros

A Sala de Persuasão foi movida para Tier 0 a pedido do autor. Sua classificação agora representa sua função de **infraestrutura inicial de progressão**, mesmo que o sistema de desbloqueio ainda não exista no jogo. Os demais tiers permanecem como no relatório anterior.

### Avaliação da proposta

A proposta cria um ciclo coerente com CONQUER: **explorar → enfrentar inimigos → capturar → obter informações → escolher novos desbloqueios → ampliar a fortaleza**. Vitória passa a fornecer conhecimento, além de espólios, e a captura deixa de ser uma mecânica secundária dispensável. Também cria decisões entre interrogar, contratar, sacrificar ou manter um inimigo, caso essas alternativas tenham custos e resultados distintos.

Bloquear inicialmente os tiers superiores pode resolver parte da eficiência precoce apontada neste relatório. Oficina em Tier 3 e Cozinha em Tier 2 deixam de ser compras de abertura. Por isso, os preços sugeridos anteriormente devem ser reavaliados com a progressão funcionando; não recomendo aplicar todos os nerfs ao mesmo tempo que os bloqueios.

### Requisitos para uma abertura viável

1. **O ciclo inteiro precisa funcionar no Tier 0.** A decisão posterior do autor removeu a dependência de Solitária: Sala de Persuasão agora captura seu próprio inimigo para interrogatório.
2. **O primeiro inimigo capturável precisa ser acessível.** Nem todo encontro natural atual é elegível para captura. Recomendo um encontro inicial controlado, com adversário capturável compatível com a força dos guardas e captura oferecida após a vitória. Um tutorial não deve depender de sortear a espécie correta.
3. **A infraestrutura de pesquisa não pode consumir a defesa inteira.** Persuasão de 25♥ agora dispensa os 15♥ da Solitária. A partida começa com 20♥. Ainda vale testar o momento de acesso aos primeiros recursos; o preço não está automaticamente aprovado para a nova função.
4. **Escolhas iniciais não podem bloquear sua própria fonte de progresso.** Desbloquear economia primeiro não pode tornar impossível vencer o próximo confronto necessário para obter mais informações.

### Conhecimento permanente e resultados de interrogatório

Sugiro registrar o conhecimento obtido na campanha como uma reserva própria. Ele destranca projetos, não substitui os custos de construção em ♥/♦. Assim, obter o projeto de uma Forja não cria a Forja gratuitamente nem elimina seus custos e requisitos materiais.

A atual tabela de **Informação** pode continuar produzindo segredos, riscos e recompensas. Contudo, não deve ser a única forma de receber o conhecimento obrigatório da árvore. Com 25% de sucesso independente por tentativa, a média é de quatro tentativas para um sucesso e a probabilidade de falhar quatro vezes seguidas é de aproximadamente 31,6%. Isso é variância alta para o único caminho de progressão.

Minha recomendação é garantir uma quantidade básica de conhecimento após um interrogatório concluído, usando a rolagem para bônus, rapidez, segredos ou contratempos. O avanço mínimo deve ser previsível; informações especiais podem continuar raras.

Cada prisioneiro deve ter um limite de conhecimento recuperável. Um contador ou registro persistente impede que o mesmo inimigo produza pontos indefinidamente, inclusive ao salvar/carregar ou transferi-lo entre celas. Unidades recrutadas e depois amotinadas também precisam de regras para não virarem uma fábrica de conhecimento.

### Árvore recomendada

- **Tier 0:** sobrevivência, combate básico, travessia, confinamento e interrogatório.
- **Tier 1:** primeiros projetos escolhidos com conhecimento comum; abrem ramos militar, econômico e de engenharia.
- **Tier 2:** exigem investimento maior de conhecimento e um ramo anterior desenvolvido; oferecem saltos de poder.
- **Tier 3:** exigem mais conhecimento e, em alguns casos, um projeto ou segredo específico de um inimigo relevante. Exemplos temáticos possíveis: mecanismos para Artificiaria, criação de criaturas para Criadouro ou coordenadas para Estabilizador. São propostas de design, não regras atuais.

Prefiro desbloqueios por **estrutura ou pequenos conjuntos temáticos**, em vez de liberar todo o próximo tier numa única compra. Isso preserva escolhas entre fortalecer a tropa, melhorar produção e controlar perigos. Conhecimento comum deve permitir avanço entre ramos; segredos exclusivos não podem deixar uma campanha sem saída por falta de uma espécie aleatória.

### Comunicação ao jogador

O menu deve mostrar estruturas bloqueadas, seu efeito, custo de construção e requisito de desbloqueio. Concluir um interrogatório deve apresentar uma carta com o conhecimento obtido e os projetos que ficaram disponíveis para destrancar. Um projeto destrancado fica destrancado durante a campanha, mesmo que o interrogador ou a sala sejam perdidos depois. Perder infraestrutura interrompe novas pesquisas; não deve apagar o aprendizado já obtido.

**Escopo da progressão:** os grupos estão especificados em `GRUPOS-DE-DESBLOQUEIO.md`. A árvore de desbloqueios ainda não foi implementada. As novas regras de captura e ratos foram implementadas separadamente, conforme as decisões posteriores do autor.
