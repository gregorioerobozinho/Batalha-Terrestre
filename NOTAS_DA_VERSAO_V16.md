# Batalha Terrestre — V16: mesmas regras no modo Provações

## Correção principal
O modo contra Provações agora utiliza as mesmas rotinas de validação e resolução do modo entre usuários para as ações correspondentes. A IA não deve mais executar ataques aéreos por uma rotina privilegiada que ignorava alcance, rota, alvo escolhido ou defesa antiaérea.

## Apoio aéreo e drone
- A IA só considera alvos a até 5 casas ortogonais do veículo lançador (distância Manhattan).
- A rota é construída pela mesma função compartilhada com o jogador.
- A IA consulta as mesmas defesas antiaéreas de veículos e bases ao longo da rota.
- Se houver interceptação no trajeto, o avião/drone é abatido e não atinge o alvo.
- Cada apoio atinge somente a unidade ou célula de base escolhida; não há mais dano em área 3×3.
- Cada tanque/patrulha conserva o uso único de seu apoio vinculado.
- A IA evita gastar apoio quando já identifica uma interceptação no trajeto.

## Ataque terrestre, movimento e ações
- Os ataques terrestres da IA agora passam por `attackAt()`, compartilhando alcance, linha de tiro, bloqueios, esquiva, dano e fumaça.
- A IA não considera unidades ocultas atrás da primeira unidade numa casa compartilhada como alvo direto.
- Bases/células intactas bloqueiam linha de tiro, conforme as regras do tabuleiro.
- Os movimentos da IA passam por `moveTo()`, compartilhando limite de movimento, bloqueios e disparo automático de bases.
- A construção de base, implantação na reserva e esquiva da IA reutilizam as rotinas comuns do jogo.
- As validações de movimento e ataque foram reforçadas dentro das funções de execução, evitando que qualquer lado contorne o limite por uma chamada direta.

## Operações por rodada
- A IA respeita as três operações por rodada.
- Como no modo entre usuários, cada veículo utilizado pode mover uma vez e realizar uma ação complementar uma vez na mesma rodada.
- A IA não pode repetir movimento nem ação complementar com o mesmo veículo.

## Verificações
- `node --check` aprovado.
- Teste lógico específico da seleção de apoio aéreo: candidatos além de 5 casas são ignorados; alvos dentro do alcance são considerados; rotas interceptadas são descartadas.
- Integridade do ZIP verificada.
- A partida completa ainda precisa de teste manual no VS Code/navegador.
