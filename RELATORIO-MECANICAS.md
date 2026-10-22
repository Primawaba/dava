# Auditoria de mecânicas — CONQUER 1.11.0

Revisão de 21/10/2026, após implementação e testes da versão **1.11.0**, commit **0a55bd2**. Este documento recomenda trabalho futuro; não afirma que as recomendações já estão implementadas.

A base nova permite aproximar bastante o jogo dos documentos sem refazer a apresentação. As maiores oportunidades estão em **identidade das salas de várias casas, resolução de efeitos, coringas, magias e invenções**. A existência de uma sala ilustrada ou de uma carta de evento não significa que todas as suas regras estejam implementadas.

## Referência complementar adicionada após a auditoria

RISE: A Game of Spreading Evil também integra agora a base de regras do CONQUER. O [complemento de RISE](RISE-RULES.md) identifica suas tabelas de Informação, magias, conforto, prisioneiros e incursões, além dos conflitos com DELVE. A revisão original abaixo continua sendo o registro da auditoria 1.11.0; esta inclusão não implementa suas propostas.

## Fontes e critérios

Releitura do **CONQUER.odt** e do **DELVE November 8th Checked Version Pages.pdf**, incluindo tabelas de aventureiros, magias, Wyrd, invenções, artefatos e monstruosidades. As páginas citadas são as **impressas no PDF**; no leitor, correspondem à página física seguinte. Para o ODT, uso os títulos das seções, pois a paginação varia conforme o editor.

Prioridade de interpretação: suas decisões nesta conversa; depois as regras de CONQUER; por fim DELVE para contextualizar ou preencher tabelas ausentes. Divergências do ODT em relação ao PDF não são, por si, defeitos.

Preservar: combate em tempo real com IA, três gemas, fontes naturais não drenáveis, exploração por setas e passagens explícitas, portas que barram líquidos e gases, superfície apoiada, proteção inicial contra magma/escavador, imortal territorial, tamanho dos chefes proporcional à força, cavernas vazias em 89/7/3/1%, papel como fundo e arte sem distorção. Não proponho restaurar o combate por rodadas nem aumentar novamente a frequência das cavernas grandes.

## O que foi concluído antes desta revisão

- Encaixes contínuos de construções, tint dos dois lados e barricadas cobrindo a abertura.
- Continuação própria de cenário nos módulos dos chefes, mantendo tint e sem duplicar a criatura.
- Novas probabilidades das cavernas vazias; chefes e formações específicas usam tamanhos próprios.
- Fontes permanentes não drenáveis; pontes desenhadas sobre a ilustração original da fonte.
- Formações naturais e resquícios de várias casas; Museu/Templo de duas casas e Criadouro de quatro, com custo e capacidade únicos.
- Vitória com retorno visual das tropas; derrota com inimigos brancos, partículas e gema antes da carta de evento.

Validação concluída: **203 testes de motor**, além das suítes de navegador de acabamento, jogo, eventos, terreno, vidas, revisões, táticas/portas, passagens e HTML independente. Detalhes e limites estão em [VALIDATION.md](VALIDATION.md). Esses testes cobrem os comportamentos exercitados; não certificam fidelidade integral ao livro.

**Limite de plataforma:** os testes móveis usam Chromium com toque. Safari/WebKit real não foi validado: a instalação do navegador de teste foi bloqueada por HTTP 403. Abrir HTML na prévia do app Arquivos do iPhone também não equivale a executá-lo no Safari. Continua necessária uma rodada em iPhone real por endereço web, além do teste do arquivo quando o sistema permitir executá-lo.

## Recursos técnicos que agora podem ser aproveitados

| Recurso existente | Aplicação nas próximas mecânicas | Limite atual |
|---|---|---|
| Grafo de passagens e portas | Territórios, bloqueios, transporte e alcance por caminho real | Ligações comuns são adjacentes; teleporte precisa de outro tipo de aresta |
| Formações e módulos de construção | Uma sala ocupar várias casas sem duplicar preço, capacidade ou recompensas | A identidade ainda depende de um tile principal |
| Composição de sprites, encaixes e tint | Mostrar estados: maldição, inundação, ruína, proteção, ponte e propriedade | A imagem representa o estado; não deve definir a regra |
| Fila persistente de cartas e seleção de alvos | Escolhas, sacrifícios, artefatos, invenções e efeitos pendentes | A maioria dos efeitos já acontece antes da carta; os tipos de escolha ainda são poucos |
| Propagação de fontes e dano por sala | Bombas, válvulas, chuva artificial, explosões e imunidades | Drenagem não registra apenas a procedência que efetivamente atingiu a casa |
| IA por força/distância e filas de corredor | Encontros territoriais, escoltas, iscas e retirada | Precisam de estados próprios de comportamento, além de atributos de combate |
| Transições de combate | Retorno, banimento, ressuscitação e feedback de consequências | Retorno atual é visual; o motor já guarda a posição final |
| Semente e validação de saves | Reproduzir descobertas e testar decisões sem duplicar efeitos | Novos estados exigirão migração e validação próprias |

