import express from "express";
import RoomController from "../controllers/roomController.js";

const routes = express.Router();

routes.get("/room", RoomController.listRooms);
routes.post("/room", RoomController.createRoom);
routes.post("/room/join", RoomController.joinRoom);


export default routes;