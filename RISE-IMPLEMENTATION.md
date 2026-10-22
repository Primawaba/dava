# Correções baseadas em RISE — versão 1.12.0

Implementação das regras de CONQUER esclarecidas por RISE. O texto CONQUER define valores e diferenças próprias; as decisões do usuário continuam prevalecendo. Fontes e páginas estão em [RISE-RULES.md](RISE-RULES.md).

## Implementado

| Sistema | Antes | Agora | Referência |
|---|---|---|---|
| Conforto | Quarto e Mansão davam moral global | Quarto reduz motim dos residentes em 1; Mansão abriga uma unidade/180 STR, rebaixa Quartos adjacentes a Cabanas e torna Cabanas adjacentes inabitáveis | CONQUER, Abrigos; RISE 12–13 |
| Alojamentos | Capangas em Cabana/Quarto; Mansão sem função de abrigo | Abrigos genéricos para classes desleais, limites simultâneos de vagas e STR, penalidade por moradia inadequada; previsão considera o abrigo escolhido | Mesmas seções |
| Solitária | Prisioneiro anônimo aparecia após qualquer vitória | Captura apenas oponentes racionais realmente derrotados, guardando espécie, força e atributos; dano/desconexão liberta o ocupante | CONQUER, Solitária; RISE 13 |
| Persuasão | Chance automática de ganhar 10♥, mesmo sem prisioneiro | Escolha de um prisioneiro real, uma tentativa por sala/turno, 25% de obter resultado da tabela Informação | CONQUER, Persuasão; RISE 13 e 30–31 |
| Contratação | Chance automática de criar capanga genérico | Resultado 4: contratação; 3: proposta por duas vezes o valor de uma carta, com aceitar/recusar; mantém espécie/força e motim base 12 | CONQUER, Contratação; RISE 14 |
| Prisão comum | Pagava no mesmo turno em que o último ocupante entrava | Produz se já estava cheia no início do turno; só depois recebe novo ocupante. Desconexão ou dano causa fuga | CONQUER, Prisão |
| Altares | Fortuna fixa | Dedicação escolhida: Fortuna, Guardião ou Devorador. Requer clérigo; Guardião causa dano equivalente a armadilha nível 3 sem bloquear passagem; Devorador exige escolha de sacrifício e −5 moral, uma vez por turno | CONQUER, Altar; RISE 11 e 14 contextualizam sacrifício |
| Labirinto | Apenas reduzia velocidade | Bloqueia movimento de ambos os lados e tiro através dele; tentativa com explorador escolhido tem 25% de sucesso, mapeia o grupo inteiro; falha mata somente o explorador | CONQUER, Resquícios 19; RISE 22 |
| Encontros territoriais | Criaturas grandes, famintas, criptas, cidades e campeão começavam invasão | Guardiões neutros bloqueiam toda a área e não atacam a base até provocação; módulos não permitem contornar a guarda construindo por outra casa | CONQUER, formações/resquícios; RISE 20–23 |
| Criatura faminta | Inimigo comum | Sacrifícios escolhidos dão +20 STR; com Canil, domesticação tem 25% de sucesso e preserva a criatura; falha inicia luta | CONQUER, Formação 20; RISE 21 |
| Campeão | Combate automático e soldado genérico de prêmio | Desafiante escolhido: num 4, o próprio campeão de 60 STR se alia com motim 8; falha mata o desafiante e inicia luta. Matar o campeão não fabrica soldado | CONQUER, Resquício 23; RISE 23 |
| Clérigos e rituais | Interações sem presença de clérigo | Ação para instalar clérigo em altar, cripta, ritual, templo abandonado ou portal; cripta exige clérigo para contratar mortos-vivos; templo abandonado usa 1d4, com 3 resultados ruins e 1 bom | CONQUER, Resquícios 2, 6, 16 |
| Fechar portal | Apenas 20♦ | Exige 20♦ e sacrifica o clérigo instalado, com custo explícito no botão | CONQUER, Resquício 9 |
| Euforia | +5 moral global | Redução permanente de 1 no limiar de motim, compartilhada pela previsão e pela resolução | CONQUER, Magia Boa 15; RISE 24 |
| Hospital | Revivia sem consequência de lealdade | Reviver uma unidade desleal aumenta seu limiar pessoal em 1 | CONQUER, Hospital; RISE 15 |