## Prioridades recomendadas

**P1:** corrigir comportamento incoerente ou estruturar regras centrais. **P2:** completar profundidade estratégica. **P3:** expansões e refinamentos. Complexidade é relativa, não uma estimativa de prazo.

### 1. Separar a identidade da formação do tile principal — P1, média

**Defeito confirmado por reprodução.** Uma caverna de cristal de duas casas produz 6♦ em um cenário controlado. Construir um quartel sobre sua casa principal é permitido; a outra casa continua desenhada como cristal, mas a produção seguinte é zero. O saldo fica em 6♦. A rotina `income()` ignora módulos secundários, enquanto `build()` muda o tipo do principal.

Evidência: [engine.js](src/engine.js), `expandFormation`, `income` e `build` (`discoveryRoot`).

**Melhoria:** criar um registro lógico de formação, independente da casa que ocupa sua origem. Ao substituir uma parte, escolher uma política explícita: reduzir a formação e transferir sua origem, ou remover a formação inteira com confirmação clara. O mesmo registro deve controlar produção, exaustão, ocupação e encontro.

**Aceite:** substituir principal e secundário em mapas equivalentes não deixa cristal visual sem função; produção não duplica; salvar/carregar preserva a decisão.

### 2. Tornar efeitos pendentes entidades do motor — P1, alta

A fila atual ordena a apresentação e espera animações, mas `magic()` normalmente modifica recursos, moral ou unidades **antes** da carta. `resolveEffect()` só tem escolhas específicas de moradia e prisão. Isso ainda não é um sistema geral de magia com alvo, custo, cancelamento e aplicação única.

Referências: CONQUER, Magias Boas; DELVE pp. 25–28. Código: [engine.js](src/engine.js), `effect`, `resolveEffect`, `magic`; [event-cards.js](src/event-cards.js).

**Melhoria:** registrar origem, efeito, alvos válidos, custo reservado, estado da escolha e resultado. Aplicar a regra uma vez, após a escolha exigida. Separar efeitos que devem ocorrer imediatamente daqueles que aguardam input; a carta não pode atrasar indevidamente um perigo ambiental imediato.

**Aceite:** carregar durante uma escolha não repete prêmio nem custo; alvo removido tem tratamento definido; combate aguarda a resolução obrigatória.

### 3. Distinguir coringa vermelho e preto — P1, alta

Os dois coringas são atualmente objetos iguais (`★`, rank 0). A descoberta lendária genérica concede magia, recursos e bônus; faltam identidade por cor, retirada por cinco turnos e as duas tabelas completas.

Referências: DELVE pp. 33–36; CONQUER, preparação do baralho. Código: [engine.js](src/engine.js), `shuffleDeck` e ramo lendário da descoberta.

**Melhoria:** coringas identificados, agenda por turno e estado persistente. Vermelho gera artefato com forma/traços; preto gera uma monstruosidade individual com traços. Duplicatas de traço precisam de regra própria. Manter a vitória digital atual até decidir expressamente se a campanha adotará as condições originais do Cristal do Vazio/Hudrak.

**Aceite:** teste força cada cor e verifica resultados diferentes; retorno ocorre após cinco turnos; save não perde o prazo; chefe continua uma criatura grande, salvo um traço que explicitamente exija gêmeos.

### 4. Completar as tabelas de magia — P1, alta

Hoje há quatro resultados bons e três ruins. Por exemplo, “Metal vivo” virou bônus permanente de dano, enquanto no PDF é uma entidade que se funde a uma tropa. Muitas escolhas e consequências dos documentos ainda não existem.

**Implementação sugerida:** converter as entradas do ODT em dados e consultar o PDF para as tabelas complementares. Começar por Clone, proteção de sala, cura por passagem, bênção de fechamento de portais e efeitos de possessão. Depois, correntes, iscas e efeitos que alteram o mapa.

**Uso dos recursos novos:** cartas selecionam alvos; grupos identificam a sala inteira; grafo calcula alcance; compositor mostra marcas e contaminação.

