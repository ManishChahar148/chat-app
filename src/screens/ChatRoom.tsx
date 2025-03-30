import { useEffect, useRef, useState } from "react";
import { useChat } from "../Context/ChatContext";
import { useLocation, useParams } from "react-router-dom";
import { Button } from "../components/Button";

const ChatRoom = () => {
  const [messageInput, setMessageInput] = useState("");
  const { id: existingRoomId } = useParams<{ id: string | undefined }>();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userName = params.get("name") || "";

  const { messages, sendMessage, roomId, joinRoom, isConnected, userData } =
    useChat();

  // Ref for the chat container
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!roomId && isConnected) {
      console.log("joining room effect", roomId, existingRoomId);
      setTimeout(() => {
        existingRoomId && joinRoom(existingRoomId, userName);
      }, 5000);
    }
  }, [isConnected]);

  // Auto-scroll to the bottom when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const onSubmitMessage = (e: any) => {
    e.preventDefault();
    console.log("submit");
    sendMessage(messageInput);
    setMessageInput("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl text-blue-500 font-bold mb-4">Chat Room</h1>
      <div className="w-full max-w-lg bg-white p-4 shadow-md rounded-lg flex flex-col">
        {/* Chat Container with Ref */}
        <div
          ref={chatContainerRef}
          className="h-96 overflow-y-auto border-b mb-2 p-2"
        >
          {messages.map((msg, index) => {
            const isCurrentUserText = userData.name === msg.data.userNickname;
            const displayName = isCurrentUserText
              ? "You"
              : msg.data.userNickname;
            const isSystemMessage = msg.data.isSystemMessage;
            return (
              <div
                key={index}
                className={`p-2
                ${isSystemMessage ? "text-gray-500 !text-center" : "text-black"}
                ${isCurrentUserText ? "text-right" : "text-left"}
                `}
              >
                <span
                  className={`text-xs ${isCurrentUserText ? "pr-2" : "pl-2"}`}
                >
                  {displayName}
                </span>{" "}
                <br />
                <span
                  className={`${
                    isSystemMessage ? "bg-transparent" : "bg-blue-100"
                  } px-3 py-2 rounded-full mt-4 text-xs`}
                >
                  {" "}
                  {msg.data.body}
                </span>
              </div>
            );
          })}
        </div>

        {/* Message Input */}
        <form onSubmit={onSubmitMessage} className="flex gap-2 mt-2">
          <input
            type="text"
            className="flex-1 border text-black border-blue-300 p-2 rounded-lg"
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
