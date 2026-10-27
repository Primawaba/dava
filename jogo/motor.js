(()=>{'use strict';
const embeddedAssets=window.CONQUER_ART;

// data.js
const DIRS=[[0,-1],[1,0],[0,1],[-1,0]];
const SUITS=['♥','♦','♣','♠'];
const UNITS={
 soldier:{name:'Soldado',icon:'sword',power:5,cost:5,mutiny:8,range:0.42,speed:0.7,homes:['barracks'],capacity:10,desc:'Linha de frente. Espada e escudo; intercepta invasores.'},
 archer:{name:'Arqueiro',icon:'bow',power:3,cost:5,mutiny:12,range:2.05,speed:0.65,homes:['barracks'],capacity:10,desc:'Flechas a até 2 salas. Precisa de linha de visão livre.'},
 mage:{name:'Mago',icon:'spark',power:4,cost:7,mutiny:15,range:2.05,speed:0.6,homes:['library'],capacity:5,desc:'Dispara orbes arcanos a até 2 salas.'},
 cleric:{name:'Clérigo',icon:'cross',power:1,cost:8,mutiny:10,range:1.6,speed:0.6,homes:['temple','altar'],capacity:3,desc:'Concede escudo de 2 de força aos aliados próximos.'},
 dog:{name:'Cão',icon:'paw',power:3,cost:5,mutiny:3,range:0.4,speed:1.3,homes:['kennel'],capacity:5,desc:'Move-se duas vezes mais rápido; intercepta invasores.'},
 rat:{name:'Rato',icon:'paw',power:1,cost:2,mutiny:3,range:0.35,speed:1.4,homes:['sewer'],capacity:20,desc:'Guarnição local: permanece no esgoto e ataca apenas inimigos que entram nele. Cada rato reduz a moral em 1.'},
 thug:{name:'Capanga',icon:'sword',power:3,cost:4,mutiny:10,range:0.42,speed:0.7,homes:['hut','quarters'],capacity:10,desc:'Mercenário de baixo custo. Precisa de abrigo.'},
 beast:{name:'Predador cavernoso',recruitable:false,icon:'paw',power:10,cost:15,mutiny:15,range:0.5,speed:1.1,homes:['kennel','breeder'],capacity:1,desc:'Criatura domesticada. Veloz e poderosa.'},
 alchemist:{name:'Alquimista',icon:'flask',power:2,cost:8,mutiny:10,range:1.8,speed:0.65,homes:['laboratory'],capacity:10,desc:'Arremessa frascos alquímicos de longo alcance.'},
 trapper:{name:'Armadilheiro',icon:'trap',power:1,cost:20,mutiny:0,range:0.4,speed:0.7,homes:['forge'],capacity:2,desc:'Rearma armadilhas próximas durante o combate. Sempre leal.'},
 golem:{name:'Golem',icon:'shield',size:2,power:7,cost:15,mutiny:0,range:0.5,speed:0.45,homes:['golemforge','forge'],capacity:2,requires:'golemforge',desc:'Imune a líquidos e gases. Sempre leal. Exige Forja de Golem.'},
 siege:{name:'Arma de cerco',icon:'target',size:2.6,power:30,cost:30,mutiny:0,range:2.1,speed:0,homes:['siegepost','forge'],capacity:2,requires:'forge',desc:'Um disparo por combate atravessa inimigos e corredores em linha reta até um bloqueio, interrompendo os atingidos por 1 segundo. Não se move.'},
 undead:{name:'Morto-vivo',icon:'skull',power:1,cost:5,mutiny:10,range:0.4,speed:0.6,homes:['crypt'],capacity:20,desc:'50% de chance de voltar à vida após o combate.'},
 hero:{name:'Aventureiro',icon:'sword',power:15,cost:10,mutiny:0,range:0.5,speed:0.8,homes:['tavern'],capacity:1,desc:'Defensor leal atraído pela taverna.'},
 berserker:{name:'Berserker',icon:'sword',power:15,cost:5,mutiny:8,range:0.4,speed:0.9,homes:['meadhall'],capacity:10,desc:'Guerreiro dos Campeões. Busca o inimigo mais próximo.'}
};
// Content is explicit so prices, requirements and tooltips share one source.
const ROOMS={
concert:{name:'Salão de Concertos',r:0,g:0,inventionOnly:2,desc:'Golems musicais atraem invasores para o salão.'},
brewery:{name:'Cervejaria Secreta',r:0,g:0,inventionOnly:3,desc:'A receita secreta dobra a força de aventureiros.'},
dragonforge:{name:'Forja de Fogo de Dragão',r:0,g:0,inventionOnly:10,footprint:2,desc:'Oficina de duas casas para armamentos de fogo de dragão.'},
trapmaster:{name:'Oficina do Mestre de Armadilhas',r:0,g:0,inventionOnly:12,footprint:2,desc:'Oficina de duas casas. Permite armadilhas de nível 4.'},
endersgate:{name:'Portão de Ender',r:0,g:0,inventionOnly:13,desc:'Permite aniquilar todas as criaturas em combate.'},
orefinder:{name:'Localizador de Minério',r:0,g:0,inventionOnly:6,desc:'Oferece duas cartas antes de explorar. Coringas são obrigatórios.'},

 surface:{name:'Terreno de superfície',icon:'home',desc:'Construa diretamente, sem comprar carta. Acima do térreo, exige uma sala de apoio imediatamente abaixo.'},
 gate:{name:'Portão da Fortaleza',icon:'gate',desc:'Três gemas protegem o último reduto. Cada invasão sem oposição destrói uma gema; a terceira encerra a campanha. A derrota no Cristal do Vazio é definitiva, mesmo com gemas restantes.'},
 collapse:{name:'Caverna desabada',icon:'mountain',desc:'Escombros permanentes. Não permite passagem, construção nem escavação.'},
 cave:{name:'Caverna vazia',icon:'mountain',desc:'Espaço explorado. Pode receber uma construção.'},
 barracks:{name:'Quartel',icon:'sword',r:8,g:0,group:'Tropas',desc:'Abriga até 10 soldados ou arqueiros.'},
 kennel:{name:'Canil',icon:'paw',r:5,g:0,group:'Tropas',desc:'Recruta cães. Após uma vitória, permite capturar um monstro que se torna aliado, mantendo espécie e força. Um monstro capturado por Canil, ocupando uma vaga.'},
 library:{name:'Biblioteca',icon:'book',r:15,g:0,group:'Tropas',desc:'Abriga 5 magos. Concede uma magia boa ao ser construída.'},
 forge:{name:'Forja',icon:'anvil',r:10,g:14,group:'Tropas',desc:'Libera armadilhas e armas de cerco. Abriga 2 especialistas.'},
 siegepost:{name:'Posto de cerco',icon:'target',r:10,g:0,group:'Tropas',desc:'Abriga 2 armas de cerco. Seu disparo exige uma Forja.'},
 sewer:{name:'Galeria de esgoto',icon:'water',r:16,g:0,group:'Tropas',unique:true,desc:'Abriga 20 ratos. +20 de tolerância em 5×5; cada rato reduz moral em 1.'},
 laboratory:{name:'Laboratório',icon:'flask',r:5,g:10,group:'Tropas',desc:'Abriga até 10 alquimistas.'},
 temple:{name:'Templo protetor',icon:'cross',r:20,g:20,group:'Tropas',footprint:2,desc:'Ocupa 2 espaços. Abriga 3 clérigos. Concede 20 de escudo aos defensores ao iniciar combate.'},
 prison:{name:'Prisão',icon:'bars',r:30,g:0,group:'Tropas',desc:'Recebe inimigos escolhidos na captura após uma vitória, até 20. Cheia, gera 20♦ por produção. Grades rompidas libertam os ocupantes.'},
 solitary:{name:'Solitária',icon:'bars',r:15,g:0,group:'Tropas',desc:'Guarda um inimigo racional realmente derrotado. Preserva espécie e força. Dano ou desconexão liberta o prisioneiro.'},
 persuasion:{name:'Sala de persuasão',icon:'eye',r:25,g:0,group:'Tropas',desc:'Captura um inimigo inteligente após a vitória, independentemente da Solitária. Interroga automaticamente ao final do turno; num 4 de 1d4 revela Informação. O ocupante é dispensado após a primeira tentativa. Recebe transferências de Solitárias.'},
 hiring:{name:'Setor de contratação',icon:'flag',r:20,g:10,group:'Tropas',requires:['solitary'],desc:'Usa um prisioneiro da Solitária. Uma tentativa por turno: num 4 contrata; num 3 negocia pagamento. O candidato deixa a cela após a tentativa, mesmo se ela falhar. Preserva espécie e força.'},
 hut:{name:'Cabana',icon:'home',r:5,g:0,group:'Fortaleza',desc:'Abriga até 10 unidades desleais, com soma máxima de 30 STR. Inabitável ao lado de uma Mansão.'},
 quarters:{name:'Quarto',icon:'home',r:20,g:0,group:'Fortaleza',desc:'Abriga até 10 unidades e 50 STR. Reduz seu limite de motim em 1; junto a uma Mansão passa a valer como Cabana.'},
 mansion:{name:'Mansão',icon:'crown',r:50,g:20,group:'Fortaleza',desc:'Abriga uma unidade de até 180 STR. Quartos adjacentes viram Cabanas; Cabanas adjacentes deixam de ser habitáveis.'},
 dormitory:{name:'Dormitório',icon:'bed',r:5,g:0,group:'Fortaleza',desc:'Aumenta em 2 a capacidade das salas de tropas adjacentes.'},
 hospital:{name:'Hospital',icon:'cross',r:15,g:10,group:'Fortaleza',desc:'Revive uma unidade caída em até 2 salas após cada combate.'},
 kitchen:{name:'Cozinha',icon:'flame',r:8,g:0,group:'Fortaleza',desc:'Tropas a até 1 sala recebem +50% de dano em combate.'},
 laundry:{name:'Lavanderia',icon:'water',r:10,g:0,group:'Fortaleza',desc:'+2 de tolerância para unidades de abrigos dentro da área de 5×5.'},
 tavern:{name:'Taverna',icon:'mug',r:30,g:10,group:'Fortaleza',desc:'+5 de tolerância em 5×5. Atrai um aventureiro da tabela, com força e habilidade próprias.'},
 arena:{name:'Arena',icon:'flag',r:25,g:0,group:'Fortaleza',desc:'+5 moral global. Derrota amotinados que a atravessarem.'},
 games:{name:'Sala de jogos',icon:'cards',r:20,g:10,group:'Fortaleza',desc:'+10 de tolerância em 5×5. Gera 5♦ por exploração por abrigo a até 2 salas.'},
 parlor:{name:'Parlatório',icon:'mug',r:20,g:0,group:'Fortaleza',desc:'+15 moral. Gera 2♦ por exploração.'},
 warehouse:{name:'Armazém',icon:'box',r:20,g:0,group:'Economia',desc:'+50 ao limite de recursos.'},
 treasury:{name:'Tesouraria',icon:'gem',r:20,g:0,group:'Economia',desc:'+50 ao limite de riquezas.'},
 inspection:{name:'Sala de inspeção',icon:'eye',r:15,g:0,group:'Economia',desc:'Dobra riquezas de cartas ♦ encontradas a até 2 salas.'},
 altar:{name:'Altar',icon:'spark',r:20,g:0,group:'Economia',desc:'Escolha Fortuna (+3♦ no alcance), Guardião (armadilha passável nível 3) ou Devorador (sacrifício e −5 moral por magia boa). Exige clérigo.'},
 workshop:{name:'Oficina',icon:'hammer',r:15,g:0,group:'Economia',desc:'Metade do custo de construções a até 2 salas.'},
 museum:{footprint:2,name:'Museu',icon:'crown',r:50,g:50,group:'Economia',desc:'Registra troféus de grandes inimigos. Cada troféu concede +2 de dano.'},
 masonry:{name:'Pedraria',icon:'hammer',r:20,g:0,group:'Infraestrutura',desc:'Libera barricadas, colunas e salas avançadas.'},
 bridge:{name:'Ponte',icon:'bridge',r:5,g:0,group:'Infraestrutura',desc:'Permite atravessar líquidos com segurança. Gases precisam ser drenados.'},
 drawbridge:{name:'Ponte levadiça',icon:'bridge',r:15,g:0,group:'Infraestrutura',desc:'Abra ou feche no painel da sala. Fechada, interrompe a conexão.'},
 elevator:{name:'Elevador',icon:'stairs',r:5,g:0,group:'Infraestrutura',desc:'Aliados movem-se duas vezes mais rápido nesta sala.'},
 rails:{name:'Trilhos',icon:'stairs',r:5,g:0,group:'Infraestrutura',desc:'Aliados movem-se duas vezes mais rápido nesta sala.'},
 pump:{name:'Bomba de fluido',icon:'water',r:8,g:0,group:'Infraestrutura',desc:'Líquidos não atravessam nem danificam esta célula. Não protege salas vizinhas nem bloqueia gás.'},
 columns:{name:'Colunas',icon:'bars',r:1,g:0,group:'Infraestrutura',requires:['masonry'],desc:'Reforça o espaço e cavernas vizinhas nas quatro direções contra desabamentos, inclusive no subterrâneo. Interrompe a cadeia de desabamentos. Pode ser substituída por outra construção.'},
 puzzle:{name:'Sala de quebra-cabeça',icon:'cards',r:12,g:5,group:'Avançadas',requires:['masonry','forge'],desc:'Inimigos movem-se 65% mais devagar nesta sala.'},
 artificer:{name:'Artificiaria',icon:'flask',r:100,g:50,group:'Avançadas',requires:['forge','library','warehouse'],desc:'Permite inventar melhorias permanentes por 50♦.'},
 breeder:{footprint:4,name:'Criadouro',icon:'paw',r:80,g:0,group:'Avançadas',requires:['artificer'],desc:'Reproduz uma criatura aliada escolhida como matriz. As crias mantêm a espécie, recebem metade da força e custam 15♦; exigem vaga e tolerância.'},
 throne:{name:'Sala do trono',icon:'crown',r:100,g:100,group:'Avançadas',requires:['treasury','warehouse'],unique:true,desc:'Substitui o portão como objetivo dos inimigos.'},
 stabilizer:{name:'Estabilizador planar',icon:'portal',r:50,g:0,group:'Avançadas',on:'portal',desc:'Libera expedições a 13 planos. O portal continua sujeito a invasões de 25% por turno; sele-o para interrompê-las.'},
 forest:{name:'Floresta subterrânea',icon:'tree',desc:'Produz 2♥ por exploração. Pode ser cortada para construir.'},
 gas:{name:'Gás venenoso',icon:'cloud',hazard:true,desc:'Derrota ocupantes imediatamente, também fora de combate. Espalha-se duas salas para os lados e sobe. Drene por 5♦.'},
 flammable:{name:'Gás inflamável',icon:'flame',hazard:true,desc:'Explode imediatamente ao alcançar Forja, Taverna ou Quartel, derrotando ocupantes e danificando salas. Drene por 5♦.'},
 miasma:{name:'Miasma',icon:'cloud',hazard:true,desc:'Reduz moral em 3 por abrigo atingido. Drene por 5♦.'},
 blindgas:{name:'Gás cegante',icon:'cloud',hazard:true,desc:'Impede ataques à distância na nuvem. Drene por 5♦.'},
 water:{name:'Rio subterrâneo',icon:'water',hazard:true,desc:'Derrota unidades atingidas imediatamente. Flui para os lados e para baixo; escavar de cima não derrama o reservatório. Fonte permanente: não pode ser drenada. Construa uma ponte.'},
 lava:{name:'Magma',icon:'flame',hazard:true,desc:'Derrota unidades imediatamente e danifica salas atingidas. A fonte não pode ser drenada. Pontes permitem atravessar; salas atingidas pelo fluxo podem ser drenadas e reparadas.'},
 crystal:{name:'Caverna de cristal',icon:'gem',desc:'A cada turno, compre uma carta e receba seu valor + profundidade em ♦. Um A♦ esgota a caverna; depois ela só permite passagem.'},
 nest:{name:'Ninho de criaturas',icon:'paw',desc:'Antigo covil de criaturas. Pode ser reconstruído após a batalha.'},
 ruins:{name:'Ruínas antigas',icon:'mountain',desc:'Vestígios de uma civilização esquecida. Terreno construível.'},
 crypt:{name:'Cripta esquecida',icon:'skull',desc:'Permite recrutar até 20 mortos-vivos após ser conquistada.'},
 well:{name:'Poço dos desejos',icon:'water',desc:'Pague 10♦ para receber uma magia boa ou ruim.'},
 sealed:{name:'Câmara selada',icon:'bars',desc:'Bloqueia novas descobertas na área 3×3 ao redor. Salas conhecidas não são afetadas. Abrir libera uma maldição; qualquer dano abre a câmara automaticamente.'},
 mine:{name:'Mina abandonada',icon:'hammer',desc:'Uma mina antiga. Gera 2♦ por exploração.'},
 ancienttemple:{name:'Templo abandonado',icon:'cross',desc:'Seu altar esquecido permite invocar uma magia uma vez.'},
 ancientlibrary:{name:'Biblioteca antiga',icon:'book',desc:'Seus conhecimentos concedem uma bênção ao serem encontrados.'},
 portal:{name:'Portal planar',icon:'portal',desc:'25% de chance de invasão por turno, mesmo sem ligação à base. Estabilizar libera expedições, mas não impede invasões. Selar encerra o risco.'},
 golemforge:{name:'Forja de Golem',icon:'anvil',desc:'Um golem passivo guarda a forja. Escolha atacá-lo para iniciar combate; ao vencê-lo, libera o recrutamento de golems.'},
 dragon:{name:'Covil do dragão',icon:'skull',desc:'Roube 20♦ por exploração. Cada roubo tem 25% de chance de acordar o dragão.'},
 mud:{name:'Terreno pegajoso',icon:'water',desc:'Todas as unidades movem-se 50% mais devagar.'},
 mushrooms:{name:'Bosque de cogumelos',icon:'tree',desc:'A colheita pode conceder moral ou recursos.'},
 springs:{name:'Fonte termal',icon:'water',desc:'+2 moral global.'},
 fairy:{name:'Caverna de fadas',icon:'spark',desc:'Um encontro com os habitantes do invisível.'},
 vault:{name:'Cofre oculto',icon:'gem',desc:'Uma antiga tesouraria, guardada por um golem.'},
 labyrinth:{name:'Labirinto',icon:'stairs',desc:'Bloqueia aliados e inimigos até ser mapeado. Escolha explorador: num 4 de 1d4 abre toda a área; caso contrário, ele morre.'},
 void:{name:'Cristal do Vazio',icon:'gem',desc:'A relíquia procurada. Derrote seu guardião para conquistar o abismo.'},
 meadhall:{footprint:2,name:'Salão de hidromel',icon:'mug',desc:'Libera até 10 berserkers. Recompensa do plano dos Campeões.'},
 crater:{name:'Cratera vulcânica',icon:'flame',hazard:true,desc:'Uma abertura vulcânica. Trate como magma: a fonte não pode ser drenada; construa uma ponte.'},
 smalllair:{name:'Covil de criatura pequena',icon:'paw',desc:'Uma criatura territorial vivia aqui. Construível após o combate.'},
 largelair:{name:'Lar de criatura grande',icon:'skull',desc:'Uma criatura grande territorial guarda toda a área. Bloqueia passagem, mas só inicia combate quando provocada.'},
 burrow:{name:'Túnel de escavador',icon:'hammer',desc:'O escavador cava para cima, abrindo cavernas vazias até alcançar uma sala descoberta. O túnel permanece. Construível após o combate.'},
 invincible:{name:'Câmara do Imortal',icon:'skull',desc:'Uma criatura imóvel bloqueia a passagem. Não invade nem ataca a fortaleza. Só pode morrer por efeitos de morte instantânea, como líquidos ou explosões.'},
 wandering:{name:'Caverna da criatura perdida',icon:'paw',desc:'Uma criatura perdida encontra abrigo. Pode ser reconstruída.'},
 elemental:{name:'Santuário de gemas',icon:'gem',desc:'Um elemental protege estes cristais. Gera 4♦ por exploração após a vitória.'},
 hive:{name:'Colmeia subterrânea',icon:'tree',desc:'Uma colônia de criaturas protege seu ninho. Gera 2♥ por exploração após a vitória.'},
 hungry:{name:'Covil da criatura faminta',icon:'skull',desc:'Fera passiva. Cada unidade sacrificada lhe dá +20 STR. Com Canil, tente domesticar: 25% de sucesso; falha inicia combate.'},
 artifact:{name:'Câmara do artefato',icon:'spark',desc:'Uma arma encantada concedeu uma bênção permanente às suas tropas.'},
 desolate:{name:'Covil desolado',icon:'skull',desc:'Um antigo reduto ocupado por invasores. Construível após o combate.'},
 shaft:{name:'Fosso de elevador',icon:'stairs',desc:'Exploradores rivais desceram por este fosso. Após a vitória, aliados atravessam mais rápido.'},
 rivalmine:{name:'Acampamento rival',icon:'hammer',desc:'Mineiros rivais guardam recursos. Ao vencer, receba 20♥.'},
 ritual:{name:'Ritual interrompido',icon:'spark',desc:'Um ritual liberou uma maldição. Invoque o círculo uma vez para receber uma bênção.'},
 city:{name:'Cidade subterrânea',icon:'home',desc:'Habitantes territoriais não atacam a base até serem provocados. Após a conquista, gera 3♦ por exploração.'},
 tomb:{name:'Tumba dos horrores',icon:'skull',desc:'Seu guardião protege uma relíquia lendária. Ao vencer, recebe uma bênção.'},
 chaos:{name:'Altar caótico',icon:'spark',desc:'Ative uma vez: arrisque uma maldição em troca de uma bênção e recursos.'},
 ancientprison:{name:'Prisão antiga',icon:'bars',desc:'Liberte um prisioneiro: 25% de chance de ganhar uma fera leal; caso contrário, ela ataca.'},
 challenge:{name:'Arena do campeão',icon:'flag',desc:'Escolha um desafiante: num 4 de 1d4 o campeão de 60 STR se alia (motim 8); falha mata o desafiante e inicia combate.'},
 rivalhold:{name:'Masmorra rival',icon:'gate',desc:'Revela automaticamente 1d10+2 espaços, cada um resolvido como uma carta de espadas. Com combate, a vitória rende 10♦ por espaço.'}
};
const PLANES=[
 {name:'Plano da Ordem',artifact:'Asas de Ícaro',effect:'speed',desc:'Sentinelas incansáveis. Recompensa: +15% de velocidade.'},
 {name:'Plano Marinho',artifact:'Escafandro',effect:'water',desc:'Um oceano sem fim. Recompensa: imunidade à água.'},
 {name:'Plano do Fogo',artifact:'Placa de Obsidiana',effect:'lava',desc:'Criaturas de brasas. Recompensa: imunidade ao magma.'},
 {name:'Mundo Pesadelo',artifact:'Fábrica de Monstros',effect:'power',desc:'Enfrente uma monstruosidade. Recompensa: +10% de dano.'},
 {name:'Plano Silvestre',artifact:'Fagulha de Vida',effect:'forest',desc:'Guardiões gigantes. Recompensa: +4♥ por exploração.'},
 {name:'Plano das Estrelas',artifact:'Tomo Maldito',effect:'magic',desc:'Entidades do vazio. Recompensa: uma magia boa por exploração.'},
 {name:'A Máquina',artifact:'Pensador Perpétuo',effect:'invention',desc:'Autômatos de aço. Recompensa: +20% de dano.'},
 {name:'Mundo das Fadas',artifact:'Templo das Fadas',effect:'morale',desc:'Ilusões encantadoras. Recompensa: +20 de tolerância em 5×5.'},
 {name:'Terra dos Campeões',artifact:'Salão de Hidromel',effect:'berserker',desc:'Heróis lendários. Recompensa: um salão para berserkers.'},
 {name:'A Colmeia',artifact:'Apiários',effect:'honey',desc:'Enxames venenosos. Recompensa: +10♥ por exploração.'},
 {name:'Plano dos Gatos',artifact:'Gato Rei',effect:'cat',desc:'Felinos colossais. Recompensa: +10 moral e defesa do portão.'},
 {name:'A Jaula',artifact:'Algemas de Mithrill',effect:'loyal',desc:'Carcereiros brutais. Recompensa: recrutados sempre leais.'},
 {name:'Antiquário Cósmico',artifact:'O Curador',effect:'museum',desc:'Guardiões antigos. Recompensa: +5♦ por exploração.'}
];
const BUILDABLE=Object.keys(ROOMS).filter(k=>ROOMS[k].r!==undefined&&!ROOMS[k].inventionOnly);
const BUILD_GROUPS=['Tropas','Fortaleza','Economia','Infraestrutura','Avançadas'];
const NATURAL=['forest','gas','fairy','water','cave','crystal','nest','crater','smalllair','largelair','burrow','invincible','wandering','mud','mushrooms','fairy','springs','elemental','hive','hungry'];
const REMNANTS=['ruins','crypt','well','sealed','mine','ancienttemple','ruins','ancientlibrary','portal','golemforge','artifact','dragon','desolate','shaft','rivalmine','ritual','city','tomb','labyrinth','chaos','vault','ancientprison','challenge','rivalhold'];
const DIFFICULTIES={story:{name:'Crônica',enemy:0.65,desc:'Uma jornada mais tranquila. Inimigos com 65% da força.'},normal:{name:'Conquistador',enemy:1,desc:'A experiência padrão. Prepare suas defesas antes de descer.'},hard:{name:'Abismo',enemy:1.45,desc:'Inimigos com 145% da força. Cada decisão importa.'}};

// Sprite cells in the generated 8 × 4 pixel atlas. Large creatures stay individual.
const SPRITE_FRAMES={soldier:0,archer:1,mage:2,cleric:3,dog:4,rat:5,thug:6,beast:7,alchemist:8,trapper:9,golem:10,siege:11,undead:12,hero:13,berserker:14,goblin:15,skeleton:16,insect:17,insectqueen:18,cultist:19,miner:20,automaton:21,cavewolf:22,worm:23,dragon:24,guardian:25,troll:26,elemental:27,fairy:28,champion:29,lich:30,spider:31,raider:15,immortal:32};
const ENEMIES={
 immortal:{name:'Criatura Imortal',speed:0,range:0,size:2.3,single:true},
 goblin:{name:'Goblin',speed:.65,range:.42,size:1},
 skeleton:{name:'Morto-vivo da cripta',speed:.55,range:.42,size:1},
 insect:{name:'Inseto da colmeia',speed:.9,range:.38,size:.85},
 insectqueen:{name:'Rainha da colmeia',speed:.45,range:.5,size:2.4,single:true},
 cultist:{name:'Cultista',speed:.6,range:1.8,size:1},
 miner:{name:'Mineiro rival',speed:.6,range:.42,size:1},
 automaton:{name:'Autômato',speed:.45,range:.45,size:1.4},
 cavewolf:{name:'Lobo cavernoso',speed:1.1,range:.4,size:1.15},
 worm:{name:'Verme escavador',speed:.65,range:.5,size:2.2,single:true},
 dragon:{name:'Dragão antigo',speed:.45,range:2,size:3.2,single:true},
 guardian:{name:'Guardião do Vazio',speed:.5,range:1.2,size:2.8,single:true},
 troll:{name:'Criatura gigante',speed:.5,range:.5,size:2.6,single:true},
 elemental:{name:'Elemental de gema',speed:.45,range:.5,size:2.2,single:true},
 fairy:{name:'Fada',speed:1,range:1.5,size:.7},
 champion:{name:'Campeão',speed:.7,range:.5,size:1.6,single:true},
 lich:{name:'Lich',speed:.5,range:2,size:1.4,single:true},
 spider:{name:'Aranha gigante',speed:.9,range:.5,size:2.2,single:true},
 beast:{name:'Predador cavernoso',speed:1,range:.5,size:1.8,single:true},
 golem:{name:'Golem guardião',speed:.45,range:.5,size:2,single:true},
 undead:{name:'Morto-vivo',speed:.55,range:.42,size:1},
 raider:{name:'Invasor',speed:.65,range:.42,size:1}
};

const PASSAGES=['h-0','h-1','v-0','v-1','door-e','door-w','door-n','door-s','grate'];

const DAMAGEABLE_ROOMS=Object.keys(ROOMS).filter(type=>ROOMS[type].r!==undefined||type==='gate');
const CRYSTAL_PALETTE={floor:[22,37,52],wall:[62,88,112],light:[127,180,215]};


// narrative.js
// A category has its own phrase cycle. Selecting prose never consumes game RNG.
const CHRONICLE_TEMPLATES={
 founding:[
 'Cinco guerreiros cruzaram o portão e juraram guardar a nova fortaleza. À frente deles, a montanha ainda escondia todos os seus segredos.',
 'A história começou com cinco guardiões diante de um portão recém-aberto. Atrás deles ficaria o mundo conhecido; adiante, a pedra por conquistar.',
 'Cinco companheiros assumiram a primeira vigília. Entre a entrada e o coração da montanha, tudo ainda estava por construir.',
 'O portão recebeu seus primeiros defensores. Eram cinco, unidos pela promessa de fazer daquela entrada uma fortaleza.',
 'A primeira guarnição reuniu-se sob o arco do portão. Cinco guerreiros leais dariam início à jornada nas profundezas.'
 ],
 turn:[
 'A vida seguiu entre as muralhas. Enquanto os habitantes cuidavam de seus afazeres, a próxima incursão nas profundezas era preparada.',
 'Ferramentas e conversas voltaram a preencher os corredores. Havia trabalho a terminar antes da próxima escavação.',
 'Os habitantes retomaram seus postos, divididos entre o cuidado da fortaleza e a expectativa do que haveria além da pedra.',
 'A rotina encontrou seu ritmo sob a montanha. As oficinas trabalhavam enquanto se preparava um novo avanço.',
 'Mais uma etapa da jornada começou. Entre reparos, provisões e planos, a fortaleza se preparou para crescer.',
 'Passos conhecidos percorreram os túneis. Cada habitante retomou sua tarefa, e a exploração voltou a ocupar as conversas.'
 ],
 combat:[
 'O alarme ecoou pelos túneis. Os defensores deixaram seus postos e correram para conter os invasores, repartindo suas forças entre as frentes ameaçadas.',
 'O chamado às armas interrompeu a rotina. A guarnição reuniu-se nos corredores para enfrentar a ameaça.',
 'Havia inimigos na fortaleza. Os defensores buscaram suas armas e avançaram para os pontos em perigo.',
 'A vigília transformou-se em batalha. Tropas deixaram seus abrigos para proteger os caminhos da fortaleza.',
 'Os corredores encheram-se de passos apressados. A defesa organizou suas frentes diante dos inimigos.',
 'O trabalho foi interrompido pelo chamado dos guardas. Mais uma vez, a segurança da fortaleza dependeria das armas.'
 ],
 victory:[
 'Quando o último invasor caiu, o silêncio voltou aos corredores. Os sobreviventes recolheram os espólios e regressaram aos seus afazeres com o ânimo renovado.',
 'A defesa prevaleceu. Entre os restos da batalha, os sobreviventes reuniram o que podia ser aproveitado e retomaram a vida da fortaleza.',
 'Os inimigos foram vencidos. A guarnição pôde baixar as armas, recuperar o fôlego e recolher os espólios.',
 'A ameaça terminou diante da resistência dos defensores. Os sobreviventes voltaram aos seus postos mais confiantes.',
 'A fortaleza resistiu a outra batalha. O fim do combate trouxe alívio aos habitantes e novos espólios às reservas.',
 'Por fim, os corredores ficaram livres dos invasores. Os que sobreviveram cuidaram da recuperação e do que restara do confronto.'
 ],
 doorBuilt:[
 'Uma porta reforçada foi erguida no túnel. Atrás de suas traves, a fortaleza ganhou um novo refúgio contra os perigos da montanha.',
 'Os construtores fecharam o trabalho com uma porta robusta. A passagem agora tinha uma proteção própria.',
 'Ferro e madeira reforçada passaram a guardar o corredor. Os habitantes encontraram ali uma defesa a mais.',
 'Uma nova porta tomou seu lugar entre as salas. Suas traves poderiam deter o que antes atravessava o túnel livremente.',
 'O corredor recebeu uma barreira reforçada. A fortaleza dispunha de mais um ponto onde conter o perigo.'
 ],
 doorLost:[
 'As traves cederam, e a porta reforçada desabou. O túnel estava aberto outra vez, deixando os habitantes expostos ao que viesse do outro lado.',
 'A porta não resistiu. Onde antes havia uma barreira, restou uma passagem sem proteção.',
 'A defesa do corredor foi rompida. Os habitantes perderam a segurança oferecida por aquela porta.',
 'A porta reforçada foi destruída, abrindo o caminho para os perigos do outro lado.',
 'A barreira do túnel cedeu. A passagem deixou de contar com a proteção de suas traves.'
 ],
 jokerDepth:[
 'Os exploradores desceram além dos primeiros estratos. Naquela escuridão mais antiga, maravilhas e horrores começaram a disputar o destino da fortaleza.',
 'A quinta profundidade foi alcançada. Dali em diante, o desconhecido guardaria encontros ainda mais extraordinários.',
 'A escavação chegou ao quinto andar da montanha. Novos presságios passaram a acompanhar a jornada.',
 'Ao atingir a quinta profundidade, os habitantes entraram numa parte da montanha capaz de esconder relíquias e monstruosidades.',
 'Os túneis finalmente alcançaram a quinta profundidade. A fortaleza estava pronta para encontrar segredos de outra ordem.'
 ],
 artifact:[
 'Um artefato despertou em meio à pedra. Sua bênção acompanharia os defensores nas batalhas que ainda estavam por vir.',
 'A fortaleza recebeu a bênção de um artefato encantado. Seu poder fortaleceu as armas dos defensores.',
 'Um novo poder foi descoberto na relíquia. Os guerreiros levariam sua força para os próximos confrontos.',
 'O encanto do artefato passou a servir à fortaleza, tornando seus defensores mais perigosos em batalha.',
 'A relíquia revelou uma bênção duradoura. A guarnição ganhou força para enfrentar a escuridão.'
 ],
 festival:[
 'As preocupações deram lugar à música e às conversas do festival. Por algumas horas, os habitantes puderam esquecer o peso da montanha.',
 'A fortaleza celebrou um festival. A convivência renovou o ânimo daqueles que viviam sob a pedra.',
 'Os habitantes reservaram um tempo para festejar. A celebração trouxe disposição nova aos corredores.',
 'Um festival interrompeu a rotina de trabalho e vigília. O encontro deixou os habitantes mais animados.',
 'A celebração reuniu os moradores da fortaleza. Por algum tempo, os perigos da exploração ficaram em segundo plano.'
 ],
 theftDragon:[
 'Mãos cautelosas retiraram ouro da pilha de tesouros. O dragão não despertou, e os ladrões voltaram em silêncio, carregando sua pequena fortuna.',
 'O ouro foi retirado sem acordar seu dono. Os saqueadores deixaram o covil enquanto o dragão permanecia adormecido.',
 'A incursão ao tesouro terminou em silêncio. A fortaleza ganhou ouro, e o dragão continuou a dormir.',
 'Uma parte do tesouro foi levada do covil. A criatura não percebeu o roubo e permaneceu em seu sono.',
 'Os ladrões saíram com ouro e com a sorte de não terem despertado o dragão.'
 ],
 invention:[
 'Das oficinas saiu uma descoberta que mudaria o modo de lutar da fortaleza. Os defensores receberam os novos engenhos com esperança renovada.',
 'A engenhosidade dos artífices produziu um novo avanço. As tropas passaram a contar com armamentos mais eficazes.',
 'O trabalho de pesquisa deu resultado nas oficinas. A fortaleza ganhou uma vantagem para as batalhas futuras.',
 'Os construtores apresentaram seus novos engenhos à guarnição. A descoberta tornou a defesa mais forte.',
 'Uma inovação tomou forma entre ferramentas e projetos. Seu efeito seria sentido nas armas dos defensores.'
 ],
 hospital:[
 'No hospital, um defensor que parecia perdido abriu os olhos novamente. Seus companheiros voltariam a vê-lo entre eles.',
 'Um combatente foi trazido de volta pelo hospital. A guarnição recebeu novamente alguém que havia caído.',
 'O cuidado do hospital recuperou um defensor derrotado. Ele pôde voltar a servir à fortaleza.',
 'A batalha não teria a última palavra sobre aquele defensor. O hospital conseguiu devolvê-lo aos companheiros.',
 'Um dos caídos retornou graças ao hospital. Seu lugar entre as tropas deixaria de ficar vazio.'
 ],
 immortal:[
 'A criatura que resistira a tantos golpes enfim foi vencida por um poder capaz de encerrar sua existência. A passagem antes proibida ficou em silêncio.',
 'Um efeito de morte instantânea pôs fim à criatura imortal. O caminho que ela guardava ficou livre.',
 'A existência do guardião imortal foi encerrada. Os habitantes poderiam atravessar a passagem antes bloqueada.',
 'O bloqueio da criatura imortal terminou diante de um poder que não dependia de feri-la aos poucos.',
 'A criatura imortal deixou de guardar a sala. Sua morte abriu um caminho que as armas comuns não conseguiam libertar.'
 ],
 defense:[
 'Novas defesas foram preparadas na pedra. Os habitantes esperavam que elas detivessem os próximos intrusos.',
 'A fortaleza ganhou outra defesa. O corredor estava mais bem preparado para receber inimigos.',
 'Os artífices concluíram a instalação defensiva. Uma nova proteção aguardava os invasores.',
 'O caminho foi preparado para resistir a uma incursão. Os defensores ganharam mais um recurso contra a ameaça.',
 'Mais uma defesa tomou seu lugar na fortaleza, reforçando os planos de proteção dos habitantes.'
 ],
 defeat:[
 'A última gema se desfez sobre o portão. Sem sua proteção, a fortaleza caiu, e as vozes dos habitantes se perderam no abismo.',
 'A terceira gema se partiu. A proteção do portão terminou, encerrando a resistência da fortaleza.',
 'Nenhuma gema restou para guardar a entrada. A fortaleza sucumbiu depois de sua última defesa.',
 'A perda da última gema marcou a queda da fortaleza. A jornada de seus habitantes chegara ao fim.',
 'Sobre o portão, a terceira gema foi destruída. A fortaleza não conseguiria continuar a resistir.'
 ],
 construction:[
 'Onde antes havia apenas rocha, tomou forma {room}. O trabalho dos construtores acrescentou um novo lugar à vida da fortaleza.',
 '{room} passou a fazer parte da fortaleza. Ferramentas e materiais deram uma nova função àquele espaço.',
 'Os construtores concluíram {room}. Os habitantes puderam começar a usar mais uma instalação.',
 'A construção de {room} terminou. A fortaleza ganhou um espaço para ampliar seus planos.',
 'Mais uma obra foi entregue: {room}. O esforço dos habitantes deixou sua marca na pedra.'
 ],
 recruitment:[
 '{unit} apresentou-se em {room} e passou a integrar a guarnição. Mais um habitante assumia seu lugar na defesa da fortaleza.',
 'A guarnição recebeu {unit}, instalado em {room}. A fortaleza contaria com mais um defensor.',
 '{room} recebeu um novo ocupante: {unit}. Suas forças se juntaram às da defesa.',
 'O recrutamento de {unit} reforçou as tropas. Seu lugar na fortaleza seria em {room}.',
 'Mais um combatente entrou para a defesa: {unit}, destinado a {room}.'
 ],
 passage:[
 'Os golpes das ferramentas abriram caminho entre {from} e {to}. Pela primeira vez, os habitantes puderam atravessar de uma sala à outra.',
 'Uma passagem foi aberta entre {from} e {to}. Os dois espaços passaram a compartilhar um caminho.',
 'A parede entre {from} e {to} deu lugar a um túnel. A circulação da fortaleza ganhou outra rota.',
 '{from} e {to} foram ligadas pelos escavadores. O trajeto antes interrompido ficou livre.',
 'O trabalho na pedra uniu {from} a {to}. Os habitantes ganharam um novo corredor para percorrer.'
 ],
 production:[
 'O trabalho dos habitantes rendeu novos materiais e riquezas. As reservas receberam o fruto de mais uma jornada sob a montanha.',
 'Os produtores entregaram o resultado de seu trabalho. Novas provisões foram reunidas nas reservas.',
 'O esforço cotidiano voltou a abastecer a fortaleza. Os estoques receberam uma nova contribuição.',
 'As atividades da fortaleza deram seus frutos. Materiais e riquezas encontraram lugar entre as reservas.',
 'Mais uma produção foi recolhida. O trabalho nas salas ajudou a sustentar os próximos planos.',
 'O movimento dos trabalhadores terminou em novas entregas aos estoques. A fortaleza pôde contar com o que produziu.',
 'As reservas cresceram com o resultado das atividades locais. Cada entrega ajudaria a manter a fortaleza em funcionamento.'
 ],
 trade:[
 'As reservas mudaram de mãos. Os mercadores levaram parte dos estoques e deixaram aquilo de que a fortaleza precisava naquele momento.',
 'Uma troca foi concluída. Parte das reservas foi cedida em busca de suprimentos mais úteis aos planos atuais.',
 'Os habitantes negociaram seus estoques e receberam outros bens em retorno.',
 'A negociação alterou o conteúdo das reservas. A fortaleza trocou o que possuía pelo que precisava.',
 'O acordo de troca foi cumprido. Novos bens entraram onde outros deixaram os estoques.'
 ],
 mutiny:[
 'O descontentamento de {unit} tornou-se rebelião. Quem antes defendia a fortaleza voltou-se contra seus antigos companheiros.',
 '{unit} rompeu com a fortaleza. A defesa ganhou um inimigo entre aqueles que antes serviam a ela.',
 'A lealdade de {unit} não resistiu. O motim transformou um antigo defensor em ameaça.',
 'A insatisfação levou {unit} à revolta. Os habitantes teriam de enfrentar alguém que conhecia seus corredores.',
 '{unit} se amotinou e voltou suas armas contra a fortaleza.'
 ],
 discovery:[
 'Ao romper a última camada de pedra, os exploradores encontraram {room}. As lanternas iluminaram mais um lugar até então oculto sob a montanha.',
 'A escavação revelou {room}. Mais um dos segredos da montanha passou a fazer parte do mapa.',
 'Além da abertura recém-feita estava {room}. Os habitantes descobriram outro destino para seus túneis.',
 'As ferramentas alcançaram {room}. A descoberta ampliou o conhecimento da fortaleza sobre as profundezas.',
 'O avanço dos exploradores levou a {room}. A pedra guardava mais uma surpresa.',
 'Uma passagem para o desconhecido revelou {room}. O novo espaço ganhou lugar na história da fortaleza.',
 'A luz das lanternas entrou em {room}, até então escondida da fortaleza.',
 'Os escavadores encontraram {room} durante seu avanço. O mapa já não terminava naquele ponto.'
 ],
 resourceFind:[
 'Os exploradores voltaram com {n} {resource}, encontrados entre os segredos da montanha. A descoberta alimentou os planos da fortaleza.',
 'A busca rendeu {n} {resource}. O achado foi levado para reforçar as reservas.',
 'Entre a pedra recém-explorada foram encontrados {n} {resource}, destinados aos próximos esforços da fortaleza.',
 'O avanço trouxe um ganho de {n} {resource}. Os habitantes recolheram o que conseguiram encontrar.',
 'A exploração revelou {n} {resource}. A fortaleza recebeu mais um recurso para seus planos.'
 ],
 portalAttack:[
 'A superfície do portal se agitou. Invasores vindos de outro mundo atravessaram a passagem, levando uma nova ameaça aos corredores da fortaleza.',
 'O portal abriu caminho para uma incursão. Criaturas de outro plano entraram na fortaleza.',
 'A vigília do portal foi interrompida por invasores. A passagem entre mundos tornara-se uma frente de batalha.',
 'Inimigos atravessaram o portal e alcançaram os corredores. A fortaleza teria de defender sua ligação com outro mundo.',
 'A travessia do portal trouxe uma ameaça. Tropas estrangeiras avançaram para o interior da fortaleza.'
 ],
 portalQuiet:[
 'Os guardas vigiaram o portal, atentos a qualquer movimento. Dessa vez, nada atravessou a passagem.',
 'O portal permaneceu sob observação. Nenhum invasor apareceu do outro lado.',
 'A vigília junto ao portal terminou sem uma incursão. A passagem entre mundos continuou silenciosa.',
 'Os defensores mantiveram os olhos no portal, mas não precisaram enfrentar visitantes hostis.',
 'Nada de ameaçador saiu do portal durante aquela vigília.'
 ],
 rivalFound:[
 'Além da primeira câmara, os exploradores descobriram novas salas de uma masmorra rival. A presença de vizinhos hostis tornava a montanha ainda mais perigosa.',
 'Uma masmorra rival revelou a extensão de suas salas. A fortaleza havia encontrado outra presença sob a montanha.',
 'Os exploradores mapearam novos trechos da masmorra rival. A descoberta mostrava que não estavam sozinhos nas profundezas.',
 'Mais salas de uma masmorra rival foram reveladas. Seus corredores se estendiam além do encontro inicial.',
 'A descoberta de uma masmorra rival abriu outra parte do mapa, acompanhada pelos perigos de seus ocupantes.'
 ],
 rivalWon:[
 'Os últimos redutos da masmorra rival cederam. Seus tesouros foram levados à fortaleza, e seus corredores deixaram de abrigar uma ameaça.',
 'A masmorra rival foi conquistada. A fortaleza recolheu suas riquezas e assegurou aqueles espaços.',
 'A resistência da masmorra rival terminou. Os vencedores puderam tomar seus espólios.',
 'Os habitantes celebraram a conquista da masmorra rival, cujos corredores já não pertenciam aos inimigos.',
 'A fortaleza prevaleceu sobre seus rivais e reuniu os despojos da conquista.'
 ],
 broadCave:[
 'A luz das lanternas não alcançou a outra extremidade da caverna. O salão natural abria-se muito além do que a entrada fazia imaginar.',
 'Os exploradores encontraram uma caverna que continuava para além do primeiro espaço.',
 'A abertura revelou um salão natural amplo, que exigiria mais lugar no mapa.',
 'A caverna mostrou sua extensão aos poucos. Sua entrada escondia um espaço maior do que parecia.',
 'A escavação desembocou numa caverna extensa. A fortaleza ganhava conhecimento de um salão contínuo sob a pedra.'
 ],
 formation:[
 '{room} revelou-se maior do que parecia. Sua extensão continuava para além da primeira câmara, formando um único lugar sob a montanha.',
 'Os exploradores seguiram a continuidade de {room} e descobriram que o mesmo lugar ocupava várias casas.',
 'A extensão de {room} ganhou forma no mapa. Seus trechos pertenciam a uma única formação.',
 'A descoberta de {room} não terminou na primeira abertura. Outros espaços davam continuidade ao mesmo lugar.',
 '{room} estendia-se por mais de uma casa, compondo uma formação contínua.'
 ],
 gemLost:[
 'Uma das gemas se rompeu sobre o portão. Os invasores desapareceram em clarões de magia, e cinco guardiões retomaram a vigília. A fortaleza sobrevivera, mas sua proteção estava mais frágil.',
 'A derrota custou uma gema do portão. Sua magia dissipou os invasores, enquanto cinco guardiões assumiam novamente a entrada.',
 'Uma gema foi destruída para que a fortaleza pudesse continuar. Os inimigos desapareceram, e cinco defensores voltaram ao portão.',
 'O portão perdeu parte de sua proteção. A gema quebrada levou os invasores consigo e permitiu uma nova vigília de cinco guardiões.',
 'A fortaleza resistiu à derrota graças ao sacrifício de uma gema. Quando os inimigos sumiram, cinco guardiões retomaram seus postos.'
 ],
 explosion:[
 'Um clarão correu pelos túneis tomados pelo gás. A explosão sacudiu a fortaleza e deixou um rastro de construções danificadas.',
 'O gás encontrou uma fonte de ignição. A explosão atingiu as construções alcançadas pela nuvem.',
 'Uma explosão rompeu a quietude dos corredores. O gás inflamável deixara danos por onde se espalhara.',
 'Os túneis tomados pelo gás foram sacudidos por uma detonação, danificando as salas atingidas.',
 'A nuvem inflamável incendiou-se. Restou à fortaleza lidar com os danos da explosão.'
 ],
 casualties:[
 'Os perigos do ambiente alcançaram os habitantes antes que pudessem escapar. A fortaleza perdeu {n} de seus defensores.',
 '{n} defensores caíram diante dos líquidos ou vapores perigosos da montanha.',
 'A exposição aos perigos das salas derrotou {n} unidades da fortaleza.',
 'O ambiente cobrou novas baixas: {n} defensores não resistiram aos fluidos ou gases.',
 'A fortaleza perdeu {n} combatentes para perigos que não podiam enfrentar apenas com suas armas.'
 ],
 upgrade:[
 'Os artífices voltaram às defesas e aperfeiçoaram seu trabalho. Os próximos invasores encontrariam uma resistência ainda maior.',
 'A defesa recebeu novos aperfeiçoamentos. O trabalho dos artífices tornou a proteção mais eficaz.',
 'Os habitantes reforçaram uma instalação defensiva, preparando-a melhor para os confrontos seguintes.',
 'Mais trabalho foi dedicado às defesas existentes. Seus mecanismos ganharam um novo aprimoramento.',
 'Uma defesa da fortaleza foi melhorada. A experiência dos construtores acrescentou resistência ao que já estava pronto.'
 ],
 goodMagic:[
 'Uma bênção alcançou a fortaleza: {spell}. Os habitantes sentiram a presença de seu encanto.',
 'O poder de {spell} manifestou-se em favor da fortaleza.',
 'A magia de {spell} trouxe um novo auxílio aos habitantes.',
 'Um encanto benéfico tomou forma sob o nome de {spell}.',
 'Os habitantes receberam a bênção de {spell} em sua jornada sob a montanha.'
 ],
 badMagic:[
 'Uma maldição caiu sobre a fortaleza: {spell}. Os habitantes teriam de lidar com seus efeitos.',
 'O poder de {spell} lançou uma nova dificuldade sobre a jornada.',
 'A fortaleza foi alcançada pela magia de {spell}, um presságio desfavorável aos seus habitantes.',
 'Um encanto hostil manifestou-se: {spell}. Mais uma ameaça exigia atenção.',
 'A maldição de {spell} fez sentir sua presença entre os habitantes.'
 ],
 bandits:[
 'Bandidos encontraram uma entrada nas profundezas. Seus passos ecoaram pelos túneis, ameaçando os habitantes da fortaleza.',
 'Uma companhia de bandidos apareceu nos trechos mais profundos e avançou para o interior da fortaleza.',
 'Os túneis profundos trouxeram visitantes hostis: um grupo de bandidos buscava caminho entre as salas.',
 'A fortaleza recebeu uma incursão de bandidos pelas profundezas. A guarnição teria de contê-los.',
 'Bandidos alcançaram a fortaleza por sua parte mais profunda. O perigo agora vinha de dentro da montanha.'
 ],
 layer:[
 'Os exploradores alcançaram {room}. A pedra revelada dali em diante guardaria os sinais dessa camada.',
 'Uma nova camada foi encontrada: {room}. As próximas descobertas carregariam sua marca.',
 'A escavação tocou {room}, acrescentando outra natureza às profundezas ainda desconhecidas.',
 'A montanha revelou a camada {room}. Um novo trecho da jornada começava a se desenhar.',
 'Os habitantes chegaram a {room}. A partir daquela profundidade, novas salas poderiam guardar suas particularidades.'
 ],
 reanimation:[
 'O corpo de {unit} ergueu-se onde havia caído. A morte lhe dera uma nova e terrível forma.',
 '{unit} voltou a se mover no lugar de sua queda. Um morto-vivo tomara o lugar do inimigo derrotado.',
 'A derrota não encerrou a ameaça de {unit}. Seu corpo se levantou novamente, agora morto-vivo.',
 'Onde {unit} havia tombado, uma forma reanimada voltou a ameaçar os defensores.',
 'O corpo caído de {unit} recebeu uma segunda existência. Os defensores teriam de enfrentar sua forma morta-viva.'
 ],
 research:[
 'Os segredos arrancados dos prisioneiros inspiraram os artífices: {room} passou a fazer parte dos planos da fortaleza.',
 'As informações obtidas abriram caminho para {room}. Os habitantes ganharam um novo projeto para executar.',
 'O conhecimento reunido na fortaleza deu origem aos planos de {room}.',
 'Os artífices compreenderam os segredos necessários para {room}. A descoberta ficaria entre os projetos conhecidos.',
 'As informações recolhidas tornaram possível o projeto de {room}, ampliando as escolhas dos construtores.'
 ],
 seal:[
 'A câmara selada foi aberta, libertando sua maldição. A exploração ao redor pôde continuar.',
 'O selo da câmara cedeu. A maldição foi liberada, mas o caminho para novas escavações voltou a ficar disponível.',
 'A abertura da câmara trouxe seu perigo oculto à fortaleza e encerrou o bloqueio das explorações próximas.',
 'A câmara deixou de estar selada. Sua maldição foi solta, e os espaços ao redor voltaram a poder ser explorados.',
 'A barreira da câmara foi rompida. A fortaleza teria de enfrentar sua maldição para seguir explorando.'
 ],
 exhaustion:[
 'Os cristais se esgotaram. A caverna continuava aberta à passagem, mas já não oferecia sua antiga riqueza.',
 'A fonte de cristais deixou de produzir. Restou uma sala transitável, marcada pelo esgotamento.',
 'A extração chegou ao fim naquela caverna de cristal. Seus caminhos permaneceram, mas sua produção cessou.',
 'A caverna perdeu os cristais que sustentavam sua produção. Os habitantes ainda poderiam atravessá-la.',
 'Os habitantes encontraram o veio de cristal esgotado. A sala já não abasteceria as reservas.'
 ],
 bridge:[
 'A ponte levadiça foi {state}. A fortaleza passou a contar com uma nova disposição de seus caminhos.',
 'Os habitantes deixaram a ponte levadiça {state}, alterando a passagem naquele ponto.',
 'A ponte foi {state}. Sua posição mudou o caminho disponível entre as salas.',
 'Uma ordem mudou a posição da ponte levadiça, agora {state}.',
 'A travessia foi ajustada: a ponte levadiça ficou {state}.'
 ],
 drain:[
 'O perigo líquido ou gasoso foi drenado. A sala voltou a mostrar o que havia sob a contaminação.',
 'A drenagem retirou o fluido ou gás da sala. Os habitantes puderam avaliar o espaço liberado.',
 'O trabalho de drenagem limpou a sala do perigo que a ocupava.',
 'A sala foi drenada. A fortaleza recuperou o espaço antes tomado pela contaminação.',
 'Os habitantes concluíram a retirada do fluido ou gás. O lugar podia ser usado conforme o estado de sua estrutura.'
 ],
 portalClosed:[
 'O portal foi selado. Aquela passagem deixou de oferecer uma entrada para novas invasões.',
 'Os habitantes encerraram a ligação do portal. Invasores já não poderiam entrar por ele.',
 'A ameaça daquela passagem entre mundos foi contida com o fechamento do portal.',
 'O selo do portal foi concluído, interrompendo a chegada de inimigos por aquela sala.',
 'A fortaleza fechou o portal e eliminou uma de suas entradas para invasores.'
 ],
 burrow:[
 '{detail} Os escavadores da fortaleza acompanharam as marcas deixadas na pedra.',
 'O movimento da criatura escavadora alterou os caminhos sob a montanha. {detail}',
 'A pedra registrou a passagem do escavador. {detail}',
 '{detail} Seus túneis acrescentaram um novo perigo ao mapa.',
 'O escavador voltou a mover a terra. {detail}'
 ],
 capturedRoom:[
 'Os invasores tomaram {room}. A fortaleza perdeu o controle daquele espaço.',
 '{room} caiu sob o domínio dos invasores.',
 'A presença inimiga tornou-se ocupação em {room}. Os habitantes já não controlavam a sala.',
 'Os defensores perderam {room} para os invasores.',
 'A tomada de {room} abriu uma nova preocupação para a fortaleza.'
 ],
 voidVictory:[
 'O Cristal do Vazio foi conquistado. A fortaleza alcançou o objetivo de sua jornada no abismo.',
 'A conquista do Cristal do Vazio encerrou a resistência que aguardava nas profundezas.',
 'O guardião caiu, e o Cristal do Vazio passou a pertencer à fortaleza.',
 'A fortaleza prevaleceu diante do Cristal do Vazio. Sua jornada alcançara a vitória.',
 'Os habitantes conquistaram o Cristal do Vazio e firmaram seu domínio sobre o abismo.'
 ],
 voidDefeat:[
 'A batalha pelo Cristal do Vazio foi perdida. As gemas do portão não puderam mudar o fim daquela jornada.',
 'O Cristal do Vazio permaneceu fora do alcance da fortaleza. A derrota ali encerrou a campanha.',
 'Nem as gemas restantes puderam proteger a fortaleza da derrota diante do Cristal do Vazio.',
 'O confronto nas profundezas terminou em derrota definitiva. A proteção do portão não alcançava o Cristal do Vazio.',
 'A jornada terminou na batalha pelo Cristal do Vazio, apesar da proteção que ainda restava no portão.'
 ],
 collapseEvent:[
 'A montanha cedeu. {n} cavernas foram soterradas por pedra e poeira.',
 'Um estrondo percorreu os túneis. {n} cavernas desapareceram sob os escombros.',
 'O teto de pedra não resistiu. O desabamento enterrou {n} cavernas.',
 'Os corredores estremeceram, e {n} cavernas se fecharam para sempre sob a rocha caída.',
 'A pedra tomou de volta {n} cavernas. Onde havia passagem, restaram escombros.'
 ],
 damEvent:[
 'Uma barragem cedeu, e o perigo alcançou mais {n} espaços da fortaleza.',
 'A contenção se rompeu. Mais {n} espaços foram tomados pela propagação.',
 'O que estava contido avançou pelos corredores e atingiu {n} novos espaços.',
 'Uma ruptura abriu caminho ao perigo. A fortaleza viu {n} espaços adicionais serem alcançados.',
 'A barreira cedeu sob a pressão, deixando o perigo invadir mais {n} espaços.'
 ],
 refugeeEvent:[
 '{n} andarilhos leais encontraram abrigo atrás do portão da fortaleza.',
 'O portão se abriu para {n} viajantes. Eles juraram lealdade ao novo lar.',
 '{n} capangas deixaram a vida errante e assumiram a vigília do portão.',
 'A fortaleza acolheu {n} andarilhos, que passaram a defendê-la com lealdade.',
 'Vindos dos caminhos de fora, {n} viajantes encontraram um lar e uma nova vigília.'
 ],
 campGrowth:[
 'O acampamento recebeu {n} recursos e reuniu {count} reforços sob suas bandeiras.',
 'Nas salas tomadas, os invasores recolheram {n} recursos. Suas fileiras ganharam {count} reforços.',
 'A ocupação se fortaleceu: {n} recursos chegaram à reserva inimiga, e {count} reforços se apresentaram.',
 'Os ocupantes movimentaram suas provisões. A renda de {n} recursos trouxe {count} novos combatentes.',
 'O território inimigo rendeu {n} recursos naquele turno. O acampamento reuniu {count} reforços.'
 ],
 campSettlement:[
 'Os invasores fincaram suas bandeiras nas salas isoladas e ali montaram um acampamento.',
 'Sem caminho adiante, os inimigos escolheram permanecer. A área isolada tornou-se seu abrigo.',
 'Os corredores isolados receberam uma nova guarnição. Os invasores estavam ali para ficar.',
 'A tropa inimiga armou seu acampamento sob a montanha, ocupando os espaços separados da fortaleza.',
 'Os habitantes viram bandeiras inimigas nos túneis isolados. Os invasores haviam decidido se instalar.'
 ],
 interrogation:[
 '{unit} foi interrogado. Ao fim da tentativa, a sala voltou a ficar livre.',
 'Os interrogadores encerraram a conversa com {unit}. Outro prisioneiro poderia ocupar a sala.',
 'A tentativa de obter os segredos de {unit} chegou ao fim. A sala aguardaria um novo ocupante.',
 'O interrogatório de {unit} terminou naquele turno. Seus captores deram a tentativa por encerrada.',
 'A sala de persuasão recebeu o último relato de {unit}. Encerrada a tentativa, o lugar ficou vazio.'
 ],
 generic:[
 '{text}',
 'Mais um acontecimento ficou registrado: {text}',
 'Os habitantes guardaram a memória daquele momento. {text}',
 'A crônica recebeu um novo relato. {text}',
 'Na história da fortaleza, ficou também este acontecimento: {text}'
 ]
};
const exactNarrativeTypes={
 'Os portões se abrem. Cinco guerreiros leais aguardam suas ordens.':'founding',
 'Um novo turno começa. Prepare a fortaleza antes de explorar.':'turn',
 'Às armas! Os defensores se dividem entre os núcleos inimigos por força, distância e urgência.':'combat',
 'Vitória! Os sobreviventes se recuperam. +1 moral e espólios de guerra.':'victory',
 'Porta reforçada instalada no corredor. Bloqueia invasores, tiros, líquidos e gases.':'doorBuilt',
 'Uma porta reforçada foi destruída. O corredor ficou desprotegido.':'doorLost',
 'Profundidade 5. Os coringas despertam no baralho.':'jokerDepth',
 'Um artefato encantado concede +6% de dano permanente.':'artifact',
 'Um festival aquece os corações. +5 moral.':'festival',
 '20♦ roubadas. O dragão continua dormindo.':'theftDragon',
 'Engenharia extraordinária: +15% de dano permanente.':'invention',
 'O Hospital trouxe um defensor de volta.':'hospital',
 'A criatura imortal foi eliminada por morte instantânea. A passagem está livre.':'immortal',
 'Defesa instalada.':'defense',
 'A terceira gema do portão se partiu. Sua fortaleza caiu.':'defeat',
 'O Cristal do Vazio é seu. A fortaleza conquistou o abismo.':'voidVictory',
 'Derrota definitiva no Cristal do Vazio. As gemas restantes não podem salvar a fortaleza.':'voidDefeat'
};
function classifyChronicle(text){let m;const type=exactNarrativeTypes[text];if(type)return{type,data:{}};
 if((m=text.match(/^A montanha cedeu\. (\d+) cavernas/)))return{type:'collapseEvent',data:{n:m[1]}};
 if((m=text.match(/^Uma barragem cedeu\. (\d+) espaços/)))return{type:'damEvent',data:{n:m[1]}};
 if((m=text.match(/^(\d+) andarilhos leais/)))return{type:'refugeeEvent',data:{n:m[1]}};
 if((m=text.match(/^O acampamento inimigo recebeu (\d+) recursos e reuniu (\d+) reforços/)))return{type:'campGrowth',data:{n:m[1],count:m[2]}};
 if(text.startsWith('Invasores se instalaram na área desconectada.'))return{type:'campSettlement',data:{}};
 if((m=text.match(/^(.+) foi interrogado\. Encerrada a tentativa/)))return{type:'interrogation',data:{unit:m[1]}};
 if((m=text.match(/^(.+) construída\. /)))return{type:'construction',data:{room:m[1]}};
 if((m=text.match(/^(.+) recrutado em (.+)\.$/)))return{type:'recruitment',data:{unit:m[1],room:m[2]}};
 if((m=text.match(/^Passagem aberta entre (.+) e (.+)\.$/)))return{type:'passage',data:{from:m[1],to:m[2]}};
 if(text.startsWith('Produção da fortaleza:'))return{type:'production',data:{}};
 if(text.startsWith('Troca concluída:'))return{type:'trade',data:{}};
 if((m=text.match(/^(.+) se amotinou!/)))return{type:'mutiny',data:{unit:m[1]}};
 if((m=text.match(/^[♥♦♣♠] \d+ · Você encontrou (\d+) (recursos|riquezas)\.$/)))return{type:'resourceFind',data:{n:m[1],resource:m[2]}};
 if((m=text.match(/^[♥♦♣♠] \d+ · (.+)\.$/))||(m=text.match(/^Exploração: (.+?) \(/)))return{type:'discovery',data:{room:m[1]}};
 if(text.startsWith('Invasão pelo portal'))return{type:'portalAttack',data:{}};
 if(text.startsWith('Portal em '))return{type:'portalQuiet',data:{}};
 if(text.startsWith('Masmorra rival revelada'))return{type:'rivalFound',data:{}};
 if(text.startsWith('Masmorra rival conquistada'))return{type:'rivalWon',data:{}};
 if(text.startsWith('Uma caverna ampla se estende'))return{type:'broadCave',data:{}};
 if((m=text.match(/^(.+): \d+ espaços contínuos\./)))return{type:'formation',data:{room:m[1]}};
 if(text.startsWith('Uma gema do portão se partiu'))return{type:'gemLost',data:{}};
 if(text.startsWith('Gás inflamável alcançou'))return{type:'explosion',data:{}};
 if((m=text.match(/^(\d+) unidade\(s\) foram derrotadas imediatamente por fluidos/)))return{type:'casualties',data:{n:m[1]}};
 if(text.startsWith('Defesa aprimorada.'))return{type:'upgrade',data:{}};
 if((m=text.match(/^Magia (boa|ruim) · ([^:]+):/)))return{type:m[1]==='boa'?'goodMagic':'badMagic',data:{spell:m[2]}};
 if(text.startsWith('Bandidos encontraram uma entrada'))return{type:'bandits',data:{}};
 if((m=text.match(/^Os exploradores alcançaram (.+)\. A pedra revelada/)))return{type:'layer',data:{room:m[1]}};
 if((m=text.match(/^O corpo de (.+) ergueu-se onde havia caído/)))return{type:'reanimation',data:{unit:m[1]}};
 if((m=text.match(/^Os segredos arrancados dos prisioneiros inspiraram os artífices: (.+) passou/)))return{type:'research',data:{room:m[1]}};
 if(text.includes('câmara')&&text.includes('maldição'))return{type:'seal',data:{}};
 if(text.startsWith('Uma caverna de cristal se esgotou'))return{type:'exhaustion',data:{}};
 if((m=text.match(/^Ponte levadiça (fechada|aberta)/)))return{type:'bridge',data:{state:m[1]}};
 if(text.startsWith('Magma drenado.')||text.startsWith('Sala drenada.'))return{type:'drain',data:{}};
 if(text.startsWith('Portal selado.'))return{type:'portalClosed',data:{}};
 if(text.startsWith('O escavador '))return{type:'burrow',data:{detail:text}};
 if((m=text.match(/^(.+) tomada pelos invasores\./)))return{type:'capturedRoom',data:{room:m[1]}};
 return{type:'generic',data:{text}};
}
function renderChronicleEntry(text,variant=0){const {type,data}=classifyChronicle(text),phrases=CHRONICLE_TEMPLATES[type],template=phrases[Math.abs(Math.trunc(variant)||0)%phrases.length];return template.replace(/\{(\w+)\}/g,(_,k)=>data[k]??'');}
function initializeChronicleState(s){const rebuilding=!s.narrativeCounts,counters=s.narrativeCounts||{};let sequence=Math.max(s.chronicleSequence||0,...s.log.map(e=>e.id||0));for(const e of [...s.log].reverse()){const {type}=classifyChronicle(e.text);if(e.prose===undefined){e.narrativeVariant=e.narrativeVariant??((counters[type]||0)%CHRONICLE_TEMPLATES[type].length);e.prose=renderChronicleEntry(e.text,e.narrativeVariant);if(!rebuilding)counters[type]=(counters[type]||0)+1;}if(rebuilding)counters[type]=(counters[type]||0)+1;if(!e.id)e.id=++sequence;}s.narrativeCounts=counters;s.chronicleSequence=sequence;s.narrativeVersion=1;}
function makeChronicleRecord(s,text,kind='info'){if(s.narrativeVersion!==1||!s.narrativeCounts)initializeChronicleState(s);const {type}=classifyChronicle(text),count=s.narrativeCounts[type]||0,variant=count%CHRONICLE_TEMPLATES[type].length;s.narrativeCounts[type]=count+1;return{text,kind,turn:s.turn,id:++s.chronicleSequence,narrativeVariant:variant,prose:renderChronicleEntry(text,variant)};}
function readableChronicleEntries(s){const counts={};return [...s.log].reverse().map(e=>{const {type}=classifyChronicle(e.text),n=counts[type]||0;counts[type]=n+1;return{...e,text:e.prose??renderChronicleEntry(e.text,e.narrativeVariant??n)};});}
function validateChronicle(s){if(s.narrativeVersion!==undefined&&s.narrativeVersion!==1)throw Error('Versão narrativa inválida.');if(s.chronicleSequence!==undefined&&(!Number.isInteger(s.chronicleSequence)||s.chronicleSequence<0||s.chronicleSequence>1e12))throw Error('Sequência da crônica inválida.');if(s.narrativeCounts!==undefined&&(!s.narrativeCounts||typeof s.narrativeCounts!=='object'||Array.isArray(s.narrativeCounts)||Object.entries(s.narrativeCounts).some(([type,n])=>!Object.hasOwn(CHRONICLE_TEMPLATES,type)||!Number.isInteger(n)||n<0||n>1e12)))throw Error('Variações da crônica inválidas.');const ids=new Set();for(const e of s.log){if(e.prose!==undefined&&(typeof e.prose!=='string'||e.prose.length>3000)||e.narrativeVariant!==undefined&&(!Number.isInteger(e.narrativeVariant)||e.narrativeVariant<0||e.narrativeVariant>=CHRONICLE_TEMPLATES[classifyChronicle(e.text).type].length))throw Error('Texto narrativo inválido.');if(e.id!==undefined){if(!Number.isInteger(e.id)||e.id<1||ids.has(e.id))throw Error('Registro da crônica inválido.');ids.add(e.id);}}}


// layer-data.js
// Shared material and sprite identities. All effects read the room's stored id.
const LAYER_STYLES=[
 {id:'normal',name:'Normal',color:[105,99,78]},
 {id:'magma',name:'Magma',color:[173,76,40]},
 {id:'graveyard',name:'Cemitério',color:[91,137,132]},
 {id:'skitter',name:'Rastejantes',color:[116,133,62]},
 {id:'leylines',name:'Linhas Arcanas',color:[118,87,166]},
 {id:'riches',name:'Riquezas',color:[192,148,55]},
 {id:'dungeon',name:'Masmorra',color:[118,88,99]},
 {id:'nightmare',name:'Pesadelo',color:[92,54,116]}
];
function layerMaterialPalette(id,material){const style=LAYER_STYLES[id];if(!style||!id)return material;const c=style.color,tint={floor:c.map(v=>Math.round(v*.26)),wall:c,light:c.map(v=>Math.min(255,Math.round(v*.7+90)))};return Object.fromEntries(['floor','wall','light'].map(k=>[k,material[k].map((v,i)=>Math.round(v*.56+tint[k][i]*.44))]));}


// research.js
const BUILD_TIERS={barracks:0,kennel:0,hut:0,warehouse:0,treasury:0,bridge:0,persuasion:0,library:1,forge:1,siegepost:1,laboratory:1,solitary:1,prison:1,quarters:1,dormitory:1,laundry:1,arena:1,masonry:1,elevator:1,rails:1,pump:1,columns:1,kitchen:2,parlor:2,games:2,sewer:2,inspection:2,hospital:2,tavern:2,mansion:2,puzzle:2,drawbridge:2,workshop:3,altar:3,temple:3,hiring:3,museum:3,artificer:3,breeder:3,throne:3,stabilizer:3};
const RESEARCH_PROJECTS=[
 {id:'military',tier:1,rooms:['forge','siegepost','rails'],name:'Engenharia militar'},
 {id:'masonry',tier:1,rooms:['masonry','columns'],name:'Alvenaria e sustentação'},
 {id:'captives',tier:3,rooms:['solitary','hiring'],name:'Recrutamento de prisioneiros'},
 ...BUILDABLE.filter(t=>BUILD_TIERS[t]>0&&!['forge','siegepost','rails','masonry','columns','solitary','hiring'].includes(t)).map(t=>({id:t,tier:BUILD_TIERS[t],rooms:[t],name:ROOMS[t].name})),
 {id:'offensive',tier:2,rooms:[],requires:['masonry'],name:'Porta ofensiva'},
 {id:'secret',tier:3,rooms:[],requires:['masonry'],name:'Passagem secreta'}
];
function newResearch(legacy=false){return {version:1,intel:0,unlocked:legacy?RESEARCH_PROJECTS.map(p=>p.id):[]};}
function validateResearch(s){const r=s.research;if(r===undefined)return;if(!r||r.version!==1||!Number.isInteger(r.intel)||r.intel<0||r.intel>1e9||!Array.isArray(r.unlocked)||r.unlocked.length>RESEARCH_PROJECTS.length||new Set(r.unlocked).size!==r.unlocked.length||r.unlocked.some(id=>!RESEARCH_PROJECTS.some(p=>p.id===id))||r.species!==undefined&&(!Array.isArray(r.species)||r.species.length>100||r.species.some(t=>typeof t!=='string'||t.length>50)))throw Error('Pesquisa inválida.');}
function installResearch(Game){
 const prior={};for(const n of ['buildReason','information','resolveEffect','requestEngineering','fortifyPassage','action','colonyChoices','damage'])prior[n]=Game.prototype[n];
 Object.assign(Game.prototype,{
  researchState(){return this.s.research??=newResearch(true);},
  constructionUnlocked(type){if(BUILD_TIERS[type]===0)return true;const p=RESEARCH_PROJECTS.find(p=>p.rooms.includes(type)||p.id===type);return !p||this.researchState().unlocked.includes(p.id);},
  researchReason(id){const p=RESEARCH_PROJECTS.find(p=>p.id===id),r=this.researchState();if(!p)return'Projeto inválido.';if(r.unlocked.includes(id))return'Projeto já desbloqueado.';if(this.s.combat||this.s.status!=='playing')return'Pesquise fora de combate.';
   if(p.tier>1&&!r.unlocked.some(id=>RESEARCH_PROJECTS.find(p=>p.id===id)?.tier===p.tier-1))return`Desbloqueie primeiro um projeto de Tier ${p.tier-1}.`;
   const required=p.requires||p.rooms.flatMap(t=>ROOMS[t].requires||[]).filter(t=>!p.rooms.includes(t));if(required.some(t=>!this.constructionUnlocked(t)))return`Desbloqueie: ${[...new Set(required)].map(t=>ROOMS[t]?.name||t).join(', ')}.`;
   if(id==='stabilizer'&&!this.rooms.some(r=>['portal','stabilizer'].includes(r.type)))return'Descubra um portal planar.';
   if(id==='breeder'&&(!this.s.discoveredInventions?.includes(4)||!this.allies.some(u=>u.kennelMonster||u.bredMonster||u.monstrosity)))return'Exige Feromônios e uma criatura aliada para matriz.';
   if(id==='museum'&&!r.species?.length)return'Registre uma espécie vencendo uma criatura grande.';
   if(r.intel<p.tier)return`Exige ${p.tier} informação(ões).`;return'';
  },
  researchProject(id){const reason=this.researchReason(id);if(reason)return{ok:false,reason};const p=RESEARCH_PROJECTS.find(p=>p.id===id),r=this.researchState();r.intel-=p.tier;r.unlocked.push(id);this.note(`Os segredos arrancados dos prisioneiros inspiraram os artífices: ${p.name} passou a fazer parte dos planos da fortaleza.`,'good');this.effect('Projeto desbloqueado',`${p.name}: ${p.rooms.length?p.rooms.map(t=>ROOMS[t].name).join(', '):p.name}. Construção e uso continuam exigindo seus custos e requisitos.`,'good');return{ok:true};},
  gainInformation(amount=1){const r=this.researchState();r.intel=Math.min(1e9,r.intel+amount);this.effect('Conhecimento extraído',`+${amount} informação para pesquisar construções. Saldo: ${r.intel}. Abra Construções → Pesquisas.`,'good');},
  damage(u,amount,options){const wasAlive=u.hp>0;prior.damage.call(this,u,amount,options);if(wasAlive&&u.hp<=0&&u.team==='enemy'&&(u.monstrosity||u.size>1.5)){const r=this.researchState();r.species??=[];if(!r.species.includes(u.type))r.species.push(u.type);}},
  information(cell){this.gainInformation();return prior.information.call(this,cell);},
  buildReason(type,r){if(!this.constructionUnlocked(type))return'Projeto bloqueado. Desbloqueie em Pesquisas com informações de prisioneiros.';return prior.buildReason.call(this,type,r);},
  engineeringLock(tool){const type=['damage','delay'].includes(tool)?'forge':tool==='defensive'?'masonry':tool;const project=RESEARCH_PROJECTS.find(p=>p.rooms.includes(type)||p.id===type);return this.constructionUnlocked(type)?'':`Projeto bloqueado: pesquise ${project?.name||type} em Construções → Pesquisas.`;},
  requestEngineering(mode,tool,...args){const reason=this.engineeringLock(tool);return reason?{ok:false,reason}:prior.requestEngineering.call(this,mode,tool,...args);},
  fortifyPassage(a,b,kind){const reason=this.engineeringLock(kind);return reason?{ok:false,reason}:prior.fortifyPassage.call(this,a,b,kind);},
  action(name,x,y,arg){const tool=name==='defense'?arg:name==='rails'?'rails':null,reason=tool&&this.engineeringLock(tool);return reason?{ok:false,reason}:prior.action.call(this,name,x,y,arg);},
  colonyChoices(card){if(card.input?.action==='engineering'&&this.engineeringLock(card.input.tool))return[];return prior.colonyChoices.call(this,card);}
 });
}


// captivity.js
const CAPTURE_ROOMS=['persuasion','solitary','prison','kennel'];
const INTELLIGENT_CAPTIVES=['goblin','miner','cultist','raider','champion','lich','fairy','soldier','archer','mage','cleric','alchemist','trapper','thug','berserker','hero'];
const MONSTER_CAPTIVES=['cavewolf','worm','dragon','troll','spider','beast','insect','insectqueen','elemental','golem'];
function captiveKind(c){if(c?.isUndead||c?.uncapturable||c?.graveyardRevived)return null;if(c?.monstrosity)return'monster';return INTELLIGENT_CAPTIVES.includes(c?.type)?'person':MONSTER_CAPTIVES.includes(c?.type)?'monster':null;}
function validCaptive(c){return !!c&&(Object.hasOwn(ENEMIES,c.type)||Object.hasOwn(UNITS,c.type))&&Number.isFinite(c.power)&&c.power>0&&c.power<=1e7&&typeof c.name==='string'&&c.name.length<=200&&Number.isFinite(c.range)&&c.range>=0&&c.range<=5&&Number.isFinite(c.size)&&c.size>0&&c.size<=5&&Number.isInteger(c.mutiny)&&c.mutiny>=0&&c.mutiny<=100&&(c.sourceId===undefined||Number.isInteger(c.sourceId)&&c.sourceId>0)&&(c.isUndead===undefined||typeof c.isUndead==='boolean')&&(c.uncapturable===undefined||typeof c.uncapturable==='boolean')&&(c.spawnLayer===undefined||Number.isInteger(c.spawnLayer)&&c.spawnLayer>=0&&c.spawnLayer<=7)&&(c.graveyardRevived===undefined||typeof c.graveyardRevived==='boolean')&&(c.monstrosity===undefined||typeof c.monstrosity==='boolean')&&(c.traits===undefined||Array.isArray(c.traits)&&c.traits.length<=13&&c.traits.every(n=>Number.isInteger(n)&&n>=1&&n<=13));}
function heldCaptives(r){return r?.captives?.length?r.captives:r?.captive?[r.captive]:[];}
function clearCaptives(r){r.captive=null;r.captives=[];r.prisoners=0;}

function validGraveyardReturn(c,s){return validCaptive(c)&&Number.isInteger(c.sourceId)&&typeof c.home==='string'&&!!s.rooms[c.home]&&Number.isInteger(c.x)&&Number.isInteger(c.y)&&!!s.rooms[`${c.x},${c.y}`];}


// icons.js
const paths={
 rails:'M7 2v20M17 2v20M4 5h16M4 10h16M4 15h16M4 20h16',columns:'M4 3h16v3H4zM7 6v13m10-13v13M4 19h16v3H4z',drawbridge:'M3 21V5h3v16m0-3L19 7m-1 0h4v14M6 8l12 1',elevator:'M5 5h14v14H5zM12 1v3m-3-1 3-2 3 2M12 20v3m-3-2 3 2 3-2',
 sword:'M5 19 18 6m-9 5 4 4M4 16l4 4M15 3h6v6l-4-1z',
 bow:'M6 3q16 9 0 18l5-9zM3 12h18m-4-4 4 4-4 4',
 spark:'m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z',
 cross:'M9 3h6v6h6v6h-6v6H9v-6H3V9h6z',
 paw:'M8 11q4-3 8 0l4 6q-1 5-5 3h-6q-4 2-5-3zM6 5a2 3 0 1 0 0 .1m6-3a2 3 0 1 0 0 .1m6 3a2 3 0 1 0 0 .1',
 flask:'M9 2h6m-5 0v7L4 19q-1 3 3 3h10q4 0 3-3L14 9V2M7 15h10',
 trap:'m3 7 3 5 3-5 3 5 3-5 3 5 3-5M4 18h16m-8-6v6',
 shield:'m12 2 9 4v6q-1 7-9 10-8-3-9-10V6zM12 6v12',
 target:'M22 12a10 10 0 1 1-10-10m5 10a5 5 0 1 1-5-5m0 5L22 2m-6 0h6v6',
 skull:'M5 16q-3-3-2-7 1-7 9-7t9 7q1 4-2 7l-3 1v5H8v-5zM7 10h2v3H7zm8 0h2v3h-2zm-3 6v5',
 gate:'M3 22V10a9 9 0 0 1 18 0v12M7 22V10m5 12V5m5 17V10M3 14h18m-18 5h18',
 mountain:'m2 20 7-16 5 9 3-6 5 13zM6 12l3 2 3-3',
 book:'M12 5Q7 1 2 4v16q5-3 10 1 5-4 10-1V4q-5-3-10 1v16M5 7l4 1M5 11l4 1m6-4 4-1m-4 5 4-1',
 anvil:'M2 7h20l-5 5h-4v6h5v3H6v-3h4v-6H5zM5 4h12v3',
 water:'M2 10q3-5 6 0 3 5 6 0 3-5 8 0M2 17q3-5 6 0 3 5 6 0 3-5 8 0M12 2v3',
 bars:'M3 3h18v18H3zM8 3v18m8-18v18M3 8h18m-18 8h18',
 eye:'M1 12q11-16 22 0-11 16-22 0zM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
 flag:'M5 22V2m0 1q5-3 9 0t7 0v10q-4 3-8 0t-8 0',
 home:'m2 11 10-9 10 9M5 9v13h14V9M10 22v-8h4v8',
 crown:'m2 6 5 4 5-8 5 8 5-4-3 14H5zM5 16h14',
 bed:'M2 20V5m20 15V9M2 16h20M5 8h5v5H5zm5 1h12v7',
 flame:'M12 2q3 8 7 10 6 8-7 10-12-2-7-10 5-3 7-10zM12 14q5 7 0 8-5-1 0-8',
 mug:'M3 4h14v15q-7 5-14 0zm14 2h3q6 5-3 9M5 1v2m5-2v2',
 cards:'m3 6 12-4 6 17-12 4zM1 2h13m-8 8 7-1 1 7-6 1z',
 box:'m2 7 10-5 10 5v13l-10 3-10-3zm0 0 10 5 10-5M12 12v11M7 4l10 5',
 gem:'m7 3-5 6 10 13L22 9l-5-6zm-5 6h20M7 3l5 19 5-19',
 hammer:'m4 20 11-11m-6-3 5-4 8 8-5 4-3-3M2 18l4 4',
 bridge:'M2 20V7m20 13V7M2 10q10 13 20 0M7 14v6m5-3v3m5-6v6M1 20h22',
 stairs:'M2 22v-5h5v-5h5V7h5V2h5M2 2v8m-3-3 3 3 3-3',
 portal:'M20 12a8 10 0 1 1-16 0 8 10 0 0 1 16 0m-4 0a4 6 0 1 1-8 0 4 6 0 0 1 8 0M1 22h22',
 tree:'m12 2-7 7h3l-6 7h7v6h6v-6h7l-6-7h3z',
 cloud:'M5 18a5 5 0 1 1 0-10q3-8 9-3 8-2 8 6 1 7-7 7zM8 21v2m6-2v2',
 play:'m8 3 14 9L8 21z',pause:'M7 3v18M17 3v18',save:'M3 2h15l4 4v16H2V2zm4 0v7h10V2M6 22v-9h12v9',
 load:'M2 8h7l3 3h10l-3 11H2zM2 8V3h7l3 3h8v5',settings:'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8m-3-6h6l1 4 4 1 2 5-3 3v4l-5 3-3-2-4 1-4-5 1-4-2-3 3-5z',
 exit:'M10 2H3v20h7m4-16 6 6-6 6m-7-6h14',plus:'M12 3v18M3 12h18',minus:'M3 12h18',close:'m5 5 14 14M5 19 19 5',help:'M9 8q0-6 6-4 5 2 0 6l-3 2v3m0 4v2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
 compass:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0m-6-6-3 7-7 3 3-7z',chevron:'m8 4 8 8-8 8',volume:'M3 9h4l6-6v18l-6-6H3zm13-3q7 6 0 12m2-16q11 10 0 20',download:'M12 2v14m-5-5 5 5 5-5M3 17v5h18v-5',expand:'M8 2H2v6m14-6h6v6M2 16v6h6m14-6v6h-6',clock:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0M12 5v7l4 3',info:'M12 11v8m0-15v2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',menu:'M3 5h18M3 12h18M3 19h18',heart:'M12 21C-7 9 4-3 12 5 20-3 31 9 12 21z'
};
function icon(name,cls=''){return `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"><path d="${paths[name]||paths.spark}"/></svg>`}


// tactics.js
// Deterministic squad allocation on the opened-passage graph. No random draws.
const tacticalDistance=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
// Departure/contact order: melee first, then descending current HP, stable IDs.
function engagementPriority(game,a,b){const melee=u=>game.unitData(u).range<=.5;return Number(!melee(a))-Number(!melee(b))||(melee(a)&&melee(b)?b.hp-a.hp:0)||a.id-b.id;}
function combatStrength(game,u){
 const health=Math.max(0,(u.hp+u.shield)/u.maxHp);
 const upgrades=u.team==='ally'?1+game.s.blessings*.06+game.s.inventions*.15:1;
 if(u.type==='siege'&&u.shot)return 0;
 return (u.power*upgrades+(u.team==='ally'?game.s.trophies*1.1:0))*health*(u.stun>0?.65:1);
}
function travelTime(game,u,destination){
 const start=game.anchor(u);if(!start||!destination)return Infinity;
 const route=game.path(start,destination,u.team,u);if(route===null)return Infinity;
 const data=game.unitData(u);if(data.speed<=0)return tacticalDistance(u,destination)<.001?0:Infinity;
 let seconds=tacticalDistance(u,start)/data.speed;
 if(u.team==='enemy'&&u.moveTarget){const origin=game.movementOrigin(u,start),door=origin&&game.barricade(origin,start);if(door&&tacticalDistance(u,origin)<.5)seconds+=door.hp/Math.max(1,u.power*1.8)}
 let previous=start;for(const r of route){const door=game.barricade(previous,r);if(u.team==='enemy'&&door)seconds+=door.hp/Math.max(1,u.power*1.8);previous=r;let speed=data.speed;if(u.team==='ally'&&(['elevator','rails','shaft'].includes(r.type)||r.transport==='rails'))speed*=2;if(r.type==='mud')speed*=.5;if(u.team==='enemy'&&r.type==='puzzle')speed*=.35;if(u.team==='ally'&&game.s.artifacts.includes('speed'))speed*=1.15;seconds+=1/speed}
 return seconds;
}
function enemyClusters(game){
 const enemies=game.enemies.sort((a,b)=>a.id-b.id),remaining=new Set(enemies),groups=[];
 for(const first of enemies){if(!remaining.delete(first))continue;const members=[first];
  for(let i=0;i<members.length;i++)for(const other of remaining){
   const a=game.anchor(members[i]),b=game.anchor(other);if(!a||!b||tacticalDistance(members[i],other)>1.5)continue;
   const physicalA=game.room(Math.round(members[i].x),Math.round(members[i].y)),physicalB=game.room(Math.round(other.x),Math.round(other.y));if(game.barricade(physicalA,physicalB)||game.barricade(a,b))continue;
   const route=game.path(a,b,'enemy');if(route!==null&&route.length<=1){members.push(other);remaining.delete(other)}
  }
  const threat=members.reduce((best,e)=>travelTime(game,e,game.target)<travelTime(game,best,game.target)?e:best,first);
  const eta=travelTime(game,threat,game.target),power=members.reduce((n,e)=>n+combatStrength(game,e),0);
  groups.push({id:Math.min(...members.map(e=>e.id)),members,threat,eta,power,demand:power*(1.15+.3/(1+(Number.isFinite(eta)?eta:1000))),priority:(1+Math.sqrt(power))/(2+(Number.isFinite(eta)?eta:1000)),assigned:[],assignedPower:0});
 }return groups;
}
function candidate(game,u,group){
 const data=game.unitData(u),enemy=group.threat,at=game.anchor(enemy);if(!at)return null;
 const canShoot=data.range>.5&&group.members.some(e=>(u.type==='siege'||tacticalDistance(u,e)<=data.range)&&game.lineOfSight(u,e));
 if(data.speed<=0)return canShoot&&!u.shot?{goal:game.anchor(u),eta:0}:null;
 let goal=at,eta=travelTime(game,u,goal);
 if(!Number.isFinite(eta)){
  const advance=game.path(at,game.target,'enemy',enemy)||[];
  goal=advance.find(r=>Number.isFinite(travelTime(game,u,r)));if(!goal)return null;eta=travelTime(game,u,goal);
 }
 if(data.range>.5){
  if(canShoot){goal=game.anchor(u);eta=0}
  else{const route=game.path(game.anchor(u),goal,'ally',u)||[];const firing=[game.anchor(u),...route].find(r=>r&&tacticalDistance(r,enemy)<=data.range&&game.lineOfSight(r,enemy));if(firing){goal=firing;eta=travelTime(game,u,goal)}}
 }
 return {goal,eta};
}
function planDefense(game){
 const groups=enemyClusters(game),allies=game.defenders.sort((a,b)=>a.id-b.id),assignments=new Map(),available=new Set(allies);
 const choices=new Map();for(const u of allies){const options=new Map();for(const g of groups){const c=candidate(game,u,g);if(c)options.set(g.id,c)}choices.set(u.id,options)}
 const availability=new Map(groups.map(g=>[g.id,allies.filter(u=>choices.get(u.id).has(g.id)).length]));
 function assign(u,g){const c=choices.get(u.id).get(g.id);assignments.set(u.id,{groupId:g.id,targetId:g.threat.id,goal:c.goal,eta:c.eta});g.assigned.push(u.id);g.assignedPower+=combatStrength(game,u);available.delete(u);for(const id of choices.get(u.id).keys())availability.set(id,availability.get(id)-1);u.frontTarget=g.threat.id}
 // Units already exchanging melee blows do not abandon contact for a new score.
 for(const u of allies)if(game.unitData(u).range<=.5){const engaged=groups.find(g=>choices.get(u.id).has(g.id)&&g.members.some(e=>game.meleeContact(u,e)));if(engaged)assign(u,engaged)}
 function bestUnit(g){
  let best=null,score=Infinity;
  for(const u of available){const c=choices.get(u.id).get(g.id);if(!c)continue;
   const power=combatStrength(game,u);if(power<=0)continue;
   // Keep continuity unless another front is materially cheaper or unprotected.
   const retained=g.members.some(e=>e.id===u.frontTarget),overkill=Math.max(0,power-Math.max(1,g.demand-g.assignedPower))/Math.max(1,g.demand);
   const scarce=groups.filter(other=>!other.assigned.length&&other.id!==g.id&&choices.get(u.id).has(other.id)&&availability.get(other.id)===1).length;
   const cost=c.eta+(retained?-1.4:0)+overkill*2+(u.type==='cleric'?3:0)+scarce*100;
   if(cost<score||cost===score&&u.id<best?.id){best=u;score=cost}
  }return best;
 }
 // Cover reachable independent fronts first, including when the army is weaker.
 const fronts=[...groups].sort((a,b)=>{
  const count=g=>availability.get(g.id);
  return count(a)-count(b)||b.priority-a.priority||a.id-b.id;
 });
 for(const g of fronts)if(!g.assigned.length){const u=bestUnit(g);if(u)assign(u,g)}
 const maxPriority=Math.max(.001,...groups.map(g=>g.priority));
 while(available.size){
  let selected=null,unit=null,score=-Infinity;
  for(const g of groups){const u=bestUnit(g);if(!u)continue;
   const coverage=g.demand/Math.max(.1,g.assignedPower),urgency=1+.25*g.priority/maxPriority;
   const value=coverage*urgency;
   if(value>score||value===score&&g.id<selected?.id){selected=g;unit=u;score=value}
  }if(!unit)break;assign(unit,selected);
 }
 for(const u of available)u.frontTarget=null;
 return {groups,assignments,at:game.s.seconds};
}


// formations.js
const formationKey=(x,y)=>`${x},${y}`;
const BUILD_FOOTPRINTS={temple:2,museum:2,breeder:4,meadhall:2,dragonforge:2,trapmaster:2};
// A deterministic preview must never consume the world RNG while the UI redraws.
function planFormation(game,root,count,{axis=null,build=false}={}){
 const result=[{x:root.x,y:root.y}],seen=new Set([formationKey(root.x,root.y)]),valid=(x,y)=>{
  if(x< -20||x>20||y>30||y< -6||(!build&&y<0&&![0,5].includes(game.s.activePlane))||game.sealedBlock(x,y))return false;
  if(y<=1&&Math.abs(x)<=2&&['lava','crater'].includes(game.fluidSource(root)))return false;
  const r=game.room(x,y);if(r&&(!build||r.type!=='cave'||r.exhausted||r.builtPartOf||game.roomHazards(r).length))return false;
  if(build&&(root.y<0)!==(y<0))return false;
  if(build&&y< -1&&(!game.room(x,y+1)||game.room(x,y+1).damaged))return false;
  return true;
 };
 if(axis){const vectors=axis==='down'?[[0,1]]:axis==='up'?[[0,-1]]:[[1,0],[-1,0]],options=vectors.map(([dx,dy])=>{const line=[result[0]];for(let i=1;i<count;i++){const x=root.x+dx*i,y=root.y+dy*i;if(!valid(x,y))break;line.push({x,y})}return line});return options.sort((a,b)=>b.length-a.length)[0]}
 const dirs=[[1,0],[0,1],[-1,0],[0,-1]];for(let i=0;i<result.length&&result.length<count;i++)for(const [dx,dy]of dirs){const x=result[i].x+dx,y=result[i].y+dy,k=formationKey(x,y);if(seen.has(k)||!valid(x,y))continue;seen.add(k);result.push({x,y});if(result.length>=count)break}return result;
}


// rise.js
const riseKey=r=>`${r.x},${r.y}`;
const riseDistance=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
const RISE_ACTIONS=['persuade','transferPrisoner','hire','dedicate','sacrifice','mapLabyrinth','provoke','feed','tame','champion','stationCleric'];
function installRiseRules(Game){
 const old={};for(const name of ['morale','capacity','isHousing','housing','recruitmentReason','recruit','checkMutiny','action','resolveEffect','passable','lineOfSight','buildReason','income','damage','damageRoom','spreadHazards','beginCombat','endCombat','lose','explore','resolveRivalRoom','resolveRemnant','update'])old[name]=Game.prototype[name];
 Object.assign(Game.prototype,{
  comfort(r){if(!r||!['hut','quarters','mansion'].includes(r.type))return null;const near=this.rooms.some(n=>n.type==='mansion'&&riseDistance(r,n)===1&&this.active(n));return r.type==='mansion'?{limit:180,discount:0}:r.type==='quarters'?{limit:near?30:50,discount:near?0:1}:near?{limit:0,discount:0}:{limit:30,discount:0}},
  isHousing(r){return !!r&&(r.type==='mansion'||old.isHousing.call(this,r))},
  capacity(r){if(r?.type==='mansion')return 1;return old.capacity.call(this,r)},
  homeFits(u,r,ignoreId=u.id){if(u.type==='rat'&&r?.type!=='sewer')return false;if(!r||!this.active(r))return false;const c=this.comfort(r),occupants=this.allies.filter(v=>v.id!==ignoreId&&v.home===riseKey(r)&&(r.type!=='crypt'||v.type!=='cleric'));if(c)return occupants.length<this.capacity(r)&&occupants.reduce((a,v)=>a+v.power,0)+u.power<=c.limit;return (UNITS[u.type]?.homes.includes(r.type)||u.home===riseKey(r))&&occupants.length<this.capacity(r)},
  threshold(u,r=this.s.rooms[u.home]){return Math.max(0,(u.mutiny??UNITS[u.type]?.mutiny??12)-(this.comfort(r)?.discount||0)-(this.s.mutinyRelief||0))},
  morale(){let m=old.morale.call(this);for(const r of this.rooms)if(this.active(r))m-=r.type==='quarters'?1:r.type==='mansion'?5:0;for(const u of this.allies)if(!u.loyal){const r=this.s.rooms[u.home],c=this.comfort(r);if(!r||!this.active(r)||!this.isHousing(r)&&!['hungry','challenge'].includes(r.type)||c&&(!c.limit||this.allies.filter(v=>v.home===u.home).reduce((a,v)=>a+v.power,0)>c.limit))m-=2;}return m},
  housing(type){const d=UNITS[type];if(type==='hero'||d?.recruitable===false)return[];if(!d||d.requires&&!this.has(d.requires))return[];return this.rooms.filter(r=>(type!=='rat'||r.type==='sewer')&&(d.homes.includes(r.type)||['hut','quarters','mansion'].includes(r.type)&&d.mutiny>0)&&this.homeFits({type,power:this.recruitPower?this.recruitPower(type):d.power},r)&&(type!=='undead'||r.type!=='crypt'||this.allies.some(u=>u.type==='cleric'&&u.home===riseKey(r))))},
  recruitmentReason(type,home=null){if(home&&!this.isHousing(this.s.rooms[home]))home=null;const d=UNITS[type];if(!d)return'Unidade inválida.';if(d.recruitable===false)return'Capture uma criatura para o Canil; não existe recrutamento genérico de feras.';if(type==='hero')return'Aventureiros são atraídos pela Taverna, não recrutados.';if(this.s.status!=='playing'||this.s.combat)return'Recrutamento indisponível agora.';const homes=this.housing(type),eligible=home?homes.filter(r=>riseKey(r)===home):homes;if(!eligible.length)return'Abrigo sem vaga, conforto ou capacidade de força suficiente.';if(!this.s.artifacts.includes('loyal')&&d.mutiny>0&&!eligible.some(r=>this.moraleFor(r)-(type==='rat'?1:0)>=this.threshold({type},r)))return'Moral insuficiente para o abrigo: motim imediato bloqueado.';if(this.s.gold<(this.recruitCost?this.recruitCost(type):d.cost))return'Riquezas insuficientes.';return''},
  recruit(type,home=null){if(home&&!this.isHousing(this.s.rooms[home]))home=null;const reason=this.recruitmentReason(type,home);if(reason)return{ok:false,reason};const d=UNITS[type],homes=this.housing(type);const r=(home&&homes.find(r=>riseKey(r)===home))||homes.find(r=>this.s.artifacts.includes('loyal')||d.mutiny===0||this.moraleFor(r)-(type==='rat'?1:0)>=this.threshold({type},r));this.s.gold-=this.recruitCost?this.recruitCost(type):d.cost;this.addUnit(type,r.x,r.y,this.s.artifacts.includes('loyal'));this.note(`${d.name} recrutado em ${ROOMS[r.type].name}.`,'good');this.checkMutiny();return{ok:true}},
  checkMutiny(){for(const u of [...this.allies]){const threshold=this.threshold(u);if(!u.loyal&&this.moraleFor(this.s.rooms[u.home])<threshold){u.team='enemy';if(this.s.magicFlags?.watchingEyes){u.hp=0;this.effect('Olhos Voadores','Os olhos derrotaram um amotinado antes que atacasse a fortaleza.','good');this.s.magicFlags.watchingEyes=false;}this.effect('Motim',`${u.enemyName||UNITS[u.type]?.name||u.type} se rebelou: moral abaixo do limite ${threshold}.`,'bad');}}if(this.enemies.length&&!this.s.combat)this.beginCombat()},
  encounterRoot(r){const seen=new Set();while(r&&!seen.has(riseKey(r))){seen.add(riseKey(r));const parent=this.s.rooms[r.bossRoot||r.discoveryRoot||r.cavernGroup||r.builtPartOf];if(!parent||parent===r)break;r=parent;}return r},
  territorialGuard(r){const root=this.encounterRoot(r);return root&&!root.pheromoneCalm&&this.s.units.find(u=>u.team==='neutral'&&u.hp>0&&u.territory===riseKey(root))},
  passable(r,team='ally',unit=null){return !(r?.type==='labyrinth'&&!r.mapped)&&!this.territorialGuard(r)&&!(this.guardedGolem(r)&&this.s.units.some(u=>u.id===this.encounterRoot(r).golemId&&u.team==='neutral'))&&old.passable.call(this,r,team,unit)},
  lineOfSight(a,b,melee=false){if(!old.lineOfSight.call(this,a,b,melee))return false;const steps=Math.round(riseDistance(a,b));for(let i=0;i<=steps;i++){const r=this.room(Math.round(a.x+Math.sign(b.x-a.x)*i),Math.round(a.y+Math.sign(b.y-a.y)*i));if(r?.type==='labyrinth'&&!r.mapped)return false;}return true},
  buildReason(type,r){if(this.territorialGuard(r))return'A criatura territorial guarda toda esta área. Resolva o encontro primeiro.';return old.buildReason.call(this,type,r)},
  reachableUnits(r){return this.allies.filter(u=>{const a=this.anchor(u);return a&&(this.path(a,r,'ally',u)!==null||DIRS.some(([dx,dy])=>{const n=this.room(r.x+dx,r.y+dy);return this.linked(r,n)&&this.path(a,n,'ally',u)!==null}))})},
  riseChoices(card){const i=card?.input;if(i?.kind!=='rise')return[];const r=this.room(i.x,i.y);if(!r)return[];const units=()=>this.reachableUnits(r).map(u=>({value:String(u.id),label:`${u.enemyName||UNITS[u.type]?.name||u.type} · ${Math.round(u.power)} STR${u.loyal?' · leal':''}`}));
   if(i.action==='dedicate')return ['fortune','guardian','devourer'].map((value,n)=>({value,label:['Fortuna · +3♦ no alcance','Guardião · armadilha passável nível 3','Devorador · sacrifício por magia boa'][n]}));
   if(i.action==='transferPrisoner')return !r.captive&&this.active(r)?this.rooms.filter(n=>n.type==='solitary'&&n.captive&&this.active(n)&&this.path(n,r,'ally')!==null).map(n=>({value:riseKey(n),label:n.captive.name})):[];
   if(i.action==='persuade')return r.captive&&this.active(r)?[{value:'held',label:'Interrogar '+r.captive.name+' · '+Math.round(r.captive.power)+' STR'}]:[];if(i.action==='hire')return this.rooms.filter(n=>n.type==='solitary'&&n.captive&&this.active(n)).map(n=>({value:riseKey(n),label:`${n.captive.name} · ${Math.round(n.captive.power)} STR · cela ${riseKey(n)}`}));
   if(i.action==='freeRoomType'){const site=this.s.rooms[i.site],built=this.s.built;this.s.built=false;try{return Object.keys(ROOMS).filter(t=>{const why=this.buildReason(t,site);return ROOMS[t].r!==undefined&&(!why||why==='Recursos insuficientes.');}).map(value=>({value,label:ROOMS[value].name}));}finally{this.s.built=built;}}
   if(i.action==='hirePay')return [{value:'accept',label:`Pagar ${i.price}♦ e contratar`},{value:'decline',label:'Recusar · dispensar candidato'}];
   if(i.action==='freeRoom')return this.rooms.filter(n=>n.type==='cave'&&!n.builtPartOf&&this.active(n)).map(n=>({value:riseKey(n),label:`Caverna ${riseKey(n)}`}));
   if(i.action==='stationCleric')return units().filter(o=>this.allies.find(u=>String(u.id)===o.value)?.type==='cleric');
   return units();
  },
  queueRise(action,r,title,description,extra={}){if(this.s.effectCards.some(c=>c.input?.kind==='rise'&&c.input.action===action&&c.input.x===r.x&&c.input.y===r.y))return{ok:false,reason:'Esta escolha já aguarda resolução.'};this.effect(title,description,'neutral',{kind:'rise',action,x:r.x,y:r.y,...extra});return{ok:true}},
  resolveEffect(id,selection=null){const c=this.s.effectCards?.[0];if(c?.id!==id||c.input?.kind!=='rise')return old.resolveEffect.call(this,id,selection);if(selection==='cancel'){if(c.input.action==='hirePay'&&!c.input.captive){const cell=this.s.rooms[c.input.cell];if(cell)clearCaptives(cell);this.syncPrisonBars?.();}if(c.input.action==='dedicate')return{ok:false,reason:'Escolha a dedicação do altar.'};this.s.effectCards.shift();return{ok:true};}if(!this.riseChoices(c).some(o=>o.value===String(selection)))return{ok:false,reason:'Escolha um alvo válido, ou cancele.'};const result=this.resolveRise(c.input,String(selection));if(result.ok)this.s.effectCards.shift();return result},
  captureRecord(u){return{type:u.type,power:u.intelBasePower??u.power,name:(u.enemyName||ENEMIES[u.type]?.name||UNITS[u.type]?.name||u.type).slice(0,200),range:u.range??this.unitData(u).range,size:u.size||1,mutiny:u.mutiny??12,...(u.id?{sourceId:u.id}:{}),...(u.spawnLayer?{spawnLayer:u.spawnLayer}:{}),...(u.isUndead?{isUndead:true,uncapturable:true}:{}),...(u.graveyardRevived?{graveyardRevived:true}:{}),...(u.monstrosity?{monstrosity:true}:{}),...(u.traits?{traits:[...u.traits]}:{})}},
  releaseCaptive(r){if(!r.captive)return;const c=r.captive;r.captive=null;r.prisoners=0;const u=this.addUnit(c.type,r.x,r.y,true,'enemy',c.power);u.enemyName=c.name;u.range=c.range;u.size=c.size;this.effect('Fuga da solitária',`${c.name} escapou da cela e tornou-se hostil.`,'bad');this._tacticsDirty=true;if(!this.s.combat)this.beginCombat();},
  checkPrisonEscapes(){for(const r of this.rooms){if(r.type==='solitary'&&r.captive&&(r.damaged||!this.active(r)))this.releaseCaptive(r);if(r.type==='prison'&&r.prisoners>0&&!this.active(r)){const count=r.prisoners;r.prisoners=0;this.spawnEnemies(r,count,'raider');this.effect('Fuga da prisão',`${count} prisioneiros escaparam da prisão desconectada.`,'bad');}}},
  convertCaptive(cell,home){const c=cell.captive;if(!c)return{ok:false,reason:'Prisioneiro indisponível.'};if(!home||!this.homeFits({type:c.type,power:c.power},home)||this.moraleFor(home)<this.threshold({type:c.type,mutiny:c.mutiny},home))return{ok:false,reason:'Construa um abrigo com força, vagas e moral suficientes para o convertido.'};const u=this.addUnit(c.type,home.x,home.y,false,'ally',c.power);u.mutiny=c.mutiny;u.spawnLayer=c.spawnLayer||0;if(c.graveyardRevived)u.graveyardRevived=true;u.enemyName=c.name;u.range=c.range;u.size=c.size;cell.captive=null;cell.prisoners=0;this.effect('Prisioneiro contratado',`${c.name} conserva ${Math.round(c.power)} STR e limite de motim ${this.threshold(u)} no novo abrigo.`,'good');return{ok:true}},
  captiveHome(c){return this.rooms.find(r=>['hut','quarters','mansion'].includes(r.type)&&this.homeFits({type:c.type,power:c.power},r)&&this.moraleFor(r)>=this.threshold({type:c.type,mutiny:c.mutiny},r))},
  resolveRise(i,value){const r=this.room(i.x,i.y),unit=this.allies.find(u=>String(u.id)===value);if(!r)return{ok:false,reason:'Sala indisponível.'};
   if(i.action==='transferPrisoner'){const cell=this.s.rooms[value];if(r.type!=='persuasion'||this.s.combat||this.s.status!=='playing'||!this.riseChoices({input:i}).some(o=>o.value===value))return{ok:false,reason:'Sala ou prisioneiro indisponível.'};const record=cell.captive;clearCaptives(cell);r.captive=record;r.prisoners=1;this.syncPrisonBars?.();this.effect('Prisioneiro transferido',`${record.name} foi levado da Solitária para a Sala de persuasão. O interrogatório acontece ao final do turno.`,'neutral');return{ok:true};}
   if(i.action==='dedicate'){r.dedication=value;return{ok:true}}
   if(i.action==='hirePay'){const cell=this.s.rooms[i.cell],record=i.captive||cell?.captive;if(value==='decline'){if(!i.captive&&cell)clearCaptives(cell);this.effect('Candidato dispensado','A proposta foi recusada. O candidato não retorna à Solitária.','neutral');return{ok:true};}if(!record)return{ok:false,reason:'Candidato indisponível.'};if(this.s.gold<i.price)return{ok:false,reason:'Riquezas insuficientes.'};const result=this.convertCaptive({captive:record},this.captiveHome(record));if(result.ok){this.s.gold-=i.price;if(!i.captive&&cell)clearCaptives(cell);}return result}
   if(i.action==='freeRoom'){this.queueRise('freeRoomType',r,'Instalação recuperada','Escolha o tipo da construção gratuita. Pré-requisitos e área continuam necessários.',{site:value});return{ok:true}}
   if(i.action==='freeRoomType'){const site=this.s.rooms[i.site],c=this.cost(value,site),built=this.s.built;this.s.resources+=c.resources;this.s.gold+=c.gold;this.s.built=false;const result=this.build(value,site.x,site.y);this.s.built=built;if(!result.ok){this.s.resources-=c.resources;this.s.gold-=c.gold;}return result}
   if(['persuade','hire'].includes(i.action)){
    const cell=i.action==='persuade'?r:this.s.rooms[value];
    if(!cell?.captive||r.riseUsed===this.s.turn||!this.active(r)||!this.active(cell))return{ok:false,reason:'Sala ou prisioneiro indisponível neste turno.'};
    if(i.action==='hire'&&!this.captiveHome(cell.captive))return{ok:false,reason:'Sem abrigo e tolerância para o convertido. Nenhuma tentativa foi gasta.'};
    r.riseUsed=this.s.turn;const roll=this.roll(4);
    if(i.action==='persuade'){try{if(roll===4)this.information(cell);else this.effect('Prisioneiro em silêncio','A tentativa não revelou Informação. O prisioneiro foi dispensado e a sala está livre.','neutral');}finally{clearCaptives(cell);this.syncPrisonBars?.();}}
    else {const record={...cell.captive};clearCaptives(cell);this.syncPrisonBars?.();
     if(roll===4)return this.convertCaptive({captive:record},this.captiveHome(record));
     if(roll===3){let card=this.draw(Math.max(0,r.y));while(card.rank===0)card=this.draw(Math.max(0,r.y));const price=2*card.rank;this.queueRise('hirePay',r,'Proposta de contratação',`O candidato cobra ${price}♦. A tentativa já o retirou da Solitária.`,{cell:value,captive:record,price});}
     else this.effect('Contratação recusada','O candidato recusou a oferta e foi dispensado. A Solitária está livre.','neutral');
    }return{ok:true};
   }
   if(!unit||!this.reachableUnits(r).includes(unit))return{ok:false,reason:'Unidade indisponível.'};
   if(i.action==='stationCleric'){if(unit.type!=='cleric'||!this.active(r)||r.type==='altar'&&this.allies.some(v=>v.id!==unit.id&&v.type==='cleric'&&v.home===riseKey(r)))return{ok:false,reason:'Sala ou clérigo indisponível.'};unit.home=riseKey(r);unit.x=r.x;unit.y=r.y;unit.moveTarget=null;this._tacticsDirty=true;return{ok:true}}
   if(i.action==='sacrifice'){if(r.dedication!=='devourer'||!this.altarCleric(r)||r.riseUsed===this.s.turn)return{ok:false,reason:'O altar não pode realizar este sacrifício.'};r.riseUsed=this.s.turn;this.s.baseMorale-=5;this.removeSacrifice(unit);this.magic(true);this.checkMutiny();return{ok:true}}
   if(i.action==='mapLabyrinth'){this.removeSacrificeIfFailed(unit,this.roll(4)===4,r);return{ok:true}}
   if(i.action==='champion'){const guard=this.territorialGuard(r);if(!guard)return{ok:false,reason:'Campeão indisponível.'};if(this.roll(4)===4){guard.team='ally';guard.loyal=false;guard.mutiny=8;delete guard.territory;guard.home=riseKey(r);r.challengeWon=true;this.effect('Campeão aliado','O campeão de 60 STR juntou-se à fortaleza. Limite de motim: 8.','good');this.checkMutiny();}else{this.removeSacrifice(unit);this.provoke(r);this.effect('Desafio perdido','O desafiante morreu e o campeão iniciou um combate.','bad');}return{ok:true}}
   if(i.action==='feed'){const guard=this.territorialGuard(r);if(!guard)return{ok:false,reason:'Criatura indisponível.'};this.removeSacrifice(unit);guard.power+=20;guard.maxHp=guard.power*8;guard.hp=guard.maxHp;this.effect('Criatura alimentada','A criatura ganhou 20 STR. Ela continua passiva até a tentativa de domesticação.','neutral');return{ok:true}}
   return{ok:false,reason:'Ação inválida.'};
  },
  removeSacrifice(u){this.s.units=this.s.units.filter(v=>v.id!==u.id);this.projectiles=this.projectiles.filter(p=>p.target!==u.id);this._tacticsDirty=true;},
  removeSacrificeIfFailed(u,success,r){if(success){const id=r.discoveryRoot||riseKey(r);for(const part of this.rooms.filter(p=>p===r||p.discoveryRoot===id))part.mapped=true;this._routeCache=null;this.effect('Labirinto mapeado','Todas as casas do labirinto permitem passagem.','good');}else{this.removeSacrifice(u);this.effect('Explorador perdido','O mapeamento falhou e a unidade escolhida morreu. O labirinto continua bloqueado.','bad');}},
  altarCleric(r){return this.active(r)&&this.allies.some(u=>u.type==='cleric'&&u.home===riseKey(r)&&(!this.s.combat||riseDistance(u,r)<.5))},
  provoke(r){const root=this.encounterRoot(r);for(const u of this.s.units)if(u.team==='neutral'&&u.territory===riseKey(root)){u.team='enemy';delete u.territory;}root.rewardPending=true;this._routeCache=null;this._tacticsDirty=true;if(this.enemies.length)this.beginCombat();return{ok:true}},
  prepareEncounter(r){if(!r||!['largelair','hungry','city','crypt','challenge'].includes(r.type)||r.encounterPrepared)return;r.encounterPrepared=true;this._routeCache=null;const root=riseKey(r);for(const u of this.s.units)if(u.team==='enemy'&&u.home===root){u.team='neutral';u.territory=root;if(r.type==='challenge'){u.power=60;u.hp=u.maxHp=480;u.enemyName='Campeão';}}if(this.territorialGuard(r))this.effect('Território guardado',`${ROOMS[r.type].name}: a criatura não ataca a base. Use as ações da sala para resolver o encontro.`,'neutral');},
  action(action,x,y,arg){const r=this.room(x,y);if(r&&action==='closePortal'&&['portal','stabilizer'].includes(r.type)){const cleric=this.allies.find(u=>u.type==='cleric'&&u.home===riseKey(r));if(this.s.combat||this.s.status!=='playing'||!cleric||this.s.gold<20)return{ok:false,reason:'Selar exige 20♦ e sacrifica um clérigo instalado no portal.'};this.removeSacrifice(cleric);this.s.gold-=20;r.type='cave';this.effect('Portal selado','O clérigo foi sacrificado e o portal não produzirá novas invasões.','neutral');return{ok:true}}
   if(r&&action==='magic'&&['ancienttemple','ritual'].includes(r.type)){if(this.s.combat||this.s.status!=='playing'||!this.allies.some(u=>u.type==='cleric'&&u.home===riseKey(r))||!this.active(r))return{ok:false,reason:'Instale um clérigo nesta sala ativa para realizar o ritual.'};const good=r.type==='ritual'||this.roll(4)===4;r.type='cave';this.magic(good);return{ok:true}}
   if(!r||!RISE_ACTIONS.includes(action))return old.action.call(this,action,x,y,arg);if(this.s.status!=='playing'||this.s.combat)return{ok:false,reason:'Ação indisponível agora.'};
   if(action==='provoke')return this.territorialGuard(r)?this.provoke(r):{ok:false,reason:'Sem guardião territorial.'};
   if(action==='tame'&&r.type==='hungry'){const guard=this.territorialGuard(r);if(!guard||!this.has('kennel'))return{ok:false,reason:'Exige criatura passiva e Canil.'};if(this.roll(4)===4){guard.team='ally';guard.loyal=false;guard.mutiny=15;delete guard.territory;this.effect('Criatura domesticada','A criatura passa a defender a fortaleza, conservando sua força e seu covil.','good');this.checkMutiny();return{ok:true}}this.effect('Domesticação falhou','A criatura recusou a aproximação e iniciou um combate.','bad');return this.provoke(r)}
   if(action==='transferPrisoner'){if(r.type!=='persuasion'||!this.riseChoices({input:{kind:'rise',action,x,y}}).length)return{ok:false,reason:'Exige sala de persuasão ativa e vazia e um prisioneiro em Solitária conectada.'};return this.queueRise(action,r,'Transferir prisioneiro','Escolha no mapa a Solitária de origem. O ocupante será levado à Sala de persuasão para o interrogatório automático ao final do turno.');}
   const legal=action==='stationCleric'&&['portal','stabilizer','crypt','ancienttemple','ritual','altar','temple'].includes(r.type)&&this.active(r)||action==='dedicate'&&r.type==='altar'&&!r.dedication||action==='sacrifice'&&r.type==='altar'&&r.dedication==='devourer'&&this.altarCleric(r)||action==='persuade'&&r.type==='persuasion'||action==='hire'&&r.type==='hiring'||action==='mapLabyrinth'&&r.type==='labyrinth'&&!r.mapped||action==='champion'&&r.type==='challenge'&&this.territorialGuard(r)||action==='feed'&&r.type==='hungry'&&this.territorialGuard(r);if(!legal)return{ok:false,reason:'Ação não corresponde a esta sala.'};if(['sacrifice','persuade','hire'].includes(action)&&r.riseUsed===this.s.turn)return{ok:false,reason:'Já utilizado neste turno.'};if(['persuade','hire'].includes(action)&&!this.active(r))return{ok:false,reason:'Sala inativa.'};const card={input:{kind:'rise',action,x,y}};if(!this.riseChoices(card).length)return{ok:false,reason:'Nenhum alvo válido disponível.'};return this.queueRise(action,r,{stationCleric:'Instalar clérigo',dedicate:'Dedicação do altar',sacrifice:'Sacrifício ao Devorador',persuade:'Persuadir prisioneiro',hire:'Contratar prisioneiro',mapLabyrinth:'Mapear labirinto',champion:'Desafiar campeão',feed:'Alimentar criatura'}[action],['sacrifice','feed'].includes(action)?'Escolha uma unidade. Ela será sacrificada permanentemente.':'Escolha o alvo da ação. O resultado será resolvido após sua escolha.');},
  finishTurnInterrogations(){for(const r of this.rooms){if(r.type!=='persuasion'||!r.captive||!this.active(r)||r.riseUsed===this.s.turn)continue;const name=r.captive.name;this.resolveRise({kind:'rise',action:'persuade',x:r.x,y:r.y},'held');this.note(`${name} foi interrogado. Encerrada a tentativa, a sala ficou livre.`);}},
  information(cell){let card=this.draw(Math.max(0,cell.y));while(card.rank===0)card=this.draw(Math.max(0,cell.y));const n=card.rank;const r=cell;let description='';
   if(n===1){this.releaseCaptive(cell);const fugitive=this.enemies.at(-1);if(fugitive)fugitive.rescuing=true;description='O prisioneiro escapou e tentará alcançar outras prisões para libertar seus ocupantes.';if(this.enemies.length)this.beginCombat();}
   if(n===2)description='O prisioneiro não revelou nada e foi dispensado.';
   if(n===3){const home=cell.captive&&this.captiveHome(cell.captive);if(home)this.convertCaptive(cell,home);else description='Sem abrigo e moral suficientes para servir, o prisioneiro foi dispensado.';}
   if(n===4){cell.captive=null;cell.prisoners=0;description='O prisioneiro morreu antes de revelar seus segredos.';}
   if(n===5){cell.captive=null;cell.prisoners=0;this.gain(0,30);description='O prisioneiro revelou um tesouro em troca da liberdade: até 30♦, conforme a reserva.';}
   if(n===6){this.spawnEnemies(cell,100,'raider');this.beginCombat();description='O prisioneiro chamou um grupo de resgate de 100 STR. A invasão aparece na cela.';}
   if(n===7){this.magic(this.roll(2)===2);description='Um objeto mágico foi encontrado com o prisioneiro. Seu efeito será mostrado em outra carta.';}
   if(n===8)description='O prisioneiro não trouxe informações adicionais. A tentativa foi encerrada.';
   if(n===9){this.s.baseMorale+=5;description='O espetáculo divertiu os habitantes: +5 moral.';}
   if(n===10){this.s.informationWeakness=true;description='Inimigos de resquícios no próximo combate recebem metade da força; criaturas naturais não são afetadas.';}
   if(n===11){this.s.rescueKnown=true;description='Na próxima descoberta J♥, uma prisão com 1d4 capangas será encontrada.';}
   if(n===12){this.queueRise('freeRoom',r,'Acampamento revelado','Escolha uma caverna para receber um quartel gratuito.');description='Uma instalação abandonada pode ser recuperada.';}
   if(n===13){this.s.raidIntel=(this.s.raidIntel||0)+1;description='Uma passagem secreta foi revelada: a próxima expedição terá sua força inimiga reduzida em 10 STR por informação acumulada.';}
   this.effect('Informação',description||'O prisioneiro juntou-se à fortaleza.','neutral');
  }
 });
 // Hooks keep legacy combat/rendering independent of the additional rule state.
 Game.prototype.income=function(){this.checkPrisonEscapes();return old.income.call(this)};
 Game.prototype.spreadHazards=function(){const result=old.spreadHazards.call(this);this.checkPrisonEscapes();return result};
 Game.prototype.damage=function(u,amount,opts){const alive=u.hp>0;old.damage.call(this,u,amount,opts);if(alive&&u.hp<=0&&u.team==='enemy'&&(Object.hasOwn(ENEMIES,u.type)||Object.hasOwn(UNITS,u.type))&&!opts?.instant&&!u.isUndead&&!u.uncapturable&&!this.s.units.some(v=>v.revivedFrom===u.id)){this.s.capturePool??=[];if(!this.s.capturePool.some(c=>c.sourceId===u.id))this.s.capturePool.push(this.captureRecord(u));}};
 Game.prototype.endCombat=function(){const result=old.endCombat.call(this);for(const r of this.rooms.filter(r=>r.type==='solitary'))r.prisoners=r.captive?1:0;this.s.capturePool=[];for(const u of this.s.units)if(u.intelBasePower){const ratio=u.hp/u.maxHp;u.power=u.intelBasePower;u.maxHp=u.power*8;u.hp=u.maxHp*ratio;delete u.intelBasePower;delete u.intelWeakened;}for(const u of this.allies)if(u.hospitalMutinyPending){u.mutiny=(u.mutiny??UNITS[u.type]?.mutiny??12)+1;delete u.hospitalMutinyPending;}return result};
 Game.prototype.lose=function(){this.s.capturePool=[];return old.lose.call(this)};
 Game.prototype.beginCombat=function(){const fresh=!this.s.combat;if(fresh){for(const r of this.rooms)if(r.type==='altar')r.guardianArmed=true;}
  if(fresh&&this.s.informationWeakness){let applied=false;for(const u of this.enemies){const r=this.s.rooms[u.home];if(r&&!['forest','gas','fairy','water','lava','cave','crystal','nest','crater','smalllair','largelair','burrow','invincible','wandering','mud','mushrooms','springs','elemental','hive','hungry'].includes(r.type)&&!u.intelWeakened){u.intelBasePower=u.power;u.power/=2;u.hp/=2;u.maxHp/=2;u.intelWeakened=true;applied=true;}}this.s.informationWeakness=false;this.effect('Fraquezas reveladas',applied?'A Informação reduziu pela metade a força dos inimigos de resquícios neste combate.':'A Informação foi consumida; criaturas naturais não são afetadas.','good');}
  return old.beginCombat.call(this);
 };
 Game.prototype.update=function(dt){if(this.s.combat&&!this.s.paused&&!(this.presentationEnabled&&this.s.effectCards.length)){for(const u of this.enemies.filter(u=>u.rescuing)){const r=this.room(Math.round(u.x),Math.round(u.y));if(r&&riseDistance(u,r)<.25){if(CAPTURE_ROOMS.includes(r.type)&&(r.captive||r.prisoners>0))this.releaseCaptive(r);}}for(const r of this.rooms){if(r.type!=='altar'||r.dedication!=='guardian'||!r.guardianArmed||!this.altarCleric(r))continue;const u=this.enemies.find(u=>Math.abs(u.x-r.x)<.35&&Math.abs(u.y-r.y)<.35);if(u){r.guardianArmed=false;this.damage(u,240*(this.shrineMultiplier?this.shrineMultiplier(r):1));}}}return old.update.call(this,dt)};
 Game.prototype.rescueGoal=function(u){if(!u.rescuing)return null;return this.rooms.filter(r=>(CAPTURE_ROOMS.includes(r.type)&&(r.captive||r.prisoners>0))&&this.path(u,r,'enemy',u)!==null).sort((a,b)=>(this.path(u,a,'enemy',u)?.length??Infinity)-(this.path(u,b,'enemy',u)?.length??Infinity))[0]||null};
 Game.prototype.damageRoom=function(r){old.damageRoom.call(this,r);this._routeCache=null;if(CAPTURE_ROOMS.includes(r?.type)&&(r.captive||r.prisoners>0))this.checkPrisonEscapes()};
 Game.prototype.explore=function(x,y,from){const result=old.explore.call(this,x,y,from);if(result.ok&&this.s.rescueKnown&&result.card?.suit==='♥'&&result.card.rank===11){this.s.rescueKnown=false;const n=this.roll(4);for(let i=0;i<n;i++)this.addUnit('thug',result.room.x,result.room.y,false);this.effect('Prisioneiros resgatados',`${n} capanga(s) foram libertados. Acolha-os e mantenha sua moral.`,'good');this.checkMutiny();}return result};
}

function validRiseInput(i,s){
 if(i?.kind!=='rise'||![...RISE_ACTIONS,'hirePay','freeRoom','freeRoomType','informationDebt'].includes(i.action)||!Number.isInteger(i.x)||!Number.isInteger(i.y))return false;
 const r=s.rooms[`${i.x},${i.y}`];if(!r)return false;
 const types={dedicate:['altar'],sacrifice:['altar'],persuade:['persuasion'],transferPrisoner:['persuasion'],hire:['hiring'],hirePay:['hiring'],feed:['hungry'],tame:['hungry'],champion:['challenge'],mapLabyrinth:['labyrinth'],stationCleric:['portal','stabilizer','crypt','ancienttemple','ritual','altar','temple']};
 if(types[i.action]&&!types[i.action].includes(r.type))return false;
 if(i.action==='hirePay'&&((i.captive!==undefined&&!validCaptive(i.captive))||!Number.isInteger(i.price)||i.price<0||i.price>26||typeof i.cell!=='string'||s.rooms[i.cell]?.type!=='solitary'))return false;
 if(i.action==='freeRoomType'&&(typeof i.site!=='string'||!s.rooms[i.site]))return false;
 return true;
}
function validateRiseState(s,dead=[]){
 const captive=validCaptive,capturedIds=new Set();for(const r of Object.values(s.rooms))for(const c of heldCaptives(r)){if(c.sourceId){if(capturedIds.has(c.sourceId))throw Error('Prisioneiro duplicado.');capturedIds.add(c.sourceId);}}for(const u of s.units)if(u.hp>0&&u.capturedSource){if(!Number.isInteger(u.capturedSource)||u.capturedSource<1||capturedIds.has(u.capturedSource))throw Error('Criatura capturada duplicada.');capturedIds.add(u.capturedSource);}
 for(const r of Object.values(s.rooms)){if(r.captives!==undefined&&(!Array.isArray(r.captives)||r.captives.length>20||r.captives.some(c=>!captive(c))||r.captives.length&&r.type!=='prison'))throw Error('Lista de prisioneiros inválida.');if(['prison','solitary'].includes(r.type)&&(!Number.isInteger(r.prisoners)||r.prisoners<0||r.prisoners>(r.type==='solitary'?1:20)))throw Error('Ocupação de prisão inválida.');if(r.captive!==undefined&&r.captive!==null&&(!CAPTURE_ROOMS.includes(r.type)||!captive(r.captive)))throw Error('Prisioneiro inválido.');if(r.dedication!==undefined&&(!['fortune','guardian','devourer','pure','protector'].includes(r.dedication)||!['altar','temple'].includes(r.type)))throw Error('Dedicação inválida.');for(const field of ['mapped','guardianArmed','encounterPrepared','challengeWon'])if(r[field]!==undefined&&typeof r[field]!=='boolean')throw Error('Estado de encontro inválido.');if(r.mapped!==undefined&&typeof r.mapped!=='boolean')throw Error('Mapeamento inválido.');if(r.riseUsed!==undefined&&(!Number.isInteger(r.riseUsed)||r.riseUsed<0||r.riseUsed>s.turn))throw Error('Uso de sala inválido.');}
 for(const u of [...s.units,...dead]){if(u.mutiny!==undefined&&(!Number.isInteger(u.mutiny)||u.mutiny<0||u.mutiny>100))throw Error('Limite de motim inválido.');if(u.territory!==undefined&&(typeof u.territory!=='string'||!s.rooms[u.territory]||u.team!=='neutral'||u.home!==u.territory||!['largelair','hungry','city','crypt','challenge'].includes(s.rooms[u.territory].type)))throw Error('Território inválido.');}
 for(const u of s.units){if(u.rescuing!==undefined&&typeof u.rescuing!=='boolean')throw Error('Fuga inválida.');if(u.intelBasePower!==undefined&&(!Number.isFinite(u.intelBasePower)||u.intelBasePower<=0||u.intelBasePower>1e7))throw Error('Força temporária inválida.');}
 if(s.capturePool!==undefined&&(!Array.isArray(s.capturePool)||s.capturePool.length>3000||s.capturePool.some(c=>!captive(c))))throw Error('Capturas inválidas.');
 for(const k of ['informationWeakness','rescueKnown'])if(s[k]!==undefined&&typeof s[k]!=='boolean')throw Error('Informação inválida.');if(s.mutinyRelief!==undefined&&(!Number.isInteger(s.mutinyRelief)||s.mutinyRelief<0||s.mutinyRelief>1e9))throw Error('Bênção de motim inválida.');if(s.riseVersion!==undefined&&s.riseVersion!==1)throw Error('Versão de RISE inválida.');if(s.raidIntel!==undefined&&(!Number.isInteger(s.raidIntel)||s.raidIntel<0||s.raidIntel>1e9))throw Error('Informação planar inválida.');
}


// colony.js
const SUPPORT_JOBS={crystal:'miner',mine:'miner',rivalmine:'miner',forest:'lumberjack',hive:'attendant',elemental:'miner',city:'attendant',games:'attendant',parlor:'attendant',prison:'attendant',concert:'engineer',brewery:'cook',dragonforge:'smith',trapmaster:'engineer',endersgate:'scholar',orefinder:'engineer',forge:'smith',masonry:'mason',library:'scholar',kitchen:'cook',workshop:'engineer',artificer:'engineer',laboratory:'scholar',warehouse:'attendant',treasury:'attendant',museum:'attendant',inspection:'scholar',laundry:'attendant',hospital:'attendant',persuasion:'attendant',hiring:'scholar'};
const ROOM_AURAS={kitchen:[1,1],workshop:[2,2],inspection:[2,2],laundry:[2,2],tavern:[2,2],games:[2,2],arena:[2,2],parlor:[2,2],altar:[3,3],temple:[3,2],museum:[3,2],hospital:[2,2],sewer:[2,2]};
const colonyKey=r=>`${r.x},${r.y}`;
const colonyDistance=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
function installColony(Game){
 const original={};for(const name of ['build','buildFootprint','income','endCombat','update','effectTargets','resolveEffect','damageBarricade','barricade','expandFormation','expandEmptyCavern','releaseCaptive','checkPrisonEscapes','lose','morale','unitData','threshold'])original[name]=Game.prototype[name];
 Object.assign(Game.prototype,{
  captureRooms(){return this.rooms.filter(r=>CAPTURE_ROOMS.includes(r.type)&&!r.builtPartOf&&this.active(r));},
  captureRoomAvailable(r){
   if(!r||!CAPTURE_ROOMS.includes(r.type)||!this.active(r))return false;
   if(r.type==='kennel')return !this.allies.some(u=>u.home===colonyKey(r)&&u.kennelMonster)&&this.allies.filter(u=>u.home===colonyKey(r)).length<this.capacity(r);
   return r.type==='prison'?(r.prisoners||0)<20:!r.captive;
  },
  captureReplacement(r,index=0){if(!r||!CAPTURE_ROOMS.includes(r.type)||!this.active(r))return null;if(r.type==='kennel')return this.allies.find(u=>u.home===colonyKey(r)&&u.kennelMonster)||null;return r.type==='prison'?(r.prisoners>=20?heldCaptives(r)[index]||heldCaptives(r)[0]||{name:'Prisioneiro antigo'}:null):r.captive||null;},
  captureCanReceive(r){return this.captureRoomAvailable(r)||!!this.captureReplacement(r);},
  captureAccepts(r,c){return !!r&&captiveKind(c)===(r.type==='kennel'?'monster':'person')&&this.captureCanReceive(r);},
  captureSlots(card){return (card.input.slots||this.captureRooms().map(colonyKey)).map(id=>this.s.rooms[id]).filter(r=>r&&CAPTURE_ROOMS.includes(r.type));},
  captureChoices(card){
   const i=card.input,a=i.assignments||{},out=[];
   for(const r of this.captureSlots(card)){
    const id=colonyKey(r);out.push({value:id+'#none',label:'Não usar '+ROOMS[r.type].name});if(r.type==='prison'&&this.captureReplacement(r))for(const [n,c]of heldCaptives(r).entries())out.push({value:id+'#replace'+n,label:'Dispensar '+c.name});
    if(this.captureCanReceive(r))for(const [n,c]of i.captives.entries())if(captiveKind(c)===(r.type==='kennel'?'monster':'person')&&!Object.entries(a).some(([other,index])=>other!==id&&index===n))out.push({value:id+'#'+n,label:c.name+' → '+ROOMS[r.type].name});
   }
   out.push({value:'confirm',label:'Confirmar capturas'});
   if(!i.slots)for(const [index,c]of i.captives.entries())if(this.captureSlots(card).some(r=>this.captureAccepts(r,c)))out.push({value:String(index),label:'Capturar '+c.name});
   return out;
  },
  resolveCapture(card,selection){
   const i=card.input;i.assignments??={};
   if(selection==='cancel'){this.s.effectCards.shift();this.resolveGraveyardReturns?.(i.graveyardReturns);return{ok:true};}
   if(!this.captureChoices(card).some(o=>o.value===String(selection)))return{ok:false,reason:'Escolha uma combinação válida de criatura e estrutura.'};
   if(/^\d+$/.test(String(selection))&&!i.slots){const index=Number(selection),r=this.captureSlots(card).find(r=>this.captureAccepts(r,i.captives[index]));i.assignments[colonyKey(r)]=index;selection='confirm';}
   if(selection!=='confirm'){
    const [id,index]=String(selection).split('#');if(index==='none')delete i.assignments[id];else if(index.startsWith('replace')){i.replacements??={};i.replacements[id]=Number(index.slice(7));}else i.assignments[id]=Number(index);
    return{ok:true,pending:true};
   }
   const chosen=Object.entries(i.assignments),used=new Set(),slots=new Set(this.captureSlots(card).map(colonyKey));
   for(const [id,index]of chosen){if(!slots.has(id)||!Number.isInteger(index)||!i.captives[index]||used.has(index)||!this.captureAccepts(this.s.rooms[id],i.captives[index]))return{ok:false,reason:'Uma das capturas ficou indisponível. Revise as escolhas antes de confirmar.'};used.add(index);}
   for(const [id,index]of chosen){
    const r=this.s.rooms[id],previous=this.captureReplacement(r,i.replacements?.[id]||0),record={...i.captives[index],...(i.captives[index].traits?{traits:[...i.captives[index].traits]}:{})};
    if(previous){if(r.type==='kennel')this.s.units=this.s.units.filter(u=>u.id!==previous.id);else if(r.type==='prison'){r.captives=heldCaptives(r).filter((_,n)=>n!==(i.replacements?.[id]||0));r.prisoners=Math.max(0,r.prisoners-1);r.captive=r.captives[0]||null;}else clearCaptives(r);this.effect('Captura substituída',`${previous.enemyName||previous.name||'O ocupante anterior'} foi dispensado para dar lugar a ${record.name}.`,'neutral');}
    if(r.type==='kennel'){
     const u=this.addUnit(record.type,r.x,r.y,true,'ally',record.power);u.range=record.range;u.size=record.size;u.enemyName=record.name;u.kennelMonster=true;u.spawnLayer=record.spawnLayer||0;if(record.graveyardRevived)u.graveyardRevived=true;u.capturedSource=record.sourceId;u.traits=[...(record.traits||[])];if(record.monstrosity)u.monstrosity=true;
     this.effect('Monstro capturado',`${record.name}, de ${Math.round(record.power)} STR, juntou-se à fortaleza e passou a morar no Canil.`,'good');
    }else{
     if(r.type==='prison'){
      const records=[...heldCaptives(r)];while(records.length<(r.prisoners||0))records.push({type:'raider',power:1,name:'Prisioneiro de uma jornada anterior',range:.42,size:1,mutiny:12});
      r.captives=[...records,record];r.captive=r.captives[0];r.prisoners=r.captives.length;
     }else {r.captive=record;r.prisoners=1;}
     this.effect('Prisioneiro capturado',`${record.name} foi levado a ${ROOMS[r.type].name}.`,'neutral');
    }
   }
   this.s.effectCards.shift();this.syncPrisonBars();this._tacticsDirty=true;this.resolveGraveyardReturns?.(i.graveyardReturns,chosen.map(([,index])=>i.captives[index].sourceId));return{ok:true};
  },
  confineRats(){
   for(const u of this.s.units.filter(u=>u.type==='rat'&&u.hp>0)){
    const home=this.s.rooms[u.home],sewer=home?.type==='sewer'?home:this.rooms.find(r=>r.type==='sewer');
    if(!sewer){u.hp=0;this.effect('Colônia dispersa','Sem um esgoto, os ratos deixaram a fortaleza.','neutral');continue;}
    u.home=colonyKey(sewer);u.x=sewer.x;u.y=sewer.y;u.moveTarget=null;u.walk=0;delete u.frontTarget;delete u.casualPlan;
   }
  },

  auraCells(r){if(!r)return[];const root=r.builtPartOf?this.s.rooms[r.builtPartOf]:r;if(!root)return[];const radius=ROOM_AURAS[root.type];if(!radius)return[];const members=(root.footprint||[colonyKey(root)]).map(id=>this.s.rooms[id]).filter(Boolean),cx=members.reduce((sum,p)=>sum+p.x,0)/members.length,cy=members.reduce((sum,p)=>sum+p.y,0)/members.length,width=['museum','temple'].includes(root.type)?6:radius[0]*2+1,height=radius[1]*2+1,left=Math.ceil(cx-(width-1)/2),top=Math.ceil(cy-(height-1)/2);return Array.from({length:width*height},(_,i)=>({x:left+i%width,y:top+Math.floor(i/width)}));},
  inAura(r,target){return this.auraCells(r).some(p=>p.x===Math.round(target.x)&&p.y===Math.round(target.y));},
  morale(){let value=original.morale.call(this);for(const r of this.rooms)if(this.active(r)){value-=({games:10,tavern:5,sewer:20}[r.type]||0);if(r.type==='laundry')value-=2*this.rooms.filter(n=>this.isHousing(n)&&Math.abs(n.x-r.x)<=2&&Math.abs(n.y-r.y)<=2&&this.active(n)).length;}return value;},
  moraleFor(){return this.morale();},
  localTolerance(u,home=this.s.rooms[u?.home]){const at=Number.isFinite(u?.x)&&Number.isFinite(u?.y)?u:home;if(!at)return 0;let value=0;for(const r of this.rooms)if(this.active(r)&&this.inAura(r,at)){value+=({games:10,tavern:5,sewer:20}[r.type]||0);if(r.type==='laundry'&&home&&this.isHousing(home)&&this.inAura(r,home))value+=2;}return value;},
  threshold(u,home=this.s.rooms[u.home]){return original.threshold.call(this,u,home)-this.localTolerance(u,home);},
  queueColony(action,title,description,data={}){return this.effect(title,description,'neutral',{kind:'colony',action,...data})},
  placementOptions(type,r){const count=BUILD_FOOTPRINTS[type]||1;if(count===1)return[];const out=[];for(const [dx,dy]of DIRS){if(type==='museum'&&dy)continue;const line=Array.from({length:count},(_,i)=>({x:r.x+dx*i,y:r.y+dy*i}));const valid=line.slice(1).every(p=>{const q=this.room(p.x,p.y);return p.x>=-20&&p.x<=20&&p.y>=-6&&p.y<=30&&!this.sealedBlock(p.x,p.y)&&(!q||q.type==='cave'&&!q.builtPartOf&&!q.exhausted&&!this.roomHazards(q).length)&&!(p.y<0&&this.surfaceReason(q||{...p,type:'surface'}));});if(valid)out.push({value:`${dx},${dy}`,label:dx===1?'À direita':dx===-1?'À esquerda':dy===1?'Abaixo':'Acima',cells:line});}return out;},
  buildFootprint(type,r){if(!r)return[];const requested=this._chosenFootprint;if(requested?.type===type&&requested.x===r.x&&requested.y===r.y)return requested.cells;return this.placementOptions(type,r)[0]?.cells||(BUILD_FOOTPRINTS[type]?[]:original.buildFootprint.call(this,type,r))},
  build(type,x,y,placement=null){const r=this.site(x,y);if(BUILD_FOOTPRINTS[type]&&!placement&&this.presentationEnabled){const reason=this.buildReason(type,r);if(reason)return{ok:false,reason};this.queueColony('placement','Área da construção','Escolha onde a sala continuará. O custo será cobrado apenas após confirmar.',{type,x,y});return{ok:true,pending:true};}if(placement){const option=this.placementOptions(type,r).find(o=>o.value===placement);if(!option)return{ok:false,reason:'A área escolhida deixou de estar disponível.'};this._chosenFootprint={type,x,y,cells:option.cells};}
   const group=r?.discoveryRoot,oldType=r?.type;let result;try{result=original.build.call(this,type,x,y)}finally{this._chosenFootprint=null;}if(result.ok){for(const p of [r,...(r.footprint||[]).map(id=>this.s.rooms[id])].filter(Boolean)){delete p.longCave;delete p.longPanel;delete p.enchanted;delete p.enchantedIndex;delete p.artPanel;}if(r.footprint)r.footprint.forEach((id,i)=>{const part=this.s.rooms[id];part.variant=(r.variant+i)%3;part.artPanel=i;});if(group&&!this.fluidSource(r)&&r.type!==oldType){const members=this.rooms.filter(p=>p!==r&&p.discoveryRoot===group&&p.type===oldType&&!p.playerBuilt);for(const p of this.rooms.filter(p=>p.discoveryRoot===group))delete p.discoveryRoot;if(members.length){const id=colonyKey(members[0]);for(const p of members)p.discoveryRoot=id;members[0].discoveryMembers=members.map(colonyKey);members[0].formationSize=members.length;}}this.syncWorkers();}return result;
  },
  expandFormation(root,count,options={}){if(['water','lava'].includes(root.type))options={...options,axis:'horizontal'};const members=original.expandFormation.call(this,root,count,options);this.varyFormation(members);return members},
  expandEmptyCavern(root,count){const members=original.expandEmptyCavern.call(this,root,count);this.varyFormation(members);return members},
  varyFormation(members){if(!members?.length)return;const offset=members[0].variant;members.forEach((p,i)=>{p.variant=(offset+i)%3;p.artPanel=i;});},
  colonyChoices(card){const i=card.input;if(i.action==='placement')return this.placementOptions(i.type,this.site(i.x,i.y));if(i.action==='capture')return this.captureChoices(card);return[]},
  resolveEffect(id,selection){const c=this.s.effectCards?.[0];if(c?.id!==id||c.input?.kind!=='colony')return original.resolveEffect.call(this,id,selection);if(c.input.action==='capture')return this.resolveCapture(c,String(selection));if(selection==='cancel'){this.s.effectCards.shift();return{ok:true}}if(!this.colonyChoices(c).some(o=>o.value===String(selection)))return{ok:false,reason:'Escolha uma opção válida.'};let result={ok:true};if(c.input.action==='placement')result=this.build(c.input.type,c.input.x,c.input.y,String(selection));if(result.ok)this.s.effectCards.shift();return result},
  releaseCaptive(r){
   const records=[...heldCaptives(r)],anonymous=Math.max(0,(r.prisoners||0)-records.length);if(!records.length&&!anonymous)return;
   clearCaptives(r);for(const c of records){const u=this.addUnit(c.type,r.x,r.y,true,'enemy',c.power);u.enemyName=c.name;u.spawnLayer=c.spawnLayer||0;if(c.graveyardRevived)u.graveyardRevived=true;u.range=c.range;u.size=c.size;u.traits=[...(c.traits||[])];if(c.monstrosity)u.monstrosity=true;}
   if(anonymous)this.spawnEnemies(r,anonymous,'raider');this.effect('Fuga de prisioneiros','Os ocupantes escaparam de '+ROOMS[r.type].name+' e se tornaram hostis.','bad');this._tacticsDirty=true;this.syncPrisonBars();if(this.enemies.length)this.beginCombat();
  },
  checkPrisonEscapes(){for(const r of this.rooms)if((r.captive||r.prisoners>0)&&(!CAPTURE_ROOMS.includes(r.type)||r.damaged||!this.active(r)))this.releaseCaptive(r);},
  syncPrisonBars(){this.s.cellBars??={};for(const r of this.rooms){if(!(CAPTURE_ROOMS.includes(r.type)&&(r.captive||r.prisoners>0)))continue;for(const [dx,dy]of DIRS){const n=this.room(r.x+dx,r.y+dy);if(!this.linked(r,n))continue;const edge=this.passageKey(r,n),old=this.s.cellBars[edge];if(!old)this.s.cellBars[edge]={kind:'prison',hp:200,level:1,cells:[colonyKey(r)]};else if(!old.cells.includes(colonyKey(r)))old.cells.push(colonyKey(r));}}for(const [edge,d]of Object.entries(this.s.cellBars)){d.cells=d.cells.filter(id=>{const r=this.s.rooms[id];return r&&(r.captive||r.prisoners>0)});if(!d.cells.length)delete this.s.cellBars[edge];}},
  barricade(a,b){const built=original.barricade.call(this,a,b);if(built)return built;const bar=this.s.cellBars?.[this.passageKey(a,b)];return bar?.hp>0?bar:null},
  damageBarricade(a,b,amount){const edge=this.passageKey(a,b),built=this.s.barricades[edge];if(built?.hp>0)return original.damageBarricade.call(this,a,b,amount);const bar=this.s.cellBars?.[edge];if(!bar)return;bar.hp=Math.max(0,bar.hp-amount);if(!bar.hp){for(const id of bar.cells){const r=this.s.rooms[id];if(r?.captive)this.releaseCaptive(r);else if(r?.prisoners){const count=r.prisoners;r.prisoners=0;this.spawnEnemies(r,count,'raider');}}delete this.s.cellBars[edge];this.syncPrisonBars();this._routeCache=null;this.effect('Grades rompidas','A cela foi violada. Seus prisioneiros estão livres e hostis.','bad');if(this.enemies.length)this.beginCombat();}},
  unitData(u){const d=original.unitData.call(this,u);if(u.worker)return{...d,speed:u.fleeing ? .95 : .45,range:0};return d;},
  syncWorkers(){this.s.workers??=[];for(const r of this.rooms){const job=SUPPORT_JOBS[r.type];if(!job||r.builtPartOf)continue;const resource=['miner','lumberjack'].includes(job),crew=this.s.workers.filter(w=>w.home===colonyKey(r));r.workerCount=resource?(Number.isInteger(r.workerCount)&&r.workerCount>=2&&r.workerCount<=3?r.workerCount:2+Math.floor(this.random()*2)):1;for(let n=crew.length;!r.captured&&n<r.workerCount;n++)this.s.workers.push({home:colonyKey(r),job,variant:n%3,localX:(n-(r.workerCount-1)/2)*20,x:0,y:0,arriving:true,alive:true});for(const w of crew)w.job=job;}this.s.workers=this.s.workers.filter(w=>SUPPORT_JOBS[this.s.rooms[w.home]?.type]);for(const [i,w]of this.s.workers.entries()){Object.assign(w,{worker:true,type:'soldier',team:'ally',id:-(i+1),hp:w.alive?1:0,maxHp:1,power:0,shield:0,size:.8});w.cooldown??=0;w.walk??=0;const at=this.room(Math.round(w.x),Math.round(w.y))||this.s.rooms[w.home],fx=Math.abs(w.x-Math.round(w.x)),fy=Math.abs(w.y-Math.round(w.y));if(fx>.00001&&fy>.00001){w.x=at.x;w.y=at.y;w.moveTarget=null;}else if(fx>.00001||fy>.00001){const next=this.s.rooms[w.moveTarget]||at,from=this.movementOrigin(w,next);if(from&&this.linked(from,next))w.moveTarget=colonyKey(next);else{w.x=at.x;w.y=at.y;w.moveTarget=null;}}}},
  casualPlan(u,home,owned=null){const team=owned?'enemy':'ally',choices=this.rooms.filter(r=>r!==home&&(owned?owned.has(colonyKey(r)):this.active(r))&&colonyDistance(r,home)<=2&&this.path(home,r,team,u)!==null),social=choices.filter(r=>!!ROOM_AURAS[r.type]||r.type==='springs'),pick=pool=>pool.length?pool[Math.floor(this.random()*pool.length)]:home,popular=pick(social),wander=pick(choices.filter(r=>r!==popular)),speed=Math.max(.05,this.unitData(u).speed*.30),length=(a,b)=>this.path(a,b,team,u)?.length||0,travel=(length(home,popular)+length(popular,wander)+length(wander,home))/speed,cycle=Math.max(60,travel*5);return{popular:colonyKey(popular),wander:colonyKey(wander),homeTime:Math.max(cycle*.5,u.idleAway||0),socialTime:cycle*.3,wanderTime:Math.max(0,cycle*.2-travel)};},
  idleUpdate(dt,roster=this.allies,owned=null){const team=owned?'enemy':'ally';let plans=0;for(const u of roster){if(this.unitData(u).speed<=0)continue;const home=this.s.rooms[u.home];if(!home)continue;if(!u.casualPlan){if(plans++>=4)continue;u.casualPlan=this.casualPlan(u,home,owned);}u.idlePhase??='home';u.idleRemaining??=u.casualPlan.homeTime;const atHome=colonyDistance(u,home)<.02&&!u.moveTarget;
    if(!atHome)u.idleAway=(u.idleAway||0)+dt;
    if(u.idlePhase==='home')u.idleGoal=u.home;else if(u.idlePhase==='social')u.idleGoal=u.casualPlan.popular;else if(u.idlePhase==='wander')u.idleGoal=u.casualPlan.wander;else u.idleGoal=u.home;
    let goal=this.s.rooms[u.idleGoal]||home;if(goal!==home&&(!(owned?owned.has(colonyKey(goal)):this.active(goal))||this.path(this.anchor(u),goal,team,u)===null)){u.idlePhase='return';u.idleGoal=u.home;goal=home;}const arrived=colonyDistance(u,goal)<.02&&!u.moveTarget;
    if(arrived){u.walk=0;u.idleRemaining-=dt;u.idleShuffleTimer=(u.idleShuffleTimer||0)-dt;if(u.idleShuffleTimer<=0){u.idleShuffleTimer=4+this.random()*8;u.idleRoomGoal=-5+this.random()*10;}const delta=(u.idleRoomGoal||0)-(u.idleRoomOffset||0);u.idleRoomOffset=(u.idleRoomOffset||0)+Math.sign(delta)*Math.min(Math.abs(delta),dt*3);if(Math.abs(delta)>.05)u.walk+=dt;
      if(u.idlePhase==='return'){const away=u.idleAway||0;u.casualPlan=this.casualPlan(u,home,owned);u.idlePhase='home';u.idleRemaining=Math.max(u.casualPlan.homeTime,away);u.idleAway=0;}
      else if(u.idleRemaining<=0){if(u.idlePhase==='home'){u.idlePhase='social';u.idleRemaining=u.casualPlan.socialTime;}else if(u.idlePhase==='social'){u.idlePhase='wander';u.idleRemaining=u.casualPlan.wanderTime;}else u.idlePhase='return';}
    }else {let next=u.moveTarget?this.s.rooms[u.moveTarget]:this.path(this.anchor(u),goal,team,u)?.[0];if(next&&!this.passable(next,team,u)){const origin=this.movementOrigin(u,next);next=origin&&this.passable(origin,team,u)?origin:null;u.moveTarget=next?colonyKey(next):null;}if(next)this.moveUnit(u,next,dt*.30);else u.walk=0;}
  }},
  workerUpdate(dt){for(const w of this.s.workers){const home=this.s.rooms[w.home];if(!w.alive){if(this.s.combat||!this.active(home))continue;w.variant=(w.variant+1)%3;w.alive=true;w.hp=1;w.x=0;w.y=0;w.arriving=true;w.moveTarget=null;}const at=this.room(Math.round(w.x),Math.round(w.y))||home;if(!home||!at)continue;if(this.lethalHazard(at,w)){w.hp=0;w.alive=false;continue;}const enemy=this.enemies.filter(u=>{if(colonyDistance(u,w)>=2.2)return false;const path=this.path(this.anchor(u),at,'enemy',u);return path!==null&&path.length<=2;}).sort((a,b)=>colonyDistance(a,w)-colonyDistance(b,w))[0];w.fleeing=!!enemy;
    if(enemy&&colonyDistance(enemy,w)<.24){w.alive=false;w.hp=0;continue;}
    // A committed corridor must finish before either flight or return can turn.
    if(w.moveTarget){const next=this.s.rooms[w.moveTarget],origin=next&&this.movementOrigin(w,next);if(next&&origin&&this.linked(origin,next)&&this.passable(next,'ally',w))this.moveUnit(w,next,dt);else {w.moveTarget=null;w.x=at.x;w.y=at.y;}continue;}
    if(enemy){w.localX=w.localY=0;const choices=this.neighbors(at,'ally',w).filter(r=>!this.roomHazards(r).length).sort((a,b)=>colonyDistance(b,enemy)-colonyDistance(a,enemy));if(choices[0])this.moveUnit(w,choices[0],dt);}
    else if(colonyDistance(w,home)>.01){if(this.enemies.some(u=>{const p=this.path(this.anchor(u),home,'enemy',u);return p!==null&&p.length<=2;}))continue;const next=this.path(at,home,'ally',w)?.[0];if(next)this.moveUnit(w,next,dt);}
    else {w.arriving=false;w.localX??=0;w.localY??=0;w.localTimer=(w.localTimer||0)-dt;if(w.localTimer<=0){w.localTimer=2+this.random()*5;w.localGoal=-32+this.random()*64;}const delta=(w.localGoal||0)-w.localX;if(Math.abs(delta)>.2)w.facing=Math.sign(delta);w.localX+=Math.sign(delta)*Math.min(Math.abs(delta),dt*8);w.walk+=Math.abs(delta)>.2?dt:0;}
    if(w.hp<=0)w.alive=false;
  }},
  income(){const before=this.events.length;original.income.call(this);for(const r of this.rooms.filter(r=>r.type==='sewer'&&this.active(r))){if(this.roll(100)>5)continue;const count=this.roll(3);for(let j=0;j<count;j++)this.addUnit('rat',r.x,r.y,false);this.effect('Ninhada no esgoto',`${count} rato(s) saíram da galeria. Eles não custaram recursos e afetam a moral normalmente.`,'neutral');}this.syncPrisonBars();this.checkMutiny();},
  endCombat(){const captures=[...(this.s.capturePool||[])];this.s.capturePool=[];original.endCombat.call(this);delete this.s.returnPhase;
   const slots=this.captureRooms();if(captures.length&&slots.length)this.queueColony('capture','Escolher capturas','Distribua os inimigos derrotados entre as estruturas. Cada inimigo só pode ser escolhido uma vez; cada estrutura recebe no máximo uma captura nesta batalha.',{captives:captures.slice(0,3000),slots:slots.map(colonyKey),assignments:{}});
   for(const w of this.s.workers||[]){const r=this.s.rooms[w.home];if(r){if(!w.alive){w.variant=(w.variant+1)%3;w.alive=true;w.x=0;w.y=0;w.arriving=true;w.moveTarget=null;w.localX=0;}}}this.syncPrisonBars();},
  lose(){const result=original.lose.call(this);for(const w of this.s.workers||[]){const r=this.s.rooms[w.home];if(r){if(!w.alive){w.variant=(w.variant+1)%3;w.alive=true;w.x=0;w.y=0;w.arriving=true;w.moveTarget=null;w.localX=0;}}}return result;},
  update(dt){if(this.s.status!=='playing'||this.s.paused||this.presentationEnabled&&this.s.effectCards?.length)return;dt=Math.min(.1,dt);this.syncWorkers();this.confineRats();this.syncPrisonBars();if(!this.s.combat)this.idleUpdate(dt);this.workerUpdate(dt);return original.update.call(this,dt)}
 });
}
function validateColony(s){if(s.workers!==undefined&&(!Array.isArray(s.workers)||s.workers.length>2000||s.workers.some(w=>!s.rooms[w.home]||!Object.values(SUPPORT_JOBS).includes(w.job)||![0,1,2].includes(w.variant)||!Number.isFinite(w.x)||!Number.isFinite(w.y)||typeof w.alive!=='boolean')))throw Error('Profissionais inválidos.');if(s.cellBars!==undefined)for(const [edge,d]of Object.entries(s.cellBars)){if(!s.passages[edge]||d.kind!=='prison'||!Number.isFinite(d.hp)||d.hp<0||d.hp>200||!Array.isArray(d.cells)||d.cells.some(id=>!s.rooms[id]))throw Error('Grades inválidas.');}}
function validColonyInput(i,s){if(i?.kind!=='colony')return false;if(i.action==='engineering')return ['defense','infrastructure'].includes(i.mode)&&(i.mode==='infrastructure'?['rails','columns','bridge','drawbridge','elevator']:['defensive','offensive','secret','damage','delay']).includes(i.tool)&&Number.isInteger(i.x)&&Number.isInteger(i.y)&&Math.abs(i.x)<=20&&i.y>=-6&&i.y<=30;if(i.action==='placement')return !!BUILD_FOOTPRINTS[i.type]&&Number.isInteger(i.x)&&Number.isInteger(i.y)&&Math.abs(i.x)<=20&&i.y>=-6&&i.y<=30&&(!!s.rooms[`${i.x},${i.y}`]||i.y<0);if(i.action!=='capture'||!Array.isArray(i.captives)||i.captives.length>3000||i.captives.some(c=>!validCaptive(c)))return false;
 if(i.graveyardReturns!==undefined&&(!Array.isArray(i.graveyardReturns)||i.graveyardReturns.length>3000||i.graveyardReturns.some(c=>!validGraveyardReturn(c,s))||new Set(i.graveyardReturns.map(c=>c.sourceId)).size!==i.graveyardReturns.length))return false;
 if(i.slots!==undefined&&(!Array.isArray(i.slots)||i.slots.length>2000||new Set(i.slots).size!==i.slots.length||i.slots.some(id=>typeof id!=='string'||!s.rooms[id])))return false;
 if(i.replacements!==undefined&&(!i.replacements||typeof i.replacements!=='object'||Array.isArray(i.replacements)||Object.entries(i.replacements).some(([id,n])=>i.slots&&!i.slots.includes(id)||s.rooms[id]?.type!=='prison'||!Number.isInteger(n)||n<0||n>=heldCaptives(s.rooms[id]).length)))return false;
 if(i.assignments!==undefined){if(!i.assignments||typeof i.assignments!=='object'||Array.isArray(i.assignments))return false;const entries=Object.entries(i.assignments),values=entries.map(([,n])=>n);if(new Set(values).size!==values.length||entries.some(([id,n])=>!s.rooms[id]||i.slots&&!i.slots.includes(id)||!Number.isInteger(n)||n<0||n>=i.captives.length||captiveKind(i.captives[n])!==(s.rooms[id].type==='kennel'?'monster':'person')))return false;}
 return true;
}


// rule-catalogue.js
// Rule identities are saved independently of their illustration and chosen target.
const GOOD_MAGIC=[
 ['Passagem Profunda','room','Cria dois portais ligados, separados pela profundidade de uma carta.'],['Selos Protetores','room','Armadilha passável de dano nível 3.'],['Metal Vivo',null,'No próximo combate, sai de uma Forja e busca uma tropa aliada para lhe conceder +40 STR.'],['Clone','unit','Cria uma cópia amigável da unidade escolhida.'],['Portal do Gatomante','room','Uma vez por turno, pague 5♦ para tentar obter um tigre de 20 STR.'],['Floresta Líquida','room','Faz crescer árvores nos espaços alcançados; cada colheita vale 20♥.'],['Bênção','portal','Fecha o portal escolhido.'],['Som da Sereia','room','Atrai inimigos até esta sala; termina quando um deles a alcança.'],['Sigilo da Enfermeira','room','Cura unidades que passam por esta sala.'],['Guelras',null,'Aliados ficam imunes à água, mas não ao magma.'],['Espíritos de Luz',null,'Hospitais podem recuperar uma tropa em qualquer ponto da fortaleza.'],['Correntes de Hudrak','room','Aprisiona uma monstruosidade que adentrar a sala, até a sala ser danificada.'],['Cores Encantadoras',null,'No próximo combate, um feitiço móvel busca e converte um inimigo, exceto monstruosidades.'],['Portal Planar','room','Abre um portal para outro plano.'],['Euforia',null,'Reduz permanentemente o valor de motim em 1.'],['Cristal de Gelo','room','Solidifica líquido em uma barricada defensiva.'],['Sussurros Amigáveis',null,'Oferece conversão aos prisioneiros em todas as solitárias.'],['Abrigo Encantado','housing','Transforma um abrigo em Mansão.'],['Ratos Gigantes',null,'Ratos atuais e futuros recebem +2 STR.'],['Cópia Encantada','built','Copia uma sala construída para uma área livre.'],['Tocado pelos Deuses','unit','A unidade concede duas magias quando sacrificada.'],['Espíritos Armeiros',null,'Durante o próximo combate, armadilhas rearmam automaticamente.'],['Olhos Voadores',null,'Quando ocorrer motim, um dos amotinados é derrotado imediatamente.'],['Herói Devoto',null,'Um herói de 75 STR e motim 16 se junta à fortaleza.'],['Sala Viva','built','A sala ganha vida como criatura de 100 STR e motim 5.'],['Círculo de Invocação','room','Unidades invocadas custam metade e têm motim aumentado em 3.']
];
const BAD_MAGIC=[['Toque do Rei Ganancioso','built','Transforma a sala em ouro: 30♦ por casa, destruindo sua função.'],['Olhar Grotesco',null,'Dobra o custo da próxima construção.'],['Poeira de Diamante',null,'A próxima carta ♦ de exploração não concede riquezas.'],['Covardia Contagiosa','unit','A unidade escolhida abandona a fortaleza.'],['Broca de Magma','room','Abre uma coluna de magma por 2d4 espaços abaixo.'],['Circo do Caos','room','Um portal hostil passa a gerar invasores de 30 STR.'],['Verme','room','Um verme abre 1d4 casas em uma direção, destruindo construções.'],['Pântano','room','Espalha lodo; no próximo turno surgem sapos em cada espaço atingido.'],['Mímico','built','A sala vira uma criatura imóvel e hostil de 100 STR.'],['Condenação',null,'Afasta o coringa vermelho por cinco turnos e desperta o preto.'],['Possessão','unit','A unidade escolhida torna-se inimiga.'],['Surto','unit','Transforma unidades próximas em mortos-vivos hostis; golems e cerco são imunes.'],['Forma Monstruosa','room','Uma monstruosidade de 25 STR e um traço aparece.']];
const INVENTIONS=[['Monstro da Engenharia','Uma criatura hostil de 200 STR foge da artificiaria.'],['Golems Musicais','Uma sala atrai invasores como uma canção de sereia.'],['Cerveja Secreta','Aventureiros recebem o dobro da força.'],['Feromônios','Libera Criadouro e permite acalmar criaturas grandes por 30♦.'],['Chuva de Caverna','Magma solidifica na origem e deixa de fluir.'],['Localizador de Minério','Ao explorar, escolha entre duas cartas; coringas são obrigatórios.'],['Alarmes','Ladrões deixam de furtar riquezas instantaneamente.'],['Carrinhos Armados','Um carrinho em trilhos causa 5 STR por casa percorrida.'],['Pássaros de Mineração','Aliados ignoram gases.'],['Fogo de Dragão','Arqueiros ganham +5 STR e cerco +20 STR.'],['Ciência Maluca','No começo de cada combate, armadilhas podem atingir aliados.'],['Mestre de Armadilhas','Permite aprimorar armadilhas ao nível 4.'],['Portão de Ender','Uma ativação aniquila todas as criaturas em combate.']];
const MONSTER_TRAITS=['Escavador','Regenerador','Sangue Negro','Colossal','Gêmeos','Sombrio','Ágil','Presságio','Armadura Ardente','Espinhos','Hipnose','Matriarca','Estrategista'];
const ARTIFACT_TRAITS=['Lendário','Abençoado','Sortudo','Orientação','Valioso','Animado','Ressurreição','Inspirador','Propósito','Criação','Negociador','Vingativo','Alma Antiga'];


// advanced-rules.js
const rulesKey=r=>`${r.x},${r.y}`;
const rulesDist=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
function installAdvancedRules(Game){const previous={};for(const name of ['resolveEffect','draw','shuffleDeck','neighbors','moveUnit','damage','beginCombat','endCombat','update','income','action','build','buildReason','cost','addUnit','immune','passable','checkMutiny','magic','explore','damageRoom','spawnEnemies','defenseGoal','resolveRise','recruit'])previous[name]=Game.prototype[name];
 Object.assign(Game.prototype,{
  resolveJoker(card,r){const color=card.joker||'black';this.s.jokerCooldown??={};this.s.jokerCooldown[color]=this.s.turn+5;this.s.jokerWaiting??={};this.s.jokerWaiting[color]=true;if(color==='black'){const u=this.spawnMonstrosity(r);this.effect('Coringa preto',`${u.enemyName}: ${Math.round(u.power)} STR. A monstruosidade foi despertada.`,'bad');if(!u.hidden)this.beginCombat();}else{const a=this.tableCard(),b=this.tableCard();r.legendary={form:[this.roll(4),this.roll(4)],traits:[a.rank,b.rank]};this.effect('Coringa vermelho',`Artefato encontrado: ${r.legendary.traits.map(n=>ARTIFACT_TRAITS[n-1]).join(' e ')}.`,'good');if([a.rank,b.rank].includes(6)){const unit=this.addUnit('guardian',r.x,r.y,true,'ally',20*r.legendary.form[1]);unit.artifactHome=rulesKey(r);}}},
  draw(depth=0){this.s.jokerWaiting??={};for(const color of ['red','black'])if(this.jokersUnlocked()&&this.s.jokerAdded&&this.s.jokerWaiting[color]&&this.s.turn>=(this.s.jokerCooldown?.[color]||0)){delete this.s.jokerWaiting[color];if(!this.s.deck.some(c=>c.joker===color))this.s.deck.splice(Math.floor(this.random()*(this.s.deck.length+1)),0,{suit:'★',rank:0,joker:color});}const c=previous.draw.call(this,depth);if(c.suit==='★'){c.joker??=this.s.nextLegacyJoker==='red'?'red':'black';this.s.nextLegacyJoker=c.joker==='red'?'black':'red';this.s.jokerCooldown??={};this.s.jokerCooldown[c.joker]=this.s.turn+5;this.s.jokerWaiting[c.joker]=true;}return c;},
  museumBonus(u,target){let bonus=0;for(const r of this.rooms.filter(r=>r.type==='museum'&&this.active(r)&&this.inAura(r,u))){if(r.trophySpecies?.includes(target?.type))bonus+=10;}return bonus;},
  effectiveStrength(u){const health=Math.max(0,u.hp/u.maxHp);return Math.round((u.power*(u.team==='ally'?1+(this.s.blessings||0)*.06:1))*health*10)/10;},
  damage(u,amount,options){const attacker=this.s.units.find(v=>v.id===options?.attacker);if(u.monstrosity&&u.traits?.includes(9)&&attacker&&this.unitData(attacker).range<=.5&&attacker.shield<=0&&!['golem','undead'].includes(attacker.type)){this.killInstant(attacker);return;}const alive=u.hp>0;previous.damage.call(this,u,amount,options);if(alive&&u.hp<=0&&u.team==='enemy'&&(u.monstrosity||u.size>1.5)){for(const r of this.rooms.filter(r=>r.type==='museum'&&this.active(r)))if(this.roll(4)===4){r.trophySpecies??=[];if(r.trophySpecies.length<4)r.trophySpecies.push(u.type);else this.ruleEvent('trophy','Museu lotado','Escolha o troféu que será substituído.',{x:r.x,y:r.y,species:u.type});}}},
  endCombat(){const trophies=this.s.trophies;previous.endCombat.call(this);this.s.trophies=trophies;for(const r of this.rooms.filter(r=>r.legendary?.traits.includes(7))){const dead=this.dead?.[0];if(dead){const u=this.addUnit(dead.type,this.target.x,this.target.y,true,'ally',dead.power);u.home=dead.home;}}},
  tableCard(){let c=this.draw();for(let j=0;c.rank===0&&j<4;j++)c=this.draw();return c;},
  rulesOrigin(){const o=this._discoveryOrigin||this.target;return this.room(o.x,o.y)||this._discoveryOrigin||this.target},
  ruleEvent(action,title,description,payload={}){return this.effect(title,description,'neutral',{kind:'rules',action,...payload})},
  magic(good){const card=this.tableCard(),id=Math.min(good?26:13,Math.max(1,card.rank+(good&&['♥','♦'].includes(card.suit)?13:0)));if(!good){const pure=this.rooms.find(r=>r.type==='temple'&&r.dedication==='pure'&&!r.storedCurse&&this.active(r)&&this.allies.some(u=>u.type==='cleric'&&u.home===rulesKey(r)));if(pure){pure.storedCurse={id};this.effect('Maldição aprisionada','O Templo da Pureza aprisionou esta magia ruim. Precisa continuar intacto e com clérigo.','good');return;}}return this.castMagic(good,id,card);},
  castMagic(good,id,card=null){const entry=(good?GOOD_MAGIC:BAD_MAGIC)[id-1],origin=this.rulesOrigin();return this.ruleEvent('spell',entry[0],entry[2],{good,id,x:origin.x,y:origin.y,card});},
  rulesChoices(card){const i=card.input,r=this.room(i.x,i.y)||this.target;if(i.action==='spell'){const target=(i.good?GOOD_MAGIC:BAD_MAGIC)[i.id-1]?.[1];if(!target)return[{value:'apply',label:'Resolver efeito'}];if(target==='unit')return this.allies.filter(u=>!['golem','siege'].includes(u.type)||i.good).map(u=>({value:`u:${u.id}`,label:`${u.enemyName||UNITS[u.type]?.name||u.type} · ${Math.round(u.power)} STR`}));if(target==='enemy')return this.enemies.filter(u=>!u.monstrosity&&u.type!=='immortal').map(u=>({value:`u:${u.id}`,label:u.enemyName||u.type}));return this.rooms.filter(p=>!p.builtPartOf&&(target==='portal'?['portal','stabilizer'].includes(p.type):target==='housing'?['hut','quarters','mansion'].includes(p.type):target==='built'?ROOMS[p.type]?.r!==undefined:this.active(p)||p===r)).map(p=>({value:`r:${rulesKey(p)}`,label:`${ROOMS[p.type].name} · ${rulesKey(p)}`}));}
   if(i.action==='copy-site')return this.rooms.filter(p=>p.type==='cave'&&!p.builtPartOf&&this.active(p)).map(p=>({value:rulesKey(p),label:`Caverna ${rulesKey(p)}`}));
   if(i.action==='temple')return[{value:'protector',label:'Protetor · escudo por 5♦'},{value:'pure',label:'Pureza · aprisionar maldição'}];
   if(i.action==='shield')return this.allies.filter(u=>this.inAura(r,u)).map(u=>({value:String(u.id),label:`${u.enemyName||UNITS[u.type]?.name||u.type} · escudo +20 STR`}));
   if(i.action==='invention-site')return this.rooms.filter(p=>p.type==='cave'&&!p.builtPartOf&&this.active(p)).map(p=>({value:rulesKey(p),label:`Caverna ${rulesKey(p)}`}));
   if(i.action==='minecart')return [[1,0],[-1,0],[0,1],[0,-1]].filter(([dx,dy])=>{const n=this.room(r.x+dx,r.y+dy);return n&&this.linked(r,n)&&(n.type==='rails'||n.transport==='rails');}).map(([dx,dy])=>({value:`${dx},${dy}`,label:dx===1?'Direita':dx===-1?'Esquerda':dy===1?'Baixo':'Cima'}));
   if(i.action==='breed')return this.allies.filter(u=>u.kennelMonster||u.bredMonster||['beast','troll','cavewolf','insectqueen','worm','elemental'].includes(u.type)).map(u=>({value:String(u.id),label:`${u.enemyName||u.type} · filhote ${Math.round(u.power/2)} STR`}));
   if(i.action==='summon')return Object.keys(UNITS).filter(type=>UNITS[type].recruitable!==false&&this.housing(type).length&&this.s.gold>=Math.ceil(this.recruitCost(type)/2)).map(value=>({value,label:`${UNITS[value].name} · ${Math.ceil(this.recruitCost(value)/2)}♦ · motim +3`}));
   if(i.action==='trophy')return (r.trophySpecies||[]).map((name,index)=>({value:String(index),label:`Substituir ${name}`}));
   if(i.action==='invention')return[{value:'apply',label:'Desenvolver invenção'}];
   if(i.action==='foresight')return i.cards.map((c,index)=>({value:String(index),label:`${c.suit} ${c.rank||'Coringa'}`}));
   return[{value:'apply',label:'Continuar'}];},
  resolveEffect(id,selection){const card=this.s.effectCards?.[0];if(card?.id!==id||card.input?.kind!=='rules')return previous.resolveEffect.call(this,id,selection);const i=card.input,choices=this.rulesChoices(card);if(!choices.length||selection==='skip'){this.s.effectCards.shift();return{ok:true}}if(!choices.some(c=>c.value===String(selection)))return{ok:false,reason:'Escolha um alvo válido.'};const room=this.room(i.x,i.y)||this.target;let result={ok:true};if(i.action==='spell')result=this.applySpell(i,String(selection));if(i.action==='temple')room.dedication=selection;if(i.action==='shield'){const u=this.allies.find(u=>String(u.id)===String(selection));if(this.s.gold<5||!u)return{ok:false,reason:'Exige 5♦ e uma unidade no alcance.'};this.s.gold-=5;u.preparedShield=(u.preparedShield||0)+160;}if(i.action==='copy-site'){const site=this.s.rooms[selection],built=this.s.built;this.s.built=false;site.freeProject=i.type;result=this.build(i.type,site.x,site.y);this.s.built=built;}if(i.action==='invention-site'){const site=this.s.rooms[selection];result=this.build(i.type,site.x,site.y);if(result.pending)result={ok:true};}if(i.action==='breed'){const u=this.allies.find(u=>String(u.id)===String(selection));room.breedingParent={type:u.type,power:u.power,traits:u.traits||[],name:u.enemyName||ENEMIES[u.type]?.name||u.type,range:this.unitData(u).range,size:u.size||1,monstrosity:!!u.monstrosity};}if(i.action==='minecart'){if(this.s.resources<10)return{ok:false,reason:'Exige 10♥.'};this.s.resources-=10;const [dx,dy]=selection.split(',').map(Number);let at=room,steps=0;while(steps<60){const next=this.room(at.x+dx,at.y+dy);if(!next||!this.linked(at,next)||!(next.type==='rails'||next.transport==='rails'))break;steps++;at=next;const target=this.enemies.find(u=>Math.abs(u.x-at.x)+Math.abs(u.y-at.y)<.5);if(target){this.damage(target,5*steps*8);break;}}room.cartUsed=this.s.combatId;}if(i.action==='summon'){const d=UNITS[selection],home=this.housing(selection).find(r=>this.moraleFor(r)>=this.threshold({type:selection,mutiny:d.mutiny+3},r));if(!home)return{ok:false,reason:'Nenhum abrigo permite invocar sem motim imediato.'};const cost=Math.ceil(this.recruitCost(selection)/2);if(this.s.gold<cost)return{ok:false,reason:'Riquezas insuficientes.'};this.s.gold-=cost;const u=this.addUnit(selection,home.x,home.y,false);u.mutiny=d.mutiny+3;}if(i.action==='trophy')room.trophySpecies[Number(selection)]=i.species;if(i.action==='invention')this.applyInvention(i.id,room);if(i.action==='foresight'){const chosen=i.cards[Number(selection)],other=i.cards.filter((_,index)=>index!==Number(selection));this.s.deck.push(chosen);this.s.discard.push(...other);this.s.foresightReady=true;}
   if(result.ok){this.s.effectCards.shift();if(i.action==='foresight')this.explore(i.x,i.y,i.from);this._routeCache=null;this.spreadHazards();this.checkMutiny();}return result;},
  addPower(u,amount){u.power=Math.max(1,u.power+amount);u.maxHp=u.power*8;u.hp=Math.min(u.maxHp,u.hp+Math.max(0,amount)*8)},
  applySpell(i,selection){const source=this.room(i.x,i.y)||this.target,r=selection.startsWith('r:')?this.s.rooms[selection.slice(2)]:source,u=selection.startsWith('u:')?this.s.units.find(u=>String(u.id)===selection.slice(2)):null,id=i.id;this.s.magicFlags??={};const f=this.s.magicFlags;
   if(i.good){switch(id){case 1:{const n=this.tableCard().rank,y=Math.min(30,r.y+n),end=this.room(r.x,y)||this.addRoom(r.x,y,'cave');this.s.teleports??={};this.s.teleports[rulesKey(r)]=rulesKey(end);this.s.teleports[rulesKey(end)]=rulesKey(r);break;}case 2:r.trap={kind:'damage',level:3,armed:true,passable:true};break;case 3:f.livingMetal=(f.livingMetal||0)+1;break;case 4:{const clone=this.addUnit(u.type,u.x,u.y,true,'ally',u.power);clone.home=u.home;clone.range=u.range;clone.size=u.size;break;}case 5:r.catPortal=true;break;case 6:for(const p of [r,...this.neighbors(r)]){p.fleetForest=true;p.fleetHarvest=20;}break;case 7:r.type='cave';break;case 8:r.siren=true;break;case 9:r.healingSigil=true;break;case 10:f.gills=true;break;case 11:f.hospitalGlobal=true;break;case 12:r.hudrakChains=true;break;case 13:f.charmingColors=(f.charmingColors||0)+1;break;case 14:r.type='portal';r.planarRealm=this.roll(13)-1;break;case 15:this.s.mutinyRelief=(this.s.mutinyRelief||0)+1;break;case 16:r.iceCrystal=true;break;case 17:for(const cell of this.rooms.filter(p=>p.captive)){const home=this.captiveHome(cell.captive);if(home)this.convertCaptive(cell,home);}break;case 18:r.type='mansion';r.playerBuilt=true;break;case 19:f.ratStrength=(f.ratStrength||0)+2;for(const rat of this.allies.filter(v=>v.type==='rat'))this.addPower(rat,2);break;case 20:this.ruleEvent('copy-site','Destino da cópia','Escolha uma caverna livre. A cópia não consome sua construção normal.',{type:r.type,x:r.x,y:r.y});break;case 21:u.godTouched=true;break;case 22:f.rearmNext=true;break;case 23:f.watchingEyes=true;break;case 24:{const hero=this.addUnit('hero',this.target.x,this.target.y,false,'ally',75);hero.loyal=false;hero.mutiny=16;hero.heroTraits=[this.roll(13),this.roll(13)];break;}case 25:{const living=this.addUnit('golem',r.x,r.y,false,'ally',100);living.loyal=false;living.mutiny=5;living.livingRoom=r.type;r.type='cave';break;}case 26:r.summoningCircle=true;break;}}
   else switch(id){case 1:{const cells=r.footprint?.map(k=>this.s.rooms[k])||[r];this.gain(0,30*cells.length);for(const p of cells){delete p.builtPartOf;delete p.footprint;p.type='cave';p.playerBuilt=false;}break;}case 2:f.doubleBuild=true;break;case 3:f.diamondDust=true;break;case 4:this.removeSacrifice(u);break;case 5:{const count=this.roll(4)+this.roll(4);for(let j=0;j<count&&r.y+j<=30;j++){const p=this.room(r.x,r.y+j)||this.addRoom(r.x,r.y+j,'cave');this.damageRoom(p);p.fluid='lava';if(j)this.connectRooms(this.room(r.x,r.y+j-1),p);}break;}case 6:r.chaosPortal=true;r.type='portal';break;case 7:{const [dx,dy]=DIRS[this.roll(4)-1];let last=r;for(let j=0;j<this.roll(4);j++){const x=last.x+dx,y=last.y+dy;if(y<0||y>30||Math.abs(x)>20)break;const next=this.room(x,y)||this.addRoom(x,y,'cave');this.damageRoom(next);this.connectRooms(last,next);last=next;}break;}case 8:r.swampUntil=this.s.turn+1;for(const p of [r,...this.neighbors(r)])p.swampTouched=true;break;case 9:r.mimic=true;this.spawnEnemies(r,100,'troll');this.enemies.at(-1).fixed=true;this.beginCombat();break;case 10:this.s.jokerCooldown??={};this.s.jokerCooldown.red=this.s.turn+5;break;case 11:u.team='enemy';this.beginCombat();break;case 12:for(const v of this.allies.filter(v=>!['golem','siege','undead'].includes(v.type)&&rulesDist(v,u)<=2)){v.type='undead';v.team='enemy';v.power=10;v.maxHp=v.hp=80;}this.beginCombat();break;case 13:this.spawnMonstrosity(r,25,1);this.beginCombat();break;}
   return{ok:true};},
  applyInvention(id,r){this.s.discoveredInventions??=[];if(this.s.discoveredInventions.includes(id)){this.effect('Invenção repetida','O projeto já é conhecido. Seu efeito não foi duplicado.','neutral');return;}this.s.discoveredInventions.push(id);const type={2:'concert',3:'brewery',6:'orefinder',10:'dragonforge',12:'trapmaster',13:'endersgate'}[id];if(type&&!this.rooms.some(p=>p.type==='cave'&&this.active(p))){const d=this.directions().find(d=>d.kind==='explore'&&d.y>=0);if(d){const site=this.addRoom(d.x,d.y,'cave');this.connectRooms(this.room(d.from.x,d.from.y),site);}}if(type)this.ruleEvent('invention-site','Local da invenção',`Escolha onde instalar ${ROOMS[type].name}. Não consome a construção do turno.`,{type,x:r.x,y:r.y});switch(id){case 1:this.spawnEnemies(r,200,'guardian');this.enemies.at(-1).engineered=true;this.beginCombat();break;case 2:break;case 3:break;case 5:for(const p of this.rooms.filter(p=>this.fluidSource(p)==='lava'&&p.type!=='forge')){p.solidMagma=true;p.flowActive=false;}break;case 10:for(const u of this.allies)if(['archer','siege'].includes(u.type))this.addPower(u,u.type==='siege'?20:5);break;}},
  damageRoom(r){previous.damageRoom.call(this,r);if(r?.damaged){if(r.chainedId){const u=this.s.units.find(u=>u.id===r.chainedId);if(u)u.chainBound=false;delete r.chainedId;}if(r.storedCurse){const curse=r.storedCurse;r.storedCurse=false;this.castMagic(false,curse.id||1);}}},
  spawnEnemies(r,total,type='raider'){if(r.discoveryRoot&&!r.depthBudgetApplied&&['nest','hive','ruins','desolate','shaft','city'].includes(r.type)){total+=Math.max(0,r.y)*5;r.depthBudgetApplied=true;}return previous.spawnEnemies.call(this,r,total,type);},
  defenseGoal(u){return previous.defenseGoal.call(this,u)},
  spawnMonstrosity(r,power=100,traitCount=3){const traits=[];for(let j=0;j<traitCount;j++){const n=this.tableCard().rank;if(traits.includes(n))power+=50;else traits.push(n);}if(traits.includes(4))power+=100;this.spawnEnemies(r,power,traits.includes(1)?'worm':'guardian');const u=this.enemies.at(-1);u.monstrosity=true;u.traits=traits;u.enemyName=traits.map(n=>MONSTER_TRAITS[n-1]).join(' · ');if(traits.includes(10))u.range=2.05;if(traits.includes(12))u.fixed=true;return u;},
  explore(x,y,from){if(!this.directions().some(d=>d.kind==='explore'&&d.x===x&&d.y===y&&(!from||d.from.x===from.x&&d.from.y===from.y)))return previous.explore.call(this,x,y,from);if((this.s.discoveredInventions?.includes(6)||this.hasArtifactTrait(4))&&!this.s.foresightReady&&!this.s.combat){if(this.s.effectCards.some(c=>c.input?.action==='foresight'))return{ok:false,reason:'Resolva a previsão.'};const cards=[this.draw(y),this.draw(y)];const jokers=cards.filter(c=>c.suit==='★');if(jokers.length){this.s.discard.push(...cards.filter(c=>c.suit!=='★'));this.s.deck.push(...jokers.reverse());this.s.foresightReady=true;}else{this.ruleEvent('foresight','Visão das profundezas','Escolha a carta que define esta descoberta.',{cards,x,y,from});return{ok:true,pending:true};}}const priorForecast=this.s.foresightReady;this._discoveryOrigin={x,y};let result;try{result=previous.explore.call(this,x,y,from);}finally{this._discoveryOrigin=null;}if(result.ok)this.s.foresightReady=false;else if(priorForecast===undefined)delete this.s.foresightReady;else this.s.foresightReady=priorForecast;return result;},
  neighbors(r,team='ally',unit=null){const out=previous.neighbors.call(this,r,team,unit),other=this.s.rooms[this.s.teleports?.[rulesKey(r)]];if(other&&this.passable(other,team,unit))out.push(other);return out;},
  moveUnit(u,next,dt){const at=this.anchor(u);if(at&&this.s.teleports?.[rulesKey(at)]===rulesKey(next)){u.x=next.x;u.y=next.y;u.moveTarget=null;return;}if(u.fixed||u.chainBound)return;previous.moveUnit.call(this,u,next,dt);if(u.engineered&&next.type==='forge'&&rulesDist(u,next)<.35&&u.forgeTurn!==rulesKey(next)){this.addPower(u,100);u.forgeTurn=rulesKey(next);}if(next.healingSigil&&rulesDist(u,next)<.35){u.hp=u.maxHp;}if(next.hudrakChains&&u.monstrosity){u.chainBound=true;next.chainedId=u.id;}},
  immune(u,h){return u.traits?.includes(3)&&h==='water'||u.team==='ally'&&(h==='water'&&this.s.magicFlags?.gills||['gas','blindgas','miasma','flammable'].includes(h)&&this.s.discoveredInventions?.includes(9))||previous.immune.call(this,u,h);},
  passable(r,team='ally',unit=null){return !r?.solidMagma&&!r?.chainedId&&previous.passable.call(this,r,team,unit);},
  cost(type,r){const c=previous.cost.call(this,type,r);if(c&&r?.freeProject===type)return{...c,resources:0,gold:0};if(this.s.magicFlags?.doubleBuild&&c){c.resources*=2;c.gold*=2;}return c;},
  buildReason(type,r){if(ROOMS[type]?.inventionOnly&&!this.s.discoveredInventions?.includes(ROOMS[type].inventionOnly))return'Esta construção exige sua invenção.';if(type==='breeder'&&!this.s.discoveredInventions?.includes(4))return'Exige a invenção Feromônios.';const built=this.s.built;if(r?.freeProject===type)this.s.built=false;try{return previous.buildReason.call(this,type,r);}finally{this.s.built=built;}},
  build(type,x,y,placement){const built=this.s.built,special=!!ROOMS[type]?.inventionOnly||this.room(x,y)?.freeProject===type;if(special)this.s.built=false;const result=previous.build.call(this,type,x,y,placement);if(special)this.s.built=built;if(result.ok&&!result.pending){if(this.s.magicFlags)this.s.magicFlags.doubleBuild=false;const r=this.room(x,y);delete r.freeProject;if(type==='concert')r.siren=true;if(type==='brewery')for(const u of this.allies.filter(u=>u.type==='hero'))this.addPower(u,u.power);if(type==='temple'&&!r.dedication)this.ruleEvent('temple','Dedicação do templo','Escolha a função do templo. Exige clérigo instalado.',{x,y});}return result;},
  addUnit(type,x,y,loyal=false,team='ally',power=null){const u=previous.addUnit.call(this,type,x,y,loyal,team,power);if(team==='ally'&&type==='rat'&&this.s.magicFlags?.ratStrength)this.addPower(u,this.s.magicFlags.ratStrength);if(team==='ally'&&this.s.discoveredInventions?.includes(10)&&['archer','siege'].includes(type))this.addPower(u,type==='siege'?20:5);return u;},
  recruit(type,home){const beforeIds=new Set(this.s.units.map(u=>u.id));const result=previous.recruit.call(this,type,home);if(result.ok&&type==='beast'){const child=this.allies.find(u=>!beforeIds.has(u.id)),r=this.s.rooms[child.home];if(r?.breedingParent){child.power=Math.max(1,r.breedingParent.power/2);child.hp=child.maxHp=child.power*8;child.traits=[...r.breedingParent.traits];child.parentSpecies=r.breedingParent.type;}}return result;},
  resolveRise(i,value){const touched=i.action==='sacrifice'&&this.allies.some(u=>String(u.id)===value&&u.godTouched),r=this.room(i.x,i.y),count=i.action==='sacrifice'?(touched?2:1)*this.shrineMultiplier(r):1;const result=previous.resolveRise.call(this,i,value);if(result.ok)for(let j=1;j<count;j++)this.magic(true);return result;},
  action(action,x,y,arg){const r=this.room(x,y);if(action==='breedOffspring'){if(!r?.breedingParent||r.type!=='breeder'||!this.active(r)||this.s.combat||this.s.gold<15||this.allies.filter(u=>u.home===rulesKey(r)).length>=this.capacity(r))return{ok:false,reason:'Exige Criadouro ativo, matriz, vaga, 15♦ e paz.'};const parent=r.breedingParent;if(this.moraleFor(r)<this.threshold({type:parent.type,mutiny:15,home:rulesKey(r)},r))return{ok:false,reason:'Tolerância insuficiente para a cria.'};this.s.gold-=15;const child=this.addUnit(parent.type,r.x,r.y,false,'ally',Math.max(1,parent.power/2));child.mutiny=15;child.traits=[...(parent.traits||[])];child.parentSpecies=parent.type;child.bredMonster=true;child.enemyName=parent.name||ENEMIES[parent.type]?.name||parent.type;if(parent.range!==undefined)child.range=parent.range;if(parent.size)child.size=parent.size;if(parent.monstrosity)child.monstrosity=true;this.effect('Cria nascida',`${child.enemyName||ENEMIES[child.type]?.name||child.type} nasceu com ${Math.round(child.power)} STR.`,'good');return{ok:true};}if(action==='calm'&&r&&this.territorialGuard(r)&&this.s.discoveredInventions?.includes(4)){if(this.s.gold<30)return{ok:false,reason:'Exige 30♦.'};this.s.gold-=30;r.pheromoneCalm=true;return{ok:true};}if(action==='breed'&&r?.type==='breeder'){this.ruleEvent('breed','Matriz de criação','Escolha a criatura domesticada. O filhote terá metade da sua força.',{x,y});return{ok:true};}if(action==='minecart'&&r&&(r.type==='rails'||r.transport==='rails')&&this.s.discoveredInventions?.includes(8)){if(!this.s.combat||r.cartUsed===this.s.combatId)return{ok:false,reason:'Uma vez por combate.'};this.ruleEvent('minecart','Carrinho armado','Escolha a direção. Custa 10♥ e causa 5 STR por casa percorrida.',{x,y});return{ok:true};}if(action==='upgrade'&&r?.trap?.level===3&&this.s.discoveredInventions?.includes(12)){if(this.s.resources<20)return{ok:false,reason:'Exige 20♥.'};this.s.resources-=20;r.trap.level=4;return{ok:true};}if(action==='summon'&&r?.summoningCircle){this.ruleEvent('summon','Círculo de Invocação','Escolha a unidade. Custo pela metade e motim aumentado.',{x,y});return{ok:true};}if(action==='shield'&&r?.type==='temple'&&r.dedication==='protector'){if(!this.allies.some(u=>u.type==='cleric'&&u.home===rulesKey(r)))return{ok:false,reason:'Instale um clérigo no templo.'};this.ruleEvent('shield','Proteção do templo','Escolha uma unidade no alcance; custa 5♦.',{x,y});return{ok:true};}if(action==='invention'&&r?.type==='artificer'){if(this.s.combat||this.s.gold<50)return{ok:false,reason:'Exige 50♦, fora de combate.'};this.s.gold-=50;const id=this.tableCard().rank;this.ruleEvent('invention',INVENTIONS[id-1][0],INVENTIONS[id-1][1],{id,x,y});return{ok:true};}if(action==='harvest'&&r?.fleetForest){this.gain(r.fleetHarvest||20,0);r.fleetForest=false;return{ok:true};}if(action==='cat'&&r?.catPortal){if(this.s.gold<5||r.catTurn===this.s.turn)return{ok:false,reason:'Exige 5♦; uma tentativa por turno.'};this.s.gold-=5;r.catTurn=this.s.turn;if(this.roll(4)===4)this.addUnit('beast',x,y,false,'ally',20);else r.petCats=(r.petCats||0)+1;return{ok:true};}if(action==='ender'&&this.s.discoveredInventions?.includes(13)){for(const u of [...this.s.units])if(u.team!=='neutral')this.killInstant(u);this.endCombat();return{ok:true};}if(action==='pump'&&r?.type==='pump'){r.pumpOpen=!r.pumpOpen;this.spreadHazards();return{ok:true};}if(action==='rails'&&r&&this.has('forge')){if(this.s.combat||this.s.resources<5||r.transport==='rails')return{ok:false,reason:'Exige 5♥, espaço sem trilhos e fora de combate.'};r.transport='rails';this.s.resources-=5;return{ok:true};}return previous.action.call(this,action,x,y,arg);},
  income(){previous.income.call(this);for(const r of this.rooms){if(r.storedCurse&&(!this.active(r)||!this.allies.some(u=>u.type==='cleric'&&u.home===rulesKey(r)))){const curse=r.storedCurse;r.storedCurse=false;this.castMagic(false,curse.id||1);}if(r.swampUntil===this.s.turn){for(const p of this.rooms.filter(p=>p.swampTouched))this.spawnEnemies(p,10,'cavewolf');delete r.swampUntil;}if(r.iceCrystal&&this.roomHazards(r).some(h=>['water','lava','crater'].includes(h))){r.fluid=null;r.contaminant=null;r.iceCrystal=false;r.trap={kind:'delay',level:1,armed:true};}if(r.chainedId&&r.damaged){const u=this.s.units.find(u=>u.id===r.chainedId);if(u)u.chainBound=false;delete r.chainedId;}}},
  beginCombat(){const fresh=!this.s.combat;previous.beginCombat.call(this);if(!fresh)return;this.s.combatId=(this.s.combatId||0)+1;for(const u of this.allies){u.shield+=u.preparedShield||0;u.preparedShield=0;}this.s.magicFlags??={};this.s.spellEntities??=[];for(const kind of ['livingMetal','charmingColors'])if(this.s.magicFlags[kind]){const origin=kind==='livingMetal'?this.rooms.find(r=>r.type==='forge'&&this.active(r)):this.target;if(origin){for(let j=0;j<this.s.magicFlags[kind];j++)this.s.spellEntities.push({kind,x:origin.x,y:origin.y});this.s.magicFlags[kind]=0;}}this.s.magicFlags.rearmCombat=!!this.s.magicFlags.rearmNext;this.s.magicFlags.rearmNext=false;if(this.s.discoveredInventions?.includes(11))this.s.madTraps=this.roll(2)===1;},
  update(dt){for(const r of this.rooms.filter(r=>r.storedCurse&&!this.allies.some(u=>u.type==='cleric'&&u.home===rulesKey(r)))){const curse=r.storedCurse;delete r.storedCurse;this.castMagic(false,curse.id||1);}if(this.s.combat&&!this.s.paused){for(const e of this.s.spellEntities||[]){if(e.done)continue;const targets=(e.kind==='livingMetal'?this.allies:this.enemies.filter(u=>!u.monstrosity&&u.type!=='immortal')).filter(u=>this.path(e,this.anchor(u))!==null).sort((a,b)=>rulesDist(e,a)-rulesDist(e,b)),target=targets[0];if(target){if(rulesDist(e,target)<.35){if(e.kind==='livingMetal')this.addPower(target,40);else{target.team='ally';target.loyal=true;target.home=rulesKey(this.target);}e.done=true;}else{const next=this.path(e,this.anchor(target))?.[0];if(next){const dx=next.x-e.x,dy=next.y-e.y,len=Math.hypot(dx,dy),step=Math.min(dt*1.2,len);if(len){e.x+=dx/len*step;e.y+=dy/len*step;}}}}}this.s.spellEntities=(this.s.spellEntities||[]).filter(e=>!e.done);for(const u of this.enemies){const siren=this.rooms.find(r=>r.siren&&this.active(r));if(siren&&rulesDist(u,siren)<.3)siren.siren=false;}if(this.s.magicFlags?.rearmCombat)for(const r of this.rooms)if(r.trap)r.trap.armed=true;}return previous.update.call(this,dt);}
 });
}
function validRulesInput(i,s){
 if(i?.kind!=='rules'||!['spell','copy-site','temple','shield','invention','foresight','trophy','summon','scout','scout-companion','witch','chaos','tomb','minecart','breed','expedition-squad','invention-site','peek','war-reward','artifact-luck','artifact-revive','artifact-purpose','artifact-create','artifact-banish'].includes(i.action))return false;
 if(i.action==='expedition-squad')return Number.isInteger(i.index)&&i.index>=0&&i.index<13&&Array.isArray(i.selected)&&i.selected.length<=10&&i.selected.every(id=>Number.isInteger(id));
 if(['scout','scout-companion','witch'].includes(i.action))return Number.isInteger(i.unit)&&s.units.some(u=>u.id===i.unit);
 if(!Number.isInteger(i.x)||!Number.isInteger(i.y)||Math.abs(i.x)>20||i.y< -6||i.y>30)return false;
 if(i.action!=='foresight'&&!s.rooms[`${i.x},${i.y}`])return false;
 if(i.action==='spell')return typeof i.good==='boolean'&&Number.isInteger(i.id)&&i.id>=1&&i.id<=(i.good?26:13);
 if(i.action==='artifact-revive')return Array.isArray(i.units)&&i.units.length<=3000&&i.units.every(u=>(Object.prototype.hasOwnProperty.call(UNITS,u.type)||Object.prototype.hasOwnProperty.call(ENEMIES,u.type))&&Number.isInteger(u.id)&&Number.isFinite(u.power)&&u.power>0&&Number.isFinite(u.maxHp)&&u.maxHp>0&&!!s.rooms[u.home]);
 if(i.action==='invention')return Number.isInteger(i.id)&&i.id>=1&&i.id<=13;
 if(i.action==='copy-site'||i.action==='invention-site')return Object.prototype.hasOwnProperty.call(ROOMS,i.type)&&ROOMS[i.type].r!==undefined;
 if(i.action==='foresight')return Array.isArray(i.cards)&&i.cards.length===2&&i.cards.every(c=>['♥','♦','♣','♠','★'].includes(c.suit)&&Number.isInteger(c.rank)&&c.rank>=0&&c.rank<=13);
 return true;
}
function validateAdvanced(s){if(s.teleports!==undefined)for(const [a,b]of Object.entries(s.teleports))if(!s.rooms[a]||!s.rooms[b]||s.teleports[b]!==a)throw Error('Teleporte inválido.');if(s.discoveredInventions!==undefined&&(!Array.isArray(s.discoveredInventions)||s.discoveredInventions.some(n=>!Number.isInteger(n)||n<1||n>13)))throw Error('Invenção inválida.');}


// encounters.js
const ADVENTURERS=[['Bêbado',5],['Caçador de Bruxas',15],['Sabotador',5],['Batedor',5],['Escudeiro',100],['Druida',5],['Bárbaro',20],['Médico de Campo',10],['Bardo',5],['Bruxa',5],['Bobo da Corte',1],['Herói Mercenário',60],['Matador de Monstros',25]];
const ADVENTURER_POWERS=['Não luta e permanece na taverna durante o combate.','Ataca a duas salas; o primeiro golpe atordoa por 4 segundos.','Instala uma armadilha de dano nível 2 temporária por combate.','Escolhe sua posição inicial e pode levar outro aliado.','Barreira móvel de 100 STR; não ataca nem bloqueia projéteis ou líquidos.','Domestica uma criatura grande sem combate e passa a morar com ela.','Avança quatro salas em linha reta, atingindo aliados e inimigos.','Revive aliados derrotados na mesma sala ao fim do combate.','Tenta converter seu primeiro adversário; se falhar, é derrotado.','Uma magia por combate: imobiliza ou duplica a força do alvo escolhido.','Atrai a atenção dos inimigos.','Ataca a duas salas; exige 5♦ por turno ou torna-se hostil.','Reduz em uma a quantidade de características de monstruosidade, até o mínimo de uma.'];
const encounterKey=r=>`${r.x},${r.y}`;
function installEncounters(Game){const before={};for(const name of ['addUnit','beginCombat','endCombat','income','rulesChoices','resolveEffect','resolveRemnant','action','unitData','spawnMonstrosity'])before[name]=Game.prototype[name];Object.assign(Game.prototype,{
  addUnit(type,x,y,loyal,team='ally',power=null){const u=before.addUnit.call(this,type,x,y,loyal,team,power);if(type==='hero'&&!power&&team==='ally'){const rank=this.tableCard().rank;u.heroClass=rank;u.enemyName=ADVENTURERS[rank-1][0];u.heroAbility=ADVENTURER_POWERS[rank-1];u.power=ADVENTURERS[rank-1][1]*(this.has('brewery')?2:1);u.hp=u.maxHp=u.power*8;if([2,12].includes(rank))u.range=2.05;if([1,5].includes(rank))u.nonAttacking=true;this.effect('Aventureiro atraído: '+u.enemyName,`${Math.round(u.power)} STR. ${u.heroAbility}`,'good');}return u;},
  unitData(u){const data=before.unitData.call(this,u);return u.heroClass===1?{...data,speed:0,range:0}:data;},
  enemyGoal(u){if(u.goldDragon){const treasure=this.rooms.filter(r=>r.type==='treasury').sort((a,b)=>b.y-a.y)[0];if(treasure)return treasure;}const jester=this.allies.filter(v=>v.heroClass===11).sort((a,b)=>Math.abs(a.x-u.x)+Math.abs(a.y-u.y)-Math.abs(b.x-u.x)-Math.abs(b.y-u.y))[0];const song=this.rooms.find(r=>r.siren&&this.active(r));return jester?this.anchor(jester):song||this.rescueGoal(u)||this.target;},
  onAttack(u,target){if(u.heroClass===2&&!u.skillUsed){target.stun=Math.max(target.stun,4);u.skillUsed=true;}if(u.heroClass===9&&!u.skillUsed){u.skillUsed=true;if(this.roll(4)===4){target.team='ally';target.loyal=true;target.home=u.home;}else this.killInstant(u);}if(u.heroClass===7&&!u.skillUsed){u.skillUsed=true;const dx=Math.sign(target.x-u.x),dy=dx?0:Math.sign(target.y-u.y);let r=this.room(Math.round(u.x),Math.round(u.y));for(let i=0;i<4&&r;i++){for(const v of this.s.units.filter(v=>v!==u&&Math.abs(v.x-r.x)+Math.abs(v.y-r.y)<.5))this.damage(v,u.power*8);const next=this.room(r.x+dx,r.y+dy);if(!this.linked(r,next))break;r=next;u.x=r.x;u.y=r.y;}}},
  beginCombat(){const fresh=!this.s.combat;before.beginCombat.call(this);if(!fresh)return;for(const u of this.allies){u.skillUsed=false;if(u.heroClass===3){const r=this.s.rooms[u.home];if(!r.trap)r.trap={kind:'damage',level:2,armed:true,temporary:true};}if(u.heroClass===4)this.ruleEvent('scout','Posição do batedor','Escolha uma sala onde o batedor começa a batalha.',{unit:u.id});if(u.heroClass===10)this.ruleEvent('witch','Magia da bruxa','Escolha uma unidade para receber a magia: pode imobilizar ou dobrar sua força.',{unit:u.id});}},
  endCombat(){const doctors=this.allies.filter(u=>u.heroClass===8),recovered=this.dead.filter(u=>doctors.some(d=>Math.abs(u.x-d.x)<.5&&Math.abs(u.y-d.y)<.5));for(const u of recovered){u.hp=u.maxHp;this.s.units.push(u);}this.dead=this.dead.filter(u=>!recovered.includes(u));before.endCombat.call(this);for(const r of this.rooms)if(r.trap?.temporary)r.trap=null;for(const u of this.allies)if(u.witchBasePower){u.power=u.witchBasePower;u.maxHp=u.hp=u.power*8;delete u.witchBasePower;delete u.fixed;}for(const u of this.allies)if(u.witchFixed){u.fixed=u.witchWasFixed;delete u.witchWasFixed;delete u.witchFixed;}},
  income(){before.income.call(this);for(const u of this.allies.filter(u=>u.heroClass===12)){if(this.s.gold>=5)this.s.gold-=5;else{u.team='enemy';this.effect('Mercenário não pago','O herói mercenário exigia 5♦. Agora tornou-se hostil.','bad');this.beginCombat();}}},
  spawnMonstrosity(r,power=100,traits=3){const slayers=this.allies.filter(u=>u.heroClass===13).length;return before.spawnMonstrosity.call(this,r,power,Math.max(1,traits-slayers));},
  rulesChoices(card){const i=card.input;if(i.action==='scout-companion')return [{value:'alone',label:'Ir sozinho'},...this.defenders.filter(u=>u.id!==i.unit).map(u=>({value:String(u.id),label:(u.enemyName||UNITS[u.type].name)+' · '+Math.round(u.power)+' STR'}))];if(i.action==='scout')return this.rooms.filter(r=>this.passable(r)).map(r=>({value:encounterKey(r),label:ROOMS[r.type].name+' '+encounterKey(r)}));if(['witch','chaos','tomb'].includes(i.action))return this.allies.filter(u=>i.action!=='chaos'||u.type==='cleric').map(u=>({value:String(u.id),label:`${u.enemyName||UNITS[u.type]?.name||u.type} · ${Math.round(u.power)} STR`}));return before.rulesChoices.call(this,card);},
  resolveEffect(id,selection){const c=this.s.effectCards?.[0],i=c?.input;if(c?.id!==id||!['scout','scout-companion','witch','chaos','tomb'].includes(i?.action))return before.resolveEffect.call(this,id,selection);if(!this.rulesChoices(c).some(o=>o.value===String(selection)))return{ok:false,reason:'Escolha uma opção válida.'};const unit=this.allies.find(u=>String(u.id)===String(selection)),r=this.room(i.x,i.y)||this.target;if(i.action==='scout'){const u=this.allies.find(u=>u.id===i.unit),dest=this.s.rooms[selection];if(u&&dest){u.x=dest.x;u.y=dest.y;u.moveTarget=null;if(this.allies.some(v=>v.id!==u.id))this.ruleEvent('scout-companion','Companheiro do Batedor','Escolha um aliado para acompanhar o Batedor, ou deixe-o ir sozinho.',{unit:u.id,x:dest.x,y:dest.y});}}if(i.action==='scout-companion'&&unit){unit.x=i.x;unit.y=i.y;unit.moveTarget=null;}if(i.action==='witch'){if(this.roll(2)===1){unit.witchWasFixed=!!unit.fixed;unit.fixed=true;unit.witchFixed=true;}else{unit.witchBasePower=unit.power;this.addPower(unit,unit.power);}}if(i.action==='chaos'){this.removeSacrifice(unit);let res=0,gold=0,found=false;for(let n=0;n<108;n++){const card=this.draw();if(card.suit==='♥'){res+=card.rank;found=true;}if(card.suit==='♦'){gold+=card.rank;found=true;}if(found&&['♣','♠'].includes(card.suit)){if(card.suit==='♠'){const loss=this.allies[0];if(loss)this.removeSacrifice(loss);}break;}}this.gain(res,gold);r.type='cave';this.effect('Oferenda caótica',`O altar concedeu até ${res}♥ e ${gold}♦. Seu poder foi consumido.`,'neutral');}if(i.action==='tomb'){this.removeSacrifice(unit);r.offering=(r.offering||0)+unit.power;if(r.offering>=50){this.resolveJoker({joker:'red'},r);r.tombOpened=true;}else this.ruleEvent('tomb','Oferenda à tumba',`Faltam ${50-r.offering} STR em sacrifícios.`,{x:r.x,y:r.y});}this.s.effectCards.shift();return{ok:true};},
  action(action,x,y,arg){const r=this.room(x,y);if(action==='tavernFestival'){if(!r||r.type!=='tavern'||!this.active(r)||this.s.combat||this.s.status!=='playing'||this.s.gold<10||this.allies.some(u=>u.heroClass&&u.home===encounterKey(r)))return{ok:false,reason:'Exige uma taverna ativa sem aventureiro, 10♦ e paz.'};this.s.gold-=10;this.addUnit('hero',x,y,true);return{ok:true};}if(action==='magic'&&r?.type==='chaos'){this.ruleEvent('chaos','Altar Caótico','Escolha um clérigo para sacrificar e ativar o altar.',{x,y});return{ok:true};}if(action==='tomb'&&r?.type==='tomb'&&!r.tombOpened){if(this.allies.some(u=>u.type==='trapper')){r.tombOpened=true;this.resolveJoker({joker:'red'},r);return{ok:true};}this.ruleEvent('tomb','Tumba dos Horrores','Ofereça 50 STR em unidades ou traga um armadilheiro para desarmar.',{x,y});return{ok:true};}if(action==='druid'&&r&&this.territorialGuard(r)){const druid=this.allies.find(u=>u.heroClass===6);if(!druid)return{ok:false,reason:'Exige Druida.'};const guard=this.territorialGuard(r);guard.team='ally';guard.loyal=true;delete guard.territory;druid.home=guard.home;const lair=this.s.rooms[guard.home];druid.x=lair.x;druid.y=lair.y;druid.moveTarget=null;return{ok:true};}return before.action.call(this,action,x,y,arg);},
  libraryDiscovery(x,y){const n=this.roll(4);if(n===1)this.magic(true);if(n===2)this.magic(false);if(n===3)this.information(this.room(x,y)||{x,y,type:'ancientlibrary'});if(n===4)this.ruleEvent('copy-site','Projeto antigo','O projeto permite recuperar uma construção gratuita.',{type:'library',x,y});}
});}


// worlds.js
const WORLD_FIELDS=['occupations','rooms','passages','secretPassages','passageTraps','barricades','units','workers','cellBars','teleports','rivalDungeons','maxDepth','voidDefeated','planeWon','capturePool','hiddenMasterminds','fallenTwins','spellEntities','corpses','graveyardFallen'];
const worldKey=r=>`${r.x},${r.y}`;
function installWorlds(Game){const prior={};for(const n of ['action','rulesChoices','resolveEffect','endCombat','morale','income','immune','spawnEnemies','capacities','addUnit','lose','damage','addRoom','update','unitData','damageRoom'])prior[n]=Game.prototype[n];Object.assign(Game.prototype,{
  capacities(){const local=prior.capacities.call(this);if(this.s.activePlane!=null&&this.s.planarWalletCaps)return{resources:this.s.planarWalletCaps.resources+local.resources-50,gold:this.s.planarWalletCaps.gold+local.gold-50};return local;},
  unitData(u){const d=prior.unitData.call(this,u);return this.s.activePlane===9&&!u.flying?{...d,speed:d.speed*.5}:d;},
  addRoom(x,y,type){const r=prior.addRoom.call(this,x,y,type);if(y>0&&[1,2].includes(this.s.activePlane))r.fluid=this.s.activePlane===1?'water':'lava';return r;},
  addUnit(type,x,y,loyal,team='ally',power=null){const u=prior.addUnit.call(this,type,x,y,loyal,team,power);if((this.s.activePlane===0||this.s.activePlane===9)&&team==='enemy'||this.s.artifacts.includes('speed')&&team==='ally')u.flying=true;if(team==='ally')u.originWorld=this.s.activePlane==null?'base':String(this.s.activePlane);return u;},
  worldSnapshot(){const data={};for(const field of WORLD_FIELDS)data[field]=this.s[field]??(['workers','units','rivalDungeons','capturePool','hiddenMasterminds','fallenTwins','spellEntities','corpses','graveyardFallen'].includes(field)?[]:['maxDepth'].includes(field)?0:['planeWon','voidDefeated'].includes(field)?false:{});return JSON.parse(JSON.stringify(data));},
  enterPlane(index,ids){if(this.s.combat||this.s.activePlane!=null||!PLANES[index]||this.s.gold<20)return{ok:false,reason:'A viagem exige 20♦ e paz na fortaleza.'};if(this.allies.some(u=>u.type==='rat'&&ids.includes(u.id)))return{ok:false,reason:'Ratos permanecem nos esgotos e não participam de expedições.'};const selected=this.defenders.filter(u=>ids.includes(u.id)).slice(0,10);if(!selected.length)return{ok:false,reason:'Escolha pelo menos uma unidade.'};this.s.gold-=20;this.s.planarWalletCaps=this.capacities();this.s.worldMaps??={};const base=this.worldSnapshot();base.units=base.units.filter(u=>!ids.includes(u.id));this.s.worldMaps.base=base;const template=this.s.worldMaps[index]||new Game({seed:this.s.seed+index*97+1}).worldSnapshot();if(!this.s.worldMaps[index])template.units=[];for(const field of WORLD_FIELDS)this.s[field]=template[field];this.s.activePlane=index;this.s.expedition=null;this.s.voidDefeated=false;for(const u of selected){u.returnHome=u.home;u.home='0,0';u.x=0;u.y=0;u.moveTarget=null;u.originWorld??='base';this.s.units.push(u);}this._routeCache=null;this._tacticsDirty=true;if(index===0){const count=this.roll(4);for(let i=0;i<count;i++){const angel=this.addUnit('fairy',0,0,true,'enemy',20);angel.enemyName='Anjo da Ordem';angel.flying=true;}this.beginCombat();}if(index===3){this.spawnMonstrosity(this.target,100,3);if(this.enemies.length)this.beginCombat();}this.effect('Portal atravessado',`A expedição entrou em ${PLANES[index].name}. Explore até o guardião na profundidade 6; o Portal de Retorno permanece no início.`,'neutral');return{ok:true};},
  leavePlane(){if(this.s.activePlane==null||this.s.combat)return{ok:false,reason:'Retorno indisponível em combate.'};const index=this.s.activePlane,party=this.defenders.filter(u=>!(index===7&&u.originWorld===String(index)));this.s.worldMaps[index]=this.worldSnapshot();this.s.worldMaps[index].units=this.s.worldMaps[index].units.filter(u=>!party.some(v=>v.id===u.id));const base=this.s.worldMaps.base;for(const field of WORLD_FIELDS)this.s[field]=base[field];delete this.s.activePlane;delete this.s.planarWalletCaps;for(const u of party){const home=this.s.rooms[u.returnHome]||this.target;u.home=worldKey(home);u.x=home.x;u.y=home.y;u.moveTarget=null;delete u.returnHome;if(!this.s.units.some(v=>v.id===u.id))this.s.units.push(u);}this._routeCache=null;this.grantPlanarRewards(index);this.effect('Retorno à fortaleza','A expedição voltou pelo portal. Mapas, habitantes e inimigos do plano foram preservados.','neutral');return{ok:true};},
  grantPlanarRewards(index){const effect=PLANES[index].effect;if(!this.s.artifacts.includes(effect))return;this.s.receivedPlanarRewards??=[];if(this.s.receivedPlanarRewards.includes(index))return;this.s.receivedPlanarRewards.push(index);if(effect==='forest'){for(const r of this.rooms.filter(r=>r.type==='cave'&&!r.builtPartOf)){r.type='forest';delete r.longCave;delete r.enchanted;}}if(effect==='morale')this.placePlanarReward('temple',2,'morale','Templo das Fadas');if(effect==='berserker')this.placePlanarReward('meadhall',2,'berserker','Salão de Hidromel');if(effect==='honey')for(let i=0;i<5;i++){const r=this.placePlanarReward('warehouse',1,'honey','Apiário');if(r){const u=this.addUnit('insectqueen',r.x,r.y,true,'ally',20+Math.max(0,r.y)*5);u.fixed=true;}}},
  placePlanarReward(type,count,tag,name){let root=this.rooms.find(r=>r.type==='cave'&&!r.builtPartOf&&this.active(r));if(!root){const d=this.directions().find(d=>d.kind==='explore'&&d.y>=0);if(d){root=this.addRoom(d.x,d.y,'cave');this.connectRooms(this.room(d.from.x,d.from.y),root);}}if(!root){this.s.pendingPlanarRewards??=[];this.s.pendingPlanarRewards.push({type,count,tag,name});return null;}const plan=planFormation(this,root,count,{build:true,axis:'horizontal'});if(plan.length<count){this.s.pendingPlanarRewards??=[];this.s.pendingPlanarRewards.push({type,count,tag,name});return null;}root.type=type;root.playerBuilt=true;root.planarReward=tag;root.displayName=name;if(type==='temple')root.dedication='protector';delete root.longCave;delete root.enchanted;if(count>1){root.footprint=plan.map(worldKey);for(const p of plan.slice(1)){const part=this.room(p.x,p.y)||this.addRoom(p.x,p.y,'cave');part.builtPartOf=worldKey(root);part.playerBuilt=true;this.connectRooms(root,part);}}return root;},
  action(action,x,y,arg){const selected=this.room(x,y);if(action==='repair'&&selected?.planarReward==='honey'){if(!selected.damaged||this.s.combat||this.s.gold<50||this.roomHazards(selected).length)return{ok:false,reason:'Reparar Apiário exige 50♦ e a sala drenada.'};this.s.gold-=50;selected.damaged=false;return{ok:true};}if(action==='expedition'&&this.room(x,y)?.type==='stabilizer'){if(!this.active(this.room(x,y)))return{ok:false,reason:'O portal precisa estar intacto e conectado.'};this.s.basePortal={x,y};if(this.s.combat||this.s.activePlane!=null||this.s.gold<20)return{ok:false,reason:'Exige 20♦ e uma expedição por vez.'};this.ruleEvent('expedition-squad','Preparar expedição','Escolha até dez unidades. A viagem só cobra 20♦ ao atravessar.',{index:arg,x,y,selected:[]});return{ok:true};}if(action==='returnPlane')return this.leavePlane();return prior.action.call(this,action,x,y,arg);},
  rulesChoices(card){const i=card.input;if(i.action==='expedition-squad'){const choices=this.defenders.map(u=>({value:String(u.id),label:`${i.selected.includes(u.id)?'✓ ':''}${u.enemyName||u.type} · ${Math.round(u.power)} STR`}));if(i.selected.length)choices.push({value:'go',label:`Atravessar com ${i.selected.length} unidade(s) · 20♦`});choices.push({value:'cancel',label:'Cancelar'});return choices;}return prior.rulesChoices.call(this,card);},
  resolveEffect(id,selection){const c=this.s.effectCards?.[0],i=c?.input;if(c?.id!==id||i?.action!=='expedition-squad')return prior.resolveEffect.call(this,id,selection);if(selection==='cancel'){this.s.effectCards.shift();return{ok:true}}if(selection==='go'){const result=this.enterPlane(i.index,i.selected);if(result.ok)this.s.effectCards.shift();return result;}const unit=this.defenders.find(u=>String(u.id)===String(selection));if(!unit)return{ok:false,reason:'Selecione uma unidade válida.'};if(i.selected.includes(unit.id))i.selected=i.selected.filter(id=>id!==unit.id);else if(i.selected.length<10)i.selected.push(unit.id);else return{ok:false,reason:'Máximo de dez unidades.'};return{ok:true,pending:true};},
  lose(){if(this.s.activePlane==null)return prior.lose.call(this);const invaders=this.enemies.map(u=>({...u}));this.s.units=this.s.units.filter(u=>u.team!=='enemy');for(const w of this.s.workers||[]){const home=this.s.rooms[w.home];if(home){if(!w.alive){w.variant=(w.variant+1)%3;w.alive=true;w.x=home.x;w.y=home.y;w.moveTarget=null;}}}this.s.combat=false;this.leavePlane();const portal=this.room(this.s.basePortal?.x,this.s.basePortal?.y)||this.target;for(const enemy of invaders){const u=this.addUnit(enemy.type,portal.x,portal.y,true,'enemy',enemy.power);u.size=enemy.size;u.range=enemy.range;u.enemyName=enemy.enemyName;u.cosmic=enemy.cosmic;u.monstrosity=enemy.monstrosity;u.traits=enemy.traits;}this.effect('Invasão pelo Portal de Retorno','Os inimigos atravessaram para o mundo base. Agora sua fortaleza precisa detê-los.','bad');this.beginCombat();return true;},
  damage(u,amount,options){if(u.cosmic)return;const alive=u.hp>0;if(this.s.activePlane===8&&u.team==='enemy'&&options?.attacker){const attacker=this.s.units.find(v=>v.id===options.attacker);if(attacker&&!['mage','cleric'].includes(attacker.type))amount*=.5;}if(this.s.activePlane===6&&u.team==='enemy'&&this.s.units.some(v=>v.id===options?.attacker&&['mage','cleric'].includes(v.type)))amount=0;prior.damage.call(this,u,amount,options);if(this.s.activePlane===9&&u.team==='ally'&&u.hp>0&&u.hp<u.maxHp*.5)this.killInstant(u);if(alive&&u.hp<=0&&u.team==='enemy'&&this.s.activePlane===2){const room=this.room(Math.round(u.x),Math.round(u.y));if(room&&!room.captured){for(const r of [room,...this.neighbors(room)])this.damageRoom(r);this.effect('Explosão elemental','O inimigo de fogo explodiu e danificou construções próximas.','bad');}}},
  endCombat(){prior.endCombat.call(this);const index=this.s.activePlane;if(index!=null&&this.s.voidDefeated&&!this.s.planeWon){this.s.planeWon=true;const p=PLANES[index];if(!this.s.artifacts.includes(p.effect))this.s.artifacts.push(p.effect);if(p.effect==='speed')for(const u of this.allies)u.flying=true;this.effect('Plano conquistado',`${p.artifact}: ${p.desc} Retorne à fortaleza para instalar recompensas físicas.`,'good');}},
  morale(){let value=prior.morale.call(this);if(this.s.activePlane===7)value=Math.max(value,100);if(this.s.artifacts.includes('morale')&&this.s.receivedPlanarRewards?.includes(7)&&!this.rooms.some(r=>r.planarReward==='morale'&&this.active(r)))value-=20;if(this.s.artifacts.includes('museum'))value+=this.rooms.filter(r=>r.type==='museum'&&this.active(r)).reduce((n,r)=>n+(r.trophySpecies?.length||0),0);return value;},
  immune(u,h){return !!u.cosmic||u.flying&&['water','lava','crater'].includes(h)||this.s.activePlane===1&&u.team==='enemy'&&h==='water'||this.s.activePlane===2&&u.team==='enemy'&&['lava','crater'].includes(h)||this.s.activePlane===6&&u.team==='enemy'||prior.immune.call(this,u,h);},
  spawnEnemies(r,total,type){const i=this.s.activePlane;if(i===3&&type!=='guardian'){if(this.roll(4)===1)this.spawnMonstrosity(r,100,3);return;}if(i===4)total+=10;if(i===11&&r.foreignCell)total*=1+Math.max(0,r.y);if(type!=='guardian'){if(i===2)type='elemental';if(i===6)type='automaton';if(i===9)type='insect';if(i===10)type='cavewolf';}if(i===8)total*=1.5;const before=this.s.units.length;const result=prior.spawnEnemies.call(this,r,total,type);if(i===5&&type==='guardian')for(const u of this.s.units.slice(before)){u.cosmic=true;u.enemyName='Entidade do Plano das Estrelas';u.monstrosity=true;u.power=1000000;u.hp=u.maxHp=8000000;}return result;},
  releaseCosmic(r){const record=r.cosmicPrison;if(!record)return;delete r.cosmicPrison;const u=this.addUnit('guardian',r.x,r.y,true,'enemy',1000000);u.cosmic=true;u.monstrosity=true;u.enemyName=record.enemyName;this.effect('Entidade libertada','A prisão do templo foi rompida. A entidade voltou ao plano.','bad');this.beginCombat();},
  damageRoom(r){prior.damageRoom.call(this,r);if(r?.damaged&&r.cosmicPrison)this.releaseCosmic(r);},
  update(dt){for(const r of this.rooms.filter(r=>r.cosmicPrison))if(!this.allies.some(u=>u.type==='cleric'&&u.home===worldKey(r)))this.releaseCosmic(r);for(const u of this.enemies.filter(u=>u.cosmic)){const at=this.room(Math.round(u.x),Math.round(u.y)),r=at?.builtPartOf?this.s.rooms[at.builtPartOf]:at;if(r?.type==='temple'&&r.dedication==='pure'&&!r.storedCurse&&!r.cosmicPrison&&this.active(r)&&this.allies.some(v=>v.type==='cleric'&&v.home===worldKey(r))){r.cosmicPrison={enemyName:u.enemyName};this.s.units=this.s.units.filter(v=>v!==u);this.s.voidDefeated=true;this.effect('Entidade aprisionada','O Templo da Pureza selou a entidade. A prisão exige um clérigo e uma sala intacta.','good');}}if(this.s.combat&&!this.s.paused&&!(this.presentationEnabled&&this.s.effectCards?.length)){for(const u of this.s.units.filter(u=>u.flying&&u.hp>0)){let goal=u.team==='enemy'?this.enemyGoal(u):this.enemies.sort((a,b)=>Math.abs(a.x-u.x)+Math.abs(a.y-u.y)-Math.abs(b.x-u.x)-Math.abs(b.y-u.y))[0];if(!goal)continue;const dist=Math.abs(goal.x-u.x)+Math.abs(goal.y-u.y);if(dist>.3){const speed=(this.unitData(u).speed||.65)*Math.min(.1,dt),dx=goal.x-u.x,dy=goal.y-u.y;if(Math.abs(dx)>.01)u.x+=Math.sign(dx)*Math.min(Math.abs(dx),speed);else u.y+=Math.sign(dy)*Math.min(Math.abs(dy),speed);u.moveTarget=null;u.walk+=speed*12;}}}for(const r of this.rooms)if(this.s.activePlane===1&&r.y>0&&!['bridge','drawbridge','pump'].includes(r.type))r.fluid='water';else if(this.s.activePlane===2&&r.y>0&&!['bridge','drawbridge','pump'].includes(r.type)){r.fluid='lava';if(!this.s.artifacts.includes('lava'))this.damageRoom(r);}return prior.update.call(this,dt);},
  income(){prior.income.call(this);if(this.s.activePlane===10)this.s.resources=Math.max(0,this.s.resources-1);}
});}
function validateWorlds(s){if(s.activePlane!==undefined&&(!Number.isInteger(s.activePlane)||s.activePlane<0||s.activePlane>12))throw Error('Plano inválido.');if(s.worldMaps!==undefined){if(!s.worldMaps||typeof s.worldMaps!=='object'||Array.isArray(s.worldMaps)||Object.keys(s.worldMaps).length>14)throw Error('Mapas planares inválidos.');for(const world of Object.values(s.worldMaps)){if(!world.rooms||!world.rooms['0,0']||Object.keys(world.rooms).length>2000||!Array.isArray(world.units)||world.units.length>3000||!world.passages)throw Error('Mapa planar inválido.');for(const u of world.units)if((!Object.prototype.hasOwnProperty.call(UNITS,u.type)&&!Object.prototype.hasOwnProperty.call(ENEMIES,u.type))||!Number.isInteger(u.id)||!world.rooms[u.home]||!Number.isFinite(u.power)||u.power<=0||!Number.isFinite(u.hp)||!Number.isFinite(u.x)||!Number.isFinite(u.y))throw Error('Habitante planar inválido.');for(const [edge,value]of Object.entries(world.passages)){const ids=edge.split('|');if(value!==true||ids.length!==2||!world.rooms[ids[0]]||!world.rooms[ids[1]])throw Error('Passagem planar inválida.');const [a,b]=ids.map(id=>world.rooms[id]);if(Math.abs(a.x-b.x)+Math.abs(a.y-b.y)!==1)throw Error('Passagem planar inválida.');}for(const [id,r]of Object.entries(world.rooms))if(!Object.prototype.hasOwnProperty.call(ROOMS,r.type)||id!==`${r.x},${r.y}`||!Number.isInteger(r.x)||!Number.isInteger(r.y)||Math.abs(r.x)>100||Math.abs(r.y)>100)throw Error('Sala planar inválida.');}}}


// wyrd.js
const WYRD=[['Caverna de Ossos','cave'],['Caverna de Gosmas','nest'],['Caverna de Carne','cave'],['Portais Gêmeos','cave'],['Rio de Nozes','water'],['Cogumelo Divino','mushrooms'],['Cristais do Tempo','crystal'],['Fósseis Vivos','largelair'],['Vila das Toupeiras','city'],['Anão Cristalizado','crystal'],['Sábio das Profundezas','ancientlibrary'],['Caverna Assobiante','cave'],['Reino das Coisas Perdidas','ruins']];
const wyrdKey=r=>`${r.x},${r.y}`;
function installWyrd(Game){const old={};for(const n of ['income','moveUnit','neighbors','action','rulesChoices','resolveEffect','damage','build'])old[n]=Game.prototype[n];Object.assign(Game.prototype,{
  prepareWyrd(r,id){r.wyrdId=id;r.displayName=WYRD[id-1][0];r.specialDescription=['Ossos sustentam esta área; construções recebem defesa especial.','Gosmas deixam resíduos caros de remover.','Uma caverna feita de carne e órgãos.','Um par de portais conecta pontos distantes.','Um rio de nozes percorre a caverna.','O cogumelo cresce um espaço por turno, infectando criaturas. Fogo e magma destroem o crescimento.','Quem atravessa pode envelhecer até virar pó.','Fósseis despertam quando existem Cristais do Tempo.','Habitantes podem ser contratados e atravessam paredes.','Escave para libertar um soldado e descobrir um artefato.','O sábio revela a próxima carta por 5♦.','Unidades próximas podem se perder e morrer; monstruosidades são imunes.','A cada turno, uma carta concede riquezas ou uma unidade.'][id-1];if([1,13].includes(id))this.expandFormation(r,id===1?this.roll(4):2);if(id===2){this.spawnEnemies(r,32,'insect');for(const u of this.enemies.filter(u=>u.home===wyrdKey(r)))u.slime=true;}if(id===4)this.castMagic(true,1);if(id===5)this.expandFormation(r,5,{axis:'horizontal'});if(id===6)r.godFungus=wyrdKey(r);if(id===7)for(const fossil of this.rooms.filter(p=>p.wyrdId===8&&!p.awakened)){fossil.awakened=true;this.spawnEnemies(fossil,100,'troll');}if(id===8&&this.rooms.some(p=>p.wyrdId===7)){r.awakened=true;this.spawnEnemies(r,100,'troll');}if(id===2||r.awakened)this.beginCombat();},
  income(){old.income.call(this);const growing=[];for(const r of this.rooms){if(r.godFungus){if(['lava','crater'].some(h=>this.roomHazards(r).includes(h))){delete r.godFungus;continue;}for(const n of this.neighbors(r))if(!n.godFungus)growing.push({r:n,id:r.godFungus});}if(r.wyrdId===13){const card=this.tableCard();if(card.rank<=10){card.bonus=this.layerReward(card,card.rank,r)-card.rank;const before=this.s.gold;this.gain(0,this.layerReward(card,card.rank,r));const event=this.events.at(-1);if(this.s.gold>before&&event?.type==='resource-gain')Object.assign(event,{source:wyrdKey(r),sourceType:'lost',x:r.x,y:r.y,card});else this.events.push({type:'producer-trigger',source:wyrdKey(r),sourceType:'lost',x:r.x,y:r.y,card});}else this.addUnit(card.rank===11?'soldier':card.rank===12?'golem':'siege',r.x,r.y,true);}}for(const {r,id}of growing)r.godFungus=id;for(const u of this.allies){const r=this.room(Math.round(u.x),Math.round(u.y));if(r?.godFungus&&!u.fungusInfected){u.fungusInfected=true;this.addPower(u,5);u.team='enemy';this.effect('Infecção do Cogumelo Divino','Uma criatura infectada ganhou 5 STR e tornou-se hostil.','bad');}}if(this.enemies.length)this.beginCombat();},
  moveUnit(u,next,dt){const previous=this.room(Math.round(u.x),Math.round(u.y));old.moveUnit.call(this,u,next,dt);if(Math.abs(u.x-next.x)+Math.abs(u.y-next.y)>.1||previous===next)return;if(next.wyrdId===7&&this.roll(2)===2)this.killInstant(u);if(!u.monstrosity){const whistle=this.rooms.some(r=>r.wyrdId===12&&Math.abs(r.x-next.x)+Math.abs(r.y-next.y)<=2);if(whistle&&this.roll(4)!==4)this.killInstant(u);}},
  neighbors(r,team='ally',unit=null){const list=old.neighbors.call(this,r,team,unit);if(unit?.wallTravel)for(const [dx,dy]of DIRS){const n=this.room(r.x+dx,r.y+dy);if(n&&this.passable(n,team,unit)&&!list.includes(n))list.push(n);}return list;},
  damage(u,amount,options){const alive=u.hp>0;old.damage.call(this,u,amount,options);if(alive&&u.hp<=0&&u.slime){const r=this.room(Math.round(u.x),Math.round(u.y));if(r){r.fluid='slime';r.contaminant='slime';this.effect('Gosma espalhada','A criatura cobriu a sala de gosma. Removê-la custa 20♦.','neutral');}}},
  build(type,x,y,placement){const bone=this.room(x,y)?.wyrdId===1,result=old.build.call(this,type,x,y,placement);if(result.ok&&!result.pending&&bone){const r=this.room(x,y);for(const n of this.neighbors(r)){const edge=this.passageKey(r,n);if(!this.s.barricades[edge])this.s.barricades[edge]={kind:'defensive',hp:2000,level:5,bone:true};}}return result;},
  action(action,x,y,arg){const r=this.room(x,y);if(action==='drain'&&r?.fluid==='slime'){if(this.s.gold<20)return{ok:false,reason:'Drenar gosma exige 20♦.'};const result=old.action.call(this,action,x,y,arg);if(result.ok)this.s.gold-=15;return result;}if(action==='mole'&&r?.wyrdId===9){if(this.s.gold<10)return{ok:false,reason:'Exige 10♦.'};this.s.gold-=10;const u=this.addUnit('beast',x,y,false,'ally',7);u.wallTravel=true;u.enemyName='Homem-toupeira';u.mutiny=12;return{ok:true};}if(action==='excavate'&&r?.wyrdId===10&&!r.excavated){r.excavated=true;this.resolveJoker({joker:'red'},r);this.addUnit('soldier',x,y,true);return{ok:true};}if(action==='peek'&&r?.wyrdId===11){if(this.s.gold<5||r.peekTurn===this.s.turn)return{ok:false,reason:'Exige 5♦; uma vez por turno.'};this.s.gold-=5;r.peekTurn=this.s.turn;const card=this.s.deck.at(-1);this.ruleEvent('peek','Conselho das profundezas',`Próxima carta: ${card?.suit} ${card?.rank||'Coringa'}.`,{x,y});return{ok:true};}return old.action.call(this,action,x,y,arg);},
  rulesChoices(card){if(card.input.action==='peek')return[{value:'keep',label:'Manter carta'},...(this.s.deck.at(-1)?.rank?[{value:'discard',label:'Descartar e aceitar a próxima'}]:[])];return old.rulesChoices.call(this,card);},
  resolveEffect(id,value){const c=this.s.effectCards?.[0];if(c?.id!==id||c.input?.action!=='peek')return old.resolveEffect.call(this,id,value);if(!this.rulesChoices(c).some(o=>o.value===value))return{ok:false,reason:'Coringas não podem ser descartados.'};if(value==='discard')this.s.discard.push(this.s.deck.pop());this.s.effectCards.shift();return{ok:true};}
});}


// monsters.js
const monsterKey=r=>`${r.x},${r.y}`;
function installMonsterTraits(Game){const old={};for(const n of ['spawnMonstrosity','update','damage','moveUnit','lineOfSight','draw'])old[n]=Game.prototype[n];Object.assign(Game.prototype,{
  hideMastermind(u){u.hidden=true;this.s.hiddenMasterminds??=[];this.s.hiddenMasterminds.push({...u});this.s.units=this.s.units.filter(v=>v!==u);this.effect('Estrategista desaparecido','A monstruosidade retornará quando uma carta de Rei for comprada.','bad');},
  spawnMonstrosity(r,power=100,traits=3){const u=old.spawnMonstrosity.call(this,r,power,traits);u.monsterGroup=monsterKey(r);r.displayName='Covil da Monstruosidade';this.expandEmptyCavern(r,this.bossCavernSize(u.power));if(u.traits.includes(5)){const factor=u.power/power,target=(50+Math.max(0,power-100))*factor;u.power=target;u.hp=u.maxHp=target*8;const twin=this.addUnit(u.type,r.x,r.y,true,'enemy',target);Object.assign(twin,{monstrosity:true,traits:[...u.traits],size:u.size,range:u.range,monsterGroup:u.monsterGroup,enemyName:u.enemyName});u.twinId=twin.id;twin.twinId=u.id;}if(u.traits.includes(8)){for(const room of [...this.rooms]){if(['portal','stabilizer'].includes(room.type))this.spawnEnemies(room,20,'raider');if(room.type==='sealed')this.openSealedRoom(room);if(room.type==='ancienttemple'&&!this.allies.some(v=>v.type==='cleric'&&v.home===monsterKey(room)))this.castMagic(false,this.tableCard().rank);}this.effect('Presságio','Portais, câmaras seladas e templos abandonados foram ativados.','bad');}if(u.traits.includes(13))this.hideMastermind(u);return u;},
  draw(depth=0){const c=old.draw.call(this,depth);if(c.rank===13&&this.s.hiddenMasterminds?.length){const waiting=this.s.hiddenMasterminds;this.s.hiddenMasterminds=[];for(const u of waiting){const replacement=this.tableCard().rank;u.traits=u.traits.map(n=>n===13?replacement:n);if(replacement===13)this.hideMastermind(u);else{delete u.hidden;u.hp=u.maxHp;this.s.units.push(u);this.effect('O Estrategista retornou','A monstruosidade reapareceu com um novo traço.','bad');if(this.enemies.length)this.beginCombat();}}}return c;},
  lineOfSight(a,b,melee=false){if(!melee&&b.monstrosity&&b.traits?.includes(6)&&this.s.seconds-(b.movedAt??-100)<1.1)return false;return old.lineOfSight.call(this,a,b,melee);},
  moveUnit(u,next,dt){const x=u.x,y=u.y;old.moveUnit.call(this,u,next,dt);if(u.monstrosity&&(u.x!==x||u.y!==y))u.movedAt=this.s.seconds;},
  damage(u,amount,options){const beforeHp=u.hp+u.shield,alive=u.hp>0;old.damage.call(this,u,amount,options);if(u.hp+u.shield<beforeHp)u.lastHitAt=this.s.seconds;if(alive&&u.hp<=0&&u.monstrosity){if(u.twinId&&!u.isUndead){this.s.fallenTwins??=[];this.s.fallenTwins.push({unit:{...u},at:this.s.seconds+1.1});}for(const v of this.s.units)if(v.hypnotizedBy===u.id){v.team='ally';delete v.hypnotizedBy;}}},
  update(dt){if(this.s.combat&&!this.s.paused&&!(this.presentationEnabled&&this.s.effectCards?.length)){for(const monster of [...this.enemies.filter(u=>u.monstrosity)]){const traits=monster.traits||[];if(traits.includes(2)&&monster.hp<monster.maxHp){monster.regenClock=(monster.regenClock||0)+dt;monster.regenFrozen=true;if(monster.regenClock>=1.1){if(this.s.seconds-(monster.lastHitAt??-100)>=1.1)monster.hp=Math.min(monster.maxHp,monster.hp+400);monster.regenClock=0;monster.regenFrozen=false;}}if(traits.includes(3)){monster.bloodClock=(monster.bloodClock||0)+dt;if(monster.bloodClock>=1.1){monster.bloodClock=0;const r=this.room(Math.round(monster.x),Math.round(monster.y));if(r){r.extraFluid='water';this.spreadHazards();delete r.extraFluid;}}}if(traits.includes(11)&&!this.s.units.some(v=>v.hypnotizedBy===monster.id&&v.hp>0)){const victim=this.allies.filter(v=>!['golem','siege','undead'].includes(v.type)).sort((a,b)=>Math.abs(a.x-monster.x)+Math.abs(a.y-monster.y)-Math.abs(b.x-monster.x)-Math.abs(b.y-monster.y))[0];if(victim){victim.hypnotizedBy=monster.id;victim.team='enemy';this.effect('Hipnose','Uma tropa está sob controle da monstruosidade. Derrote-a para libertar a tropa.','bad');}}if(traits.includes(12)){monster.broodClock=(monster.broodClock||0)+dt;if(monster.broodClock>=4.4&&this.s.units.length<2800){monster.broodClock=0;const at=this.room(Math.round(monster.x),Math.round(monster.y));if(at){const position=DIRS.map(([dx,dy])=>({x:at.x+dx,y:at.y+dy})).find(p=>p.y>=0&&p.y<=30&&Math.abs(p.x)<=20&&!this.room(p.x,p.y)&&!this.sealedBlock(p.x,p.y));const nest=position?this.addRoom(position.x,position.y,'hive'):at;if(position)this.connectRooms(at,nest);this.spawnEnemies(nest,10,'insect');}}}}for(const entry of this.s.fallenTwins||[]){entry.done=true;const u=entry.unit;if(this.s.units.some(v=>v.id===u.twinId&&v.hp>0)){if(!this.s.units.some(v=>v.revivedFrom===u.id))this.reviveEnemy(u,u.power,'Gêmeo reanimado');}}this.s.fallenTwins=(this.s.fallenTwins||[]).filter(e=>!e.done);}return old.update.call(this,dt);}
});}


// challenges.js
const WORLD_LAYERS=['Normal','Magma','Cemitério','Rastejantes','Linhas Arcanas','Riquezas','Masmorra','Pesadelo'];
const BLOODRUNES={nightmares:'Pesadelos',primal:'Primal',gore:'Sangue',tombstone:'Lápide',drought:'Seca',greed:'Ganância',doom:'Destino',wolf:'Lobo',war:'Guerra',shunned:'Repúdio'};
function installChallenges(Game){const old={};for(const n of ['addRoom','addUnit','recruit','recruitmentReason','damage','magic','spawnMonstrosity','beginCombat','draw','trade','income','attackPassageDoor','rulesChoices','resolveEffect','endCombat','explore','gain','update','castMagic','spawnEnemies','rulesOrigin','action','build','damageRoom','roomHazards'])old[n]=Game.prototype[n];Object.assign(Game.prototype,{
  recruitPower(type){let power=UNITS[type]?.power||1;if(this.hasRune('primal')&&type==='soldier')power+=2;if(type==='rat')power+=this.s.magicFlags?.ratStrength||0;if(this.s.discoveredInventions?.includes(10)&&['archer','siege'].includes(type))power+=type==='siege'?20:5;return power;},
  gain(r=0,g=0){if(!this.hasRune('greed'))return old.gain.call(this,r,g);const gold=this.s.gold;old.gain.call(this,r,0);this.s.gold=Math.max(0,gold+g);if(g>0)this.events.push({type:'resource-gain',resources:0,gold:g});},
  hasRune(name){return this.s.challengeOptions?.runes?.includes(name)||false;},
  layer(room){if(arguments.length){if(!room)return 0;if(Number.isInteger(room.worldLayer))return room.worldLayer;if(this._layerDiscoveryContext&&room.x===this._layerDiscoveryContext.x&&room.y===this._layerDiscoveryContext.y)return this.layerForDiscovery(room.x,room.y);return 0;}const history=this.s.layerHistory?.[this.layerWorldKey()];return history?.current??(this.s.layerHistory&&this.layerWorldKey()!=='base'?(this.hasRune('nightmares')?7:0):((this.s.challengeOptions?.layers||this.hasRune('nightmares'))?(this.s.worldLayer??(this.hasRune('nightmares')?7:0)):0));},
  migrateRoomLayers(){this.s.layerHistory??={};const id=this.layerWorldKey();this.s.layerHistory[id]??={current:this.s.layerVersion?this.layer():((this.s.challengeOptions?.layers||this.hasRune('nightmares'))?(this.s.worldLayer??(this.hasRune('nightmares')?7:0)):0),transitions:[]};const h=this.s.layerHistory[id];if(!this.s.layerVersion&&h.current)h.transitions.push({layer:h.current,depth:Math.max(0,this.s.layerDepth||0),x:0,y:Math.max(0,this.s.layerDepth||0),turn:this.s.turn});for(const r of this.rooms)r.worldLayer??=0;for(const world of Object.values(this.s.worldMaps||{}))for(const r of Object.values(world.rooms))r.worldLayer??=0;for(const u of this.s.units){if(u.team!=='ally'||u.capturedSource)u.spawnLayer??=this.layer(this.s.rooms[u.home]);if(u.graveyardRevived||u.enemyName?.startsWith('Corrompido ·')){u.isUndead=true;u.uncapturable=true;}}for(const c of this.s.effectCards||[])if(c.input?.graveyardReturns){for(const record of c.input.graveyardReturns){const at=this.s.rooms[record.home];if(at&&!this.s.units.some(u=>u.revivedFrom===record.sourceId))this.reviveEnemy({id:record.sourceId,type:record.type,team:'enemy',x:record.x,y:record.y,home:record.home,range:record.range,size:record.size,enemyName:record.name,traits:record.traits,monstrosity:record.monstrosity},record.power/2,'Retorno do Cemitério');}c.input.captives=c.input.captives.filter(v=>!c.input.graveyardReturns.some(r=>r.sourceId===v.sourceId));c.input.assignments={};delete c.input.graveyardReturns;}this.s.effectCards=this.s.effectCards.filter(c=>!(c.input?.kind==='colony'&&c.input.action==='capture'&&!c.input.captives.length));const fallen=this.s.graveyardFallen||[];this.s.graveyardFallen=fallen.filter(u=>u.team==='ally');for(const u of fallen)if(u.team==='enemy'&&!u.isUndead&&!this.s.units.some(v=>v.revivedFrom===u.id))this.reviveEnemy(u,u.power/2,'Retorno do Cemitério');for(const [key,history]of Object.entries(this.s.layerHistory)){const rooms=key===this.layerWorldKey()?this.s.rooms:(this.s.worldMaps?.[key]?.rooms||{});history.scoutedRows??=[...new Set(Object.values(rooms).filter(r=>r.y>0&&!r.craterRoot&&r.type!=='crater').map(r=>r.y))];history.layerMisses??=0;}this.s.layerVersion=2;},
  layerWorldKey(){return this.s.activePlane==null?'base':String(this.s.activePlane);},
  layerForDiscovery(x,y){if(y<0||!(this.s.challengeOptions?.layers||this.hasRune('nightmares')))return 0;const h=this.s.layerHistory?.[this.layerWorldKey()];if(!h&&this.layerWorldKey()!=='base')return this.hasRune('nightmares')?7:0;if(!h)return y>=(this.s.layerDepth??0)?this.layer():0;for(let n=h.transitions.length-1;n>=0;n--)if(y>=h.transitions[n].depth)return h.transitions[n].layer;return this.hasRune('nightmares')?7:0;},
  advanceRoomLayer(x,y){this.s.layerHistory??={};const id=this.layerWorldKey(),h=this.s.layerHistory[id]??={current:this.layer(),transitions:[]},next=Math.max(0,Math.min(7,h.current+(this.hasRune('nightmares')?-1:1)));if(next===h.current)return;h.layerMisses=0;h.current=next;h.transitions.push({layer:next,depth:y,x,y,turn:this.s.turn});this.s.worldLayer=next;this.s.layerDepth=y;this.note(`Os exploradores alcançaram ${WORLD_LAYERS[next]}. A pedra revelada dali em diante guardaria os sinais dessa camada.`,'neutral');this.effect('Nova camada',`${WORLD_LAYERS[next]}: apenas salas novas descobertas nesta profundidade (${y}) ou abaixo dela receberão esta camada. Salas conhecidas conservam a própria camada.`,'neutral');},
  addRoom(x,y,type){const layer=this.layerForDiscovery(x,y);if(type==='water'&&(layer===1||this.hasRune('drought')))type=this.hasRune('drought')||y<=1&&Math.abs(x)<=2?'cave':'lava';const r=old.addRoom.call(this,x,y,type);r.worldLayer=layer;return r;},
  addUnit(type,x,y,loyal,team='ally',power=null){const u=old.addUnit.call(this,type,x,y,loyal,team,power);if(team!=='ally')u.spawnLayer=this.layer(this.room(x,y));if(this.hasRune('primal')&&type==='soldier'&&!power)this.addPower(u,2);return u;},
  recruitmentReason(type,home){if(this.hasRune('primal')&&['archer','siege'].includes(type))return'A Runa Primal proíbe armas de fogo e cerco.';if(this.hasRune('shunned')&&!['golem','siege','undead'].includes(type)&&this.s.gold<(this.recruitCost?this.recruitCost(type):(UNITS[type]?.cost||0)*2))return'A Runa do Repúdio exige o dobro de riquezas.';return old.recruitmentReason.call(this,type,home);},
  recruit(type,home){const result=old.recruit.call(this,type,home);return result;},
  rollDepthLayer(x,y){if(y<=0||!(this.s.challengeOptions?.layers||this.hasRune('nightmares')))return;this.s.layerHistory??={};const id=this.layerWorldKey(),h=this.s.layerHistory[id]??={current:this.layer(),transitions:[]};h.scoutedRows??=[];h.layerMisses??=0;if(h.scoutedRows.includes(y))return;h.scoutedRows.push(y);if(this.hasRune('nightmares')?h.current===0:h.current===7)return;const chance=Math.min(100,5*(h.layerMisses+1));if(this.roll(100)<=chance){this.advanceRoomLayer(x,y);h.layerMisses=0;}else h.layerMisses=Math.min(19,h.layerMisses+1);},
  drawDiscovery(depth){const ctx=this._layerDiscoveryContext;if(ctx&&!ctx.layerChecked){ctx.layerChecked=true;this.rollDepthLayer(ctx.x,ctx.y);}if(ctx)ctx.drawPending=true;try{return this.draw(depth)}finally{if(ctx)ctx.drawPending=false;}},
  draw(depth=0){const ctx=this._layerDiscoveryContext,discovery=!!ctx?.drawPending;if(discovery)ctx.drawPending=false;const card=old.draw.call(this,depth);if(card.suit==='★'&&this.hasRune('doom'))this.s.jokerCooldown[card.joker]=this.s.turn;if(discovery&&card.suit==='♠'&&ctx.y<=1)ctx.drawPending=true;return card;},
  withLayerOrigin(room,fn){const previous=this._layerEffectOrigin;this._layerEffectOrigin=room||previous;try{return fn()}finally{this._layerEffectOrigin=previous;}},
  rulesOrigin(){return this._layerEffectOrigin||old.rulesOrigin.call(this);},
  action(name,x,y,arg){return this.withLayerOrigin(this.room(x,y),()=>old.action.call(this,name,x,y,arg));},
  build(type,x,y,...args){return this.withLayerOrigin(this.site(x,y)||{x,y,worldLayer:this.layerForDiscovery(x,y)},()=>old.build.call(this,type,x,y,...args));},
  damageRoom(r){return this.withLayerOrigin(r,()=>old.damageRoom.call(this,r));},
  magic(good){const context=this._drawingLayerMagic;this._drawingLayerMagic=true;try{const result=old.magic.call(this,good);if(this.layer(this.rulesOrigin())===4)old.magic.call(this,good);return result;}finally{this._drawingLayerMagic=context;}},
  castMagic(good,id,card=null){const result=old.castMagic.call(this,good,id,card);if(!this._drawingLayerMagic&&this.layer(this.rulesOrigin())===4)old.castMagic.call(this,good,id,card);return result;},
  spawnMonstrosity(r,power=100,traits=3){return old.spawnMonstrosity.call(this,r,power,traits+(this.layer(r)===7?1:0));},
  roomHazards(r){const hazards=old.roomHazards.call(this,r);return this.layer(r)===1?[...new Set(hazards.map(h=>h==='water'?'lava':h))]:hazards;},
  layerReward(card,value,r){return card?.suit==='♦'?(this.layer(r)===3?0:this.layer(r)===5?value*2:value):value;},
  spawnEnemies(r,power,type){const doubled=this.layer(r)===3&&r.type==='smalllair';if(doubled)this.effect('Ninhada dos Rastejantes','As criaturas desta descoberta têm o dobro da força por causa da camada desta sala.','bad');return old.spawnEnemies.call(this,r,doubled?power*2:power,type);},
  reviveEnemy(u,power,reason='Retorno dos mortos'){if(this.s.status!=='playing')return null;if(u.isUndead||u.uncapturable||u.type==='undead'||Math.floor(power)<1)return null;this.s.capturePool=(this.s.capturePool||[]).filter(c=>c.sourceId!==u.id);this.s.fallenTwins=(this.s.fallenTwins||[]).filter(e=>e.unit.id!==u.id);this.dead=this.dead.filter(v=>v.id!==u.id);const at=this.room(Math.round(u.x),Math.round(u.y))||this.s.rooms[u.home]||this.target;const v=this.addUnit(u.type,at.x,at.y,true,'enemy',Math.floor(power));Object.assign(v,{x:u.x,y:u.y,home:this.s.rooms[u.home]?u.home:`${at.x},${at.y}`,range:u.range??this.unitData(u).range,size:u.size||1,isUndead:true,uncapturable:true,revivedFrom:u.id,enemyName:`${u.enemyName||ENEMIES[u.type]?.name||UNITS[u.type]?.name||u.type} · morto-vivo`,spawnLayer:u.spawnLayer??this.layer(at),traits:[...(u.traits||[])]});if(u.monstrosity)v.monstrosity=true;if(u.twinId){v.twinId=u.twinId;const partner=this.s.units.find(p=>p.id===u.twinId);if(partner)partner.twinId=v.id;}this._routeCache=null;this._tacticsDirty=true;this.note(`O corpo de ${u.enemyName||ENEMIES[u.type]?.name||UNITS[u.type]?.name||u.type} ergueu-se onde havia caído. A morte lhe dera uma nova e terrível forma.`,'danger');this.effect(reason,`${v.enemyName} ergueu-se no local da morte durante o combate, com ${v.power} STR. É um morto-vivo e não pode ser capturado; não retornará novamente.`,'bad');if(!this.s.combat)this.beginCombat();return v;},
  beginCombat(){const fresh=!this.s.combat;old.beginCombat.call(this);if(fresh&&this.hasRune('wolf')){const puppy=this.addUnit('dog',this.target.x,this.target.y,true,'ally',1);puppy.puppy=true;}},
  damage(u,amount,options){const attacker=this.s.units.find(v=>v.id===options?.attacker);if(attacker?.team==='ally'&&this.allies.some(v=>v.puppy&&Math.abs(v.x-attacker.x)+Math.abs(v.y-attacker.y)<.5))amount*=2;const alive=u.hp>0;old.damage.call(this,u,amount,options);if(!alive||u.hp>0)return;const r=this.room(Math.round(u.x),Math.round(u.y));if(this.hasRune('war')&&u.team==='enemy')this.ruleEvent('war-reward','Espólios de Guerra','Escolha o espólio do inimigo derrotado.',{x:r?.x??0,y:r?.y??0});if(this.hasRune('gore')&&r&&!this._bloodSpreading){this._bloodSpreading=true;r.extraFluid='water';this.spreadHazards();delete r.extraFluid;this._bloodSpreading=false;}if(this.hasRune('tombstone')&&!u.isUndead&&u.type!=='undead'&&r)this.reviveEnemy(u,u.power/2,'Runa Lápide');if(u.puppy&&r){const wolf=this.spawnMonstrosity(r,100,2);wolf.feral=true;}if((u.team==='enemy'||u.team==='neutral')&&!u.isUndead&&this.layer(r)===2&&!this.s.units.some(v=>v.revivedFrom===u.id))this.reviveEnemy(u,u.power/2,'Retorno do Cemitério');else if(u.team==='ally'&&this.layer(r)===2&&!this.s.units.some(v=>v.revivedFrom===u.id)){this.s.graveyardFallen??=[];this.s.graveyardFallen.push({...u});}if(u.team==='enemy'&&u.twinId&&!u.isUndead&&this.s.units.some(v=>v.id===u.twinId&&v.hp>0)&&!this.s.units.some(v=>v.revivedFrom===u.id))this.reviveEnemy(u,u.power,'Gêmeo reanimado');},
  attackPassageDoor(u,a,b){if(u.siegeBreaker){const door=this.barricade(a,b);if(door)this.damageBarricade(a,b,door.hp);return true;}return old.attackPassageDoor.call(this,u,a,b);},
  trade(direction,amount){if(!this.hasRune('shunned'))return old.trade.call(this,direction,amount);if(direction!=='gold')return{ok:false,reason:'A Runa do Repúdio impede vender recursos.'};if(this.s.traded||this.s.combat||!Number.isInteger(amount)||amount<=0)return{ok:false,reason:'Troca indisponível.'};amount=Math.min(amount,this.s.gold,this.capacities().resources-this.s.resources);if(amount<1)return{ok:false,reason:'Sem espaço ou riquezas.'};this.s.gold-=amount;this.s.resources+=amount;this.s.traded=true;this.events.push({type:'resource-gain',resources:amount,gold:0});return{ok:true};},
  update(dt){for(const u of this.enemies.filter(u=>u.goldDragon)){const treasury=this.rooms.filter(r=>r.type==='treasury').sort((a,b)=>b.y-a.y)[0];if(treasury&&Math.abs(u.x-treasury.x)+Math.abs(u.y-treasury.y)<.3){this.s.gold=Math.max(0,this.s.gold-50);u.hp=0;this.effect('Tesouro derretido','O dragão derreteu as riquezas da tesouraria e partiu.','bad');}}return old.update.call(this,dt);},
  income(){old.income.call(this);if(this.hasRune('shunned'))for(const r of this.rooms.filter(r=>r.type==='prison'&&r.prisoners===20&&this.active(r)))this.gain(0,20);if(this.hasRune('greed')&&this.s.gold>this.capacities().gold){this.spawnEnemies(this.target,100,'dragon');const dragon=this.enemies.at(-1);dragon.goldDragon=true;this.beginCombat();}},
  rulesChoices(card){if(card.input.action==='war-reward')return[{value:'resources',label:'5♥ Recursos'},{value:'gold',label:'5♦ Riquezas'}];return old.rulesChoices.call(this,card);},
  resolveEffect(id,value){const c=this.s.effectCards?.[0];if(c?.id!==id||c.input?.action!=='war-reward')return this.withLayerOrigin(this.room(c?.input?.x,c?.input?.y),()=>old.resolveEffect.call(this,id,value));if(!['resources','gold'].includes(value))return{ok:false,reason:'Escolha seu espólio.'};this.gain(value==='resources'?5:0,value==='gold'?5:0);this.s.effectCards.shift();return{ok:true};},
  resolveLayerDungeon(root){let card=null;for(let i=0;i<108;i++){const c=this.draw(root.y);if(c.suit==='♠'){card=c;break;}}if(!card)return;const members=[root,...(root.footprint||root.discoveryMembers||[]).map(id=>this.s.rooms[id]).filter(Boolean)],site=members.flatMap(r=>[[1,0],[-1,0],[0,1]].map(([dx,dy])=>({from:r,x:r.x+dx,y:r.y+dy}))).find(p=>p.y>=root.y&&p.y<=30&&Math.abs(p.x)<=20&&!this.room(p.x,p.y)&&!this.sealedBlock(p.x,p.y));if(!site){this.effect('Masmorra sem espaço','Uma segunda ruína foi pressentida, mas não há espaço adjacente disponível para revelá-la.','neutral');return;}const r=this.addRoom(site.x,site.y,'cave');this.connectRooms(site.from,r);const i=this.s.discard.lastIndexOf(card);if(i>=0)this.s.discard.splice(i,1);this.s.deck.push(card);const context=this._discoveryOrigin;this._discoveryOrigin=r;try{const pending=[];this.withLayerOrigin(r,()=>this.resolveRivalRoom(r,{enemyIds:[],fought:false},pending));for(const p of pending)this.expandRivalDungeon(p);}finally{this._discoveryOrigin=context;}this.effect('Ruínas da Masmorra',`Uma segunda carta de espadas (${card.rank}♠) revelou ${ROOMS[r.type].name} em ${r.x}, ${r.y}. A descoberta pertence à camada ${WORLD_LAYERS[this.layer(r)]}.`,'neutral');if(this.enemies.length)this.beginCombat();},
  resolveGraveyardReturns(){},
  endCombat(){const fallen=this.s.graveyardFallen||[];this.s.graveyardFallen=[];old.endCombat.call(this);for(const u of fallen)if(u.team==='ally'&&!['golem','siege'].includes(u.type)&&!this.s.units.some(v=>v.id===u.id&&v.hp>0))this.addUnit('undead',this.target.x,this.target.y,true);},
  explore(x,y,from){const previous=this._layerDiscoveryContext;this._layerDiscoveryContext={x,y,drawPending:false};let result;try{result=old.explore.call(this,x,y,from);}finally{this._layerDiscoveryContext=previous;}if(result.ok&&result.room&&result.card?.suit==='♠'&&this.layer(result.room)===6)this.resolveLayerDungeon(result.room);if(result.ok&&result.card?.alternative==='siege'){for(const u of this.enemies.filter(u=>u.home===`${x},${y}`))u.siegeBreaker=true;}if(result.ok&&this.hasRune('shunned')&&['♣','♠'].includes(result.card?.suit)&&this.roll(4)===1){for(const r of this.rooms.filter(r=>r.type==='prison'&&r.prisoners>0)){if(r.captive)this.releaseCaptive(r);else{this.spawnEnemies(r,r.prisoners*10,'raider');r.prisoners=0;}}if(this.enemies.length)this.beginCombat();}return result;}
});}
function validateChallenges(s){
 if(s.graveyardFallen!==undefined&&(!Array.isArray(s.graveyardFallen)||s.graveyardFallen.length>3000||s.graveyardFallen.some(u=>!u||!Number.isInteger(u.id)||u.id<1||!['ally','enemy','neutral'].includes(u.team)||!Object.hasOwn(UNITS,u.type)&&!Object.hasOwn(ENEMIES,u.type)||!Number.isFinite(u.power)||u.power<=0||!Number.isFinite(u.x)||!Number.isFinite(u.y)||Math.abs(u.x)>100||Math.abs(u.y)>100||!s.rooms[u.home])))throw Error('Unidades caídas do Cemitério inválidas.');
 for(const world of [s,...Object.values(s.worldMaps||{})]){for(const r of Object.values(world.rooms||{}))if(r.worldLayer!==undefined&&(!Number.isInteger(r.worldLayer)||r.worldLayer<0||r.worldLayer>=LAYER_STYLES.length))throw Error('Camada da sala inválida.');for(const u of world.units||[])if(u.spawnLayer!==undefined&&(!Number.isInteger(u.spawnLayer)||u.spawnLayer<0||u.spawnLayer>7)||u.isUndead!==undefined&&typeof u.isUndead!=='boolean'||u.uncapturable!==undefined&&typeof u.uncapturable!=='boolean'||u.revivedFrom!==undefined&&(!Number.isInteger(u.revivedFrom)||u.revivedFrom<1))throw Error('Unidade de camada inválida.');}
 if(s.layerVersion!==undefined&&s.layerVersion!==2)throw Error('Versão das camadas inválida.');
 if(s.layerHistory!==undefined){for(const h of Object.values(s.layerHistory||{})){if(h.scoutedRows!==undefined&&(!Array.isArray(h.scoutedRows)||h.scoutedRows.length>100||new Set(h.scoutedRows).size!==h.scoutedRows.length||h.scoutedRows.some(y=>!Number.isInteger(y)||y<1||y>100))||h.layerMisses!==undefined&&(!Number.isInteger(h.layerMisses)||h.layerMisses<0||h.layerMisses>19))throw Error('Prospecção de camadas inválida.');}if(!s.layerHistory||typeof s.layerHistory!=='object'||Array.isArray(s.layerHistory)||Object.keys(s.layerHistory).length>14)throw Error('Histórico de camadas inválido.');for(const [id,h]of Object.entries(s.layerHistory)){if(!/^(base|[0-9]|1[0-2])$/.test(id)||!h||!Number.isInteger(h.current)||h.current<0||h.current>7||!Array.isArray(h.transitions)||h.transitions.length>7||h.transitions.some(t=>!Number.isInteger(t.layer)||t.layer<0||t.layer>7||!Number.isInteger(t.depth)||t.depth<0||t.depth>100||t.y!==t.depth||!Number.isInteger(t.x)||Math.abs(t.x)>100||!Number.isInteger(t.turn)||t.turn<1||t.turn>s.turn))throw Error('Histórico de camadas inválido.');}}
 for(const u of s.units||[])if(u.graveyardRevived!==undefined&&typeof u.graveyardRevived!=='boolean'||u.graveyardSource!==undefined&&(!Number.isInteger(u.graveyardSource)||u.graveyardSource<1))throw Error('Retorno do Cemitério inválido.');if(s.challengeOptions!==undefined&&(!s.challengeOptions||typeof s.challengeOptions.layers!=='boolean'||!Array.isArray(s.challengeOptions.runes)||s.challengeOptions.runes.some(name=>!Object.prototype.hasOwnProperty.call(BLOODRUNES,name))))throw Error('Runas inválidas.');if(s.worldLayer!==undefined&&(!Number.isInteger(s.worldLayer)||s.worldLayer<0||s.worldLayer>7))throw Error('Camada inválida.');}


// artifacts.js
const artifactKey=r=>`${r.x},${r.y}`;
function installArtifacts(Game){const old={};for(const n of ['roll','resolveJoker','rulesChoices','resolveEffect','action','beginCombat','endCombat','damageRoom','spawnMonstrosity','build','housing'])old[n]=Game.prototype[n];Object.assign(Game.prototype,{
  hasArtifactTrait(trait){return this.rooms.some(r=>r.legendary&&!r.legendary.destroyed&&!r.legendary.sold&&r.legendary.traits.includes(trait)&&this.active(r));},
  shrineMultiplier(r){return this.rooms.some(a=>a.legendary?.traits.includes(2)&&!a.legendary.destroyed&&Math.abs(a.x-r.x)+Math.abs(a.y-r.y)<=1)?2:1;},
  recruitCost(type){let cost=UNITS[type]?.cost||0;if(this.hasRune('shunned')&&!['golem','siege','undead'].includes(type))cost*=2;if(this.hasArtifactTrait(1))cost=Math.ceil(cost/2);return cost;},
  housing(type){return old.housing.call(this,type).filter(r=>!r.legendary?.traits.includes(9));},
  roll(n){const first=old.roll.call(this,n);if(n===2&&this.hasArtifactTrait(3)&&first!==(this.s.luckyPreference||1))return old.roll.call(this,n);return first;},
  rulesChoices(card){const i=card.input;if(i.action==='artifact-luck')return[{value:'1',label:'Preferir resultado 1'},{value:'2',label:'Preferir resultado 2'}];if(i.action==='artifact-revive')return i.units.map((u,index)=>({value:String(index),label:`${u.enemyName||UNITS[u.type]?.name||u.type} · ${Math.round(u.power)} STR`}));if(i.action==='artifact-purpose')return this.rooms.filter(r=>ROOMS[r.type]?.r!==undefined&&!r.legendary).map(r=>({value:artifactKey(r),label:ROOMS[r.type].name}));if(i.action==='artifact-create')return this.rooms.filter(r=>r.type==='cave'&&!r.builtPartOf&&this.active(r)).map(r=>({value:artifactKey(r),label:`Caverna ${artifactKey(r)}`}));if(i.action==='artifact-banish')return this.enemies.filter(u=>u.monstrosity).map(u=>({value:String(u.id),label:u.enemyName||'Monstruosidade'}));return old.rulesChoices.call(this,card);},
  resolveEffect(id,selection){const card=this.s.effectCards?.[0],i=card?.input;if(card?.id!==id||!i?.action?.startsWith('artifact-'))return old.resolveEffect.call(this,id,selection);const options=this.rulesChoices(card);if(!options.length||selection==='skip'){this.s.effectCards.shift();return{ok:true}}if(!options.some(o=>o.value===String(selection)))return{ok:false,reason:'Escolha válida necessária.'};const r=this.room(i.x,i.y)||this.target;if(i.action==='artifact-luck')this.s.luckyPreference=Number(selection);if(i.action==='artifact-revive'){const u=i.units[Number(selection)],home=this.s.rooms[u.home]||this.target;const revived={...u,hp:u.maxHp,x:home.x,y:home.y,home:artifactKey(home),moveTarget:null};this.s.units=this.s.units.filter(v=>v.id!==u.id);this.s.units.push(revived);}if(i.action==='artifact-purpose'){const model=this.s.rooms[selection];r.type=model.type;r.displayName='Artefato · '+ROOMS[model.type].name;}if(i.action==='artifact-create'){const root=this.s.rooms[selection],members=this.expandFormation(root,2);for(const p of members){p.type='forest';p.legendaryForest=true;}r.legendary.creationPlaced=true;}if(i.action==='artifact-banish'){if(this.s.gold<100)return{ok:false,reason:'Exige 100♦.'};this.s.gold-=100;const u=this.enemies.find(u=>String(u.id)===String(selection));this.s.units=this.s.units.filter(v=>v!==u&&(!u.monsterGroup||v.monsterGroup!==u.monsterGroup));this.s.nextMonsterTraits=4;}this.s.effectCards.shift();return{ok:true};},
  action(action,x,y,arg){const r=this.room(x,y);if(action==='artifact-sell'&&r?.legendary?.traits.includes(5)&&!r.legendary.sold){r.legendary.sold=true;this.gain(0,300);this.s.units=this.s.units.filter(u=>u.artifactHome!==artifactKey(r));return{ok:true};}const traits={ 'artifact-luck':3,'artifact-purpose':9,'artifact-create':10,'artifact-banish':11};if(traits[action]&&r?.legendary?.traits.includes(traits[action])&&!r.legendary.destroyed){this.ruleEvent(action,'Poder do artefato','Escolha como utilizar o artefato.',{x,y});return{ok:true};}return old.action.call(this,action,x,y,arg);},
  spawnMonstrosity(r,power=100,count=3){if(this.s.nextMonsterTraits){count=this.s.nextMonsterTraits;delete this.s.nextMonsterTraits;}return old.spawnMonstrosity.call(this,r,power,count);},
  beginCombat(){const fresh=!this.s.combat;old.beginCombat.call(this);if(!fresh)return;for(const r of this.rooms.filter(r=>r.legendary?.traits.includes(13)&&!r.legendary.destroyed&&this.active(r))){const spirit=this.addUnit('guardian',r.x,r.y,true,'ally',120);spirit.artifactSpirit=true;spirit.size=2.8;spirit.fixed=!r.legendary.traits.includes(6);}for(const u of this.allies)if(this.rooms.some(r=>r.legendary?.traits.includes(8)&&!r.legendary.destroyed&&r.y===Math.round(u.y)&&this.active(r))){u.inspiringBasePower=u.power;this.addPower(u,u.power*.5);}},
  endCombat(){const fallen=this.dead.filter(u=>!u.artifactSpirit&&!u.vengefulGuest);this.dead=[...fallen];old.endCombat.call(this);const recovered=new Set(this.allies.map(u=>u.id)),candidates=fallen.filter(u=>!recovered.has(u.id));if(candidates.length&&this.hasArtifactTrait(7)){const r=this.rooms.find(r=>r.legendary?.traits.includes(7)&&!r.legendary.destroyed);this.ruleEvent('artifact-revive','Ressurreição do artefato','Escolha um defensor para retornar com força completa.',{x:r.x,y:r.y,units:candidates});}this.s.units=this.s.units.filter(u=>!u.artifactSpirit&&!u.vengefulGuest);for(const u of this.allies)if(u.inspiringBasePower){u.power=u.inspiringBasePower;u.maxHp=u.hp=u.power*8;delete u.inspiringBasePower;}},
  damageRoom(r){old.damageRoom.call(this,r);if(r?.legendary&&!r.legendary.destroyed){r.legendary.destroyed=true;if(r.legendary.traits.includes(12)){for(let i=0;i<24;i++){const u=this.addUnit('soldier',this.target.x,this.target.y,true);u.vengefulGuest=true;}this.effect('Vingança do artefato','120 STR de reforços chegaram. Eles partirão ao fim do combate.','good');}}}
});}


// chronicle.js
const ACHIEVEMENTS={dominance:'Domínio Anão',beastmaster:'Mestre das Feras',chains:'Não passarás',dragons:'Dragões são nossos amigos',godmushroom:'O que é um deus para um descrente?',wealth:'Tesouraria sem fim',strength:'Treinamento extremo',traps:'Cuidado onde pisa',adventurers:'Grupo completo',archmage:'Arquimago',runemaster:'Mestre das Runas',nightmare:'Fomos fundo demais',progress:'Progresso a qualquer custo'};
function installChronicle(Game){const old={};for(const n of ['damage','beginCombat','endCombat','action','income','checkMutiny','resolveEffect','moveUnit','trade','explore','applySpell'])old[n]=Game.prototype[n];Object.assign(Game.prototype,{
  achievement(id){this.s.achievements??=[];if(!this.s.achievements.includes(id)){this.s.achievements.push(id);this.effect('Conquista · '+ACHIEVEMENTS[id],'Este feito foi registrado na crônica da fortaleza.','good');}},
  checkAchievements(){if(this.s.gold>=5000)this.achievement('wealth');if(this.allies.some(u=>u.power>=200))this.achievement('strength');if(new Set(this.allies.filter(u=>u.heroClass).map(u=>u.heroClass)).size>=13)this.achievement('adventurers');if(this.s.spellsCast?.length>=39)this.achievement('archmage');if(this.layer()===7)this.achievement('nightmare');if(this.s.discoveredInventions?.length>=13&&this.s.transmutation)this.achievement('progress');if(this.s.status==='won'&&this.s.challengeOptions?.runes.length)this.achievement('runemaster');},
  beginCombat(){if(!this.s.combat)this.s.battleArmyTypes=[...new Set(this.allies.map(u=>u.type))];return old.beginCombat.call(this);},
  damage(u,amount,options){const alive=u.hp>0;u.damageSources??=[];const source=options?.attacker?'unit':options?.source||'other';const beforeHp=u.hp+u.shield;old.damage.call(this,u,amount,options);if(u.hp+u.shield<beforeHp&&!u.damageSources.includes(source))u.damageSources.push(source);if(alive&&u.hp<=0&&u.monstrosity){if(this.s.battleArmyTypes?.length&&this.s.battleArmyTypes.every(type=>['soldier','archer'].includes(type)))this.achievement('dominance');if(u.damageSources.length===1&&u.damageSources[0]==='trap')this.achievement('traps');}},
  applySpell(i,value){const result=old.applySpell.call(this,i,value);if(result.ok){this.s.spellsCast??=[];const key=(i.good?'g':'b')+i.id;if(!this.s.spellsCast.includes(key))this.s.spellsCast.push(key);if(i.good&&i.id===13&&this.allies.some(u=>u.type==='dragon'))this.achievement('dragons');this.checkAchievements();}return result;},
  moveUnit(u,next,dt){old.moveUnit.call(this,u,next,dt);if(u.chainBound)this.achievement('chains');},
  action(action,x,y,arg){const r=this.room(x,y);if(action==='hireDragon'&&r?.type==='treasury'){if(this.s.gold<500||this.s.combat||this.allies.some(u=>u.treasuryDragon))return{ok:false,reason:'Exige 500♦ em reservas, paz e nenhum dragão contratado.'};const dragon=this.addUnit('dragon',x,y,false,'ally',100);dragon.size=3.8;dragon.range=2.05;dragon.treasuryDragon=true;dragon.loyal=false;return{ok:true};}const before=this.allies.filter(u=>u.type==='troll'||u.type==='beast').length,result=old.action.call(this,action,x,y,arg);if(result.ok&&['tame','druid'].includes(action)&&this.allies.filter(u=>u.type==='troll'||u.type==='beast').length>before){this.s.tamedCount=(this.s.tamedCount||0)+1;if(this.s.tamedCount>=10)this.achievement('beastmaster');}return result;},
  checkMutiny(){const rebels=this.allies.filter(u=>u.type==='berserker'&&this.s.rooms[u.home]?.type==='meadhall'&&(this.s.rooms[u.home].damaged||this.s.rooms[u.home].footprint?.some(id=>this.s.rooms[id]?.damaged)));for(const u of rebels)u.team='enemy';if(rebels.length)this.effect('Motim dos Berserkers','O Salão de Hidromel foi danificado. Seus habitantes se rebelaram.','bad');for(const u of this.allies.filter(u=>u.treasuryDragon))if(this.s.gold<500){u.team='enemy';this.effect('Dragão insatisfeito','As reservas caíram abaixo de 500♦. O dragão contratado se rebelou.','bad');}return old.checkMutiny.call(this);},
  trade(direction,amount){if(direction==='resources'&&this.s.transmutation&&this.rooms.some(r=>r.type==='laboratory'&&this.active(r)&&this.allies.filter(u=>u.home===`${r.x},${r.y}`&&u.type==='alchemist').length>=10)){if(this.s.combat||this.s.traded||!Number.isInteger(amount)||amount<=0)return{ok:false,reason:'Troca indisponível.'};const count=Math.min(amount,this.s.resources,Math.floor((this.capacities().gold-this.s.gold)/3));if(count<1)return{ok:false,reason:'Sem recursos ou capacidade.'};this.s.resources-=count;this.s.gold+=count*3;this.events.push({type:'resource-gain',resources:0,gold:count*3});this.s.traded=true;this.checkMutiny();return{ok:true};}const result=old.trade.call(this,direction,amount);if(result.ok)this.checkMutiny();return result;},
  income(){old.income.call(this);if(this.allies.filter(u=>u.type==='alchemist').length>50){const c=this.draw();if(c.suit==='♠'&&c.rank===1){const lab=this.rooms.filter(r=>r.type==='laboratory').sort((a,b)=>b.y-a.y)[0];if(lab){for(const u of this.allies.filter(u=>u.home===`${lab.x},${lab.y}`))this.killInstant(u);for(const r of [lab,...this.neighbors(lab)])this.damageRoom(r);this.effect('Acidente alquímico','Um laboratório explodiu, destruindo seus ocupantes e danificando salas próximas.','bad');}}if(c.suit==='♦'&&c.rank===13){this.s.transmutation=true;this.effect('Transmutação descoberta','Um laboratório completo permite trocar 1♥ por 3♦.','good');}}this.checkAchievements();},
  endCombat(){old.endCombat.call(this);this.checkAchievements();},
  explore(x,y,from){const result=old.explore.call(this,x,y,from);if(result.ok&&result.card?.suit==='♣'&&result.card.rank===11){if(this.s.resources>1000){if(this.roll(4)===1)this.s.resources=Math.floor(this.s.resources/2);else{const r=this.rooms.filter(r=>r.type==='warehouse').sort((a,b)=>b.y-a.y)[0];if(r)this.spawnEnemies(r,260,'elemental');}this.effect('J♣ · Reservas ameaçadas','O acúmulo de recursos atraiu uma praga ou um elemental.','bad');}if(this.s.gold>1000){if(this.roll(4)===1&&!this.s.discoveredInventions?.includes(7))this.s.gold=Math.floor(this.s.gold/2);else{const r=this.rooms.filter(r=>r.type==='treasury').sort((a,b)=>b.y-a.y)[0];if(r)this.spawnEnemies(r,240,'raider');}this.effect('J♣ · Guilda de Ladrões','A riqueza da fortaleza atraiu ladrões.','bad');}if(this.enemies.length)this.beginCombat();}this.checkAchievements();return result;}
});}

// Shared prose for the diary and exported journal; rendering is read-only.
function chronicleEntries(state){return readableChronicleEntries(state)}
function narrativeEntry(text,variant=0){return renderChronicleEntry(text,variant)}


// interactions.js
const siteKey=r=>`${r.x},${r.y}`;
const coordinateValue=value=>typeof value==='string'&&/^(?:r:)?-?\d+,-?\d+$/.test(value);
const INFRASTRUCTURE=['rails','columns','bridge','drawbridge','elevator'];
const EDGE_TOOLS=['defensive','offensive','secret','damage','delay'];
function installInteractions(Game){
 const prior={};for(const n of ['beginCombat','explore','openPassage','expandFormation','lose','endCombat','colonyChoices','resolveEffect','neighbors','moveUnit','update','damage'])prior[n]=Game.prototype[n];
 Object.assign(Game.prototype,{
  mapEffectTargets(card){
   const i=card?.input;if(!i)return[];
   if(i.kind==='unit-home')return this.effectTargets(card).map(r=>({...r,value:{x:r.x,y:r.y}}));
   const options=i.kind==='rules'?this.rulesChoices(card):i.kind==='rise'?this.riseChoices(card):i.kind==='colony'?this.colonyChoices(card):[];
   return options.filter(o=>coordinateValue(o.value)).map(o=>{let[x,y]=o.value.replace(/^r:/,'').split(',').map(Number);if(i.action==='placement'||i.action==='minecart'){x+=i.x;y+=i.y;}return{x,y,value:o.value,label:o.label};});
  },
  engineeringReason(mode,tool,x,y){if(this.s.combat||this.s.status!=='playing')return'Construa fora de combate.';const lock=this.engineeringLock(tool);if(lock)return lock;const root=this.site(x,y);if(!root)return'Selecione uma sala explorada para escolher o local.';const required=mode==='defense'?(['damage','delay'].includes(tool)?'forge':'masonry'):tool==='rails'?'forge':ROOMS[tool]?.requires?.[0];if(required&&!this.has(required))return`Exige ${ROOMS[required].name} ativa, conectada e reparada.`;if(mode==='infrastructure'&&tool!=='rails'&&this.s.built)return'Uma construção já foi realizada: encerre o turno ou explore antes de construir outra.';const trap=['damage','delay'].includes(tool),price=mode==='defense'?{resources:trap?(tool==='damage'?20:15):0,gold:trap?0:tool==='defensive'?10:tool==='offensive'?20:50}:tool==='rails'?{resources:5,gold:0}:this.cost(tool,root);if(this.s.resources<price.resources||this.s.gold<price.gold)return`Exige ${price.resources}♥ e ${price.gold}♦ disponíveis.`;if(!this.colonyChoices({input:{kind:'colony',action:'engineering',mode,tool,x,y}}).length)return mode==='defense'?'Escolha uma sala ativa com corredor aberto sem outra defesa instalada.':'Nenhum terreno vizinho permite esta construção. Selecione outra caverna conectada.';return'';},
  requestEngineering(mode,tool,x,y){const why=this.engineeringReason(mode,tool,x,y);if(why)return{ok:false,reason:why};if(this.s.combat||this.s.status!=='playing')return{ok:false,reason:'Construa fora de combate.'};if(!(mode==='infrastructure'?INFRASTRUCTURE:EDGE_TOOLS).includes(tool))return{ok:false,reason:'Construção inválida.'};const card={input:{kind:'colony',action:'engineering',mode,tool,x,y}};if(!this.colonyChoices(card).length)return{ok:false,reason:'Nenhum local disponível. Confira os pré-requisitos e as passagens abertas.'};const title=mode==='defense'?{defensive:'Porta defensiva · 10♦',offensive:'Porta ofensiva · 20♦',secret:'Passagem secreta · 50♦',damage:'Armadilha de dano · 20♥',delay:'Armadilha de atraso · 15♥'}[tool]:ROOMS[tool].name+' · '+(tool==='rails'?5:this.cost(tool,this.site(x,y)).resources)+'♥';this.queueColony('engineering',title,mode==='defense'?'Escolha a direção no mapa. A passagem entre a sala de origem e o espaço escolhido receberá esta defesa. O custo será cobrado ao confirmar.':ROOMS[tool].desc+' Escolha no mapa onde instalar. O custo será cobrado ao confirmar.',{mode,tool,x,y});return{ok:true,pending:true};},
  colonyChoices(card){const i=card.input;if(i.action!=='engineering')return prior.colonyChoices.call(this,card);const root=this.site(i.x,i.y);if(!root)return[];
   if(i.mode==='defense')return DIRS.map(([dx,dy])=>this.room(i.x+dx,i.y+dy)).filter(r=>r&&this.linked(root,r)&&!this.s.barricades[this.passageKey(root,r)]?.hp&&!this.s.secretPassages?.[this.passageKey(root,r)]&&!this.s.passageTraps?.[this.passageKey(root,r)]).map(r=>({value:siteKey(r),label:ROOMS[r.type].name}));
   return [root,...DIRS.map(([dx,dy])=>this.site(i.x+dx,i.y+dy))].filter(Boolean).filter(r=>i.tool==='rails'?this.has('forge')&&this.active(r)&&!r.transport:!this.buildReason(i.tool,r)).map(r=>({value:siteKey(r),label:ROOMS[r.type].name}));
  },
  resolveEffect(id,value){const c=this.s.effectCards?.[0],i=c?.input;if(c?.id!==id||i?.kind!=='colony'||i.action!=='engineering')return prior.resolveEffect.call(this,id,value);if(value==='cancel'){this.s.effectCards.shift();return{ok:true};}if(!this.colonyChoices(c).some(o=>o.value===String(value)))return{ok:false,reason:'Escolha um local destacado.'};const r=this.s.rooms[value]||this.site(...String(value).split(',').map(Number)),from=this.room(i.x,i.y);let result;
   if(i.mode==='infrastructure')result=i.tool==='rails'?this.action('rails',r.x,r.y):this.build(i.tool,r.x,r.y);
   else if(['defensive','offensive'].includes(i.tool))result=this.fortifyPassage(from,r,i.tool);
   else {const trap=['damage','delay'].includes(i.tool),cost=trap?(i.tool==='damage'?20:15):50;if(!this.has(trap?'forge':'masonry')||(trap?this.s.resources:this.s.gold)<cost)return{ok:false,reason:'Pré-requisito ou recursos insuficientes.'};const edge=this.passageKey(from,r);if(trap){this.s.resources-=cost;this.s.passageTraps??={};this.s.passageTraps[edge]={kind:i.tool,level:1,armed:true};}else{this.s.gold-=cost;this.s.secretPassages??={};this.s.secretPassages[edge]=true;}this._routeCache=null;this._tacticsDirty=true;result={ok:true};}
   if(result.ok)this.s.effectCards.shift();return result;
  },
  upgradeEdge(a,b){const trap=a&&b&&this.s.passageTraps?.[this.passageKey(a,b)],limit=this.s.discoveredInventions?.includes(12)?4:3;if(this.s.combat||this.s.status!=='playing'||!trap||trap.level>=limit||this.s.resources<20)return{ok:false,reason:'Exige 20♥, uma armadilha aprimorável e fora de combate.'};this.s.resources-=20;trap.level++;trap.armed=true;return{ok:true};},
  beginCombat(){if(this._discoveryTransaction){this._queuedCombat=true;return;}const fresh=!this.s.combat;if(fresh&&this.s.activePlane==null&&this.enemies.some(u=>this.s.rooms[u.home]?.type==='void'))this.s.voidBattle=true;return prior.beginCombat.call(this);},
  finishDiscovery(method,args){const parent=this._discoveryTransaction;this._discoveryTransaction=true;let result;try{result=prior[method].apply(this,args);if(method==='explore'&&result?.ok&&!result.pending)this.triggerScheduledEvent(result);}finally{this._discoveryTransaction=parent;if(!parent&&this._queuedCombat){this._queuedCombat=false;if(this.enemies.length)this.beginCombat();}}return result;},
  explore(...args){return this.finishDiscovery('explore',args);},
  openPassage(...args){return this.finishDiscovery('openPassage',args);},
  expandFormation(root,count,options){if(root.type==='desolate'||root.wyrdId===13)options={...options,axis:'horizontal'};if(root.type!=='crater')return prior.expandFormation.call(this,root,count,options);return this.expandVolcano(root);},
  expandVolcano(root){const id=siteKey(root),members=[root];root.sourceKind='volcano';root.craterRoot=id;root.craterPart='rim';root.flowActive=true;root.fluid=root.contaminant='lava';root.craterBottomless=root.y===30;for(const direction of [-1,1]){let previous=root;for(let y=root.y+direction;y>=0&&y<=30;y+=direction){if(this.room(root.x,y)||this.sealedBlock(root.x,y))break;const r=this.addRoom(root.x,y,'crater');r.craterRoot=id;r.craterPart=direction<0?'dry':'wet';r.flowActive=direction>0;r.fluid=r.contaminant=direction>0?'lava':null;members.push(r);this.connectRooms(previous,r);previous=r;if(direction>0&&y===30)root.craterBottomless=true;}}members.sort((a,b)=>a.y-b.y);root.discoveryMembers=members.map(siteKey);root.formationSize=members.length;this._routeCache=null;return members;},
  lose(){if(this.s.activePlane==null&&this.s.voidBattle&&this.s.combat&&this.s.status==='playing'){const enemies=this.enemies.map(u=>({...u}));this.s.combat=false;this.s.paused=false;this.s.status='lost';this.s.voidDefeated=false;this.projectiles=[];this.effects=[];this.s.units=this.s.units.filter(u=>u.hp>0&&u.team!=='enemy');this.effect('O Cristal do Vazio foi perdido','A batalha pelo Cristal do Vazio é definitiva. A derrota encerra a jornada mesmo que ainda restem gemas no portão. As gemas protegem das invasões comuns, mas não desta derrota final.','bad');this.note('Derrota definitiva no Cristal do Vazio. As gemas restantes não podem salvar a fortaleza.','danger');this.events.push({type:'void-defeat',enemies},{type:'lost'});return true;}return prior.lose.call(this);},
  endCombat(){const result=prior.endCombat.call(this);delete this.s.voidBattle;for(const t of Object.values(this.s.passageTraps||{}))t.armed=true;return result;},
  neighbors(r,team='ally',u=null){return prior.neighbors.call(this,r,team,u).filter(n=>team!=='enemy'||!this.s.secretPassages?.[this.passageKey(r,n)]);},
  moveUnit(u,next,dt){const origin=this.movementOrigin(u,next),before=origin?Math.abs(u.x-origin.x)+Math.abs(u.y-origin.y):0;prior.moveUnit.call(this,u,next,dt);if(!origin||u.worker||!(u.team==='enemy'||this.s.madTraps)||u.traits?.includes(7))return;const trap=this.s.passageTraps?.[this.passageKey(origin,next)],after=Math.abs(u.x-origin.x)+Math.abs(u.y-origin.y);if(trap?.armed&&before<.5&&after>=.5){trap.armed=false;if(trap.kind==='damage')this.damage(u,trap.level*80,{source:'trap'});else u.stun=Math.max(u.stun,trap.level*2);}},
  damage(u,amount,options){if(u.worker){if(amount>0){u.hp=0;u.alive=false;}return;}return prior.damage.call(this,u,amount,options);},
  update(dt){if(this.s.combat&&!this.s.paused)for(const [edge,t]of Object.entries(this.s.passageTraps||{})){const[a,b]=edge.split('|').map(id=>this.s.rooms[id]);if(this.s.magicFlags?.rearmCombat||this.allies.some(u=>u.type==='trapper'&&Math.abs(u.x-(a.x+b.x)/2)+Math.abs(u.y-(a.y+b.y)/2)<1.5))t.armed=true;}return prior.update.call(this,dt);}
 });
}
function validateInteractions(s){for(const field of ['secretPassages','passageTraps'])if(s[field]!==undefined){if(!s[field]||typeof s[field]!=='object'||Array.isArray(s[field])||Object.keys(s[field]).length>4000)throw Error('Infraestrutura inválida.');for(const[edge,value]of Object.entries(s[field])){if(!s.passages[edge])throw Error('Infraestrutura sem passagem.');if(field==='secretPassages'?value!==true:!value||!['damage','delay'].includes(value.kind)||![1,2,3,4].includes(value.level)||typeof value.armed!=='boolean')throw Error('Defesa de corredor inválida.');}}
 if(s.voidBattle!==undefined&&typeof s.voidBattle!=='boolean')throw Error('Batalha final inválida.');
 for(const r of Object.values(s.rooms))if(r.craterRoot!==undefined&&(!s.rooms[r.craterRoot]||!['dry','rim','wet'].includes(r.craterPart)))throw Error('Cratera inválida.');
}


// incursions.js
const incursionKey=r=>`${r.x},${r.y}`;
function banditInterval(seed,serial=0){let n=Math.imul((seed>>>0)^Math.imul(serial+1,0x9e3779b1),0x85ebca6b);n=Math.imul(n^(n>>>16),0xc2b2ae35);return 5+((n^(n>>>13))>>>0)%4;}
function banditCount(depth){return Math.max(1,Math.ceil((15+5*Math.max(0,depth))/15));}
function installIncursions(Game){const old={};for(const n of ['provoke','action','enemyGoal','neighbors','damage','reviveEnemy','onAttack'])old[n]=Game.prototype[n];Object.assign(Game.prototype,{
 banditSpawnCandidates(near={x:0}){return this.rooms.filter(r=>r.y>=0&&r.type!=='crater'&&!r.closed&&!r.damaged&&!this.lethalHazard(r,{type:'raider',team:'enemy'})&&this.passable(r,'enemy',{type:'raider',team:'enemy',power:15})&&this.path(r,this.target,'enemy',{type:'raider',team:'enemy',power:15})!==null).sort((a,b)=>b.y-a.y||Math.abs(a.x-near.x)-Math.abs(b.x-near.x)||a.x-b.x);},
 initializeRaidSchedule(newCampaign=false){if(!this.s.banditRaids)this.s.banditRaids={version:1,serial:0,lastTurn:0,nextTurn:(newCampaign?0:this.s.turn)+banditInterval(this.s.seed)};return this.s.banditRaids;},
 triggerBanditRaid(discovery){const schedule=this.initializeRaidSchedule();if(!discovery?.ok||discovery.pending||!discovery.card||this.s.status!=='playing'||this.s.activePlane!=null||this.s.turn<schedule.nextTurn)return null;
  const candidates=this.banditSpawnCandidates(discovery.room);const origin=candidates[0];if(!origin)return null;
  const depth=origin.y,count=banditCount(depth);if(this.s.units.filter(u=>u.hp>0).length+this.campUnits().length+count>3000){this.effect('Bandidos aguardam uma passagem','O grupo de bandidos não conseguiu entrar. A invasão continua pendente para uma exploração seguinte.','neutral');return null;}
  schedule.serial++;schedule.lastTurn=this.s.turn;schedule.nextTurn=this.s.turn+banditInterval(this.s.seed,schedule.serial);
  const enemies=[];for(let n=0;n<count;n++){const u=this.addUnit('raider',origin.x,origin.y,true,'enemy',15);u.enemyName='Bandido';u.banditRaid=schedule.serial;enemies.push(u);}
  this.effect('Invasão de bandidos',`${count} bandidos racionais surgiram em ${ROOMS[origin.type].name}, na profundidade ${origin.y}. Cada combatente tem 15 STR (${count*15} STR no grupo). Eles atacam junto das demais ameaças desta exploração e podem ser capturados para interrogatório ou contratação.`,'bad');this.note(`Bandidos encontraram uma entrada nas profundezas. Seus passos ecoaram pelos túneis, ameaçando os habitantes da fortaleza.`,'danger');this._tacticsDirty=true;this.beginCombat();return{origin:incursionKey(origin),depth,count,power:count*15,ids:enemies.map(u=>u.id)};
 },
 assaultContains(u,r){const id=u?.defendingTerritory,root=this.s.rooms[id];return !!root&&!!r&&(r===root||r.bossRoot===id||r.cavernGroup===id||r.discoveryRoot===id||r.builtPartOf===id);},
 canAssault(root,guards){if(!guards.length)return false;const states=guards.map(u=>({u,team:u.team,territory:u.territory}));try{for(const {u}of states){u.team='enemy';delete u.territory;}this._routeCache=null;return this.defenders.some(u=>!u.nonAttacking&&(this.unitData(u).speed>0&&this.path(this.anchor(u),root,'ally',u)!==null||this.unitData(u).range>.5&&guards.some(v=>Math.abs(u.x-v.x)+Math.abs(u.y-v.y)<=this.unitData(u).range&&this.lineOfSight(u,v))));}finally{for(const {u,team,territory}of states){u.team=team;if(territory!==undefined)u.territory=territory;}this._routeCache=null;}},
 orderAssault(root,guards){for(const u of guards){u.defendingTerritory=incursionKey(root);u.awaitingAttack=true;u.moveTarget=null;u.walk=0;}this._tacticsDirty=true;this.effect('Ataque ao território',`Os defensores avançam para ${ROOMS[root.type].name}. O guardião permanece no covil e só reage depois de receber o primeiro ataque das suas tropas.`,'neutral');},
 provoke(r){const root=this.encounterRoot(r),guards=this.s.units.filter(u=>u.hp>0&&u.team==='neutral'&&u.territory===incursionKey(root));if(!this.canAssault(root,guards))return{ok:false,reason:'Nenhum defensor combatente consegue alcançar ou atingir este território.'};this.orderAssault(root,guards);return old.provoke.call(this,r);},
 action(name,x,y,arg){const root=this.room(x,y);if(name==='attackGolem'&&root?.type==='golemforge'&&!this.s.combat&&this.s.status==='playing'){const guard=this.s.units.find(u=>u.id===root.golemId&&u.team==='neutral'&&u.hp>0);if(guard){if(!this.canAssault(root,[guard]))return{ok:false,reason:'Nenhum defensor consegue alcançar ou atingir o guardião.'};this.orderAssault(root,[guard]);}}return old.action.call(this,name,x,y,arg);},
 enemyGoal(u){if(u.defendingTerritory){const home=this.s.rooms[u.defendingTerritory];if(!home)return null;const targets=this.allies.filter(v=>this.assaultContains(u,this.anchor(v))).sort((a,b)=>Math.abs(a.x-u.x)+Math.abs(a.y-u.y)-Math.abs(b.x-u.x)-Math.abs(b.y-u.y));return targets[0]?this.anchor(targets[0]):home;}return old.enemyGoal.call(this,u);},
 neighbors(r,team='ally',u=null){const neighbors=old.neighbors.call(this,r,team,u);return team==='enemy'&&u?.defendingTerritory?neighbors.filter(n=>this.assaultContains(u,n)):neighbors;},
 onAttack(u,target){if(u.team==='ally'&&target.defendingTerritory){for(const guard of this.s.units)if(guard.defendingTerritory===target.defendingTerritory)guard.awaitingAttack=false;this._tacticsDirty=true;}return old.onAttack.call(this,u,target);},
 damage(u,amount,options){const before=u.hp+u.shield;old.damage.call(this,u,amount,options);const attacker=this.s.units.find(v=>v.id===options?.attacker);if(u.defendingTerritory&&attacker?.team==='ally'&&u.hp+u.shield<before){for(const guard of this.s.units)if(guard.defendingTerritory===u.defendingTerritory)guard.awaitingAttack=false;this._tacticsDirty=true;}},
 reviveEnemy(u,...args){const v=old.reviveEnemy.call(this,u,...args);if(v&&u.defendingTerritory){v.defendingTerritory=u.defendingTerritory;v.awaitingAttack=false;}return v;}
});}
function validateIncursions(s){const schedule=s.banditRaids;if(schedule!==undefined&&(!schedule||schedule.version!==1||!Number.isInteger(schedule.serial)||schedule.serial<0||!Number.isInteger(schedule.lastTurn)||schedule.lastTurn<0||schedule.lastTurn>s.turn||!Number.isInteger(schedule.nextTurn)||schedule.nextTurn<1||schedule.nextTurn<=schedule.lastTurn))throw Error('Calendário de bandidos inválido.');for(const map of [s,...Object.values(s.worldMaps||{})])for(const u of map.units||[]){if(u.defendingTerritory!==undefined&&(typeof u.defendingTerritory!=='string'||!map.rooms[u.defendingTerritory]))throw Error('Território de combate inválido.');if(u.awaitingAttack!==undefined&&typeof u.awaitingAttack!=='boolean'||u.banditRaid!==undefined&&(!Number.isInteger(u.banditRaid)||u.banditRaid<1))throw Error('Estado de invasão inválido.');}}


// occupation.js
const campKey=r=>`${r.x},${r.y}`;
const clearCampWalk=u=>{for(const k of ['casualPlan','idlePhase','idleRemaining','idleGoal','idleAway','moveTarget','idleRoomOffset'])delete u[k];};
function validateOccupations(s){for(const map of [s,...Object.values(s.worldMaps||{})]){const state=map.occupations;if(state===undefined)continue;if(!state||state.version!==1||!Number.isInteger(state.nextId)||state.nextId<1||!Array.isArray(state.camps)||state.camps.length>2000)throw Error('Acampamentos inválidos.');const ids=new Set(),rooms=new Set(),units=new Set((map.units||[]).map(u=>u.id));let total=(map.units||[]).length;for(const c of state.camps){if(!Number.isInteger(c.id)||c.id<1||c.id>=state.nextId||ids.has(c.id)||!Number.isFinite(c.resources)||c.resources<0||c.resources>1e9||!Number.isInteger(c.lastIncomeTurn)||c.lastIncomeTurn<0||c.lastIncomeTurn>s.turn||typeof c.engaged!=='boolean'||!Array.isArray(c.rooms)||!c.rooms.length||new Set(c.rooms).size!==c.rooms.length||c.rooms.some(id=>!map.rooms[id]?.captured||map.rooms[id].campId!==c.id||rooms.has(id))||!Array.isArray(c.units)||c.units.length>3000)throw Error('Domínio inimigo inválido.');ids.add(c.id);for(const id of c.rooms)rooms.add(id);for(const u of c.units){if(!u||!Object.hasOwn({...UNITS,...ENEMIES},u.type)||u.type==='immortal'||u.team!=='enemy'||u.campId!==c.id||!Number.isInteger(u.id)||u.id<1||units.has(u.id)||!c.rooms.includes(u.home)||!['x','y','hp','maxHp','power','shield','cooldown','attack','walk','stun'].every(k=>Number.isFinite(u[k]))||u.hp<=0||u.maxHp<=0||u.hp>u.maxHp||u.power<=0||u.power>1e7||!c.rooms.includes(`${Math.round(u.x)},${Math.round(u.y)}`)||u.range!==undefined&&(!Number.isFinite(u.range)||u.range<0||u.range>5)||u.size!==undefined&&(!Number.isFinite(u.size)||u.size<=0||u.size>5))throw Error('Tropa acampada inválida.');units.add(u.id);if(++total>3000)throw Error('Tropas demais.');}}for(const r of Object.values(map.rooms))if(r.campId!==undefined&&!ids.has(r.campId))throw Error('Ocupação órfã.');for(const u of map.units||[])if(u.campId!==undefined&&!ids.has(u.campId))throw Error('Ocupante órfão.');}}
function installOccupations(Game){const old={};for(const n of ['income','update','beginCombat','active','neighbors','reconnectCaptured','endCombat','lose','action','spreadHazards','reviveEnemy','connectRooms','worldSnapshot'])old[n]=Game.prototype[n];Object.assign(Game.prototype,{
 worldSnapshot(){this.migrateOccupations();return old.worldSnapshot.call(this);},
 occupationState(){return this.s.occupations??={version:1,nextId:1,camps:[]};},
 campUnits(){return this.s.occupations?.camps.flatMap(c=>c.units.filter(u=>u.hp>0))||[];},
 campFor(r){return this.s.occupations?.camps.find(c=>c.id===r?.campId)||null;},
 occupyRoom(r,u){const state=this.occupationState();let camp=this.campFor(r);if(!camp){const linked=this.rooms.filter(n=>n.captured&&n.campId&&this.linked(r,n)).map(n=>this.campFor(n)).filter(Boolean);camp=linked[0];if(!camp){camp={id:state.nextId++,rooms:[],resources:0,lastIncomeTurn:this.s.turn,units:[],engaged:false};state.camps.push(camp);}for(const other of new Set(linked))if(other!==camp){camp.resources+=other.resources;camp.engaged=camp.engaged||other.engaged;camp.units.push(...other.units);camp.rooms.push(...other.rooms);camp.lastIncomeTurn=Math.max(camp.lastIncomeTurn,other.lastIncomeTurn);for(const p of other.rooms)this.s.rooms[p].campId=camp.id;for(const v of [...camp.units,...this.s.units])if(v.campId===other.id)v.campId=camp.id;state.camps=state.camps.filter(c=>c!==other);}r.captured=true;r.campId=camp.id;camp.rooms.push(campKey(r));this._routeCache=null;this.note(`${ROOMS[r.type].name} tomada pelos invasores.`,'warn');this.effect('Sala tomada',`${ROOMS[r.type].name} está sob controle inimigo. A estrutura foi preservada. O acampamento administra sua própria reserva de recursos.`,'bad');}u.campId=camp.id;return camp;},
 settleInvader(u,r){this.s.campDisengagement=true;const camp=this.campFor(r)||this.occupyRoom(r,u),copy={...u,hp:u.hp,home:campKey(r),campId:camp.id,x:r.x,y:r.y};clearCampWalk(copy);delete copy.burrowing;delete copy.burrowStep;copy.attack=0;copy.walk=0;camp.units.push(copy);u.hp=0;if(!this.enemies.some(v=>v.campId===camp.id))camp.engaged=false;r.garrison=[];if(!camp.announced){camp.announced=true;this.effect('Acampamento inimigo','Os invasores se instalaram na área isolada. A cada turno recebem a maior profundidade sob controle mais um recurso por sala e usam essa reserva para obter reforços.','bad');}this.note('Invasores se instalaram na área desconectada. Reconecte para retomá-la.','warn');},
 migrateOccupations(){if(this.s.occupations)return;this.occupationState();for(const r of this.rooms.filter(r=>r.captured)){const camp=this.occupyRoom(r,{});for(const record of r.garrison||[]){const u=this.addUnit(record.type,r.x,r.y,true,'enemy',record.power);this.s.units=this.s.units.filter(v=>v!==u);u.campId=camp.id;u.enemyName=record.enemyName||ENEMIES[u.type]?.name||UNITS[u.type]?.name||u.type;camp.units.push(u);}r.garrison=[];}},
 active(r){return !r?.captured&&old.active.call(this,r);},
 neighbors(r,team='ally',u=null){const list=old.neighbors.call(this,r,team,u);return u?.campIdle?list.filter(n=>n.campId===u.campId&&!this.barricade(r,n)):list;},
 campRoomUsable(r){return r&&!r.damaged&&!r.closed&&this.supported(r)&&!this.roomHazards(r).length;},
 campRecruitment(camp){const owned=camp.rooms.map(id=>this.s.rooms[id]).filter(r=>this.campRoomUsable(r)),rooms=owned.filter(r=>!r.builtPartOf&&(r.playerBuilt||ROOMS[r.type].r!==undefined));const options=[];for(const r of rooms)for(const [type,d]of Object.entries(UNITS)){if(d.recruitable===false||type==='hero'||!d.homes.includes(r.type)||d.requires&&!owned.some(p=>p.type===d.requires))continue;if(type==='undead'&&r.type==='crypt'&&!camp.units.some(u=>u.type==='cleric'&&u.home===campKey(r)))continue;options.push({type,cost:d.cost,power:d.power,home:r});}return options;},
 recruitCamp(camp,choice,replica=false){if(this.s.units.length+this.campUnits().length>=3000)return null;const r=choice.home,cost=replica?choice.power:choice.cost;if(cost>camp.resources)return null;const u=this.addUnit(choice.type,r.x,r.y,true,'enemy',choice.power);this.s.units=this.s.units.filter(v=>v!==u);if(replica){const id=u.id;Object.assign(u,structuredClone(choice.template),{id,x:r.x,y:r.y,home:campKey(r),hp:choice.template.maxHp,shield:0,attack:0,walk:0,stun:0,cooldown:0});}for(const field of ['capturedSource','sourceId','revivedFrom','twinId'])delete u[field];u.shot=false;u.campId=camp.id;u.team='enemy';u.enemyName=replica?(choice.template.enemyName||ENEMIES[u.type]?.name||UNITS[u.type]?.name):UNITS[u.type].name;u.range??=UNITS[u.type]?.range??ENEMIES[u.type]?.range;delete u.burrowing;delete u.burrowStep;clearCampWalk(u);camp.units.push(u);camp.resources=Math.max(0,camp.resources-cost);return u;},
 occupationIncome(){for(const camp of this.occupationState().camps){if(camp.engaged||camp.lastIncomeTurn>=this.s.turn)continue;camp.lastIncomeTurn=this.s.turn;const rooms=camp.rooms.map(id=>this.s.rooms[id]);const income=Math.max(0,...rooms.map(r=>r.y))+rooms.length;camp.resources=Math.min(1e9,camp.resources+income);const options=this.campRecruitment(camp),replica=options.length===0,recruits=[];for(let n=0;n<3000;n++){let choices=replica?camp.units.filter(u=>u.hp>0&&u.power<=camp.resources).map(u=>({type:u.type,power:u.power,cost:u.power,home:this.s.rooms[u.home],template:u})):options.filter(o=>o.cost<=camp.resources&&camp.units.filter(u=>u.home===campKey(o.home)).length<this.capacity(o.home));choices=choices.filter(o=>this.campRoomUsable(o.home));choices.sort((a,b)=>b.power-a.power||a.cost-b.cost||a.type.localeCompare(b.type));if(!choices.length)break;const u=this.recruitCamp(camp,choices[0],replica);if(!u)break;recruits.push(u);}if(income||recruits.length){this.effect('Reforços do acampamento',`O acampamento recebeu ${income} recursos (${Math.max(0,...rooms.map(r=>r.y))} de profundidade + ${rooms.length} salas). ${recruits.length?recruits.length+' unidade(s) '+(replica?'replicada(s) pela força.':'recrutada(s) pelas construções.'):'Nenhuma unidade pôde ser recrutada.'} Reserva restante: ${Math.round(camp.resources*100)/100}.`,'bad');this.note(`O acampamento inimigo recebeu ${income} recursos e reuniu ${recruits.length} reforços.`,'warn');}}},
 connectRooms(a,b){const result=old.connectRooms.call(this,a,b);if(this.s.occupations?.camps.length)this.reconnectCaptured();return result;},
 beginCombat(){if(this._campReviving)return;if(!this.s.combat)delete this.s.campDisengagement;return old.beginCombat.call(this);},
 income(){const result=old.income.call(this);this.occupationIncome();return result;},
 reconnectCaptured(){this.migrateOccupations();for(const camp of this.occupationState().camps){if(camp.engaged&&!camp.units.length||!camp.rooms.some(id=>this.path(this.s.rooms[id],this.target,'ally')!==null))continue;camp.engaged=true;for(const u of camp.units){clearCampWalk(u);delete u.campIdle;u.shot=false;this.s.units.push(u);}const count=camp.units.length;camp.units=[];this.effect('Retomada da área ocupada',`${count} ocupantes, incluindo seus reforços, retomaram o combate. As salas só serão liberadas após a vitória.`,'bad');this.note('A reconexão despertou os ocupantes da área tomada.','danger');}if(this.enemies.length)this.beginCombat();this.clearDefeatedCamps();},
 clearDefeatedCamps(){for(const u of this.s.units)if(u.campId&&u.team!=='enemy')delete u.campId;const state=this.occupationState();for(const camp of [...state.camps])if(camp.units.length===0&&!this.enemies.some(u=>u.campId===camp.id)){for(const id of camp.rooms){const r=this.s.rooms[id];r.captured=false;delete r.campId;r.garrison=[];}state.camps=state.camps.filter(c=>c!==camp);this.effect('Área recuperada','A guarnição inimiga foi derrotada. As salas voltaram ao controle da fortaleza. A reserva do acampamento foi encerrada.','good');}},
 endCombat(){this.clearDefeatedCamps();if(this.s.campDisengagement){delete this.s.campDisengagement;this.s.combat=false;this.s.paused=false;this.projectiles=[];this.effects=[];this.dead=[];this.s.capturePool=[];return;}return old.endCombat.call(this);},
 lose(){const result=old.lose.call(this);if(result!==false&&this.s.occupations){for(const r of this.rooms){delete r.campId;r.captured=false;r.garrison=[];}this.s.occupations={version:1,nextId:1,camps:[]};delete this.s.campDisengagement;}return result;},
 action(name,x,y,arg){if(name==='repair'&&this.room(x,y)?.captured)return{ok:false,reason:'Reconecte a área e vença seus ocupantes antes de reparar.'};return old.action.call(this,name,x,y,arg);},
 reviveEnemy(u,...args){const camp=this.s.occupations?.camps.find(c=>c.id===u.campId);if(!camp)return old.reviveEnemy.call(this,u,...args);if(camp.engaged){const v=old.reviveEnemy.call(this,u,...args);if(v)v.campId=camp.id;return v;}const existing=camp.units.find(v=>v.revivedFrom===u.id);if(existing)return existing;this._campReviving=true;let v;try{v=old.reviveEnemy.call(this,u,...args);}finally{this._campReviving=false;}if(v){this.s.units=this.s.units.filter(w=>w!==v);v.campId=camp.id;camp.units.push(v);}return v;},
 spreadHazards(){const result=old.spreadHazards.call(this);for(const camp of this.s.occupations?.camps||[]){for(const u of [...camp.units]){const at=this.room(Math.round(u.x),Math.round(u.y));if(u.hp>0&&this.lethalHazard(at,u))this.killInstant(u);}camp.units=camp.units.filter(u=>u.hp>0);}this.clearDefeatedCamps();return result;},
 update(dt){this.migrateOccupations();const result=old.update.call(this,dt);if(this.s.status==='playing'&&!this.s.paused&&!(this.presentationEnabled&&this.s.effectCards?.length))for(const camp of this.occupationState().camps)if(!camp.engaged){const roster=camp.units.filter(u=>u.hp>0);for(const u of roster)u.campIdle=true;this.idleUpdate(Math.min(.1,dt),roster,new Set(camp.rooms));}return result;}
 });}


// world-events.js
const eventKey=r=>`${r.x},${r.y}`;
const gases=['gas','flammable','miasma','blindgas'];
function validWorldEventInput(i){return i?.kind==='world-event'&&i.action==='wanderers'&&Number.isInteger(i.count)&&i.count>=3&&i.count<=5;}
function installWorldEvents(Game){const old={};for(const n of ['passable','lineOfSight','directions','openPassage','buildReason','resolveEffect','reviveEnemy'])old[n]=Game.prototype[n];Object.assign(Game.prototype,{
 emptyCollapseCave(r){return r?.type==='cave'&&!r.playerBuilt&&!r.bossRoot&&!r.builtPartOf&&!r.discoveryRoot&&!r.wyrdId&&!r.exhausted;},
 supportedByColumns(r){return !!r&&DIRS.some(([dx,dy])=>this.room(r.x+dx,r.y+dy)?.type==='columns');},
 collapseCandidates(){return this.rooms.filter(r=>this.emptyCollapseCave(r)&&!this.supportedByColumns(r)&&r.y>=0&&!DIRS.some(([dx,dy])=>{const n=this.room(r.x+dx,r.y+dy);return this.linked(r,n)&&(n.playerBuilt||ROOMS[n.type]?.r!==undefined||n.type==='gate');}));},
 overflowSteps(r,hazard,origins){const gas=gases.includes(hazard);return DIRS.filter(([dx,dy])=>this.s.activePlane===5||!(gas&&dy===1||!gas&&dy===-1)).map(([dx,dy])=>this.room(r.x+dx,r.y+dy)).filter(n=>n&&n.type!=='collapse'&&this.linked(r,n)&&!this.barricade(r,n)&&!n.closed&&(gas||!['bridge','drawbridge'].includes(n.type)&&!(n.type==='pump'&&!n.pumpOpen))&&!this.roomHazards(n).includes(hazard)&&origins.some(id=>!n.drainedSources?.includes(id)));},
 overflowCandidates(){const out=[];for(const r of this.rooms){if(r.type==='collapse')continue;for(const hazard of this.roomHazards(r)){if(!['water','lava','crater',...gases].includes(hazard))continue;const origins=r.hazardOrigins?.length?r.hazardOrigins:[eventKey(r)];if(this.overflowSteps(r,hazard,origins).length)out.push({room:r,hazard,origins});}}return out;},
 scheduledEventOptions(){return [...(this.banditSpawnCandidates().length?['bandits']:[]),...(this.overflowCandidates().length?['dam']:[]),...(this.collapseCandidates().length?['collapse']:[]),'wanderers'];},
 triggerScheduledEvent(discovery){const schedule=this.initializeRaidSchedule();if(!discovery?.ok||discovery.pending||!discovery.card||this.s.status!=='playing'||this.s.activePlane!=null||this.s.turn<schedule.nextTurn)return null;const options=this.scheduledEventOptions(),type=options[this.roll(options.length)-1];if(type==='bandits')return this.triggerBanditRaid(discovery);const result=this.runWorldEvent(type);if(result?.ok){schedule.serial++;schedule.lastTurn=this.s.turn;schedule.nextTurn=this.s.turn+banditInterval(this.s.seed,schedule.serial);}return result;},
 runWorldEvent(type){if(type==='wanderers'){const count=2+this.roll(3);this.effect('Andarilhos',`${count} capangas pedem abrigo. Acolhê-los traz aliados leais ao portão, mas custa 2 de moral. Se recusar, há 50% de chance de atacarem a partir do espaço válido mais profundo da fortaleza.`,'neutral',{kind:'world-event',action:'wanderers',count});return{ok:true,type,count};}if(type==='dam')return this.breakDam();if(type==='collapse'){const choices=this.collapseCandidates();if(!choices.length)return{ok:false};return this.collapseCave(choices[this.roll(choices.length)-1]);}return{ok:false};},
 breakDam(){const candidates=this.overflowCandidates();if(!candidates.length)return{ok:false};const chosen=candidates[this.roll(candidates.length)-1],{hazard,origins}=chosen,affected=[],front=[chosen.room];for(let i=0;i<2;i++){const choices=[...new Set(front.flatMap(r=>this.overflowSteps(r,hazard,origins)))];if(!choices.length)break;const at=choices[this.roll(choices.length)-1];front.push(at);if(gases.includes(hazard))at.gas=hazard;else at.fluid=hazard==='water'&&this.layer(at)===1?'lava':hazard;at.contaminant=at.gas||at.fluid;at.hazardOrigins=[...new Set([...(at.hazardOrigins||[]),...origins.filter(id=>!at.drainedSources?.includes(id))])];if(['lava','crater'].includes(at.fluid)&&!this.s.artifacts.includes('lava'))this.damageRoom(at);affected.push(eventKey(at));}this.effect('Quebra de barragem',`${ROOMS[chosen.room.type].name} sofreu uma ruptura. ${affected.length} espaço(s) adicional(is) foram atingidos por ${ROOMS[hazard]?.name||hazard}. Portas reforçadas, pontes e demais proteções mantêm suas regras de contenção.`,'bad');this.note(`Uma barragem cedeu. ${affected.length} espaços foram alcançados pelo perigo.`,'danger');this.spreadHazards();return{ok:true,type:'dam',affected};},
 collapseCave(start){if(!this.emptyCollapseCave(start)||this.supportedByColumns(start))return{ok:false};const cells=[];let at=start;while(this.emptyCollapseCave(at)&&!this.supportedByColumns(at)){cells.push(at);const below=this.room(at.x,at.y+1);if(!this.linked(at,below))break;at=below;}const ids=new Set(cells.map(eventKey)),buried=new Set(),groups=new Set(cells.map(r=>r.cavernGroup).filter(Boolean));for(const r of this.rooms)if(groups.has(r.cavernGroup))delete r.cavernGroup;for(const r of cells){r.type='collapse';r.variant=this.roll(3)-1;r.closed=false;r.damaged=false;for(const k of ['fluid','gas','contaminant','extraFluid','hazardOrigins','cavernGroup'])delete r[k];}
  for(const u of [...this.s.units,...this.campUnits()])if(u.hp>0&&ids.has(`${Math.round(u.x)},${Math.round(u.y)}`)){u.buried=true;buried.add(u.id);this.killInstant(u);}this.s.units=this.s.units.filter(u=>u.hp>0);this.dead=this.dead.filter(u=>!buried.has(u.id));this.s.fallenTwins=(this.s.fallenTwins||[]).filter(v=>!buried.has(v.unit.id));this.s.graveyardFallen=(this.s.graveyardFallen||[]).filter(u=>!buried.has(u.id));for(const w of this.s.workers||[])if(ids.has(`${Math.round(w.x)},${Math.round(w.y)}`)){w.alive=false;w.hp=0;}
  for(const camp of this.occupationState().camps){camp.rooms=camp.rooms.filter(id=>!ids.has(id));camp.units=camp.units.filter(u=>u.hp>0);for(const u of camp.units)if(ids.has(u.home)){u.home=eventKey(this.room(Math.round(u.x),Math.round(u.y)));delete u.casualPlan;u.moveTarget=null;}}for(const r of cells){r.captured=false;delete r.campId;for(const key of ['fluid','gas','contaminant','extraFluid','hazardOrigins'])delete r[key];}this.s.occupations.camps=this.s.occupations.camps.filter(c=>c.rooms.length);for(const u of this.s.units)if(u.campId&&!this.s.occupations.camps.some(c=>c.id===u.campId))delete u.campId;this._routeCache=null;this._tacticsDirty=true;this.effect('Desabamento',`${cells.length} caverna(s) desabaram, matando ${buried.size} unidade(s). Os escombros são permanentes: não permitem passagem nem escavação. Dica: construa pilares para reforçar o próprio espaço e as cavernas vizinhas nas quatro direções, interrompendo também desabamentos em cadeia.`,'bad');this.note(`A montanha cedeu. ${cells.length} cavernas foram soterradas.`,'danger');this.spreadHazards();return{ok:true,type:'collapse',cells:[...ids],deaths:buried.size};},
 passable(r,...args){return r?.type!=='collapse'&&old.passable.call(this,r,...args);},
 lineOfSight(a,b,melee=false){if(!old.lineOfSight.call(this,a,b,melee))return false;const ax=Math.round(a.x),ay=Math.round(a.y),bx=Math.round(b.x),by=Math.round(b.y),n=Math.abs(bx-ax)+Math.abs(by-ay);for(let i=0;i<=n;i++)if(this.room(ax+Math.sign(bx-ax)*i,ay+Math.sign(by-ay)*i)?.type==='collapse')return false;return true;},
 directions(origin){return old.directions.call(this,origin).filter(d=>this.room(d.x,d.y)?.type!=='collapse');},
 openPassage(a,b){if(this.room(a?.x,a?.y)?.type==='collapse'||this.room(b?.x,b?.y)?.type==='collapse')return{ok:false,reason:'Escombros permanentes não podem ser escavados.'};return old.openPassage.call(this,a,b);},
 buildReason(type,r){return r?.type==='collapse'?'Os escombros são permanentes e não podem ser escavados.':old.buildReason.call(this,type,r);},
 reviveEnemy(u,...args){return u.buried?null:old.reviveEnemy.call(this,u,...args);},
 resolveEffect(id,selection){const card=this.s.effectCards?.[0];if(card?.id!==id||card.input?.kind!=='world-event')return old.resolveEffect.call(this,id,selection);if(!['accept','reject'].includes(selection))return{ok:false,reason:'Escolha acolher ou recusar os andarilhos.'};const count=card.input.count;if(selection==='accept'){if(this.s.units.length+this.campUnits().length+count>3000)return{ok:false,reason:'Não há espaço para mais tropas. Você pode recusar o grupo.'};const gate=this.room(0,0);for(let n=0;n<count;n++){const u=this.addUnit('thug',gate.x,gate.y,true);u.refugee=true;}this.s.baseMorale-=2;this.s.effectCards.shift();this.effect('Andarilhos acolhidos',`${count} capangas leais se juntaram à guarnição do portão. A fortaleza perdeu 2 de moral.`,'good');this.note(`${count} andarilhos leais encontraram abrigo na fortaleza.`,'good');this.checkMutiny();return{ok:true};}const attack=this.roll(2)===1,origin=this.banditSpawnCandidates()[0];this.s.effectCards.shift();if(attack&&origin&&this.s.units.length+this.campUnits().length+count<=3000){for(let n=0;n<count;n++){const u=this.addUnit('thug',origin.x,origin.y,true,'enemy',UNITS.thug.power);u.enemyName='Andarilho hostil';}this.effect('Andarilhos hostis',`O grupo recusado atacou pela profundidade ${origin.y}: ${count} capangas hostis.`,'bad');this.beginCombat();}else this.effect('Andarilhos partiram','O grupo deixou a fortaleza sem iniciar um ataque.','neutral');return{ok:true};}
 });}


// engine.js
const key=(x,y)=>`${x},${y}`;
const distance=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
class Game {
 constructor({seed=Date.now(),name='A Última Fortaleza',difficulty='normal',challengeOptions={layers:false,runes:[]}}={}){
  this.s={layerVersion:2,layerHistory:{base:{current:challengeOptions.runes?.includes('nightmares')?7:0,transitions:[]}},research:newResearch(),challengeOptions:{layers:challengeOptions.layers===true,runes:Array.isArray(challengeOptions.runes)?challengeOptions.runes:[]},version:1,riseVersion:1,lives:3,rulesVersion:2,immortalVersion:1,barricadeVersion:1,barricades:{},rivalDungeons:[],effectCards:[],nextEffectId:1,passageVersion:1,passages:{},seed:(Number(seed)>>>0)||123456789,name:String(name).slice(0,40),difficulty:DIFFICULTIES[difficulty]?difficulty:'normal',turn:1,resources:20,gold:20,baseMorale:10,rooms:{},units:[],deck:[],discard:[],jokerAdded:false,combat:false,paused:false,speed:1,status:'playing',built:false,traded:false,turnReady:true,kills:0,battles:0,maxDepth:0,blessings:0,inventions:0,trophies:0,artifacts:[],expedition:null,voidDefeated:false,log:[],nextId:1,seconds:0,card:null};
  this.projectiles=[];this.effects=[];this.dead=[];this.events=[];this.tickBudget=0;
  this.addRoom(0,0,'gate');for(let i=0;i<5;i++)this.addUnit('soldier',0,0,true);
  this.shuffleDeck();this.initializeRaidSchedule(true);this.occupationState();
  this.note('Os portões se abrem. Cinco guerreiros leais aguardam suas ordens.','good');
 }
 // Reuse paths across frames only while every graph input is unchanged.
 // Mutating operations still clear _routeCache immediately inside a scope.
 withQueryCache(fn,reuse=true){if(this._queryDepth){this._queryDepth++;try{return fn()}finally{this._queryDepth--}}const signature=JSON.stringify([this.s.rooms,this.s.passages,this.s.barricades,this.s.cellBars,this.s.secretPassages,this.s.artifacts,this.s.magicFlags,this.s.discoveredInventions,this.s.activePlane,this.s.units.filter(u=>u.team==='neutral'||u.type==='immortal'||u.type==='golem').map(u=>[u.id,u.type,u.team,u.hp>0,u.territory])]);if(this._queryRooms!==this.s.rooms||this._querySignature!==signature){this._queryPaths=new Map();this._querySignature=signature;this._queryRooms=this.s.rooms;}this._routeCache=reuse?this._queryPaths:new Map();this._queryDepth=1;try{return fn()}finally{this._queryDepth=0;if(reuse&&this._routeCache!==this._queryPaths){this._querySignature=null;this._queryPaths=null;}this._routeCache=null;}}
 get rooms(){return Object.values(this.s.rooms)}
 get allies(){return this.s.units.filter(u=>u.team==='ally'&&u.hp>0)}
 get defenders(){return this.allies.filter(u=>u.type!=='rat')}
 get enemies(){return this.s.units.filter(u=>u.team==='enemy'&&u.hp>0)}
 get target(){return this.rooms.find(r=>r.type==='throne'&&!r.damaged)||this.room(0,0)}
 random(){let t=this.s.seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);this.s.seed>>>=0;return((t^t>>>14)>>>0)/4294967296}
 roll(n){return 1+Math.floor(this.random()*n)}
 note(text,kind='info'){this.s.log.unshift(makeChronicleRecord(this.s,text,kind));this.s.log=this.s.log.slice(0,100);this.events.push({type:'log',text,kind})}
 effect(title,description,tone='neutral',input=null){
  this.s.effectCards??=[];this.s.nextEffectId??=1;
  const card={id:this.s.nextEffectId++,title,description,tone,input};this.s.effectCards.push(card);this.events.push({type:'effect-card',id:card.id});return card;
 }
 effectTargets(card){
  if(card?.input?.kind!=='unit-home')return[];const unit=this.s.units.find(u=>u.id===card.input.unitId&&u.team==='ally'&&u.hp>0);if(!unit)return[];
  return this.rooms.filter(r=>this.active(r)&&(r.type==='gate'||UNITS[unit.type]?.homes.includes(r.type)&&this.allies.filter(u=>u.id!==unit.id&&u.home===key(r.x,r.y)).length<this.capacity(r))).map(r=>({x:r.x,y:r.y,label:ROOMS[r.type].name}));
 }
 resolveEffect(id,selection=null){
  const card=this.s.effectCards?.[0];if(!card||card.id!==id)return{ok:false,reason:'Aguarde a carta anterior.'};
  if(card.input?.kind==='unit-home'){
   const unit=this.s.units.find(u=>u.id===card.input.unitId&&u.team==='ally'&&u.hp>0),targets=this.effectTargets(card);
   if(unit&&targets.length){const target=targets.find(r=>r.x===selection?.x&&r.y===selection?.y);if(!target)return{ok:false,reason:'Escolha uma sala válida para receber o guerreiro.'};unit.home=key(target.x,target.y);unit.x=target.x;unit.y=target.y;unit.moveTarget=null;this._tacticsDirty=true;}
  }else if(card.input?.kind==='prison'){
   if(!['release','leave'].includes(selection))return{ok:false,reason:'Escolha libertar a criatura ou mantê-la presa.'};
   if(selection==='release'){const r=this.room(card.input.x,card.input.y);if(r?.type==='ancientprison')this.releasePrison(r);}
  }
  this.s.effectCards.shift();return{ok:true};
 }
 releasePrison(r){r.type='cave';if(this.roll(4)===4){this.addUnit('beast',r.x,r.y,true);this.note('Uma criatura libertada jurou proteger a fortaleza.','good');this.effect('Criatura libertada','A criatura tornou-se uma fera leal à fortaleza.','good')}else{this.spawnEnemies(r,60+Math.max(0,r.y)*5,'beast');this.effect('Prisioneiro hostil','A criatura libertada se revoltou e iniciou um combate.','bad');this.beginCombat()}}
 room(x,y){return this.s.rooms[key(x,y)]}
 addRoom(x,y,type){const r={x,y,type,variant:this.roll(3)-1,damaged:false,closed:false,prisoners:0,usedTurn:0,trap:null,barricade:null,secret:false,contaminant:null};this.s.rooms[key(x,y)]=r;if(type==='invincible')this.placeImmortal(r);if(type==='golemforge')this.placeGolem(r);return r}
 passageKey(a,b){return [key(a.x,a.y),key(b.x,b.y)].sort().join('|')}
 linked(a,b){return !!a&&!!b&&distance(a,b)===1&&this.s.passages[this.passageKey(a,b)]===true}
 connectRooms(a,b){if(!a||!b||!this.room(a.x,a.y)||!this.room(b.x,b.y)||distance(a,b)!==1)return false;this.s.passages[this.passageKey(a,b)]=true;this._routeCache=null;this._tacticsDirty=true;return true}
 barricade(a,b){const d=a&&b&&this.s.barricades[this.passageKey(a,b)];return d?.hp>0?d:null}
 passageDefenses(r){return DIRS.map(([dx,dy])=>this.room(r.x+dx,r.y+dy)).filter(n=>n&&this.linked(r,n)).map(n=>({room:n,id:this.passageKey(r,n),door:this.s.barricades[this.passageKey(r,n)]||null}))}
 fortifyPassage(a,b,kind){
  if(this.s.status!=='playing'||this.s.combat)return{ok:false,reason:'Instale portas fora de combate.'};
  if(!a||!b||!this.linked(a,b))return{ok:false,reason:'Escolha uma passagem já aberta entre duas salas.'};
  if(!['defensive','offensive'].includes(kind))return{ok:false,reason:'Tipo de barricada inválido.'};
  if(!this.has('masonry'))return{ok:false,reason:'Exige Pedraria.'};
  if(!this.active(a)&&!this.active(b))return{ok:false,reason:'A passagem precisa alcançar uma sala ativa.'};
  if(this.s.barricades[this.passageKey(a,b)]?.hp>0)return{ok:false,reason:'Esta passagem já tem uma porta reforçada.'};
  const gold=kind==='defensive'?10:20;if(this.s.gold<gold)return{ok:false,reason:'Riquezas insuficientes.'};
  this.s.gold-=gold;this.s.barricades[this.passageKey(a,b)]={kind,level:1,hp:kind==='defensive'?400:160};this._routeCache=null;this._tacticsDirty=true;
  this.note('Porta reforçada instalada no corredor. Bloqueia invasores, tiros, líquidos e gases.','good');return{ok:true};
 }
 upgradePassage(a,b){
  const d=this.barricade(a,b);if(this.s.combat||this.s.status!=='playing'||!d||d.level>=3)return{ok:false,reason:'Porta indisponível para aprimorar.'};
  if(this.s.resources<10)return{ok:false,reason:'Aprimorar custa 10♥.'};this.s.resources-=10;d.level++;d.hp+=d.kind==='defensive'?400:160;this._routeCache=null;this._tacticsDirty=true;return{ok:true};
 }
 damageBarricade(a,b,amount){
  const d=this.barricade(a,b);if(!d)return;d.hp=Math.max(0,d.hp-amount);
  if(d.hp===0){this._routeCache=null;this._tacticsDirty=true;this.note('Uma porta reforçada foi destruída. O corredor ficou desprotegido.','danger');this.effect('Porta destruída','A passagem perdeu sua proteção. Invasores, líquidos e gases agora podem atravessá-la.','bad');this.spreadHazards();this.events.push({type:'door-destroyed'})}
 }
 sealedBlock(x,y){return !this.room(x,y)&&this.rooms.find(r=>r.type==='sealed'&&!r.sealOpened&&Math.abs(r.x-x)<=1&&Math.abs(r.y-y)<=1)}
 openSealedRoom(r,byDamage=false){
  if(r?.type!=='sealed')return false;
  r.type='cave';r.sealOpened=true;r.damaged=false;r.closed=false;this._routeCache=null;this._tacticsDirty=true;
  this.magic(false);this.note(byDamage?'A câmara selada foi rompida pelo dano. A maldição foi liberada e a exploração ao redor está desbloqueada.':'Câmara aberta. A maldição foi liberada e a exploração ao redor está desbloqueada.','warn');
  this.resumeRivalDungeons();if(!this.s.combat&&!this.enemies.length)this.settleRivalDungeons();return true;
 }
 damageRoom(r){if(!r)return;if(r.type==='sealed'){this.openSealedRoom(r,true);return}if(this.damageable(r))r.damaged=true}
 directions(origin=null){
  const out=[];if(this.s.status!=='playing'||this.s.combat)return out;
  for(const r of origin?[origin]:this.rooms){if(!this.active(r)||this.guardedGolem(r)||this.territorialGuard(r)||this.blockedByImmortal(r))continue;
   for(const [dx,dy]of DIRS){const x=r.x+dx,y=r.y+dy,n=this.room(x,y);
    if(x< -20||x>20||y< -6||y>30||this.linked(r,n))continue;
    // Empty surface cells are built directly; they are never explored.
    if(!n&&((y<0&&![0,5].includes(this.s.activePlane))||this.sealedBlock(x,y)))continue;
    out.push({x,y,from:{x:r.x,y:r.y},dx,dy,kind:n?'passage':'explore'});
   }
  }return out;
 }
 explorationTurn(){
  if(!this.s.turnReady){this.finishTurnInterrogations();this.s.turn++;this.s.built=false;this.s.traded=false;this.income();}
  this.s.turnReady=false;return true;
 }
 openPassage(from,to){
  if(this.s.status!=='playing'||this.s.combat)return{ok:false,reason:'Resolva o combate antes de abrir passagens.'};
  const a=from&&this.room(from.x,from.y),b=to&&this.room(to.x,to.y);
  if(!a||!b||distance(a,b)!==1)return{ok:false,reason:'Escolha duas salas vizinhas já descobertas.'};
  if(this.linked(a,b))return{ok:false,reason:'Essa passagem já está aberta.'};
  if(!this.active(a))return{ok:false,reason:'Abra a passagem a partir de uma sala ativa da fortaleza.'};
  if(!this.explorationTurn())return{ok:false,reason:'Um portal iniciou uma invasão antes da abertura.'};
  this.connectRooms(a,b);if(this.fluidSource(b))b.flowActive=true;if(this.fluidSource(a))a.flowActive=true;
  this.note(`Passagem aberta entre ${ROOMS[a.type].name} e ${ROOMS[b.type].name}.`,'good');
  this.spreadHazards();this.checkMutiny();this.reconnectCaptured();
  return{ok:true,room:b,passage:true};
 }
 addUnit(type,x,y,loyal=false,team='ally',power=null){
  const d=(team!=='ally'?ENEMIES[type]:UNITS[type])||UNITS[type]||{power:power||5,speed:0.65,range:0.42};const p=power||d.power||5;
  const u={id:this.s.nextId++,type,team,loyal:loyal||d.mutiny===0,power:p,hp:p*8,maxHp:p*8,shield:0,x,y,home:key(x,y),cooldown:this.random()*0.6,attack:0,walk:0,shot:false,stun:0,order:'defend',size:d.size||1,facing:1};this.s.units.push(u);this._tacticsDirty=true;return u;
 }
 shuffleDeck(){this.s.deck=[];for(const suit of SUITS)for(let rank=1;rank<=13;rank++)this.s.deck.push({suit,rank});if(this.jokersUnlocked()&&this.s.jokerAdded){for(const joker of ['red','black'])if(!(this.s.jokerCooldown?.[joker]>this.s.turn))this.s.deck.push({suit:'★',rank:0,joker});}for(let i=this.s.deck.length-1;i>0;i--){const j=Math.floor(this.random()*(i+1));[this.s.deck[i],this.s.deck[j]]=[this.s.deck[j],this.s.deck[i]]}}
 enforceJokerDepth(){if(!this.jokersUnlocked()){this.s.deck=this.s.deck.filter(c=>c.suit!=='★');this.s.discard=this.s.discard.filter(c=>c.suit!=='★');this.s.jokerAdded=false;}}
 jokersUnlocked(){return (this.s.activePlane==null?this.s.maxDepth:(this.s.worldMaps?.base?.maxDepth||0))>=5}
 draw(depth=0){
  this.enforceJokerDepth();
  if(this.jokersUnlocked()&&!this.s.jokerAdded){this.s.jokerAdded=true;for(const joker of ['red','black'])if(!this.s.deck.some(c=>c.suit==='★'&&(c.joker||'black')===joker))this.s.deck.splice(Math.floor(this.random()*(this.s.deck.length+1)),0,{suit:'★',rank:0,joker});this.note('Profundidade 5. Os coringas despertam no baralho.','warn')}
  if(!this.s.deck.length){this.shuffleDeck();this.s.discard=[]}
  const c=this.s.deck.pop();this.s.discard.push(c);return c;
 }
 fluidSource(r){if(r?.type==='crater'&&r.craterPart==='dry')return null;return ['water','lava','crater'].includes(r?.sourceType)?r.sourceType:['water','lava','crater'].includes(r?.type)?r.type:null}
 roomHazards(r){
  if(!r)return [];
  let hazards=[...new Set([ROOMS[r.type]?.hazard&&!(r.type==='crater'&&r.craterPart==='dry')?r.type:null,r.fluid,r.gas,r.contaminant].filter(Boolean))];
  if(['bridge','drawbridge','pump'].includes(r.type))hazards=hazards.filter(h=>!['water','lava','crater'].includes(h));
  return hazards;
 }
 immune(u,h){return u.type==='golem'||u.type==='automaton'||(u.team==='ally'&&h==='water'&&this.s.artifacts.includes('water'))||(u.team==='ally'&&['lava','crater'].includes(h)&&this.s.artifacts.includes('lava'))}
 lethalHazard(r,u){return this.roomHazards(r).some(h=>['water','lava','crater','gas'].includes(h)&&!this.immune(u,h))}
 blockedByImmortal(r){r=this.encounterRoot(r);return !!r?.immortalId&&this.s.units.some(u=>u.id===r.immortalId&&u.type==='immortal'&&u.hp>0)}
 placeImmortal(r){
  const existing=this.s.units.find(u=>u.type==='immortal'&&u.home===key(r.x,r.y)&&u.hp>0);if(existing){r.immortalId=existing.id;return existing}
  const u=this.addUnit('immortal',r.x,r.y,true,'neutral',1);r.immortalId=u.id;r.closed=false;return u;
 }
 placeGolem(r){
  if(r.golemDefeated)return null;
  const existing=this.s.units.find(u=>u.type==='golem'&&u.home===key(r.x,r.y)&&u.hp>0&&u.team!=='ally');if(existing){r.golemId=existing.id;return existing}
  const power=Math.max(1,Math.round((40+Math.max(0,r.y)*5)*DIFFICULTIES[this.s.difficulty].enemy)),u=this.addUnit('golem',r.x,r.y,true,'neutral',power);u.enemyName=ENEMIES.golem.name;r.golemId=u.id;return u;
 }
 guardedGolem(r){r=this.encounterRoot(r);return r?.type==='golemforge'&&this.s.units.some(u=>u.id===r.golemId&&u.hp>0&&u.team!=='ally')}
 passable(r,team='ally',unit=null){return !!r&&!r.closed&&!this.blockedByImmortal(r)&&!(team==='enemy'&&r.secret)&&!(team==='ally'&&r.trap?.level>=3&&!r.trap?.passable&&!unit?.traits?.includes(7))&&!(unit&&this.lethalHazard(r,unit))}
 neighbors(r,team='ally',unit=null){return DIRS.map(([dx,dy])=>this.room(r.x+dx,r.y+dy)).filter(n=>this.linked(r,n)&&this.passable(n,team,unit))}
 anchor(u){return this.s.rooms[u.moveTarget]||this.room(Math.round(u.x),Math.round(u.y))}
 path(start,end,team='ally',unit=null){
  const sk=typeof start==='string'?start:key(Math.round(start.x),Math.round(start.y));
  const ek=typeof end==='string'?end:key(Math.round(end.x),Math.round(end.y));
  const ck=`${sk}|${ek}|${team}|${unit?.type||'-'}|${unit?.team||'-'}|${unit?.power||'-'}|${(unit?.traits||[]).join(',')}|${!!unit?.flying}|${!!unit?.cosmic}|${unit?.defendingTerritory||'-'}|${unit?.campId||'-'}:${!!unit?.campIdle}|${team==='enemy'&&unit?this.unitData(unit).speed:'-'}`;if(this._routeCache?.has(ck))return this._routeCache.get(ck);
  const finish=result=>{if(this._routeCache?.size>=4096)this._routeCache.delete(this._routeCache.keys().next().value);this._routeCache?.set(ck,result);return result};
  if(!this.s.rooms[sk]||!this.s.rooms[ek])return finish(null);
  if(sk===ek)return finish([]);
  if(!this.passable(this.s.rooms[ek],team,unit))return finish(null);
  const open=[{k:sk,cost:0}],cost=new Map([[sk,0]]),prev=new Map([[sk,null]]);
  while(open.length){
   open.sort((a,b)=>a.cost-b.cost);const {k,cost:spent}=open.shift();if(spent!==cost.get(k))continue;
   if(k===ek){const out=[];let t=ek;while(t!==sk){out.unshift(this.s.rooms[t]);t=prev.get(t)}return finish(out)}
   for(const n of this.neighbors(this.s.rooms[k],team,unit)){
    const nk=key(n.x,n.y),door=this.barricade(this.s.rooms[k],n),step=(team==='enemy'&&door?door.hp/Math.max(1,(unit?.power||10)*1.8)*(unit?this.unitData(unit).speed:.65):0)+(n.type==='mud'?2:team==='enemy'&&n.type==='puzzle'?3:1);
    const nc=spent+step;if(nc>=(cost.get(nk)??Infinity))continue;cost.set(nk,nc);prev.set(nk,k);open.push({k:nk,cost:nc});
   }
  }return finish(null);
 }
 damageable(r){return !!r&&(!!r.builtPartOf||!!r.planarReward||r.type==='sealed'||DAMAGEABLE_ROOMS.includes(r.type))}
 supported(r){return [0,5].includes(this.s.activePlane)||r.y>=-1||!!this.room(r.x,r.y+1)&&!this.room(r.x,r.y+1).damaged&&this.supported(this.room(r.x,r.y+1))}
 active(r){if(r?.builtPartOf){const root=this.s.rooms[r.builtPartOf];return !!root&&this.active(root)&&!r.damaged&&!this.roomHazards(r).length;}return !!r&&(!r.footprint||r.footprint.every(id=>{const p=this.s.rooms[id];return p&&!p.damaged&&!this.roomHazards(p).length&&this.supported(p)&&this.path(p,this.target,'ally',{type:'soldier'})!==null}))&&!this.guardedGolem(r)&&this.supported(r)&&!r.damaged&&!this.roomHazards(r).length&&this.passable(r)&&this.path(r,this.target,'ally',{type:'soldier'})!==null}
 has(type){return this.rooms.some(r=>r.type===type&&this.active(r))}
 nearby(r,type,radius=2){return this.rooms.filter(n=>n.type===type&&Math.abs(n.x-r.x)<=radius&&Math.abs(n.y-r.y)<=radius&&this.active(n))}
 capacities(){return{resources:50+50*this.rooms.filter(r=>r.type==='warehouse'&&this.active(r)).length,gold:50+50*this.rooms.filter(r=>r.type==='treasury'&&this.active(r)).length}}
 gain(r=0,g=0){const c=this.capacities(),before={resources:this.s.resources,gold:this.s.gold};this.s.resources=clamp(this.s.resources+r,0,c.resources);this.s.gold=clamp(this.s.gold+g,0,c.gold);const resources=Math.max(0,this.s.resources-before.resources),gold=Math.max(0,this.s.gold-before.gold);if(resources||gold)this.events.push({type:'resource-gain',resources,gold})}
 morale(){let m=this.s.baseMorale;for(const r of this.rooms){if(this.roomHazards(r).includes('miasma')&&this.isHousing(r))m-=3;if(!this.active(r))continue;m+=({tavern:5,arena:5,parlor:15,games:10,sewer:20,springs:2,quarters:1,mansion:5,miasma:-3}[r.type]||0);if(r.type==='laundry')m+=2*this.rooms.filter(n=>this.isHousing(n)&&Math.abs(n.x-r.x)<=2&&Math.abs(n.y-r.y)<=2&&this.active(n)).length}m-=this.allies.filter(u=>u.type==='rat').length;if(this.s.artifacts.includes('morale'))m+=20;if(this.s.artifacts.includes('cat'))m+=10;return Math.round(m)}
 isHousing(r){return Object.values(UNITS).some(u=>u.homes.includes(r.type))}
 surfaceSites(){
  if([0,5].includes(this.s.activePlane))return[];const out=new Map();for(const r of this.rooms)for(const [dx,dy]of DIRS){const x=r.x+dx,y=r.y+dy;
   if(y>=0||y< -6||Math.abs(x)>20||this.room(x,y))continue;
   out.set(key(x,y),{x,y,type:'surface',variant:0,damaged:false});
  }return [...out.values()];
 }
 site(x,y){return this.room(x,y)||this.surfaceSites().find(r=>r.x===x&&r.y===y)}
 surfaceReason(r){
  if(!r||r.y>=0)return 'Escolha um terreno na superfície.';
  if(r.y< -1&&!this.room(r.x,r.y+1))return 'Sem apoio: construa primeiro a sala imediatamente abaixo.';
  if(r.y< -1&&this.room(r.x,r.y+1).damaged)return 'Repare a sala de apoio abaixo antes de construir.';
  if(!DIRS.some(([dx,dy])=>{const n=this.room(r.x+dx,r.y+dy);return n&&this.active(n)}))return 'Conecte a construção à fortaleza.';
  return '';
 }
 advanceTurn(){
  if(this.s.status!=='playing'||this.s.combat)return {ok:false,reason:'Resolva o combate antes de encerrar o turno.'};
  this.finishTurnInterrogations();this.s.turn++;this.s.built=false;this.s.traded=false;this.s.turnReady=true;this.income();this.spreadHazards();this.checkMutiny();this.note('Um novo turno começa. Prepare a fortaleza antes de explorar.');return {ok:true};
 }
 frontier(){const out=new Map();for(const d of this.directions())if(d.kind==='explore')out.set(key(d.x,d.y),{x:d.x,y:d.y});return [...out.values()]}
 explore(x,y,from=null){
  if(this.s.status!=='playing'||this.s.combat)return{ok:false,reason:'Resolva o combate antes de explorar.'};
  if(y<0&&![0,5].includes(this.s.activePlane))return{ok:false,reason:'A superfície não precisa ser explorada. Construa diretamente.'};
  if(this.sealedBlock(x,y))return{ok:false,reason:'Uma câmara selada bloqueia a exploração nesta área de 3×3. Abra a câmara primeiro.'};
  const choices=this.directions().filter(d=>d.x===x&&d.y===y&&d.kind==='explore');
  const choice=from?choices.find(d=>d.from.x===from.x&&d.from.y===from.y):choices.length===1?choices[0]:null;
  if(!choice)return{ok:false,reason:'Escolha a seta da sala de origem para explorar nessa direção.'};
  const approach=this.room(choice.from.x,choice.from.y),depth=[0,5].includes(this.s.activePlane)?Math.abs(x)+Math.abs(y):Math.max(0,y);
  if(!this.explorationTurn())return{ok:false,reason:'Um portal iniciou uma invasão antes da exploração.'};
  if(this.fluidSource(approach)&&(x!==approach.x||y>approach.y))approach.flowActive=true;
  this.s.maxDepth=Math.max(this.s.maxDepth,depth);let c=this.drawDiscovery(depth);if(this.s.activePlane===3&&c.suit==='♠')c={...c,originalSuit:c.suit,suit:'♣'};if(this.s.activePlane===6&&c.suit==='♣')c={...c,originalSuit:c.suit,suit:'♠'};if([4,12].includes(this.s.activePlane)&&c.suit==='♦')c={...c,originalSuit:c.suit,suit:'♥'};if(this.s.activePlane===11&&c.suit==='♦')c={...c,alternative:'foreign-prison'};
  while(depth<=1&&c.suit==='♠')c=this.drawDiscovery(y);
  if(this.hasRune('war')&&c.rank>=11&&['♥','♦'].includes(c.suit))c={...c,alternative:'siege'};this.s.card=c;let type='cave',enemy=0,enemyType='raider';let msg='',formation=null,wyrdId=0;
  if(this.s.activePlane==null&&y>=12&&!this.rooms.some(r=>r.type==='void')&&!this.s.artifacts.includes('void')){type='void';enemy=110;enemyType='guardian';msg='O Cristal do Vazio! Seu guardião ancestral desperta.'}
  else if(this.s.activePlane!=null&&depth>=6&&!this.s.planeWon){type='void';enemy=100+this.s.activePlane*15;enemyType='guardian';msg='O guardião deste plano defende um artefato.';}
  else if(c.alternative==='foreign-prison'){type='prison';msg='Uma cela de prisioneiros foi encontrada.';}
  else if(c.alternative==='siege'){type='desolate';enemy=40;enemyType='raider';msg='Um acampamento de cerco foi revelado.';}
  else if(c.suit==='♥'||c.suit==='♦'){
   let value=c.rank+depth;if(c.suit==='♥'&&this.hasRune('drought'))value=Math.floor(value/2);if(c.suit==='♦'&&(this.hasRune('greed')||this.layerForDiscovery(x,y)===5))value*=2;if(c.suit==='♦'&&this.layerForDiscovery(x,y)===3)value=0;
   if(c.suit==='♦'&&this.rooms.some(r=>r.type==='inspection'&&Math.abs(r.x-x)<=2&&Math.abs(r.y-y)<=2&&this.active(r)))value*=2;
   if(c.suit==='♦'&&this.rooms.some(r=>r.type==='altar'&&(r.dedication||'fortune')==='fortune'&&this.active(r)&&Math.abs(r.x-x)<=3&&Math.abs(r.y-y)<=3&&this.allies.some(u=>u.type==='cleric'&&u.home===key(r.x,r.y))))value+=3*this.shrineMultiplier(this.rooms.find(r=>r.type==='altar'&&(r.dedication||'fortune')==='fortune'&&this.active(r)&&Math.abs(r.x-x)<=3&&Math.abs(r.y-y)<=3));
   if(c.suit==='♦'&&this.s.magicFlags?.diamondDust){value=0;this.s.magicFlags.diamondDust=false;}if(c.suit==='♦'&&this.layerForDiscovery(x,y)===3)value=0;c.bonus=value-c.rank;this.gain(c.suit==='♥'?value:0,c.suit==='♦'?value:0);msg=`${c.suit} ${c.rank} · Você encontrou ${value} ${c.suit==='♥'?'recursos':'riquezas'}.`;
   if(c.rank===13&&c.suit==='♦'&&this.has('games')){this.s.gold=Math.floor(this.s.gold/2);this.note('A banca quebrou: a Sala de Jogos perdeu metade das riquezas.','warn')}
  }else if(c.suit==='♣'){
   let n=c.rank;if(n===1&&depth>=5){wyrdId=this.tableCard().rank;n=0;type=WYRD[wyrdId-1][1];}else type=NATURAL[n-1];
   if(n===2)type=['gas','flammable','miasma','blindgas'][this.roll(4)-1];
   if(n===3){this.magic(this.roll(2)===1);type='fairy';formation={type,count:1,enchanted:true};}
   if(n===4){const liquid=this.roll(4);type=[1,3].includes(liquid)?'water':'lava';formation={type,count:liquid<=2?5:this.roll(4),axis:'horizontal',sourceKind:['river','magmaflow','lake','magmapool'][liquid-1]};}
   if(n===6)formation={type,count:this.roll(2)};
   if(n===7){formation={type,count:this.roll(2)};enemy=10*formation.count;enemyType='insect'}
   if(n===8)formation={type,count:31-y,axis:'down'};
   if(n===9){enemy=10+Math.max(0,y)*5;enemyType='cavewolf'}
   if(n===10){enemy=40+Math.max(0,y)*5;enemyType='troll'}
   if(n===11){enemy=20+Math.max(0,y)*5;enemyType='worm'}
   if(n===12)msg='Uma criatura imortal bloqueia a câmara. Apenas morte instantânea pode derrotá-la.';
   if(n===13){this.s.baseMorale+=1;this.effect('Criatura perdida','O encontro com a criatura perdida aumentou a moral em 1.','good');msg='Uma criatura perdida atravessa a caverna e desaparece. +1 moral.'}
   if(n===16)this.magic(this.roll(2)===1);
   if(n===18){enemy=10*this.roll(8)+Math.max(0,y)*5;enemyType='elemental'}
   if(n===17)formation={type,count:this.roll(4)};
   if(n===19){const count=this.roll(4);formation={type,count};enemy=10*count;enemyType='insect'}
   if(n===20){enemy=40+Math.max(0,y)*5;enemyType='troll'}
   msg=msg||`♣ ${c.rank} · ${ROOMS[type].name}.`;
  }else if(c.suit==='♠'){
   ({type,enemy,enemyType}=this.resolveRemnant(c,x,y));msg=`♠ ${c.rank} · ${ROOMS[type].name}.`;
  }else{type='artifact';msg=c.joker==='black'?'O coringa preto despertou uma monstruosidade.':'O coringa vermelho revelou um artefato lendário.';}
  if(y<=1&&type==='burrow'){type='cave';enemy=0;msg=`${c.suit} ${c.rank} · Caverna vazia.`;}
  // Protect the gate's starting strip before hazards can spread or kill units.
  if(y<=1&&Math.abs(x)<=2&&['lava','crater'].includes(type)){type='cave';msg=`${c.suit} ${c.rank} · Uma caverna de rocha vulcânica fria.`;}
  const r=this.addRoom(x,y,type);if(c.alternative==='foreign-prison'){r.foreignCell=true;r.prisoners=c.rank;}if(formation?.enchanted){r.enchanted=true;r.enchantedIndex=this.roll(6)-1;}this.connectRooms(approach,r);r.rewardPending=enemy>0;r.flowActive=this.s.activePlane===5||!(['water','lava','crater'].includes(type)&&approach?.x===x&&approach?.y===y-1);if(c.suit==='♠'&&c.rank===7)r.damaged=true;
  let formed=null;if(formation?.type===type){r.sourceKind=formation.sourceKind;formed=this.expandFormation(r,formation.count,{axis:formation.axis});if(['nest','hive'].includes(type))enemy=10*formed.length;}
  if(c.suit==='♠'&&['ruins','mine','ancientlibrary','desolate','shaft','city','labyrinth'].includes(type)){const count=type==='ancientlibrary'?this.roll(2):type==='desolate'?this.roll(4)+2:this.roll(4);formed=this.expandFormation(r,count,{axis:type==='shaft'?'up':null});if(['ruins','city'].includes(type))enemy=10*formed.length;if(type==='desolate')enemy=20*formed.length;if(type==='shaft'){enemy=15*formed.length;enemyType='miner';}if(type==='mine')this.gain(0,20+2*Math.max(...formed.map(p=>p.y)));}
  this.note(msg,enemy?'danger':'good');
  if(type==='mushrooms'){if(this.roll(2)===1){this.s.baseMorale+=5;this.effect('Banquete de cogumelos','A colheita elevou a moral da fortaleza em 5.','good')}else{this.gain(10,0);this.effect('Colheita de cogumelos','A colheita concedeu até 10♥, respeitando a capacidade do armazém.','good')}}
  if(type==='ancientprison')this.effect('Prisão antiga','Uma criatura está presa nesta sala. Deseja libertá-la ou mantê-la aprisionada?','neutral',{kind:'prison',x,y});
  if(type==='springs')this.effect('Fonte termal','As águas termais aumentam a moral em 2 enquanto esta sala estiver ativa.','good');
  if(ROOMS[type]?.hazard)this.effect(ROOMS[type].name,ROOMS[type].desc,'bad');
  if(enemy>0)this.spawnEnemies(r,enemy,enemyType);
  if(type==='hive'&&formed?.length===4){this.spawnEnemies(r,40,'insectqueen');for(const part of formed)part.bossRoot=key(r.x,r.y);}
  if(type==='shaft')for(const unit of this.enemies.filter(u=>u.home===key(r.x,r.y)))unit.range=2.05;
  if(type==='rivalhold')this.expandRivalDungeon(r);if(c.suit==='★')this.resolveJoker(c,r);
  if(type==='cave'&&!wyrdId)this.expandEmptyCavern(r);
  else if(!formed&&(type==='dragon'||type==='golemforge'||enemy>0&&ENEMIES[enemyType]?.single))this.expandEmptyCavern(r,this.bossCavernSize((type==='dragon'?100+Math.max(0,y)*5:type==='golemforge'?40+Math.max(0,y)*5:enemy)*DIFFICULTIES[this.s.difficulty].enemy));
  this.spreadHazards();
  this.prepareEncounter(r);if(wyrdId)this.prepareWyrd(r,wyrdId);
  this.checkMutiny();
  if(this.enemies.length)this.beginCombat();
  this.events.push({type:'explore',room:r,card:c});return{ok:true,room:r,card:c};
 }
 // A single discovery reveals one connected chamber, with no extra cards or rewards.
 bossCavernSize(strength){return strength>=100?4:strength>=60?3:strength>=30?2:1}
 emptyCavernSize(){const roll=this.roll(100);return roll<=89?1:roll<=96?2:roll<=99?3:4}
 expandEmptyCavern(root,size=this.emptyCavernSize()){
  if(!root||root.cavernGroup)return [];
  const id=key(root.x,root.y),members=[root],wanted=clamp(Math.floor(size)||1,1,4);root.cavernGroup=id;if(root.type!=='cave')root.bossRoot=id;
  while(members.length<wanted){
   const options=[];
   for(const from of members)for(const [dx,dy]of DIRS){const x=from.x+dx,y=from.y+dy;
    if(x< -20||x>20||(y<0&&![0,5].includes(this.s.activePlane))||y< -6||y>30||this.room(x,y)||this.sealedBlock(x,y))continue;
    // Never engulf another already known room or bypass its unopened wall.
    options.push({from,x,y});
   }
   if(!options.length)break;
   const pick=options[this.roll(options.length)-1],room=this.addRoom(pick.x,pick.y,'cave');room.cavernGroup=id;if(root.bossRoot)room.bossRoot=id;members.push(room);this.connectRooms(pick.from,room);
   // All touching modules of this one chamber share an open interior.
   for(const other of members)if(distance(room,other)===1)this.connectRooms(room,other);
   this.s.maxDepth=Math.max(this.s.maxDepth,room.y);
  }
  root.cavernSize=members.length;
  if(members.length>1)this.note(`Uma caverna ampla se estende por ${members.length} espaços.`, 'good');
  return members;
 }
 expandFormation(root,count,options={}){
  const plan=planFormation(this,root,count,options),id=key(root.x,root.y),members=[root];root.discoveryRoot=id;
  for(const p of plan.slice(1)){const part=this.addRoom(p.x,p.y,root.type);part.discoveryRoot=id;part.flowActive=root.flowActive;part.sourceKind=root.sourceKind;members.push(part);}
  root.discoveryMembers=members.map(r=>key(r.x,r.y));root.formationSize=members.length;
  for(const a of members)for(const b of members)if(distance(a,b)===1)this.connectRooms(a,b);
  for(const r of members)this.s.maxDepth=Math.max(this.s.maxDepth,r.y);
  if(members.length>1)this.note(`${ROOMS[root.type].name}: ${members.length} espaços contínuos.`,'good');return members;
 }
 resolveRemnant(c,x,y){
  let type='ruins',enemy=0,enemyType='raider';
  const n=c.rank<=10?c.rank:10+this.roll(14);type=REMNANTS[n-1];
   if([1,2].includes(n)){enemy=({1:10,2:20,10:40,11:40,13:50}[n])+Math.max(0,y)*5;enemyType=n===2?'skeleton':n===10?'golem':'goblin'}
   // Mine reward is resolved after its actual footprint is known.
   if(n===7){type=['barracks','library','warehouse','kitchen'][this.roll(4)-1]}
   if(n===8)this.libraryDiscovery(x,y);
   if(n===11){this.s.blessings++;this.note('Um artefato encantado concede +6% de dano permanente.','good');this.effect('Artefato encantado','O artefato concede +6% de dano permanente às suas tropas.','good')}
   if(n===13||n===14||n===15||n===17||n===21||n===23){enemy=({13:50,14:30,15:30,17:40,18:50,21:40,23:60}[n])+Math.max(0,y)*5;enemyType=n===21?'golem':n===15?'miner':n===23?'champion':n===18?'lich':'goblin'}
   if(n===16)this.magic(false);
  return{type,enemy,enemyType};
 }
 resolveRivalRoom(room,group,pending){
  let card=this.draw(room.y);while(card.rank===0)card=this.draw(room.y);
  const result=this.resolveRemnant({...card,suit:'♠'},room.x,room.y);room.type=result.type;if(result.type==='mine')this.gain(0,20+2*room.y);
  if(result.type==='golemforge'){const guard=this.placeGolem(room);if(guard)group.enemyIds.push(guard.id)}
  if(result.type==='ancientprison')this.effect('Prisão antiga','Uma criatura está presa nesta sala. Deseja libertá-la ou mantê-la aprisionada?','neutral',{kind:'prison',x:room.x,y:room.y});
  room.rewardPending=result.enemy>0;room.rivalCard={suit:card.suit,rank:card.rank};if(card.rank===7)room.damaged=true;
  if(result.enemy>0){if(this.s.combat)group.fought=true;const start=this.s.units.length;this.spawnEnemies(room,result.enemy,result.enemyType);group.enemyIds.push(...this.s.units.slice(start).map(u=>u.id))}this.prepareEncounter(room);
  if(result.type==='rivalhold')pending.push(room);this.s.maxDepth=Math.max(this.s.maxDepth,room.y);
 }
 growRivalDungeon(group,pending){
  while(group.members.length<group.requested){
   const options=[];let blocked=false;
   for(const id of group.members){const from=this.s.rooms[id];for(const [dx,dy]of DIRS){const x=from.x+dx,y=from.y+dy;if(x<-20||x>20||y<0||y>30||this.room(x,y))continue;if(this.sealedBlock(x,y)){blocked=true;continue}options.push({from,x,y})}}
   if(!options.length){group.complete=!blocked;break}
   const choice=options[Math.floor(this.random()*options.length)],room=this.addRoom(choice.x,choice.y,'cave');this.connectRooms(choice.from,room);group.members.push(key(room.x,room.y));this.resolveRivalRoom(room,group,pending);
  }
  if(group.members.length>=group.requested)group.complete=true;
  if(!group.fought)group.claimed=group.complete&&!group.enemyIds.length;
 }
 expandRivalDungeon(origin){
  this.s.rivalDungeons??=[];const pending=[origin],expanded=new Set(this.s.rivalDungeons.map(d=>d.root));
  for(let index=0;index<pending.length;index++){
   const root=pending[index],rootKey=key(root.x,root.y);if(expanded.has(rootKey))continue;expanded.add(rootKey);
   const group={root:rootKey,requested:this.roll(10)+2,members:[rootKey],enemyIds:[],fought:false,claimed:false,complete:false};this.s.rivalDungeons.push(group);
   this.resolveRivalRoom(root,group,pending);this.growRivalDungeon(group,pending);
   this.note(`Masmorra rival revelada automaticamente: ${group.members.length} salas de ${group.requested} sorteadas.${!group.complete?' Uma câmara selada bloqueia a continuação.':''}`,'warn');
   this.events.push({type:'rival-dungeon',root:rootKey,rooms:group.members.slice()});
  }
  for(let i=this.s.rivalDungeons.length-1;i>=0;i--){const group=this.s.rivalDungeons[i];for(const child of this.s.rivalDungeons.slice(i+1))if(group.members.includes(child.root)){group.enemyIds=[...new Set([...group.enemyIds,...child.enemyIds])];group.fought||=child.fought;}if(!group.fought)group.claimed=group.complete&&!group.enemyIds.length;}
 }
 resumeRivalDungeons(){
  if(this._resumingRivals)return;this._resumingRivals=true;
  try{const nested=[];for(const group of this.s.rivalDungeons||[])if(group.complete===false)this.growRivalDungeon(group,nested);for(const room of nested)this.expandRivalDungeon(room)}finally{this._resumingRivals=false}
 }
 settleRivalDungeons(){
  for(const group of this.s.rivalDungeons||[]){
   if(group.claimed||group.complete===false||!group.fought||group.members.some(id=>this.s.rooms[id]?.captured))continue;
   group.claimed=true;this.gain(0,group.members.length*10);this.note(`Masmorra rival conquistada! ${group.members.length} espaços: +${group.members.length*10}♦.`,'good');
  }
 }
 portalInvasions(){
  for(const r of this.rooms){
   if(!['portal','stabilizer'].includes(r.type)||r.closed||r.portalCheckedTurn===this.s.turn)continue;
   r.portalCheckedTurn=this.s.turn;r.portalRoll=this.roll(4);
   if(r.portalRoll===1){
    const before=this.s.units.length;this.spawnEnemies(r,r.chaosPortal?30:20+Math.max(0,r.y)*5,'raider');
    this.note(`Invasão pelo portal em ${r.x},${r.y}! Rolagem 1/4: ${this.s.units.length-before} invasores atravessaram.`,'danger');this.events.push({type:'portal-invasion',room:{x:r.x,y:r.y}});this.effect('Invasão planar',`Invasores atravessaram o portal em ${r.x}, ${r.y}. Prepare-se para o combate.`,'bad');
   }else this.note(`Portal em ${r.x},${r.y}: rolagem ${r.portalRoll}/4. Nenhuma invasão neste turno.`);
  }
 }
 income(){
  let res=0,gold=0;const payouts=[];
  for(const r of this.rooms){if(r.discoveryRoot&&r.discoveryRoot!==key(r.x,r.y)||!this.active(r)||r.wyrdId||r.foreignCell)continue;const beforeRes=res,beforeGold=gold,sourceType=r.planarReward==='honey'?'hive':r.type;let productionCard=null;
   res+=r.legendaryForest?20:r.type==='forest'||r.planarReward==='honey'?2:0;gold+=({mine:2,parlor:2,elemental:4,city:3}[r.type]||0);if(r.type==='hive')res+=2;
   if(r.type==='crystal'){const card=this.draw(Math.max(0,r.y));productionCard={...card,bonus:this.layerReward(card,card.rank+Math.max(0,r.y),r)-card.rank};if(card.suit==='♦'&&card.rank===1&&this.layer(r)!==3){for(const part of this.rooms.filter(p=>p===r||r.discoveryRoot&&p.discoveryRoot===r.discoveryRoot)){part.type='cave';part.exhausted=true;}this.events.push({type:'producer-destroyed',source:key(r.x,r.y),sourceType:'crystal',x:r.x,y:r.y,card:productionCard});this.effect('Caverna esgotada','O cristal se esgotou. A sala continua transitável, mas não produz mais riquezas e não pode receber construções.','neutral');this.note('Uma caverna de cristal se esgotou. O espaço continua transitável.','warn')}else gold+=this.layerReward(card,card.rank+Math.max(0,r.y),r)}
   if(r.type==='prison'&&r.prisoners===20)gold+=20;
   if(r.type==='games')gold+=5*this.rooms.filter(n=>this.isHousing(n)&&Math.abs(n.x-r.x)<=2&&Math.abs(n.y-r.y)<=2).length;
   if(res>beforeRes||gold>beforeGold)payouts.push({resources:res-beforeRes,gold:gold-beforeGold,source:key(r.x,r.y),sourceType,x:r.x,y:r.y,card:productionCard});



  }
  if(this.s.artifacts.includes('forest')&&!this.s.receivedPlanarRewards?.includes(4))res+=4;if(this.s.artifacts.includes('honey')&&!this.s.receivedPlanarRewards?.includes(9))res+=10;
  if(this.s.artifacts.includes('magic'))this.magic(true);
  this.portalInvasions();
  const beforeR=this.s.resources,beforeG=this.s.gold,beforeEvents=this.events.length;this.gain(res,gold);const event=this.events.at(-1);if(this.events.length>beforeEvents&&event?.type==='resource-gain'){this.events.splice(beforeEvents);let remainingR=Math.max(0,this.s.resources-beforeR),remainingG=Math.max(0,this.s.gold-beforeG);for(const p of payouts){const resources=Math.min(remainingR,p.resources),gold=Math.min(remainingG,p.gold);remainingR-=resources;remainingG-=gold;if(resources||gold)this.events.push({type:'resource-gain',...p,resources,gold});else if(p.card)this.events.push({type:'producer-trigger',...p,resources:0,gold:0});}if(remainingR||remainingG)this.events.push({type:'resource-gain',resources:remainingR,gold:remainingG});}else for(const p of payouts)if(p.card)this.events.push({type:'producer-trigger',...p,resources:0,gold:0});if(res||gold)this.note(`Produção da fortaleza: +${res}♥ · +${gold}♦.`,'good');
  if(this.enemies.length)this.beginCombat();
 }
 cost(type,r){const d=ROOMS[type];if(!d||d.r===undefined)return null;let res=d.r+Math.max(0,-r.y),gold=d.g||0;if(type==='solitary'&&this.rooms.some(n=>n.type==='prison'&&distance(n,r)===1))res=5;if(this.nearby(r,'workshop').length){res=Math.ceil(res/2);gold=Math.ceil(gold/2)}return{resources:res,gold}}
 buildFootprint(type,r){return r?planFormation(this,r,BUILD_FOOTPRINTS[type]||1,{build:true}):[]}
 buildReason(type,r){
  if(!r)return'Selecione uma sala explorada.';if(r.builtPartOf)return'Este espaço faz parte de uma sala construída.';const d=ROOMS[type];if(!d||d.r===undefined)return'Construção inválida.';
  if(this.s.status!=='playing')return'A campanha terminou.';if(this.s.combat)return'Construção indisponível em combate.';if(this.s.built)return'Uma sala por turno. Explore para iniciar outro turno.';
  if(r.craterRoot&&!['bridge','drawbridge'].includes(type))return'A cratera só pode receber pontes.';
  if(r.exhausted)return'A caverna esgotada não pode receber construções.';
  if(r.y<0){const reason=this.surfaceReason(r);if(reason)return reason;}
  else if(['bridge','drawbridge'].includes(type)&&this.roomHazards(r).length){if(r.damaged)return'Drene e repare a sala danificada antes de construir.';if(this.path(r,this.target)===null)return'A ponte precisa estar conectada.';}
  else if(!this.active(r))return this.roomHazards(r).length?'Drene o fluido ou gás antes de usar a sala.':'A sala precisa estar conectada e reparada.';
  if(d.on&&r.type!==d.on)return`Exige ${ROOMS[d.on].name}.`;
  if(!d.on&&!['surface','smalllair','largelair','burrow','wandering','elemental','hive','hungry','artifact','desolate','shaft','rivalmine','city','tomb','challenge','rivalhold','cave','forest','nest','ruins','mine','crystal','mushrooms','springs','fairy','vault','columns','mud','labyrinth','ancientlibrary','ancienttemple'].includes(r.type)&&!(r.type==='dragon'&&r.dragonAwake)&&!(d.hazard||['bridge','drawbridge'].includes(type)&&ROOMS[r.type].hazard))return'Essa sala já está ocupada.';
  if(this.roomHazards(r).some(h=>!['water','lava','crater'].includes(h)))return'Drene o gás antes de construir.';
  if(this.roomHazards(r).length&&!['bridge','drawbridge'].includes(type))return'Drene o perigo ou construa uma Ponte.';
  if(d.unique&&this.has(type))return'Só uma construção deste tipo é permitida.';
  if(d.requires?.some(t=>!this.has(t)))return`Exige: ${d.requires.map(t=>ROOMS[t].name).join(', ')}.`;
  if(this.fluidSource(r)&&!['bridge','drawbridge'].includes(type))return'Fontes naturais só podem receber pontes.';
  if(this.buildFootprint(type,r).length<(BUILD_FOOTPRINTS[type]||1))return`Esta sala exige ${BUILD_FOOTPRINTS[type]} espaços livres conectados.`;
  const c=this.cost(type,r);if(this.s.resources<c.resources||this.s.gold<c.gold)return'Recursos insuficientes.';return'';
 }
 build(type,x,y){let r=this.site(x,y);const reason=this.buildReason(type,r);if(reason)return{ok:false,reason};const c=this.cost(type,r),footprint=this.buildFootprint(type,r);if(!this.room(x,y)){const source=(y<0&&this.active(this.room(x,y+1))?this.room(x,y+1):null)||DIRS.map(([dx,dy])=>this.room(x+dx,y+dy)).find(n=>n&&this.active(n));r=this.addRoom(x,y,'cave');this.connectRooms(source,r);}this.s.resources-=c.resources;this.s.gold-=c.gold;const source=this.fluidSource(r);if(['bridge','drawbridge'].includes(type)&&source)r.sourceType=source;r.type=type;r.variant=source&&['bridge','drawbridge'].includes(type)?r.variant:this.roll(3)-1;r.contaminant=null;r.playerBuilt=true;delete r.bossRoot;this.s.built=true;
  if(footprint.length>1){const id=key(x,y);r.footprint=footprint.map(p=>key(p.x,p.y));const members=[r];for(const p of footprint.slice(1)){const part=this.room(p.x,p.y)||this.addRoom(p.x,p.y,'cave');part.builtPartOf=id;part.playerBuilt=true;delete part.bossRoot;members.push(part);}for(const a of members)for(const b of members)if(distance(a,b)===1)this.connectRooms(a,b);}
  if(type==='library')this.magic(true);if(type==='altar'){this.addUnit('cleric',x,y,true);this.queueRise('dedicate',r,'Dedicação do altar','Escolha a divindade deste altar. Seus efeitos exigem um clérigo.');}if(type==='tavern')this.addUnit('hero',x,y,true);this.spreadHazards();this.note(`${ROOMS[type].name} construída. −${c.resources}♥${c.gold?` −${c.gold}♦`:''}.`,'good');return{ok:true};
 }
 housing(type){const d=UNITS[type];if(!d)return[];if(d.requires&&!this.has(d.requires))return[];return this.rooms.filter(r=>d.homes.includes(r.type)&&this.active(r)&&this.capacity(r)>this.allies.filter(u=>u.home===key(r.x,r.y)).length&&(!(r.type==='hut'||r.type==='quarters')||this.allies.filter(u=>u.home===key(r.x,r.y)).reduce((a,u)=>a+u.power,0)+d.power<=(r.type==='hut'?30:50)))}
 capacity(r){const base={barracks:10,kennel:5,library:5,temple:3,altar:1,sewer:20,laboratory:10,forge:2,siegepost:2,golemforge:2,hut:10,quarters:10,tavern:1,crypt:20,breeder:1,meadhall:10}[r.type]||0;return base+2*this.rooms.filter(n=>n.type==='dormitory'&&distance(n,r)===1&&this.active(n)).length}
 recruitmentReason(type){
  const d=UNITS[type];if(!d)return 'Unidade inválida.';
  if(this.s.status!=='playing'||this.s.combat)return 'Recrutamento indisponível agora.';
  if(!this.s.artifacts.includes('loyal')&&d.mutiny>0&&this.morale()-(type==='rat'?1:0)<d.mutiny)return `Moral insuficiente: exige ${d.mutiny}${type==='rat'?' após recrutar o rato':''}. Motim imediato bloqueado.`;
  if(this.s.gold<d.cost)return 'Riquezas insuficientes.';
  if(!this.housing(type).length)return 'Construa um abrigo apropriado com vagas.';
  return '';
 }
 recruit(type,home=null){
  const blocked=this.recruitmentReason(type);if(blocked)return{ok:false,reason:blocked};const d=UNITS[type];if(!d)return{ok:false,reason:'Unidade inválida.'};if(this.s.gold<d.cost)return{ok:false,reason:'Riquezas insuficientes.'};const homes=this.housing(type);const r=(home&&homes.find(r=>key(r.x,r.y)===home))||homes[0];if(!r)return{ok:false,reason:'Construa um abrigo apropriado com vagas.'};
  this.s.gold-=d.cost;this.addUnit(type,r.x,r.y,this.s.artifacts.includes('loyal'));this.note(`${d.name} recrutado em ${ROOMS[r.type].name}.`,'good');this.checkMutiny();return{ok:true};
 }
 trade(direction,amount=1){if(this.s.status!=='playing'||this.s.combat||this.s.traded)return{ok:false,reason:'Uma troca por turno, fora de combate.'};if(!Number.isInteger(amount)||amount<1)return{ok:false,reason:'Quantidade inválida.'};const c=this.capacities();if(direction==='gold'){amount=Math.min(amount,this.s.gold,Math.floor((c.resources-this.s.resources)/2));if(amount<1)return{ok:false,reason:'Sem riquezas ou espaço no armazém.'};this.s.gold-=amount;this.s.resources+=amount*2;this.events.push({type:'resource-gain',resources:amount*2,gold:0});}else{amount=Math.min(amount,Math.floor(this.s.resources/2),c.gold-this.s.gold);if(amount<1)return{ok:false,reason:'Sem recursos ou espaço na tesouraria.'};this.s.resources-=amount*2;this.s.gold+=amount;this.events.push({type:'resource-gain',resources:0,gold:amount})}this.s.traded=true;this.note(`Troca concluída: ${amount}${direction==='gold'?'♦ → '+amount*2+'♥':'♦ recebidas por '+amount*2+'♥'}.`);return{ok:true}}
 checkMutiny(){const morale=this.morale();for(const u of this.allies){const threshold=UNITS[u.type]?.mutiny||0;if(!u.loyal&&morale<threshold){u.team='enemy';this.effect('Motim',`${UNITS[u.type].name} se amotinou porque a moral ficou abaixo de ${threshold}. A unidade agora é inimiga.`,'bad');this.note(`${UNITS[u.type].name} se amotinou! Moral ${morale} < ${threshold}.`,'danger')}}if(this.enemies.length&&!this.s.combat)this.beginCombat()}
 spawnEnemies(r,total,type='raider'){
  total=Math.max(1,Math.round(total*DIFFICULTIES[this.s.difficulty].enemy));const d=ENEMIES[type]||ENEMIES.raider;
  const n=d.single?1:Math.min(8,Math.max(1,Math.ceil(total/8)));
  for(let i=0;i<n;i++){const u=this.addUnit(type,r.x,r.y,true,'enemy',total/n);u.range=d.range;u.size=d.size;u.enemyName=d.name;if(type==='worm'){u.burrowing=true;u.burrowStep=null;}}
 }
 advanceBurrow(u,dt){
  if(!u.burrowing||u.type!=='worm'||u.team!=='enemy')return false;
  if(!u.burrowStep){
   const at=this.room(Math.round(u.x),Math.round(u.y));
   // The ground line is the upper bound: never excavate floating surface rooms.
   if(!at||at.y<=0){u.burrowing=false;return false}
   const known=this.room(at.x,at.y-1),next=known||this.addRoom(at.x,at.y-1,'cave');
   this.connectRooms(at,next);u.burrowStep={x:next.x,y:next.y,exit:!!known};
   u.attack=.3;this.effects.push({x:at.x,y:at.y-.35,kind:'dig',life:.5});
   this.note(known?'O escavador abriu uma passagem para uma sala descoberta.':'O escavador abriu uma caverna vazia acima do túnel.','warn');
   this.spreadHazards();if(u.hp<=0)return true;
  }
  const step=u.burrowStep,next=this.room(step.x,step.y);
  if(!next||!this.passable(next,'enemy',u)){u.burrowing=false;u.burrowStep=null;u.moveTarget=null;return false}
  this.moveUnit(u,next,dt);
  if(!u.moveTarget){u.burrowStep=null;if(step.exit||next.y===0){u.burrowing=false;this.note(step.exit?'O escavador alcançou a fortaleza e avança para o portão.':'O escavador alcançou a linha do chão e passa a buscar o portão.','danger')}}
  return true;
 }
 beginCombat(){for(const group of this.s.rivalDungeons||[])if(!group.claimed&&this.enemies.some(u=>group.enemyIds.includes(u.id)))group.fought=true;if(this.s.combat)return;this.s.combat=true;this.s.paused=false;this.dead=[];this._tactics=null;this._tacticsDirty=true;
  for(const u of this.s.units){u.shot=false;u.holdingFire=false;u.cooldown=this.random();u.shield=0;u.targetId=null;
   if(u.team==='ally'){u.order='defend';u.frontTarget=null;if(this.rooms.some(r=>r.type==='temple'&&!r.dedication&&this.active(r)))u.shield+=20}
  }
  this.spreadHazards();
  this.note('Às armas! Os defensores se dividem entre os núcleos inimigos por força, distância e urgência.','danger');this.events.push({type:'combat'});
 }
 lineOfSight(a,b,melee=false){
  const eps=.015,vertical=Math.abs(a.x-b.x)<eps,horizontal=Math.abs(a.y-b.y)<eps;
  if(!vertical&&!horizontal)return false;
  if(vertical&&Math.abs(a.x-Math.round(a.x))>eps)return false;
  if(horizontal&&Math.abs(a.y-Math.round(a.y))>eps)return false;
  const ax=Math.round(a.x),ay=Math.round(a.y),bx=Math.round(b.x),by=Math.round(b.y);
  const dx=Math.sign(bx-ax),dy=Math.sign(by-ay),n=Math.abs(bx-ax)+Math.abs(by-ay);
  for(let i=0;i<=n;i++){const r=this.room(ax+dx*i,ay+dy*i);if(i>0){const previous=this.room(ax+dx*(i-1),ay+dy*(i-1));if(!this.linked(previous,r)||this.barricade(previous,r))return false;}if(!r||r.closed||this.blockedByImmortal(r)||r.trap?.level>=3&&!r.trap?.passable||!melee&&this.roomHazards(r).includes('blindgas'))return false}return true;
 }
 meleeContact(a,b){
  if(a.team==='neutral'||b.team==='neutral')return false;
  const ad=this.unitData(a),bd=this.unitData(b),reach=bd.range<=.5?Math.max(ad.range,bd.range):ad.range;
  return distance(a,b)<=reach+.00001&&(Math.abs(a.x-b.x)<.02||Math.abs(a.y-b.y)<.02)&&this.lineOfSight(a,b,true)&&this.path(a,b,a.team,a)!==null;
 }
 unitData(u){if(u.type==='rat')return{...UNITS.rat,range:u.range??UNITS.rat.range,speed:0};const d=(u.team==='enemy'?ENEMIES[u.type]:UNITS[u.type])||UNITS[u.type]||ENEMIES[u.type]||{range:u.range||.42,speed:.6,power:u.power};return {...d,range:u.range??d.range,speed:u.fixed||u.chainBound||u.regenFrozen?0:u.feral?d.speed*3:d.speed};}
 refreshDefensePlan(){
  const roster=this.enemies.map(e=>e.id).join(',')+'|'+this.allies.map(u=>u.id).join(',');
  if(!this._tactics||this._tacticsDirty||this._tacticsRoster!==roster||this.s.seconds-this._tactics.at>=.6){this._tactics=planDefense(this);this._tacticsRoster=roster;this._tacticsDirty=false}
 }
 defenseGoal(u){this.refreshDefensePlan();return this._tactics.assignments.get(u.id)?.goal||this.target}
 movementOrigin(u,next){const dx=next.x-u.x,dy=next.y-u.y;if(Math.abs(dx)>.00001)return this.room(next.x-Math.sign(dx),next.y);if(Math.abs(dy)>.00001)return this.room(next.x,next.y-Math.sign(dy));return null}
 attackPassageDoor(u,origin,next){
  const door=this.barricade(origin,next);if(!door)return false;
  if(u.cooldown<=0){this.damageBarricade(origin,next,u.power*1.8);if(door.kind==='offensive')this.damage(u,20*door.level);u.cooldown=1;u.attack=.3;this.events.push({type:'door-hit',unit:u.id})}
  return true;
 }
 corridorTravel(u,next,travel){
  const origin=this.movementOrigin(u,next);if(!origin||!this.linked(origin,next))return travel;
  const dx=next.x-origin.x,dy=next.y-origin.y,progress=(u.x-origin.x)*dx+(u.y-origin.y)*dy,destination=key(next.x,next.y);
  let allowed=travel;
  for(const v of [...this.s.units,...(this.s.workers||[]),...this.campUnits()]){
   if(v===u||v.hp<=0||v.team!==u.team)continue;if(this.s.combat&&v.holdingFire&&this.unitData(v).range>.5&&this.unitData(u).range<=.5)continue;
   if(u.team==='ally'&&this.s.combat&&u.frontTarget&&u.frontTarget===v.frontTarget&&progress<.12&&engagementPriority(this,v,u)<0&&this.unitData(v).speed>0&&!(v.stun>0)&&distance(v,origin)<.12&&(!v.moveTarget||v.moveTarget===destination)){const goal=this._tactics?.assignments.get(v.id)?.goal,route=goal&&this.path(this.anchor(v),goal,'ally',v);if(v.moveTarget===destination||route?.[0]===next)allowed=0;}
   const inside=Math.max(Math.abs(v.x-Math.round(v.x)),Math.abs(v.y-Math.round(v.y)))>=.12;
   if(v.moveTarget!==destination&&(v.moveTarget||!inside))continue;
   if(Math.abs((v.x-origin.x)*dy-(v.y-origin.y)*dx)>.00001)continue;
   const ahead=(v.x-origin.x)*dx+(v.y-origin.y)*dy;
   // Release the queue inside the destination room so troops can reform there.
   if(ahead<-.00001||ahead>.88||ahead<progress-.00001||Math.abs(ahead-progress)<.00001&&(u.team==='ally'&&this.s.combat?engagementPriority(this,v,u)>0:v.id>u.id))continue;
   const gap=Math.min(.48,(dy?.24:.18)*Math.max(u.size||1,v.size||1));
   allowed=Math.min(allowed,Math.max(0,ahead-progress-gap));
  }
  return allowed;
 }
 moveUnit(u,next,dt){if(u.type==='rat')return;
  const at=this.room(Math.round(u.x),Math.round(u.y))||next,d=this.unitData(u);
  let speed=d.speed;if(u.team==='ally'&&(['elevator','rails','shaft'].includes(at.type)||at.transport==='rails'))speed*=2;
  if(at.type==='mud')speed*=.5;if(u.team==='enemy'&&at.type==='puzzle')speed*=.35;
  if(u.team==='ally'&&this.s.artifacts.includes('speed'))speed*=1.15;
  const origin=this.movementOrigin(u,next),door=u.team==='enemy'&&origin&&this.barricade(origin,next);
  if(door){
   const dx=next.x-origin.x,dy=next.y-origin.y,stop={x:origin.x+dx*.46,y:origin.y+dy*.46};
   if(distance(origin,u)>=.46-.00001){u.moveTarget=key(next.x,next.y);this.attackPassageDoor(u,origin,next);return}
   const travel=this.corridorTravel(u,next,Math.min(speed*dt,distance(u,stop)));u.x+=dx*travel;u.y+=dy*travel;u.walk+=travel*12;if(dx)u.facing=Math.sign(dx);u.moveTarget=key(next.x,next.y);return;
  }
  const dx=next.x-u.x,dy=next.y-u.y,len=Math.hypot(dx,dy),step=this.corridorTravel(u,next,Math.min(len,speed*dt));
  if(len>0){u.x+=dx/len*step;u.y+=dy/len*step;u.walk+=step*12;if(dx)u.facing=Math.sign(dx)}
  u.moveTarget=key(next.x,next.y);
  if(len<=step+.00001){u.x=next.x;u.y=next.y;u.moveTarget=null;u.cooldown=Math.max(u.cooldown,d.range>.5?.18:0)}
 }
 siegeEnd(u,target){const dx=Math.abs(target.x-u.x)>.015?Math.sign(target.x-u.x):0,dy=dx?0:Math.sign(target.y-u.y);if(!dx&&!dy)return{x:u.x+(u.facing||1)*.4,y:u.y};let end={x:Math.round(u.x),y:Math.round(u.y)};for(let n=0;n<100;n++){const next={x:end.x+dx,y:end.y+dy};if(!this.lineOfSight(u,next))break;end=next;}const edge={x:end.x+dx*.4,y:end.y+dy*.4};return this.lineOfSight(u,edge)?edge:end;}
 fireSiegeShot(u,target,damage){const end=this.siegeEnd(u,target);this.projectiles.push({x:u.x,y:u.y,tx:end.x,ty:end.y,target:target.id,damage,t:0,duration:Math.max(.18,distance(u,end)*.2),attacker:u.id,kind:'bolt',team:u.team,piercing:true,hitIds:[]});}
 advanceSiegeShot(p,dt){const before=p.t;p.t=Math.min(1,p.t+dt/p.duration);const dx=p.tx-p.x,dy=p.ty-p.y,len=Math.hypot(dx,dy);if(!len)return;const direction={x:dx/len,y:dy/len},head={x:p.x+dx*p.t,y:p.y+dy*p.t};
  // Recheck the whole travelled line: a newly closed door also stops a flying bolt.
  if(!this.lineOfSight(p,head)){p.t=1;return;}
  const hitIds=new Set(p.hitIds);for(const u of [...this.s.units]){if(u.hp<=0||u.team==='neutral'||u.team===p.team||hitIds.has(u.id))continue;const along=(u.x-p.x)*direction.x+(u.y-p.y)*direction.y,across=Math.abs((u.x-p.x)*direction.y-(u.y-p.y)*direction.x);if(across>.12||along<Math.max(0,before*len-.12)||along>p.t*len+.12||!this.lineOfSight(p,u))continue;p.hitIds.push(u.id);this.damage(u,p.damage,{attacker:p.attacker});if(u.hp>0){u.stun=Math.max(u.stun||0,1);u.walk=0;}}
 }
 damage(u,amount,{instant=false}={}){if(u.hp<=0||u.type==='immortal'&&!instant)return;if(instant)amount=u.hp+u.shield;const absorb=Math.min(u.shield,amount);u.shield-=absorb;u.hp-=amount-absorb;this.effects.push({x:u.x,y:u.y,kind:'hit',life:0.35});if(u.hp<=0){this._tacticsDirty=true;u.hp=0;if(u.type==='golem'&&u.team!=='ally'){const forge=this.s.rooms[u.home];if(forge?.type==='golemforge'&&forge.golemId===u.id){forge.golemDefeated=true;forge.golemId=null;}if(u.team==='neutral')this.s.units=this.s.units.filter(v=>v.id!==u.id);}this._routeCache=null;this.effects.push({x:u.x,y:u.y,kind:'death',life:0.8});if(u.team==='enemy'){this.s.kills++;if(u.type==='guardian'&&this.s.rooms[u.home]?.type==='void')this.s.voidDefeated=true}else if(u.team==='ally')this.dead.push({...u});if(u.type==='immortal'){this.s.units=this.s.units.filter(v=>v.id!==u.id);const r=this.s.rooms[u.home];if(r){r.immortalId=null;if(r.type==='invincible')r.type='cave';r.closed=false;}this._routeCache=null;this.note('A criatura imortal foi eliminada por morte instantânea. A passagem está livre.','good')}this.events.push({type:'death',team:u.team})}}
 killInstant(u){this.damage(u,u.hp+u.shield,{instant:true})}
 update(dt){
  if(!this.s.combat||this.s.paused||this.s.status!=='playing'||this.presentationEnabled&&this.s.effectCards?.length)return;
  dt=Math.min(dt,0.1)*this.s.speed;this.s.seconds+=dt;
  for(const e of this.effects)e.life-=dt;this.effects=this.effects.filter(e=>e.life>0);
  for(const p of this.projectiles){if(p.piercing){this.advanceSiegeShot(p,dt);continue;}p.t+=dt/p.duration;if(p.t>=1){const t=this.s.units.find(u=>u.id===p.target);if(t&&t.hp>0&&this.lineOfSight({x:p.x,y:p.y},t)&&Math.hypot(t.x-p.tx,t.y-p.ty)<.6)this.damage(t,p.damage,{attacker:p.attacker})}}this.projectiles=this.projectiles.filter(p=>p.t<1);
  this._routeCache??=new Map();this.refreshDefensePlan();const actors=[...this.s.units].filter(u=>u.hp>0&&u.team!=='neutral').sort((a,b)=>a.team==='ally'&&b.team==='ally'?engagementPriority(this,a,b):a.team===b.team?a.id-b.id:a.team==='ally'?-1:1);const hits=[];
  for(const u of actors){
   if(this.presentationEnabled&&this.s.effectCards?.length)break;
   u.attack=Math.max(0,u.attack-dt);u.cooldown-=dt;u.stun=Math.max(0,u.stun-dt);if(u.stun>0)continue;
   const d=this.unitData(u),at=this.room(Math.round(u.x),Math.round(u.y));if(!at)continue;
   if(this.lethalHazard(at,u)){this.killInstant(u);continue}
   if(this.advanceBurrow(u,dt))continue;
   const firingFoe=d.range>.5&&!u.nonAttacking&&actors.some(v=>v.team!==u.team&&v.hp>0&&(u.type==='siege'||distance(u,v)<=d.range)&&this.lineOfSight(u,v));
   u.holdingFire=!!firingFoe;
   const crossingFoe=d.range<=.5&&actors.some(v=>v.team!==u.team&&v.hp>0&&this.meleeContact(u,v));
   if(u.moveTarget&&!crossingFoe&&!firingFoe){const destination=this.s.rooms[u.moveTarget];if(destination&&this.passable(destination,u.team,u)&&((at.x===destination.x&&at.y===destination.y)||this.linked(at,destination))){this.moveUnit(u,destination,dt);continue}u.moveTarget=null;u.x=Math.round(u.x);u.y=Math.round(u.y);}
   if(u.team==='enemy'&&at.type==='arena'&&!u.loyal){this.damage(u,99999);this.s.baseMorale+=10;continue}
   if((u.team==='enemy'||this.s.madTraps)&&at.trap?.armed&&!u.traits?.includes(7)){if(at.trap.kind==='damage')this.damage(u,at.trap.level*10*8,{source:'trap'});else u.stun=at.trap.level*2;at.trap.armed=false;if(u.hp<=0)continue}
   if(u.type==='trapper'){for(const r of this.rooms)if(r.trap&&distance(r,u)<1.5)r.trap.armed=true}
   if(u.type==='cleric'&&u.cooldown<=0){for(const v of (u.team==='ally'?this.allies:this.enemies))if(distance(u,v)<=1.5)v.shield=Math.min(16,v.shield+16);u.cooldown=2.5;u.attack=0.3;continue}
   if(u.team==='enemy'&&u.defendingTerritory&&u.awaitingAttack){u.walk=0;continue;}
   const opponents=actors.filter(v=>v.team!==u.team&&v.hp>0&&(u.type!=='rat'||at.type==='sewer'&&Math.round(v.x)===at.x&&Math.round(v.y)===at.y)).sort((a,b)=>distance(u,a)-distance(u,b)||a.id-b.id);
   let target=!u.nonAttacking&&opponents.find(v=>d.range>.5?(u.type==='siege'||distance(u,v)<=d.range)&&this.lineOfSight(u,v):this.meleeContact(u,v));
   if(target&&!(u.type==='siege'&&u.shot)){u.walk=0;
    if(u.cooldown<=0){let damage=u.power*1.8;if(u.team==='ally'){damage*=1+this.s.blessings*0.06+this.s.inventions*0.15;if(this.nearby(at,'kitchen',1).length)damage*=1.5;damage+=this.museumBonus(u,target)*1.8;if(this.s.artifacts.includes('power'))damage*=1.1;if(this.s.artifacts.includes('invention'))damage*=1.2}
     if(target.x!==u.x)u.facing=Math.sign(target.x-u.x);this.onAttack(u,target);if(u.hp<=0||target.team===u.team)continue;u.attack=0.35;u.cooldown=u.type==='archer'?1.35:u.type==='mage'?1.5:1.1;u.shot=true;this.events.push({type:'attack',ranged:d.range>0.5,attacker:u.id,target:target.id,team:u.team});
     if(u.type==='siege'){this.fireSiegeShot(u,target,damage);}else if(d.range>0.5){this.projectiles.push({x:u.x,y:u.y,tx:target.x,ty:target.y,target:target.id,damage,t:0,duration:Math.max(0.18,distance(u,target)*0.2),attacker:u.id,kind:u.type==='archer'?'arrow':u.type==='siege'?'bolt':u.type==='alchemist'?'flask':'orb',team:u.team})}else hits.push({target,damage,attacker:u.id});
    }continue;
   }
   if(d.speed<=0||u.flying)continue;
   let goal=u.team==='enemy'?this.enemyGoal(u):this.defenseGoal(u);if(!goal)continue;
   let route=this.path(u,goal,u.team,u);
   if(route===null&&u.team==='enemy'){
    if(u.cooldown<=0){this.occupyRoom(at,u);const next=this.neighbors(at,'enemy').find(r=>!r.captured);if(next)goal=next;else{this.settleInvader(u,at);continue}route=this.path(u,goal,'enemy');u.cooldown=1}
   }
   let next=route?.[0];
   if(!next){if(u.team==='enemy'&&distance(u,this.target)<.25&&!this.allies.some(a=>distance(a,this.target)<.55)){this.lose();return}continue}
   this.moveUnit(u,next,dt);

  }
  for(const h of hits)this.damage(h.target,h.damage,{attacker:h.attacker});
  this.s.units=this.s.units.filter(u=>u.hp>0);
  if(this.s.status==='playing'&&!this.enemies.length)this.endCombat();
 }
 endCombat(){this.s.combat=false;this.s.paused=false;this.s.battles++;this.projectiles=[];this.effects=[];
  const revived=new Set();for(const h of this.rooms.filter(r=>r.type==='hospital'&&this.active(r))){const u=this.dead.find(u=>!revived.has(u.id)&&(this.s.magicFlags?.hospitalGlobal||Math.abs(u.x-h.x)<=2&&Math.abs(u.y-h.y)<=2));if(u){revived.add(u.id);u.hp=u.maxHp;if(!u.loyal)u.hospitalMutinyPending=true;this.s.units.push(u);this.note('O Hospital trouxe um defensor de volta.','good');this.effect('Resgate do hospital','Um defensor caído foi recuperado pelo hospital e voltou à fortaleza.','good')}}
  for(const u of this.dead){if(!revived.has(u.id)&&u.type==='undead'&&this.roll(2)===2){u.hp=u.maxHp;this.s.units.push(u);this.effect('Retorno dos mortos','Um morto-vivo derrotado se ergueu novamente e voltou às suas tropas.','good')}}
  delete this.s.returnPhase;
  for(const u of this.allies){u.hp=u.maxHp;u.shield=0;}
  this.applyHazards();
  for(const r of this.rooms){if(r.trap)r.trap.armed=true;if(r.type==='solitary'&&!r.prisoners)r.prisoners=1;if(r.rewardPending&&!r.captured){r.rewardPending=false;if(r.type==='vault')this.gain(0,25);if(r.type==='rivalmine')this.gain(20,0);if(r.type==='tomb')this.magic(true);if(r.type==='rivalhold'&&!(this.s.rivalDungeons||[]).some(d=>d.members.includes(key(r.x,r.y))))this.gain(0,30)}}
  this.settleRivalDungeons();
  this.dead=[];this.gain(0,3+Math.floor(this.s.maxDepth/2));this.s.baseMorale+=1;if(this.has('museum'))this.s.trophies=Math.min(4,this.s.trophies+1);
  this.note('Vitória! Os sobreviventes se recuperam. +1 moral e espólios de guerra.','good');this.events.push({type:'victory'});
  if(this.s.expedition!==null){const p=PLANES[this.s.expedition];this.s.artifacts.push(p.effect);this.note(`Expedição vitoriosa: ${p.artifact}!`,'good');this.effect(p.artifact,p.desc,'good');if(p.effect==='berserker'){const free=this.rooms.find(r=>r.type==='cave');if(free)free.type='meadhall'}this.s.expedition=null}
  if(this.s.activePlane==null&&this.s.voidDefeated&&this.rooms.some(r=>r.type==='void'&&!r.captured)){this.s.artifacts.push('void');this.s.status='won';this.note('O Cristal do Vazio é seu. A fortaleza conquistou o abismo.','good');this.events.push({type:'won'})}
 }
 lose(){
  if(this.s.status!=='playing'||!this.s.combat)return false;
  this.s.lives=Math.max(0,(this.s.lives??3)-1);this.s.combat=false;this.s.paused=false;
  // A repelled invasion is a defeat, never a victory or a source of loot.
  const banished=this.enemies.map(u=>({...u})),invaders=new Set(banished.map(u=>u.id));
  this.s.units=this.s.units.filter(u=>u.hp>0&&u.team!=='enemy'&&!(u.team==='ally'&&u.type==='soldier'&&u.home==='0,0'));
  for(const r of this.rooms){r.rewardPending=false;r.captured=false;if(r.garrison?.length)r.garrison=[];if(r.trap)r.trap.armed=true;}
  for(const group of this.s.rivalDungeons||[])if(!group.claimed&&group.enemyIds.some(id=>invaders.has(id))){group.forfeited=true;group.claimed=true;}
  this.projectiles=[];this.effects=[];this.dead=[];this.s.expedition=null;
  for(const r of this.rooms)if(r.type==='void'&&!this.s.artifacts.includes('void')){r.guardianRetry=true;r.captured=false;this.s.voidDefeated=false;}
  for(const u of this.allies){u.moveTarget=null;u.targetId=null;u.frontTarget=null;u.attack=0;const home=this.s.rooms[u.home];if(home){u.x=home.x;u.y=home.y}}
  const gate=this.room(0,0);gate.damaged=false;gate.closed=false;
  for(let i=0;i<5;i++)this.addUnit('soldier',0,0,true);
  this._routeCache=null;this._tactics=null;this._tacticsDirty=true;
  const final=this.s.lives===0;this.note(final?'A terceira gema do portão se partiu. Sua fortaleza caiu.':`Uma gema do portão se partiu. Restam ${this.s.lives} vidas. Os invasores desapareceram e cinco guardiões leais retomaram o portão.`,'danger');
  this.effect('Gema do portão destruída',final?'A última gema se partiu. A fortaleza não pode resistir a outra invasão. Fim de jogo.':`A fortaleza perdeu uma vida. Restam ${this.s.lives} gemas. Todos os invasores desapareceram e os guardiões do portão voltaram a cinco.`,'bad');
  this.events.push({type:'life-lost',remaining:this.s.lives,index:this.s.lives,enemies:banished});
  if(final){this.s.status='lost';this.events.push({type:'lost'})}
  return true;
 }

 action(action,x,y,arg){
  const r=this.room(x,y);if(!r||this.s.status!=='playing')return{ok:false,reason:'Sala indisponível.'};
  if(action==='toggle'&&r.type==='drawbridge'){this._tacticsDirty=true;r.closed=!r.closed;if(r.closed){for(const u of this.enemies)if(Math.round(u.x)===x&&Math.round(u.y)===y)this.damage(u,400)}this.note(`Ponte levadiça ${r.closed?'fechada':'aberta'}.`);if(!r.closed)this.reconnectCaptured();this.spreadHazards();return{ok:true}}
  if(this.s.combat)return{ok:false,reason:'Indisponível em combate.'};
  if(action==='challengeVoid'&&r.type==='void'&&r.guardianRetry&&!this.s.combat){r.guardianRetry=false;this.spawnEnemies(r,110,'guardian');this.beginCombat();return{ok:true}}
  if(action==='repair'){if(this.roomHazards(r).length)return{ok:false,reason:'Drene o fluido ou gás antes de reparar.'};const owner=(r.builtPartOf&&this.s.rooms[r.builtPartOf])||r,c=this.cost(owner.type,owner)||{resources:10,gold:0},parts=owner.footprint?.length||1,index=owner.footprint?.indexOf(key(r.x,r.y))||0,share=total=>Math.floor(total/parts)+(index<total%parts?1:0);const a=share(Math.floor(c.resources/2)),b=share(Math.floor(c.gold/2));if(!r.damaged||this.s.resources<a||this.s.gold<b)return{ok:false,reason:'Sem dano ou recursos para reparar.'};this.s.resources-=a;this.s.gold-=b;r.damaged=false;if(r.captured){r.captured=false;this.spawnEnemies(r,r.type==='void'?110:20+Math.max(0,r.y)*5,r.type==='void'?'guardian':'raider');this.beginCombat()}return{ok:true}}
  if(action==='drain'){
   if(this.fluidSource(r))return{ok:false,reason:'Fontes naturais de líquido não podem ser drenadas. Construa uma ponte para atravessar.'};
   const hazards=this.roomHazards(r),magma=hazards.some(h=>['lava','crater'].includes(h)),cost=magma?20:5;
   if(!hazards.length||this.s.gold<cost)return {ok:false,reason:'Riquezas insuficientes ou nenhum perigo.'};
   this.s.gold-=cost;r.drainedSources=[...new Set([...(r.drainedSources||[]),...(r.hazardOrigins||[])])];r.hazardOrigins=[];
   if(ROOMS[r.type].hazard)r.type='cave';r.fluid=null;r.gas=null;r.contaminant=null;
   if(magma)this.damageRoom(r);
   this.note(magma?'Magma drenado. A sala permanece danificada e precisa de reparo.':'Sala drenada. A construção original foi preservada.','good');return {ok:true};
  }
  if(action==='attackGolem'&&r.type==='golemforge'){const guard=this.s.units.find(u=>u.id===r.golemId&&u.team==='neutral'&&u.hp>0);if(!guard)return{ok:false,reason:'Não há golem passivo nesta forja.'};guard.team='enemy';r.rewardPending=true;this._tacticsDirty=true;this.note('O guardião da forja foi desafiado e entrou em combate.','danger');this.beginCombat();return{ok:true}}
  if(action==='release'&&r.type==='ancientprison'){this.releasePrison(r);return{ok:true}}
  if(action==='festival'){if(this.s.gold<10)return{ok:false,reason:'O festival custa 10♦.'};this.s.gold-=10;this.s.baseMorale+=5;this.note('Um festival aquece os corações. +5 moral.','good');this.effect('Festival','A celebração aumenta a moral da fortaleza em 5.','good');return{ok:true}}
  if(action==='magic'&&r.type==='sealed'){this.openSealedRoom(r);this.spreadHazards();this.checkMutiny();return{ok:true}}
  if(action==='magic'&&['well','ancienttemple','sealed','ritual','chaos'].includes(r.type)){if(r.usedTurn===this.s.turn)return{ok:false,reason:'Já utilizado neste turno.'};if(r.type==='well'&&this.s.gold<10)return{ok:false,reason:'O desejo custa 10♦.'};if(r.type==='well')this.s.gold-=10;if(r.type==='chaos'){this.magic(false);this.gain(20,20)}this.magic(r.type==='ritual'||r.type==='chaos'?true:r.type==='sealed'?false:this.roll(2)===1);r.usedTurn=this.s.turn;if(r.type!=='well')r.type='cave';return{ok:true}}
  if(action==='steal'&&r.type==='dragon'&&!r.dragonAwake){if(r.usedTurn===this.s.turn)return{ok:false,reason:'Um roubo por turno.'};r.usedTurn=this.s.turn;this.gain(0,20);if(this.roll(4)===1){this.spawnEnemies(r,100+Math.max(0,y)*5,'dragon');r.dragonAwake=true;this.effect('Dragão desperto','O dragão acordou e abandonou a pilha de tesouros. Restam as ruínas do palácio, e a criatura agora avança para o combate.','bad');this.beginCombat()}else this.note('20♦ roubadas. O dragão continua dormindo.','good');return{ok:true}}
  if(action==='closePortal'&&['portal','stabilizer'].includes(r.type)){if(this.s.gold<20)return{ok:false,reason:'Selar custa 20♦ nesta adaptação.'};this.s.gold-=20;r.type='cave';this.note('Portal selado. Não haverá novas invasões nesta sala.','good');return{ok:true}}
  if(action==='invention'&&r.type==='artificer'){if(this.s.gold<50)return{ok:false,reason:'Uma invenção custa 50♦.'};this.s.gold-=50;this.s.inventions++;this.note('Engenharia extraordinária: +15% de dano permanente.','good');this.effect('Engenharia extraordinária','A nova invenção concede +15% de dano permanente às suas tropas.','good');return{ok:true}}
  if(action==='expedition'&&r.type==='stabilizer'){
   if(!Number.isInteger(arg)||!PLANES[arg]||this.s.artifacts.includes(PLANES[arg].effect))return{ok:false,reason:'Expedição inválida ou concluída.'};if(this.s.gold<20)return{ok:false,reason:'A expedição custa 20♦.'};this.s.gold-=20;this.s.expedition=arg;this.spawnEnemies(r,Math.max(1,40+arg*5-10*(this.s.raidIntel||0)),'guardian');this.s.raidIntel=0;this.note(`Expedição: ${PLANES[arg].name}. Uma força do plano cruza o portal!`,'danger');this.beginCombat();return{ok:true};
  }
  if(action==='defense'){
   const kind=arg;if(['defensive','offensive'].includes(kind))return{ok:false,reason:'Escolha o corredor onde instalar a porta reforçada.'};const trap=kind==='damage'||kind==='delay';if(!['damage','delay','defensive','offensive','secret'].includes(kind))return{ok:false,reason:'Defesa inválida.'};if(!this.has(trap?'forge':'masonry'))return{ok:false,reason:trap?'Exige Forja.':'Exige Pedraria.'};
   const resources=kind==='damage'?20:kind==='delay'?15:0,gold=kind==='defensive'?10:kind==='offensive'?20:kind==='secret'?50:0;
   if(r.trap||r.secret)return{ok:false,reason:'A sala já tem uma defesa.'};if(this.s.resources<resources||this.s.gold<gold)return{ok:false,reason:'Recursos insuficientes.'};this.s.resources-=resources;this.s.gold-=gold;if(trap)r.trap={kind,level:1,armed:true};else if(kind==='secret')r.secret=true;this.note('Defesa instalada.','good');return{ok:true};
  }
  if(action==='upgrade'){
   const d=r.trap;if(!d||d.level>=3)return{ok:false,reason:'Sem defesa aprimorável.'};const cost=20;if(this.s.resources<cost)return{ok:false,reason:'Recursos insuficientes.'};this.s.resources-=cost;d.level++;this.note('Defesa aprimorada. Nível '+d.level+'.','good');return{ok:true};
  }
  return{ok:false,reason:'Ação indisponível.'};
 }
 reconnectCaptured(){for(const r of this.rooms){if(!r.captured||this.path(r,this.target)===null)continue;r.captured=false;const guards=r.garrison||[];if(guards.length){for(const u of guards)this.spawnEnemies(r,u.power/DIFFICULTIES[this.s.difficulty].enemy,u.type);r.garrison=[]}else this.spawnEnemies(r,20+Math.max(0,r.y)*5,r.type==='void'?'guardian':'raider');this.note('A reconexão despertou os ocupantes de '+ROOMS[r.type].name+'.','danger')}if(this.enemies.length)this.beginCombat()}
 magic(good){
  const announce=(title,description,tone,input=null)=>{this.note(`${good?'Magia boa':'Magia ruim'} · ${title}: ${description}`,tone==='bad'?'danger':'good');this.effect(title,description,tone,input)};
  if(good){const n=this.roll(4);
   if(n===1){this.s.blessings++;announce('Metal vivo','Suas tropas recebem +6% de dano permanente.','good')}
   if(n===2){this.s.mutinyRelief=(this.s.mutinyRelief||0)+1;announce('Euforia','O limite de motim de todas as unidades diminui em 1, permanentemente.','good')}
   if(n===3){const r=this.s.resources,g=this.s.gold;this.gain(15,10);announce('Fortuna',`Você recebeu ${this.s.resources-r}♥ e ${this.s.gold-g}♦, respeitando a capacidade dos depósitos.`,'good')}
   if(n===4){const u=this.addUnit('soldier',this.target.x,this.target.y,true);announce('Guerreiro leal','Um soldado leal se juntou à fortaleza. Escolha a sala onde ele será acolhido.','good',{kind:'unit-home',unitId:u.id})}
  }else{
   if(this.has('temple')){this.note('O Templo dissipou uma maldição.','good');this.effect('Proteção do templo','O templo dissipou a magia ruim. A fortaleza não sofreu seus efeitos.','good');return}
   const n=this.roll(3);
   if(n===1){this.s.baseMorale-=3;announce('Sussurros','Vozes nas profundezas reduzem a moral da fortaleza em 3.','bad')}
   if(n===2){const before=this.s.gold;this.s.gold=Math.max(0,before-10);announce('Ferrugem',`A maldição destruiu ${before-this.s.gold}♦ das suas riquezas.`,'bad')}
   if(n===3){const before=this.s.resources;this.s.resources=Math.max(0,before-10);announce('Praga',`A praga consumiu ${before-this.s.resources}♥ dos seus recursos.`,'bad')}
  }
 }
 applyHazards(){
  let casualties=0;for(const u of this.s.units){if(u.hp<=0)continue;const r=this.room(Math.round(u.x),Math.round(u.y));if(r&&this.lethalHazard(r,u)){this.killInstant(u);casualties++}}
  if(casualties){this.effect('Perigo ambiental',`${casualties} unidade(s) foram derrotadas imediatamente por líquidos ou gás venenoso.`,'bad');this.note(`${casualties} unidade(s) foram derrotadas imediatamente por fluidos ou gás venenoso.`,'danger');}
 }
 spreadHazards(){
  const gasTypes=['gas','flammable','miasma','blindgas'];
  // Fluid occupation persists after a source stops, closes or is drained elsewhere.
  for(const r of this.rooms){if(r.contaminant){if(gasTypes.includes(r.contaminant))r.gas??=r.contaminant;else r.fluid??=r.contaminant}}
  for(const source of this.rooms.filter(r=>r.type!=='collapse'&&!(r.type==='crater'&&r.craterPart==='dry')&&(ROOMS[r.type]?.hazard||this.fluidSource(r)||r.extraFluid))){
   const sourceType=source.extraFluid||this.fluidSource(source)||source.type,gas=gasTypes.includes(sourceType),sourceKey=key(source.x,source.y),queue=[{r:source,lateral:0}],seen=new Map();
   for(let i=0;i<queue.length;i++){
    const {r,lateral}=queue[i],rk=key(r.x,r.y);if((seen.get(rk)??Infinity)<=lateral)continue;seen.set(rk,lateral);
    if(r!==source&&(r.closed||!gas&&(['bridge','drawbridge'].includes(r.type)||r.type==='pump'&&!r.pumpOpen)||r.drainedSources?.includes(sourceKey)))continue;
    r.hazardOrigins??=[];if(!r.hazardOrigins.includes(sourceKey))r.hazardOrigins.push(sourceKey);const localFluid=!gas&&sourceType==='water'&&this.layer(r)===1?'lava':sourceType;if(gas)r.gas=sourceType;else r.fluid=localFluid;
    if(!gas&&['lava','crater'].includes(localFluid)&&!(this.s.artifacts.includes('lava')&&this.damageable(r))&&!(['bridge','drawbridge'].includes(r.type)||r.type==='pump'&&!r.pumpOpen))this.damageRoom(r);
    if(!gas&&source.flowActive===false)continue;
    for(const[dx,dy]of DIRS){if((this.s.activePlane!==5&&(gas&&dy===1||!gas&&dy===-1))||dx&&lateral>=2)continue;const n=this.room(r.x+dx,r.y+dy);if(n&&n.type!=='collapse'&&this.linked(r,n)&&!this.barricade(r,n))queue.push({r:n,lateral:lateral+(dx?1:0)})}
   }
  }
  const burning=this.rooms.filter(r=>r.gas==='flammable'&&(['forge','tavern','barracks'].includes(r.type)||this.roomHazards(r).some(h=>['lava','crater'].includes(h)))),ignited=new Set();
  for(let i=0;i<burning.length;i++){const r=burning[i],rk=key(r.x,r.y);if(ignited.has(rk))continue;ignited.add(rk);
   for(const [dx,dy]of DIRS){const n=this.room(r.x+dx,r.y+dy);if(n&&this.linked(r,n)&&!this.barricade(r,n)&&!r.closed&&!n.closed&&(n.gas==='flammable'||n.type==='flammable')&&!ignited.has(key(n.x,n.y)))burning.push(n)}
  }
  if(ignited.size){
   for(const rk of ignited){const r=this.s.rooms[rk];this.damageRoom(r);
    for(const u of this.s.units)if(u.hp>0&&Math.round(u.x)===r.x&&Math.round(u.y)===r.y)this.killInstant(u);
    r.gas=null;r.contaminant=null;if(r.type==='flammable')r.type='cave';
   }this.note('Gás inflamável alcançou uma forja, taverna ou quartel: explosão! Todas as salas atingidas foram danificadas.','danger');this.effect('Explosão de gás','O gás inflamável alcançou uma fonte de ignição. A explosão atingiu todas as salas conectadas da nuvem, incluindo as alcançadas pelo magma.','bad');
  }
  for(const r of this.rooms)r.contaminant=r.gas||r.fluid||null;
  this.applyHazards();
 }
 serialize(){return JSON.stringify({format:'conquer-save',version:1,state:this.s,projectiles:this.projectiles,dead:this.dead,savedAt:new Date().toISOString()})}
 static restore(json){
  let data;try{data=JSON.parse(json)}catch{throw Error('Arquivo de salvamento inválido.')}
  const s=data?.state;if(data?.format!=='conquer-save'||data.version!==1||!s||typeof s!=='object')throw Error('Formato de salvamento incompatível.');
  const finite=n=>typeof n==='number'&&Number.isFinite(n);const coordinate=n=>Number.isInteger(n)&&Math.abs(n)<=100;
  if(!s.rooms||Array.isArray(s.rooms)||Object.keys(s.rooms).length>2000||!s.rooms['0,0']||!Array.isArray(s.units)||s.units.length>3000||!Array.isArray(s.deck)||s.deck.length>54||!Array.isArray(s.log)||s.log.length>100||!['playing','lost','won'].includes(s.status)||!DIFFICULTIES[s.difficulty]||!finite(s.seed)||typeof s.name!=='string'||!Array.isArray(s.artifacts)||s.artifacts.length>30)throw Error('Estado de jogo inválido.');
  if(typeof s.combat!=='boolean'||typeof s.paused!=='boolean'||![.5,1,2].includes(s.speed)||!Number.isInteger(s.nextId)||s.nextId<1||!(s.expedition===null||Number.isInteger(s.expedition)&&s.expedition>=0&&s.expedition<PLANES.length))throw Error('Estado de combate inválido.');
  for(const n of ['turn','resources','gold','baseMorale','nextId','seconds','blessings','inventions','trophies','maxDepth','kills','battles'])if(!finite(s[n])||Math.abs(s[n])>1e9)throw Error('Valores inválidos no salvamento.');
  for(const[k,r]of Object.entries(s.rooms)){if(!r||!coordinate(r.x)||!coordinate(r.y)||key(r.x,r.y)!==k||!Object.prototype.hasOwnProperty.call(ROOMS,r.type)||!Number.isInteger(r.variant)||r.variant<0||r.variant>2)throw Error('Mapa inválido.');if(r.trap&&(!['damage','delay'].includes(r.trap.kind)||![1,2,3,4].includes(r.trap.level)))throw Error('Armadilha inválida.');if(r.barricade&&(!['defensive','offensive'].includes(r.barricade.kind)||!finite(r.barricade.hp)))throw Error('Barricada inválida.')}
  if(s.lives===undefined)s.lives=s.status==='lost'?0:3;
  if(!Number.isInteger(s.lives)||s.lives<0||s.lives>3||s.status==='lost'&&s.lives!==0&&!(s.voidBattle===true&&s.activePlane==null&&Object.values(s.rooms).some(r=>r.type==='void'))||s.status==='playing'&&s.lives===0)throw Error('Gemas do portão inválidas.');
  for(const [id,r]of Object.entries(s.rooms)){
   if(r.sourceType!==undefined&&(!['water','lava','crater'].includes(r.sourceType)||!['bridge','drawbridge'].includes(r.type)&&!(r.perforated===true&&r.sourceType==='lava'&&['wet','rim'].includes(r.craterPart)&&s.rooms[r.craterRoot])))throw Error('Fonte de líquido inválida.');
   if(r.footprint!==undefined&&(!Array.isArray(r.footprint)||r.footprint.length<2||r.footprint.length>4||new Set(r.footprint).size!==r.footprint.length||!r.footprint.includes(id)||r.footprint.some(k=>!s.rooms[k]||k!==id&&s.rooms[k].builtPartOf!==id)))throw Error('Área de construção inválida.');
   if(r.builtPartOf!==undefined){const root=s.rooms[r.builtPartOf];if(!root||root===r||root.builtPartOf||!root.footprint?.includes(id)||ROOMS[root.type]?.r===undefined&&!root.planarReward)throw Error('Extensão de construção inválida.');}
   if(r.discoveryRoot!==undefined&&(!s.rooms[r.discoveryRoot]||s.rooms[r.discoveryRoot].discoveryRoot!==r.discoveryRoot))throw Error('Formação contínua inválida.');
  }
  s.effectCards??=[];s.nextEffectId??=1;
  if(!Array.isArray(s.effectCards)||s.effectCards.length>2000||!Number.isInteger(s.nextEffectId)||s.nextEffectId<1)throw Error('Fila de eventos inválida.');
  const effectIds=new Set();for(const c of s.effectCards){if(!c||!Number.isInteger(c.id)||c.id<1||c.id>=s.nextEffectId||effectIds.has(c.id)||typeof c.title!=='string'||c.title.length>200||typeof c.description!=='string'||c.description.length>2000||!['good','bad','neutral'].includes(c.tone))throw Error('Carta de evento inválida.');effectIds.add(c.id);if(c.input&&!(c.input.kind==='unit-home'&&Number.isInteger(c.input.unitId)&&c.input.unitId>0||c.input.kind==='prison'&&Number.isInteger(c.input.x)&&Number.isInteger(c.input.y)&&s.rooms[key(c.input.x,c.input.y)]||validRiseInput(c.input,s)||validColonyInput(c.input,s)||validRulesInput(c.input,s)||validWorldEventInput(c.input)))throw Error('Escolha de evento inválida.');}
  s.rivalDungeons??=[];
  if(!Array.isArray(s.rivalDungeons)||s.rivalDungeons.length>2000)throw Error('Masmorras rivais inválidas.');
  const dungeonRoots=new Set();for(const d of s.rivalDungeons){
   if(!d||!s.rooms[d.root]||dungeonRoots.has(d.root)||!Number.isInteger(d.requested)||d.requested<3||d.requested>12||!Array.isArray(d.members)||d.members.length<1||d.members.length>d.requested||!d.members.includes(d.root)||new Set(d.members).size!==d.members.length||d.members.some(id=>!s.rooms[id])||!Array.isArray(d.enemyIds)||d.enemyIds.length>3000||d.enemyIds.some(id=>!Number.isInteger(id)||id<=0)||typeof d.fought!=='boolean'||typeof d.claimed!=='boolean')throw Error('Masmorra rival inválida.');dungeonRoots.add(d.root);
  }
  const knownType=t=>Object.prototype.hasOwnProperty.call(UNITS,t)||Object.prototype.hasOwnProperty.call(ENEMIES,t);
  const validUnit=u=>u&&(u.frontTarget===undefined||u.frontTarget===null||Number.isInteger(u.frontTarget)&&u.frontTarget>0)&&(u.size===undefined||finite(u.size)&&u.size>0&&u.size<=5)&&(u.order===undefined||['guard','defend'].includes(u.order))&&(u.facing===undefined||[-1,1].includes(u.facing))&&knownType(u.type)&&(['ally','enemy'].includes(u.team)&&u.type!=='immortal'||u.team==='neutral'&&(['immortal','golem'].includes(u.type)||typeof u.territory==='string'&&s.rooms[u.territory]))&&['id','x','y','hp','maxHp','power','cooldown','shield','attack','walk','stun'].every(n=>finite(u[n]))&&u.maxHp>0&&u.power>0&&Math.abs(u.x)<=100&&Math.abs(u.y)<=100&&s.rooms[u.home];
  const ids=new Set();for(const u of s.units){if(!validUnit(u)||!['ally','enemy','neutral'].includes(u.team)||!finite(u.id)||ids.has(u.id)||!finite(u.x)||!finite(u.y)||Math.abs(u.x)>100||Math.abs(u.y)>100||!finite(u.hp)||!finite(u.maxHp)||!finite(u.power)||!finite(u.cooldown)||!finite(u.shield)||typeof u.type!=='string'||!s.rooms[u.home]||u.power<=0||u.maxHp<=0)throw Error('Unidade inválida.');ids.add(u.id)}
  for(const u of s.units)if(u.team==='neutral'&&u.type==='golem'&&!u.territory){const forge=s.rooms[u.home];if(forge?.type!=='golemforge'||forge.golemId!==u.id||u.x!==forge.x||u.y!==forge.y||u.hp<=0)throw Error('Golem passivo inválido.');}
  for(const u of s.units){
   if(u.burrowing!==undefined&&(typeof u.burrowing!=='boolean'||u.type!=='worm'||u.team!=='enemy'))throw Error('Escavação inválida.');
   if(u.burrowStep!==undefined&&u.burrowStep!==null){const step=u.burrowStep;
    if(!u.burrowing||!Number.isInteger(step.x)||!Number.isInteger(step.y)||typeof step.exit!=='boolean'||step.x!==u.x||step.y<0||step.y>30||u.y<step.y||u.y>step.y+1||!s.rooms[key(step.x,step.y)]||!s.rooms[key(step.x,step.y+1)])throw Error('Trajeto de escavação inválido.');
   }
  }
  for(const c of s.deck)if(!c||!SUITS.concat('★').includes(c.suit)||!Number.isInteger(c.rank)||c.rank<0||c.rank>13)throw Error('Baralho inválido.');
  for(const e of s.log)if(!e||typeof e.text!=='string'||e.text.length>2000||!finite(e.turn))throw Error('Crônica inválida.');
  if(!Array.isArray(data.projectiles)||data.projectiles.length>1000||!Array.isArray(data.dead)||data.dead.length>3000)throw Error('Combate inválido.');
  for(const p of data.projectiles)if(p.piercing!==undefined&&(p.piercing!==true||p.kind!=='bolt'||!['ally','enemy'].includes(p.team)||!Array.isArray(p.hitIds)||p.hitIds.length>3000||p.hitIds.some(id=>!Number.isInteger(id)||id<1)||new Set(p.hitIds).size!==p.hitIds.length||p.t<0||p.t>1||Math.abs(p.tx-p.x)>.015&&Math.abs(p.ty-p.y)>.015))throw Error('Disparo de cerco inválido.');
  for(const p of data.projectiles)for(const n of ['x','y','tx','ty','target','damage','t','duration'])if(!finite(p[n])||p.duration<=0)throw Error('Projétil inválido.');
  if(data.dead.some(u=>!validUnit(u)))throw Error('Unidade caída inválida.');
  for(const r of Object.values(s.rooms)){if(r.garrison&&(!Array.isArray(r.garrison)||r.garrison.length>3000||r.garrison.some(u=>!knownType(u.type)||!finite(u.power)||u.power<=0)))throw Error('Guarnição inválida.')}
  const passageLegacy=s.passageVersion===undefined;
  if(!passageLegacy){
   if(s.passageVersion!==1||!s.passages||typeof s.passages!=='object'||Array.isArray(s.passages)||Object.keys(s.passages).length>4000)throw Error('Passagens inválidas.');
   for(const [id,value]of Object.entries(s.passages)){const ends=id.split('|'),a=s.rooms[ends[0]],b=s.rooms[ends[1]];if(value!==true||ends.length!==2||!a||!b||distance(a,b)!==1||ends.slice().sort().join('|')!==id)throw Error('Ligação inválida no mapa.');}
  }else{s.passages={};for(const r of Object.values(s.rooms))for(const [dx,dy]of [[1,0],[0,1]]){const n=s.rooms[key(r.x+dx,r.y+dy)];if(n)s.passages[[key(r.x,r.y),key(n.x,n.y)].sort().join('|')]=true}s.passageVersion=1;}
  for(const u of s.units)if(u.burrowStep&&!s.passages[[key(u.burrowStep.x,u.burrowStep.y),key(u.burrowStep.x,u.burrowStep.y+1)].sort().join('|')])throw Error('Escavação sem passagem.');
  if(s.barricadeVersion===undefined){
   s.barricades={};const oldRoomPath=(from,to)=>{const queue=[from],previous=new Map([[key(from.x,from.y),null]]);for(let i=0;i<queue.length;i++){const r=queue[i];if(r===to){let k=key(to.x,to.y);while(previous.get(k)&&previous.get(k)!==key(from.x,from.y))k=previous.get(k);return s.rooms[k]===from?null:s.rooms[k]}
    for(const [dx,dy]of DIRS){const n=s.rooms[key(r.x+dx,r.y+dy)];if(n&&s.passages[[key(r.x,r.y),key(n.x,n.y)].sort().join('|')]&&!previous.has(key(n.x,n.y))){previous.set(key(n.x,n.y),key(r.x,r.y));queue.push(n)}}}return null};
   for(const r of Object.values(s.rooms))if(r.barricade){const n=oldRoomPath(r,s.rooms['0,0'])||DIRS.map(([dx,dy])=>s.rooms[key(r.x+dx,r.y+dy)]).find(n=>n&&s.passages[[key(r.x,r.y),key(n.x,n.y)].sort().join('|')]);if(n)s.barricades[[key(r.x,r.y),key(n.x,n.y)].sort().join('|')]={...r.barricade,hp:Math.max(0,r.barricade.hp)};r.barricade=null;}s.barricadeVersion=1;
  }else if(s.barricadeVersion!==1||!s.barricades||typeof s.barricades!=='object'||Array.isArray(s.barricades))throw Error('Portas inválidas.');
  for(const [edge,d]of Object.entries(s.barricades)){if(!s.passages[edge]||!d||!['defensive','offensive'].includes(d.kind)||(![1,2,3].includes(d.level)&&!(d.bone&&d.level===5))||!finite(d.hp)||d.hp<0||d.hp>1e7)throw Error('Porta reforçada inválida.');}
  const legacy=!s.rulesVersion;if(legacy){
   const typeByRoom={largelair:'troll',hungry:'troll',burrow:'worm',elemental:'elemental',golemforge:'golem',vault:'golem',void:'guardian',dragon:'dragon',crypt:'skeleton',nest:'insect',hive:'insect'};
   const groups=new Map(),remap=new Map(),merged=[];
   for(const u of s.units){
    if(u.team==='enemy'){
     const type=typeByRoom[s.rooms[u.home]?.type];if(type){u.type=type;u.enemyName=ENEMIES[type].name;u.size=ENEMIES[type].size;u.range=ENEMIES[type].range}
     else if(u.type==='raider')u.type='goblin';
     if(ENEMIES[u.type]?.single){const k=u.home+':'+u.type,first=groups.get(k);if(first){first.power+=u.power;first.hp+=u.hp;first.maxHp+=u.maxHp;first.shield+=u.shield;remap.set(u.id,first.id);continue}groups.set(k,u)}
    }
    if(Math.abs(u.x-Math.round(u.x))>.001&&Math.abs(u.y-Math.round(u.y))>.001){u.x=Math.round(u.x);u.y=Math.round(u.y);u.moveTarget=null}
    merged.push(u);
   }s.units=merged;for(const projectile of data.projectiles)projectile.target=remap.get(projectile.target)||projectile.target;s.rulesVersion=2;
  }
  for(const r of Object.values(s.rooms))if(r.type!=='sealed'&&!r.builtPartOf&&!DAMAGEABLE_ROOMS.includes(r.type))r.damaged=false;
  for(const r of Object.values(s.rooms))if(r.cavernGroup===key(r.x,r.y)&&r.type!=='cave'&&!r.playerBuilt&&ROOMS[r.type]?.r===undefined){r.bossRoot=r.cavernGroup;for(const member of Object.values(s.rooms))if(member.cavernGroup===r.cavernGroup&&member.type==='cave')member.bossRoot=r.cavernGroup;}
  if(s.returnPhase&&(!Number.isFinite(s.returnPhase.elapsed)||s.returnPhase.elapsed<0||s.returnPhase.elapsed>300000||!Array.isArray(s.returnPhase.units)||s.returnPhase.units.length>3000||s.returnPhase.units.some(u=>!validUnit(u))))throw Error('Retorno inválido.');validateChronicle(s);validateIncursions(s);validateResearch(s);validateRiseState(s,data.dead);validateColony(s);validateInteractions(s);validateAdvanced(s);validateWorlds(s);validateOccupations(s);validateChallenges(s);for(const r of Object.values(s.rooms)){delete r.longCave;delete r.longPanel;if(r.type==='altar'&&!r.dedication)r.dedication='fortune';if(!s.riseVersion&&r.type==='solitary'&&r.prisoners&&!r.captive)r.captive={type:'raider',power:1,name:'Prisioneiro antigo',range:.42,size:1,mutiny:12};}s.riseVersion=1;const g=new Game();g.s=s;g.s.name=s.name.slice(0,40);g.s.paused=s.combat;for(const u of s.units){u.order='defend';if(u.frontTarget&&!s.units.some(e=>e.id===u.frontTarget&&e.team==='enemy'&&e.hp>0))u.frontTarget=null;if(u.team==='ally'&&['golem','siege'].includes(u.type))u.size=UNITS[u.type].size;else u.size??=(u.team!=='ally'?ENEMIES[u.type]?.size:UNITS[u.type]?.size)||1;u.facing??=1;if(u.moveTarget&&!s.rooms[u.moveTarget])u.moveTarget=null;}g.projectiles=data.projectiles;g.dead=data.dead;
  if(s.immortalVersion!==undefined&&s.immortalVersion!==1)throw Error('Versão de criatura imortal inválida.');
  for(const r of g.rooms){if(r.type==='invincible'){
   if(s.immortalVersion===undefined){r.closed=false;g.placeImmortal(r)}
   else if(!g.blockedByImmortal(r)||r.closed)throw Error('Criatura imortal ausente ou câmara inválida.');
  }else if(r.immortalId)throw Error('Criatura imortal fora da câmara.');}
  for(const u of g.s.units)if(u.type==='immortal'&&(u.hp<=0||u.team!=='neutral'||g.s.rooms[u.home]?.type!=='invincible'||g.s.rooms[u.home].immortalId!==u.id||u.x!==g.s.rooms[u.home].x||u.y!==g.s.rooms[u.home].y))throw Error('Criatura imortal inválida.');
  for(const r of g.rooms)if(r.type==='sealed'&&r.damaged)g.openSealedRoom(r,true);
  g.s.research??=newResearch(true);initializeChronicleState(g.s);g.enforceJokerDepth();g.migrateRoomLayers();g.initializeRaidSchedule();g.migrateOccupations();g.s.paused=g.s.combat;g.s.immortalVersion=1;g.s.effectCards=g.s.effectCards.filter(c=>c.input?.action!=='informationDebt');g.events=[];delete g.s.returnPhase;return g;
 }
}

installRiseRules(Game);

installColony(Game);

installAdvancedRules(Game);

installEncounters(Game);

installWorlds(Game);

installWyrd(Game);

installMonsterTraits(Game);

installChallenges(Game);

installArtifacts(Game);

installChronicle(Game);

installInteractions(Game);

installResearch(Game);

installIncursions(Game);
installOccupations(Game);
installWorldEvents(Game);

const uncachedUpdate=Game.prototype.update;
Game.prototype.update=function(dt){return this.withQueryCache(()=>uncachedUpdate.call(this,dt),false);};


// passages.js
// Software pixel shader: evaluate a mask, material transition and lighting once
// per connection. Canvas 2D keeps the same result offline and on mobile GPUs.
const PASSAGE_MATERIALS={
 rock:{wall:[89,84,66],light:[163,153,119],floor:[27,29,24]},
 masonry:{wall:[99,95,78],light:[176,166,134],floor:[30,31,27]},
 mine:{wall:[103,82,55],light:[173,146,99],floor:[33,29,22]},
 gold:{wall:[137,100,30],light:[238,202,91],floor:[47,35,13]},
 water:{wall:[39,95,117],light:[118,183,197],floor:[15,39,49]},
 fire:{wall:[109,71,47],light:[191,135,75],floor:[47,28,22]},
 organic:{wall:[105,97,51],light:[177,159,90],floor:[38,35,21]},
 forest:{wall:[69,86,53],light:[138,157,98],floor:[25,35,23]},
 crypt:{wall:[91,89,77],light:[175,169,140],floor:[28,28,25]},
 crystal:CRYSTAL_PALETTE,
 miasma:{wall:[99,71,114],light:[171,141,184],floor:[33,24,39]},
 blindgas:{wall:[89,100,103],light:[168,186,186],floor:[31,34,34]},
 flammable:{wall:[116,105,49],light:[195,184,105],floor:[39,34,20]},
 gas:{wall:[82,96,61],light:[147,165,104],floor:[29,40,25]}
};
function passageArchitecture(room){return room.planarConstruction||ROOMS[room.type]?.r!==undefined||['dragon','golemforge','challenge','desolate','gate','crypt','ancienttemple','ancientlibrary','ancientprison','rivalhold','city','tomb','sealed','vault'].includes(room.type)?'built':'cavern'}
function passageMaterial(room){
 const type=room.hazards?.[0]||room.contaminant||room.type;
 if(['miasma','blindgas','flammable'].includes(type))return type;
 if(['water','sewer','well','laundry','pump','springs','mud'].includes(type))return 'water';
 if(['treasury','vault','dragon','city','rivalmine','mine','parlor','gold','games'].includes(type))return 'gold';
 if(['lava','crater','forge','golemforge','kitchen','dragonforge'].includes(type))return 'fire';
 if(['gas','flammable','miasma','blindgas'].includes(type))return 'gas';
 if(['hive','nest','breeder','slime'].includes(type))return 'organic';
 if(['forest','fungus','fungi','mushrooms'].includes(type))return 'forest';
 if(['mine','rivalmine','rails','shaft','elevator','workshop'].includes(type))return 'mine';
 if(['crypt','tomb','ancientprison','desolate'].includes(type))return 'crypt';
 if(['crystal','portal','stabilizer','artifact','ritual','chaos','endersgate','orefinder'].includes(type))return 'crystal';
 if(['cave','surface','ruins','chasm'].includes(type))return 'rock';
 return 'masonry';
}
function passagePalette(room){const material=layerMaterialPalette(room.worldLayer||0,PASSAGE_MATERIALS[passageMaterial(room)]);if(room.type!=='void'&&!room.voidTint)return material;const purple={floor:[18,9,31],wall:[67,39,92],light:[146,108,184]},hazard=room.hazards?.length||room.contaminant||ROOMS[room.type]?.hazard;if(!hazard)return purple;return Object.fromEntries(['floor','wall','light'].map(k=>[k,purple[k].map((v,i)=>Math.round(v*.65+material[k][i]*.35))]));}
function passageNoise(x,y,seed){let n=Math.imul(x+seed,374761393)^Math.imul(y+seed,668265263);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296}
function passageHash(text){let n=2166136261;for(const char of text)n=Math.imul(n^char.charCodeAt(0),16777619);return n>>>0}
function passageMix(a,b,t){return a.map((v,i)=>Math.round(v+(b[i]-v)*t))}
function passageRGB(a){return `rgb(${a.join(',')})`}
class ProceduralPassages{
 constructor(limit=256){this.cache=new Map();this.textures=new WeakMap();this.limit=limit;this.generated=0}
 texture(image){
  if(!image)return null;if(this.textures.has(image))return this.textures.get(image);
  const tile=document.createElement('canvas');tile.width=32;tile.height=24;
  const ctx=tile.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0,32,24);
  const data=ctx.getImageData(0,0,32,24).data;this.textures.set(image,data);return data;
 }
 get(a,b,vertical,images){
  const signature=r=>`${r.x},${r.y}:${r.type}:${r.variant}:${r.hazards?.join(',')||r.contaminant||''}:${!!r.damaged}:${r.worldLayer||0}`;
  const id=`${vertical?'v':'h'}|${signature(a)}|${signature(b)}`;
  if(this.cache.has(id)){const entry=this.cache.get(id);this.cache.delete(id);this.cache.set(id,entry);return entry}
  const ma=passageMaterial(a),mb=passageMaterial(b),aa=passageArchitecture(a),ab=passageArchitecture(b),pa=passagePalette(a),pb=passagePalette(b);
  const seed=passageHash(id),length=vertical?27:26,height=20,canvas=document.createElement('canvas');canvas.width=length;canvas.height=height;
  const ctx=canvas.getContext('2d'),pixels=ctx.createImageData(length,height);
  const textures=[this.texture(images[`${a.type}-${a.variant}`]),this.texture(images[`${b.type}-${b.variant}`])];
  // Distort only the walls: the central walkable strip stays straight, matching
  // gameplay paths and ranged line of sight. All evaluation is in integer pixels.
  for(let x=0;x<length;x++){
   const t=x/(length-1),blend=aa===ab?t*t*(3-2*t):t<.5?0:1,envelope=Math.sin(t*Math.PI),architecture=t<.5?aa:ab;
   const warp=architecture==='built'?0:Math.round((passageNoise(Math.floor(x/4),0,seed)-.5)*3*envelope);
   for(let y=0;y<height;y++){
    const side=y<10?-1:1,edge=side<0?(architecture==='built'?3:2+Math.round(envelope*2)+warp):(architecture==='built'?16:17-Math.round(envelope*2)+warp),distance=side<0?y-edge:edge-y;
    const noise=passageNoise(x,y,seed);if(distance<0&&(architecture==='built'||distance<-2||noise>.45))continue;
    const center=y>=7&&y<=12;
    let color=center?passageMix(pa.floor,pb.floor,blend):passageMix(pa.wall,pb.wall,blend);
    if(!center){
     if(architecture==='built'&&((y===5||y===14)||(x+(y<7?0:3))%6===0))color=[46,43,34];
     if(distance<=1)color=passageMix(pa.light,pb.light,blend);
     else if(noise<.24)color=color.map(v=>Math.round(v*.62));
     else if(noise>.8)color=passageMix(color,passageMix(pa.light,pb.light,blend),.45);
     // Grain from the actual room illustrations, dithered across the transition.
     const source=textures[noise<blend?1:0];
     if(source){const i=((y%24)*32+(x%32))*4,lum=(source[i]+source[i+1]+source[i+2])/3;if(source[i+3]>128&&lum<190&&lum>25)color=passageMix(color,passageMix(pa.wall,pb.wall,blend),lum/255*.3)}
    }
    if((a.damaged&&t<.5||b.damaged&&t>.5)&&((x+y*2)%13===0))color=[39,32,27];
    const index=(y*length+x)*4;pixels.data.set([...color,255],index);
   }
  }
  ctx.putImageData(pixels,0,0);
  // Material-specific details fade out before the other room's entrance.
  for(let x=2;x<length-2;x++){
   const t=x/(length-1),material=aa!==ab?(t<.5?ma:mb):passageNoise(x,21,seed)<t?mb:ma;
   const palette=PASSAGE_MATERIALS[material];ctx.fillStyle=passageRGB(palette.light);
   if(vertical){if(x%4===0)ctx.fillRect(x,7,1,6);ctx.fillStyle=passageRGB(palette.wall);ctx.fillRect(x,6,1,1);ctx.fillRect(x,13,1,1)}
   if(material==='mine'){
    if(!vertical){ctx.fillRect(x,7,1,1);ctx.fillRect(x,12,1,1);if(x%7===0){ctx.fillStyle='#66563a';ctx.fillRect(x,3,2,4);ctx.fillRect(x,13,2,4)}}
   }else if(material==='masonry'||material==='crypt'){
    if(x%6===0){ctx.fillStyle='#302f27';ctx.fillRect(x,3,1,3);ctx.fillRect(x+2,14,1,3)}
    if(material==='crypt'&&x%13===0){ctx.fillStyle='#b0a68a';ctx.fillRect(x,4,2,2);ctx.fillStyle='#24251f';ctx.fillRect(x,5,1,1)}
   }else if(material==='forest'||material==='organic'){
    if(x%3===0){ctx.fillRect(x,5,2,1);ctx.fillRect(x+1,6,1,1)}
    if(material==='organic'&&x%5===0){ctx.fillStyle='#494325';ctx.fillRect(x,14,3,2);ctx.fillStyle='#9c8a4f';ctx.fillRect(x+1,14,1,1)}
   }else if(material==='fire'&&x%4===0){ctx.fillStyle=passageRGB(palette.light);ctx.fillRect(x,14,2,1)}
   else if(material==='water'&&x%5===0){ctx.fillStyle=passageRGB(palette.light);ctx.fillRect(x,12,3,1)}
   else if(material==='crystal'&&x%8===0){ctx.fillRect(x,3,1,3);ctx.fillRect(x-1,4,3,1)}
  }
  // Door jambs belong only to the built endpoint. Cavern mouths retain rough rock.
  for(const [architecture,x,palette]of [[aa,0,pa],[ab,length-3,pb]])if(architecture==='built'){
   ctx.fillStyle=passageRGB(palette.floor);ctx.fillRect(x,2,3,5);ctx.fillRect(x,13,3,5);
   ctx.fillStyle=passageRGB(palette.light);ctx.fillRect(x,2,2,1);ctx.fillRect(x,13,2,1);
   ctx.fillStyle=passageRGB(palette.wall);ctx.fillRect(x,3,2,3);ctx.fillRect(x,14,2,3);
  }
  const entry={canvas,ma,mb,aa,ab,pa,pb,seed,length,vertical};this.cache.set(id,entry);this.generated++;
  if(this.cache.size>this.limit)this.cache.delete(this.cache.keys().next().value);
  return entry;
 }
 draw(ctx,a,b,vertical,images,time,reduced,fortification=null,mouths=null){
  const entry=this.get(a,b,vertical,images),{canvas,length,ma,mb,seed,pa,pb}=entry;
  ctx.save();ctx.imageSmoothingEnabled=false;
  // Local X always follows the connection, so the same mask joins all 4 ports.
  ctx.translate(a.x*180+(vertical?0:64),a.y*144+(vertical?42:0));if(vertical)ctx.rotate(Math.PI/2);
  if(mouths?.start>0)ctx.drawImage(canvas,0,0,6,20,-mouths.start,-20,mouths.start+2,40);
  if(mouths?.end>0)ctx.drawImage(canvas,length-6,0,6,20,length*2-2,-20,mouths.end+2,40);
  ctx.drawImage(canvas,0,-20,length*2,40);
  const phase=reduced?0:Math.floor(time/240)%8;
  for(let x=2;x<length-2;x+=4){
   const t=x/(length-1),material=t<.5?ma:mb;
   if(material==='water'||material==='fire'){
    ctx.fillStyle=passageRGB((t<.5?pa:pb).light);const y=material==='water'?10:14;
    ctx.fillRect((x+(phase+Math.floor(seed%3))%3)*2,(y-10)*2,4,2);
   }else if(['gas','blindgas','flammable','miasma'].includes(material)){
    ctx.fillStyle='rgba('+PASSAGE_MATERIALS[material].light.join(',')+',.3)';const y=6+(x+phase)%7;ctx.fillRect(x*2,(y-10)*2,6,2);
   }
  }
  ctx.restore();
  if(!fortification&&entry.aa==='built'&&entry.ab==='built'){
   const x=Math.round((a.x+b.x)*90+(vertical?15:0)),y=Math.round((a.y+b.y)*72+(vertical?-2:-13));
   const flicker=reduced?0:Math.floor(time/160)%3;
   ctx.save();ctx.translate(x,y);ctx.fillStyle='#d6a44918';ctx.fillRect(-12,-14,26,28);ctx.fillStyle='#c6954528';ctx.fillRect(-7,-9,16,17);
   ctx.fillStyle='#302a20';ctx.fillRect(-2,0,6,11);ctx.fillStyle='#8a6238';ctx.fillRect(0,2,2,7);
   ctx.fillStyle='#b87936';ctx.fillRect(-3,-4,8,6);ctx.fillStyle='#d7a148';ctx.fillRect(-1,-8-flicker*2,4,8+flicker*2);ctx.fillStyle='#ead9a0';ctx.fillRect(0,-5-flicker*2,2,5);ctx.restore();
  }
 }
}


// material-shader.js
const shaderClamp=x=>Math.max(0,Math.min(1,x));
const shaderSmooth=(a,b,x)=>{const t=shaderClamp((x-a)/(b-a));return t*t*(3-2*t);};
function terrainNoise(x,y){let n=Math.imul(Math.floor(x),374761393)^Math.imul(Math.floor(y),668265263);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967296;}
function shaderMix(a,b,t){return a.map((v,i)=>Math.round(v+(b[i]-v)*t));}
// Canonical half-edge interpolation: both endpoints evaluate the same palette
// at the seam. No room image is stretched, displaced or blended with paper.
function materialPaletteAt(room,x,y,width,height,neighbors=[]){
 const own=room.palette||passagePalette(room),out={floor:[...own.floor],wall:[...own.wall],light:[...own.light]};
 for(const edge of neighbors){const d=edge.dx<0?x:edge.dx>0?width-1-x:edge.dy<0?y:height-1-y,length=edge.dx?width:height,t=.5*(1-shaderSmooth(0,Math.min(36,length/3),d));if(t<=0)continue;const p=edge.palette||passagePalette(edge.room);for(const channel of ['floor','wall','light'])out[channel]=shaderMix(out[channel],p[channel],t);}
 return out;
}
function materialLightsAt(x,y,lights=[],time=0,reduced=false){let light=0;for(const source of lights){const distance=Math.hypot(x-source.x,y-source.y),falloff=1-shaderSmooth(0,source.radius||100,distance),pulse=reduced?1:.9+.1*Math.sin(time/(source.period||1300)+(source.x+source.y)*.02);light+=falloff*falloff*(source.intensity??.2)*pulse;}return Math.min(.38,light);}


// room-appearance.js
const ROOM_HAZARD_COLORS={slime:[[22,37,15],[74,108,38],[151,180,84]],water:[[15,39,49],[39,95,117],[118,183,197]],lava:[[45,23,17],[143,65,28],[229,143,60]],crater:[[45,23,17],[143,65,28],[229,143,60]],gas:[[24,36,18],[72,106,39],[161,190,92]],miasma:[[33,24,39],[99,71,114],[171,141,184]],blindgas:[[31,34,34],[89,100,103],[168,186,186]],flammable:[[39,34,20],[116,105,49],[195,184,105]]};
const roomMix=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
function roomTone(lum,palette){return lum<95?roomMix(palette[0],palette[1],Math.max(0,(lum-20)/75)):roomMix(palette[1],palette[2],Math.min(1,(lum-95)/100))}
class RoomAppearance{
 constructor(limit=384){this.cache=new Map();this.identities=new WeakMap();this.nextId=1;this.limit=limit;this.prepared=new Map();this.preparedBytes=0;this.latest=new Map();this.frameWork=undefined}
 beginFrame(){this.frameWork=0;}
 endFrame(){this.frameWork=undefined;}
 get(image,type,hazards=[],time=0,reduced=false,options={}){
  if(!image)return null;
  // Cache visual inputs only: production counters, captives and other gameplay
  // fields must never create a different shader texture.
  options={...options,neighbors:(options.neighbors||[]).map(e=>({dx:e.dx,dy:e.dy,room:{type:e.room.type,worldLayer:e.room.worldLayer||0,hazards:e.room.hazards||[],contaminant:e.room.contaminant}}))};
  const origin=options.origin||{x:0,y:0},scale=options.scale||1;
  options.lights=(options.lights||[]).filter(l=>l.x+(l.radius||100)>=origin.x&&l.x-(l.radius||100)<=origin.x+image.width*scale&&l.y+(l.radius||100)>=origin.y&&l.y-(l.radius||100)<=origin.y+image.height*scale);
  const shadeRoom={type,worldLayer:options.worldLayer||0,hazards:hazards.filter(h=>ROOM_HAZARD_COLORS[h])};shadeRoom.palette=passagePalette(shadeRoom);for(const e of options.neighbors)e.palette=passagePalette(e.room);
  const crystal=type==='crystal',layers=hazards.filter(h=>ROOM_HAZARD_COLORS[h]);
  if(!this.identities.has(image))this.identities.set(image,this.nextId++);
  const phase=(crystal||options.lights?.length)&&!reduced?Math.floor((time+((origin.x*7+origin.y*11)%500+500)%500)/500)%16:0,key=`${this.identities.get(image)}|${type}|${layers.join(',')}|${phase}|${JSON.stringify(options)}`;
  if(this.cache.has(key)){const value=this.cache.get(key);this.cache.delete(key);this.cache.set(key,value);return value}
  if(!options.staticTint&&(crystal||options.lights.length)){
   const spec=`${this.identities.get(image)}|${type}|${layers.join(',')}|${JSON.stringify(options)}`;
   // Spread animated re-shading across frames instead of updating every
   // illuminated room at the same phase boundary. Static changes never wait.
   if(this.frameWork>=3)return this.latest.get(spec)||this.get(image,type,layers,0,true,{neighbors:options.neighbors,staticTint:true,worldLayer:options.worldLayer||0});
   if(this.frameWork!==undefined)this.frameWork++;
   let prepared=this.prepared.get(spec);
   if(!prepared){
    const base=this.get(image,type,layers,0,true,{neighbors:options.neighbors,staticTint:true,worldLayer:options.worldLayer||0});
    const bc=base.getContext('2d'),frame=bc.getImageData(0,0,base.width,base.height),data=frame.data,targets=new Uint8ClampedArray(data.length),lum=new Float32Array(data.length/4),masks=options.lights.map(()=>new Uint8Array(data.length/4));
    const rc=document.createElement('canvas');rc.width=image.width;rc.height=image.height;rc.getContext('2d').drawImage(image,0,0);const raw=rc.getContext('2d').getImageData(0,0,rc.width,rc.height).data;
    for(let n=0;n<lum.length;n++){const i=n*4;if(raw[i+3]<32||Math.abs(raw[i]-229)+Math.abs(raw[i+1]-221)+Math.abs(raw[i+2]-198)<36)continue;lum[n]=raw[i]*.299+raw[i+1]*.587+raw[i+2]*.114;const x=n%image.width,y=Math.floor(n/image.width),palette=materialPaletteAt(shadeRoom,x,y,image.width,image.height,options.neighbors);targets[i]=palette.light[0];targets[i+1]=palette.light[1];targets[i+2]=palette.light[2];for(let k=0;k<options.lights.length;k++){const l=options.lights[k],d=Math.hypot(origin.x+x*scale-l.x,origin.y+y*scale-l.y),f=1-shaderSmooth(0,l.radius||100,d);masks[k][n]=Math.round(f*f*255);}}
    prepared={frame,targets,lum,masks,bytes:frame.data.byteLength+targets.byteLength+lum.byteLength+masks.reduce((sum,m)=>sum+m.byteLength,0)};this.prepared.set(spec,prepared);this.preparedBytes+=prepared.bytes;while(this.prepared.size>96||this.preparedBytes>24*1024*1024&&this.prepared.size>1){const oldest=this.prepared.keys().next().value;this.preparedBytes-=this.prepared.get(oldest).bytes;this.prepared.delete(oldest);}
   }
   const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;const c=canvas.getContext('2d'),frame=c.createImageData(canvas.width,canvas.height);frame.data.set(prepared.frame.data);const p=frame.data,pulse=(1-Math.cos(phase/16*Math.PI*2))*.5,weights=options.lights.map(l=>(l.intensity??.2)/255*(reduced?1:.9+.1*Math.sin(phase*500/(l.period||1300)+(l.x+l.y)*.02)));
   for(let n=0;n<prepared.lum.length;n++){const lum=prepared.lum[n];if(!lum)continue;const i=n*4;let light=0;for(let k=0;k<weights.length;k++)light+=prepared.masks[k][n]*weights[k];light=Math.min(.38,light);const shine=crystal&&lum>95?pulse*.22*Math.min(1,(lum-95)/90):0;for(let k=0;k<3;k++){const base=p[i+k]+([176,220,247][k]-p[i+k])*shine;p[i+k]=Math.round(base+(prepared.targets[i+k]-base)*light);}}
   c.putImageData(frame,0,0);this.cache.set(key,canvas);this.latest.set(spec,canvas);if(this.latest.size>192)this.latest.delete(this.latest.keys().next().value);if(this.cache.size>this.limit)this.cache.delete(this.cache.keys().next().value);return canvas;
  }
  const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;const c=canvas.getContext('2d');c.drawImage(image,0,0);
  const frame=c.getImageData(0,0,canvas.width,canvas.height),p=frame.data,w=canvas.width,pulse=(1-Math.cos(phase/16*Math.PI*2))*.5;
  const material=passagePalette(shadeRoom),palette=[material.floor,material.wall,material.light];
  for(let i=0;i<p.length;i+=4){
   const original=[p[i],p[i+1],p[i+2]],paperDistance=Math.abs(p[i]-229)+Math.abs(p[i+1]-221)+Math.abs(p[i+2]-198);
   if(p[i+3]<32||paperDistance<36)continue;const lum=original[0]*.299+original[1]*.587+original[2]*.114,x=i/4%w,y=Math.floor(i/4/w);
   const surface=options.neighbors?.length?materialPaletteAt(shadeRoom,x,y,canvas.width,canvas.height,options.neighbors):null;let color=roomTone(lum,surface?[surface.floor,surface.wall,surface.light]:palette);
   if(crystal&&lum>95)color=roomMix(color,[176,220,247],pulse*.22*Math.min(1,(lum-95)/90));
   for(const hazard of layers){const hMaterial=passagePalette({type:hazard,worldLayer:options.worldLayer||0,voidTint:type==='void'}),palette=surface&&hazard===layers[0]?[surface.floor,surface.wall,surface.light]:[hMaterial.floor,hMaterial.wall,hMaterial.light],liquid=['water','lava','crater'].includes(hazard),depth=y/canvas.height;
    color=roomMix(color,roomTone(lum,palette),liquid?(.4+.52*shaderSmooth(.38,.70,depth)):.72);
    // Wet glints and wisps modify only existing foreground pixels, never a box.
    if(liquid&&depth>.52&&(y%9===2&&x%13<7))color=roomMix(color,palette[2],.5);
    if(!liquid&&(x+y*2)%23<2)color=roomMix(color,palette[2],.22);
   }
   if(options.lights?.length){const origin=options.origin||{x:0,y:0},scale=options.scale||1,light=materialLightsAt(origin.x+x*scale,origin.y+y*scale,options.lights,phase*500,reduced);color=roomMix(color,surface?.light||material.light,light);}
   p[i]=color[0];p[i+1]=color[1];p[i+2]=color[2];
  }
  c.putImageData(frame,0,0);this.cache.set(key,canvas);if(this.cache.size>this.limit)this.cache.delete(this.cache.keys().next().value);return canvas;
 }
 url(image,type,hazards,time,reduced,options={}){const result=this.get(image,type,hazards,time,reduced,options);if(!result)return null;if(result instanceof HTMLCanvasElement){result.roomDataURL??=result.toDataURL('image/png');return result.roomDataURL}return result.src}
}


// room-framing.js
// Match the footprint of the old room illustrations without stretching the art.
class RoomFraming{
 constructor(){this.frames=new WeakMap();this.mouths=new WeakMap()}
 frame(image){
  if(!image)return image;if(this.frames.has(image))return this.frames.get(image);
  const source=document.createElement('canvas');source.width=image.width;source.height=image.height;const s=source.getContext('2d');s.drawImage(image,0,0);const pixels=s.getImageData(0,0,source.width,source.height).data;
  let left=source.width,right=-1,top=source.height,bottom=-1;
  for(let y=0;y<source.height;y++)for(let x=0;x<source.width;x++){const i=(y*source.width+x)*4;if(pixels[i+3]>=32&&pixels[i]<200){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y)}}
  if(right<left)return image;
  const canvas=document.createElement('canvas');canvas.width=128;canvas.height=86;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.fillStyle='#e5ddc6';c.fillRect(0,0,128,86);
  const width=right-left+1,height=bottom-top+1,scale=Math.min(124/width,80/height),w=Math.round(width*scale),h=Math.round(height*scale);
  c.drawImage(source,left,top,width,height,Math.round((128-w)/2),Math.round(43-h/2),w,h);this.frames.set(image,canvas);return canvas;
 }
 ports(image){
  if(!image)return{east:12,west:12,north:12,south:12};if(this.mouths.has(image))return this.mouths.get(image);
  const canvas=document.createElement('canvas');canvas.width=128;canvas.height=86;const c=canvas.getContext('2d');c.drawImage(image,0,0,128,86);const pixels=c.getImageData(0,0,128,86).data;
  const solid=(x,y)=>{const i=(y*128+x)*4;return pixels[i+3]>=32&&pixels[i]<200};
  const edge=(horizontal,reverse)=>{const count=horizontal?128:86;for(let n=0;n<count;n++){const p=reverse?count-1-n:n;let hits=0;for(let k=-4;k<=4;k++)if(solid(horizontal?p:64+k,horizontal?47+k:p))hits++;if(hits>=3)return p}return horizontal?64:47};
  const ports={west:Math.max(0,Math.min(32,(edge(true,false)-64)*1.25+6+64)),east:Math.max(0,Math.min(32,64-((edge(true,true)-64)*1.25-6))),north:Math.max(0,Math.min(32,edge(false,false)*113.33/86-62+6+48)),south:Math.max(0,Math.min(32,42-(edge(false,true)*113.33/86-62-6)))};
  this.mouths.set(image,ports);return ports;
 }
}


// room-modules.js
const BOSS_EXTENSION_FAMILIES={artifact:'void',dragon:'palace',largelair:'troll',elemental:'elemental',golemforge:'forge',void:'void',hive:'hive',burrow:'burrow',vault:'vault',tomb:'tomb',challenge:'arena',hungry:'hungry'};
const EXTENSION_FAMILIES=[...new Set(Object.values(BOSS_EXTENSION_FAMILIES)),'cavern'];
function bossRoomRoot(game,room){
 if(!room?.bossRoot)return null;const root=game?.s.rooms[room.bossRoot];return root&&root.bossRoot===room.bossRoot&&!root.playerBuilt&&ROOMS[root.type]?.r===undefined?root:null;
}
function visualRoom(game,room){if(room?.planarReward==='honey')return{...room,type:'hive',planarConstruction:true};const built=room?.builtPartOf&&game?.s.rooms[room.builtPartOf];if(built)return{...room,type:built.type,builtExtension:true};if(room?.sourceType&&['bridge','drawbridge'].includes(room.type))return{...room,type:room.sourceType,bridgeSurface:true};const root=bossRoomRoot(game,room);return root&&root!==room&&(room.type==='cave'||room.discoveryRoot===room.bossRoot&&room.type===root.type)&&!room.playerBuilt?{...room,type:root.type,bossExtension:true,bossFamily:BOSS_EXTENSION_FAMILIES[root.type]||'cavern',dragonAwake:root.dragonAwake}:room}
function masonryRoom(room){return !!room&&(room.planarConstruction||ROOMS[room.type]?.r!==undefined)}
function sharedBossRoom(game,a,b){const first=bossRoomRoot(game,a),second=bossRoomRoot(game,b);return !!first&&first===second&&(a===first||a.type==='cave')&&(b===first||b.type==='cave')&&!a.playerBuilt&&!b.playerBuilt}

function sharedFormation(a,b){return !!a.discoveryRoot&&a.discoveryRoot===b.discoveryRoot&&(!a.playerBuilt||!!a.sourceType)&&(!b.playerBuilt||!!b.sourceType)}


// cavern-modules.js
// Original room sprites remain intact. Only the shared opening receives a
// painted patch, cropped and scaled uniformly, never warped.
class CavernModules{
 constructor(){this.cache=new Map();this.ids=new WeakMap();this.nextId=1;this.appearance=new RoomAppearance()}
 identity(image){if(!this.ids.has(image))this.ids.set(image,this.nextId++);return this.ids.get(image)}
 patch(a,b,vertical,images){
  const variant=(a.variant+b.variant)%2,architecture=a.joinArchitecture==='built'&&b.joinArchitecture==='built'?'built':'cavern',raw=images[`${architecture}-${vertical?'vertical':'horizontal'}-${variant}`];if(!raw)return null;
  const first=this.appearance.get(raw,a.type,a.hazards||[a.contaminant].filter(Boolean),0,true,{worldLayer:a.worldLayer||0}),second=this.appearance.get(raw,b.type,b.hazards||[b.contaminant].filter(Boolean),0,true,{worldLayer:b.worldLayer||0}),id=`${this.identity(first)}:${this.identity(second)}:${vertical}`;if(this.cache.has(id))return this.cache.get(id);
  const tile=document.createElement('canvas');tile.width=vertical?60:80;tile.height=vertical?80:56;const ctx=tile.getContext('2d');ctx.imageSmoothingEnabled=false;
  const crop=image=>{const unit=document.createElement('canvas');unit.width=unit.height=80;const c=unit.getContext('2d');c.imageSmoothingEnabled=false;c.drawImage(image,0,0,80,80);return unit};
  ctx.drawImage(crop(first),vertical?10:0,vertical?0:12,tile.width,tile.height,0,0,tile.width,tile.height);const left=ctx.getImageData(0,0,tile.width,tile.height);ctx.clearRect(0,0,tile.width,tile.height);ctx.drawImage(crop(second),vertical?10:0,vertical?0:12,tile.width,tile.height,0,0,tile.width,tile.height);const right=ctx.getImageData(0,0,tile.width,tile.height),p=left.data;
  // The room palettes meet at the centre; hazards stay on their own side.
  for(let y=0;y<tile.height;y++)for(let x=0;x<tile.width;x++){const axis=vertical?y:x,length=vertical?tile.height:tile.width,blend=Math.max(0,Math.min(1,(axis/length-.38)/.24)),i=(y*tile.width+x)*4;if((vertical?x>14&&x<46:y>17&&y<45)&&Math.abs(p[i]-229)+Math.abs(p[i+1]-221)+Math.abs(p[i+2]-198)<60){const pa=passagePalette(a).floor,pb=passagePalette(b).floor;for(let k=0;k<3;k++){p[i+k]=pa[k];right.data[i+k]=pb[k]}}for(let k=0;k<3;k++)p[i+k]=Math.round(p[i+k]*(1-blend)+right.data[i+k]*blend);p[i+3]=Math.max(p[i+3],right.data[i+3]);if((vertical?x>16&&x<44:y>19&&y<43)&&p[i+3]<255){const floor=passagePalette(axis<length/2?a:b).floor;p[i]=floor[0];p[i+1]=floor[1];p[i+2]=floor[2];p[i+3]=255;}}
  ctx.putImageData(left,0,0);this.cache.set(id,tile);if(this.cache.size>128)this.cache.delete(this.cache.keys().next().value);return tile;
 }
 draw(ctx,a,b,first,second,images){
  if(!first||!second)return;const vertical=a.x===b.x,tile=this.patch({...a,image:first},{...b,image:second},vertical,images);if(!tile)return;
  const x=(a.x+b.x)*90,y=(a.y+b.y)*72;
  ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(tile,x-tile.width*.625,y-5-tile.height*.625,tile.width*1.25,tile.height*1.25);ctx.restore();
 }
}


// battle-transitions.js
// Presentation trajectories follow the opened graph; combat bookkeeping and
// saves already hold the settled result while the visible troops walk home.
class BattleTransitions{
 constructor(renderer){this.renderer=renderer;this.white=new WeakMap();this.returns=new Map();this.returnUntil=0;this.game=null;this.banished=[];this.shards=[]}
 returnHome(units,time){
  const r=this.renderer,g=r.game;this.game=g;this.returns.clear();this.returnUntil=time;this.returnStart=time;const queues=new Map();
  for(const u of units){const live=g.s.units.find(v=>v.id===u.id&&v.team==='ally'&&v.hp>0),home=g.s.rooms[u.home];if(!live||!home||g.unitData(u).speed<=0)continue;
   const first=g.s.rooms[u.moveTarget]||g.room(Math.round(u.x),Math.round(u.y));if(!first)continue;const route=g.path(first,home,'ally',u);if(route===null)continue;
   const points=[{x:u.x,y:u.y},first,...route].filter((p,i,a)=>!i||Math.hypot(p.x-a[i-1].x,p.y-a[i-1].y)>.00001);if(points.length<2)continue;
   const lengths=[];let total=0;for(let i=1;i<points.length;i++){total+=Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y);lengths.push(total)}
   const id=points.slice(1).map(p=>`${p.x},${p.y}`).join('|'),rank=queues.get(id)||0;queues.set(id,rank+1);const speed=g.unitData(u).speed*(g.s.artifacts.includes('speed')?1.15:1),start=time+rank*280,duration=total/speed*1000;
   this.returns.set(u.id,{points,lengths,total,start,duration,walk:u.walk||0});this.returnUntil=Math.max(this.returnUntil,start+duration);
  }
 }
 renderUnits(time){
  const r=this.renderer,g=r.game;if(r.exporting||this.game!==g||time>=this.returnUntil)return g.s.units;
  return g.s.units.map(u=>{const track=this.returns.get(u.id);if(!track||time>=track.start+track.duration)return u;
   const travel=Math.max(0,Math.min(track.total,(time-track.start)/track.duration*track.total));let i=track.lengths.findIndex(n=>n>=travel);if(i<0)i=track.lengths.length-1;const a=track.points[i],b=track.points[i+1],before=i?track.lengths[i-1]:0,f=(travel-before)/Math.max(.00001,track.lengths[i]-before);
   return{...u,x:a.x+(b.x-a.x)*f,y:a.y+(b.y-a.y)*f,walk:track.walk+travel*12,attack:0,facing:b.x!==a.x?Math.sign(b.x-a.x):u.facing};
  });
 }
 silhouette(image){if(!image)return null;if(this.white.has(image))return this.white.get(image);const c=document.createElement('canvas');c.width=image.width;c.height=image.height;const ctx=c.getContext('2d');ctx.drawImage(image,0,0);ctx.globalCompositeOperation='source-in';ctx.fillStyle='#ffffff';ctx.fillRect(0,0,c.width,c.height);this.white.set(image,c);return c}
 defeat(units,time,reduced){
  const r=this.renderer;this.game=r.game;this.returns.clear();this.returnUntil=0;this.banished=r.unitFormation(units).map(p=>({...p,start:time,life:reduced?300:1100}));this.shards=[];
  const count=Math.max(3,Math.min(reduced?5:18,Math.floor(4000/Math.max(1,units.length))));
  for(const p of this.banished)for(let i=0;i<count;i++){const a=i*2.399963+p.u.id,speed=14+(i*13%39)*(p.u.size||1);this.shards.push({x:p.x,y:p.y-12*(p.u.size||1),vx:Math.cos(a)*speed,vy:Math.sin(a)*speed-10,start:time+(reduced?50:180),life:reduced?250:900,color:['#ffffff','#b9f0ed','#7cd3e1'][i%3],size:1+i%3})}
 }
 draw(time){const r=this.renderer;if(r.exporting||this.game!==r.game)return;const c=r.ctx;c.save();
  this.banished=this.banished.filter(p=>time-p.start<p.life);for(const p of this.banished){const t=(time-p.start)/p.life,alpha=t<.2?1:Math.max(0,1-(t-.2)/.2),image=this.silhouette(r.images[`unit-${p.u.type}`]||r.images['unit-goblin']),size=36*(p.u.size||1);if(!image||!alpha)continue;c.globalAlpha=alpha;c.save();c.translate(Math.round(p.x),Math.round(p.y));if(p.u.facing<0)c.scale(-1,1);c.drawImage(image,-size/2,15-size,size,size);c.restore()}
  this.shards=this.shards.filter(p=>time-p.start<p.life);for(const p of this.shards){const t=(time-p.start)/1000;if(t<0)continue;c.globalAlpha=Math.max(0,1-(time-p.start)/p.life);c.fillStyle=p.color;c.fillRect(Math.round(p.x+p.vx*t),Math.round(p.y+p.vy*t+25*t*t),p.size,p.size)}c.restore();
 }
}


// colony-view.js
function installColonyView(Renderer){const previous=Renderer.prototype.draw,raw=Renderer.prototype.rawRoomImage;
 Renderer.prototype.rawRoomImage=function(r){if(r.planarReward==='honey')return this.images[`hive-${r.variant}`]||raw.call(this,r);if(r.type==='crater'||r.craterRoot){this.craterPortraits??=new Map();const part=r.craterPart||'rim',id=part+':'+r.variant+':'+r.type+':'+!!r.closed;if(!this.images[`colony-chasm-${r.variant%2}`])return raw.call(this,r);if(!this.craterPortraits.has(id)){const c=document.createElement('canvas');c.width=128;c.height=91;const ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.fillStyle='#e5ddc6';ctx.fillRect(0,0,128,91);ctx.fillStyle='#231b17';ctx.fillRect(40,0,48,91);if(part!=='dry'){const line=part==='rim'?45:0;ctx.fillStyle='#a44920';ctx.fillRect(42,line,44,91-line);ctx.fillStyle='#f4b54f';for(let y=line;y<91;y+=9)ctx.fillRect(45,y,38,2);}const image=this.images[`colony-chasm-${r.variant%2}`];if(image)for(let y=0;y<91;y+=70){ctx.drawImage(image,0,8,44,70,0,y,44,70);ctx.drawImage(image,84,8,44,70,84,y,44,70);}if(['bridge','drawbridge'].includes(r.type)){const bridge=this.extensionImages['extension-liquid-bridge'];if(bridge){ctx.save();if(r.closed){ctx.translate(40,65);ctx.rotate(-Math.PI/2);ctx.translate(-40,-65);}ctx.drawImage(bridge,0,0,128,86);ctx.restore();}}this.craterPortraits.set(id,c);}return this.craterPortraits.get(id);}if(r.enchanted)return this.images[`colony-mystic-${r.enchantedIndex??r.variant}`]||raw.call(this,r);const base=raw.call(this,r);if(base&&r.artPanel>=3){this.mirroredRooms??=new WeakMap();if(!this.mirroredRooms.has(base)){const c=document.createElement('canvas');c.width=base.width;c.height=base.height;const ctx=c.getContext('2d');ctx.translate(c.width,0);ctx.scale(-1,1);ctx.drawImage(base,0,0);this.mirroredRooms.set(base,c);}return this.mirroredRooms.get(base);}return base;};
 Renderer.prototype.draw=function(time=0){previous.call(this,time);if(!this.game)return;const c=this.ctx;c.save();c.translate(this.width/2,this.height/2);c.scale(this.zoom,this.zoom);c.translate(-this.camera.x,-this.camera.y);
  const selected=this.game.room(this.selected.x,this.selected.y),owner=selected?.builtPartOf?this.game.s.rooms[selected.builtPartOf]:selected,area=ROOM_AURAS[owner?.type];if(!this.exporting&&area){c.fillStyle='#739b6020';c.strokeStyle='#637c4980';for(const cell of this.game.auraCells(owner)){c.fillRect(cell.x*180-86,cell.y*144-66,172,132);c.strokeRect(cell.x*180-86,cell.y*144-66,172,132);}}
  for(const w of this.game.s.workers||[]){if(!w.alive)continue;const image=this.images[`colony-${w.job}-${w.variant}`];if(image){c.save();c.translate(w.x*180+(w.localX||0),w.y*144+this.floorOffset(w.x,w.y));if(w.facing<0)c.scale(-1,1);c.drawImage(image,-17,-20,35,35);c.restore();}}
  for(const e of this.game.s.spellEntities||[]){const image=this.images[e.kind==='livingMetal'?'unit-golem':'unit-mage'];if(image){c.globalAlpha=.75;c.drawImage(image,e.x*180-18,e.y*144-16,36,36);c.globalAlpha=1;}}
  for(const r of this.game.rooms){if(r.transport==='rails'){c.strokeStyle='#9d9073';c.lineWidth=2;for(const y of [27,34]){c.beginPath();c.moveTo(r.x*180-67,r.y*144+y);c.lineTo(r.x*180+67,r.y*144+y);c.stroke();}for(let dx=-65;dx<67;dx+=12)c.fillRect(r.x*180+dx,r.y*144+25,3,12);}if(r.captive){const image=this.unitImage({...r.captive,team:'enemy'});if(image)c.drawImage(image,r.x*180-18,r.y*144-15,36,36);}if(r.trap){const image=this.images[`colony-trap-${r.trap.kind}-${Math.min(3,r.trap.level)}`];if(image)c.drawImage(r.trap.level>3?this.appearance.get(image,'forge',['lava'],time,true):image,r.x*180-35,r.y*144+1,70,47);}}
  for(const [from,to]of Object.entries(this.game.s.teleports||{})){const r=this.game.s.rooms[from],image=this.images['colony-deep-portal'];if(r&&image)c.drawImage(image,r.x*180+28,r.y*144-37,45,60);}
  for(const[edge,trap]of Object.entries(this.game.s.passageTraps||{})){const[a,b]=edge.split('|').map(id=>this.game.s.rooms[id]),image=this.images[`colony-trap-${trap.kind}-${Math.min(3,trap.level)}`];if(a&&b&&image){c.save();c.translate((a.x+b.x)*90,(a.y+b.y)*72);if(a.x===b.x)c.rotate(Math.PI/2);c.globalAlpha=trap.armed?1:.5;c.drawImage(trap.level>3?this.appearance.get(image,'forge',['lava'],time,true):image,-24,-24,48,48);c.restore();}}
  for(const edge of Object.keys(this.game.s.secretPassages||{})){const[a,b]=edge.split('|').map(id=>this.game.s.rooms[id]);if(!a||!b)continue;c.strokeStyle='#c3ac6d';c.setLineDash([2,3]);c.strokeRect((a.x+b.x)*90-9,(a.y+b.y)*72-13,18,26);c.setLineDash([]);}
 c.restore();};
 Renderer.prototype.drawVolcanoes=function(time=0){const c=this.ctx,seen=new Set();for(const r of this.game.rooms.filter(r=>r.craterRoot||r.type==='crater')){const id=r.craterRoot||r.discoveryRoot||`${r.x},${r.y}`;if(seen.has(id))continue;seen.add(id);const root=this.game.s.rooms[id]||r,cells=this.game.rooms.filter(p=>p.craterRoot===id||p.type==='crater'&&p.discoveryRoot===id||p===root);let first=Math.min(...cells.map(p=>p.y)),last=Math.max(...cells.map(p=>p.y));const x=root.x*180,top=first===0?-72:first*144-62,bottom=root.craterBottomless?Math.max(last*144+51,this.camera.y+this.height/2/this.zoom+144):last*144+51,height=bottom-top,line=root.y*144-5;c.save();c.beginPath();c.rect(x-80,top,160,height);c.clip();c.fillStyle='#231b17';c.fillRect(x-31,top,62,height);c.fillStyle='#a44920';c.fillRect(x-30,Math.max(top,line),60,Math.max(0,bottom-line));c.fillStyle='#df923e';for(let y=Math.max(top,line,Math.floor((this.camera.y-this.height/2/this.zoom-144)/9)*9);y<Math.min(bottom,this.camera.y+this.height/2/this.zoom+144);y+=9){const phase=this.reduced?0:Math.floor(time/300)%5;c.fillRect(x-26+(y+phase)%9,y,43,2);}for(let dy=Math.max(0,Math.floor((this.camera.y-this.height/2/this.zoom-144-top)/87.5)*87.5);dy<Math.min(height,this.camera.y+this.height/2/this.zoom+144-top);dy+=87.5){const source=this.images[`colony-chasm-${Math.floor(dy/87.5)%2}`],image=source&&this.appearance.get(source,'crater',[],0,true,{worldLayer:root.worldLayer||0});if(image){c.drawImage(image,0,8,44,70,x-80,top+dy,55,87.5);c.drawImage(image,84,8,44,70,x+25,top+dy,55,87.5);}}for(let py=Math.max(0,Math.floor((this.camera.y-this.height/2/this.zoom-144-top)/4)*4);py<Math.min(height,this.camera.y+this.height/2/this.zoom+144-top);py+=4){const jag=(Math.floor(py/4)*11)%5;c.fillStyle='#593421';c.fillRect(x-28,top+py,3+jag,4);c.fillRect(x+24-jag,top+py,4+jag,4);}if(line>=top&&line<=bottom){c.fillStyle='#f4b54f';c.fillRect(x-25,line,50,3);}c.restore();for(const tile of cells.filter(p=>['bridge','drawbridge'].includes(p.type))){const bridge=this.extensionImages['extension-liquid-bridge'];if(!bridge)continue;c.save();c.translate(tile.x*180,tile.y*144);if(tile.type==='drawbridge'&&tile.closed){c.translate(-30,0);c.rotate(-Math.PI/2);c.translate(30,0);}c.drawImage(this.appearance.get(bridge,'crater',[],time,true,{worldLayer:tile.worldLayer||0}),-80,-62,160,107.5);c.restore();}}};

}


// whole-rooms.js
const wholeKey=r=>`${r.x},${r.y}`;
function wholeRoomSpec(game,r){
 if(!game||!r)return null;const root=game.s.rooms[r.builtPartOf||r.discoveryRoot]||r;let type=root.type,cells;
 if(BUILD_FOOTPRINTS[type]&&root.footprint)cells=root.footprint.map(id=>game.s.rooms[id]).filter(Boolean);
 else if(root.type==='desolate'&&root.discoveryMembers){cells=root.discoveryMembers.map(id=>game.s.rooms[id]).filter(p=>p&&p.discoveryRoot===wholeKey(root));type='desolate-'+cells.length;}
 else if(root.wyrdId===13){type='lost';cells=(root.discoveryMembers||[wholeKey(root)]).map(id=>game.s.rooms[id]).filter(p=>p&&p.discoveryRoot===wholeKey(root));}
 else if(['river','magmaflow'].includes(root.sourceKind)||root.wyrdId===5){type=root.sourceType||root.type;cells=(root.discoveryMembers||[wholeKey(root)]).map(id=>game.s.rooms[id]).filter(p=>p&&p.discoveryRoot===wholeKey(root));}
 if(!cells||cells.length<2)return null;const vertical=cells.every(p=>p.x===cells[0].x);if(!vertical&&!cells.every(p=>p.y===cells[0].y))return null;
 const left=Math.min(...cells.map(p=>p.x))*180-80,top=Math.min(...cells.map(p=>p.y))*144-62,width=vertical?160:180*(cells.length-1)+160,height=vertical?144*(cells.length-1)+113.33:113.33;
 return{root,cells,type,vertical,left,top,width,height,key:wholeKey(root)};
}
const WHOLE_ASSETS=[...[2,3,4,5,6].flatMap(count=>[0,1].map(v=>`desolate-${count}-horizontal-${v}`)),...['museum','temple','dragonforge','trapmaster','meadhall','lost','breeder','water','lava'].flatMap(type=>[0,1].map(v=>`${type}-horizontal-${v}`)),...['temple','dragonforge','trapmaster','meadhall','breeder'].flatMap(type=>[0,1].map(v=>`${type}-vertical-${v}`))];
function installWholeRooms(Renderer){const oldRaw=Renderer.prototype.rawRoomImage,oldFrame=Renderer.prototype.framedRoomImage;
 Object.assign(Renderer.prototype,{
  wholeRoom(r){const spec=wholeRoomSpec(this.game,r);return spec&&this.wholeImages?.[`${spec.type}-${spec.vertical?'vertical':'horizontal'}-${spec.root.variant%2}`]?spec:null;},
  wholeImage(spec){return this.wholeImages[`${spec.type}-${spec.vertical?'vertical':'horizontal'}-${spec.root.variant%2}`];},
  rawRoomImage(r){const spec=this.wholeRoom(r);if(!spec)return oldRaw.call(this,r);const image=this.wholeImage(spec);this.wholeSlices??=new Map();const id=`${spec.key}:${spec.type}:${spec.root.variant}:${r.x},${r.y}:${spec.cells.length}`;if(this.wholeSlices.has(id))return this.wholeSlices.get(id);const c=document.createElement('canvas');c.width=128;c.height=91;const ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.fillStyle='#e5ddc6';ctx.fillRect(0,0,128,91);const sx=(r.x*180-80-spec.left)/1.25,sy=(r.y*144-62-spec.top)/1.25;ctx.drawImage(image,sx,sy,128,91,0,0,128,91);this.wholeSlices.set(id,c);if(this.wholeSlices.size>500)this.wholeSlices.delete(this.wholeSlices.keys().next().value);return c;},
  framedRoomImage(r){return this.wholeRoom(r)?this.rawRoomImage(r):oldFrame.call(this,r);},
  drawWholeRooms(visible,time){const c=this.ctx,seen=new Set();for(const r of visible){const spec=this.wholeRoom(r);if(!spec||seen.has(spec.key))continue;seen.add(spec.key);const source=this.wholeImage(spec),base=this.appearance.get(source,spec.type==='lost'?'artifact':spec.type.startsWith('desolate-')?'desolate':spec.type,[],time,this.reduced,{worldLayer:spec.root.worldLayer||0,origin:{x:spec.left,y:spec.top},scale:1.25,lights:this.terrain.lights(r)});c.drawImage(base,spec.left,spec.top,source.width*1.25,source.height*1.25);
    for(const part of spec.cells){const hazards=this.game.roomHazards(part);if(hazards.length||part.damaged||part.worldLayer!==spec.root.worldLayer){c.save();c.beginPath();c.rect(part.x*180-90,part.y*144-72,180,144);c.clip();const tint=this.appearance.get(source,spec.type==='lost'?'artifact':spec.type.startsWith('desolate-')?'desolate':spec.type,hazards,time,this.reduced,{worldLayer:part.worldLayer||0,origin:{x:spec.left,y:spec.top},scale:1.25,lights:this.terrain.lights(part)});c.drawImage(tint,spec.left,spec.top,source.width*1.25,source.height*1.25);if(part.damaged){c.strokeStyle='#241c17';c.lineWidth=3;for(let i=0;i<5;i++){const x=part.x*180-54+i*23,y=part.y*144-42+i%2*9;c.beginPath();c.moveTo(x,y);c.lineTo(x+4,y+15);c.lineTo(x-2,y+29);c.stroke();}}c.restore();}
      if(['bridge','drawbridge'].includes(part.type)){const bridge=this.extensionImages['extension-liquid-bridge'];if(bridge)c.drawImage(bridge,part.x*180-80,part.y*144-62,160,113.33);}
    }
   }
  }
 });
}


// terrain-autotile.js
const CAVE_PORTS=[{dx:0,dy:-1,bit:1},{dx:1,dy:0,bit:2},{dx:0,dy:1,bit:4},{dx:-1,dy:0,bit:8}];
// Blob normalization gives the standard 47 valid configurations. A diagonal
// cannot erase a wall unless both cardinal passages are really open.
function normalizeCaveMask(mask){for(const [diagonal,sides]of [[16,3],[32,6],[64,12],[128,9]])if((mask&sides)!==sides)mask&=~diagonal;return mask;}
function caveMask(game,r){let mask=0;for(const p of CAVE_PORTS)if(game.linked(r,game.room(r.x+p.dx,r.y+p.dy)))mask|=p.bit;for(const [dx,dy,bit,sides]of [[1,-1,16,3],[1,1,32,6],[-1,1,64,12],[-1,-1,128,9]]){const d=game.room(r.x+dx,r.y+dy),a=game.room(r.x+dx,r.y),b=game.room(r.x,r.y+dy);if((mask&sides)===sides&&d&&game.linked(a,d)&&game.linked(b,d))mask|=bit;}return normalizeCaveMask(mask);}
function caveTerrainRoom(game,r){return !!r&&!r.playerBuilt&&!r.craterRoot&&!['gate','surface','shaft','elevator','crater','bridge','drawbridge'].includes(r.type)&&passageArchitecture(visualRoom(game,r))==='cavern';}
function caveEdgeWide(game,a,b){return !!b&&(sharedBossRoom(game,a,b)||sharedFormation(a,b)||a.cavernGroup&&a.cavernGroup===b.cavernGroup);}
const terrainBox=(x,y,hx,hy,r)=>{const qx=Math.abs(x)-hx+r,qy=Math.abs(y)-hy+r;return Math.hypot(Math.max(qx,0),Math.max(qy,0))+Math.min(Math.max(qx,qy),0)-r;};
class CaveAutotiler{
 constructor(renderer){this.renderer=renderer;this.geometry=new Map();this.sources=new WeakMap();}
 eligible(r){return caveTerrainRoom(this.renderer.game,r)&&!this.renderer.wholeRoom(r);}
 descriptor(r){const game=this.renderer.game;return CAVE_PORTS.filter(p=>game.linked(r,game.room(r.x+p.dx,r.y+p.dy))).map(p=>({...p,room:{...visualRoom(game,game.room(r.x+p.dx,r.y+p.dy)),hazards:game.roomHazards(game.room(r.x+p.dx,r.y+p.dy))},wide:!!caveEdgeWide(game,r,game.room(r.x+p.dx,r.y+p.dy))}));}
 lights(r){const renderer=this.renderer,game=renderer.game;if(this.lightFrame!==renderer.passageTime||this.lightGame!==game){this.lightFrame=renderer.passageTime;this.lightGame=game;this.lightBuckets=new Map();const add=source=>{const x=Math.round(source.x/180),y=Math.round(source.y/144);for(let dx=-2;dx<=2;dx++)for(let dy=-2;dy<=2;dy++){const id=`${x+dx},${y+dy}`;if(!this.lightBuckets.has(id))this.lightBuckets.set(id,[]);this.lightBuckets.get(id).push(source);}};for(const cell of game.rooms){const v=visualRoom(game,cell);if(['crystal','lava','crater','forge','portal','void'].includes(v.type))add({x:cell.x*180,y:cell.y*144-8,radius:140,intensity:.20,period:v.type==='void'?2600:v.type==='crystal'?1300:480});if(passageArchitecture(v)==='built')for(const [dx,dy]of [[1,0],[0,1]]){const n=game.room(cell.x+dx,cell.y+dy);if(n&&game.linked(cell,n)&&passageArchitecture(visualRoom(game,n))==='built'&&!game.barricade(cell,n))add({x:(cell.x+n.x)*90,y:(cell.y+n.y)*72-13,radius:100,intensity:.17,period:270});}}}return this.lightBuckets.get(`${r.x},${r.y}`)||[];}

 shaderOptions(r,width=180,height=144){return{worldLayer:r.worldLayer||0,neighbors:this.descriptor(r),origin:{x:r.x*180-(width===180?90:80),y:r.y*144-(height===144?72:62)},scale:(width===180?180:160)/width,lights:this.lights(r)};}
 source(image){if(!image)return null;if(this.sources.has(image))return this.sources.get(image);const c=document.createElement('canvas');c.width=180;c.height=144;const ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.drawImage(image,10,10,160,107.5);const p=ctx.getImageData(0,0,180,144).data;this.sources.set(image,p);return p;}
 tile(r,time){const renderer=this.renderer,game=renderer.game,ports=this.descriptor(r),mask=caveMask(game,r),raw=renderer.framedRoomImage(r),art=this.source(raw),signature=[r.x,r.y,r.type,r.variant,r.artPanel,mask,ports.map(p=>p.wide?1:0).join(''),r.enchanted,r.enchantedIndex,r.dragonAwake].join(':');let canvas=this.geometry.get(signature);
  if(!canvas){canvas=document.createElement('canvas');canvas.width=180;canvas.height=144;const ctx=canvas.getContext('2d'),frame=ctx.createImageData(180,144),p=frame.data;
   for(let sy=0;sy<144;sy+=2)for(let sx=0;sx<180;sx+=2){const x=sx-90,y=sy-67,wx=r.x*180+x,wy=r.y*144+sy-72,grain=terrainNoise(Math.floor(wx/4),Math.floor(wy/4)),distance=terrainBox(x,y,77,49,22);let d=distance+(terrainNoise(Math.floor(wx/8),Math.floor(wy/8))-.5)*5,arm=Infinity;
    for(const port of ports){const radius=port.wide?30:14;const edge=port.dx?Math.abs(y)-radius:Math.abs(x)-radius;const along=port.dx?x*port.dx:y*port.dy;if(along>=(port.dx?54:34))arm=Math.min(arm,edge);}
    for(const [dx,dy,bit]of [[1,-1,16],[1,1,32],[-1,1,64],[-1,-1,128]])if(mask&bit&&ports.some(p=>p.dx===dx&&p.wide)&&ports.some(p=>p.dy===dy&&p.wide)&&x*dx>=36&&y*dy>=25)d=Math.min(d,-10);
    d=Math.min(d,arm);if(d>7)continue;let color=d<-2?[28+grain*6,27+grain*5,22+grain*4]:d<2?[66+grain*21,59+grain*19,44+grain*15]:[120+grain*27,107+grain*23,79+grain*17];
    // Native room illustrations supply contents; only the standardized port
    // aprons and walls are replaced. The source is never stretched or warped.
    const i=(sy*180+sx)*4;if(art&&distance<-7&&arm>8&&art[i+3]>128&&Math.abs(art[i]-229)+Math.abs(art[i+1]-221)+Math.abs(art[i+2]-198)>48)color=[art[i],art[i+1],art[i+2]];
    for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++)p.set([...color.map(Math.round),255],((sy+dy)*180+sx+dx)*4);
   }ctx.putImageData(frame,0,0);this.geometry.set(signature,canvas);if(this.geometry.size>256)this.geometry.delete(this.geometry.keys().next().value);
  }
  return renderer.appearance.get(canvas,visualRoom(game,r).type,game.roomHazards(r),time,renderer.reduced,this.shaderOptions(r));
 }
 drawConnection(a,b,time){const renderer=this.renderer,c=renderer.ctx,game=renderer.game,vertical=a.x===b.x,wide=!!caveEdgeWide(game,a,b),half=wide?30:14,pa=passagePalette({...visualRoom(game,a),hazards:game.roomHazards(a)}),pb=passagePalette({...visualRoom(game,b),hazards:game.roomHazards(b)}),cx=(a.x+b.x)*90,cy=(a.y+b.y)*72+(vertical?0:-5),lights=this.lights(a);
  // World-space integer grain and shared endpoints prevent transparent seams.
  for(let along=-42;along<42;along+=2)for(let across=-half-8;across<half+8;across+=2){const x=cx+(vertical?across:along),y=cy+(vertical?along:across),noise=terrainNoise(Math.floor(x/4),Math.floor(y/4)),depth=Math.abs(across),blend=shaderSmooth(-42,42,along),role=depth<half-2?'floor':depth<half+2?'wall':'light';let color=shaderMix(pa[role],pb[role],blend);const illumination=materialLightsAt(x,y,lights,time,renderer.reduced);color=shaderMix(color,shaderMix(pa.light,pb.light,blend),illumination);if(role!=='floor'){const architecture=passageArchitecture(visualRoom(game,along<0?a:b));if(architecture==='built'){const course=Math.floor((across+half+8)/6);if(Math.floor(across+half+8)%6<2||((Math.floor(along)+course%2*8)%16+16)%16<2)color=shaderMix(pa.floor,pb.floor,blend);}else color=color.map(v=>Math.round(v*(.80+noise*.25)));}c.fillStyle=`rgb(${color.join(',')})`;c.fillRect(x,y,2,2);}
 }
}


// render.js
const CW=180,CH=144;
class Renderer{
 constructor(canvas,onSelect,onHover){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.zoom=1;this.camera={x:0,y:80};this.images={};this.wholeImages={};this.cavernImages={};this.extensionImages={};this.appearance=new RoomAppearance();this.framing=new RoomFraming();this.caverns=new CavernModules();this.terrain=new CaveAutotiler(this);this.transitions=new BattleTransitions(this);this.passages=new ProceduralPassages();this.selected={x:0,y:0};this.hover=null;this.game=null;this.reduced=false;this.pointers=new Map();this.directionMarkers=[];this.drag=null;this.pinch=null;this.onSelect=onSelect;this.onHover=onHover;this.setupInput();if(typeof ResizeObserver!=='undefined'){this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(canvas)}else window.addEventListener('resize',()=>this.resize());this.resize()}
 async load(){
  const assets=Object.keys(ROOMS).flatMap(type=>[0,1,2].map(v=>({id:`${type}-${v}`,src:`./assets/rooms/${type}-${v}.png`})));
  assets.push(...[0,1,2].map(v=>({id:`awake-dragon-${v}`,src:`./assets/rooms/awake-dragon-${v}.png`})));
  assets.push(...Object.keys(SPRITE_FRAMES).map(type=>({id:`unit-${type}`,src:`./assets/sprites/${type}.png`})));
  assets.push(...Array.from({length:7},(_,i)=>i+1).flatMap(layer=>Object.keys(SPRITE_FRAMES).map(type=>({id:`layer-${layer}-${type}`,src:`./assets/layer-enemies/${layer}-${type}.png`}))));
  assets.push(...DAMAGEABLE_ROOMS.flatMap(type=>[0,1,2].map(v=>({id:`damaged-${type}-${v}`,src:`./assets/damaged-rooms/${type}-${v}.png`}))));
  assets.push(...['horizontal-0','horizontal-1','vertical-0','vertical-1'].map(name=>({id:'cavern-'+name,src:`./assets/caverns/${name}.png`})));
  assets.push(...['horizontal-0','horizontal-1','vertical-0','vertical-1'].map(name=>({id:'built-'+name,src:`./assets/modules/built-${name}.png`})));
  assets.push({id:'extension-liquid-bridge',src:'./assets/modules/liquid-bridge.png'});
  assets.push(...EXTENSION_FAMILIES.flatMap(family=>[0,1,2].map(v=>({id:`extension-${family}-${v}`,src:`./assets/modules/${family}-${v}.png`}))));
  assets.push(...['mystic-0','mystic-1','mystic-2','mystic-3','mystic-4','mystic-5','long-0','long-1','long-2','long-3','chasm-0','chasm-1','deep-portal',...['smith','mason','scholar','cook','engineer','attendant','miner','lumberjack'].flatMap(job=>[0,1,2].map(v=>`${job}-${v}`)),...['damage','delay'].flatMap(kind=>[1,2,3].map(v=>`trap-${kind}-${v}`))].map(name=>({id:'colony-'+name,src:`./assets/colony/${name}.png`})) );
  assets.push(...WHOLE_ASSETS.map(name=>({id:'whole-'+name,src:`./assets/whole/${name}.png`})));
  assets.push(...PASSAGES.map(name=>({id:`passage-${name}`,src:`./assets/passages/${name}.png`})));
  await Promise.all(assets.map(({id,src})=>new Promise(resolve=>{const i=new Image();i.onload=()=>{(id.startsWith('whole-')?this.wholeImages:id.startsWith('extension-')?this.extensionImages:id.startsWith('cavern-')||id.startsWith('built-')?this.cavernImages:this.images)[id.startsWith('whole-')?id.slice(6):id]=i;resolve()};i.onerror=()=>resolve();i.src=embeddedAssets[src.replace('./assets/','')]})));
  this.passages.cache.clear();this.appearance.cache.clear();this.terrain.geometry.clear();
  if(this.images['unit-immortal']){const outline=document.createElement('canvas');outline.width=outline.height=64;const c=outline.getContext('2d');c.drawImage(this.images['unit-immortal'],0,0,64,64);c.globalCompositeOperation='source-in';c.fillStyle='#b5a56f';c.fillRect(0,0,64,64);this.immortalOutline=outline}
 }
 bridgeRoomImage(r){const source=this.images[`${r.sourceType}-${r.variant}`],overlay=this.extensionImages['extension-liquid-bridge'];if(!source||!overlay)return source;this.bridgeSprites??=new Map();const id=`${r.sourceType}:${r.variant}:${r.damaged}`;if(this.bridgeSprites.has(id))return this.bridgeSprites.get(id);const tile=document.createElement('canvas');tile.width=128;tile.height=86;const c=tile.getContext('2d');c.imageSmoothingEnabled=false;c.drawImage(source,0,0,128,86);c.drawImage(overlay,0,0);if(r.damaged){c.fillStyle='#201f1b';c.fillRect(46,62,2,9);c.fillRect(82,65,2,8)}this.bridgeSprites.set(id,tile);return tile}
 rawRoomImage(r){if(r.sourceType&&['bridge','drawbridge'].includes(r.type))return this.bridgeRoomImage(r);const view=visualRoom(this.game,r);if(view.builtExtension)return this.images[`${view.damaged&&DAMAGEABLE_ROOMS.includes(view.type)?'damaged-':''}${view.type}-${view.variant}`]||this.images[`${view.type}-${view.variant}`];if(view.bossExtension)return this.extensionImages[`extension-${view.bossFamily}-${view.variant}`]||this.images[`${view.type}-${view.variant}`];if(r.type==='dragon'&&r.dragonAwake)return this.images[`awake-dragon-${r.variant}`]||this.images[`dragon-${r.variant}`];return this.images[`${r.damaged&&DAMAGEABLE_ROOMS.includes(r.type)?'damaged-':''}${r.type}-${r.variant}`]||this.images[`${r.type}-${r.variant}`]}
 framedRoomImage(r){const raw=this.rawRoomImage(r);return ROOMS[r.type]?.r===undefined&&!['gate','surface','shaft'].includes(r.type)?this.framing.frame(raw):raw}
 roomImage(r,time=0){return this.appearance.get(this.framedRoomImage(r),visualRoom(this.game,r).type,this.game?.roomHazards(r)||[],time,this.reduced,this.game?this.terrain.shaderOptions(r,128,86):{})}
 roomURL(r,time=0){const spec=this.wholeRoom(r);return this.appearance.url(spec?this.wholeImage(spec):this.framedRoomImage(r),spec?(spec.type==='lost'?'artifact':spec.type.startsWith('desolate-')?'desolate':spec.type):visualRoom(this.game,r).type,this.game?.roomHazards(r)||[],time,this.reduced,{worldLayer:r.worldLayer||0})}
 resize(){const r=this.canvas.getBoundingClientRect();this.width=r.width;this.height=r.height;const dpr=Math.min(devicePixelRatio||1,2);this.canvas.width=Math.round(r.width*dpr);this.canvas.height=Math.round(r.height*dpr);this.dpr=dpr}
 screenToWorld(x,y){return{x:(x-this.width/2)/this.zoom+this.camera.x,y:(y-this.height/2)/this.zoom+this.camera.y}}
 point(event){const r=this.canvas.getBoundingClientRect();return{x:event.clientX-r.left,y:event.clientY-r.top}}
 tile(x,y){const p=this.screenToWorld(x,y);return{x:Math.round(p.x/CW),y:Math.round(p.y/CH)}}
 directionAt(p){
  if(!this.game)return null;
  // Recompute against the current camera: focus/resize can precede the next frame.
  for(const d of this.game.directions()){
   const screenX=this.width/2+(d.from.x*CW+d.dx*CW/2-this.camera.x)*this.zoom,screenY=this.height/2+(d.from.y*CH+d.dy*CH/2-this.camera.y)*this.zoom;
   if(Math.hypot(screenX-p.x,screenY-p.y)<=22)return {...d,screenX,screenY};
  }return null;
 }
 setupInput(){const c=this.canvas;
  c.addEventListener('pointerdown',e=>{const p=this.point(e);this.pointers.set(e.pointerId,p);c.setPointerCapture?.(e.pointerId);this.drag={start:p,last:p,moved:false};if(this.pointers.size===2){const a=[...this.pointers.values()];this.pinch={distance:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y),zoom:this.zoom};this.drag.moved=true}this.onHover(null)});
  c.addEventListener('pointermove',e=>{const p=this.point(e);if(this.pointers.has(e.pointerId)){this.pointers.set(e.pointerId,p);if(this.pointers.size===2&&this.pinch){const a=[...this.pointers.values()];this.zoom=Math.max(.35,Math.min(2.2,this.pinch.zoom*Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)/Math.max(1,this.pinch.distance)));return}if(this.drag){const d=this.drag;if(Math.hypot(p.x-d.start.x,p.y-d.start.y)>5)d.moved=true;if(d.moved){this.camera.x-=(p.x-d.last.x)/this.zoom;this.camera.y-=(p.y-d.last.y)/this.zoom}d.last=p}return}this.hover=this.tile(p.x,p.y);this.onHover({tile:this.hover,point:p,direction:this.directionAt(p)})});
  c.addEventListener('pointerup',e=>{const p=this.point(e);const clicked=this.drag&&!this.drag.moved&&!this.pinch;this.pointers.delete(e.pointerId);if(clicked){const arrow=this.directionAt(p);if(arrow)this.onSelect({...arrow,action:'direction'});else{const t=this.tile(p.x,p.y);this.selected=t;this.onSelect(t)}}if(!this.pointers.size){this.drag=null;this.pinch=null}else if(this.drag)this.drag.moved=true});
  c.addEventListener('pointercancel',e=>{this.pointers.delete(e.pointerId);this.drag=null;this.pinch=null});c.addEventListener('pointerleave',()=>{this.hover=null;this.onHover(null)});
  c.addEventListener('wheel',e=>{e.preventDefault();const p=this.point(e),before=this.screenToWorld(p.x,p.y);this.zoom=Math.max(.35,Math.min(2.2,this.zoom*Math.exp(-e.deltaY*.001)));const after=this.screenToWorld(p.x,p.y);this.camera.x+=before.x-after.x;this.camera.y+=before.y-after.y},{passive:false});
  c.addEventListener('keydown',e=>{const dirs={ArrowUp:[0,-1],ArrowRight:[1,0],ArrowDown:[0,1],ArrowLeft:[-1,0]};if(dirs[e.key]){e.preventDefault();const[dx,dy]=dirs[e.key];this.selected={x:this.selected.x+dx,y:this.selected.y+dy};if(!this.eventTargets?.length)this.onSelect(this.selected);this.focus(this.selected)}if(e.key==='Enter'){e.preventDefault();this.onSelect(this.selected)}});
 }
 center(){this.camera={x:0,y:70};this.zoom=this.width<500?.85:1;this.selected={x:0,y:0}}
 focus(tile){const x=tile.x*CW,y=tile.y*CH;const sx=(x-this.camera.x)*this.zoom+this.width/2,sy=(y-this.camera.y)*this.zoom+this.height/2;if(sx<100||sx>this.width-100)this.camera.x=x;if(sy<90||sy>this.height-90)this.camera.y=y}
 setZoom(factor){this.zoom=Math.max(.35,Math.min(2.2,this.zoom*factor))}
 corridor(r,n){
  const c=this.ctx,vertical=r.x===n.x;if(vertical&&r.craterRoot&&r.craterRoot===n.craterRoot)return;
  if(!vertical&&r.y!==n.y)return;
  if((vertical&&r.y>n.y)||(!vertical&&r.x>n.x))[r,n]=[n,r];
  const x=r.x*CW,y=r.y*CH,nx=n.x*CW,ny=n.y*CH;
  const door=this.game.barricade(r,n);
  const wa=this.wholeRoom(r),wb=this.wholeRoom(n);if(wa&&wb&&wa.key===wb.key){if(door)this.widePassageDoor((x+nx)/2,(y+ny)/2-5,vertical,door,vertical?75:70,passagePalette(visualRoom(this.game,r)),passagePalette(visualRoom(this.game,n)));return;}

  const boss=sharedBossRoom(this.game,r,n),a={...visualRoom(this.game,r),hazards:this.game.roomHazards(r)},b={...visualRoom(this.game,n),hazards:this.game.roomHazards(n)},built=masonryRoom(a)&&masonryRoom(b),chamber=boss||sharedFormation(r,n)||r.type==='cave'&&n.type==='cave'&&!r.playerBuilt&&!n.playerBuilt&&r.cavernGroup&&r.cavernGroup===n.cavernGroup,wide=(built||chamber)&&!(vertical&&this.shaftLinked(r,n));
  if(wide){const architecture=built||chamber&&passageArchitecture(a)==='built'&&passageArchitecture(b)==='built'?'built':'cavern';c.save();c.beginPath();if(vertical)c.rect(x-38,y+35,76,CH-75);else c.rect(x+55,y-44,CW-110,78);c.clip();this.caverns.draw(c,{...a,joinArchitecture:architecture},{...b,joinArchitecture:architecture},this.roomImage(r,this.passageTime||0),this.roomImage(n,this.passageTime||0),this.cavernImages);c.restore();if(!door&&architecture==='built')this.joinTorch((x+nx)/2,(y+ny)/2,vertical)}
  if(!wide&&!(vertical&&this.shaftLinked(r,n)))this.passages.draw(c,a,b,vertical,this.images,this.passageTime||0,this.reduced,door,{start:this.framing.ports(this.framedRoomImage(r))[vertical?'south':'east'],end:this.framing.ports(this.framedRoomImage(n))[vertical?'north':'west']});
  if(door){if(wide)this.widePassageDoor((x+nx)/2,(y+ny)/2-5,vertical,door,vertical?75:70,passagePalette(a),passagePalette(b));else this.passageDoor((x+nx)/2,(y+ny)/2,vertical,door);}
  const image=name=>this.images['passage-'+name];
  if((r.closed||n.closed)&&image('grate'))c.drawImage(image('grate'),(x+nx)/2-16,(y+ny)/2-16,32,32);
 }
 roomLabel(r){if(r.craterRoot&&r.craterRoot!==key(r.x,r.y)&&!r.perforated)return '';if(r.type==='gate'&&this.game.s.activePlane!=null)return 'Portal de Retorno';if(visualRoom(this.game,r).bossExtension||visualRoom(this.game,r).builtExtension||r.discoveryRoot&&r.discoveryRoot!==key(r.x,r.y))return '';if(this.shaftLinked(r,this.game.room(r.x,r.y+1)))return '';return this.continuousShaft(r)?'Elevador':r.displayName||ROOMS[r.type].name}
 shaftLinked(a,b){return !!a&&!!b&&['shaft','elevator'].includes(a.type)&&['shaft','elevator'].includes(b.type)&&a.x===b.x&&Math.abs(a.y-b.y)===1&&this.game.linked(a,b)}
 continuousShaft(r){return ['shaft','elevator'].includes(r.type)&&(this.shaftLinked(r,this.game.room(r.x,r.y-1))||this.shaftLinked(r,this.game.room(r.x,r.y+1)))}
 shaftTile(r,image){if(image)this.ctx.drawImage(image,r.x*CW-80,r.y*CH-62,160,113.33)}
 shaftSeam(a,b){
  const first=this.roomImage(a,this.passageTime||0),second=this.roomImage(b,this.passageTime||0);if(!first||!second)return;
  this.shaftStitches??=new WeakMap();let pairs=this.shaftStitches.get(first);if(!pairs){pairs=new WeakMap();this.shaftStitches.set(first,pairs)}let tile=pairs.get(second);
  if(!tile){
   // Build only the connecting neck. Room sprites keep their original proportions.
   tile=document.createElement('canvas');tile.width=64;tile.height=86;const c=tile.getContext('2d');c.imageSmoothingEnabled=false;
   c.fillStyle='#211f19';c.fillRect(10,0,44,86);
   for(let y=0;y<86;y+=12){const image=y<43?first:second,phase=Math.floor(y/12)%3;
    for(const side of [-1,1]){const x=side<0?6+phase:46-phase;c.drawImage(image,side<0?9:108,18+phase*6,12,12,x,y,12,12)}
   }
   // Discrete timber braces and ropes match the old cavern cutaway art.
   c.fillStyle='#746446';c.fillRect(22,0,2,86);c.fillStyle='#b6a37a';c.fillRect(22,0,1,86);c.fillStyle='#857454';c.fillRect(40,0,1,86);
   for(let y=10;y<86;y+=24){c.fillStyle='#4e4432';c.fillRect(18,y,28,3);c.fillStyle='#a38e64';c.fillRect(18,y,28,1)}
   pairs.set(second,tile);
  }
  this.ctx.drawImage(tile,a.x*CW-40,a.y*CH+28,80,107.5);
 }
 joinTorch(x,y,vertical){const c=this.ctx,phase=this.reduced?0:Math.floor((this.passageTime||0)/160)%3;c.save();c.translate(x+(vertical?18:0),y-17);c.fillStyle='#c6954528';c.fillRect(-9,-13,20,26);c.fillStyle='#302a20';c.fillRect(-2,0,6,11);c.fillStyle='#8a6238';c.fillRect(0,2,2,7);c.fillStyle='#b87936';c.fillRect(-3,-4,8,6);c.fillStyle='#d7a148';c.fillRect(-1,-8-phase*2,4,8+phase*2);c.fillStyle='#ead9a0';c.fillRect(0,-5-phase*2,2,5);c.restore()}
 widePassageDoor(x,y,vertical,door,height,first,second){
  if(door.kind==='prison')return this.cageDoor(x,y,vertical,door,height);
  const c=this.ctx,half=height/2,rgb=a=>`rgb(${a.join(',')})`,wall=first.wall.map((v,i)=>Math.round((v+second.wall[i])*.5)),light=first.light.map((v,i)=>Math.round((v+second.light[i])*.5));c.save();c.translate(x,y);if(vertical)c.rotate(Math.PI/2);
  if(door.hp<=0){c.fillStyle=rgb(wall);for(let i=0;i<7;i++)c.fillRect(-8+i%3*4,half-9-i*3,4,3);c.restore();return}
  // Repeat native-size planks and straps to cover the wider opening, never scale a door sprite.
  c.fillStyle='#24271f';c.fillRect(-10,-half,20,height);c.fillStyle=rgb(light);c.fillRect(-10,-half,3,height);c.fillRect(7,-half,3,height);c.fillStyle=rgb(wall);c.fillRect(-7,-half+2,14,height-4);
  c.fillStyle=rgb(light.map(v=>Math.round(v*.72)));for(let i=-5;i<=5;i+=4)c.fillRect(i,-half+3,2,height-6);
  for(let py=-half+7;py<half-3;py+=14){c.fillStyle='#333b38';c.fillRect(-8,py,16,4);c.fillStyle='#b4b49a';c.fillRect(-6,py+1,2,1);c.fillRect(4,py+1,2,1);if(door.kind==='offensive'){c.fillStyle=rgb(light);c.fillRect(-14,py,6,2);c.fillRect(8,py,6,2)}}
  for(let i=1;i<door.level;i++){c.fillStyle='#a2a490';c.fillRect(-9,-half+i*height/door.level,18,2)}
  if(this.game.s.combat&&!this.exporting){const maximum=(door.kind==='defensive'?400:160)*door.level;c.fillStyle='#252920';c.fillRect(-13,half+3,26,4);c.fillStyle='#c0a667';c.fillRect(-12,half+4,24*Math.min(1,door.hp/maximum),2)}c.restore();
 }
 cageDoor(x,y,vertical,door,height=40){const c=this.ctx;c.save();c.translate(x,y);if(vertical)c.rotate(Math.PI/2);c.fillStyle='#383f3d';c.fillRect(-11,-height/2,22,height);c.fillStyle='#a0aaa0';for(let dy=-height/2+3;dy<height/2;dy+=7)c.fillRect(-10,dy,20,2);c.fillStyle='#424b48';c.fillRect(-10,-height/2,3,height);c.fillRect(7,-height/2,3,height);c.restore();}
 passageDoor(x,y,vertical,door){if(door.kind==='prison')return this.cageDoor(x,y,vertical,door);
  const c=this.ctx;c.save();c.translate(x,y);if(vertical)c.rotate(Math.PI/2);c.imageSmoothingEnabled=false;
  if(door.hp<=0){c.fillStyle='#5b4830';for(let i=0;i<5;i++)c.fillRect(-8+i*3,8-i%2*3,4,3);c.restore();return}
  c.fillStyle='#24271f';c.fillRect(-9,-20,18,40);c.fillStyle='#c0b18c';c.fillRect(-9,-20,3,40);c.fillRect(6,-20,3,40);
  c.fillStyle='#76603e';c.fillRect(-6,-18,12,36);c.fillStyle='#9b8155';for(let i=-4;i<=4;i+=4)c.fillRect(i,-17,2,34);
  c.fillStyle='#393c33';for(const py of [-13,-2,11])c.fillRect(-7,py,14,4);c.fillStyle='#b4b49a';for(const py of [-12,-1,12]){c.fillRect(-5,py,2,1);c.fillRect(3,py,2,1)}
  for(let i=1;i<door.level;i++){c.fillStyle='#a2a490';c.fillRect(-8,-18+i*13,16,2)}
  if(door.kind==='offensive'){c.fillStyle='#b99b72';for(const py of [-14,-6,2,10]){c.fillRect(-13,py,4,2);c.fillRect(9,py,4,2)}}
  if(this.game.s.combat){const maximum=(door.kind==='defensive'?400:160)*door.level;c.fillStyle='#252920';c.fillRect(-13,23,26,4);c.fillStyle='#c0a667';c.fillRect(-12,24,24*Math.min(1,door.hp/maximum),2)}
  c.restore();
 }
 draw(time=0){this.appearance.beginFrame();try{return this.game?this.game.withQueryCache(()=>this.drawFrame(time)):this.drawFrame(time)}finally{this.appearance.endFrame()}}
 drawFrame(time=0){this.passageTime=time;const c=this.ctx,w=this.width,h=this.height;if(!w||!h)return;c.setTransform(this.dpr,0,0,this.dpr,0,0);c.imageSmoothingEnabled=false;c.fillStyle='#e5ddc6';c.fillRect(0,0,w,h);if(!this.game){this.directionMarkers=[];return;}
  c.save();c.translate(w/2,h/2);c.scale(this.zoom,this.zoom);c.translate(-this.camera.x,-this.camera.y);
  const bounds={left:this.camera.x-w/2/this.zoom-CW,right:this.camera.x+w/2/this.zoom+CW,top:this.camera.y-h/2/this.zoom-CH,bottom:this.camera.y+h/2/this.zoom+CH};
  if(!this.exporting){c.strokeStyle='#6e77551c';c.lineWidth=.65;for(let x=Math.floor(bounds.left/CW);x<=Math.ceil(bounds.right/CW);x++){c.beginPath();c.moveTo((x+.5)*CW,bounds.top);c.lineTo((x+.5)*CW,bounds.bottom);c.stroke()}for(let y=Math.floor(bounds.top/CH);y<=Math.ceil(bounds.bottom/CH);y++){c.beginPath();c.moveTo(bounds.left,(y+.5)*CH);c.lineTo(bounds.right,(y+.5)*CH);c.stroke();c.fillStyle='#7d82624a';c.font='9px Georgia';c.textAlign='left';c.fillText(y>=0?String(y).padStart(2,'0'):`+${-y}`,bounds.left+CW*.7,y*CH)}
  c.fillStyle='#d7dfd332';c.fillRect(bounds.left,bounds.top,bounds.right-bounds.left,Math.max(0,-CH*.5-bounds.top));
  // Ground boundary remains readable when the map scrolls underground.
  c.strokeStyle='#777b5e55';c.setLineDash([4,4]);c.beginPath();c.moveTo(bounds.left,-CH*.5);c.lineTo(bounds.right,-CH*.5);c.stroke();c.setLineDash([]);
  }
  const visible=this.game.rooms.filter(r=>r.x*CW>bounds.left&&r.x*CW<bounds.right&&r.y*CH>bounds.top&&r.y*CH<bounds.bottom);
  for(const r of visible){if(this.wholeRoom(r)||r.craterRoot)continue;const x=r.x*CW,y=r.y*CH;const image=this.roomImage(r,time);if(this.continuousShaft(r))this.shaftTile(r,image);else if(image)c.drawImage(image,x-80,y-62,160,113.33);else{c.fillStyle='#d9cfb1';c.fillRect(x-72,y-45,144,90)}
  }
  this.drawWholeRooms(visible,time);
  for(const r of visible){const below=this.game.room(r.x,r.y+1);if(this.shaftLinked(r,below))this.shaftSeam(r,below)}
  // Composite every room first, then its doorway aprons; no room PNG can cover a neighbor's connection.
  for(const r of visible)for(const[dx,dy]of [[1,0],[0,1]]){const n=this.game.room(r.x+dx,r.y+dy);if(n&&this.game.linked(r,n))this.corridor(r,n)}
  this.drawVolcanoes?.(time);
  if(!this.exporting){
  const directions=this.game.directions();
  for(const r of visible){const x=r.x*CW,y=r.y*CH;
   if(r.trap){c.strokeStyle='#9c6149';c.lineWidth=1.5;c.beginPath();for(let i=0;i<6;i++){const px=x-17+i*7;c.moveTo(px,y+34);c.lineTo(px+4,y+25);c.lineTo(px+7,y+34)}c.stroke()}
   const selected=this.selected.x===r.x&&this.selected.y===r.y;if(selected){c.strokeStyle='#8a7447';c.lineWidth=1.2;this.corners(x-83,y-64,166,121)}
   c.textAlign='center';c.font='10px Georgia';c.fillStyle=r.damaged?'#925a40':'#505541';const label=this.roomLabel(r);if(!label)continue;const tw=c.measureText(label).width,labelX=(this.game.linked(r,this.game.room(r.x,r.y+1))||directions.some(d=>d.from.x===r.x&&d.from.y===r.y&&d.dy===1))?x-30-tw/2:x;c.fillStyle='#e5ddc6ee';c.fillRect(labelX-tw/2-4,y+54,tw+8,14);c.fillStyle=r.damaged?'#925a40':'#505541';c.fillText(label,labelX,y+64);
  }
  // The arrow encodes its source room, never just the destination cell.
  this.directionMarkers=[];const seen=new Set();
  for(const d of directions){
   const origin=this.game.room(d.from.x,d.from.y),destination=this.game.room(d.x,d.y),id=destination?this.game.passageKey(origin,destination):`${d.from.x},${d.from.y}>${d.x},${d.y}`;
   if(seen.has(id))continue;seen.add(id);
   const x=d.from.x*CW+d.dx*CW/2,y=d.from.y*CH+d.dy*CH/2;
   const screenX=w/2+(x-this.camera.x)*this.zoom,screenY=h/2+(y-this.camera.y)*this.zoom;
   if(screenX< -22||screenX>w+22||screenY< -22||screenY>h+22)continue;
   this.directionMarkers.push({...d,screenX,screenY});
   c.save();c.translate(x,y);c.scale(1/this.zoom,1/this.zoom);
   c.fillStyle=d.kind==='passage'?'#e0cca0':'#e5ddc6';c.strokeStyle=d.kind==='passage'?'#8c6b32':'#566447';c.lineWidth=1.5;
   c.fillRect(-16,-16,32,32);c.strokeRect(-16,-16,32,32);
   c.rotate(Math.atan2(d.dy,d.dx));c.beginPath();c.moveTo(-8,0);c.lineTo(8,0);c.moveTo(1,-6);c.lineTo(8,0);c.lineTo(1,6);c.stroke();
   if(d.kind==='passage'){c.fillStyle='#8c6b32';c.fillRect(-11,-10,3,3);c.fillRect(-11,7,3,3)}
   c.restore();
  }
  if(!this.game.s.combat&&this.game.s.status==='playing')for(const f of this.game.surfaceSites()){
   const x=f.x*CW,y=f.y*CH;if(x<bounds.left||x>bounds.right||y<bounds.top||y>bounds.bottom)continue;
   const reason=this.game.surfaceReason(f),selected=this.selected.x===f.x&&this.selected.y===f.y;
   c.strokeStyle=reason?'#aa695566':selected?'#866c3e':'#7e8a6766';c.fillStyle=reason?'#ae6c5110':'#adc19918';c.setLineDash([4,4]);c.fillRect(x-65,y-43,130,86);c.strokeRect(x-65,y-43,130,86);c.setLineDash([]);
   c.fillStyle=reason?'#9b5c49':'#63734d';c.font='8px Arial';c.textAlign='center';c.fillText(reason?'SEM APOIO / CONEXÃO':'CONSTRUIR · SUPERFÍCIE',x,y+5);
  }
  const seal=this.game.room(this.selected.x,this.selected.y);
  if(seal?.type==='sealed')for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++){
   const x=seal.x+dx,y=seal.y+dy;if(this.game.room(x,y)||y<0)continue;
   c.strokeStyle='#965b4d66';c.fillStyle='#965b4d0c';c.setLineDash([3,4]);c.fillRect(x*CW-62,y*CH-40,124,80);c.strokeRect(x*CW-62,y*CH-40,124,80);c.setLineDash([]);c.fillStyle='#965b4d';c.font='9px Georgia';c.textAlign='center';c.fillText('SELADO',x*CW,y*CH+3);
  }
  if(this.eventTargets?.length)for(const target of this.eventTargets){c.strokeStyle='#b4934b';c.lineWidth=2;this.corners(target.x*CW-82,target.y*CH-63,164,118)}
  }
  if(!this.exporting)this.gateGems(time);
  const formation=this.unitFormation([...this.transitions.renderUnits(time),...(this.game.campUnits?.()||[])]);
  for(const {u,x,y} of formation)this.unit(u,x,y,time);
  this.transitions.draw(time);
  for(const p of this.game.projectiles){const x=(p.x+(p.tx-p.x)*p.t)*CW,y=(p.y+(p.ty-p.y)*p.t)*CH+this.floorOffset(p.x,p.y)*(1-p.t)+this.floorOffset(p.tx,p.ty)*p.t;c.save();c.translate(x,y);c.rotate(Math.atan2((p.ty-p.y)*CH,(p.tx-p.x)*CW));c.strokeStyle=p.team==='enemy'?'#a4563e':'#2f6853';c.fillStyle=c.strokeStyle;c.lineWidth=2;if(p.kind==='arrow'||p.kind==='bolt'){if(p.kind==='bolt'){c.lineWidth=4;c.strokeStyle='#bd9a58';c.beginPath();c.moveTo(-26,0);c.lineTo(12,0);c.stroke();c.lineWidth=2;c.strokeStyle=p.team==='enemy'?'#a4563e':'#2f6853';}c.beginPath();c.moveTo(-13,0);c.lineTo(9,0);c.moveTo(4,-4);c.lineTo(10,0);c.lineTo(4,4);c.stroke();c.lineWidth=1;c.moveTo(-8,0);c.lineTo(-12,-3);c.stroke()}else{c.shadowColor=c.fillStyle;c.shadowBlur=10;c.beginPath();c.arc(0,0,p.kind==='flask'?4:5,0,Math.PI*2);c.fill();c.shadowBlur=0;c.strokeStyle='#b9c9a4';c.lineWidth=1;c.beginPath();c.moveTo(-5,0);c.lineTo(-17,0);c.stroke()}c.restore()}
  if(!this.reduced)for(const e of this.game.effects){c.globalAlpha=Math.min(1,e.life*2);c.strokeStyle=e.kind==='death'?'#a16e51':'#a16e51';c.lineWidth=1.5;c.beginPath();c.arc(e.x*CW,e.y*CH+this.floorOffset(e.x,e.y),(1-e.life)*20+5,0,Math.PI*2);c.stroke();c.globalAlpha=1}
  c.restore();
 }
 returnHome(units,time){this.transitions.returnHome(units,time)}
 transitioning(game,time){return this.gemAnimating(game,time)||this.voidGame===game&&time<(this.voidAnimationUntil||0)||this.transitions.game===game&&time<this.transitions.returnUntil}
 voidDefeat(enemies,time){this.transitions.defeat(enemies,time,this.reduced);this.voidGame=this.game;this.voidAnimationUntil=time+(this.reduced?300:1100);}
 gemAnimating(game,time){return this.gemGame===game&&time<(this.gemAnimationUntil||0)}
 gemBurst(index,time,enemies=[]){this.transitions.defeat(enemies,time,this.reduced);this.gemGame=this.game;this.gemAnimationUntil=time+(this.reduced?300:1100);this.gemFragments??=[];for(let i=0;i<(this.reduced?6:26);i++){const angle=i*2.399963+index,speed=18+(i*17%53);this.gemFragments.push({x:(index-1)*22,y:-80,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-24,start:time,life:this.reduced?300:1100,color:['#77d4db','#d6f3e9','#448ca4','#b6ded4'][i%4],size:i%3+1})}}
 gateGems(time){
  if(this.gemGame!==this.game){this.gemGame=this.game;this.gemFragments=[]}
  const c=this.ctx,remaining=this.game.s.lives??3;c.save();
  for(let i=0;i<3;i++){const x=(i-1)*22,y=-80,alive=i<remaining;
   c.fillStyle=alive?'#233e45':'#777866';c.fillRect(x-4,y-10,8,2);c.fillRect(x-7,y-8,14,10);c.fillRect(x-5,y+2,10,4);c.fillRect(x-2,y+6,4,3);
   if(alive){c.fillStyle='#448da1';c.fillRect(x-5,y-7,10,8);c.fillRect(x-3,y+1,6,4);c.fillStyle='#83ced1';c.fillRect(x-4,y-7,5,7);c.fillStyle='#daf0db';c.fillRect(x-3,y-7,3,2);c.fillStyle='#326a81';c.fillRect(x+1,y-6,4,7)}else{c.fillStyle='#e5ddc6';c.fillRect(x-3,y-7,6,8);c.fillRect(x-1,y+1,2,4);c.fillRect(x,y-10,2,6);c.fillRect(x-4,y+2,3,3)}
  }
  if(!this.exporting){this.gemFragments=(this.gemFragments||[]).filter(p=>time-p.start<p.life);for(const p of this.gemFragments){const t=(time-p.start)/1000;c.globalAlpha=Math.max(0,1-(time-p.start)/p.life);c.fillStyle=p.color;c.fillRect(Math.round(p.x+p.vx*t),Math.round(p.y+p.vy*t+(this.reduced?0:70*t*t)),p.size,p.size)}}
  c.restore();
 }
 // Export the entire fortress through the same renderer, excluding every overlay.
 exportCanvas(){
  if(!this.game)throw Error('Inicie uma fortaleza primeiro.');
  const rooms=this.game.rooms,left=Math.min(...rooms.map(r=>r.x))*CW-CW/2-32,right=Math.max(...rooms.map(r=>r.x))*CW+CW/2+32,top=Math.min(...rooms.map(r=>r.y))*CH-CH/2-32,bottom=Math.max(...rooms.map(r=>r.y))*CH+CH/2+32;
  const width=right-left,height=bottom-top,scale=Math.min(2,4096/width,4096/height,Math.sqrt(12000000/(width*height))),canvas=document.createElement('canvas');canvas.width=Math.ceil(width*scale);canvas.height=Math.ceil(height*scale);
  const saved={ctx:this.ctx,width:this.width,height:this.height,dpr:this.dpr,zoom:this.zoom,camera:this.camera,exporting:this.exporting,directionMarkers:this.directionMarkers,passageTime:this.passageTime};
  try{Object.assign(this,{ctx:canvas.getContext('2d'),width:canvas.width,height:canvas.height,dpr:1,zoom:scale,camera:{x:(left+right)/2,y:(top+bottom)/2},exporting:true});this.draw(0)}finally{Object.assign(this,saved)}
  return canvas;
 }
 // Feet rest at y + 35 inside rooms; the offset fades to the corridor centre.
 floorOffset(x,y){const distance=Math.max(Math.abs(x-Math.round(x)),Math.abs(y-Math.round(y))),room=this.game?.room?.(Math.round(x),Math.round(y)),spec=room&&this.wholeRoom(room);let floor=room?.sourceType&&['bridge','drawbridge'].includes(room.type)?4:20;if(spec?.vertical){const index=Math.round(y)-Math.min(...spec.cells.map(p=>p.y)),feet=spec.top+(spec.height-10)*(index+1)/spec.cells.length;floor=feet-Math.round(y)*144-15;}return floor*Math.max(0,1-distance/.45)}

 unitFormation(units=this.game.s.units){
  const living=units.filter(u=>u.hp>0),groups=new Map(),positions=[];
  for(const u of living){const rx=Math.round(u.x),ry=Math.round(u.y),distance=Math.max(Math.abs(u.x-rx),Math.abs(u.y-ry));
   if(distance>=.12){positions.push({u,x:u.x*CW+(u.holdingFire&&this.game.s.combat&&Math.abs(u.y-ry)>.01?6:0),y:u.y*CH+this.floorOffset(u.x,u.y)-(u.holdingFire&&this.game.s.combat&&Math.abs(u.y-ry)<.01?6:0)});continue}
   const id=`${rx},${ry}:${u.team}`;if(!groups.has(id))groups.set(id,[]);groups.get(id).push(u);
  }
  for(const group of groups.values()){
   group.sort((a,b)=>a.id-b.id);
   const size=Math.max(...group.map(u=>((u.size||1)<=1?42:36*(u.size||1)))),columns=Math.min(group.length,5,Math.max(1,Math.floor(140/Math.max(22,size*.65)))),rows=Math.ceil(group.length/columns),step=Math.min(Math.max(24,size*.62),112/(columns-.5)),rise=rows>1?Math.min(10,30/(rows-1)):0;
   group.forEach((u,index)=>{
    const row=Math.floor(index/columns),count=Math.min(columns,group.length-row*columns),column=index%columns,weight=Math.max(0,1-Math.max(Math.abs(u.x-Math.round(u.x)),Math.abs(u.y-Math.round(u.y)))/.12);
    // Keep one column grid even for incomplete ranks: alternate half a slot.
    const slot=column+Math.floor((columns-count)/2),offset=(slot-(columns-1)/2)*step+(rows>1?(row%2?.25:-.25)*step:0);
    positions.push({u,x:u.x*CW+offset*weight+(!this.game.s.combat?(u.idleRoomOffset||0)*weight:0),y:u.y*CH+this.floorOffset(u.x,u.y)-row*rise*weight});
   });
  }
  // Rear ranks and northern rooms first, so foreground feet occlude naturally.
  return positions.sort((a,b)=>a.y-b.y||a.u.id-b.u.id);
 }
 corners(x,y,w,h){const c=this.ctx,l=12;c.beginPath();c.moveTo(x,y+l);c.lineTo(x,y);c.lineTo(x+l,y);c.moveTo(x+w-l,y);c.lineTo(x+w,y);c.lineTo(x+w,y+l);c.moveTo(x+w,y+h-l);c.lineTo(x+w,y+h);c.lineTo(x+w-l,y+h);c.moveTo(x+l,y+h);c.lineTo(x,y+h);c.lineTo(x,y+h-l);c.stroke()}
 unitImage(u){const undead=u.isUndead||u.uncapturable,layer=undead?2:(u.spawnLayer??(u.team!=='ally'?this.game?.layer(this.game.room(Math.round(u.x),Math.round(u.y))):0))||0;return this.images[`layer-${layer}-${u.type}`]||this.images[`unit-${u.type}`]||this.images['unit-goblin'];}
 unit(u,x,y,time){
  const c=this.ctx,ally=u.team==='ally',image=this.unitImage(u);
  const size=((u.size||1)<=1?42:36*(u.size||1)),bob=this.reduced?0:Math.round(Math.sin(u.walk||0)*1.5),attack=this.reduced?0:Math.round(u.attack*7);
  c.save();c.translate(Math.round(x),Math.round(y)+bob);c.imageSmoothingEnabled=false;
  c.fillStyle='#26302138';c.fillRect(-size*.22,13,size*.44,3);
  if(u.facing<0)c.scale(-1,1);
  if(u.type==='immortal'&&this.immortalOutline)for(const [dx,dy]of [[-2,0],[2,0],[0,-2],[0,2]])c.drawImage(this.immortalOutline,Math.round(-size/2)+dx,Math.round(15-size)+dy,Math.round(size),Math.round(size));
  if(image)c.drawImage(image,Math.round(-size/2)+attack,Math.round(15-size),Math.round(size),Math.round(size));
  else{c.fillStyle=ally?'#436d4b':'#9a563b';c.fillRect(-5,-10,10,22)}
  if(u.facing<0)c.scale(-1,1);
  if(!this.exporting){const marker=u.team==='neutral'?'#b5a56f':ally?'#356a4e':'#a44732';c.fillStyle=marker;c.fillRect(-3,17,6,3);
  if(u.type==='immortal'){c.fillStyle='#d8c692';c.font='bold 17px Georgia';c.textAlign='center';c.fillText('∞',0,9-size);}
  if(this.game.s.combat&&u.type!=='immortal'){const width=Math.max(22,size*.55),top=12-size;
   c.fillStyle='#302f26';c.fillRect(-width/2-1,top-1,width+2,5);c.fillStyle=marker;c.fillRect(-width/2,top,width*Math.max(0,u.hp/u.maxHp),3);
   if(u.shield>0){c.fillStyle='#79a0a2';c.fillRect(-width/2,top-4,width*Math.min(1,u.shield/20),2)}
  }}c.restore();
 }
}

installColonyView(Renderer);

installWholeRooms(Renderer);


// audio.js
class Audio{
 constructor(){this.ctx=null;this.master=null;this.volume=.35;this.enabled=true;this.ambient=null;this.last=0}
 init(){if(this.ctx)return;try{this.ctx=new(window.AudioContext||window.webkitAudioContext)();this.master=this.ctx.createGain();this.master.gain.value=this.enabled?this.volume:0;this.master.connect(this.ctx.destination)}catch{}}
 resume(){this.init();if(this.ctx?.state==='suspended')this.ctx.resume().catch(()=>{})}
 set(volume,enabled){this.volume=volume;this.enabled=enabled;if(this.master)this.master.gain.setTargetAtTime(enabled?volume:0,this.ctx.currentTime,.1)}
 play(kind='click'){
  if(!this.enabled||!this.ctx)return;const now=this.ctx.currentTime;if(kind==='attack'&&now-this.last<.12)return;if(kind==='attack')this.last=now;
  const tones={click:[330,.05,'sine'],explore:[220,.3,'triangle'],build:[440,.22,'triangle'],attack:[100,.07,'sawtooth'],ranged:[620,.1,'sine'],victory:[523,.6,'triangle'],danger:[82,.6,'triangle'],save:[660,.15,'sine']};const[f,d,type]=tones[kind]||tones.click;
  const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.setValueAtTime(f,now);o.frequency.exponentialRampToValueAtTime(kind==='victory'?f*1.5:f*.6,now+d);g.gain.setValueAtTime(.08,now);g.gain.exponentialRampToValueAtTime(.001,now+d);o.connect(g);g.connect(this.master);o.start(now);o.stop(now+d+.02);
 }
}


// producers.js
const PRODUCER_TYPES={forest:'resources',mine:'gold',crystal:'gold',hive:'resources',city:'gold',elemental:'gold',games:'gold',parlor:'gold',prison:'gold'};
class ProducerDock{
 constructor(){this.game=null;this.badges=new Map();this.effects=[];this.root=null;}
 reset(game){this.root?.remove();this.root=null;this.badges.clear();this.effects=[];this.game=game;}
 ensure(){if(!this.root){this.root=document.createElement('div');this.root.className='producer-dock';this.root.setAttribute('aria-label','Produção contínua da fortaleza');document.querySelector('.map-wrap')?.append(this.root);}return this.root;}
 badge(id,type,x,y){this.ensure();let b=this.badges.get(id);if(!b){b=document.createElement('button');b.className='producer-badge';b.dataset.producer=id;const img=document.createElement('img');b.append(img);b.addEventListener('click',()=>this.onSelect?.({x,y}));this.root.append(b);this.badges.set(id,b);}if(b.dataset.producerType!==type){b.dataset.producerType=type;b.title=ROOMS[type]?.name||(type==='lost'?'Reino das Coisas Perdidas':'Produção');const img=b.querySelector('img');img.src=typeof embeddedAssets!=='undefined'?embeddedAssets[`producers/${type}.png`]:`./assets/producers/${type}.png`;img.alt=b.title;}return b;}

 sync(game){if(this.game!==game)this.reset(game);const present=new Set();for(const r of game.rooms){if((r.wyrdId&&r.wyrdId!==13)||(!PRODUCER_TYPES[r.type]&&r.wyrdId!==13&&!r.legendaryForest&&r.planarReward!=='honey')||r.discoveryRoot&&r.discoveryRoot!==`${r.x},${r.y}`)continue;present.add(`${r.x},${r.y}`);const b=this.badge(`${r.x},${r.y}`,r.wyrdId===13?'lost':r.planarReward==='honey'?'hive':r.type,r.x,r.y);b.classList.toggle('inactive',!game.active(r));}for(const [id,b]of this.badges)if(!present.has(id)&&!b.classList.contains('producer-destroyed')){b.remove();this.badges.delete(id);}}
 origin(event){const id=event.source,b=this.badge(id,event.sourceType,event.x,event.y);if(event.card){const previous=b.querySelector('.producer-card');previous?.remove();const card=document.createElement('span');card.className='producer-card';card.innerHTML=`<span>${['A',2,3,4,5,6,7,8,9,10,'J','Q','K'][event.card.rank-1]||'★'}${event.card.bonus?`<sup>${event.card.bonus>0?'+':''}${event.card.bonus}</sup>`:''}</span><b>${event.card.suit}</b>`;b.append(card);setTimeout(()=>card.remove(),2400);return card;}return b.querySelector('img')||b;}
 destroy(event,reduced=false){const b=this.badge(event.source,event.sourceType,event.x,event.y);if(event.card)this.origin(event);b.classList.add('producer-destroyed');if(!reduced)for(let i=0;i<14;i++){const part=document.createElement('i');part.style.setProperty('--dx',`${Math.cos(i*2.4)*(25+i*3)}px`);part.style.setProperty('--dy',`${Math.sin(i*2.4)*(25+i*3)}px`);part.style.setProperty('--rot',`${i*49}deg`);b.append(part);}setTimeout(()=>{b.remove();this.badges.delete(event.source)},1400);}
}


// resource-flights.js
// One particle per credited unit; presentation never delays the actual balance.
class ResourceFlights{
 constructor(){this.dock=new ProducerDock();this.game=null;this.items=[];this.pending={resources:0,gold:0};this.reduced=false;this.layer=null;this.glyphs={}}
 reset(game=null){this.dock.reset(game);this.items=[];this.pending={resources:0,gold:0};this.game=game;this.clear();this.paint()}
 clear(){if(this.layer){this.layer.getContext('2d').clearRect(0,0,this.layer.width,this.layer.height);this.layer.hidden=true}}
 finish(){this.items=[];this.pending={resources:0,gold:0};this.clear();this.paint()}
 collect(game,card=null){
  if(this.game!==game)this.reset(game);this.dock.sync(game);
  const keep=[];for(const event of game.events){if(event.type==='resource-gain')this.receive(event,event.source?this.dock.origin(event):event.originElement||card);else if(event.type==='producer-trigger')this.dock.origin(event);else if(event.type==='producer-destroyed')this.dock.destroy(event,this.reduced);else keep.push(event)}game.events=keep;
 }
 receive(event,card=null){
  if(!this.game)return;
  if(this.reduced||document.hidden){this.paint();return}
  const origin=card?.querySelector('.card-suit')||card||document.querySelector('.room-portrait')||document.querySelector('#map');
  const rect=origin?.getBoundingClientRect(),sx=rect?.width?rect.left+rect.width/2:innerWidth/2,sy=rect?.height?rect.top+rect.height/2:innerHeight*.5;
  const now=performance.now();
  for(const type of ['resources','gold']){
   const count=Math.max(0,Math.floor(event[type]||0));this.pending[type]+=count;
   for(let i=0;i<count;i++)this.items.push({type,origin:card?origin:null,sx:sx/innerWidth,sy:sy/innerHeight,delay:now+320+(count>1?i*Math.min(40,850/(count-1)):0),duration:650+i%5*28,index:i,started:false});
  }
  if(this.items.length)this.ensureLayer();this.paint();
 }
 ensureLayer(){
  if(!this.layer){this.layer=document.createElement('canvas');this.layer.className='resource-flight-layer';this.layer.setAttribute('aria-hidden','true');document.body.append(this.layer)}
  this.layer.hidden=false;
 }
 glyph(type){
  if(this.glyphs[type])return this.glyphs[type];
  const canvas=document.createElement('canvas');canvas.width=64;canvas.height=64;const c=canvas.getContext('2d');
  c.font='bold 46px Georgia';c.textAlign='center';c.textBaseline='middle';c.lineWidth=4;c.strokeStyle='#1c2923';c.fillStyle=type==='resources'?'#ca896a':'#dcc37c';
  c.strokeText(type==='resources'?'♥':'♦',32,34);c.fillText(type==='resources'?'♥':'♦',32,34);this.glyphs[type]=canvas;return canvas;
 }
 paint(){
  if(!this.game)return;
  for(const type of ['resources','gold']){const el=document.getElementById(type);if(!el)continue;const text=String(Math.max(0,Math.floor(this.game.s[type])-this.pending[type]));if(el.textContent!==text)el.textContent=text}
 }
 tick(now){
  if(!this.items.length)return;
  if(this.reduced||document.hidden){this.finish();return}
  const dpr=Math.min(devicePixelRatio||1,2),width=Math.round(innerWidth*dpr),height=Math.round(innerHeight*dpr);
  if(this.layer.width!==width||this.layer.height!==height){this.layer.width=width;this.layer.height=height}
  const ctx=this.layer.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,innerWidth,innerHeight);
  const targets={};for(const type of ['resources','gold']){const el=document.getElementById(type),r=el.closest('.resource').querySelector('.resource-symbol').getBoundingClientRect();targets[type]={x:r.left+r.width/2,y:r.top+r.height/2}}
  const remaining=[],arrived=new Set();
  for(const item of this.items){
   if(now<item.delay){remaining.push(item);continue}
   if(!item.started){item.started=true;if(item.origin?.isConnected){const r=item.origin.getBoundingClientRect();item.sx=(r.left+r.width/2)/innerWidth;item.sy=(r.top+r.height/2)/innerHeight}item.origin=null}
   const t=Math.min(1,(now-item.delay)/item.duration),target=targets[item.type];
   if(t>=1){this.pending[item.type]--;arrived.add(item.type);continue}
   const start={x:item.sx*innerWidth+(item.index%5-2)*5,y:item.sy*innerHeight+(item.index%3-1)*5};
   const bend=(item.index%2?1:-1)*(30+item.index%4*12),control={x:(start.x+target.x)/2+bend,y:Math.min(start.y,target.y)-45};
   const q=t*t*(3-2*t),u=1-q,x=u*u*start.x+2*u*q*control.x+q*q*target.x,y=u*u*start.y+2*u*q*control.y+q*q*target.y,size=22+Math.sin(t*Math.PI)*6;
   ctx.globalAlpha=Math.min(1,t*10,(1-t)*12);ctx.drawImage(this.glyph(item.type),x-size/2,y-size/2,size,size);remaining.push(item);
  }
  for(const type of arrived){const badge=document.getElementById(type).closest('.resource');badge.classList.remove('resource-arrival');void badge.offsetWidth;badge.classList.add('resource-arrival')}
  ctx.globalAlpha=1;this.items=remaining;this.paint();if(!this.items.length)this.clear();
 }
}


// event-art.js
// Explicit semantic mapping: illustrations are presentation only; saves store
// the original effect and choice, so adding art never replays a reward.
const EVENT_ART={
 'Quebra de barragem':27,'Desabamento':12,'Andarilhos':13,'Andarilhos acolhidos':13,'Andarilhos hostis':26,'Andarilhos partiram':13,'Sala tomada':26,'Acampamento inimigo':26,'Reforços do acampamento':26,'Retomada da área ocupada':26,'Área recuperada':35,'Transferir prisioneiro':13,'Prisioneiro transferido':13,'Invasão de bandidos':26,'Ataque ao território':25,'Bandidos aguardam uma passagem':26,'Escolher capturas':13,'Prisioneiro capturado':13,'Monstro capturado':25,'Candidato dispensado':13,'Fuga de prisioneiros':26,'Colônia dispersa':24,'Cria nascida':25,
 'Dedicação do altar':20,'Sacrifício ao Devorador':1,'Instalar clérigo':20,'Persuadir prisioneiro':13,'Contratar prisioneiro':13,'Proposta de contratação':13,'Prisioneiro contratado':13,'Prisioneiro em silêncio':8,'Informação':10,'Fuga da solitária':26,'Fuga da prisão':26,'Mapear labirinto':35,'Labirinto mapeado':35,'Explorador perdido':26,'Território guardado':25,'Alimentar criatura':25,'Criatura alimentada':25,'Criatura domesticada':25,'Domesticação falhou':26,'Desafiar campeão':3,'Campeão aliado':3,'Desafio perdido':26,'Portal selado':20,'Dívida do prisioneiro':49,'Acampamento revelado':35,'Instalação recuperada':35,'Fraquezas reveladas':10,'Prisioneiros resgatados':13,
 'Gema do portão destruída':52,'Metal vivo':0,'Sussurros':1,'Fortuna':2,'Guerreiro leal':3,'Banquete de cogumelos':6,'Colheita de cogumelos':7,'Prisão antiga':8,'Fonte termal':9,'Artefato encantado':10,'Invasão planar':11,'Caverna esgotada':12,'Prisioneiro convertido':13,'Motim':14,'Resgate do hospital':15,'Retorno dos mortos':16,'Retorno do Cemitério':16,'Runa Lápide':16,'Gêmeo reanimado':16,'Ruínas da Masmorra':35,'Festival':17,'Dragão desperto':18,'Engenharia extraordinária':19,'Proteção do templo':20,'Perigo ambiental':21,'Explosão de gás':22,'Porta destruída':23,'Criatura perdida':24,'Criatura libertada':25,'Prisioneiro hostil':26,'Água':27,'Rio subterrâneo':27,'Magma':28,'Cratera de magma':28,'Cratera vulcânica':28,'Gás venenoso':29,'Miasma':30,'Gás cegante':31,'Gás inflamável':32,'Descoberta lendária':33,
 'Asas de Ícaro':36,'Escafandro':37,'Placa de Obsidiana':38,'Fábrica de Monstros':39,'Fagulha de Vida':40,'Tomo Maldito':41,'Pensador Perpétuo':42,'Templo das Fadas':43,'Salão de Hidromel':44,'Apiários':45,'Gato Rei':46,'Algemas de Mithrill':47,'O Curador':48,'Ferrugem':49,'Praga':50,'Euforia':51
};
for(const [n,e]of GOOD_MAGIC.entries())EVENT_ART[e[0]]=60+n;for(const [n,e]of BAD_MAGIC.entries())EVENT_ART[e[0]]=86+n;
function eventArtIndex(card){return EVENT_ART[card.title]??(/miasma/i.test(card.title)?30:/magma|lava/i.test(card.title)?28:/água|inund/i.test(card.title)?27:/gás.*venen/i.test(card.title)?29:card.tone==='bad'?34:35)}
function eventArtURL(card){const path=`events/event-${eventArtIndex(card)}.png`;return typeof embeddedAssets!=='undefined'?embeddedAssets[path]:'./assets/'+path}


// event-cards.js
const eventEscape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const eventSpriteURL=(type,layer=0)=>{const path=layer?'layer-enemies/'+layer+'-'+type+'.png':'sprites/'+type+'.png';return typeof embeddedAssets!=='undefined'?embeddedAssets[path]:'./assets/'+path};
class EventCards{
 constructor(flights,{onChange=()=>{},onResolved=()=>{},onPending=()=>{},onTargets=()=>{},beforeShow=()=>true,presentationBusy=()=>false}={}){this.flights=flights;this.onChange=onChange;this.onResolved=onResolved;this.onPending=onPending;this.onTargets=onTargets;this.beforeShow=beforeShow;this.presentationBusy=presentationBusy;this.game=null;this.active=null;this.layer=null;this.selecting=false;this.started=0;this.hover=false;this.wasBlocking=false;document.addEventListener('keydown',e=>this.key(e),true)}
 get blocking(){return !!this.game&&(this.presentationBusy(this.game,performance.now())||this.game.events.some(e=>['life-lost','return-home','void-defeat'].includes(e.type))||!!this.game.s.effectCards?.length||!!document.querySelector('.discovery-card')||this.flights.items.length>0)}
 reset(game=null){this.layer?.remove();this.layer=null;this.active=null;this.selecting=false;this.hover=false;this.game=game;if(game)game.presentationEnabled=true;this.onTargets([]);this.wasBlocking=false;document.querySelector('.discovery-card')?.remove()}
 tick(game,now){
  if(this.game!==game)this.reset(game);
  const modalOpen=!!document.querySelector('#modal-root')?.firstChild;
  if(this.layer){const returning=this.layer.hidden&&!modalOpen;this.layer.hidden=modalOpen;if(returning)requestAnimationFrame(()=>this.layer?.querySelector('button')?.focus());}
  const front=game.s.effectCards?.[0];
  if(this.active&&front?.id!==this.active.id){this.layer?.remove();this.layer=null;this.active=null;this.selecting=false;this.onTargets([])}
  if(!this.active&&front&&!game.events.some(e=>['life-lost','return-home','void-defeat'].includes(e.type))&&this.beforeShow(game,now)&&!document.querySelector('.discovery-card')&&!this.flights.items.length&&!document.querySelector('#modal-root')?.firstChild){this.active=front;this.started=now;this.elapsed=0;this.lastTick=now;this.render()}
  if(this.active&&!this.active.input){if(!this.hover&&!document.hidden&&!modalOpen)this.elapsed+=Math.min(100,Math.max(0,now-this.lastTick));this.lastTick=now;if(this.elapsed>=4200)this.resolve();}
  const blocked=this.blocking;if(blocked!==this.wasBlocking){this.wasBlocking=blocked;this.onChange()}
 }
 captureActions(card){
  const g=this.game,i=card.input,rooms=g.captureSlots(card),a=i.assignments||{};
  if(!rooms.some(r=>`${r.x},${r.y}`===this.captureSlot))this.captureSlot=rooms.find(r=>g.captureCanReceive(r))?`${rooms.find(r=>g.captureCanReceive(r)).x},${rooms.find(r=>g.captureCanReceive(r)).y}`:rooms[0]?`${rooms[0].x},${rooms[0].y}`:null;
  const selected=g.s.rooms[this.captureSlot],pageSize=20,pages=Math.max(1,Math.ceil(i.captives.length/pageSize));this.capturePage=Math.max(0,Math.min(pages-1,this.capturePage||0));
  const slots=rooms.map(r=>{const id=`${r.x},${r.y}`,record=i.captives[a[id]],available=g.captureCanReceive(r);return `<button class="capture-room ${id===this.captureSlot?'selected':''}" data-capture-room="${id}" aria-pressed="${id===this.captureSlot}"><strong>${eventEscape(ROOMS[r.type].name)} <small>${r.x}, ${r.y}</small></strong><span>${record?eventEscape(record.name)+' · '+Math.round(record.power)+' STR'+(g.captureReplacement(r,i.replacements?.[id]||0)?' · descarta '+eventEscape(g.captureReplacement(r,i.replacements?.[id]||0).enemyName||g.captureReplacement(r,i.replacements?.[id]||0).name||'ocupante atual'):''):g.captureReplacement(r,i.replacements?.[id]||0)?'Substituir '+eventEscape(g.captureReplacement(r,i.replacements?.[id]||0).enemyName||g.captureReplacement(r,i.replacements?.[id]||0).name||'ocupante atual')+' · anterior será descartado':available?r.type==='kennel'?'Monstro → aliado imediatamente':r.type==='persuasion'?'Prisioneiro para interrogatório':r.type==='solitary'?'Candidato ao recrutamento':`${r.prisoners||0}/20 prisioneiros`:'Sem vaga disponível'}</span></button>`;}).join('');
  const items=i.captives.slice(this.capturePage*pageSize,(this.capturePage+1)*pageSize).map((c,offset)=>{
   const n=this.capturePage*pageSize+offset,owner=Object.entries(a).find(([,index])=>index===n)?.[0],chosen=a[this.captureSlot]===n,can=selected&&g.captureAccepts(selected,c)&&(!owner||owner===this.captureSlot),reason=chosen?'Selecionado':owner?'Reservado para outra estrutura':!captiveKind(c)?'Não capturável':!selected?'Escolha uma estrutura':!g.captureCanReceive(selected)?'Estrutura sem vaga':!g.captureAccepts(selected,c)?selected.type==='kennel'?'Exige um monstro':'Exige inimigo inteligente':'Selecionar';
   return `<button class="capture-enemy ${chosen?'selected':''}" data-event-choice="${eventEscape(this.captureSlot)}#${n}" ${can?'':'disabled'} aria-pressed="${chosen}" aria-label="${eventEscape(c.name+', '+Math.round(c.power)+' STR. '+reason)}"><img src="${eventSpriteURL(c.type,c.isUndead?2:c.spawnLayer||0)}" alt="" width="64" height="64"><strong>${eventEscape(c.name)}</strong><span>${Math.round(c.power)} STR</span><small>${reason}</small></button>`;
  }).join('');
  return `<div class="capture-layout"><div class="capture-room-list"><p class="event-prompt">1. Escolha o destino</p>${slots}</div><div class="capture-candidates"><p class="event-prompt">2. Escolha um inimigo derrotado</p><div class="capture-grid">${items}</div>${pages>1?`<div class="capture-pages"><button data-capture-page="${this.capturePage-1}" ${this.capturePage?'':'disabled'} aria-label="Página anterior">←</button><span>${this.capturePage+1} / ${pages}</span><button data-capture-page="${this.capturePage+1}" ${this.capturePage<pages-1?'':'disabled'} aria-label="Próxima página">→</button></div>`:''}${selected?.type==='prison'&&g.captureReplacement(selected)?`<p class="event-prompt">Prisioneiro a dispensar</p>${heldCaptives(selected).map((c,n)=>`<button class="panel-action" data-event-choice="${eventEscape(this.captureSlot)}#replace${n}" aria-pressed="${(i.replacements?.[this.captureSlot]||0)===n}">${(i.replacements?.[this.captureSlot]||0)===n?'✓ ':''}${eventEscape(c.name)} · ${Math.round(c.power)} STR</button>`).join('')}`:''}${selected?`<button class="panel-action" data-event-choice="${eventEscape(this.captureSlot)}#none">Deixar esta estrutura sem nova captura</button>`:''}</div></div><p class="inline-note">${Object.keys(a).length} captura(s) selecionada(s). Os demais inimigos serão dispensados. Ao substituir uma captura, o ocupante anterior será descartado definitivamente.</p><button class="primary" data-event-choice="confirm">Confirmar ${Object.keys(a).length} captura(s)</button><button class="panel-action" data-event-choice="cancel">Não capturar ninguém</button>`;
 }
 render(){return this.game.withQueryCache(()=>this.renderCard())}
 renderCard(){
  const scrollTop=this.layer?.querySelector('.event-card')?.scrollTop||0;this.layer?.remove();const card=this.active;if(!card)return;
  const layer=document.createElement('div');layer.className='event-card-layer'+(this.selecting?' targeting':'')+(card.input?.kind==='colony'&&card.input.action==='capture'?' capture-selection':'');
  const targets=this.game.mapEffectTargets(card),input=card.input;let actions='';
  if(input?.kind==='colony'&&input.action==='capture')actions=this.captureActions(card);
  else if(targets.length){actions=`<p class="event-prompt">${this.selecting?'Clique ou toque em um espaço destacado no mapa.':'Escolha o destino deste efeito diretamente no mapa.'}</p><button class="primary" data-event-map>${this.selecting?'Voltar à carta':'Escolher local'}</button>${input.kind==='colony'||input.kind==='rise'?'<button class="panel-action" data-event-choice="cancel">Cancelar</button>':''}`;}
  else if(input?.kind==='world-event')actions='<button class="primary" data-event-choice="accept">Acolher · −2 moral</button><button class="panel-action" data-event-choice="reject">Recusar</button>';
  else if(input?.kind==='rules'){const opts=this.game.rulesChoices(card);actions=opts.length?`<div class="event-targets">${opts.map(o=>`<button data-event-choice="${eventEscape(o.value)}">${eventEscape(o.label)}</button>`).join('')}</div>`:'<p>Não há alvo válido para este efeito.</p><button class="primary" data-event-choice="skip">Continuar</button>';}
  else if(input?.kind==='colony'){const opts=this.game.colonyChoices(card);actions=`<div class="event-targets">${opts.map(o=>`<button data-event-choice="${eventEscape(o.value)}">${eventEscape(o.label)}</button>`).join('')}</div><button class="panel-action" data-event-choice="cancel">${input.action==='capture'?'Não capturar':'Cancelar'}</button>`;}
  else if(input?.kind==='rise'){const options=this.game.riseChoices(card);actions=`<div class="event-targets">${options.map(o=>`<button data-event-choice="${eventEscape(o.value)}">${eventEscape(o.label)}</button>`).join('')}</div>${!['dedicate','informationDebt'].includes(input.action)?'<button class="panel-action" data-event-choice="cancel">Cancelar</button>':''}`;}
  else if(input?.kind==='prison')actions='<button class="primary" data-event-choice="leave">Manter aprisionada</button><button class="panel-action" data-event-choice="release">Libertar criatura</button>';
  else actions=`${input?'<p class="inline-note">O alvo deste efeito não está mais disponível.</p>':''}<button class="primary" data-event-continue>Continuar</button>`;
  layer.innerHTML=`<section class="event-card ${card.tone}" role="dialog" aria-modal="${!this.selecting}" aria-labelledby="event-card-title" aria-describedby="event-card-description"><div class="event-card-kind">${card.tone==='good'?'EFEITO BENÉFICO':card.tone==='bad'?'EFEITO ADVERSO':'EVENTO'}<span>${this.game.s.effectCards.length>1?this.game.s.effectCards.length+' na fila':''}</span></div><img class="event-card-art" src="${eventArtURL(card)}" alt="${eventEscape(card.title)}" width="192" height="192"><h2 id="event-card-title">${eventEscape(card.title)}</h2><p id="event-card-description">${eventEscape(card.description)}</p><div class="event-card-actions">${actions}</div><p class="event-error" role="alert"></p></section>`;
  layer.addEventListener('click',e=>{const room=e.target.closest('[data-capture-room]'),page=e.target.closest('[data-capture-page]');if(room){this.captureSlot=room.dataset.captureRoom;this.render();return;}if(page){this.capturePage=Number(page.dataset.capturePage);this.render();return;}const target=e.target.closest('[data-event-target]'),choice=e.target.closest('[data-event-choice]');if(target){const [x,y]=target.dataset.eventTarget.split(',').map(Number);this.resolve({x,y})}else if(choice)this.resolve(choice.dataset.eventChoice);else if(e.target.closest('[data-event-continue]'))this.resolve();else if(e.target.closest('[data-event-map]')){this.selecting=!this.selecting;this.onTargets(this.selecting?targets:[]);this.render();if(this.selecting){const map=document.querySelector('#map');map?.focus({preventScroll:true});}}});
  layer.querySelector('.event-card').addEventListener('pointerenter',()=>this.hover=true);layer.querySelector('.event-card').addEventListener('pointerleave',()=>{this.hover=false;this.elapsed=0;this.lastTick=performance.now()});document.body.append(layer);this.layer=layer;layer.querySelector('.event-card').scrollTop=scrollTop;requestAnimationFrame(()=>layer.querySelector('button')?.focus({preventScroll:true}));
 }
 selectRoom(room){if(!this.selecting)return false;const target=this.game.mapEffectTargets(this.active).find(p=>p.x===room.x&&p.y===room.y);if(target)this.resolve(target.value);else{const error=this.layer?.querySelector('.event-error');if(error)error.textContent='Escolha um espaço destacado.';}return true}
 resolve(selection=null){if(!this.active)return;const card=this.active,target=this.game.mapEffectTargets(card).find(t=>typeof selection==='object'&&selection?t.x===selection.x&&t.y===selection.y:t.value===selection);const result=this.game.resolveEffect(this.active.id,selection);if(result.pending){this.render();this.onChange();this.onPending();return;}if(!result.ok){const error=this.layer?.querySelector('.event-error');if(error)error.textContent=result.reason;return}this.layer?.remove();this.layer=null;this.active=null;this.selecting=false;this.hover=false;this.onTargets([]);this.onResolved(card,selection,target);this.onChange()}
 key(e){if(!this.active||this.layer?.hidden)return;if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();if(!this.active.input)this.resolve();return}if(this.selecting&&e.target.id==='map'&&['ArrowUp','ArrowRight','ArrowDown','ArrowLeft','Enter'].includes(e.key))return;if(e.key==='Tab'){const items=[...this.layer.querySelectorAll('button:not(:disabled)')],first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}return}if(e.target.closest?.('.event-card'))return;e.preventDefault();e.stopImmediatePropagation()}
}


// hover.js
// Delegated descriptions also cover controls rebuilt during play.
function installHover(){
 const tip=document.createElement('div');tip.id='game-hover';tip.setAttribute('role','tooltip');tip.hidden=true;document.body.append(tip);let owner=null,timer=null,previous=null;
 const migrate=root=>{if(root.nodeType!==1&&root!==document)return;const nodes=[...(root.matches?.('[title]')?[root]:[]),...root.querySelectorAll('[title]')];for(const el of nodes){const text=el.getAttribute('title');if(text)el.dataset.tooltip=text;el.removeAttribute('title');}};
 const hide=()=>{clearTimeout(timer);tip.hidden=true;if(owner){if(previous===null)owner.removeAttribute('aria-describedby');else owner.setAttribute('aria-describedby',previous);}owner=null;};
 const show=el=>{hide();if(!el?.isConnected||!el.dataset.tooltip)return;owner=el;previous=el.getAttribute('aria-describedby');el.setAttribute('aria-describedby',[previous,tip.id].filter(Boolean).join(' '));tip.textContent=el.dataset.tooltip;tip.hidden=false;const box=el.getBoundingClientRect(),rect=tip.getBoundingClientRect(),margin=10;tip.style.left=Math.max(margin,Math.min(innerWidth-rect.width-margin,box.left+(box.width-rect.width)/2))+'px';tip.style.top=Math.max(margin,box.top>=rect.height+margin?box.top-rect.height-8:Math.min(innerHeight-rect.height-margin,box.bottom+8))+'px';};
 migrate(document);new MutationObserver(records=>{for(const r of records){if(r.type==='attributes')migrate(r.target);else for(const n of r.addedNodes)migrate(n);}if(owner&&!owner.isConnected)hide();}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['title']});
 document.addEventListener('pointerover',e=>{if(e.pointerType==='touch')return;const el=e.target.closest('[data-tooltip]');if(el===owner)return;hide();if(el)timer=setTimeout(()=>show(el),220);});
 document.addEventListener('pointerout',e=>{const el=e.target.closest('[data-tooltip]');if(el&&!el.contains(e.relatedTarget))hide();});
 document.addEventListener('focusin',e=>{if(e.target.matches(':focus-visible'))show(e.target.closest('[data-tooltip]'));});
 document.addEventListener('focusout',hide);document.addEventListener('pointerdown',hide,true);document.addEventListener('click',hide,true);document.addEventListener('scroll',hide,true);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!tip.hidden){e.preventDefault();e.stopPropagation();hide();}},true);window.addEventListener('resize',hide);
 return {hide};
}


// app.js
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
installHover();
const resourceFlights=new ResourceFlights();
resourceFlights.dock.onSelect=tile=>{selected=tile;renderer.selected=tile;renderer.focus(tile);tab='room';refresh()};
const sound=new Audio();let game=null,tab='room',category='Tropas',selected={x:0,y:0},toastTimer,modalPaused=null,previousFocus=null,saveNotice=false,screen='title',newDifficulty='normal',lastStats=0,dirty=false;
const defaults={sound:true,volume:.35,reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,autoPause:true,cards:true,uiScale:1};
let settings={...defaults};try{const raw=JSON.parse(localStorage.getItem('conquer-options')||'{}');for(const k of ['sound','reduced','autoPause','cards'])if(typeof raw[k]==='boolean')settings[k]=raw[k];if(typeof raw.volume==='number')settings.volume=Math.max(0,Math.min(1,raw.volume))}catch{}
function applySettings(){document.body.classList.toggle('reduce-motion',settings.reduced);renderer.reduced=settings.reduced;resourceFlights.reduced=settings.reduced;if(settings.reduced)resourceFlights.finish();sound.set(settings.volume,settings.sound);try{localStorage.setItem('conquer-options',JSON.stringify(settings))}catch{}}
function hydrate(root=document){root.querySelectorAll('[data-icon]').forEach(el=>{el.innerHTML=icon(el.dataset.icon)})}
function toast(text){const el=$('#toast');el.textContent=text;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,3700)}
function stored(slot){try{return localStorage.getItem('conquer-save-'+slot)}catch{return null}}
function save(slot='auto',quiet=false){if(!game)return false;try{localStorage.setItem('conquer-save-'+slot,game.serialize());if(!quiet){toast(slot==='auto'?'Jornada salva automaticamente.':`Jornada salva no espaço ${slot}.`);sound.play('save')}updateContinue();return true}catch{if(!saveNotice||!quiet){toast('Armazenamento indisponível. Exporte o jogo pelo menu Salvar.');saveNotice=true}return false}}
function updateContinue(){$('#title-save').disabled=!game&&!stored('auto');$('#title-save').title=game||stored('auto')?'Gerenciar salvamentos':'Inicie uma fortaleza para salvar';const raw=stored('auto');const btn=$('#continue-game');if(!raw){btn.hidden=true;return}try{const g=Game.restore(raw);btn.hidden=false;$('#continue-label').textContent=`Turno ${g.s.turn} · Profundidade ${g.s.maxDepth}`;btn.firstElementChild.nextSibling.textContent='Continuar jornada ';}catch{btn.hidden=true}}
function setScreen(name){if(name!=='game'){resourceFlights.finish();eventCards.reset();}screen=name;$('#title-screen').hidden=name!=='title';$('#game-screen').hidden=name!=='game';if(name==='game')requestAnimationFrame(()=>renderer.resize());else updateContinue()}
function startGame(options){closeModal();game=new Game(options);eventCards.reset(game);pendingEnd=false;renderer.game=game;selected={x:0,y:1};renderer.selected=selected;tab='room';setScreen('game');renderer.center();renderer.selected=selected;refresh();save('auto',true);sound.play('explore');if(!localStorageRead('conquer-tutorial-seen')){tutorial();try{localStorage.setItem('conquer-tutorial-seen','1')}catch{}}}
function localStorageRead(k){try{return localStorage.getItem(k)}catch{return null}}
function loadRaw(raw){try{const loaded=Game.restore(raw);closeModal();game=loaded;eventCards.reset(game);pendingEnd=false;renderer.game=game;renderer.center();selected={x:0,y:0};renderer.selected=selected;tab='room';setScreen('game');refresh();toast(game.s.combat?'Batalha carregada em pausa. Toque em Retomar.':'Jornada carregada.');if(game.s.status!=='playing')showEnd()}catch(e){toast(e.message)}}
const renderer=new Renderer($('#map'),tile=>{if(!game)return;if(eventCards.selecting){eventCards.selectRoom(tile);return}if(tile.action==='direction'){exploreDirection(tile);return}const exists=game.site(tile.x,tile.y),frontier=game.frontier().some(r=>r.x===tile.x&&r.y===tile.y);if(!exists&&!frontier)return;selected=tile;renderer.selected=tile;tab='room';refresh();sound.play('click')},info=>{
 const el=$('#map-tooltip');if(!info||!game||renderer.pointers.size){el.hidden=true;return}if(info.direction){const d=info.direction;el.hidden=false;el.textContent=d.kind==='passage'?'Abrir passagem · sem carta · ação de exploração':'Explorar nesta direção · revela uma sala e abre apenas esta passagem';el.style.left=Math.max(8,Math.min(info.point.x+13,renderer.width-230))+'px';el.style.top=Math.max(45,Math.min(info.point.y+15,renderer.height-65))+'px';return}const r=game.room(info.tile.x,info.tile.y);if(!r){el.hidden=true;return}el.textContent=`${ROOMS[r.type].name} · ${r.y>0?'Prof. '+r.y:r.y<0?'Altura '+-r.y:'Superfície'}${r.damaged?' · Danificada':''}`;el.style.left=Math.min(info.point.x+13,renderer.width-230)+'px';el.style.top=Math.max(45,Math.min(info.point.y+15,renderer.height-65))+'px';el.hidden=false;
});
const eventCards=new EventCards(resourceFlights,{beforeShow:(g,now)=>!renderer.transitioning(g,now),presentationBusy:(g,now)=>renderer.transitioning(g,now),onChange:()=>{if(game)updateStats()},onPending:()=>save('auto',true),onResolved:(card,selection,target)=>{if(target){const i=card.input;selected=i.action==='placement'||i.action==='engineering'&&i.mode==='defense'?{x:i.x,y:i.y}:{x:target.x,y:target.y};renderer.selected=selected;renderer.focus(selected);tab='room';}refresh();save('auto',true)},onTargets:targets=>{renderer.eventTargets=targets}});let pendingEnd=false,pendingCombatSound=false;
hydrate();applySettings();$('#startup-help').hidden=true;(renderer.loading=renderer.load()).then(()=>dirty=true);
function selectedRoom(){return game?.site(selected.x,selected.y)}
function updateRoomPortrait(){const r=selectedRoom(),el=$('.room-portrait img');if(!r||!el)return;const url=renderer.roomURL(r,performance.now());if(url&&el.getAttribute('src')!==url)el.src=url}
function updateStats(){if(!game)return;updateRoomPortrait();resourceFlights.collect(game);resourceFlights.paint();const s=game.s,c=game.capacities();$('#res-cap').textContent='/'+c.resources;$('#gold-cap').textContent='/'+c.gold;$('#morale').textContent=game.morale();$('#morale').setAttribute('title','Moral global da fortaleza. Bônus de área aumentam a tolerância das unidades afetadas e reduzem seu limite de motim; não somam à moral global.');$('#morale').classList.toggle('danger-text',game.morale()<10);renderer.canvas.dataset.baseLabel??=renderer.canvas.getAttribute('aria-label');renderer.canvas.setAttribute('aria-label',`Portão: ${s.lives??3} de 3 gemas restantes. ${renderer.canvas.dataset.baseLabel}`);$('#troops').textContent=game.defenders.length;$('#troop-strength').textContent=Math.round(game.defenders.reduce((sum,u)=>sum+u.power,0));$('#troop-strength').title=`Força base: ${Math.round(game.defenders.reduce((sum,u)=>sum+u.power,0))} STR · Força atual com ferimentos: ${Math.round(game.defenders.reduce((sum,u)=>sum+game.effectiveStrength(u),0))} STR · Escudos: ${Math.round(game.defenders.reduce((sum,u)=>sum+u.shield,0)/8)} STR`;$('#turn').textContent=String(s.turn).padStart(2,'0');$('#fortress-name').textContent=s.activePlane!=null?PLANES[s.activePlane].name+' · '+s.name:s.name;$('#phase-label').textContent=eventCards.blocking?'RESOLVENDO EVENTOS':s.status==='won'?'ABISMO CONQUISTADO':s.status==='lost'?'FORTALEZA CAÍDA':s.combat?s.paused?'PAUSA TÁTICA':'COMBATE EM TEMPO REAL':'EXPLORAÇÃO';$('#combat-banner').hidden=!s.combat||eventCards.blocking;$('#combat-banner b').textContent=s.paused?'COMBATE EM PAUSA':'FORTALEZA SOB ATAQUE';$('#pause-combat').innerHTML=icon(s.paused?'play':'pause')+`<span>${s.paused?'Retomar':'Pausar'}</span>`;$('#pause-combat').disabled=!s.combat||eventCards.blocking;$('#game-speed').textContent=s.speed+'×';$('#game-speed').disabled=!s.combat;$('#end-turn').disabled=s.combat||s.status!=='playing'||!!s.effectCards?.length||battlePresentationBusy();$('#end-turn').querySelector('span:nth-child(2)').textContent=selected.y<0?'Encerrar turno':game.room(selected.x,selected.y)?'Escolher direção':'Explorar';$('#end-turn').title=s.combat?'Resolva a batalha antes de explorar.':'Explorar um espaço selecionado (E)';$('#depth-label').textContent=selected.y>0?'PROFUNDIDADE '+selected.y:selected.y<0?'ALTURA '+-selected.y:'SUPERFÍCIE';$('#depth-meter').textContent=String(Math.abs(selected.y)*20).padStart(2,'0')+' M';
 $('#toolbar-hint').innerHTML=icon(s.combat?'sword':'compass')+`<span>${s.combat?`${game.enemies.length} invasores · <b>${s.paused?'retome para continuar':'defesa automática'}</b>`:s.built?'Construção concluída. <b>Explore para avançar.</b>':'Clique em uma <b>seta</b> para explorar ou abrir passagem'}</span>`;
 $('#recent-log').innerHTML=s.log.slice(0,2).map(e=>`<p><time>T. ${e.turn}</time><span>${escape(e.prose??narrativeEntry(e.text,e.narrativeVariant||0))}</span></p>`).join('');$('#objective').innerHTML=s.status==='won'?'O abismo foi conquistado.<br>Sua crônica será lembrada.':s.status==='lost'?'A fortaleza caiu.<br>Uma nova história aguarda.':`Desça à profundidade 12.<br>${s.maxDepth>=12?'Derrote o Guardião do Vazio.':'Reivindique o Cristal do Vazio.'}`;
}
function refresh(){if(!game)return;return game.withQueryCache(refreshPanels)}
function refreshPanels(){updateStats();$$('.panel-tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));const panel=$('#panel-content'),scroll=panel.scrollTop;panel.innerHTML=tab==='room'?roomPanel():tab==='build'?buildPanel():tab==='army'?armyPanel():tradePanel();panel.scrollTop=scroll;updateRoomPortrait();dirty=true}
function directionPanel(origin=null){
 const choices=origin?game.directions(origin):game.directions().filter(d=>d.x===selected.x&&d.y===selected.y);
 if(!choices.length)return '';
 const arrows={'0,-1':'↑','1,0':'→','0,1':'↓','-1,0':'←'},labels={'0,-1':'Norte','1,0':'Leste','0,1':'Sul','-1,0':'Oeste'};
 return `<div class="panel-section"><p class="section-label">DIREÇÕES DISPONÍVEIS</p><p class="empty-hint">Cada seta abre apenas uma passagem. Salas vizinhas continuam separadas até você ligá-las.</p>${choices.map(d=>{const label=labels[`${d.dx},${d.dy}`],from=game.room(d.from.x,d.from.y);return `<button class="panel-action direction-action" data-action="direction" data-from="${d.from.x},${d.from.y}" data-to="${d.x},${d.y}" aria-label="${d.kind==='passage'?'Abrir passagem':'Explorar'} ${label} a partir de ${escape(ROOMS[from.type].name)} (${from.x}, ${from.y})"><b aria-hidden="true">${arrows[`${d.dx},${d.dy}`]}</b> ${d.kind==='passage'?'Abrir passagem':'Explorar'} · ${label}${origin?'':` · de (${from.x}, ${from.y})`}</button>`}).join('')}<p class="inline-note">Abrir uma ligação entre salas conhecidas não compra carta nem cobra recursos; segue o avanço de turno da exploração.</p></div>`;
}
function toolMosaic(tools,mode){return `<div class="tool-mosaic" aria-label="${mode==='defense'?'Defesas e armadilhas':'Infraestrutura básica'}">${tools.map(tool=>{const r=selectedRoom(),d=ROOMS[tool],labels={defensive:['Porta defensiva','shield','10♦ · Bloqueia invasores, tiros, líquidos e gases. Exige Pedraria.'],offensive:['Porta ofensiva','sword','20♦ · Fere quem tenta romper a porta; bloqueia líquidos e gases. Exige Pedraria.'],secret:['Passagem secreta','eye','50♦ · Inimigos ignoram este corredor. Exige Pedraria.'],damage:['Armadilha de dano','trap','20♥ · Causa 10 STR de dano por nível. Exige Forja.'],delay:['Armadilha de atraso','clock','15♥ · Imobiliza o invasor por 2 segundos por nível. Exige Forja.']},info=labels[tool],cost=tool==='rails'?{resources:5,gold:0}:d?game.cost(tool,r||selected):null,title=info?info[0]+' · '+info[2]:d.name+' · '+cost.resources+'♥'+(cost.gold?' · '+cost.gold+'♦':'')+' · '+d.desc+(tool==='rails'?' Exige Forja.':''),iconName=info?.[1]||({rails:'rails',columns:'columns',drawbridge:'drawbridge',elevator:'elevator'}[tool]||d.icon),required=mode==='defense'?(['damage','delay'].includes(tool)?'forge':'masonry'):tool==='rails'?'forge':d.requires?.[0],price=cost||{resources:tool==='damage'?20:tool==='delay'?15:0,gold:tool==='defensive'?10:tool==='offensive'?20:tool==='secret'?50:0},reason=game.engineeringReason(mode,tool,selected.x,selected.y),disabled=!!reason;return `<button class="square-tool" data-action="engineering" data-mode="${mode}" data-arg="${tool}" title="${escape(title+(reason?' · '+reason:' · Disponível: escolher local'))}" aria-label="${escape(title+(reason?' · '+reason:' · Disponível'))}" ${disabled?'disabled':''}>${icon(iconName)}</button>`;}).join('')}</div>`;}
function passageDefensePanel(r){const edges=game.passageDefenses(r);return `<div class="panel-section"><p class="section-label">DEFESAS E PASSAGENS</p><p class="empty-hint">Escolha uma defesa e depois indique sua direção no mapa.</p>${toolMosaic(EDGE_TOOLS,'defense')}${edges.map(({room:n,door})=>{const edge=game.passageKey(r,n),trap=game.s.passageTraps?.[edge],attributes=`data-from="${r.x},${r.y}" data-to="${n.x},${n.y}"`;return door?.hp>0?`<p class="inline-note">${n.x>r.x?'Leste':n.x<r.x?'Oeste':n.y>r.y?'Sul':'Norte'} · Porta Nv. ${door.level}</p><button class="panel-action" data-action="upgrade-passage" ${attributes} ${game.s.combat||door.level>=3?'disabled':''}>Aprimorar porta · 10♥</button>`:trap?`<p class="inline-note">Armadilha Nv. ${trap.level}</p><button class="panel-action" data-action="upgrade-edge" ${attributes} ${game.s.combat||trap.level>=(game.s.discoveredInventions?.includes(12)?4:3)?'disabled':''}>Aprimorar armadilha · 20♥</button>`:'';}).join('')}</div>`;}
const actionButton=(text,action,arg='',disabled=false)=>`<button class="panel-action" data-action="${action}" ${arg?`data-arg="${escape(arg)}"`:''} ${disabled?'disabled':''}>${text}</button>`;
function roomPanel(){
 const r=selectedRoom(),s=game.s;
 if(!r){return `<div class="room-content"><div class="room-label"><span>TERRA INCOGNITA</span><span>${selected.x} / ${selected.y}</span></div><div class="room-portrait">${icon('compass')}</div><h3 class="room-title">O desconhecido</h3><p class="room-description">Sob a rocha, uma nova história aguarda. Compre uma carta para revelar o que se esconde aqui.</p><div class="room-stat"><span>Profundidade</span><b>${Math.max(0,selected.y)}</b></div><div class="room-stat"><span>Ameaça</span><b>${selected.y<=1?'Protegida':selected.y<5?'Crescente':'Elevada'}</b></div>${directionPanel()}<div class="panel-section"><p class="section-label">O BARALHO DECIDE</p><p class="empty-hint"><span class="heart">♥</span> Recursos para construir<br><span class="gold">♦</span> Riquezas para recrutar<br>♣ Formações naturais<br>♠ Ruínas e inimigos</p><p class="empty-hint">Explorar inicia um novo turno após a primeira descoberta. Construa e recrute antes de descer.</p></div></div>`}
 if(r.type==='surface')return `<div class="room-content"><div class="room-label"><span>SUPERFÍCIE · CONSTRUÇÃO DIRETA</span><span>${r.x} / ${r.y}</span></div><h3 class="room-title">Acima da montanha</h3><p class="room-description">Este terreno não precisa ser explorado. Construa diretamente, sem comprar cartas. Cada andar acrescenta sua altura ao custo em ♥.</p><div class="room-stat"><span>Apoio estrutural</span><b class="${game.surfaceReason(r)?'danger-text':'good-text'}">${r.y===-1?'Linha do chão':game.room(r.x,r.y+1)?'Sala abaixo':'Sem apoio'}</b></div><p class="inline-note">${escape(game.surfaceReason(r)||'Pronto para receber uma construção conectada à fortaleza.')}</p>${actionButton(icon('hammer')+'Escolher construção','tab','build',!!game.surfaceReason(r)||s.combat)}${actionButton(icon('clock')+'Encerrar turno','next-turn','',s.combat)}</div>`;
 const root=(r.builtPartOf&&game.s.rooms[r.builtPartOf])||bossRoomRoot(game,r);let d=root&&root!==r?{...ROOMS[r.type],name:ROOMS[root.type].name+' · continuação',desc:'Este espaço continua o mesmo covil. A criatura e as ações especiais ficam na sala principal.'}:r.displayName?{...ROOMS[r.type],name:r.displayName,desc:r.specialDescription||ROOMS[r.type].desc}:ROOMS[r.type];const units=game.s.units.filter(u=>u.hp>0&&u.home===key(r.x,r.y)&&u.team==='ally');const connected=game.active(r);let actions='';for(const u of units.filter(u=>u.heroClass))actions+=`<p class="inline-note"><strong>${escape(u.enemyName)} · ${Math.round(u.power)} STR</strong><br>${escape(ADVENTURER_POWERS[u.heroClass-1])}</p>`;
 if(r.type==='crater'){d={...d,desc:r.craterPart==='dry'?'Chaminé seca aberta até a superfície. Este trecho vazio não origina alagamento de magma.':r.craterPart==='wet'?'Poço preenchido por magma indrenável, que pode alagar salas vizinhas através das passagens.':'A cratera está cheia de magma até a metade. Ela se expande para cima e para baixo até a superfície ou alguma sala existente, sem substituí-la.'};}
 if(game.s.activePlane!=null&&r.type==='gate')actions+=actionButton(icon('portal')+'Retornar à fortaleza','room-action','returnPlane',s.combat);
 if(r.type==='void'&&r.guardianRetry)actions+=actionButton(icon('sword')+'Desafiar o guardião novamente','room-action','challengeVoid',s.combat);
 if(r.type==='drawbridge')actions+=actionButton(icon('bridge')+(r.closed?'Abrir ponte':'Fechar ponte'),'room-action','toggle');
 if(r.damaged)actions+=actionButton(icon('hammer')+'Reparar sala · metade do custo','room-action','repair',s.combat);
 if(game.fluidSource(r))actions+='<p class="inline-note">Fonte permanente de líquido: não pode ser drenada. Construa uma ponte para atravessar.</p>';
 if(game.roomHazards(r).length&&!game.fluidSource(r))actions+=actionButton(icon('water')+`Drenar · ${game.roomHazards(r).some(h=>['lava','crater'].includes(h))?20:5}♦`,'room-action','drain',s.combat);
 if(['well','ancienttemple','sealed','ritual','chaos'].includes(r.type))actions+=actionButton(icon('spark')+(r.type==='well'?'Fazer um desejo · 10♦':r.type==='sealed'?'Abrir câmara selada':'Invocar magia'),'room-action','magic',s.combat);
 if(game.blockedByImmortal(r))actions+='<p class="warning-note">∞ Criatura imortal: imóvel e pacífica. Bloqueia a passagem e só morre por efeitos de morte instantânea, como líquidos ou explosões.</p>';
 if(r.type==='golemforge'&&game.s.units.some(u=>u.id===r.golemId&&u.team==='neutral'&&u.hp>0))actions+='<p class="inline-note">O guardião permanece passivo até ser desafiado.</p>'+actionButton(icon('sword')+'Atacar golem','room-action','attackGolem',s.combat);
 if(['portal','stabilizer','crypt','ancienttemple','ritual','altar','temple'].includes(r.type)&&game.active(r))actions+=actionButton(icon('cross')+'Instalar clérigo nesta sala','room-action','stationCleric',s.combat);
 if(r.type==='persuasion')actions+=`<p class="inline-note">${r.captive?'O ocupante será interrogado automaticamente ao final do turno e dispensado após o resultado.':'Sala livre para captura ou transferência de uma Solitária.'}</p>`+actionButton(icon('eye')+'Transferir da Solitária','room-action','transferPrisoner',s.combat||!!r.captive||!game.riseChoices({input:{kind:'rise',action:'transferPrisoner',x:r.x,y:r.y}}).length);
 if(r.type==='hiring')actions+=actionButton(icon('eye')+'Contratar prisioneiro','room-action','hire',s.combat||r.riseUsed===s.turn);
 if(r.type==='altar')actions+='<p class="inline-note">Dedicação: '+({fortune:'Fortuna',guardian:'Guardião',devourer:'Devorador'}[r.dedication||'fortune'])+'. Requer clérigo.</p>'+(r.dedication==='devourer'?actionButton(icon('spark')+'Sacrificar unidade · −5 moral','room-action','sacrifice',s.combat||r.riseUsed===s.turn):'');
 if(r.type==='labyrinth'&&!r.mapped)actions+=actionButton(icon('eye')+'Mapear · 25% de sucesso; falha mata o explorador','room-action','mapLabyrinth',s.combat);
 if(game.territorialGuard(r)){actions+=actionButton(icon('sword')+'Atacar guardiões','room-action','provoke',s.combat);if(r.type==='hungry')actions+=actionButton(icon('paw')+'Alimentar · sacrificar unidade; +20 STR','room-action','feed',s.combat)+actionButton(icon('paw')+'Domesticar · 25% de sucesso','room-action','tame',s.combat);if(r.type==='challenge')actions+=actionButton(icon('flag')+'Enviar desafiante · falha mata a unidade','room-action','champion',s.combat);}
 if(r.type==='ancientprison')actions+=actionButton(icon('bars')+'Libertar criatura','room-action','release',s.combat);
 if(r.type==='dragon'&&!r.dragonAwake)actions+=actionButton(icon('gem')+'Roubar tesouro · +20♦','room-action','steal',s.combat);
 if(['portal','stabilizer'].includes(r.type))actions+=actionButton(icon('portal')+'Selar portal · 20♦ + sacrificar clérigo','room-action','closePortal',s.combat);
 if(r.type==='stabilizer')actions+=actionButton(icon('portal')+'Viajar entre planos','planes','',s.combat);
 if(r.type==='temple'&&r.dedication==='protector')actions+=actionButton(icon('shield')+'Abençoar defensor · 5♦','room-action','shield',s.combat);
 if(r.legendary&&!r.legendary.destroyed&&!r.legendary.sold){for(const [trait,action,label]of [[3,'artifact-luck','Configurar sorte'],[5,'artifact-sell','Vender artefato · 300♦'],[9,'artifact-purpose','Copiar função de sala'],[10,'artifact-create','Criar floresta'],[11,'artifact-banish','Banir monstruosidade · 100♦']])if(r.legendary.traits.includes(trait))actions+=actionButton(icon('spark')+label,'room-action',action);}
 if(r.wyrdId===9)actions+=actionButton(icon('paw')+'Contratar homem-toupeira · 10♦','room-action','mole',s.combat);
 if(r.wyrdId===10&&!r.excavated)actions+=actionButton(icon('hammer')+'Libertar anão cristalizado','room-action','excavate',s.combat);
 if(r.wyrdId===11)actions+=actionButton(icon('eye')+'Consultar sábio · 5♦','room-action','peek',s.combat);
 if(r.type==='endersgate')actions+=actionButton(icon('skull')+'Ativar Portão de Ender','room-action','ender',!s.combat);
 if(r.type==='tomb'&&!r.tombOpened)actions+=actionButton(icon('trap')+'Abrir tumba','room-action','tomb');
 if(r.type==='tavern'&&!game.allies.some(u=>u.heroClass&&u.home===key(r.x,r.y)))actions+=actionButton(icon('mug')+'Atrair novo aventureiro · 10♦','room-action','tavernFestival',game.s.combat||game.s.gold<10);
 if(game.territorialGuard(r)&&game.allies.some(u=>u.heroClass===6))actions+=actionButton(icon('paw')+'Domesticar com Druida','room-action','druid');
 if(r.type==='treasury')actions+=actionButton(icon('skull')+'Contratar dragão · manter 500♦ em reservas','room-action','hireDragon',s.combat||s.gold<500);
 if(r.type==='breeder'&&r.breedingParent)actions+=actionButton(icon('paw')+'Gerar cria · 15♦','room-action','breedOffspring',s.combat);
 if(r.type==='breeder')actions+=actionButton(icon('paw')+'Escolher matriz de criação','room-action','breed');
 if(game.territorialGuard(r)&&game.s.discoveredInventions?.includes(4))actions+=actionButton(icon('paw')+'Acalmar com feromônios · 30♦','room-action','calm');
 if((r.type==='rails'||r.transport==='rails')&&game.s.discoveredInventions?.includes(8))actions+=actionButton(icon('target')+'Lançar carrinho armado · 10♥','room-action','minecart',!s.combat);
 if(r.summoningCircle)actions+=actionButton(icon('spark')+'Invocar unidade','room-action','summon');
 if(r.fleetForest)actions+=actionButton(icon('tree')+'Colher vegetação · 20♥','room-action','harvest');
 if(r.catPortal)actions+=actionButton(icon('paw')+'Consultar Gatomante · 5♦','room-action','cat');

 if(r.type==='pump')actions+=actionButton(icon('water')+(r.pumpOpen?'Fechar bomba':'Abrir válvula'),'room-action','pump');
 if(r.type==='artificer')actions+=actionButton(icon('flask')+'Criar invenção · 50♦','room-action','invention',s.combat);
 const canBuild=r.type==='dragon'&&r.dragonAwake||['smalllair','largelair','burrow','wandering','elemental','hive','hungry','artifact','desolate','shaft','rivalmine','city','tomb','challenge','rivalhold','cave','forest','nest','ruins','mine','crystal','mushrooms','springs','fairy','vault','columns','mud','labyrinth','ancientlibrary','ancienttemple','water','lava','crater','gas','flammable','miasma','blindgas','portal'].includes(r.type);
 if(canBuild&&!r.damaged&&!game.territorialGuard(r))actions+=actionButton(icon('hammer')+'Construir aqui','tab','build',s.combat||s.built);
 if(game.isHousing(r))actions+=actionButton(icon('sword')+'Recrutar defensores','tab','army',s.combat);
 const groups=new Map();for(const u of units)groups.set(u.type,(groups.get(u.type)||0)+1);
 return `<div class="room-content"><div class="room-label"><span>${r.type==='gate'?'O ÚLTIMO REDUTO':ROOMS[r.type].r!==undefined?'SALA DA FORTALEZA':'DESCOBERTA'}</span><span>${r.x} / ${r.y}</span></div><div class="room-portrait"><img src="${embeddedAssets[`rooms/${r.type}-${r.variant}.png`]}" alt="${escape(d.name)}, ilustração ${r.variant+1}"></div><h3 class="room-title">${escape(d.name)}</h3><p class="room-description">${escape(d.desc)}</p>${['portal','stabilizer'].includes(r.type)?`<p class="inline-note">Invasão: 25% por turno.${r.portalRoll?' Última rolagem: '+r.portalRoll+'/4 · '+(r.portalRoll===1?'invasão':'sem invasão')+'.':''}</p>`:''}${r.type==='dragon'?`<p class="inline-note">${r.dragonAwake?'Dragão desperto · restam apenas as ruínas do palácio.':'Dragão dormindo sobre o tesouro.'}</p>`:''}${(s.rivalDungeons||[]).filter(group=>group.members.includes(key(r.x,r.y))).map(group=>`<p class="inline-note">Masmorra rival · ${group.members.length} salas · ${group.forfeited?'Invasores expulsos · sem espólios':group.claimed?(group.fought?'Conquistada':'Sem combate'):group.members.length*10+'♦ após a vitória'}</p>`).join('')}<div class="room-stat"><span>Camada</span><b>${LAYER_STYLES[r.worldLayer||0].name}</b></div><div class="room-stat"><span>Estado</span><b class="${r.damaged?'danger-text':''}">${r.type==='collapse'?'Escombros permanentes':r.damaged?'Danificada':r.closed?'Ponte fechada':'<i class="status-dot"></i>Intacta'}</b></div><div class="room-stat"><span>Conexão</span><b>${game.blockedByImmortal(r)?'Bloqueada · criatura imortal':game.guardedGolem(r)?'Bloqueada · guardião da forja':game.territorialGuard(r)?'Bloqueada · guardiões territoriais':r.type==='labyrinth'&&!r.mapped?'Bloqueada · labirinto não mapeado':game.roomHazards(r).length?'Inutilizável · perigo':connected?'Conectada':'Desconectada'}</b></div>${r.type==='kennel'?`<p class="inline-note">Captura: ${game.captureRoomAvailable(r)?'uma criatura pode ser escolhida após a próxima vitória':'substitua o monstro atual na próxima captura'}. Monstros capturados mantêm espécie e força e tornam-se aliados leais.</p>`:''}${r.type==='sewer'?`<p class="inline-note">Ratos são guarnição local: permanecem neste esgoto e não entram na força móvel da fortaleza.</p>`:''}${game.isHousing(r)?`<div class="room-stat"><span>Alojamento</span><b>${units.length} / ${game.capacity(r)}</b></div>${game.comfort(r)?`<div class="room-stat"><span>Força / conforto</span><b>${Math.round(units.reduce((sum,u)=>sum+u.power,0))} / ${game.comfort(r).limit} STR</b></div>`:''}`:''}${units.length?`<p class="inline-note">Tolerância no abrigo: +${game.localTolerance({type:units[0].type},r)}. O bônus só afeta unidades dentro do alcance; cada limite de motim considera a posição atual da unidade.</p>`:''}${game.campFor(r)?`<p class="warning-note">Controle inimigo · ${game.campFor(r).rooms.length} salas · ${game.campFor(r).units.length} tropas acampadas · Reserva: ${Math.round(game.campFor(r).resources*100)/100} recursos. Reconecte e vença a guarnição para recuperar a área.</p>`:''}${r.prisoners?`<div class="room-stat"><span>${r.type==='persuasion'?'Prisioneiro para interrogatório':'Prisioneiros'}</span><b>${r.type==='prison'?r.prisoners+' / 20'+(r.captive?' · '+escape(r.captive.name):''):r.captive?escape(r.captive.name)+' · '+Math.round(r.captive.power)+' STR':r.prisoners}</b></div>`:''}${r.trap?`<div class="room-stat"><span>Armadilha ${r.trap.kind==='damage'?'de dano':'de atraso'}</span><b>Nv. ${r.trap.level} · ${r.trap.armed?'armada':'disparada'}</b></div>`:''}${game.roomHazards(r).length?`<p class="warning-note">Perigo nesta sala: ${escape(ROOMS[r.contaminant]?.name||'contaminação')}. ${game.fluidSource(r)?'Fonte permanente: construa uma ponte para atravessar.':'Drene a sala para usá-la novamente.'}</p>`:''}<div class="room-actions">${actions}</div>${directionPanel(r)}${passageDefensePanel(r)}${units.length?`<div class="panel-section"><p class="section-label">GUARNIÇÃO</p>${[...groups].map(([t,n])=>`<div class="occupant"><div class="occupant-icon"><img class="unit-preview" src="${embeddedAssets[`sprites/${t}.png`]}" alt=""></div><div class="occupant-name">${escape(UNITS[t]?.name||ENEMIES[t]?.name||t)}<small>${units.filter(u=>u.type===t&&u.loyal).length===n?'Lealdade inabalável':'Atenção ao limite de motim'}</small></div><span>×${n}</span></div>`).join('')}</div>`:''}</div>`;
}
function buildPanel(){if(category==='Pesquisas')return researchPanel();const r=selectedRoom();return `<h3 class="panel-heading">Arquitetura do reino</h3><p class="inline-note">${game.researchState().intel} informação(ões) · Desbloqueie novos projetos em <b>Pesquisas</b>.</p><p class="inline-note">${game.s.built?'Uma sala já foi construída neste turno. Explore ou encerre o turno para avançar.':r?`Construir em: ${escape(ROOMS[r.type].name)} (${r.x}, ${r.y}).`:'Selecione primeiro uma caverna explorada.'}</p><div class="category-select">${[...BUILD_GROUPS,'Pesquisas'].map(c=>`<button data-action="category" data-arg="${c}" class="${category===c?'active':''}">${c}</button>`).join('')}</div>${actionButton(icon('clock')+'Encerrar turno','next-turn','',game.s.combat)}${category==='Infraestrutura'?toolMosaic(INFRASTRUCTURE,'infrastructure'):''}${BUILDABLE.filter(t=>ROOMS[t].group===category&&!(category==='Infraestrutura'&&INFRASTRUCTURE.includes(t))).map(t=>{const d=ROOMS[t],reason=game.buildReason(t,r),cost=game.cost(t,r||selected);return `<button class="catalog-card ${reason?'unavailable':'available'}" data-action="build" data-arg="${t}" title="${escape(d.desc+(reason?' '+reason:''))}" aria-label="Construir ${escape(d.name)}. ${cost.resources} recursos e ${cost.gold} riquezas. ${escape(reason||'Disponível')}"><span class="catalog-icon">${icon(d.icon)}</span><span class="card-copy"><strong>${d.name}</strong><small>${cost.resources}♥${cost.gold?' · '+cost.gold+'♦':''}${d.footprint?' · '+d.footprint+' espaços':''}</small><span class="reason">${escape(reason||d.desc)}</span></span><span class="catalog-add">+</span></button>`}).join('')}`}
function researchPanel(){const state=game.researchState();return `<h3 class="panel-heading">Conhecimento do abismo</h3><p class="inline-note">${state.intel} informação(ões) disponíveis. Interrogatórios bem-sucedidos na Sala de Persuasão concedem 1 informação, além do efeito da carta. Tier 0 começa liberado. Para avançar de tier, pesquise um projeto do tier anterior.</p><div class="category-select">${[...BUILD_GROUPS,'Pesquisas'].map(c=>`<button data-action="category" data-arg="${c}" class="${category===c?'active':''}">${c}</button>`).join('')}</div>${[1,2,3].map(tier=>`<div class="panel-section"><p class="section-label">TIER ${tier} · ${tier} INFORMAÇÃO(ÕES) POR PROJETO</p>${RESEARCH_PROJECTS.filter(p=>p.tier===tier).map(p=>{const reason=game.researchReason(p.id),done=state.unlocked.includes(p.id);return `<button class="catalog-card ${reason?'unavailable':'available'}" data-action="research" data-arg="${p.id}" ${reason?'disabled':''}><span class="catalog-icon">${icon(done?'check':'book')}</span><span class="card-copy"><strong>${escape(p.name)}</strong><small>${p.rooms.map(t=>escape(ROOMS[t].name)+' · T'+BUILD_TIERS[t]).join(' + ')||'Defesa de corredor'}</small><span class="reason">${escape(done?'Desbloqueado':reason||'Pesquisar · '+tier+' informação(ões)')}</span></span></button>`;}).join('')}</div>`).join('')}`;}
function armyPanel(){const count=game.defenders.length,power=Math.round(game.defenders.reduce((n,u)=>n+u.power,0));return `<h3 class="panel-heading">Os que defendem</h3><p class="inline-note">A força móvel atua por IA e se divide entre frentes conforme força e distância. Ratos ficam nos esgotos e não entram neste total. Recrute nos abrigos apropriados antes de explorar. Alojamento compartilhado entre os tipos da sala.</p><div class="army-summary"><div><b>${count}</b><small>UNIDADES</small></div><div><b>${power}</b><small>FORÇA</small></div><div><b>${game.morale()}</b><small>MORAL</small></div></div>${Object.entries(UNITS).filter(([t,d])=>t!=='hero'&&d.recruitable!==false).map(([t,d])=>{const homes=game.housing(t),n=game.allies.filter(u=>u.type===t).length,home=game.isHousing(selectedRoom())?key(selected.x,selected.y):null,blocked=game.recruitmentReason(t,home),threshold=d.mutiny===0?0:(home?game.threshold({type:t},selectedRoom()):homes.length?Math.min(...homes.map(r=>game.threshold({type:t},r))):game.threshold({type:t})),mutiny=blocked.startsWith('Moral insuficiente'),reason=blocked||`Motim < ${d.mutiny===0?'nunca':threshold} · ${d.range>0.5?'Ataque à distância':'Corpo a corpo'}`;return `<button class="catalog-card ${mutiny?'mutiny-blocked':blocked?'unavailable':'available'}" data-action="recruit" data-arg="${t}" ${blocked?'disabled':''} aria-disabled="${!!blocked}" title="${escape(d.desc)} ${d.mutiny?'Moral abaixo de '+threshold+' causa motim.':''}"><span class="catalog-icon"><img class="unit-preview" src="${embeddedAssets[`sprites/${t}.png`]}" alt=""></span><span class="card-copy"><strong>${d.name}${n?` <span class="gold">×${n}</span>`:''}</strong><small>${game.recruitCost(t)}♦ · ${game.recruitPower(t)} STR · motim ${d.mutiny===0?'nunca':threshold}</small><span class="reason">${reason}</span></span><span class="catalog-add">+</span></button>`}).join('')}<div class="panel-section"><p class="section-label">MANTER A LEALDADE</p><p class="empty-hint">Unidades iniciais e aventureiros são leais. Recrutados comuns se rebelam quando a moral fica abaixo de seu limite.</p>${actionButton(icon('mug')+'Organizar festival · 10♦','festival','',game.s.combat||game.s.gold<10)}</div>`}
function tradePanel(){return `<h3 class="panel-heading">O preço do progresso</h3><p class="inline-note">Uma troca por turno. O volume respeita os limites de armazenamento. A quantidade indica quantas riquezas trocar.</p><div class="trade-card"><div class="trade-symbols">1♦ <span>→</span> <b data-trade-output="resources">2♥</b></div><p>Transforme riquezas em recursos</p><input id="trade-gold-amount" type="number" min="1" max="10000" value="5" aria-label="Riquezas para converter em recursos"><button class="primary" data-action="trade" data-arg="gold" ${game.s.traded||game.s.combat?'disabled':''}>Trocar</button></div><div class="trade-card"><div class="trade-symbols">${game.s.transmutation?'1♥':'2♥'} <span>→</span> <b data-trade-output="gold">${game.s.transmutation?'3♦':'1♦'}</b></div><p>Transforme recursos em riquezas</p><input id="trade-resources-amount" type="number" min="1" max="10000" value="5" aria-label="Riquezas para receber em troca de recursos"><button class="primary" data-action="trade" data-arg="resources" ${game.s.traded||game.s.combat?'disabled':''}>Trocar</button></div>${game.s.traded?'<p class="warning-note">Troca já realizada neste turno. Explore para negociar novamente.</p>':''}<div class="panel-section"><p class="section-label">SUA CAPACIDADE</p><div class="room-stat"><span>Recursos</span><b>${game.s.resources} / ${game.capacities().resources}♥</b></div><div class="room-stat"><span>Riquezas</span><b>${game.s.gold} / ${game.capacities().gold}♦</b></div><p class="empty-hint" style="margin-top:15px">Construa Armazéns e Tesourarias para acumular reservas maiores. A fortaleza produz ao iniciar uma nova exploração.</p></div>`}
function act(result,sfx='click'){if(!result?.ok){toast(result?.reason||'Ação indisponível.');return}sound.play(sfx);refresh();save('auto',true)}
function battlePresentationBusy(){return !!game&&(renderer.transitioning(game,performance.now())||game.events.some(e=>['life-lost','return-home','void-defeat'].includes(e.type)))}
function exploreDirection(d){
 if(!game)return;if(game.s.effectCards?.length||battlePresentationBusy()){toast('Resolva as cartas de evento antes de explorar.');return}const result=d.kind==='passage'?game.openPassage(d.from,d):game.explore(d.x,d.y,d.from);
 if(result.ok&&!result.pending){selected={x:d.x,y:d.y};renderer.selected=selected;renderer.focus(selected);tab='room';let card=null;if(result.card&&settings.cards)card=showCard(result.card,result.room);resourceFlights.collect(game,card)}
 act(result,result.card?'explore':'build');
}
function explore(){
 if(!game||game.s.combat)return;if(game.s.effectCards?.length||battlePresentationBusy()){toast('Resolva as cartas de evento antes de explorar.');return}if(selected.y<0){act(game.advanceTurn());return}
 const choices=game.directions().filter(d=>d.x===selected.x&&d.y===selected.y&&d.kind==='explore');
 if(!game.room(selected.x,selected.y)&&choices.length===1){exploreDirection(choices[0]);return}
 tab='room';refresh();toast('Escolha uma seta no mapa ou uma direção no painel da sala.');
}
function showCard(card,room){document.querySelector('.discovery-card')?.remove();const el=document.createElement('div');el.className='discovery-card '+(['♥','♦'].includes(card.suit)?'red':'');el.innerHTML=`<div class="card-rank">${['A',2,3,4,5,6,7,8,9,10,'J','Q','K'][card.rank-1]||'★'}${card.bonus?`<sup>${card.bonus>0?'+':''}${card.bonus}</sup>`:''}</div><div class="card-suit">${card.suit}</div><div class="card-name">${ROOMS[room.type].name}</div><div class="card-caption">PROFUNDIDADE ${Math.max(0,room.y)}</div>`;document.body.append(el);setTimeout(()=>el.remove(),settings.reduced?900:2450);return el}
$('#panel-content').addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b||!game)return;const a=b.dataset.action,arg=b.dataset.arg;if((game.s.effectCards?.length||battlePresentationBusy())&&!['tab','category'].includes(a)){toast('Resolva as cartas de evento antes de continuar.');return}if(a==='tab'){tab=arg;refresh();return}if(a==='research'){act(game.researchProject(arg),'build');return}if(a==='category'){category=arg;refresh();$('#panel-content').scrollTop=0;return}if(a==='direction'){const [fx,fy]=b.dataset.from.split(',').map(Number),[x,y]=b.dataset.to.split(',').map(Number);const d=game.directions().find(d=>d.x===x&&d.y===y&&d.from.x===fx&&d.from.y===fy);if(d)exploreDirection(d);else toast('Direção indisponível. Selecione novamente a sala.');return}if(a==='explore'){explore();return}if(a==='next-turn'){act(game.advanceTurn());return}if(a==='build'){act(game.build(arg,selected.x,selected.y),'build');if(game.s.built)tab='room';refresh();return}if(a==='recruit'){act(game.recruit(arg,selectedRoom()?key(selected.x,selected.y):null),'build');return}if(a==='trade'){const n=Number($(arg==='gold'?'#trade-gold-amount':'#trade-resources-amount').value);const result=game.trade(arg,n);const source=document.querySelector(`[data-trade-output="${arg==='gold'?'resources':'gold'}"]`);if(result.ok){for(const e of game.events)if(e.type==='resource-gain')e.originElement=source;resourceFlights.collect(game,source);}act(result,'save');return}if(a==='engineering'){act(game.requestEngineering(b.dataset.mode,arg,selected.x,selected.y),'click');return}if(a==='upgrade-edge'){const [fx,fy]=b.dataset.from.split(',').map(Number),[tx,ty]=b.dataset.to.split(',').map(Number);act(game.upgradeEdge(game.room(fx,fy),game.room(tx,ty)),'build');return}if(a==='room-action'){act(game.action(arg,selected.x,selected.y),'build');return}if(a==='fortify-passage'||a==='upgrade-passage'){const [fx,fy]=b.dataset.from.split(',').map(Number),[tx,ty]=b.dataset.to.split(',').map(Number),from=game.room(fx,fy),to=game.room(tx,ty);act(a==='fortify-passage'?game.fortifyPassage(from,to,arg):game.upgradePassage(from,to),'build');return}if(a==='defense'){act(game.action('defense',selected.x,selected.y,arg),'build');return}if(a==='festival'){act(game.action('festival',0,0),'victory');return}if(a==='planes'){planes();return}});
$$('.panel-tab').forEach(b=>b.addEventListener('click',()=>{tab=b.dataset.tab;refresh();$('#panel-content').scrollTop=0;sound.play('click')}));
function modal(html,wide=false,{pause=true}={}){if(!$('#modal-root').firstChild){previousFocus=document.activeElement;if(game?.s.combat&&pause){modalPaused=game.s.paused;game.s.paused=true}}$('#modal-root').innerHTML=`<div class="modal-backdrop"><section class="modal ${wide?'wide':''}" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button class="modal-close" data-modal="close" aria-label="Fechar">${icon('close')}</button>${html}</section></div>`;requestAnimationFrame(()=>$('#modal-root').querySelector('input,button,select')?.focus());updateStats()}
function closeModal(){const root=$('#modal-root');root.innerHTML='';if(game?.s.combat&&modalPaused!==null)game.s.paused=modalPaused;modalPaused=null;if(previousFocus?.isConnected)previousFocus.focus();previousFocus=null;updateStats()}
function newGameDialog(){newDifficulty='normal';modal(`<span class="eyebrow">UMA NOVA CRÔNICA</span><h2 id="modal-title">Toda fortaleza começa<br>com uma ambição.</h2><p>Erga seu domínio sob a montanha. Prepare suas defesas, explore o desconhecido e conquiste o Cristal do Vazio.</p><form id="new-game-form"><label for="fortress-input">Nome da fortaleza</label><input type="text" id="fortress-input" maxlength="40" value="A Última Fortaleza" autocomplete="off" required><label for="seed-input">Semente do mundo <span style="opacity:.5">· opcional</span></label><input type="text" id="seed-input" maxlength="32" placeholder="Deixe em branco para uma nova história"><label>Escolha seu desafio</label><div class="difficulty-cards">${Object.entries(DIFFICULTIES).map(([k,d])=>`<button type="button" class="difficulty-card ${k==='normal'?'selected':''}" data-modal="difficulty" data-arg="${k}" title="${d.desc}">${icon(k==='story'?'book':k==='normal'?'shield':'skull')}${d.name}<small>${k==='story'?'Contemplativo':k==='normal'?'Equilibrado':'Implacável'}</small></button>`).join('')}</div><p id="difficulty-description" class="inline-note" style="margin-top:12px">${DIFFICULTIES.normal.desc}</p><details><summary>Camadas e runas opcionais</summary><label><input type="checkbox" id="challenge-layers"> Ativar camadas do mundo</label>${Object.entries(BLOODRUNES).map(([key,name])=>`<label><input type="checkbox" name="challenge-rune" value="${key}"> Runa: ${name}</label>`).join('')}</details>${game?'<p class="warning-note">Uma nova jornada substituirá o salvamento automático. Use os espaços manuais ou exporte a jornada atual para preservá-la.</p>':''}<button type="submit" class="primary">${icon('gate')}Fundar fortaleza<span>→</span></button></form>`)}
$('#modal-root').addEventListener('submit',e=>{if(e.target.id==='new-game-form'){e.preventDefault();const name=$('#fortress-input').value.trim()||'A Última Fortaleza',seedText=$('#seed-input').value.trim();let seed=Date.now();if(seedText){seed=2166136261;for(const c of seedText){seed^=c.charCodeAt(0);seed=Math.imul(seed,16777619)}seed>>>=0}startGame({name,seed,difficulty:newDifficulty,challengeOptions:{layers:!!$('#challenge-layers')?.checked,runes:[...document.querySelectorAll('[name=challenge-rune]:checked')].map(el=>el.value)}})}});
function pauseMenu(){if(!game)return;modal(`<span class="eyebrow">${escape(game.s.name)}</span><h2 id="modal-title">Um respiro na escuridão.</h2><p>Turno ${game.s.turn} · Profundidade ${game.s.maxDepth} · ${game.defenders.length} defensores</p><div class="button-stack"><button class="primary" data-modal="close">${icon('play')}Retomar jornada</button><button data-modal="save">${icon('save')}Salvar jogo</button><button data-modal="load">${icon('load')}Carregar jogo</button><button data-modal="export-fortress">${icon('download')}Exportar imagem</button><button data-modal="journal">${icon('book')}Ler crônica</button><button data-modal="options">${icon('settings')}Opções</button><button data-modal="help">${icon('book')}Como jogar</button><button data-modal="new">${icon('plus')}Nova fortaleza</button><button data-modal="title">${icon('exit')}Salvar e voltar ao início</button></div>`)}
function options(){modal(`<span class="eyebrow">AJUSTE SUA EXPERIÊNCIA</span><h2 id="modal-title">Opções</h2><div class="option-row"><label for="option-sound">Efeitos sonoros<small>Sons sintetizados localmente, sem downloads.</small></label><input id="option-sound" data-setting="sound" type="checkbox" ${settings.sound?'checked':''}></div><div class="option-row"><label for="option-volume">Volume</label><input id="option-volume" data-setting="volume" type="range" min="0" max="1" step="0.05" value="${settings.volume}"></div><div class="option-row"><label for="option-reduced">Reduzir movimento<small>Limita efeitos visuais e animações decorativas.</small></label><input id="option-reduced" data-setting="reduced" type="checkbox" ${settings.reduced?'checked':''}></div><div class="option-row"><label for="option-pause">Pausar ao sair da janela<small>Protege a fortaleza ao alternar aplicativos.</small></label><input id="option-pause" data-setting="autoPause" type="checkbox" ${settings.autoPause?'checked':''}></div><div class="option-row"><label for="option-cards">Revelação de cartas<small>Mostra a carta ao explorar um espaço.</small></label><input id="option-cards" data-setting="cards" type="checkbox" ${settings.cards?'checked':''}></div><div class="modal-rule"></div><p class="inline-note">Configurações salvas neste dispositivo. O jogo funciona offline após o primeiro carregamento completo da versão instalada. Não há contas, anúncios ou telemetria.</p><button data-modal="close" class="primary">Concluir</button>`)}
$('#modal-root').addEventListener('input',e=>{const k=e.target.dataset.setting;if(!k)return;settings[k]=e.target.type==='checkbox'?e.target.checked:Number(e.target.value);applySettings();sound.resume();if(k==='volume')sound.play('click')});
function slots(mode='load'){modal(`<span class="eyebrow">PRESERVE SUA CRÔNICA</span><h2 id="modal-title">${mode==='save'?'Salvar jornada':'Carregar jornada'}</h2><p>Três espaços manuais e um salvamento automático. Salve em arquivo para transferir entre PC e mobile.</p>${['auto','1','2','3'].map(slot=>{let g=null;try{const raw=stored(slot);if(raw)g=Game.restore(raw)}catch{}const title=slot==='auto'?'Automático':'Espaço '+slot;return `<div class="save-slot"><div class="slot-copy"><span class="eyebrow">${title}</span><strong>${g?escape(g.s.name):'Espaço vazio'}</strong><small>${g?`Turno ${g.s.turn} · Prof. ${g.s.maxDepth} · ${g.s.status==='won'?'Conquistada':g.s.status==='lost'?'Derrotada':g.s.combat?'Em combate':'Em exploração'}`:'Nenhuma crônica registrada'}</small></div><div class="slot-buttons">${mode==='save'&&slot!=='auto'?`<button class="icon-button" title="${g?'Substituir':'Salvar em'} ${title}" aria-label="Salvar em ${title}" data-modal="slot-save" data-arg="${slot}">${icon('save')}</button>`:''}${g?`<button class="icon-button" title="Carregar ${title}" aria-label="Carregar ${title}" data-modal="slot-load" data-arg="${slot}">${icon('play')}</button>`:''}</div></div>`}).join('')}<div class="file-actions"><button class="secondary" data-modal="export" ${!game?'disabled':''}>${icon('download')}Exportar jogo</button><button class="secondary" data-modal="import">${icon('load')}Importar arquivo</button></div><p class="warning-note">Dados locais podem ser apagados pelo navegador. Exporte suas jornadas importantes. Importações são verificadas antes de substituir a partida.</p>`)}
async function exportFortress(){
 if(!game)return;try{
  await renderer.loading;
  const canvas=renderer.exportCanvas(),blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('Não foi possível gerar a imagem.');
  const url=URL.createObjectURL(blob);modal(`<span class="eyebrow">SUA FORTALEZA</span><h2 id="modal-title">Imagem pronta</h2><img class="fortress-export-preview" src="${url}" alt="Fortaleza completa sem interface"><p>PNG sem menus, setas, rótulos ou barras. No iPhone, toque e segure a imagem para salvar em Fotos, ou use Compartilhar.</p><div class="file-actions"><a class="secondary" href="${url}" download="CONQUER-fortaleza.png">Baixar PNG</a><button class="secondary" id="share-fortress">Compartilhar</button></div>`);
  const share=$('#share-fortress');share.onclick=async()=>{try{const file=new File([blob],'CONQUER-fortaleza.png',{type:'image/png'});if(navigator.canShare?.({files:[file]}))await navigator.share({files:[file],title:game.s.name});else toast('Toque e segure a imagem ou use Baixar PNG.')}catch(e){if(e.name!=='AbortError')toast('Use Baixar PNG ou toque e segure a imagem.')}};
  // Retain the URL while the preview is open; release it when the dialog closes.
  const observer=new MutationObserver(()=>{if(!document.querySelector('.fortress-export-preview')){URL.revokeObjectURL(url);canvas.width=canvas.height=0;observer.disconnect()}});observer.observe($('#modal-root'),{childList:true});
 }catch(e){toast(e.message||'Não foi possível exportar a fortaleza.');}
}
function exportGame(){if(!game)return;const blob=new Blob([game.serialize()],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`conquer-${game.s.name.replace(/[^\p{L}\p{N}]+/gu,'-').slice(0,40)}-turno-${game.s.turn}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Arquivo de jornada exportado.')}
$('#import-file').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;if(f.size>5_000_000){toast('Arquivo muito grande. Limite de 5 MB.');e.target.value='';return}try{const raw=await f.text();Game.restore(raw);loadRaw(raw);save('auto',true)}catch(err){toast(err.message)}e.target.value=''});
function tutorial(){modal(`<span class="eyebrow">BEM-VINDO, CONQUISTADOR</span><h2 id="modal-title">Sua primeira expedição.</h2><p>Você começa com <b>20♥, 20♦, 10 de moral</b> e cinco soldados leais. Seu objetivo é chegar à <b>profundidade 12</b> e derrotar o Guardião do Cristal do Vazio.</p><div class="help-grid"><div class="help-step"><span>01</span><div><h3>Explore uma sala</h3><p>Toque em uma seta que parte de uma sala para explorar imediatamente naquela direção. Só essa passagem será aberta. O primeiro andar não revela inimigos de ♠.</p></div></div><div class="help-step"><span>02</span><div><h3>Prepare a fortaleza</h3><p>Construa um Quartel por 8♥ em uma caverna vazia. Recrute soldados com ♦ antes de continuar a descida.</p></div></div><div class="help-step"><span>03</span><div><h3>Defenda com inteligência</h3><p>O combate acontece em tempo real. Suas tropas lutam por conta própria. Use pausa tática e controle a velocidade.</p></div></div></div><button data-modal="close" class="primary">${icon('compass')}Começar minha crônica</button>`,true)}
function help(){modal(`<span class="eyebrow">O LIVRO DO CONQUISTADOR</span><h2 id="modal-title">A pedra guarda histórias.</h2><p>Uma adaptação single player de CONQUER. Explore por cartas, construa uma fortaleza e proteja seu último reduto. O combate foi adaptado para tempo real com IA.</p><div class="suit-guide"><span><b>♥</b> Recursos</span><span><b>♦</b> Riquezas</span><span><b>♣</b> Natureza</span><span><b>♠</b> Ruínas & ameaças</span></div><div class="help-grid"><div class="help-step"><span>01</span><div><h3>Explore por uma direção</h3><p>Clique em uma seta que parte de uma sala ativa. Só a passagem indicada será aberta; salas vizinhas não se conectam automaticamente. Para abrir uma ligação entre salas já descobertas, clique na seta correspondente: ela não compra carta nem cobra recursos, mas segue o avanço de turno da exploração. ♥ e ♦ concedem valor da carta + profundidade, até o limite de 50. Armazéns e Tesourarias aumentam o limite em 50. A exploração seguinte inicia outro turno e recolhe a produção.</p></div></div><div class="help-step"><span>02</span><div><h3>Uma sala por turno</h3><p>No subterrâneo, selecione uma caverna e abra Construir. Museu e Templo ocupam dois espaços; escolha o lado antes de pagar. O Museu fica sempre horizontal. Criadouro ocupa quatro, cobrados como uma única sala. Na superfície, construa diretamente: o térreo apoia no chão e os andares superiores exigem uma sala abaixo. Veja custos e pré-requisitos no catálogo. Armadilhas e barricadas são adicionais. Oficina reduz custos próximos; salas danificadas ou desconectadas não funcionam.</p></div></div><div class="help-step"><span>03</span><div><h3>Recrute com cuidado</h3><p>Ocupantes dividem a capacidade de seu abrigo. Recrutamentos com motim imediato aparecem em vermelho e ficam bloqueados. Se a moral cair depois, recrutados comuns ainda podem se amotinar. Festivais, Arena e Parlatório aumentam a moral global. Taverna, Sala de Jogos, Galeria de Esgoto e Lavanderia aumentam a tolerância das unidades dentro de seu alcance, sem aumentar a moral global.</p></div></div><div class="help-step"><span>04</span><div><h3>IA em tempo real</h3><p>Os defensores se dividem entre núcleos inimigos conforme força, saúde, distância pelas passagens e urgência. Não há guardas fixos no portão; invasores buscam o caminho mais curto até o portão ou trono. Arqueiros e magos disparam a até 2 salas em linha reta. Clérigos dão escudos. Tropas sobreviventes recuperam a vida e retomam seus passeios a partir de onde terminaram o combate, sem retorno em formação. Três gemas acima do portão representam suas vidas: cada derrota destrói uma, remove os invasores e restaura cinco guardiões leais. A terceira derrota comum encerra a campanha. No Cristal do Vazio, a derrota é definitiva mesmo com gemas restantes.</p></div></div><div class="help-step"><span>05</span><div><h3>O ambiente é uma arma</h3><p>Líquidos descem, gases sobem e ambos fluem até 2 salas lateralmente, apenas por passagens abertas. Paredes sem ligação isolam os perigos. Água, magma e gás venenoso derrotam unidades atingidas imediatamente, mesmo fora de combate. Magma danifica apenas construções; cavernas naturais não sofrem dano estrutural. drenar não repara o dano. Fontes naturais de água e magma não podem ser drenadas: construa pontes. Apenas salas atingidas pelo fluxo podem ser drenadas. Bombas fechadas e ambas as barricadas bloqueiam a propagação. Magma também detona gás inflamável. A cratera possui uma chaminé seca acima e magma indrenável abaixo da descoberta. Sua expansão para ao encontrar a superfície ou uma sala existente. Pontes também atravessam seus trechos secos. Passagens secretas e pontes fechadas podem isolar parte da fortaleza.</p></div></div><div class="help-step"><span>06</span><div><h3>Conquiste o abismo</h3><p>Na profundidade 12 você encontra o Cristal do Vazio e seu guardião. Vença a batalha para terminar a campanha. Portais estabilizados oferecem 13 mapas persistentes; selecione até dez unidades por expedição. Volte pelo Portal de Retorno. Invasores podem atravessá-lo e atacar sua base.</p></div></div></div><div class="modal-rule"></div><p>As 26 magias boas, 13 ruins e 13 invenções têm efeitos próprios. Cartas com escolhas aguardam sua decisão. O coringa vermelho revela artefatos; o preto desperta monstruosidades. Produtores aparecem no canto inferior esquerdo. Prisões ocupadas recebem grades; quebrá-las liberta os ocupantes. Camadas e runas opcionais são escolhidas ao fundar a fortaleza. Na primeira exploração de cada nova profundidade, a chance de revelar a próxima camada começa em 5% e aumenta 5 pontos por profundidade sem descoberta; após encontrar uma camada, volta a 5%. A nova camada vale apenas para salas novas nessa profundidade ou abaixo; salas antigas mantêm seus efeitos e cores. No Cemitério, inimigos mortos se erguem no mesmo local ainda durante a batalha, com metade da força, como mortos-vivos que não podem ser capturados.</p><p class="key-guide"><b>PC:</b> arraste para mover · roda do mouse para zoom · <kbd>E</kbd> explorar · <kbd>Espaço</kbd> pausar combate · <kbd>F</kbd> centralizar · <kbd>Esc</kbd> menu · <kbd>Ctrl+S</kbd> salvar · setas e <kbd>Enter</kbd> para selecionar salas.<br><b>Mobile:</b> toque para selecionar, arraste com um dedo e use pinça ou +/− para zoom. As descrições também aparecem no painel, sem depender de hover.</p><p class="warning-note">Adaptação digital: a campanha base termina na profundidade 12. Cavernas vazias de todos os naipes, inclusive copas, usam 89%/7%/3%/1% para ocupar de um a quatro espaços. Chefes e formações especiais usam seu tamanho próprio, sujeito ao espaço disponível. As tabelas foram adaptadas ao combate em tempo real; existem diferenças em subeventos e combinações avançadas. Consulte o registro de cobertura 1.14 no repositório.</p><div class="modal-rule"></div><p class="inline-note">Referências fornecidas: CONQUER.odt, DELVE e RISE, de Anna Blackwell (referências de regras e arte). Ilustrações novas, sem reutilizar as páginas do PDF. CONQUER · Crônicas do Abismo · v1.23.0.</p><button data-modal="close" class="primary">Voltar à jornada</button>`,true)}
function journal(){if(!game)return;modal(`<span class="eyebrow">${escape(game.s.name)}</span><h2 id="modal-title">Crônica da fortaleza</h2><p>Cada sala é uma memória. Cada batalha, uma cicatriz.</p>${chronicleEntries(game.s).map(e=>`<div class="journal-entry"><time>TURNO ${e.turn}</time><p class="${e.kind==='danger'?'danger-text':e.kind==='good'?'good-text':''}">${escape(e.text)}</p></div>`).join('')}<button data-modal="export-chronicle" class="primary">${icon('download')}Exportar crônica</button>`,true)}
function planes(){modal(`<span class="eyebrow">ALÉM DA REALIDADE</span><h2 id="modal-title">Os treze planos</h2><p>Envie seus defensores através de um portal estável. Nesta adaptação, a expedição explora um mapa próprio. Cada expedição custa 20♦ e concede um artefato permanente.</p>${PLANES.map((p,i)=>`<div class="plane-card"><div><strong>${p.name}</strong><p>${p.desc}<br><span class="gold">${p.artifact}</span></p></div><button class="secondary" data-modal="expedition" data-arg="${i}" ${game.s.activePlane!=null||game.s.gold<20?'disabled':''}>${game.s.artifacts.includes(p.effect)?'Revisitar · 20♦':'20♦ →'}</button></div>`).join('')}`,true)}
function showEnd(){if(!game)return;if(eventCards.blocking){pendingEnd=true;return}const s=game.s,won=s.status==='won';modal(`<span class="eyebrow">O FIM DE UMA CRÔNICA</span><div class="end-emblem">${won?'◇':'♠'}</div><h2 id="modal-title" style="text-align:center;margin-right:0">${won?'O abismo tem um novo rei.':'Até a pedra pode cair.'}</h2><p style="text-align:center">${escape(s.name)} ${won?'conquistou o Cristal do Vazio. Sua história atravessará as eras.':'resistiu à escuridão. A fortaleza caiu, mas sua história permanece.'}</p><div class="end-stats"><div><b>${s.turn}</b><small>TURNOS</small></div><div><b>${s.maxDepth}</b><small>PROFUNDIDADE</small></div><div><b>${s.kills}</b><small>INIMIGOS VENCIDOS</small></div></div><div class="button-stack"><button class="primary" data-modal="journal">${icon('book')}Ler minha crônica</button><button data-modal="export">${icon('save')}Exportar jornada</button><button data-modal="new">${icon('plus')}Fundar uma nova fortaleza</button><button data-modal="close">${icon('eye')}Contemplar o mapa</button><button data-modal="title">${icon('exit')}Menu inicial</button></div>`)}
$('#modal-root').addEventListener('click',e=>{
 const b=e.target.closest('[data-modal]');if(!b)return;sound.resume();sound.play('click');const action=b.dataset.modal,arg=b.dataset.arg;
 if(action==='close')closeModal();if(action==='new')newGameDialog();if(action==='options')options();if(action==='help')help();if(action==='save')slots('save');if(action==='load')slots('load');if(action==='journal')journal();
 if(action==='difficulty'){newDifficulty=arg;$$('.difficulty-card').forEach(el=>el.classList.toggle('selected',el.dataset.arg===arg));$('#difficulty-description').textContent=DIFFICULTIES[arg].desc}
 if(action==='slot-save'){if(stored(arg)){modal(`<span class="eyebrow">SALVAR JORNADA</span><h2 id="modal-title">Substituir espaço ${arg}?</h2><p>O salvamento anterior desse espaço será substituído pela jornada atual. Os outros espaços serão preservados.</p><button class="primary" data-modal="confirm-save" data-arg="${arg}">Substituir salvamento</button><button class="panel-action" data-modal="save">Cancelar</button>`)}else{save(arg);slots('save')}}
 if(action==='confirm-save'){save(arg);slots('save')}
 if(action==='slot-load'){const raw=stored(arg);if(raw)loadRaw(raw)}
 if(action==='export-fortress')exportFortress();if(action==='import')$('#import-file').click();if(action==='export')exportGame();
 if(action==='export-chronicle'){const b=new Blob([game.s.name+'\n\n'+chronicleEntries(game.s).map(e=>`Turno ${e.turn}: ${e.text}`).join('\n')],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(b),a=document.createElement('a');a.href=url;a.download='conquer-cronica.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
 if(action==='title'){save('auto',true);closeModal();if(game?.s.combat)game.s.paused=true;setScreen('title')}
 if(action==='expedition'){closeModal();act(game.action('expedition',selected.x,selected.y,Number(arg)),'danger')}
});
$('#title-save').onclick=()=>{if(!game){const raw=stored('auto');if(raw)try{game=Game.restore(raw);renderer.game=game}catch{}}if(game)slots('save');else toast('Inicie uma fortaleza para criar seu primeiro salvamento.')};
$('#new-game').onclick=newGameDialog;$('#continue-game').onclick=()=>{const raw=stored('auto');if(raw)loadRaw(raw)};$('#load-game').onclick=()=>slots('load');$('#title-options').onclick=options;$('#title-help').onclick=help;$('#game-help').onclick=help;$('#open-options').onclick=options;$('#game-menu').onclick=pauseMenu;$('#journal-button').onclick=journal;$('#quick-save').onclick=()=>slots('save');$('#end-turn').onclick=explore;
$('#quit-game').onclick=()=>{modal(`<span class="eyebrow">ATÉ A PRÓXIMA CRÔNICA</span><h2 id="modal-title">A montanha vai esperar.</h2><p>Você pode fechar esta aba com segurança. Seus salvamentos permanecem neste navegador. Se instalou o jogo, feche a janela do aplicativo.</p><button data-modal="close" class="primary">Voltar ao menu</button>`)};
$('#export-fortress').onclick=exportFortress;$('#zoom-in').onclick=()=>renderer.setZoom(1.2);$('#zoom-out').onclick=()=>renderer.setZoom(1/1.2);$('#center-map').onclick=()=>{renderer.center();selected={x:0,y:0};refresh()};$('#fullscreen').onclick=()=>{if(document.fullscreenElement)document.exitFullscreen?.().catch(()=>{});else if(document.documentElement.requestFullscreen)document.documentElement.requestFullscreen().catch(()=>toast('Tela cheia indisponível neste navegador.'));else toast('Use a opção do navegador para instalar ou abrir em tela cheia.')};
function togglePause(){if(!game?.s.combat||eventCards.blocking)return;game.s.paused=!game.s.paused;updateStats();sound.play('click')}
$('#pause-combat').onclick=togglePause;$('#game-speed').onclick=()=>{if(!game)return;game.s.speed=game.s.speed===1?2:game.s.speed===2?.5:1;updateStats()};
document.addEventListener('pointerdown',()=>sound.resume(),{once:true});
document.addEventListener('keydown',e=>{
 const modalOpen=!!$('#modal-root').firstChild;const editing=['INPUT','SELECT','TEXTAREA'].includes(document.activeElement.tagName);
 if(modalOpen&&e.key==='Tab'){const items=[...$('#modal-root').querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled)')].filter(el=>el.getClientRects().length);const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}return}
 if(e.key==='Escape'){e.preventDefault();if(modalOpen)closeModal();else if(screen==='game')pauseMenu();return}
 if(editing||modalOpen||screen!=='game')return;
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){e.preventDefault();save('1');return}
 if(e.code==='Space'&&document.activeElement.tagName!=='BUTTON'){e.preventDefault();togglePause()}
 if(e.key.toLowerCase()==='e')explore();if(e.key.toLowerCase()==='f'){renderer.center();selected={x:0,y:0};refresh()}if(e.key==='+')renderer.setZoom(1.2);if(e.key==='-')renderer.setZoom(1/1.2);
});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&game){resourceFlights.finish();if(settings.autoPause&&game.s.combat)game.s.paused=true;save('auto',true)}});
window.addEventListener('pagehide',()=>{if(game)save('auto',true)});
let last=performance.now();function frame(now){const dt=Math.min((now-last)/1000,.1);last=now;if(game&&screen==='game'){
 if(game.s.returnPhase&&renderer.transitions.game===game&&renderer.transitions.returnStart!==undefined){game.s.returnPhase.elapsed=Math.max(0,now-renderer.transitions.returnStart);if(now>=renderer.transitions.returnUntil)delete game.s.returnPhase;}resourceFlights.collect(game);resourceFlights.tick(now);eventCards.tick(game,now);if(!eventCards.blocking)game.update(dt);resourceFlights.collect(game);eventCards.tick(game,now);let end=false,change=false;for(const e of game.events.splice(0)){if(e.type==='life-lost'){renderer.gemBurst(e.index,now,e.enemies||[]);renderer.focus({x:0,y:0});sound.play('danger');change=true;save('auto',true)}if(e.type==='void-defeat'){renderer.voidDefeat(e.enemies||[],now);sound.play('danger');change=true;save('auto',true)}if(e.type==='return-home'){renderer.returnHome(e.units,now-(e.elapsed||0));change=true}if(e.type==='attack')sound.play(e.ranged?'ranged':'attack');if(e.type==='combat'){pendingCombatSound=true;change=true}if(e.type==='portal-invasion'){toast('Invasores atravessaram um portal!');change=true}if(e.type==='victory'){sound.play('victory');change=true;save('auto',true)}if(e.type==='won'||e.type==='lost'){end=true;save('auto',true)}if(e.type==='death'||e.type==='door-hit'||e.type==='door-destroyed')change=true}
 if(change)refresh();if(end)pendingEnd=true;if(pendingEnd&&!eventCards.blocking&&!$('#modal-root').firstChild){pendingEnd=false;showEnd()}if(pendingCombatSound&&!eventCards.blocking){if(game.s.combat)sound.play('danger');pendingCombatSound=false}if(now-lastStats>300){updateStats();lastStats=now}renderer.draw(now);
 }requestAnimationFrame(frame)}requestAnimationFrame(frame);updateContinue();
// All assets are embedded: no service worker required.
if(new URLSearchParams(location.search).has('test'))window.__CONQUER__={Game,get game(){return game},setGame(g){closeModal();game=g;eventCards.reset(game);pendingEnd=false;renderer.game=g;selected={x:0,y:0};renderer.center();setScreen('game');refresh()},renderer,resourceFlights,eventCards,startGame,save,loadRaw,explore,get settings(){return settings}};

})();
if(window.conquerBoot)window.conquerBoot(true);