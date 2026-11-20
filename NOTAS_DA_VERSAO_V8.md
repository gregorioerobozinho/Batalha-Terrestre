# Batalha Terrestre — V8 (correções de inicialização)

## Correções desta entrega
- Removida uma regra CSS que havia sido anexada por engano ao fim de `src/game.js`. Esse erro impedia o navegador de carregar o módulo JavaScript e, consequentemente, bloqueava os controles de modo, seleção dos jogadores e início da partida.
- A opção Jogador 2 agora tem sua visibilidade inicializada ao carregar a tela e é atualizada ao trocar o modo.
- Ajustado o enquadramento da capa para priorizar o emblema e o título, reduzindo o corte da arte.
- Adicionado o elemento de status de voo que o código da animação aérea utiliza, evitando erro ao iniciar apoio aéreo.

## Testes executados
- Verificação de sintaxe do módulo JavaScript como ES module.
- Verificação de integridade do ZIP.
- Conferência da existência do elemento `flight-status`.

## Observação
Esta versão corrige os três problemas relatados na tela de preparação. Ainda é necessário testar as partidas completas no navegador e validar separadamente todas as regras de combate e animações.
