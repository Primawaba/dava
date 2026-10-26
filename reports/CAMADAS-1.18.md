# Camadas por sala — CONQUER 1.18.0

## Descoberta e persistência

As camadas continuam opcionais. Um Rei de Paus avança a sequência somente quando é a carta efetivamente usada para explorar um espaço novo. Compras de produção, magia, interrogatório, previsão descartada e tabelas secundárias não descobrem camadas. Repetir o Rei na última camada não cria uma fronteira nova.

Cada fronteira registra mundo/plano, coordenadas, profundidade, camada e turno. A sala do Rei já recebe a camada nova. Depois disso, apenas casas ainda desconhecidas na mesma profundidade ou abaixo recebem essa camada. Casas novas acima seguem a fronteira anterior aplicável, ou Normal. Casas existentes nunca são reclassificadas por uma descoberta posterior. Construir, reparar ou contaminar uma sala também conserva seu identificador de camada.

Exemplo: Magma descoberto no andar 5; Cemitério no andar 8. Uma sala nova no andar 4 será Normal; no 6 será Magma; no 8 será Cemitério. Uma sala no andar 9 que já existia como Magma continua Magma. Se uma fronteira posterior for descoberta num andar mais alto, ela passa a valer para novas casas daquele andar para baixo, preservando todas as casas conhecidas.

A Runa Pesadelos começa na última camada e percorre a sequência ao contrário. Superfície permanece Normal. Planos têm históricos separados da fortaleza base.

## Efeitos aplicados pela sala

| Camada | Efeito e limite |
|---|---|
| Normal | Sem modificador. |
| Magma | Fontes naturais novas de água tornam-se magma. Água que entra numa sala Magma é tratada ali como magma e pode danificar construções. Salas vizinhas de outra camada continuam avaliando seu próprio material e o fluido que as alcançou. Pontes e bloqueios mantêm suas regras. |
| Cemitério | Inimigos derrotados nesta sala retornam imediatamente no ponto da morte com metade da STR, arredondada para baixo. O retorno é um morto-vivo incapturável. Aliados elegíveis conservam sua conversão em mortos-vivos ao fim do combate; golems e artilharia ficam excluídos desse retorno aliado. |
| Rastejantes | Resultados de ♦ não rendem riquezas naquela descoberta/produtor. Criaturas da descoberta 9♣, representada pelo pequeno covil, têm força dobrada. |
| Linhas Arcanas | Sorteios de magia com origem nesta sala são resolvidos duas vezes. Efeitos mágicos de identidade fixa lançados diretamente pela sala também se repetem; não há uma duplicação adicional para cada uma das duas compras. Uma magia de outra sala não herda o efeito. |
| Riquezas | Dobra recompensas de cartas de ♦ daquela descoberta ou produtor. Não multiplica ganhos fixos sem carta de diamantes. |
| Masmorra | Uma descoberta de ♠ compra até a próxima ♠ e a resolve em uma casa adjacente livre, conectada à descoberta. Não consome outro turno nem a construção do turno. Se não houver espaço disponível, uma carta explica a impossibilidade. Descobertas automáticas da segunda sala não encadeiam novas duplicações indefinidamente. |
| Pesadelo | Monstruosidades geradas nesta sala recebem um traço adicional. Monstros de outras salas não ganham características retroativamente. |

A camada é uma propriedade da sala. O estado que controla qual fronteira será descoberta em seguida não é usado como um bônus global.

## Retornos durante a batalha

Cemitério, Runa Lápide e ressurreição dos gêmeos usam o mesmo fluxo: remover o corpo das opções de captura, criar o reanimado na mesma coordenada fracionária da morte e continuar o combate sem conceder vitória ou espólios intermediários. O reanimado mantém espécie, porte e características relevantes, recebe nome de morto-vivo e usa a arte funerária da espécie.

Ele possui marcadores persistentes de morto-vivo, origem e proibição de captura. A proibição vale para registro do corpo, interface e confirmação da seleção. Ser uma monstruosidade não sobrepõe essa proibição. Salvar e carregar não remove esses marcadores.

