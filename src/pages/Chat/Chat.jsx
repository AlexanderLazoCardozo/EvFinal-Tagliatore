import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./Chat.css";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);

  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:3000");

    socketRef.current.on("connect", () => {
      setUserId(socketRef.current.id);
    });

    socketRef.current.on("chat", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Enviar mensaje al servidor
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socketRef.current.emit("chat", message);
      setMessage("");
    }
  };

  return (
    <div id="bodychat" className="container-fluid h-100">
      <div className="row justify-content-center h-100">
        <div className="col-md-8 col-xl-6 chat">
          <div className="card chat-card d-flex flex-column h-100">
            {/* Cabecera del Chat */}
            <div className="card-header msg_head">
              <div className="d-flex bd-highlight align-items-center">
                <div className="img_cont">
                  <img
                    src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"
                    className="rounded-circle user_img"
                    alt="Chat Persona 1"
                  />
                  <span className="online_icon"></span>
                </div>
                <div className="user_info ms-3">
                  <span>Chat Persona 1</span>
                  <p>1767 Messages</p>
                </div>
                <div className="ms-auto video_cam">
                  <span className="me-2">
                    <i className="fas fa-video"></i>
                  </span>
                  <span>
                    <i className="fas fa-phone"></i>
                  </span>
                </div>
              </div>
            </div>

            {/* Cuerpo del Chat */}
            <div className="card-body msg_card_body flex-grow-1" id="mensajes">
              {messages.map((msg, index) => {
                const isUserMessage = msg.userId === userId;
                return (
                  <div
                    key={index}
                    className={`d-flex justify-content-${
                      isUserMessage ? "end" : "start"
                    } mb-4`}
                  >
                    {isUserMessage ? (
                      <>
                        <div className="msg_cotainer_send">
                          {msg.text}
                          <span className="msg_time_send">IZQ</span>
                        </div>
                        <div className="img_cont_msg">
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
                            className="rounded-circle user_img_msg"
                            alt="User"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="img_cont_msg">
                          <img
                            src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"
                            className="rounded-circle user_img_msg"
                            alt="Persona"
                          />
                        </div>
                        <div className="msg_cotainer">
                          {msg.text}
                          <span className="msg_time">DERECHA</span>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Input del Mensaje */}
            <form id="form-mensaje" onSubmit={handleSubmit} className="p-3">
              <div className="input-group">
                <input
                  id="valor-INPUT"
                  type="text"
                  className="form-control type_msg"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button className="btn btn-primary send_btn" type="submit">
                  <i className="fas fa-location-arrow"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
