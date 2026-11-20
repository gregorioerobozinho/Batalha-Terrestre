# Batalha Terrestre — V12: cenário e correções de combate

## 1. Cenário visual
- Adicionado cenário tático ilustrado em SVG 16:10 com relevo, vegetação, rio, trilhas e áreas rochosas.
- O cenário é exibido por trás das casas do tabuleiro; as cores de território permanecem visíveis por transparência.
- A nova arte é incluída no cache offline.

## 2. Ataque terrestre
- Tanque: alcance máximo de 5 casas ortogonais.
- Patrulha: alcance máximo de 3 casas ortogonais.
- A seleção de ataque procura o primeiro veículo/base na linha de tiro, respeitando bloqueios.
- Se o alvo for inválido ou estiver fora do alcance, o ataque é cancelado, não consome operação e a unidade volta ao modo de seleção normal.
- Incluído botão explícito para cancelar a seleção de alvo.

## 3. Defesa terrestre automática da base
- Quando uma unidade inimiga entra pela primeira vez na área 3×3 de uma base em modo terrestre, a base realiza um disparo equivalente ao de tanque.
- Cada base pode realizar no máximo um disparo terrestre automático por rodada.
- A esquiva da unidade pode evitar esse disparo.

## 4. Defesa antiaérea
- Tanque com defesa antiaérea ativada intercepta avião/drone somente quando a rota passa pela casa exata do tanque.
- Base em modo antiaéreo intercepta avião/drone quando a rota passa por qualquer casa de sua área 3×3.
- Interceptação abate o recurso aéreo e cancela o bombardeio; o recurso de apoio é consumido, conforme a regra de que a defesa abate o avião/drone.

## Validação
- Sintaxe JavaScript verificada com Node.
- Referências dos elementos HTML e arquivos do cache offline serão conferidas no pacote.
- A execução integral de partida no navegador ainda requer teste manual no VS Code/Live Server.
