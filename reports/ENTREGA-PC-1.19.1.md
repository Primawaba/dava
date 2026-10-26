# Correção de distribuição 1.19.1

O usuário relatou que o HTML não abriu e travou o Explorador do Windows. Não foi possível reproduzir o Windows neste ambiente. A entrega anterior direcionava para o ZIP completo do repositório e para um HTML monolítico de aproximadamente 31 MiB. Isso submetia um documento grande ao tratamento de arquivos e pré-visualização; é um fator identificado, não uma causa comprovada do travamento relatado.

A distribuição recomendada agora é CONQUER-PC.zip: cinco arquivos, aproximadamente 23 MiB comprimidos. O HTML tem cerca de 9 KiB; imagens, código e estilo são carregados de três arquivos vizinhos em jogo/. Não há importação de módulos, fetch de arquivos locais, servidor ou instalador. As imagens de canvas permanecem em data URLs, de forma que a exportação PNG funciona. Um aviso orienta a extrair o ZIP inteiro se faltar um dos arquivos. A edição monolítica permanece opcional em releases/, para compatibilidade e testes.

O teste test:portable extrai o ZIP final, confere seus cinco arquivos e sua identidade com os arquivos publicados, e verifica 762 sprites, nova partida, exploração, carregamento, diário e exportação PNG. A navegação file:// é bloqueada por política administrativa nesta máquina: o teste usa interceptação de cada arquivo extraído, com a rede desligada. Isso não constitui teste do Explorador do Windows.

Nenhuma mecânica ou arte foi alterada nesta correção. Os testes de documento único continuam apontando para a edição monolítica opcional.
