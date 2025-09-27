# ✨ RPSLS Game

Um jogo de duelo baseado no clássico **Pedra, Papel, Tesoura, Lagarto e Spock**, desenvolvido com **Angular** no front-end e **Node.js / Socket.IO** no back-end.
O projeto permite que usuários se conectem em salas, escolham avatares e joguem partidas em tempo real.

O repositório é organizado em duas pastas:

* `rpsls_game_front` — Front-end (Angular)
* `rpsls_game_back` — Back-end (Node.js + Socket.IO + MongoDB)

## 🚀 Tecnologias utilizadas
### 🔹 Front-end
* [Angular](https://angular.io/)  — SPA e lógica de interface
* [TypeScript](https://www.typescriptlang.org/) — Tipagem estática
* [Angular Material](https://material.angular.io/) — Componentes de UI
* [RxJS](https://rxjs.dev/) — Programação reativa

### 🔹 Back-end
* [Node.js](https://nodejs.org/) — Servidor
* [Express](https://expressjs.com/) — API e roteamento
* [Socket.IO](https://socket.io/) — Comunicação em tempo real
* [MongoDB](https://www.mongodb.com/) — Banco de dados NoSQL

## 🎯 Funcionalidades
### 🖥️ Front-end
* Tela de login e escolha de avatar
* Criação e entrada em salas de duelo
* Exibição de placar e resultados das partidas
* Interface responsiva e animada

### ⚙️ Back-end
* Gerenciamento de salas e partidas em tempo real
* Armazenamento de usuários e resultados no MongoDB
* Validação de jogadas e sincronização entre jogadores
* Eventos Socket.IO para conexão, partidas e mensagens

### 🧠 Arquitetura
* Front-end separado do back-end (arquitetura desacoplada)
* Comunicação em tempo real via WebSocket (implementada com Socket.IO)
* Persistência de dados com MongoDB


## 🔐 Configuração do ambiente
Crie arquivos `.env` nas pastas correspondentes:
#### Back-end (`rpsls_game_back/.env`)

```bash
PORT=3000
MONGO_URI=seu_mongodb_uri
URL=url_backend
```
#### Front-end (`rpsls_game_front/src/environments/environment.ts`)
```bash
API_URL=url_back_end
```


## 📑 Eventos Socket.IO
Principais eventos implementados:
| Evento        | Direção            | Parâmetros                         | Descrição                                                                                                |
| ------------- | ------------------ | ---------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `connection`  | Cliente → Servidor | `socket`                           | Disparado quando um jogador se conecta ao servidor. É dentro dele que os outros eventos são registrados. |
| `joinRoom`    | Cliente → Servidor | `{ roomName, playerName, avatar }` | Jogador entra em uma sala. Se a sala já tiver 2 jogadores, retorna `roomFull`.                           |
| `roomUpdate`  | Servidor → Cliente | `room`                             | Atualiza o estado da sala (jogadores, placar, rodada, status, etc.).                                     |
| `roomsUpdate` | Servidor → Cliente | `rooms`                            | Envia a lista de todas as salas disponíveis.                                                             |
| `selectCard`  | Cliente → Servidor | `{ room, choice, nextPhase }`      | Jogador seleciona uma carta (escolha da rodada) ou solicita avanço de fase.                              |
| `roomFull`    | Servidor → Cliente | `{ message }`                      | Retorno quando um jogador tenta entrar em uma sala já cheia.                                             |
| `disconnect`  | Servidor → Cliente | `socket.id`                        | Atualiza a sala quando um jogador sai (remove player, reseta status/rodada se necessário).               |




## 🏗️ Room & Player Schema (Mongoose)

### 📌 Player Schema
| Campo      | Tipo    | Obrigatório | Default | Descrição                     |
| ---------- | ------- | ----------- | ------- | ----------------------------- |
| `socketId` | String  | ✅ Yes       | -       | ID do socket do jogador       |
| `name`     | String  | ❌ No       | -       | Nome do jogador               |
| `avatar`   | String  | ❌ No        | `''`    | Avatar do jogador             |
| `choice`   | Array   | ❌ No        | `[]`    | Escolhas do jogador           |
| `score`    | Number  | ❌ No        | `0`     | Pontuação                     |
| `selected` | Boolean | ❌ No        | `false` | Se o jogador já fez a escolha |
| `winner`   | Boolean | ❌ No        | `false` | Se o jogador venceu a rodada  |


### 📌 Room Schema
| Campo            | Tipo           | Obrigatório | Default     | Descrição                                        |
| ---------------- | -------------- | ----------- | ----------- | ------------------------------------------------ |
| `id`             | ObjectId       | ❌ No        | -           | ID único da sala                                 |
| `roomName`       | String         | ✅ Yes       | -           | Nome da sala                                     |
| `status`         | String (enum)  | ❌ No        | `"waiting"` | Estado da sala: `waiting`, `playing`, `finished` |
| `players`        | [PlayerSchema] | ❌ No        | -           | Lista de jogadores                               |
| `roundNumber`    | Number         | ❌ No        | `1`         | Número atual da rodada                           |
| `roundNumberMax` | Number         | ❌ No        | `10`        | Número máximo de rodadas                         |
| `history`        | Object         | ❌ No        | `{}`        | Histórico da sala                                |
| `lastResult`     | String         | ❌ No        | `''`        | Último resultado                                 |
| `createdAt`      | Date           | ❌ No        | `Date.now`  | Data de criação da sala                          |



## 🔥 Roadmap de Melhorias
* Multiplayer com ranking global
* Sistema de chat dentro das salas
* Testes E2E
* Melhorias na UI e animações

## 🤝 Contribuição
Sinta-se à vontade para abrir uma **issue** ou enviar um **pull request**.

## 📝 Licença
Este projeto está sob a licença MIT.
