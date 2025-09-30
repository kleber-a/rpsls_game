# ✨ RPSLS Game

Um jogo de duelo baseado no clássico **Pedra, Papel, Tesoura, Lagarto e Spock**, desenvolvido com **Angular** no front-end e **Node.js / Socket.IO** no back-end.
O projeto permite que usuários se conectem em salas, escolham avatares e joguem partidas em tempo real.

**🎮 Clique no giff abaixo para jogar agora!**

[![Acesse o jogo](https://media3.giphy.com/media/CV61LRKyQf6P6/giphy.gif)](https://rpsls-game-front.vercel.app/)



https://github.com/user-attachments/assets/3e3aa6a0-eb14-4445-8bdd-80e889929ac4


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
* Interface para criar nome e escolher avatar do jogador
* Entrada em salas de jogo multiplayer
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
URL=url_front_end
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



## ⚡ Como rodar a aplicação
### 🔹 Back-end

1. Abra o terminal e navegue até a pasta do back-end:
```bash
cd rpsls_game_back
```
2. Instale as dependências:
```bash
npm install
```
3. Certifique-se de ter o arquivo `.env` configurado com:
```bash
PORT=3000
MONGO_URI=seu_mongodb_uri
URL=url_front_end
```
4. Inicie o servidor:
```bash
npm run dev
```
O servidor ficará disponível em `http://localhost:3000`.

### 🔹 Front-end

1. Abra outro terminal e navegue até a pasta do front-end:
```bash
cd rpsls_game_front
```
2. Instale as dependências:
```bash
npm install
```
3. Configure a URL da API no arquivo `src/environments/environment.ts`:
```bash
export const environment = {
  API_URL: 'http://localhost:3000' //URL BackEnd
};
```
4. Inicie a aplicação Angular:
```bash
ng serve
```
O front-end estará disponível em `http://localhost:4200`.



## 🔥 Roadmap de Melhorias
* Multiplayer com ranking global
* Sistema de chat dentro das salas
* Testes E2E
* Melhorias na UI e animações

## 🤝 Contribuição
Sinta-se à vontade para abrir uma **issue** ou enviar um **pull request**.

## 📝 Licença
Este projeto está sob a licença MIT.