**Aceite:** cada entrada tem ID, descrição fiel, teste de resolução e estado salvo. Não usar apenas um novo nome/ilustração para um bônus genérico.

### 5. Implementar invenções e seu vínculo com o Criadouro — P1, alta

A Artificiaria cobra 50♦ e incrementa um bônus genérico de +15% de dano. O Criadouro exige Artificiaria, mas o ODT exige uma invenção específica; no PDF é Feromônios. **A tabela de invenções está presente no PDF, pp. 31–32.**

**Melhoria:** resultados únicos, pré-requisitos por descoberta e construções especiais com suas áreas. Exemplos: Feromônios, Chuva de Caverna, Pássaros de Mineração, Forja de Fogo de Dragão e Oficina do Mestre de Armadilhas, as duas últimas com duas casas. A criação de filhotes deve usar as regras do progenitor, em vez de só liberar uma fera genérica.

**Aceite:** possuir Artificiaria não libera sozinho o Criadouro; invenção repetida tem política documentada; imunidade, conversão de magma e melhorias afetam apenas o que sua regra determina.

### 6. Unificar estado de encontro em salas grandes — P1, média

Extensões de chefes são casas de caverna associadas ao chefe. Isso resolve a arte, mas o estado do encontro ainda não é uma entidade independente compartilhada por todas as casas.

**Risco a investigar:** construção, ocupação ou interação com um módulo contornar o encontro do principal. Não classificado aqui como defeito reproduzido.

**Melhoria:** grupo com proprietário, criatura vinculada, estado territorial/passivo/hostil/resolvido e permissões. Aplicar o mesmo modelo a dragão, golem, colmeia e masmorra rival, preservando a possibilidade de criaturas passivas não atacarem a base.

**Aceite:** interagir por qualquer módulo consulta o mesmo encontro; não duplica monstro/tesouro; um golem passivo só reage à provocação prevista.

### 7. Rever força por área e profundidade — P2, média

O motor novo calcula força de ninhos, vilas, colmeias, covis e poços pelo tamanho efetivamente criado. Os ramos de formação atribuem valores por área; é necessário reconciliá-los com o acréscimo geral de profundidade de CONQUER, sem acrescentá-lo uma vez por módulo por acidente.

**Melhoria:** orçamento único do encontro: força base, multiplicador por área, profundidade, dificuldade e traços separados. Mostrar a composição em detalhes do inimigo.

**Aceite:** mesmo encontro e profundidade produzem a mesma força independentemente da ordem de geração; limites do mapa não geram inimigos por casas que não existem.

### 8. Diferenciar Templo Protetor e Templo da Pureza — P2, média/alta

A área de duas casas já existe, mas o templo digital mistura escudo no início da luta e dissipação automática de qualquer maldição. No ODT há dedicação, pagamento/alcance para proteção e aprisionamento de magia ruim com condição de clérigo.

Referências: CONQUER, Templo; DELVE p. 15. Código: `magic`, preparação do combate e definição de `temple`.

**Melhoria:** escolha de dedicação por carta, estado da maldição armazenada e requisitos de ocupante. Usar a área lógica para alcance, sem multiplicar efeito por tile.

**Aceite:** Pureza não fornece gratuitamente a função do Protetor; maldição armazenada sobrevive ao save e tem consequência definida quando o templo deixa de funcionar.

### 9. Museu: troféus reais, capacidade e alcance — P2, média

A geometria de duas casas está pronta. A regra ainda concede um troféu em qualquer vitória, até quatro, com +2 de dano global por troféu. O ODT descreve troféus de grandes criaturas, capacidade e bônus/alcance próprios (seção Museu).

**Melhoria:** troféu vinculado ao encontro vencido, escolha quando a capacidade estiver cheia e aura espacial. Uma vitória comum não deve gerar automaticamente um troféu de chefe.

**Aceite:** um chefe em quatro casas concede um troféu, não quatro; remover/substituir troféu atualiza apenas sua aura; derrota não premia.

### 10. Labirintos e resquícios interativos — P2, média/alta

Labirinto atualmente reduz velocidade pela metade; a regra de CONQUER envolve bloqueio, tentativa de mapeamento e risco para a unidade. Templo abandonado, biblioteca, altar do caos e desafio também usam resoluções simplificadas. Por exemplo, o templo abandonado usa 50/50 para magia; não reproduz toda a condição original de clérigo/resultado.

Referências: CONQUER, Resquícios; DELVE pp. 21–22. Código: `action`, `path`, modificadores de velocidade.

