import { showSuccessMsg } from "./event-bus.service";
import { socketService, SOCKET_EVENT_ADD_MSG } from "./socket.service";

export function socketInit() {
  console.log(1);
  socketService.on("order-recieved", (data) => {
    console.log(data);
    showSuccessMsg("Wonderful");
  });
}
