# Grupos de desbloqueio — preservando os tiers

Revisão de design de 26/10/2026, considerando as novas regras de captura. Os tiers do relatório anterior foram mantidos, inclusive Sala de Persuasão em Tier 0 e Solitária em Tier 1.

## Regra de agrupamento

Agrupar significa destrancar **projetos e funções** em conjunto; construir continua exigindo os custos individuais, casas, vagas e requisitos do mapa. Uma sinergia vantajosa não é, por si só, uma dependência.

Quando uma estrutura já tem utilidade própria, ela continua tendo um desbloqueio independente. Uma estrutura dependente só deve ser pesquisável após seus pré-requisitos. Isso evita transformar toda a árvore num único pacote que inclui tudo.

Para o caso excepcional de um pacote com estruturas de tiers diferentes, o acesso do pacote usa o **maior tier**, sem reclassificar seus componentes. Assim, juntar uma estrutura de Tier 1 a outra de Tier 3 não antecipa o Tier 3.

Esta organização foi implementada na versão 1.17.0. Em campanhas novas, apenas Tier 0 começa liberado; projetos de acesso Tier 1/2/3 custam 1/2/3 informações e exigem um projeto pesquisado do tier anterior. Requisitos do ramo e do mapa continuam valendo. Salvamentos antigos preservam o acesso anterior.

## Pacotes que evitam compras sem função

| Grupo | Componentes e tiers preservados | Regra de desbloqueio e motivo |
|---|---|---|
| **Interrogatório inicial** | Sala de Persuasão **T0** + sua captura própria e ação de interrogatório | Disponível desde o início. Não depende de Solitária, Prisão nem Contratação. Uma sala captura um inimigo inteligente por batalha, desde que tenha vaga. |
| **Canil e criaturas** | Canil **T0** + recrutamento de cães + captura de monstro | As funções acompanham o projeto. O monstro escolhido após uma vitória torna-se aliado imediatamente com espécie e força preservadas; não há compra de unidade genérica “Fera”. |
| **Engenharia militar inicial** | Forja **T1**, Posto de cerco **T1**, Trilhos **T1** + compra dos especialistas e defesas básicas correspondentes | Destrancar em conjunto evita oferecer Posto ou Trilhos sem Forja. São projetos separados para construir, não uma obrigação de erguer todos. A Forja já é útil com armadilhas e cerco, mesmo sem Posto. |
| **Alvenaria e sustentação** | Pedraria **T1**, Colunas **T1** + barricada defensiva **T1** | Colunas não devem aparecer como uma pesquisa autônoma que exige outra estrutura ainda bloqueada. Barricada ofensiva **T2** e passagem secreta **T3** continuam como extensões posteriores desse ramo. |
| **Recrutamento de prisioneiros** | Solitária **T1** + Setor de contratação **T3** + tentativa de recrutamento | Um pacote de acesso **T3**, preservando as classificações 1 e 3. Impede oferecer uma Solitária cuja finalidade principal ainda não pode ser usada. Cada tentativa retira o candidato da cela, mesmo em caso de falha ou recusa de pagamento. A Sala de Persuasão não faz parte desse pacote. |
| **Criação de espécies** | Criadouro **T3** + escolha de matriz + reprodução da espécie | Só oferecer após Artificiaria e Feromônios, com criatura aliada elegível. A reprodução é uma ação da sala, não a reintrodução de “Feras” no catálogo. Sem uma matriz, a estrutura fica sem sua função principal. |
| **Instalações de invenção** | Salão de Concertos, Cervejaria Secreta, Forja de Fogo de Dragão, Mestre de Armadilhas, Portão de Ender e Localizador de Minério — **T3** | Cada instalação acompanha o desbloqueio de sua própria invenção e ações. Não pesquisar a instalação separadamente de um efeito que ainda não existe. Evitar também cobrar duas pesquisas pelo mesmo desbloqueio. |
| **Exploração planar** | Estabilizador **T3** + preparação da expedição + retorno | Requer portal descoberto e disponível. A pesquisa deve indicar essa condição, não oferecer um Estabilizador que não pode ser colocado em lugar algum. Não inclui obter antecipadamente o portal ou as recompensas dos planos. |
| **Campeões planares** | Salão de Hidromel **T3** + recrutamento de Berserkers | O recrutamento acompanha a recompensa; não destrancar um salão sem habitantes disponíveis. Continua dependendo da conquista planar correspondente. |

### Por que o pacote de recrutamento fica em acesso Tier 3?

Solitária ficou em Tier 1 no relatório, mas sua finalidade agora está ligada às tentativas do Setor de contratação, que permanece em Tier 3. Com as duas classificações fixas, pesquisar a Solitária isoladamente no Tier 1 deixa o jogador esperando por uma função distante.

A solução adotada no agrupamento é reservar o par ao acesso Tier 3. Isso não muda o tier de nenhum projeto. O sistema de captura de conhecimento continua funcionando pelo Interrogatório inicial de Tier 0.

## Estruturas dependentes que não exigem fundir todo o ramo

