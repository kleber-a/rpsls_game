✨ RPSLS Game

Um jogo de duelo baseado no clássico Pedra, Papel, Tesoura, Lagarto e Spock, desenvolvido com Angular no front-end e Node.js / Socket.IO no back-end.
O projeto permite que usuários se conectem em salas, escolham avatares e joguem partidas em tempo real.

O repositório é organizado em duas pastas:

rpsls_game_front — Front-end (Angular)

rpsls_game_back — Back-end (Node.js + Socket.IO + MongoDB)

🚀 Tecnologias utilizadas
🔹 Front-end

Angular
 — SPA e lógica de interface

TypeScript
 — Tipagem estática

Angular Material
 — Componentes de UI

RxJS
 — Programação reativa

🔹 Back-end

Node.js
 — Servidor

Express
 — API e roteamento

Socket.IO
 — Comunicação em tempo real

MongoDB
 — Banco de dados NoSQL

🎯 Funcionalidades
🖥️ Front-end

Tela de login e escolha de avatar

Criação e entrada em salas de duelo

Exibição de placar e resultados das partidas

Interface responsiva e animada

⚙️ Back-end

Gerenciamento de salas e partidas em tempo real

Armazenamento de usuários e resultados no MongoDB

Validação de jogadas e sincronização entre jogadores

Eventos Socket.IO para conexão, partidas e mensagens

🧠 Arquitetura

Front-end separado do back-end (arquitetura desacoplada)

Comunicação em tempo real via WebSocket (implementada com Socket.IO)

Persistência de dados com MongoDB