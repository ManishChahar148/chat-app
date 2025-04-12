import { Input, Modal } from "antd";
import { useChat } from "../Context/ChatContext";

interface Props {
  handleOk: () => void;
  handleCancel: () => void;
  isModalOpen: boolean;
  onNameChange: (e: any) => void;
  userName: string;
}

const CreateRoomPopup = (props: Props) => {
  const { handleOk, handleCancel, isModalOpen, onNameChange, userName } = props;
  const { isCreatingRoom } = useChat();

  return (
    <Modal
      centered
      title="Create Room"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okButtonProps={{ disabled: !userName, loading: isCreatingRoom }}
    >
      <div className="mt-6">
        <label className="text-sm">Your Name</label>
        <Input
          style={{
            fontSize: "16px",
          }}
          className="capitalize"
          value={userName}
          onChange={onNameChange}
          placeholder="Enter your name"
        />
      </div>
    </Modal>
  );
};

export default CreateRoomPopup;