Sacrifícios e exploradores perdidos são removidos permanentemente, sem entrar na lista de ressuscitação do hospital. Escolhas exigidas aguardam input; carregar uma proposta de contratação não repete cobrança ou conversão. As cartas novas usam ilustrações temáticas já disponíveis.

## Informação: cobertura e adaptações explícitas

As treze entradas de RISE pp. 30–31 passaram a ter resultados distintos:

1. Fuga: o fugitivo tenta alcançar prisões e só liberta ocupantes ao chegar à casa.
2. Sem revelação: prisioneiro permanece.
3. Adesão: conserva identidade e precisa de abrigo/moral; sem condições, permanece na cela.
4. Morte do prisioneiro.
5. Tesouro de até 30♦ em troca da liberdade, respeitando reservas.
6. Grupo de resgate na cela: **adaptação atual usa invasores de 100 STR**, sem a tabela completa de aventureiros de RISE.
7. Objeto com magia boa ou ruim.
8. Dívida de 100♦ com escolha obrigatória entre pagar ou enfrentar cobradores; **cobradores usam o mesmo encontro digital de 100 STR**.
9. +5 moral.
10. Fraqueza para o próximo combate: inimigos de resquícios recebem metade da força; criaturas naturais não recebem a redução.
11. Próxima descoberta J♥ liberta 1d4 capangas; **a descoberta ainda concede seu prêmio normal e não cria um subsistema separado de celas de resgate**.
12. Construção gratuita com tipo escolhido, sem consumir a construção normal do turno; **posicionamento usa cavernas abertas**, respeita área, unicidade e pré-requisitos. O original permite também espaço inexplorado.
13. Informação de incursão: **reduz em 10 STR por informação a próxima batalha planar**, porque as incursões digitais ainda não usam a comparação de baralhos do RISE.

As entradas 6, 8, 11, 12 e 13 são aproximações documentadas, não reprodução integral do livro. Informação não é mais convertida indiscriminadamente em +10♥.

## Compatibilidade e limites

- Combate segue em tempo real; três vidas, fontes não drenáveis, portas nos corredores e demais decisões do usuário foram mantidos.
- Saves preservam escolhas, prisioneiros, dedicação, mapeamento, guardiões e limiares pessoais. Saves antigos conservam Fortuna nos altares. Prisioneiro antigo sem identidade é migrado como ocupante genérico de 1 STR; não inventamos uma força histórica que o save não guardava.
- Encontros já hostis em saves antigos não são retroativamente tornados passivos. As novas descobertas usam as regras territoriais.
- Tabelas completas de magias, aventureiros invasores, artefatos e incursões de RISE ainda não estão implementadas. Euforia é uma correção específica do repertório de magia já existente.
- Libertação manual de prisões comuns para um combate entre três facções permanece pendente. A fuga involuntária agora funciona; não confundir os dois comportamentos.
- O retorno pós-vitória continua uma apresentação sobre o resultado já salvo, conforme 1.11.0.
- O problema de substituir o tile principal de uma formação produtora, apontado na auditoria 1.11.0, continua pendente; esta atualização não o declara corrigido.
- Safari/iPhone real continua sem homologação; toque em Chromium não comprova compatibilidade nativa.

## Validação

Testes de motor incluem conforto, previsão de motim, captura real, ausência de prisioneiro fictício, Persuasão, proposta paga/recusada, fuga, dedicação, sacrifício/cancelamento, Guardião passável, mapeamento de grupo, passividade, domesticação, campeão, clérigo/portal, Informação, hospital e migração/rejeição de saves inválidos.

`npm run test:rise` verifica pelas telas reais: construção e dedicação, seleção de sacrifício, contratação com save/load, labirinto, provocação territorial e toque em viewport de 390 pixels. As suítes existentes de jogo, eventos, acabamento e HTML independente também são executadas para verificar integração.
