const express = require("express");
const app = express();
const { dbConnection } = require("./config/dbConnection");
const taskRoutes = require("./routes/taskroutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const { redis } = require("./config/redisConnection");
const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer(app);

const userToRoomMap = {};
const socketToNameMap = {};

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

io.on("connection", (Socket) => {
  console.log("A New Device Connected", Socket.id);

  // Socket.on("CanvasData",(msg) => {
  //   //console.log("Canavas Data From FRontEnd!",msg);

  //   Socket.to()
  // })

  Socket.on("create-room", ({roomId,name}) => {
    console.log(`${name} Creating Room In Backend:- `, roomId);
    Socket.join(roomId);
    socketToNameMap[Socket.id] = name;
    userToRoomMap[Socket.id] = roomId;
    console.log(`${Socket.id} Has Created and joined ${roomId}.`);

    io.to(roomId).emit("room-joined", `${name} with Id:- ${Socket.id} has joined ${roomId}.`);
  });

  Socket.on("CanvasData", ({ data }) => {
    //data recieved :-  {data:snapshot,roomId:roomId}
    const roomId = userToRoomMap[Socket.id];
    console.log("Canavas Data From FRontEnd!", `Data:-${data},room:-${roomId}`);
    if(roomId){
      console.log("The Canvas Data Is Emitted From Srrver:- ",data);
    Socket.to(roomId).emit("Update-Data", data);
    }
  });

  Socket.on("join-room", ({room,name}) => {
    Socket.join(room);
    console.log(`A New User ${name} with ${Socket.id} Has joined ${room}`);
    socketToNameMap[Socket.id] = name;
    userToRoomMap[Socket.id] = room;

    Socket.to(room).emit(
      "room-joined",
      `A New User ${name} ${Socket.id} has joined The ${room}`
    );
    console.log(`Emitted to room: ${room}`);
  });

  Socket.on("leave-room", ({ roomId, name }) => {
  console.log(`${name} is leaving room ${roomId}`);
  
  Socket.leave(roomId);

  Socket.to(roomId).emit("user-disconnect", `${name} has left the room ${roomId}.`);
  delete userToRoomMap[Socket.id];
  delete socketToNameMap[Socket.id];
});



  Socket.on("cursor-move",(data) => {
    console.log("Cursor Data:- ",data);
    Socket.to(data.roomId).emit("show-cursor",data);
  })



  Socket.on("disconnect",() => {
   const room = userToRoomMap[Socket.id];
   if(room){
    console.log(`${Socket.id} disconnected from ${room}`);
    //socketToNameMap[Socket.id] = name;
    const userName = socketToNameMap[Socket.id];
    Socket.to(room).emit("user-disconnect",`${userName} disconnected from ${room}`);
    delete userToRoomMap[Socket.id];
    delete socketToNameMap[Socket.id];
   }
});
});

dbConnection();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "https://tasko-frontend-p3y7.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use("/api/v1", taskRoutes);
app.use("/api/v1/user", userRoutes);

// app.use(express.static(path.join(__dirname, "../client/dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/dist/index.html"));
// });

server.listen(3000, () => {
  console.log("Server Started!");
});
