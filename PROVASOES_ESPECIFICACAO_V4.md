# Provações — Especificação implementada (V4)

## Personalidade
Dominação total; ofensiva, paciente na preparação, orgulhosa, persistente e de alto risco, mas não imprudente com tanques em armadilhas evidentes. Não desiste enquanto a partida permitir continuar.

## Prioridades táticas
1. Aproveitar oportunidades claras de eliminar unidades e vencer.
2. Concentrar ataques no alvo que possa ser destruído com maior eficiência.
3. Usar avião/drone quando a área 3x3 produzir vantagem e não causar dano aliado desnecessário.
4. Implantar reforços imediatamente quando houver espaço na linha inicial.
5. Avançar para criar linhas de tiro, cercos e ameaças a bases.
6. Construir bases em rede quando não houver ação ofensiva melhor.
7. Preservar unidades quando uma perseguição revelar uma armadilha provável.

## Planejamento
- Até três operações por turno.
- Cada peça só realiza uma operação por rodada, respeitando G.used.
- Oportunidades são avaliadas a cada operação; isso não equivale a revisão estratégica completa.
- Revisão estratégica ampla a cada cinco rodadas.

## Memória
- Grava eventos observáveis do jogador: movimento, ataque, construção e implantação.
- Mantém até 500 eventos no localStorage.
- Não acessa informação oculta.
- Memória é local ao aparelho/navegador.

## Limitações conhecidas
A IA opera sobre as mecânicas efetivamente presentes no V3. Rotas aéreas completas, defesa automática das bases, interceptação aérea em rota e outras regras avançadas não são simuladas integralmente nesta entrega. A implementação da IA não certifica o jogo inteiro como pronto para lançamento.
