import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { useChat } from "../Context/ChatContext";
import { useNavigate } from "react-router-dom";
import JoinRoomPopup from "../components/JoinRoomPopup";

const ChatLanding = () => {
  const { createChat, roomId, isCreatingRoom } = useChat();
  const [joinRoomPopup, setJoinRoomPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (roomId) navigate(`/chat/${roomId}`);
  }, [roomId]);

  const onJoinRoom = (userName: string, roomId: string) => {
    navigate(`/chat/${roomId}?name=${userName}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl text-blue-500 font-bold mb-4">
        Chat Application
      </h1>
      <div className="flex flex-col md:flex-row gap-6">
        <Button className="w-48" onClick={() => createChat()}>
          {!isCreatingRoom ? "Start New Group Chat" : "Creating Party..."}
        </Button>
        <Button className="w-48" onClick={() => setJoinRoomPopup(true)}>
          Join Chat
        </Button>
      </div>
      <JoinRoomPopup
        isOpen={joinRoomPopup}
        onClose={() => setJoinRoomPopup(false)}
        onJoin={onJoinRoom}
      ></JoinRoomPopup>
    </div>
  );
};

export default ChatLanding;
