# Batalha Terrestre — V5 para primeiro teste

## Alterações nesta entrega
- Definida explicitamente a chave `FIRST_MACHINE` usada para alternar quem começa nas partidas contra Provações. Isso evita referência a uma constante não declarada ao iniciar o modo máquina.
- `aiTurn()` agora verifica também `G.mode === "machine"`. A IA e as mensagens de Provações ficam restritas ao modo contra a máquina.
- No modo local (dois jogadores no mesmo aparelho), a troca de turno continua exibindo somente o aviso neutro para passar o aparelho; não há fala da máquina.

## Verificações realizadas
- `node --check src/game.js`: aprovado.
- Integridade do ZIP: será verificada no empacotamento.

## Não verificado ainda
- Partidas completas no navegador, em todos os cenários e regras.
- Compatibilidade em diferentes tamanhos de tela e aparelhos.
- Todas as regras avançadas listadas no documento de especificação.
