# Atualização 1.19

## Crônica

49 categorias e 253 formulações. Cada categoria possui pelo menos cinco versões; registros frequentes têm mais. A escolha percorre um ciclo independente por categoria, sem consumir o gerador aleatório usado pelas regras. O registro conserva o texto técnico original e recebe uma narrativa persistente. O menu da partida oferece “Ler crônica”, inclusive em telas compactas. Diário e exportação usam exatamente essa narrativa, do registro mais antigo ao mais recente. A contagem continua após o limite de cem registros. Salvamentos anteriores recebem variantes na migração.

## Invasões e territórios

O primeiro ataque de bandidos é agendado entre os turnos 5 e 8. Os seguintes são agendados 5–8 turnos após o ataque anterior. A invasão aguarda uma descoberta real na fortaleza; esperar, abrir passagem conhecida ou explorar outro plano não a consome. Ela participa da mesma transação das ameaças da sala e do portal. Cada bandido é racional, capturável e tem exatamente 15 STR. A força-alvo do grupo é 15 + 5 × maior profundidade descoberta; o número de bandidos é arredondado para cima. O ponto de entrada é o espaço mais profundo transitável com caminho até o alvo da fortaleza. Essa fórmula é a opção de balanceamento adotada nesta versão.

Provocar guardiões territoriais envia os defensores até eles. O guardião aguarda o primeiro ataque das tropas e depois reage dentro dos limites de seu território. A ação é recusada se nenhum defensor pode alcançar ou atingir o alvo. A regra inclui o golem passivo. Metadados de defesa territorial são preservados no salvamento e na reanimação.

O material do Cristal do Vazio é roxo escuro, com iluminação procedural lenta. Extensões e passagens internas usam a mesma paleta; outras salas não são marcadas.

## Coringas

A disponibilidade depende da maior profundidade alcançada na fortaleza: pelo menos 5. Argumentos de compra de cartas e profundidades de planos não antecipam o desbloqueio. Reembaralhamento e retorno após cooldown obedecem à mesma regra. Salvamentos rasos com coringas prematuros têm essas cartas removidas, preservando as salas já descobertas.

## Validação

388 testes automatizados de regras, incluindo cinco testes da narrativa, sete de invasões/territórios/paleta e quatro do bloqueio de coringas. Teste de navegador específico compara diário, exportação e releitura em desktop, toque e HTML offline. A arte de cavernas e salas existente foi preservada.
