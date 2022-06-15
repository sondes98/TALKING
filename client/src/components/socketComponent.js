import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";

export default function SocketComponent () {
  const [socket, setSocket] = useState("");
  const ENDPOINT = "http://127.0.0.1:8000";

  const socketSetup = () => {
    const token = localStorage.getItem("token");
    if (token && !socket) {
      const newSocket = socketIOClient(ENDPOINT, {
        query: {
          token: localStorage.getItem("token"),
        },
      });
      newSocket.on("disconnect", () => {
        setSocket(null);
        // setTimeout(socketSetup, 3000);
        console.log("Socket Disconnected!");
      });
      newSocket.on("connect", () => {
        console.log("Socket Connected!");
      });
      setSocket(newSocket);
    }
  };

  useEffect(() => {
    socketSetup();
    //eslint-disable-next-line
  }, []);

  return <p>connected</p>;
}
