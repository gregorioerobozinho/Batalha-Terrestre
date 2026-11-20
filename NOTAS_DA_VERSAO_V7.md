# Batalha Terrestre — V7 (primeiro teste)

## Alterações incluídas
- Tabuleiro horizontal com 16 colunas × 10 linhas (160 casas).
- Capa e emblema originais incorporados à tela inicial.
- Ilustração da base terrestre/antiaérea e indicação do modo no centro.
- Removido o botão que construía uma segunda categoria de base; agora o veículo constrói uma base e a defesa é configurada ao selecionar o centro desocupado.
- Cada unidade pode mover uma vez e realizar uma ação complementar por rodada; o uso da peça consome uma das três operações apenas uma vez. As operações esgotadas não encerram automaticamente a vez: o jogador pode concluir a segunda parte das ações das peças já ativadas e então passar a rodada.
- Botão de passar rodada disponível.
- Reset dos estados moved/actionUsed na vez do proprietário, e incremento da rodada corrigido para PvP local.
- Apoio aéreo agora mostra avião/drone atravessando casas antes do bombardeio (trajeto visual simplificado em linha ortogonal).
- Dano continua visível no marcador da unidade; esquiva e defesa antiaérea mudam a arte do veículo.
- Removida a exclusão em cascata de unidades com propriedade parent ao destruir unidade-mãe, que poderia causar desaparecimentos não relacionados.

## Limitações conhecidas / precisam de validação
- A animação aérea é uma representação visual simplificada; ainda não implementa integralmente a rota circular detalhada definida anteriormente nem a interceptação em cada ponto do percurso.
- O modo de defesa terrestre/antiaérea da base aparece visualmente e pode ser alternado, mas a lógica completa de disparo automático da base e interceptação aérea ainda requer implementação e testes.
- Música e efeitos dependem de o navegador aceitar áudio após interação do usuário; testar com os botões de música e efeitos.
- Não foi realizado teste completo de partidas no navegador nesta geração.
- Multiplayer continua sendo local no mesmo aparelho; não há sincronização online entre dispositivos.

## Testes técnicos realizados
- Verificação sintática com `node --check src/game.js`.
- Verificação da integridade do arquivo ZIP.
