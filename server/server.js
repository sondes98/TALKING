const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
require("dotenv").config();
const connectDB = require("./config/dbLocal");
const path = require("path");
const port = process.env.PORT || 8000;
const swaggerUI = require("swagger-ui-express");
const yaml = require("yamljs");
const jwt = require("jsonwebtoken");
const User = require("./models/userSchema");
const Message = require("./models/messages");

//------------------------------------------------------------------------------//
const socketIo = require("socket.io");
const io = require("socket.io")(server, {
  cors: true,
  origins: ["http://127.0.0.1:8000"],
  methods: ["GET", "POST"],
  credentials: true,
});
// --------------------------connect to the database------------------------------
connectDB();

// --------------------------middleware routing body parse------------------------------
app.use(express.json());

// --------------------------Socket.io------------------------------
// let interval;
io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});
// const getApiAndEmit = (socket) => {
//   const response = new Date();
//   // Emitting a new message. Will be consumed by the client
//   socket.emit("FromAPI", response);
// };
// ---------------------------------Socket io 2----------------------------------------------------//
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.query.token;
    const verifyToken = await jwt.verify(token, process.env.SecretKey);
    if (!verifyToken) res.status(401).json({ msg: "you are not authorized" });
    socket.userID = verifyToken.id;
    next();
  } catch (error) {
    // res.status(500).json({ msg: error });
    // console.log(error);
  }
});
let interval;
io.on("connection", (socket) => {
  console.log("Connected: " + socket.userID);
  socket.on("disconnect", () => {
    console.log("Disconnected: " + socket.userID);
  });
  socket.on("joinRoom", ({ chatroomId }) => {
    socket.join(chatroomId);
    console.log("A user joined chatroom: " + chatroomId);
  });

  socket.on("leaveRoom", ({ chatroomId }) => {
    socket.leave(chatroomId);
    console.log("A user left chatroom: " + chatroomId);
  });

  socket.on("chatroomMessage", async ({ chatroomId, message }) => {
    if (message.trim().length > 0) {
      const user = await User.findOne({ _id: socket.userID });
      const newMessage = new Message({
        chatroom: chatroomId,
        user: socket.userID,
        message,
      });
      io.to(chatroomId).emit("newMessage", {
        message,
        name: user.fullname,
        avatar: user.avatar.imageURL,
        userID: socket.userID,
      });
      await newMessage.save();
    }
  });
});
const getApiAndEmit = (socket) => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};
//---------------------------------Routes----------------------------------------------------//
app.use("/user", require("./routes/userRoutes"));
app.use("/chatroom", require("./routes/chatRoutes"));
app.use("/post", require("./routes/postRoutes"));
app.use('/uploads', express.static(path.join(__dirname, '../', 'uploads')));

//---------------------------swagger---------------------------------------------------//
const swaggerDef = yaml.load("./swagger.yaml");
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDef));
//---------------------------FAWN---------------------------------------------------//

server.listen(port, (error) => {
  error ? console.error(error) : console.log(`Server runing on port ${port}`);
  // logger.info(`Server runing on port ${port}`);
});
