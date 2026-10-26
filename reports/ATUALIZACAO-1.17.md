# CONQUER 1.17.0 — desempenho, pesquisa, substituições e crônica

## Desempenho

A versão anterior recalculava os pixels de cada sala iluminada a cada fase do pulso. As mudanças eram sincronizadas, produzindo pausas periódicas que aumentavam com a quantidade de salas. Campos de jogo sem importância visual também entravam na chave das texturas. Fora do combate, buscas repetidas de caminho não compartilhavam cache; os profissionais eram sincronizados duas vezes por atualização.

A versão 1.17 separa tint estático, máscaras de iluminação e animação. Máscaras radiais de 8 bits são reutilizadas; até três texturas animadas são refeitas por quadro, mantendo o último resultado enquanto as outras aguardam. Paleta, contaminação e geometria atualizam o tint estático sem aguardar a animação. Luzes fora do alcance são descartadas. Texturas, máscaras, últimos quadros e rotas têm limites; as máscaras ocupam até 24 MiB.

Consultas de caminho compartilham resultados dentro de uma atualização. Consultas de desenho podem reutilizar rotas enquanto o mapa permanece igual; mudanças em portas, perigos, guardiões, passagens secretas, imunidades, artefatos e magias invalidam os resultados. O cache distingue unidades voadoras, cósmicas, imunes a armadilhas e velocidades que alteram o custo de romper portas. Profissionais são sincronizados uma única vez e o planejamento inicial da movimentação casual é distribuído entre quadros. As opções de captura calculam a disponibilidade uma vez por destino, evitando buscas repetidas para cada inimigo derrotado.

Comparação controlada em Chromium sem interface, mesmo mapa com 64 salas, 47 defensores e 21 profissionais, 160 amostras com fases de iluminação:

| Desenho do mapa | 1.16.0 | 1.17.0 |
|---|---:|---:|
| Mediana | 22,3 ms | 10,9 ms |
| Percentil 95 | 1.163 ms | 35,2 ms |
| Maior amostra, incluindo preparação inicial | 1.367,9 ms | 362,9 ms |

Teste prolongado de 96 rodadas de produção, até o turno 97, com 960 amostras após aquecimento: mediana de desenho 8,8 ms e percentil 95 de 30,9 ms; atualização da simulação com percentil 95 de 4,6 ms. O percentil 95 de desenho foi de 35,6 ms na primeira metade e 28,1 ms na segunda. Mantiveram-se 21 profissionais, 384 texturas, 64 conjuntos de máscaras (~16,1 MiB) e 64 rotas. Não houve crescimento contínuo desses dados. Testes medem este ambiente: dispositivos diferentes terão outros tempos, e abrir um mapa grande ainda exige preparar suas imagens.

As imagens aprovadas em `public/assets` foram preservadas. Foram verificadas cores, transparência, danos, pulsação dos cristais e movimento reduzido.

## Desbloqueio de construções

Campanhas novas começam com Quartel, Canil, Cabana, Armazém, Tesouraria, Ponte e Sala de Persuasão. Um interrogatório bem-sucedido gera 1 informação para pesquisa, além de resolver o efeito original da tabela de RISE. Falhas não geram informação. O saldo e as pesquisas ficam no salvamento.

Abra **Construir → Pesquisas**. Projetos de acesso Tier 1/2/3 custam 1/2/3 informações. Para acessar o próximo tier, basta pesquisar um projeto do anterior. Os pacotes preservam os tiers individuais:

- Engenharia militar T1: Forja, Posto de cerco e Trilhos.
- Alvenaria T1: Pedraria, Colunas e acesso à barricada defensiva. Porta ofensiva T2 e passagem secreta T3 têm pesquisa própria.
- Recrutamento de prisioneiros, acesso T3: Solitária T1 e Contratação T3, desbloqueadas juntas.

Os demais projetos são independentes e respeitam seus pré-requisitos. Artificiaria exige projetos de Forja, Biblioteca e Armazém; Quebra-cabeça exige Forja e Pedraria. Criadouro exige Artificiaria, Feromônios e uma criatura elegível. Museu exige registro de uma criatura grande derrotada. Estabilizador exige descobrir um portal. Inventos e recompensas planares continuam vinculados às suas descobertas, sem cobrar outra pesquisa pelas instalações especiais.

Pesquisar não constrói a sala, não consome a construção do turno e não elimina custos, espaço, captura, vagas ou requisitos de uso. Informação e desbloqueios são comunicados por cartas de evento. APIs de construção e infraestrutura também verificam o desbloqueio.

**Salvamentos antigos preservam todos os projetos anteriormente acessíveis. Para testar a progressão completa, inicie uma campanha nova.**

## Substituição de capturas

A tela de captura após a vitória permite usar destinos já ocupados. Ela identifica o ocupante que será dispensado. No Canil, o novo monstro substitui o anterior e torna-se aliado leal com espécie e força originais. Persuasão e Solitária substituem seu ocupante. Na Prisão cheia, escolha qual dos vinte prisioneiros descartar.

Seleções são aplicadas juntas somente ao confirmar. Cancelar não dispensa ninguém. O antigo ocupante não morre, não vira hostil e não pode ser ressuscitado pelo Hospital. Continuam valendo as restrições de espécie, destino ativo e uma captura nova por estrutura em cada batalha. Escolhas pendentes, inclusive o prisioneiro a substituir, podem ser salvas e carregadas.

## Crônica

O diário e sua exportação passam a apresentar os acontecimentos do mais antigo ao mais recente, preservando a ordem dos eventos no mesmo turno. Os registros de fundação, exploração, construções, recrutamento, trocas, produção, invasões, combates, gemas e outros acontecimentos foram recontados em tom narrativo. A releitura também vale para registros de salvamentos antigos. O histórico técnico original permanece no salvamento para compatibilidade; o diário e o trecho recente exibem a versão narrativa.

## Verificação

348 testes de regras, incluindo novas campanhas, migração de salvamentos, pesquisa, grupos, substituições, invariantes de caminhos e 100 rodadas simuladas. Também foram executados os fluxos de navegador para pesquisa, troca de capturas, diário e exportação, desktop e toque 390 px, salvamento pendente, arte/tint, combate, exportação PNG e HTML inteiramente offline.

O teste offline carrega o mesmo HTML por interceptação local, sem servidor nem requisições externas: o ambiente de teste bloqueia `file://`. Não foi realizado teste em um iPhone físico.
