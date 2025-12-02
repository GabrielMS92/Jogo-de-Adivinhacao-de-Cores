# Jogo de Adivinhação de Cores

# Sobre o Projeto
Este projeto consiste em um Jogo de Adivinhação de Cores interativo desenvolvido como avaliação final (C3) para a disciplina de Desenvolvimento de Aplicações Web I, ministrada pelo Prof. Otávio Lube dos Santos no curso de Análise e Desenvolvimento de Sistemas da Faesa.

O objetivo foi criar uma aplicação que manipulasse o DOM, utilizasse eventos de usuário e lógica de programação para criar uma experiência gamificada, indo além dos requisitos básicos com uma interface moderna e funcionalidades de persistência de dados (atendendo ao critério de criatividade do edital).

# Como Jogar
1. Acesse o link: https://gabrielms92.github.io/Jogo-de-Adivinhacao-de-Cores/
2. Observe: O fundo da tela contém todas as cores possíveis.
3. Chute: Digite o nome da cor (PT ou EN) na caixa de texto **OU** clique diretamente na cor desejada no fundo da tela.
4. Acumule Pontos: Acerte para aumentar sua sequência (Streak).
5. Ranking: Se sua pontuação for alta o suficiente, grave seu nome no Hall da Fama!

# Funcionalidades
O projeto atende a todos os requisitos do edital e inclui features extras:

# Mecânicas Principais
1. Sorteio Aleatório: O jogo escolhe uma cor aleatória de uma lista predefinida.
2. Sistema de Vidas: O jogador possui 3 tentativas para acertar.
3. Dicas Visuais: Animação de "Shake" (tremor) quando o usuário erra.
4. Input Inteligente: Aceita nomes de cores em Português (ex: Vermelho) ou Inglês (ex: Red), com tratamento para maiúsculas/minúsculas.

# Diferenciais (Extras)
1. Design Neon & Glassmorphism: Interface moderna com efeito de vidro fosco e cores vibrantes sobre fundo escuro.
2. Ranking Global (LocalStorage): Sistema de High Score persistente. Se você entrar no Top 10, seu nome fica salvo no navegador mesmo se fechar a página.
3. Score Infinito: A pontuação não zera ao perder uma vida ou reiniciar a rodada (apenas o multiplicador de sequência zera), incentivando o jogo contínuo.
4. Sistema de Streak: Quanto mais acertos consecutivos, mais pontos você ganha por rodada.
5. Fundo Interativo: O background é composto por faixas clicáveis das cores disponíveis. Clicar em uma faixa preenche automaticamente o campo de resposta (ótimo para acessibilidade e agilidade).

# Tecnologias Utilizadas
1. HTML5: Estrutura semântica (header, main, footer).
2. CSS3: Variáveis CSS (:root) para fácil manutenção de temas; Flexbox para layout responsivo; Animações (@keyframes) e Transições suaves; Efeito backdrop-filter para o vidro.
3. JavaScript (ES6+): Manipulação avançada do DOM; Math.random para lógica do jogo; localStorage API para salvar o Ranking; Array de Objetos para mapeamento bilingue (PT/EN).
FontAwesome: Ícones para UI (Troféu, Coroa, etc).
