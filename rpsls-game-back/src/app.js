import express from "express";
import { Server } from "socket.io";
import http from "http";
import routes from "./routes/index.js";
import connectionDataBase from "../config/dbConnect.js";
import cors from "cors";

const connect = await connectionDataBase();

connect.on("error", (erro) => {
    console.error("erro de conexão", erro)
});

connect.once("open", () => {
    console.log('conexão com o banco feita com sucesso')
});

const app = express();

const corsOptions = {
  origin: process.env.URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
};

app.use(cors(corsOptions));

routes(app);

const serverHttp = http.createServer(app);

const io = new Server(serverHttp, {
  cors: {
    origin: process.env.URL,
    methods: ["GET", "POST"]
  }
});

export { serverHttp, io };
