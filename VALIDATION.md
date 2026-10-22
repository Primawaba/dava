# Validação da reconstrução 2.0

Executada em 22/10/2026, sobre os fontes que geram o HTML distribuído.

## Regras: 177 testes aprovados

`npm test`

- Portal planar singleton em quarenta sementes: descoberta, atualização, salvamento e carregamento não criam outra sala abaixo dele.
- Transações inválidas preservam estado, cartas, aleatoriedade, recursos e eventos. Uma recompensa é aplicada uma única vez.
- Paredes entre vizinhos, passagem explícita, superfície sustentada, câmara selada, seleção da continuidade do museu e separação de áreas naturais ao construir.
- Fluidos, gases, fontes indrenáveis, pontes, barricadas, explosões, crateras e imortalidade.
- Chefes individuais, retaliação corpo a corpo em corredores, linha de visão, fila de tropas, profissionais e tolerância local.
- Treze aventureiros, vinte e seis magias boas, treze magias ruins e treze traços de monstruosidades.
- Três derrotas simuladas até game over, animação da gema antes da carta e conquista simulada do Cristal do Vazio. A campanha de vitória usa uma tropa forte de teste: verifica o fluxo completo, não o balanceamento.
- Trinta campanhas de geração com até vinte e cinco turnos, verificando invariantes e restauração do salvamento em cada etapa.
- Ida e volta dos treze mapas planares, recompensas, Tomo Maldito, Pensador Perpétuo e Algemas de Mithrill. Isso não valida todos os modificadores particulares de cada plano.

## Apresentação e distribuição

`npm run build` e `npm run test:browser`

- 5.424 combinações de tipo de sala e variante de arte e máscara direcional verificadas. Nenhum asset de sala ausente. Portas abertas chegam à borda; bordas fechadas não ganham uma saída.
- Mesmo pixel de união entre materiais distintos, incluindo água com sala alagada, miasma, magma, cristal e construção.
- Renderização e exportação não alteram o estado salvo.
- Menu, nova campanha, descoberta, carta, recebimento de recursos, salvar e carregar pelo fluxo real da interface.
- Recompensa de 14 recursos gera exatamente 14 símbolos e termina com o placar correto.
- Layout com toque em 390×844, sem transbordamento horizontal.
- O HTML autossuficiente inicia uma campanha e explora sem buscar dependências pela rede. Sem exceções JavaScript nos fluxos testados.

## Limites do ambiente

O Chromium gerenciado bloqueia `file://` por política. A validação offline executou o conteúdo idêntico do HTML em um documento interceptado, sem servidor e com a rede desligada. Não foi um teste nativo de duplo clique neste ambiente.

O download do WebKit foi bloqueado pelos domínios de distribuição. Portanto, não há aprovação de Safari/iOS real. A versão hospedada evita o bloqueio de JavaScript da prévia do app Arquivos, mas ainda precisa de teste em aparelho.

Passar esses testes não comprova ausência de bugs, balanceamento final, nem fidelidade completa de todos os planos. As imagens de inspeção visual são geradas em `artifacts/`, fora do controle de versão.
