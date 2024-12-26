import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

interface Message {
  message: string;
  username: string;
  timestamp: Date;
}

function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket>();
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const roomId = localStorage.getItem("roomId");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (event) => {
      setMessages((m) => [...m, JSON.parse(event.data)]);
    };

    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId,
          },
        })
      );
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    wsRef.current?.send(
      JSON.stringify({
        type: "chat",
        payload: {
          message: inputRef.current?.value,
          username,
          roomId,
          timestamp: new Date(),
        },
      })
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("roomId");
    wsRef.current?.close();
    navigate("/");
  };
  return (
    <div className="h-screen w-screen bg-gray-900">
      <div className="w-full md:w-4/5 p-4 mx-auto h-screen flex flex-col">
        <div className="h-[10%] w-full flex justify-around items-center text-white">
          <span className="flex flex-col md:flex-row">
            <span className="mx-2">Username: {username}</span>
            <span className="mx-2">Room ID: {roomId}</span>
          </span>
          <button
            onClick={handleLogout}
            className="bg-purple-700 py-1 px-4 rounded-2xl text-base font-medium hover:bg-purple-500 transition-all"
          >
            Logout
          </button>
        </div>
        <div className="max-h-[80%] min-h-[80%] overflow-scroll overflow-x-hidden no-scrollbar  ">
          {messages.map((m, index) => (
            <div
              key={index}
              className={`w-full flex ${
                username === m.username ? `justify-end` : `justify-start`
              }`}
            >
              <div className="bg-white p-3 w-fit h-fit rounded-2xl flex flex-col m-2">
                <div className="text-base">{m.message}</div>
                <div className="flex justify-between italic text-purple-700">
                  <div className="m-1 mr-3 text-sm">{m.username}</div>
                  <div className="m-1 text-sm">
                    {new Date(m.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="h-[10%] w-full flex justify-center items-center">
          <input
            type="text"
            ref={inputRef}
            placeholder="Send a message..."
            className="bg-gray-700 w-72 text-white text-lg mr-3 py-1 px-4 rounded-2xl outline-none"
          />
          <button
            onClick={sendMessage}
            className="bg-purple-700 py-1 px-4 rounded-2xl text-lg font-medium hover:bg-purple-500 transition-all text-white"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
