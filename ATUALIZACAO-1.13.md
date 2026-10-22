# CONQUER 1.13.0 — colônia, apresentação e regras

Esta revisão usa CONQUER como texto principal e DELVE/RISE para contextualizar suas tabelas. As decisões do jogador solicitadas na conversa têm prioridade. Os documentos anexados foram tratados como referências, não como instruções operacionais.

## Relatório de teste atendido

- Rios e fluxos de magma crescem apenas horizontalmente. A caverna vazia de ♥ tem até quatro espaços consecutivos horizontais e quatro painéis próprios. Se outra sala, o limite do mapa ou uma câmara selada impedir a extensão, a formação não sobrescreve esses espaços.
- Encaixes largos ficam limitados à região entre as salas; não repintam o interior do Museu ou da Inspeção. As margens internas não recebem o desvanecimento que deixava lacunas transparentes. Água e salas alagadas usam a mesma paleta. Jambas e detalhes construídos também recebem a cor correspondente ao seu lado.
- A cratera é um vão vertical único com duas paredes ilustradas contínuas, largura estável e bordas irregulares. Os cilindros de apoio da superfície foram removidos; o requisito lógico de apoio permanece.
- Produtores têm imagens no canto inferior esquerdo. Produção com baralho mostra a carta acima da imagem e seu bônus; partículas saem da carta. Produção sem carta usa a imagem como origem. Estoque cheio ainda mostra a carta comprada, sem inventar recursos recebidos. Esgotamento fragmenta o elemento. Trocas lançam os símbolos a partir do recurso obtido no painel.
- A caverna encantada tem seis composições: círculos, luzes, santuários e objetos místicos. Há quatro painéis para a caverna longa, dezoito sprites de profissionais e seis armadilhas ilustradas. Armadilhas exibem progressão; o quarto nível usa a forma mais avançada com cor de calor.
- Esgotos têm 5% de chance diária de produzir de um a três ratos gratuitamente, com carta de evento. A descrição de construção não revela a chance. Os ratos entram nas regras normais de moral.
- Profissionais de seis ofícios têm três variantes cada. Não contam como defensores, não atacam e fogem de inimigos; mortos são substituídos por outra variante ao término da batalha. Unidades pequenas ficaram maiores; chefes mantêm a escala.
- Tropas passeiam perto do abrigo em paz e preferem permanecer nas salas sociais. Combate retoma a IA normal. Selecionar uma sala com aura destaca sua área; bônus locais e recrutamento consultam a mesma área lógica.
- Construções de várias casas pedem direção antes de cobrar. Museu ocupa duas casas horizontais. Formações alternam variantes e espelhamento quando precisam de mais painéis, evitando repetições imediatas.
- Bônus de recursos aparecem como expoente `+n` na carta. Motins têm carta. Encontros econômicos extraordinários usam J♣ como alternativa; consequências de ações e combate continuam associadas ao próprio gatilho. O evento diário do esgoto é a exceção expressamente solicitada.
- Após vencer, o jogador pode capturar um oponente racional realmente derrotado quando existe cela disponível. Recusar não gera prisioneiro. Celas ocupadas recebem grades em todas as passagens conectadas: 200 HP, metade de uma porta nível 1. Portas construídas têm prioridade. Destruir uma grade liberta seus ocupantes e inicia ou reforça o ataque.

## Relação com as dezoito propostas da auditoria

