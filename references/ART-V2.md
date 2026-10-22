# Arte da reconstrução

As ilustrações aprovadas e os sprites existentes foram preservados. O motor usa PNGs individuais em `public/assets` e os incorpora ao HTML autossuficiente durante o build.

Foram geradas duas composições diferentes para cada uma das dezesseis cenas Wyrd/suplementares: ossuário, limo, carne, portais gêmeos, corrente de bolotas, cogumelo divino, cristais do tempo, fósseis, vila de toupeiras, anão cristalizado, sábio, caverna assobiante, coisas perdidas, santuário encantado, prisão e lago com ponte. Os arquivos são `rooms/wyrd1-0.png` a `rooms/wyrd16-1.png`. O índice 2 mantém compatibilidade com o sorteio de três variantes.

As variantes de abertura são compiladas em Canvas por `src/tiles.js`: quatro bits independentes, 160×96 pixels, portos canônicos e corte da parede do próprio tile. Ilustrações são ajustadas com escala uniforme; não se usam deslocamentos, esticamento ou distorção para fechar as juntas. O material é avaliado por pixel e converge para a mesma paleta na borda vizinha.

Uma nova folha de dezesseis personagens foi gerada para diferenciar as treze classes de aventureiros, o guardião do portão, um clérigo e uma relíquia animada. Os sprites foram exportados com transparência para `sprites/adventurer-1.png` a `sprites/adventurer-13.png` e os três personagens adicionais.
