import dotenv from "dotenv";
dotenv.config();
import { io, serverHttp } from "./src/app.js"
import Room from "./src/models/Room.js";

const PORT = process.env.PORT || 3000;


serverHttp.listen(PORT, () => {
    console.log(`Servidor rodando`)
})


io.on("connection", (socket) => {

    // socket.on("joinRoom", async ({ roomName, playerName, avatar }) => {
    //     const room = await Room.findOne({ roomName });
    //     if (!room) return;

    //     const player = room.players.find(p => p.name === playerName);

    //     if (player) {
    //         player.socketId = socket.id;
    //     } else {
    //         room.players.push({ socketId: socket.id, name: playerName, choice: [''], score: 100, selected: false, winner: false, avatar: avatar });
    //     }

    //     if (room.players.length === 2) room.status = "playing";

    //     await room.save();

    //     socket.join(roomName);
    //     io.to(roomName).emit("roomUpdate", room);

    //     const rooms = await Room.find()
    //     io.emit("roomsUpdate", rooms);
    // });

    socket.on("joinRoom", async ({ roomName, playerName, avatar }) => {
        const room = await Room.findOne({ roomName });
        if (!room) return;

        // const existingPlayer = room.players.find(p => p.name === playerName);
        const existingPlayer = room.players.find(p => p.socketId === socket.id);
        if (room.players.length >= 2 && !existingPlayer) {
            socket.emit("roomFull", { message: "A sala já está cheia!" });
            return;
        }

        if (existingPlayer) {
            existingPlayer.socketId = socket.id;
        } else {
            room.players.push({
                socketId: socket.id,
                name: playerName,
                choice: [''],
                score: 100,
                selected: false,
                winner: false,
                avatar: avatar
            });
        }

        if (room.players.length === 2) room.status = "playing";

        await room.save();

        socket.join(roomName);
        io.to(roomName).emit("roomUpdate", room);

        const rooms = await Room.find()
        io.emit("roomsUpdate", rooms);
    });


    socket.on("selectCard", async ({ room, choice, nextPhase }) => {
        try {
            const roundIndex = room.roundNumber - 1;
            let updatedRoom;

            if (!nextPhase) {

                const updatePath = `players.$.choice.${roundIndex}`;
                updatedRoom = await Room.findOneAndUpdate(
                    { roomName: room.roomName, "players.socketId": socket.id },
                    {
                        $set: {
                            [updatePath]: choice,
                            "players.$.selected": true
                        }
                    },
                    { new: true }
                ).exec();

                if (!updatedRoom) {
                    console.warn("Room não encontrada ou player inválido");
                    return;
                }
                io.to(room.roomName).emit("roomUpdate", updatedRoom);
            } else {
                updatedRoom = await Room.findOne({ roomName: room.roomName }).exec();
                const [p1, p2] = updatedRoom.players;
                if (p1.selected && p2.selected && nextPhase) {
                    const rules = {
                        rock: ["scissors", "lizard"],
                        paper: ["rock", "spock"],
                        scissors: ["paper", "lizard"],
                        lizard: ["spock", "paper"],
                        spock: ["scissors", "rock"],
                    };
                    if (p1.choice[roundIndex] === p2.choice[roundIndex]) {
                        updatedRoom.lastResult = "Empate";
                    } else if (rules[p1.choice[roundIndex]].includes(p2.choice[roundIndex])) {
                        p2.score -= 10;
                    } else {
                        p1.score -= 10;
                    }
                    p1.selected = false;
                    p2.selected = false;
                    if (p1.score === 0 || p2.score === 0) {
                        if (p1.score === 0) {
                            p2.winner = true;
                            p1.winner = false;
                            updatedRoom.lastResult = `${p2.name} é o vencedor!!`;
                        }
                        if (p2.score === 0) {
                            p1.winner = true
                            p2.winner = false
                            updatedRoom.lastResult = `${p1.name} é o vencedor!!`;
                        }
                        updatedRoom.status = 'finished';
                        await updatedRoom.save();
                        const rooms = await Room.find()
                        io.emit("roomsUpdate", rooms);


                        setTimeout(async () => {
                            try {
                                await Room.findByIdAndUpdate(updatedRoom._id, {
                                    players: [],
                                    status: "waiting",
                                    roundNumber: 1,
                                    lastResult: ""
                                });

                                const rooms = await Room.find();
                                io.emit("roomsUpdate", rooms);
                            } catch (err) {
                                console.error("Erro ao resetar sala:", err);
                            }
                        }, 15000);


                    } else {
                        updatedRoom.roundNumber++;
                    }
                    await updatedRoom.save();
                }
                io.to(room.roomName).emit("roomUpdate", updatedRoom);
            }

        } catch (err) {
            console.error("Erro no selectCard:", err);
        }
    });


    socket.on("disconnect", async () => {

        const room = await Room.findOne({ "players.socketId": socket.id });
        if (!room) return;

        room.players = room.players.filter(p => p.socketId !== socket.id);

        if (room.status === "finished" && room.players.length === 0) {
            room.status = "waiting";
            room.roundNumber = 1;
            room.lastResult = '';
        } else if (room.status === "playing" && room.players.length < 2) {
            room.status = "waiting";
            room.roundNumber = 1;
            room.lastResult = '';
            room.players.forEach(p => {
                p.score = 100;
                p.selected = false;
                p.winner = false;
                p.choice = [];
            });
        }

        await room.save();

        io.to(room.roomName).emit("roomUpdate", room);

        const rooms = await Room.find();
        io.emit("roomsUpdate", rooms);
    });
})