| Projeto | Tier | Condições para oferecer a pesquisa | Por que não juntar todos os pré-requisitos? |
|---|---:|---|---|
| **Artificiaria** | 3 | Projetos de Forja T1, Biblioteca T1 e Armazém T0 já liberados; requisitos de construção continuam necessários | Os três já têm utilidade independente. Não devem ficar presos ao custo de uma pesquisa de Tier 3. |
| **Sala de quebra-cabeça** | 2 | Forja T1 e Pedraria T1 liberadas | É uma extensão da engenharia, não motivo para atrasar as duas fundações. |
| **Sala do trono** | 3 | Armazém T0 e Tesouraria T0 liberados | Depósitos são necessários muito antes do Trono. |
| **Museu** | 3 | Mostrar claramente que precisa de espécies registradas por vitórias contra criaturas grandes | Seu preparo depende de eventos de combate, não de outra construção específica. Recomendo tornar o primeiro troféu acessível antes ou junto da pesquisa. |
| **Laboratório com Transmutação** | 1 para a sala | Laboratório inicial libera seus alquimistas; Transmutação é uma evolução separada e tardia | Não segurar o Laboratório inteiro até a descoberta tardia. A utilidade militar básica precisa justificar a compra inicial. |
| **Tesouraria com dragão** | 0 para a sala | Tesouraria inicial mantém armazenamento; contratar dragão exige a reserva própria | Não empurrar o depósito básico para o estágio do dragão. |
| **Trilhos com Carrinhos Armados** | 1 para os trilhos | Trilhos iniciais dão mobilidade; a invenção posterior libera carrinhos | A rede já tem função antes da arma. |
| **Hospital** | 2 | Existência de tropas recuperáveis e acesso a combates | Não depende de Templo para funcionar. O aprimoramento mágico de alcance é opcional. |

## Projetos que podem permanecer independentes

- **Tier 0:** Quartel com seus soldados/arqueiros, Cabana, Armazém, Tesouraria e Ponte; além dos grupos de Interrogatório e Canil acima. Limites de moral e recrutamento continuam valendo.
- **Tier 1:** Biblioteca com seus magos e magia de construção; Laboratório com alquimistas; Prisão e sua captura; Quarto, Dormitório, Lavanderia, Arena, Elevador. São úteis em seu contexto sem uma compra obrigatória adicional do mesmo ramo. Solitária fica no pacote de recrutamento.
- **Tier 2:** Cozinha, Parlatório, Sala de Jogos, Galeria de Esgoto com ratos locais, Inspeção, Hospital, Taverna com seus aventureiros, Mansão, Ponte levadiça. Quebra-cabeça respeita os requisitos indicados acima.
- **Tier 3:** Oficina; Altar com escolha de dedicação e clérigo inicial; Templo com dedicações e acesso a clérigos; Museu. Os demais ficam nos grupos ou nas condições descritas.

Altar e Templo não devem exigir um desbloqueio separado para sua ação principal. Igualmente, liberar Quartel, Canil ou Taverna precisa liberar o uso das unidades ou capturas que dão sentido a essas estruturas, sem uma segunda pesquisa oculta.

## Atenção: sinergia não é dependência

**Cozinha + Quartel**, **Jogos + abrigos**, **Hospital + tropas valiosas**, **Museu + muitos atacantes** e **Oficina + construções caras** são combinações fortes, mas não devem virar pesquisas indivisíveis. Separá-las preserva escolhas e custos de oportunidade.

A Mansão facilita contratar candidatos muito fortes, mas não é obrigatória para contratar todos: Cabana e Quarto podem servir, dependendo da força e da tolerância. Portanto, não deve ser adicionada compulsoriamente ao pacote Solitária + Contratação.

## Fluxo de captura implementado

| Destino | Alvos | Resultado |
|---|---|---|
| Sala de Persuasão | Inimigos inteligentes | Guarda um ocupante para interrogatório, sem depender da Solitária. |
| Solitária | Inimigos inteligentes | Guarda um candidato para tentativa no Setor de contratação. |
| Prisão | Inimigos inteligentes | Acumula capturas reais até a capacidade. Não cria prisioneiros automaticamente a cada produção. |
| Canil | Monstros elegíveis | Um por Canil, ocupando uma vaga. Torna-se aliado leal imediatamente; mantém espécie e força. Cães continuam disponíveis para recrutamento. |

Após uma vitória, a tela mostra os sprites dos inimigos derrotados e os destinos. O jogador distribui no máximo uma nova captura para cada estrutura nessa batalha. O mesmo inimigo não pode ser atribuído a dois destinos. Escolhas incompatíveis ficam indisponíveis; destinos ocupados permitem substituir a captura anterior, que será descartada apenas ao confirmar. Uma Prisão cheia permite escolher qual ocupante sai. a confirmação aplica as atribuições juntas. Cancelar não captura ninguém.

Criaturas incompatíveis, como o Imortal e o guardião final do Cristal do Vazio, não viram prisioneiros domesticáveis. A interface indica quando o tipo não é elegível. Prisioneiros reais mantêm seus registros ao salvar/carregar. Romper a contenção libera os ocupantes preservando espécies e forças.

## Ratos e efeitos no balanceamento

Ratos agora são guarnição dos esgotos. Não caminham até outras frentes, não acompanham expedições e só atacam oponentes que entram no espaço dos esgotos. Não entram no número nem na força móvel exibidos no HUD. Continuam visíveis na guarnição e no recrutamento local; a regra existente de moral por rato permanece.

Isso reduz a eficiência de usar ratos como um exército móvel barato e valoriza colocar o esgoto em uma rota relevante. A Galeria permanece em Tier 2 conforme solicitado; seu equilíbrio deve ser reavaliado como defesa local e suporte de tolerância.

A captura real também muda o retorno da Prisão: sem a geração automática de um prisioneiro por produção, completar vinte vagas exige mais vitórias ou fontes explícitas de captura. Seu pagamento atual de 20♦ quando cheia foi preservado, mas a espera merece um teste de balanceamento próprio.

## Limite do trabalho

Foram implementadas captura, separação de funções, descarte após tentativa, monstros específicos do Canil e ratos locais. A versão 1.17 implementa também os grupos e a pesquisa por informações, preservando os tiers individuais e aplicando o maior tier ao acesso de cada pacote. Instalações de invenção e recompensas planares acompanham suas descobertas, sem uma segunda pesquisa.
