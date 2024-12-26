import { useRef } from "react";
import { useNavigate } from "react-router";

function Landing() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const roomIdRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (
      !usernameRef.current ||
      !roomIdRef.current ||
      usernameRef.current.value === "" ||
      roomIdRef.current.value === ""
    )
      return;
    localStorage.setItem("username", usernameRef.current.value);
    localStorage.setItem("roomId", roomIdRef.current.value);
    navigate("/chat");
  };
  return (
    <div className="h-screen w-screen bg-gray-900">
      <div className="w-full md:w-4/5 p-4 mx-auto h-screen flex flex-col justify-center items-center">
        <input
          type="text"
          placeholder="Room Code..."
          ref={roomIdRef}
          className="bg-gray-700 w-72 text-white text-lg my-3 mx-auto py-1 px-4 rounded-2xl outline-none"
        />
        <input
          type="text"
          placeholder="Username"
          ref={usernameRef}
          className="bg-gray-700 w-72 text-white text-lg my-3 mx-auto py-1 px-4 rounded-2xl outline-none"
        />
        <button
          onClick={handleSubmit}
          className="bg-purple-700 py-1 px-4 rounded-2xl text-lg font-medium hover:bg-purple-500 transition-all my-3 text-white"
        >
          Start Chatting!
        </button>
      </div>
    </div>
  );
}

export default Landing;
