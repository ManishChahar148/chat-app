import { useEffect, useRef, useState } from "react";
import { useChat } from "../Context/ChatContext";
import { useLocation, useParams } from "react-router-dom";
// import { Button } from "../components/Button";
import { Button, Input } from "antd";

const ChatRoom = () => {
  const [messageInput, setMessageInput] = useState("");
  const { id: existingRoomId } = useParams<{ id: string | undefined }>();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userName = params.get("name") || "";

  const {
    messages,
    roomId,
    connectionState,
    userData,
    typingData,
    sendMessage,
    joinRoom,
    setTypingPresence,
    userList,
  } = useChat();

  // Ref for the chat container
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!roomId && connectionState === "connected") {
      setTimeout(() => {
        existingRoomId && joinRoom(existingRoomId, userName);
      }, 3000);
    }
  }, [connectionState]);

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
    sendMessage(messageInput);
    setMessageInput("");
  };
  const onlyCurrentUserTyping =
    typingData?.usersTyping?.length === 1 &&
    typingData?.usersTyping?.includes(userData?.data?.userId);

  const isChatConnecting =
    connectionState === "connecting" || messages.length === 0;
  console.log(
    onlyCurrentUserTyping,
    "onlyCurrentUserTyping",
    typingData?.usersTyping,
    userData
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 md:p-4">
      <h1 className="text-2xl text-blue-500 font-bold mb-4">Chat Room</h1>
      <div className="w-full max-w-lg bg-white p-4 shadow-md rounded-lg flex flex-col">
        {/* Chat Container with Ref */}
        <div
          ref={chatContainerRef}
          className="h-96 overflow-y-auto border-b mb-2 p-2"
        >
          {isChatConnecting && (
            <div className="text-black text-center">Loading chats...</div>
          )}
          {messages.map((msg: any, index) => {
            const isCurrentUserText = userData.name === msg.data.userNickname;
            const displayName = isCurrentUserText
              ? "You"
              : msg?.data?.userNickname;
            const isSystemMessage = msg?.data?.isSystemMessage;
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
                  {msg?.data?.body}
                </span>
              </div>
            );
          })}
        </div>

        {/* Message Input */}
        <p className="text-black text-xs pl-2">
          {!onlyCurrentUserTyping && typingData?.anyoneTyping ? (
            <span>
              {userList
                .filter((user) =>
                  typingData?.usersTyping?.includes(user.socketConnectionId) && user.socketConnectionId !== userData?.data?.userId
                )
                .slice(0, 1)
                .map((user) => (
                  <span>{user?.userSettings?.userNickname}</span>
                ))}{" "}

              {typingData.usersTyping.length > 1 && !typingData?.usersTyping?.includes(userData?.data?.userId) && `+${typingData.usersTyping.length - 1} other `}

              typing...
            </span>
          ) : (
            ""
          )}
        </p>
        <form onSubmit={onSubmitMessage} className="flex gap-2 mt-2">
          <Input
            type="text"
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onFocus={() => setTypingPresence(true)}
            onBlur={() => setTypingPresence(false)}
            disabled={isChatConnecting}
          />
          <Button type="primary" loading={isChatConnecting}>
            {!isChatConnecting && "Send"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
