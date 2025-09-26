import express from "express";
import room from "./roomRoutes.js";


const routes = (app) => {
    app.use(express.json());
    app.route("/").get((req, res) => res.status(200).send(`
    <h1>API de Rooms - Socket.IO</h1>
    <p>Esta API utiliza WebSocket via Socket.IO. Aqui estão os eventos disponíveis:</p>
    <ul>
      <li><strong>joinRoom</strong> - Entrar em uma sala existente ou criar jogador. <br>
          <em>Dados esperados:</em> { roomName, playerName, avatar }</li>

      <li><strong>selectCard</strong> - Seleciona uma carta durante a rodada. <br>
          <em>Dados esperados:</em> { room, choice, nextPhase } <br>
          <em>nextPhase:</em> true para processar resultados, false para apenas registrar a escolha.</li>

      <li><strong>disconnect</strong> - Evento automático ao desconectar. Remove o jogador da sala.</li>
    </ul>
    <p>As atualizações das salas são emitidas para os clientes via:</p>
    <ul>
      <li><strong>roomUpdate</strong> - Atualiza os dados da sala específica.</li>
      <li><strong>roomsUpdate</strong> - Atualiza a lista de todas as salas.</li>
      <li><strong>roomFull</strong> - Emitido se a sala estiver cheia.</li>
    </ul>
    <p>Use um cliente Socket.IO para se conectar e interagir com a API.</p>
  `))
    app.use(express.json(), room);

}

export default routes;