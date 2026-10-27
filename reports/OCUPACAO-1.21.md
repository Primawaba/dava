# Acampamentos e economia da ocupação — 1.21.0

Cada domínio inimigo começa com reserva zero. Salas ocupadas conectadas se agrupam em um acampamento; domínios inicialmente separados têm reservas independentes. Se uma nova tomada unir dois domínios, suas reservas, salas e tropas se unem sem duplicação.

## Renda e recrutamento

A cada avanço real de turno no mapa ativo, uma única vez por acampamento fora de combate:

`renda = maior profundidade sob controle + quantidade de salas controladas`

Por exemplo, três salas cuja maior profundidade seja 6 rendem 9 recursos. A renda não retira nada do jogador. As sobras ficam guardadas, inclusive após salvar e carregar.

O acampamento tenta comprar repetidamente a unidade mais forte que puder pagar, nas salas construídas e utilizáveis sob seu controle. Usa o valor normal da tabela de recrutamento como custo em sua própria reserva, e conserva força, classe e tamanho normais. Pré-requisitos precisam estar no domínio; capacidades dos alojamentos continuam limitando as vagas. Salas danificadas, fechadas ou perigosas não recrutam. Aventureiros únicos e feras genéricas não são inventados como opções de recrutamento.

Quando não existe nenhuma sala de recrutamento utilizável, o acampamento replica sua unidade existente mais forte que possa pagar. Cada cópia custa exatamente sua força e recebe uma nova identidade. Repete até não conseguir pagar nenhuma das espécies disponíveis. Isso preserva criaturas grandes como unidades individuais. Quando existe uma sala de recrutamento mas falta dinheiro ou vaga, o saldo fica guardado; essa situação não ativa a replicação alternativa.

O limite geral de 3.000 tropas por mapa continua protegendo o sistema. Ao atingir o limite, o saldo não gasto fica na reserva.

## Ocupantes, comportamento e retomada

A tomada preserva as estruturas: não aplica mais dano às salas. Dano anterior ou causado pelo ambiente não é reparado automaticamente.

Os ocupantes são unidades completas, visíveis no mapa, com identidade, espécie, força, vida restante, tamanho, aparência de camada e características preservados. Fora de combate, usam o mesmo ciclo casual das tropas do jogador: preferência pelo próprio abrigo, salas sociais e passeios próximos, em velocidade reduzida. Seus trajetos se restringem às salas dominadas e seguem corredores reais, com fila nas passagens. Portas não são atacadas durante o passeio. Unidades imóveis continuam imóveis.

Reabrir uma ligação até a fortaleza ativa os ocupantes reais e seus reforços; não recria uma defesa genérica. As salas permanecem inimigas durante o combate e só são liberadas quando a guarnição deixa de ser hostil. A reserva não vira um prêmio automático para o jogador. Reparar uma construção não permite pular a batalha. Voltar a fechar uma ponte durante a retomada pode fazer os invasores se acamparem novamente, preservando tropas e saldo.

O simples acampamento dos invasores não conta mais como vitória, não concede espólios e não derrota artificialmente um guardião. Conversão de ocupantes, reanimação, perigos ambientais e salvamentos continuam respeitando o vínculo com o domínio. Clérigos recrutados pelo acampamento protegem sua própria facção. A derrota do jogador conserva a regra das gemas, removendo os inimigos e seus acampamentos daquele mapa.

Cada tomada, instalação, renda/reforço e retomada é comunicada por carta de evento. Selecionar uma sala dominada mostra o tamanho do domínio, tropas acampadas e reserva. A crônica tem variações narrativas para a instalação e a chegada de reforços.

## Compatibilidade e verificação

Guarnições antigas são migradas uma única vez para acampamentos de reserva zero. O dano que já existia nesses salvamentos é preservado. Mapas planares conservam seus próprios domínios; como as demais produções locais, sua economia avança quando esse mapa está ativo.

Testes verificam fórmula, cobrança única, poupança, recrutamento por construção, capacidades, replicação, isolamento de reservas, fusão, movimentos por corredores, retomada, mudança de facção, reanimação, perigos, migração e viagem entre planos. O teste de navegador verifica cartas, tropas visíveis, reserva, salvamento e retomada pela interface em desktop, toque e HTML offline. O pacote PC também é testado depois de extraído.

Resultado da validação: **422 testes de regras**, **21 verificações gerais de navegador**, fluxo de ocupação em desktop/toque/HTML offline e execução do pacote PC extraído passaram. A política deste ambiente bloqueia navegação file://: o teste do pacote intercepta os arquivos extraídos com a rede desligada; o Explorador do Windows não é executado aqui.
