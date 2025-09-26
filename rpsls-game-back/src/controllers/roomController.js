import room from "../models/Room.js";

class RoomController {
    static async listRooms(req, res, next) {
        try {
            const listRooms = await room.find({});
            res.status(200).json(listRooms);
        } catch (error) {
            res.status(500).json({ message: "Erro interno no servidor" })
        }
    }


    static async createRoom(req, res) {
        try {
            const { roomName, playerName } = req.body;

            if (!roomName || !playerName) {
                return res.status(400).json({ message: "roomName e playerName são obrigatórios" });
            }
            let existingRoom = await room.findOne({ roomName });

            if (existingRoom) {
                return res.status(400).json({ message: "Essa sala já existe!" });
            }

            const newRoom = new room({
                roomName,
                players: [{ socketId: null, name: playerName, choice: null, score: 0 }],
                status: "waiting",
                roundNumber: 1
            });

            await newRoom.save();
            res.status(201).json(newRoom);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao criar sala" });
        }
    }


    static async joinRoom(req, res) {
        try {
            const { roomName, playerName } = req.body;

            let existingRoom = await room.findOne({ roomName });

            if (!existingRoom) {
                return res.status(404).json({ message: "Sala não encontrada" });
            }

            if (existingRoom.players.length >= 2) {
                return res.status(400).json({ message: "Sala cheia!" });
            }

            existingRoom.players.push({ socketId: null, name: playerName, choice: null, score: 0 });

            if (existingRoom.players.length === 2) {
                existingRoom.status = "playing";
            }

            await existingRoom.save();
            res.status(200).json(existingRoom);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao entrar na sala" });
        }
    }



}

export default RoomController;