**Melhoria:** estados por grupo (não mapeado/mapeado), escolha de explorador, custos e resultados de cada resquício. Bloqueio deve existir no grafo, não só na imagem.

**Aceite:** todas as entradas de um labirinto respeitam o mesmo estado; uma tentativa só rola uma vez e aguarda a carta obrigatória.

### 11. Criaturas territoriais, saqueadoras e aventureiros — P2, alta

O golem já demonstra uma criatura passiva provocável. Essa base pode ser generalizada para criaturas grandes que guardam território, saqueadores que procuram recursos e depois recuam, e habitantes neutros. Aventureiros do PDF pp. 23–24 têm habilidades muito mais específicas que um herói genérico.

**Melhoria:** objetivos próprios por criatura; habilidades com gatilhos como primeiro ataque, início da batalha e morte. Priorizar Caçador de Bruxas, Sabotador, Cirurgião e Bobo como testes de comportamentos diferentes.

**Aceite:** uma isca altera o alvo da IA; criatura territorial não abandona o covil sem motivo; cirurgião ressuscita apenas quem cumpre sua condição. Estados devem ser do motor, não apenas trajetórias visuais.

### 12. Moral e efeitos de área por abrigo — P2, alta

CONQUER combina moral global, qualidade dos quartos, limiar de motim e benefícios locais de salas. O motor tem uma base global e modificadores, mas precisa de auditoria completa por abrigo e por ocupante; não basta somar bônus globais para todos.

**Melhoria:** função única para calcular moral efetiva e explicar suas parcelas. Usá-la tanto na IA/motim quanto no bloqueio vermelho do recrutamento. Definir alcance a partir da sala lógica, com uma convenção clara para salas grandes.

**Aceite:** previsão do recrutamento e moral após recrutar coincidem; duas casas do mesmo Museu/Templo não contam como duas auras; personagens leais preservam imunidade ao motim.

### 13. Fontes, drenagem e bombas controláveis — P2, média

A regra solicitada de fontes permanentes está implementada. A drenagem atual guarda em `drainedSources` todas as fontes conhecidas, não somente as que atingiram a casa. Isso merece revisão antes de adicionar válvulas, fontes móveis e ciclos complexos.

**Melhoria:** rastrear procedência efetiva e separar impedir entrada de remover conteúdo presente. Dar à bomba estados e ação de ativação conforme CONQUER/DELVE p. 16. Chuva de Caverna pode transformar o magma em obstáculo sólido, sem tornar a fonte simplesmente drenável.

**Aceite:** abrir nova ligação ou descobrir outra fonte produz resultado previsível; porta bloqueia fluxo nas duas direções previstas; fonte nunca ganha botão Drenar; salvar/carregar conserva proveniência.

**Decisão adicional:** esclarecer se construir ponte exige acesso de trabalhadores à borda ou apenas conexão topológica. Hoje a verificação usa caminho sem unidade; isso pode permitir construção através de trechos perigosos. Não alterar sem definir a política.

### 14. Transporte como infraestrutura sobreposta — P2, alta

Elevador e trilhos têm representação e aceleração, mas as regras de transporte em múltiplas casas e trilhos sobre outras salas precisam de estrutura própria. As novas áreas não devem obrigar a deformar o desenho do elevador novamente.

Referências: CONQUER, Elevador/Trilhos; DELVE p. 16.

**Melhoria:** camadas de infraestrutura e custos de percurso por aresta. Elevador vertical e trilho horizontal reutilizam arte modular; carrinho armado da tabela de invenções percorre o mesmo segmento. Traduzir movimento instantâneo do livro para uma animação rápida coerente com tempo real.

**Aceite:** trilho não apaga a função da sala; unidades mantêm fila nos corredores; portas interrompem o segmento segundo sua regra; nenhuma escala não uniforme nos sprites.

### 15. Wyrd e portais entre pontos do mapa — P2, alta

A tabela completa de DELVE pp. 29–30 inclui formações e efeitos ainda não representados integralmente: caverna de ossos de 1d4 casas, Reino das Coisas Perdidas de duas casas, Cristais do Tempo e portais entre pontos do mapa.

**Melhoria:** reutilizar formações para áreas e efeitos agendados para crescimento/produção. Portais precisam de arestas de teleporte identificadas: não desenhar corredor atravessando casas inexploradas nem conceder linha de tiro automaticamente.

**Aceite:** teleporte permite movimento autorizado, mas não espalha fluidos/tiros sem regra expressa; ganhos do Reino ocorrem uma vez por grupo e turno.

