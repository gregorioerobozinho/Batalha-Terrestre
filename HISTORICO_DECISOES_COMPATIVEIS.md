# Batalha Terrestre — consolidação de referências antigas com decisões posteriores

Este documento registra a análise dos três materiais históricos enviados e separa:
1. decisões antigas que continuam válidas;
2. decisões antigas que foram substituídas por acordos posteriores;
3. elementos que são apenas estrutura ou referência visual, e não funcionalidades já concluídas.

## 1. Imagem: “Opções do jogo para o jogador”

A imagem confirma estas opções, todas compatíveis com as decisões posteriores:

### Contra Provações
- O jogador escolhe uma das duas identidades: **Varão — Azul** ou **Varoa — Rosa**.
- A máquina é sempre **Provações — Vermelho**.
- A identidade/cor da máquina não é uma escolha do usuário.

### Dois jogadores no mesmo aparelho
- Cada jogador escolhe sua identidade e cor.
- Combinações disponíveis:
  - Varão — Azul;
  - Varão — Verde;
  - Varoa — Rosa;
  - Varoa — Amarela.
- Os dois jogadores não podem escolher a mesma cor/equipe.

### Situação na V9
A lógica de seleção da V9 já contempla essas opções: modo contra Provações limitado a Azul/Rosa; modo local com as quatro combinações; Provações sempre Vermelho; e bloqueio de equipes repetidas. Portanto, a imagem confirma a lógica existente, não exige uma regra nova.

## 2. Pacote “Batalha_Terrestre_Pacote_Imagens”

O ZIP contém `images.js`, um README e pastas vazias (`.gitkeep`). **Não contém os PNGs individuais finais.** O README deixa isso explícito: trata-se de um catálogo/estrutura para receber imagens futuras, não de uma biblioteca pronta.

### Especificações visuais compatíveis que ficam preservadas
- Vista superior/ortográfica e enquadramento consistente.
- Tanque: frente, direita, esquerda e trás; estados normal, defesa antiaérea e esquiva.
- Patrulha: frente, direita, esquerda e trás; estados normal e esquiva. A patrulha não possui defesa antiaérea própria.
- Avião e drone: quatro orientações.
- Explosão para impactos terrestres.
- Fumaça de bombardeio cobrindo área 3×3.
- Fumaça de queda com duração de 1.000 ms.
- Destroços de tanque, patrulha, avião e drone persistem até o fim da partida e não bloqueiam movimento, construção ou ocupação.
- Cores de equipe previstas: azul, verde, rosa, amarelo e vermelho.
- As variantes de cor devem ser artes próprias, não filtros CSS que prejudiquem os detalhes.

### Relação com a V9
A V9 já possui sprites SVG individuais para as unidades e estados disponíveis, além de SVGs de explosão, fumaça, destroços e territórios. O atlas de peças enviado pelo usuário está incluído na V9 como referência visual. O pacote histórico não fornece os PNGs isolados, portanto não é correto afirmar que seus sprites finais já foram integrados. O catálogo PNG do ZIP fica como especificação para eventual substituição/expansão futura, sem substituir os SVGs que o jogo usa hoje.

## 3. Programa “Batalha_Terrestre_V1_Programa”

O V1 é identificado pelo próprio README como protótipo inicial de menus, perfis, cenário e configuração. Ele não implementava o jogo completo.

### Regras e opções antigas que continuam válidas
- Dois modos: contra a máquina e dois jogadores no mesmo aparelho.
- Provações é sempre Vermelho.
- Perfis contra a máquina: Varão Azul ou Varoa Rosa.
- Perfis locais: Varão Azul, Varão Verde, Varoa Rosa ou Varoa Amarela.
- Partida local no mesmo aparelho, com tabuleiro e recursos visíveis durante a troca de jogador.
- Três operações por rodada.
- Cada peça pode ser acionada uma vez por rodada.
- Entrada da reserva consome uma operação e ocorre na linha inicial da equipe, na casa escolhida pelo jogador.
- Salvamento local e funcionamento offline continuam como objetivos do projeto.
- Destroços não bloqueiam o tabuleiro; fumaça dura 1 segundo, conforme catálogo visual.

### Decisões do V1 substituídas por acordos posteriores
- **Dificuldade Fácil/Médio/Difícil:** substituída pelo acordo posterior de uma única dificuldade da máquina: **Padrão**. Não reintroduzir os três níveis.
- **Primeiro movimento no PvP “não definido”:** já foi decidido posteriormente que o primeiro jogador alterna entre partidas consecutivas.
- **Primeiro movimento contra Provações:** já foi decidido que Provações começa a primeira partida e o primeiro jogador alterna nas partidas seguintes.
- **Dimensões 10 colunas × 16 linhas:** a interface e o código posteriores adotaram 16 colunas × 10 linhas (A–P e linhas 1–10), como mostrado na referência visual mais recente. A V1 não deve reverter a orientação posterior.
- **Salvar apenas a configuração:** substituído pelo objetivo posterior de salvar/retomar o estado tático da partida.

### Limite importante
O V1 não comprova implementação de movimentação, combate, IA, bases, reservas, mensagens bíblicas, áudio ou salvamento tático. Ele serve como registro histórico das opções iniciais, não como fonte de funcionalidades atuais.

## 4. Resultado da conciliação

| Item | Decisão consolidada |
|---|---|
| Identidades contra Provações | Varão Azul ou Varoa Rosa |
| Equipe da máquina | Provações Vermelho, fixa |
| Identidades no PvP local | Varão Azul/Verde; Varoa Rosa/Amarela |
| Dificuldade da máquina | Padrão, nível único |
| Primeiro movimento contra máquina | Provações na primeira partida; alternância nas seguintes |
| Primeiro movimento PvP | Alternância entre partidas |
| Tabuleiro | 16 colunas × 10 linhas, conforme interface posterior |
| Operações | 3 por rodada; cada peça uma vez por rodada |
| Entrada da reserva | Consome operação; jogador escolhe casa na própria linha inicial |
| Artes | Vista superior, orientações e estados distintos; catálogo antigo é especificação, não PNG final |
| Fumaça | 1.000 ms |
| Destroços | Persistem até o fim; sem colisão |

## 5. O que foi acrescentado nesta consolidação

- Este documento passa a acompanhar o projeto como referência histórica reconciliada.
- O catálogo antigo de imagens foi preservado como especificação de produção, sem fingir que os PNGs inexistentes foram integrados.
- Nenhuma regra posterior foi revertida.
- Nenhuma mecânica ainda não implementada é declarada como concluída.
