import { useState } from "react";
import { Input, Modal } from "antd";
import { useChat } from "../Context/ChatContext";

const JoinRoomPopup = (props: any) => {
  const [roomId, setRoomId] = useState("");

  const { handleCancel, isModalOpen, onJoinRoom, userName, setUserName } = props;
  const { isCreatingRoom } = useChat();

  return (
    <Modal
      centered
      title="Join Room"
      open={isModalOpen}
      onOk={() => onJoinRoom(userName, roomId)}
      onCancel={handleCancel}
      okButtonProps={{
        disabled: !userName || !roomId,
        loading: isCreatingRoom,
      }}
    >
      <div className="mt-6">
        <div>
          <label className="text-sm">Your Name</label>
          <Input
            className="capitalize"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
        <div className="mt-4">
          <label className="text-sm">Room Id</label>
          <Input
            className="capitalize"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
      </div>
    </Modal>
  );
};

export default JoinRoomPopup;