### 16. Planos e recompensas de várias casas — P3, muito alta

Hoje uma expedição é essencialmente uma batalha ligada a um bônus permanente. O ODT descreve mapas, física, lealdade e ecossistemas próprios. Isso é uma expansão substancial, não uma pequena correção visual.

**Primeiro incremento recomendado:** recompensas com presença física na fortaleza: Templo das Fadas em duas casas, Salão de Hidromel em duas, cinco Apiários com produção e defensor territorial, Curador com bônus por item exposto. Depois, mapas separados e modificadores por plano, com portal de retorno persistente.

**Aceite:** área insuficiente gera escolha de posicionamento, não perda silenciosa da recompensa; cinco Apiários são cinco entidades conforme o ODT, não uma sala de cinco casas confundida com elas; habitantes e unidades têm plano de origem.

### 17. Força exibida e equilíbrio do combate em tempo real — P2, média/alta

No livro, STR é simultaneamente vida e dano. Na adaptação, vida, dano, escudo e intervalo de ataque são escalados separadamente. A soma nominal perto dos defensores é útil, mas não comunica integralmente ferimentos, bônus e potencial de cada composição.

**Melhoria:** manter a força base visível e acrescentar detalhes de força atual/ferimentos, escudo e modificadores; calibrar IA e previsão de ameaça com a mesma métrica. Não voltar ao combate por turnos.

**Aceite:** tropa quase morta não aparece no planejamento como equivalente a uma saudável; buff de Museu/Templo é explicado sem somar escudo como dano; regressões com chefe contra tropas mistas verificam resposta dos dois lados.

### 18. Estado das transições e salvamentos — P3, média

O retorno pós-vitória é uma animação sobre um estado já resolvido. Salvar e carregar durante a caminhada traz as tropas para casa, sem reexecutar a transição. Esse comportamento está documentado e é aceitável para a versão atual.

**Se houver retirada, reforço ou evento durante retorno:** será necessário promover a fase de combate/retorno a estado persistente. Não usar posições visuais como autoridade de alcance ou colisão.

**Aceite futuro:** recarregar em cada fase não duplica unidades, espólios, gemas ou cartas; entrada do jogador permanece bloqueada apenas pelo tempo necessário.

## Outras verificações e expansões

| Tema | Situação e recomendação |
|---|---|
| Áreas que não cabem | Formações naturais podem ficar menores devido a limites, salas existentes e câmaras seladas. Exibir tamanho efetivo e distinguir isso de regras que exigem área exata; construções de área fixa já recusam falta de espaço sem cobrar. |
| Masmorra rival | Expande automaticamente, mas as cartas internas não expandem recursivamente todas as suas próprias formações. Documentar essa simplificação ou reservar cada encontro como subgrupo, evitando explosão de tamanho. |
| Conquista e reconexão | Ocupantes e guarnições podem aproveitar propriedade por grupo e unidades preservadas, em vez de recompensas/guardas genéricos. Conferir tipo de abrigo e destino dos seus habitantes. |
| Fechar portal | A ação atual usa 20♦; revisar a condição de sacrifício/clérigo dos documentos e oferecer escolha explícita, sem remover unidade silenciosamente. |
| Camadas do mundo | DELVE p. 37: opção avançada. Bons candidatos para modificadores por profundidade; não devem entrar como mudança obrigatória na campanha atual. |
| Runas e desafios | DELVE pp. 38–41: expansões opcionais, dependentes de ganchos de morte, geração, economia e vitória. Implementar depois das tabelas básicas. |
| Compatibilidade | Acrescentar Safari real à matriz. Não interpretar toque no Chromium como aprovação para iOS; distribuição por endereço web precisa de teste próprio. |

## Ordem prática de execução

1. **Consistência:** identidade de formação, permissões de encontro, resolução de efeito e métricas compartilhadas. Adicionar regressão para o cristal reproduzido e migrações de save antes de novas tabelas.
2. **Fidelidade central:** coringas, magia, invenções, Templos, Museu, labirintos e comportamentos territoriais. Para cada entrada: regra, carta/seleção, arte/estado visual e teste de save durante a resolução.
3. **Profundidade:** transporte sobreposto, Wyrd completo, recompensas físicas dos planos. Depois avaliar mundos separados, camadas e runas opcionais.

A próxima correção mais importante é a identidade lógica das salas grandes. A próxima entrega com maior impacto perceptível é separar os coringas e implementar resultados reais de magia e invenção. Os novos encaixes e cartas já fornecem a apresentação necessária; o trabalho restante é principalmente de regras e persistência.
