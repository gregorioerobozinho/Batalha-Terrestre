# Batalha Terrestre — V13: acabamento visual da interface

## Alterações
1. As bases agora recebem tonalidade conforme a equipe proprietária (azul, verde, rosa, amarelo ou vermelho), sem confundir defesa terrestre com antiaérea.
2. Criada arte vertical original de cenário para o fundo lateral da interface. O fundo escuro externo foi substituído por imagem de vale de batalha com rio, montanhas, trilhas, veículos, avião e drone, mantendo contraste sob o conteúdo.
3. As reservas de tanque e patrulha agora usam as artes individuais do jogo em vista superior, com quantidade em destaque.
4. Território ocupado agora aparece com barra de progresso, percentual, cor da equipe e quantidade de casas.
5. Ao passar o mouse sobre qualquer veículo, inclusive inimigo, o navegador exibe proprietário, defesa antiaérea, esquiva, disponibilidade de apoio aéreo/drone, danos e estado das ações na rodada.
6. Ao passar o mouse sobre a base, exibe proprietário, modo de defesa, células restantes, estado do centro e disponibilidade do disparo terrestre da rodada.

## Validação
- Sintaxe JavaScript validada.
- Arquivos de interface e imagens incluídos no cache offline.
- A interação de tooltip depende do atributo title nativo do navegador e funciona também para unidades adversárias.
- Teste visual e funcional final deve ser realizado em navegador com Live Server.
