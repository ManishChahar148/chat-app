import { createContext, useContext, useState, useEffect } from "react";
import {
  SocketEventHandler,
  SocketMessageTypes,
  TelepartyClient,
} from "teleparty-websocket-lib";

interface ChatContextType {
  client: TelepartyClient | null;
  isConnected: boolean;
  messages: any[];
  createChat: () => void;
  roomId: string;
  sendMessage: (message: string) => void;
  joinRoom: (message: string, name: string) => void;
  isCreatingRoom: boolean;
  userData: any;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [client, setClient] = useState<TelepartyClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [messages, setMessages] = useState<any>([]);
  const [roomId, setRoomId] = useState("");
  const [userData, setUserData] = useState<any>();

  const handleReceivedMessage = (message: any) => {
    console.log("MESSAGE RECEIVED", message, JSON.stringify(message));
    if (message.type === "userId") {
      setUserData(message.data);
    }
    if ((message.type = "sendMessage" && message.data.body)) {
      // console.log('adding to messages')
      setMessages((prevMsgList: any) => [...prevMsgList, message]);
    }
    if (message.type === undefined) {
      console.log("user list => ", message);
    }
  };

  console.log("all messages", messages);

  const eventHandler: SocketEventHandler = {
    onConnectionReady: () => {
      setIsConnected(true);
      console.log("connetced");
    },
    onClose: () => {
      setIsConnected(false);
    },
    onMessage: handleReceivedMessage,
  };

  useEffect(() => {
    const newClient = new TelepartyClient(eventHandler);
    setClient(newClient);
  }, []);

  const createChat = () => {
    setIsCreatingRoom(true);
    setUserData({ name: "Manish" });
    const res = client
      ?.createChatRoom("Manish")
      .then((roomId) => {
        setIsCreatingRoom(false);
        setRoomId(roomId);
      })
      .catch(() => {
        setIsCreatingRoom(false);
      });
    console.log("Chat Room Created: ", res);
  };

  const sendMessage = (message: string) => {
    const msg = client?.sendMessage(SocketMessageTypes.SEND_MESSAGE, {
      body: message,
    });

    console.log("Message Sent: ", msg);
  };

  const joinRoom = (roomId: string, name: string) => {
    setUserData({ name: name });
    const res = client?.joinChatRoom(name, roomId);
    console.log("JOINED ROOM : ", res);
  };

  return (
    <ChatContext.Provider
      value={{
        client,
        isConnected,
        messages,
        isCreatingRoom,
        userData,
        roomId,
        createChat,
        sendMessage,
        joinRoom,
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
