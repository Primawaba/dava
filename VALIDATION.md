# Validação da entrega

## Edição de teste em arquivo único

`releases/CONQUER-Jogar.html` reúne código, estilos, fontes e todas as imagens em um HTML autônomo, sem módulos externos e sem service worker. `npm run build:standalone` reproduz o arquivo e seu SHA-256.

`npm run test:standalone` aprovou 7 verificações: recursos embutidos e 270 imagens, nova campanha com exploração/construção/recrutamento, persistência após recarga, exportação/importação, combate automático real, viewport com toque de 390px e ausência de exceções ou requisições de rede externas. Relatório em `artifacts/standalone-results.json`.

A política administrativa deste Chromium bloqueia navegações `file://`. A suíte registra esse limite e testa o mesmo HTML em uma navegação de loopback interceptada pelo Playwright, sem servidor ou recursos externos, com a rede desativada. Portanto, a execução do HTML foi validada, mas a navegação direta por `file://` não pôde ser homologada neste navegador gerenciado. O arquivo foi inspecionado para confirmar que não contém imports, scripts ou assets locais dependentes de servidor.

## Resultados executados

- **27 testes do motor aprovados**, sem falhas ou testes ignorados.
- **21 verificações de navegador aprovadas**, sem exceções JavaScript não tratadas.
- Verificação direcionada adicional aprovada: salvar pelo menu inicial, salvar após reiniciar o navegador e layout mobile desse menu. Resultado em `artifacts/title-save-results.json`.
- Build estático: 285 arquivos mais o service worker.
- 90 tipos de sala, 41 construções, 15 unidades, 13 expedições e 270 ilustrações vetoriais.

O relatório completo da execução de navegador está em `artifacts/browser-results.json`. As capturas `01` a `11` registram menu, fortaleza, corredores, combate, regras, telas mobile, vitória e derrota.

## Motor

Cobertura: inicialização e semente; 52 cartas e coringas; todas as 16 conexões de corredores; exploração protegida no primeiro andar; fronteiras e conectividade; custos e pré-requisitos; capacidade compartilhada de recrutamento; desconto de oficina; limites de estoque; troca; motins; propagação de água e gás; drenagem e ponte; linha de visão; combate por IA e projéteis; pausa; derrota; Hospital; saves em combate; rejeição de saves inválidos; vitória do guardião; tomada e reconexão sem falsa vitória; explosão de gás; câmara imortal; prisioneiro antigo; importação adulterada; expedições; integridade das três artes de cada sala; batalhas em 20 sementes.

## Navegador

Executado com Chromium do sistema em Linux, via Playwright:

| Contexto | Verificação |
| --- | --- |
| Desktop 1440×1000 | Menu, arte, campanha nova, tutorial, exploração, construção, recrutamento, saves e carregamento |
| Combate real | Invasores e defensores por IA, projéteis, pausa sem avanço de relógio, retomada, resolução, vitória contra o guardião e derrota do portão |
| Persistência | Recarregar o navegador, continuar campanha, importar/exportar JSON, opções e redução de movimento |
| Offline | Service worker ativo, rede desabilitada, recarga completa e retomada de campanha |
| Mobile 390×844, toque emulado | Menu, campanha, exploração, construção, recrutamento, painel, zoom e ajuda |
| Mobile horizontal 844×390 | Layout sem overflow horizontal |
| Mobile 360×640 | Mapa utilizável e ausência de overflow horizontal |
| Todos | Nenhuma exceção JavaScript não tratada |

Foram observados e corrigidos durante a validação: navegação offline da raiz com parâmetros; passagens verticais que não recortavam totalmente a borda inferior; vitória indevida ao isolar o guardião; retomada de invasão em salas reconectadas; validação de unidades caídas e valores de velocidade/expedição em saves.

## Limites

Não testado em aparelhos físicos, Safari, Firefox, lojas ou leitores de tela com usuários. Não há certificação de desempenho em dispositivos de baixo custo nem estudo de balanceamento com jogadores. Não foram gerados instaladores nativos. Consulte `ADAPTATION.md` para as regras condensadas e diferentes das referências.

O pacote web e seu checksum são gerados por `scripts/release.mjs`. O servidor de desenvolvimento e o build foram executados localmente; nenhum serviço externo recebeu publicação.