| Proposta | Implementação desta revisão |
|---|---|
| 1. Identidade da formação | Substituir a origem de uma formação produtora transfere a origem às partes restantes; não perde a produção nem a duplica. |
| 2. Efeitos pendentes | Efeitos guardam identidade, alvo e escolhas no motor. Aplicação ocorre na resolução da carta, uma vez; decisões sobrevivem ao save. |
| 3. Coringas distintos | Vermelho gera artefato com forma e traços; preto gera uma monstruosidade com traços. Identidade, prazo de cinco dias e retorno são persistentes. |
| 4. Magias | 26 entradas boas e 13 ruins com efeitos próprios, seleção quando necessária e 39 ilustrações específicas. Metal Vivo e Cores Encantadoras são entidades móveis, não bônus genéricos globais. |
| 5. Invenções | Treze identidades sem acumular duplicatas; Feromônios libera Criadouro. Seis invenções físicas têm salas próprias, incluindo as construções de duas casas. |
| 6. Encontros grandes | Guardião e permissões são consultados pelo grupo, inclusive pelos módulos secundários; criaturas territoriais permanecem passivas até provocação. |
| 7. Área/profundidade | A força de formações usa a área efetivamente criada, com orçamento adicional de profundidade aplicado uma vez. |
| 8. Templos | Dedicação Protetor/Pureza. Proteção paga, alvo no alcance e clérigo. Pureza guarda a identidade da maldição; perda do clérigo ou dano a libera. |
| 9. Museu | Grandes criaturas podem gerar troféu, quatro vagas, escolha de substituição e bônus de 10 STR por espécie correspondente dentro da aura 6×5. |
| 10. Resquícios | Labirinto exige mapeamento com risco para a unidade; bibliotecas, tumba e altar caótico possuem ações e resultados próprios. |
| 11. Objetivos e aventureiros | Treze classes com gatilhos próprios; iscas alteram destinos, aventureiros podem curar, dominar ou ressuscitar; guardiões territoriais não invadem por padrão. |
| 12. Moral local | Jogos/Taverna e moradia consultam alcance e conforto, compartilhados com bloqueio de recrutamento e motim. |
| 13. Fluidos/bombas | Drenagem registra somente fontes que efetivamente atingiram a sala. Bombas têm válvula controlável. Fontes naturais continuam indrenáveis; Chuva de Caverna solidifica magma. |
| 14. Transporte sobreposto | Trilhos por 5♥ podem coexistir com a função da sala. Velocidade, fila e Carrinho Armado usam as ligações abertas; portas interrompem o percurso. |
| 15. Wyrd | Treze identidades, incluindo ossos, lodo, fungo, Cristais do Tempo, Coisas Perdidas e portais com arestas próprias. Teleporte não concede tiro ou fluxo através de salas fechadas. |
| 16. Planos | Treze mapas persistentes e grupo de até dez unidades, sem guardas gratuitos. Portal de Retorno, habitantes de origem e invasões à base. Recompensas físicas incluem cinco Apiários independentes, templo e salão de duas casas. |
| 17. Força atual | Planejamento usa ferimentos linearmente. Placar mantém força nominal; detalhes informam força ferida e escudo, sem convertê-lo em dano. |
| 18. Transições | Fase de retorno e tempo decorrido são salvos; carregar não repete vitória, pagamento, captura ou perda de gema. |

As correções de abrigos, conforto, Informação, Contratação, clérigos, sacrifícios e domesticação da versão 1.12 continuam presentes. Foram acrescentados os traços de artefatos e monstruosidades, camadas opcionais, dez runas opcionais e registro de conquistas. Camadas/runas ficam desligadas por padrão.

## Convenções e limites de fidelidade

Esta é uma adaptação para combate em tempo real, não uma reprodução literal de cada combinação dos livros. Um intervalo de rodada é convertido em aproximadamente 1,1 segundo quando um efeito precisa de cadência. A campanha base mantém o objetivo na profundidade 12 e as três gemas solicitadas, inclusive diante de invasões cósmicas. Os planos usam exploração por cartas e guardião na profundidade 6, em vez do confronto entre dois baralhos de RISE.

Os treze planos têm mapas e modificadores diferentes, mas há diferenças em subeventos: habitantes das Fadas permanecem no posto avançado ao retornar, em vez de morrerem tentando atravessar; ainda não existe toda a sequência especial do Gato Rei nem todos os encontros alternativos do Antiquário. Informação de incursão mantém sua redução digital de força. Outros resultados de Informação que continuam adaptados estão descritos no registro 1.12.

Algumas entradas complexas também têm resolução digital reduzida: Sala Viva preserva a identidade da sala na criatura, mas não transporta todas as funções produtivas; o Herói Devoto guarda seus dois traços sem executar toda combinação entre classes; Covardia e Surto usam uma aplicação espacial, sem simular todas as reações recursivas do texto. Camadas/runas possuem os modificadores principais; a camada Masmorra não compra uma segunda formação completa automaticamente. Esses pontos não são declarados como transcrição integral concluída.

A extensão pode ficar menor quando não há espaço livre. Painéis adicionais usam composições alternadas e depois espelhamento; não há uma ilustração exclusiva para cada tile de uma cratera de trinta andares. Construções de quatro casas oferecem linhas em cada direção, mantendo a escolha explícita e o custo único.

Safari/iOS físico permanece sem homologação neste ambiente Linux. Foram testados Chromium com toque e tela estreita e o HTML autossuficiente sem requisições externas. Isso não certifica a visualização de HTML pelo app Arquivos do iPhone.

## Distribuição

Baixe o ZIP do repositório, extraia e abra **JOGAR-CONQUER.html**. A versão web pode ser gerada com `npm run build`. O HTML único pode ser regenerado com `npm run build:standalone`; inclui imagens, fontes, estilos e código, sem servidor.
