# Batalha Terrestre — V9: alinhamento às referências visuais

## Referências oficiais incorporadas
- `assets/branding/logo-emblema.png`: arquivo enviado pelo usuário (logo quadrada).
- `assets/branding/icone-app.png`: mesma logo oficial para identidade do app.
- `assets/branding/capa-jogo.png`: pôster vertical enviado pelo usuário.
- `assets/branding/cena-inicial.jpg`: recorte próprio da arte enviada para a imagem hero da tela inicial.
- `assets/branding/atlas-pecas-referencia.png`: folha oficial de referência de unidades, direções, defesas e efeitos enviada pelo usuário.

## Interface
- Criada tela inicial inspirada na referência Interface 2: imagem de batalha, título, escolha entre Provações e dois jogadores, acesso às regras e à folha de peças.
- A preparação da partida agora é uma segunda tela, aberta após selecionar o modo.
- Seleção de perfis PvP com Azul, Verde, Rosa e Amarelo; cores duplicadas são bloqueadas.
- Tela de batalha reorganizada com tabuleiro 16×10 e reservas/território/ações em painel lateral.
- No modo local, o painel lateral muda de lado para acompanhar o jogador ativo.
- A folha de peças enviada fica disponível pelo acesso “Peças e funcionalidades”.
- Corrigida a escolha do sprite de esquiva do tanque para usar a variação correspondente.

## Áudio
- Mantidos os WAVs do pacote de áudio enviado pelo usuário; os arquivos WAV do pacote coincidem com os já existentes.
- Substituído `audio/audio.js` pelo controlador fornecido no pacote do usuário.
- Cache do service worker atualizado para V9.

## Limites conhecidos
- A folha de peças é incorporada como atlas de referência/consulta; o tabuleiro continua usando os SVGs individuais já existentes no projeto para renderizar cada unidade.
- A arte do pôster é usada na tela de preparação; a tela inicial usa um recorte da mesma arte para destacar o cenário.
- Esta versão foi verificada por sintaxe JavaScript, integridade do ZIP e referências locais do HTML; ainda requer teste de partida real no navegador.

- Os quadros de vitória/derrota foram recortados da prancha visual de funcionalidades enviada e são exibidos no encerramento da partida.
- O pôster vertical completo é preservado na etapa de preparação; a tela inicial usa um recorte panorâmico da cena de batalha para adequar-se ao layout móvel.
- A arte detalhada de unidades enviada é incluída como atlas de consulta; os sprites individuais em campo continuam sendo SVGs independentes existentes no projeto, não recortes automáticos do atlas.
