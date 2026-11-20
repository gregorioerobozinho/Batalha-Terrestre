# Batalha Terrestre — V15: correções de combate e orientação

## Alterações
1. Patrulhas também podem ativar/desativar defesa antiaérea. A interceptação verifica qualquer veículo com `aa=true`, não apenas tanques. O estado fica indicado por um pequeno escudo sobre a peça.
2. Orientação inicial: unidades posicionadas na linha superior começam viradas para baixo (`back`); unidades na linha inferior começam viradas para cima (`front`), de frente para o adversário.
3. Ataque terrestre: ao selecionar Atacar, as linhas de alcance ficam sombreadas e os alvos válidos destacados. A busca de alvo reconhece explicitamente o centro da base, desde que seja o primeiro obstáculo na linha de tiro. Tanque mantém alcance de 5 e patrulha de 3 casas ortogonais.
4. Apoio aéreo/drone: agora causa dano somente à unidade ou célula de base selecionada; não atinge as demais casas da antiga área 3×3.
5. Mensagens de esquiva: a esquiva efetiva mostra aviso de dois segundos tanto contra tiro direto quanto contra disparo automático de base.
6. Defesa terrestre da base: além do disparo ao entrar, cada base em modo terrestre pode disparar novamente uma vez em cada nova rodada contra uma unidade inimiga que permaneça dentro de sua área 3×3. O controle de rodada é aplicado no modo local e no modo contra a máquina.

## Validação
- Sintaxe JavaScript validada.
- Referências de cache offline verificadas.
- A partida completa precisa ser testada manualmente no navegador.
