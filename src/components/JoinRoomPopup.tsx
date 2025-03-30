import { useState } from "react";


const JoinRoomPopup = ({ isOpen, onClose, onJoin }: any) => {
  const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4 text-blue-500">Join Room</h2>
        <input
          type="text"
          placeholder="Enter Name"
          className="w-full p-2 border text-black border-blue-400 rounded mb-2"
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Room ID"
          className="w-full p-2 border text-black border-blue-400 rounded mb-4"
          onChange={(e) => setRoomId(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button className="cursor-pointer px-4 py-2 bg-gray-400 rounded" onClick={onClose}>Cancel</button>
          <button disabled={!userName ||!roomId} className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded" onClick={() => onJoin(userName, roomId)}>Join</button>
        </div>
      </div>
    </div>
  );
};

export default JoinRoomPopup;
