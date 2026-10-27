# Combate, prisioneiros e takeover — 1.20.0

## Mudanças desta versão

- A arma de cerco mantém um disparo por batalha e permanece imóvel. Pode adquirir alvos em qualquer distância ao longo de uma linha de salas conectadas. O virote continua além do primeiro alvo até a última sala da linha; atinge cada inimigo uma vez e interrompe os sobreviventes por um segundo. Não faz curvas, atravessa paredes nem portas reforçadas, pontes fechadas ou outros bloqueios de visão. Não atinge aliados nem criaturas neutras. O disparo e a lista de atingidos persistem ao salvar/carregar.
- A Sala de persuasão interroga automaticamente seu ocupante ao final do turno: tanto ao encerrar um turno diretamente quanto na transição para a exploração seguinte. A produção isolada não dispara o interrogatório. Salas inativas aguardam até voltarem a funcionar. A tentativa segue 1d4: um resultado 4 revela Informação, incluindo um ponto de pesquisa e o subevento de RISE. Qualquer resultado libera a sala; não há repetição com o mesmo ocupante. Os efeitos específicos da Informação, como conversão ou fuga, continuam existindo, mas o ocupante não permanece detido. Escolhas de Informação ficam em cartas na fila.
- A ação “Transferir da Solitária” fica na Sala de persuasão vazia. Uma carta abre a escolha da Solitária no mapa. A transferência preserva espécie, força e identidade, retira o ocupante da cela e atualiza as grades dos dois locais. A ação revalida disponibilidade e conexão ao confirmar; cancelar não descarta ninguém.
- Para aliados que avançam pela mesma passagem rumo à mesma frente, o corpo a corpo parte primeiro, em ordem decrescente de HP atual; atiradores seguem atrás. A fila mantém o espaçamento pelos corredores. As ações de contato usam a mesma prioridade. A regra não altera a prioridade de alvos para inimigos com mais HP, não manda unidades já em contato abandonar a luta e não exige esperar por tropas de outras frentes, imóveis ou atordoadas. Atiradores sem escolta continuam avançando normalmente.

## Como o takeover funciona hoje

**Existe uma implementação funcional, mas limitada a ocupação de áreas isoladas.** Não é um sistema completo de uma fortaleza inimiga autônoma.

1. Durante o combate, um invasor móvel procura caminho até seu objetivo — normalmente portão/trono; poderes específicos podem mudar o objetivo. Se não existe caminho, entra no ramo de ocupação. O teste é ausência de rota no grafo, não vitória sobre os defensores de uma sala.
2. A sala atual recebe `captured = true`. Uma construção sofre dano estrutural; cavernas recebem a marca de ocupação, sem dano estrutural. O registro técnico informa a tomada.
3. O invasor procura uma sala vizinha acessível ainda não marcada e avança para ela. A escolha usa a ordem dos vizinhos, sem estratégia de valor econômico.
4. Quando não encontra mais vizinhos livres, guarda apenas seu tipo e força em `room.garrison` e deixa a lista de inimigos ativos. A guarnição é persistida no salvamento. Isso não equivale a derrotar o invasor com dano.
5. Ao abrir uma passagem ou reabrir uma ponte levadiça, `reconnectCaptured()` procura salas ocupadas que voltaram a ter caminho até a base. Remove a marca, recria seus ocupantes e inicia combate. O dano estrutural permanece e precisa de reparo.

## Limitações verificadas no código

- Invasores não conquistam automaticamente cada sala conectada que atravessam. A ocupação só começa quando falta caminho até o objetivo. Unidades imóveis e voadoras não usam esse ramo de deslocamento terrestre.
- Uma área ocupada não gera recursos para uma facção, não constrói salas e não recruta reforços por conta própria. Não há expansão por turnos de uma economia rival.
- A guarnição conserva tipo e força agregada, mas não saúde restante, nome individual, poderes e todos os metadados do invasor. A recriação usa `spawnEnemies`, que pode redistribuir inimigos comuns em vários combatentes e restaura sua vida.
- Salas marcadas sem guarnição armazenada geram uma defesa genérica de `20 + 5 × profundidade` STR ao reconectar (110 STR de guardião no Cristal do Vazio), sujeita aos multiplicadores de dificuldade. Isso pode gerar defensores que não correspondem aos ocupantes originais.
- Existe uma segunda retomada por reparo direto de uma sala danificada e ocupada. Esse ramo também usa a defesa genérica e não consome a guarnição armazenada, em vez de reutilizar o fluxo fiel da reconexão. É uma inconsistência do takeover existente; não foi reformulado nesta versão.
- A reconexão não é verificada continuamente para toda alteração possível do mapa: os gatilhos explícitos são abrir passagem e reabrir ponte, além do ramo separado de reparo. A marca é retirada antes do combate de retomada terminar.
- As notificações específicas de tomada e instalação são registros na crônica; ainda não têm cartas de evento próprias. Quando os invasores passam à reserva de guarnição e deixam de existir inimigos ativos, o encerramento comum de combate pode registrar uma vitória apesar de a ocupação continuar. Isso não concede a conquista do Cristal do Vazio: o guardião precisa ser derrotado.

Essas limitações descrevem o estado atual; não significam que um sistema completo de conquista territorial foi implementado. A versão 1.20 altera cerco, persuasão e prioridade de engajamento, preservando as regras existentes de takeover para tornar a análise verificável.

## Validação

404 testes de regras passaram. Os testes cobrem penetração em múltiplas salas, pausa e salvamento do virote, bloqueios, fogo sem aliados atingidos, interrogatório único e automático, transferências atômicas e ocupação/reconexão real. Testes de navegador cobrem as novas ações e cartas em desktop, toque e HTML offline. O pacote PC é validado depois de extraído.

Verificações adicionais: 21 fluxos gerais no navegador; fluxo novo em desktop, toque e HTML offline; ZIP extraído com cinco arquivos; 96 rodadas em 64 salas, com renderização p95 de 28,3 ms e atualização p95 de 4,5 ms nesta máquina. Uma simulação de combate com 85 unidades por 240 quadros teve atualização p95 de 10,6 ms. Essas medidas não garantem o mesmo desempenho em outros dispositivos.
