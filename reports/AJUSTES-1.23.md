# Ajustes 1.23 — circulação, engenharia e camadas

## NPCs utilitários

Novos trabalhadores e substitutos surgem no portão principal. Percorrem os corredores reais até a estação; se não existir rota, aguardam sem atravessar paredes. Mantêm a fuga diante de inimigos e o retorno à oficina quando o perigo termina. Trabalhadores já existentes no salvamento preservam sua posição.

## Engenharia

Pilares, pontes levadiças, barricadas ofensivas e armadilhas de dano foram cobertos por testes que pesquisam o projeto e executam a construção. Os botões e a solicitação usam a mesma verificação: pesquisa, pré-requisito ativo, recursos, limite de construção do turno e local ou corredor válido. O tooltip informa o impedimento atual, incluindo o nome do projeto quando ainda bloqueado. Desbloquear uma pesquisa não dispensa as condições físicas ou o custo da construção.

## Arqueiros

O avanço comprometido em um corredor era executado antes da oportunidade de disparo. Agora o atirador para quando um inimigo está ao alcance e em linha de visão direta, mesmo no meio do corredor. Unidades corpo a corpo podem ultrapassar o atirador parado; ele recebe um pequeno deslocamento visual lateral. Disparos ao redor de esquinas continuam proibidos.

## Informação do prisioneiro

O subevento Dívida do prisioneiro deixou de ser gerado. Seu resultado na tabela agora encerra a tentativa sem informação adicional. A informação normal de uma interrogação bem-sucedida continua válida. Cartas antigas dessa dívida são retiradas ao carregar, sem cobrança ou surgimento de cobradores; o formato antigo ainda é aceito na validação do salvamento.

## Camadas por profundidade

Com camadas habilitadas nas opções, a primeira exploração deliberada de cada nova profundidade subterrânea faz uma única tentativa: 5%, depois 10%, 15% e assim por diante, até 100%. Uma descoberta reinicia a próxima chance em 5%. Reexplorar a mesma linha, produzir recursos ou revelar extensões automaticamente não fornece tentativas adicionais. A regra é mantida separadamente por mundo e respeita a direção das camadas no modo pesadelo.

O rei de paus não garante mais uma camada. Os efeitos continuam atribuídos às salas novas, sem alterar retroativamente as antigas. Em salvamentos anteriores, linhas já reveladas (exceto extensões automáticas de crateras) são consideradas visitadas; o progresso acumulativo é salvo nas próximas partidas.

## Verificação

450 testes automatizados de regras e 21 verificações gerais de navegador aprovados. O fluxo das quatro construções, chegada dos trabalhadores, salvamento das camadas e disparo em corredor passou em desktop, viewport touch e HTML offline. A suíte de camadas também passou em desktop, touch e offline. O pacote extraído foi verificado com requisições locais interceptadas sem rede: a política do ambiente bloqueia file:// e não disponibiliza o Windows Explorer para teste. A distribuição para PC mantém o HTML inicial pequeno e os arquivos de apoio na pasta jogo, evitando voltar ao HTML monolítico pesado.
