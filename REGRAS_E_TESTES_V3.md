# Regras de dano e vitória — Batalha Terrestre V3

## Resistência: impactos necessários para destruir

| Alvo | Tanque | Patrulha | Drone | Avião |
|---|---:|---:|---:|---:|
| Tanque | 3 | 5 | 2 | 1 |
| Patrulha | 2 | 2 | 2 | 1 |
| Centro da base | 3 | 4 | 2 | 2 |
| Célula periférica da base | Não atinge | Não atinge | 2 | 2 |

Os impactos são contabilizados separadamente por tipo de arma. Ex.: um tanque que recebe 2 tiros de tanque e 1 de patrulha ainda não é destruído; o progresso de cada arma é mantido separadamente.

## Células de base
- Ataque terrestre direto só pode atingir o centro da base.
- Ataque aéreo aplica dano a todas as unidades e células de base dentro da área 3×3, inclusive aliadas, conforme a regra de dano aéreo.
- A destruição de uma célula periférica neutraliza somente aquela casa.
- A destruição do centro remove a base inteira e neutraliza as oito casas restantes.
- Território conta somente células de base ainda intactas.

## Vitória — destruição total
Uma equipe só é eliminada quando simultaneamente não possui: (1) unidades terrestres no tabuleiro; (2) tanques ou patrulhas na reserva; e (3) nenhuma base. Aviões e drones são apoio vinculado, não contam como unidades independentes. A partida termina assim que uma equipe é eliminada; se ambas forem eliminadas na mesma resolução, há empate.

## Configuração inicial
Cada equipe começa com 10 tanques e 10 patrulhas na reserva. A máquina usa um único nível de IA (Padrão). O primeiro jogador alterna entre partidas locais; contra a máquina, a primeira partida começa com Provações e as seguintes alternam entre Provações e jogador.

## Roteiro de testes manuais
1. Ataque tanque contra tanque: conferir destruição no 3º impacto.
2. Patrulha contra tanque: conferir destruição no 5º impacto.
3. Drone contra tanque e patrulha: conferir 2 impactos.
4. Avião contra tanque e patrulha: conferir 1 impacto.
5. Ataque terrestre ao centro: tanque destrói no 3º; patrulha no 4º.
6. Ataque terrestre à periferia: deve ser recusado/bloqueado.
7. Ataque aéreo à periferia e ao centro: 2 impactos da mesma arma por célula.
8. Destruir periferia: somente uma casa fica neutra. Destruir centro: toda a base desaparece.
9. Eliminar todas as unidades no campo, mas manter reserva: partida continua.
10. Esvaziar reserva, mas manter base: partida continua.
11. Remover unidades, reserva e bases de uma equipe: vitória imediata do adversário.
12. Jogar partidas locais consecutivas e verificar alternância do primeiro jogador.
13. Jogar partidas contra Provações consecutivas e verificar alternância do primeiro jogador.
