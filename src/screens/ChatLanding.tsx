import { useEffect, useState } from "react";
// import { Button } from "../components/Button";
import { useChat } from "../Context/ChatContext";
import { useNavigate } from "react-router-dom";
import JoinRoomPopup from "../components/JoinRoomPopup";
import CreateRoomPopup from "../components/CreateRoomPopup";
import { Button } from "antd";

const ChatLanding = () => {
  const { createChat, roomId, isCreatingRoom } = useChat();
  const navigate = useNavigate();

  const [joinRoomPopup, setJoinRoomPopup] = useState(false);
  const [isCreateRoomPopupVisible, setIsCreateRoomPopupVisible] =
    useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (roomId) navigate(`/chat/${roomId}/?name=${userName}`);
  }, [roomId]);

  const onJoinRoom = (userName: string, roomId: string) => {
    navigate(`/chat/${roomId}?name=${userName}`);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <h1 className="text-2xl text-blue-500 font-bold mb-4">
          Chat Application
        </h1>
        <div className="flex flex-col md:flex-row gap-6">
          <Button
            className="w-48"
            type="primary"
            onClick={() => setIsCreateRoomPopupVisible(true)}
          >
            {!isCreatingRoom ? "Start New Group Chat" : "Creating Party..."}
          </Button>
          <Button type="primary" className="w-48" onClick={() => setJoinRoomPopup(true)}>
            Join Chat
          </Button>
        </div>
        <JoinRoomPopup
          isModalOpen={joinRoomPopup}
          onClose={() => setJoinRoomPopup(false)}
          onJoinRoom={onJoinRoom}
          handleCancel={() => setJoinRoomPopup(false)}
          userName={userName}
          setUserName={setUserName}
        ></JoinRoomPopup>
      </div>

      <CreateRoomPopup
        isModalOpen={isCreateRoomPopupVisible}
        handleOk={() => {
          createChat(userName);
        }}
        handleCancel={() => setIsCreateRoomPopupVisible(false)}
        onNameChange={(e) => setUserName(e.target.value)}
        userName={userName}
      />
    </>
  );
};

export default ChatLanding;
