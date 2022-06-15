import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";

const Chat = ({ socket }) => {
  const params = useParams();
  const chatroomId = params.id;
  const [messages, setMessages] = useState([]);
  const messageRef = useRef();
  const [userId, setUserId] = useState("");

  const sendMessage = () => {
    if (socket) {
      socket.emit("chatroomMessage", {
        chatroomId,
        message: messageRef.current.value,
      });

      messageRef.current.value = "";
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
    }
    if (socket) {
      socket.on("newMessage", (message) => {
        const newMessages = [...messages, message];
        setMessages(newMessages);
      });
    }
    //eslint-disable-next-line
  }, [messages]);
  useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", {
        chatroomId,
      });
    }

    return () => {
      //Component Unmount
      if (socket) {
        socket.emit("leaveRoom", {
          chatroomId,
        });
      }
    };
    //eslint-disable-next-line
  }, []);
  return (
    <div>
      <p>{chatroomId}</p>
      <div className="chatroomPage">
        <div className="chatroomSection">
          <div className="cardHeader">Chatroom Name</div>
          <div className="chatroomContent">
            {messages.map((message, i) => (
              <div key={i} className="message">
                <span
                  style={
                    userId === message.userId
                      ? { color: "red" }
                      : { color: "green" }
                  }
                >
                  <img src={message.avatar} alt="" style={{ width: "5%" }} />
                  {message.name}:
                </span>{" "}
                {message.message}
              </div>
            ))}
          </div>
          <div className="chatroomActions">
            <div>
              <input
                type="text"
                name="message"
                placeholder="Say something!"
                ref={messageRef}
              />
            </div>
            <div>
              <button className="join" onClick={sendMessage}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
