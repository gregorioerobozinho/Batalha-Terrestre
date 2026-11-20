# Batalha Terrestre — V14: feedback de combate e fumaça

## Mensagens rápidas (2 segundos)
- Unidade atingida: informa tanque/patrulha e impactos acumulados.
- Unidade destruída: aviso destacado.
- Esquiva preparada: aparece ao ativar a ação.
- Esquiva efetiva: aparece quando a unidade evita um ataque direto ou disparo terrestre de base.
- Avião/drone abatido: informa interceptação antiaérea.
- Bombardeio: informa que avião/drone atingiu a área.
- Base atingida/destruída: informa dano à estrutura.

## Fumaça
- Refeito o efeito CSS de fumaça com camadas radiais, expansão e elevação gradual.
- Fumaça reaplicada depois das renderizações, para não ser removida pela atualização do tabuleiro.
- Aplicada em área 3×3 para ataques terrestres e bombardeios; no ponto de interceptação aérea e no ponto de entrada atingido pela defesa da base.

## Validação
- Sintaxe JavaScript validada com Node.
- Cache offline incrementado para V14.
- Teste completo de combate ainda requer execução manual no navegador.
