const express = require("express");
const { ExpressPeerServer, PeerServer } = require("peer");
const { v4: uuidv4 } = require("uuid");
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

const server = require("http").Server(app);
const io = require("socket.io")(server);
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);
  });
});

server.listen(3030, () => {
  console.log("server is listening on port 3030");
});