Cada corpo retorna apenas uma vez. Cemitério e Lápide usam metade da força; gêmeos mantêm a força do efeito original. Uma força que arredonda para zero não produz unidade. Efeitos simultâneos são coalescidos: Lápide é verificada primeiro, depois Cemitério, depois gêmeos; o mesmo corpo não gera dois inimigos. Os retornos têm carta de evento antes de a simulação prosseguir.

Resgates de aliados pelo Hospital, Médico e artefatos mantêm seu comportamento próprio. Este pedido altera o retorno de inimigos; não transforma curas de aliados em inimigos mortos-vivos.

## Arte e materiais

A camada Normal preserva as imagens existentes. Foram gerados 238 novos sprites, com mudanças de aparência e equipamento: os 22 tipos de inimigos e mais 12 tipos de unidade que podem virar inimigos, em cada uma das sete camadas especiais. Cada PNG tem 64×64 pixels e canal alfa. As artes de sala não foram substituídas.

| Camada | Base visual |
|---|---|
| Magma | Obsidiana e brasas alaranjadas |
| Cemitério | Pedra funerária, ossos e verde-azulado pálido |
| Rastejantes | Quitina, antenas e verde-oliva |
| Linhas Arcanas | Runas ciano e cristais violetas |
| Riquezas | Ouro e gemas âmbar |
| Masmorra | Ferro rebitado, correntes e tecido carmesim |
| Pesadelo | Chifres, tentáculos e fissuras violetas |

O material combina 44% da paleta base da camada com 56% da paleta específica da sala ou contaminante. Luzes e transições de borda continuam procedurais. Salas e corredores consultam a mesma mistura. Em pinturas contínuas que atravessem uma fronteira, cada trecho mantém a camada armazenada em sua casa. Papel e transparência permanecem preservados.

A variação de uma criatura viva acompanha sua camada de nascimento, evitando troca instantânea de anatomia ao atravessar um corredor. Uma reanimação passa a usar a versão funerária. Monstros capturados em outras camadas conservam sua variação visual.

As folhas originais estão em `art/layers`; o manifesto registra recortes, transparência e SHA-256 de cada sprite. `npm run build:layer-art` reproduz os recortes. O processamento de componentes isola cada personagem de fragmentos do vizinho; não estica suas formas. Somente PNGs finais entram no pacote web e HTML standalone.

## Salvamentos

Casas antigas conservam seus identificadores de camada. Casas antigas sem identificador recebem Normal. Como os salvamentos anteriores não guardavam todas as fronteiras históricas, a migração usa a última camada e profundidade registradas para estabelecer a fronteira futura inicial; não inventa fronteiras anteriores. Novas descobertas passam a registrar o histórico completo por mundo.

Retornos pendentes do sistema 1.17.1 são migrados para a nova resolução imediata e deixam de ser opções de captura. Marcadores antigos de criaturas reanimadas e corrompidas são reconhecidos. Inimigos que já eram aliados não são descartados pela atualização.

## Verificação

A suíte verifica fronteiras e cartas secundárias, salas antigas na mesma profundidade, construção sem perda de camada, separação dos planos, origem da magia, recursos por produtor, salas extras da Masmorra, posições exatas de reanimação, efeitos simultâneos, persistência, corpos incapturáveis e os 238 PNGs distintos com transparência.

Também foram exercitados navegação e combate no navegador, desktop e toque 390 px, oito paletas distintas, carregamento de todos os sprites e funcionamento offline do HTML. O teste offline usa o mesmo documento por interceptação local sem servidor nem requisições externas, pois o ambiente bloqueia `file://`; não representa um teste em iPhone físico.

Verificação final: 372 testes de regras aprovados; 21 verificações gerais de navegador; fluxos específicos de camadas, captura, pesquisa e HTML offline; verificação de tint, alfa e sprites. Em 96 rodadas de produção com 64 salas, o desenho ficou em 8,3 ms de mediana e 29,7 ms no percentil 95, sem crescimento contínuo dos caches ou dos 21 profissionais. A segunda metade teve percentil 95 de 27,2 ms. Esses tempos são medições do ambiente de teste.
