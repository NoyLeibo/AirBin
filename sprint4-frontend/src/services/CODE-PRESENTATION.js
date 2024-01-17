// BACKEND
socket.on("set-user-socket", (userId) => {
  socket.userId = userId;
});

socket.on("direct-emit", (data) => {
  emitToUser(data);
});

async function emitToUser({ type, data, userId }) {
  userId = userId.toString();
  const socket = await _getUserSocket(userId);

  if (socket) {
    socket.emit(type, data);
  }
}

// FRONTEND
socket.on(SOCKET_EVENT_ORDER_RECIEVED, async (data) => {
  toast("A new reservation has been recieved from " + data.from);
  const updatedHost = await userService.getById(data.to);
  await updateUser(updatedHost);
});

// COMPONENT ORDER
async function onConfirm() {
  const newTrip = createTrip();
  const updatedUser = await userService.updateTripList(newTrip);
  await updateUser(updatedUser);
  orderSend();
}

function orderSend() {
  const data = {
    from: user.username,
    to: stay.host._id,
  };
  const type = SOCKET_EVENT_ORDER_RECIEVED;
  socketService.emit("direct-emit", {
    type,
    data,
    userId: stay.host._id,
  });
}
