import { createContext, useContext, useState, useEffect } from "react";
import {
  SessionChatMessage,
  SocketEventHandler,
  SocketMessageTypes,
  TelepartyClient,
} from "teleparty-websocket-lib";

interface ChatContextType {
  client: TelepartyClient | null;
  connectionState: string;
  messages: SessionChatMessage[];
  createChat: (userName: string) => void;
  roomId: string;
  sendMessage: (message: string) => void;
  joinRoom: (message: string, name: string) => void;
  isCreatingRoom: boolean;
  userData: any;
  setTypingPresence: (value: boolean) => void;
  typingData: { anyoneTyping: boolean; usersTyping: string[] };
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [client, setClient] = useState<TelepartyClient | null>(null);
  const [connectionState, setIsConnectionState] = useState("");
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [messages, setMessages] = useState<any>([]);
  const [roomId, setRoomId] = useState("");
  const [userData, setUserData] = useState<any>();
  const [typingData, setTypingData] = useState<any>();

  const handleReceivedMessage = (message: any) => {
    console.log("MESSAGE RECEIVED", message, JSON.stringify(message));

    if (message.type === "userId") {
      setUserData(message.data);
    }
    if (message.type === SocketMessageTypes.SEND_MESSAGE && message.data.body) {
      // console.log('adding to messages')
      setMessages((prevMsgList: any) => [...prevMsgList, message]);
    }
    if (message.type === SocketMessageTypes.SET_TYPING_PRESENCE) {
      console.log("Typing presence", message.data);
      setTypingData(message.data);
    }
  };

  const eventHandler: SocketEventHandler = {
    onConnectionReady: () => {
      setIsConnectionState("connected");
    },
    onClose: () => {
      setIsConnectionState("");
    },
    onMessage: handleReceivedMessage,
  };

  useEffect(() => {
    const newClient = new TelepartyClient(eventHandler);
    setIsConnectionState("connecting");
    setClient(newClient);
  }, []);

  const createChat = (userName: string) => {
    setIsCreatingRoom(true);
    // setting fixed name for create chat for now
    setUserData({ name: userName });

    client
      ?.createChatRoom(userName)
      .then((roomId) => {
        setIsCreatingRoom(false);
        setRoomId(roomId);
      })
      .catch(() => {
        setIsCreatingRoom(false);
      });
  };

  const sendMessage = (message: string) => {
    client?.sendMessage(SocketMessageTypes.SEND_MESSAGE, {
      body: message,
    });
  };

  const joinRoom = (roomId: string, name: string) => {
    setUserData({ name: name });
    client?.joinChatRoom(name, roomId);
  };

  const setTypingPresence = (value: boolean) => {
    client?.sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE, {
      typing: value,
    });
  };

  return (
    <ChatContext.Provider
      value={{
        client,
        connectionState,
        messages,
        isCreatingRoom,
        userData,
        roomId,
        createChat,
        sendMessage,
        joinRoom,
        setTypingPresence,
        typingData,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
