import React, { useState } from "react";
import { Button, Input, Modal } from "antd";

interface Props {
  handleOk: () => void;
  handleCancel: () => void;
  isModalOpen: boolean;
  onNameChange: (e: any) => void;
  userName: string;
}

const CreateRoomPopup = (props: Props) => {
  const { handleOk, handleCancel, isModalOpen, onNameChange, userName } = props;

  return (
    <Modal
      centered
      title="Join Room"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div className="mt-6">
        <label className="text-sm">Your Name</label>
        <Input value={userName} onChange={onNameChange} placeholder="Enter your name" />
      </div>
    </Modal>
  );
};

export default CreateRoomPopup;
