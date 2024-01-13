import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import {
  socketService,
  SOCKET_EMIT_SEND_MSG,
  SOCKET_EVENT_ADD_MSG,
  SOCKET_EMIT_SET_TOPIC,
} from "../services/socket.service";

export function Messages() {
  const loggedInUser = useSelector((storeState) => storeState.userModule.user);

  const [msg, setMsg] = useState({ txt: "" });
  const [msgs, setMsgs] = useState([]);
  const [topic, setTopic] = useState("Love");
  const [isBotMode, setIsBotMode] = useState(false);

  const botTimeoutRef = useRef();

  useEffect(() => {
    socketService.on(SOCKET_EVENT_ADD_MSG, addMsg);
    return () => {
      socketService.off(SOCKET_EVENT_ADD_MSG, addMsg);
      botTimeoutRef.current && clearTimeout(botTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    socketService.emit(SOCKET_EMIT_SET_TOPIC, topic);
  }, [topic]);

  function addMsg(newMsg) {
    setMsgs((prevMsgs) => [...prevMsgs, newMsg]);
  }

  function sendBotResponse() {
    // Handle case: send single bot response (debounce).
    botTimeoutRef.current && clearTimeout(botTimeoutRef.current);
    botTimeoutRef.current = setTimeout(() => {
      setMsgs((prevMsgs) => [
        ...prevMsgs,
        { from: "Bot", txt: "You are amazing!" },
      ]);
    }, 1250);
  }

  function sendMsg(ev) {
    ev.preventDefault();
    const from = loggedInUser?.fullname || "Guest";
    const newMsg = { from, txt: msg.txt };
    socketService.emit(SOCKET_EMIT_SEND_MSG, newMsg);
    if (isBotMode) sendBotResponse();
    // We add the msg ourself to our own state
    addMsg(newMsg);
    setMsg({ txt: "" });
  }

  function handleFormChange(ev) {
    const { name, value } = ev.target;
    setMsg((prevMsg) => ({ ...prevMsg, [name]: value }));
  }

  return (
    <section className="chat">
      <h1>Your messages!</h1>
      <form onSubmit={sendMsg}>
        <input
          type="text"
          value={msg.txt}
          onChange={handleFormChange}
          name="txt"
          autoComplete="off"
        />
        <button>Send</button>
      </form>

      <ul>
        {msgs.map((msg, idx) => (
          <li key={idx}>
            {msg.from}: {msg.txt}
          </li>
        ))}
      </ul>
    </section>
  );
}
