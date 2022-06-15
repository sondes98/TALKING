import "./App.css";
import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import PostDetails from "./pages/postDetails";
import Chat from "./components/chat";
import Profile from "./pages/profile";
import Navbar from "./components/navbar";
import socketIOClient from "socket.io-client";

function App() {
  const [socket, setSocket] = useState("");
  const ENDPOINT = "http://127.0.0.1:8000";
  const socketSetup = () => {
    const token = localStorage.getItem("token");
    if (token) {
      if (token.length > 0 && !socket) {
        const newSocket = socketIOClient(ENDPOINT, {
          query: {
            token: localStorage.getItem("token"),
          },
        });
        newSocket.on("disconnect", () => {
          setSocket(null);
          setTimeout(socketSetup, 3000);
          console.log("Socket Disconnected!");
        });
        newSocket.on("connect", () => {
          console.log("Socket Connected!");
        });
        setSocket(newSocket);
      }
    }
  };

  useEffect(() => {
    socketSetup();
    //eslint-disable-next-line
  }, []);
  return (
    <div className="App">
      <>
        {/* LOAD OR UNLOAD THE CLIENT */}
        <Navbar />
        <Routes>
          <Route
            path="/login"
            element={<LoginPage socketSetup={socketSetup} />}
          />
          <Route
            path="/register"
            element={<RegisterPage socketSetup={socketSetup} />}
          />
          <Route exact path="/Chat/:id" element={<Chat socket={socket} />} />
          <Route exact path="/profile" element={<Profile socket={socket} />} />
          {/* <Route exact path="/post/:id" component={PostDetails} /> */}
          <Route exact path="/post/:id" element={<PostDetails />} />
        </Routes>
      </>
    </div>
  );
}

export default App;
