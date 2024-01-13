import { logger } from "./logger.service.js";
import { Server } from "socket.io";

var gIo = null;

export function setupSocketAPI(server) {
  var userMap = new Map();
  gIo = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  gIo.on("connection", (socket) => {
    logger.info(`New connected socket [id: ${socket.id}]`);
    socket.on("disconnect", (socket) => {
      logger.info(`Socket disconnected [id: ${socket.id}]`);
    });

    socket.on("chat-set-topic", (topic) => {
      if (socket.myTopic === topic) return;
      if (socket.myTopic) {
        socket.leave(socket.myTopic);
        logger.info(
          `Socket is leaving topic ${socket.myTopic} [id: ${socket.id}]`
        );
      }
      socket.join(topic);
      socket.myTopic = topic;
    });

    socket.on("chat-send-msg", (msg) => {
      logger.info(`New chat msg from socket [id: ${socket.id}] ${msg.txt}`);
      // emits to all sockets:
      // gIo.emit('chat addMsg', msg)
      // emits only to sockets in the same room except the sender!
      socket.broadcast.to(socket.myTopic).emit("chat-add-msg", msg);
    });

    socket.on("chat-send-msg-username", (data) => {
      emitToUserByUsername(data);
    });

    socket.on("set-user-socket-username", (username) => {
      logger.info(
        `Setting socket.userId = ${username} for socket [id: ${socket.id}]`
      );
      socket.username = username;
    });

    socket.on("user-watch", (userId) => {
      logger.info(
        `user-watch from socket [id: ${socket.id}], on user ${userId}`
      );
      userArr.push(userId);
      console.log(userArr);
      socket.join("watching:" + userId);
    });

    socket.on("set-user-socket", (userId) => {
      logger.info(
        `Setting socket.userId = ${userId} for socket [id: ${socket.id}]`
      );
      socket.userId = userId;
    });

    socket.on("unset-user-socket", () => {
      logger.info(`Removing socket.userId for socket [id: ${socket.id}]`);
      delete socket.userId;
    });
  });
}

function emitTo({ type, data, label }) {
  if (label) gIo.to("watching:" + label.toString()).emit(type, data);
  else gIo.emit(type, data);
}

async function emitToUser({ type, data, userId }) {
  userId = userId.toString();
  const socket = await _getUserSocket(userId);

  if (socket) {
    logger.info(
      `Emiting event: ${type} to user: ${userId} socket [id: ${socket.id}]`
    );
    socket.emit(type, data);
  } else {
    logger.info(`No active socket for user: ${userId}`);
    // _printSockets()
  }
}

async function emitToUserByUsername({ type, data, username }) {
  const socket = await _getUserSocketUsername(username);

  if (socket) {
    logger.info(`Emiting event: ${type} to user: ${username} data: ${data}`);
    socket.emit(type, data);
  } else {
    logger.info(`No active socket for user: ${username}`);
    // _printSockets()
  }
}

// If possible, send to all sockets BUT not the current socket
// Optionally, broadcast to a room / to all
async function broadcast({ type, data, room = null, userId }) {
  userId = userId.toString();

  logger.info(`Broadcasting event: ${type}`);
  const excludedSocket = await _getUserSocket(userId);
  if (room && excludedSocket) {
    logger.info(`Broadcast to room ${room} excluding user: ${userId}`);
    excludedSocket.broadcast.to(room).emit(type, data);
  } else if (excludedSocket) {
    logger.info(`Broadcast to all excluding user: ${userId}`);
    excludedSocket.broadcast.emit(type, data);
  } else if (room) {
    logger.info(`Emit to room: ${room}`);
    gIo.to(room).emit(type, data);
  } else {
    logger.info(`Emit to all`);
    gIo.emit(type, data);
  }
}

async function _getUserSocket(userId) {
  const sockets = await _getAllSockets();
  const socket = sockets.find((s) => s.userId === userId);
  return socket;
}

async function _getUserSocketUsername(username) {
  const sockets = await _getAllSockets();
  const socket = sockets.find((s) => s.username === username);
  return socket;
}
async function _getAllSockets() {
  // return all Socket instances
  const sockets = await gIo.fetchSockets();
  return sockets;
}

async function _printSockets() {
  const sockets = await _getAllSockets();
  console.log(`Sockets: (count: ${sockets.length}):`);
  sockets.forEach(_printSocket);
}
function _printSocket(socket) {
  console.log(`Socket - socketId: ${socket.id} userId: ${socket.userId}`);
}

export const socketService = {
  // set up the sockets service and define the API
  setupSocketAPI,
  // emit to everyone / everyone in a specific room (label)
  emitTo,
  // emit to a specific user (if currently active in system)
  emitToUser,
  // Send to all sockets BUT not the current socket - if found
  // (otherwise broadcast to a room / to all)
  broadcast,
};
