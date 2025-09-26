import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  socketId: { type: String, required: true },
  name: { type: String, required: true },
  avatar: { type: String, default: '' },
  choice: { type: Array, default: [] },
  score: { type: Number, default: 0 },
  selected: { type: Boolean, default: false},
  winner: { type: Boolean, default: false}
});

const roomSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId },
  roomName: { type: String, required: true },
  status: { type: String, enum: ["waiting", "playing", "finished"], default: "waiting" },
  players: [playerSchema],
  roundNumber: { type: Number, default: 1 },
  roundNumberMax: { type: Number, default: 10 },
  history: { type: Object, default: {} },
  lastResult: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const room = mongoose.model("room", roomSchema);

export default room;