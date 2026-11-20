# Batalha Terrestre — V11: seleção de alvo aéreo e feedback tático

## Alterações desta versão
- Apoio aéreo do tanque e drone da patrulha agora entram em modo de seleção de alvo; não escolhem automaticamente o inimigo mais próximo.
- O jogador escolhe uma unidade inimiga ou casa de base inimiga no tabuleiro.
- Alcance máximo: 5 casas ortogonais (distância Manhattan). Alvo fora do alcance gera aviso e não consome o recurso nem a ação.
- Alvos dentro do alcance são destacados em dourado.
- O voo é animado por uma rota ortogonal até a casa escolhida; o ataque afeta a área 3×3 ao redor do alvo.
- Ao selecionar uma unidade, as casas livres alcançáveis ficam destacadas imediatamente; tanque até 2 casas e patrulha até 3, em linha ortogonal. O toque numa casa destacada move a unidade.
- Corrigida a orientação vertical do sprite após movimento: mover para cima usa frente; mover para baixo usa trás.
- Sprites recebem tratamento de cor por equipe (azul, verde, rosa, amarelo e vermelho) para diferenciar visualmente os lados.
- Efeito de fumaça temporário nos locais de impacto terrestre e na área 3×3 do bombardeio.
- Cache offline atualizado para V11.

## Limites conhecidos que continuam pendentes
- A trilha sonora automática desde a abertura ainda depende das políticas de reprodução do navegador e não foi validada com áudio audível nesta entrega.
- O mecanismo completo de disparo terrestre automático das bases ainda precisa de implementação/teste separado.
- As artes atuais do tabuleiro ainda usam os SVGs individuais existentes; a folha de referência enviada não foi convertida integralmente em sprites individuais de alta fidelidade.
- A rota aérea nesta versão é uma rota ortogonal até o alvo escolhido, limitada a cinco casas; não implementa o antigo circuito de voo longo em várias etapas.
- A sintaxe JavaScript e o ZIP foram verificados. A execução completa em navegador não pôde ser concluída neste ambiente; testar no VS Code/Live Server é necessário.

## Regra preservada
- Cada tanque mantém seu apoio aéreo limitado a uma utilização por partida.
- Cada patrulha mantém seu drone limitado a uma utilização por partida.
