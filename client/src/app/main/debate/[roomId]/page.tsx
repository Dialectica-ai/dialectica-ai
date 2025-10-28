"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { IconMessage } from "@tabler/icons-react";
import { getSocket } from "@/lib/socket";
import { MessageInput } from "./message-input";
import { useSession } from "next-auth/react";

interface ChatPageProps {}

// added this for the structure of messages
interface ChatMessage {
  user: string;
  content: string;
  sender: string;
  timestamp: number;
  type: "chat" | "system";
  role?: "pro" | "con";
}

const ChatPage: React.FC<ChatPageProps> = () => {
  const params = useParams();
  const router = useRouter();
  const {data} =useSession();
  
  const roomId = params.roomId as string;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  // State to track, to prevent duplicate welcome messages.
  const [hasAddedWelcomeMessage, setHasAddedWelcomeMessage] = useState(false);

  const socketRef = useRef<any>(null);

  // Join room on mount:
  useEffect(() => {
    if (roomId) {
      socketRef.current = getSocket();

      // Generate or retrieve persistent user ID
      let persistentUserId = localStorage.getItem("dialectica_user_id");
      if (!persistentUserId) {
        persistentUserId = `user_${Math.random().toString(36).substring(2, 11)}`;
        localStorage.setItem("dialectica_user_id", persistentUserId);
        console.log("🆔 [Client] Generated new persistent userId:", persistentUserId);
      } else {
        console.log("🆔 [Client] Retrieved persistent userId:", persistentUserId);
      }

      // Set current user ID to persistent ID
      setCurrentUserId(persistentUserId);

      // Identify user to server with persistent ID
      if (socketRef.current.connected) {
        socketRef.current.emit("identify", persistentUserId);
        setIsConnected(true);
      }

      // event listeners, Chat and System messages ===>
      const historyHandler = (
        history: Array<{ sender: string; content: string; timestamp: number; role?: string }>
      ) => {
        console.log(
          "📥 [Client] Received room-history:",
          history?.length || 0,
          "messages",
          history
        );
        setMessages(
          (history || []).map((msg) => ({
            user: msg.sender,
            sender: msg.sender,
            content: msg.content,
            timestamp: msg.timestamp || Date.now(),
            type: "chat" as const,
            role: msg.role as "pro" | "con" | undefined,
          }))
        );
        console.log("✅ [Client] Messages state updated with history");
      };
      const chatHandler = (msg: {
        sender: string;
        content: string;
        timestamp: number;
        role?: string;
      }) => {
        setMessages((prev) => [
          ...prev,
          {
            user: msg.sender,
            sender: msg.sender,
            content: msg.content,
            timestamp: msg.timestamp || Date.now(),
            type: "chat" as const,
            role: msg.role as "pro" | "con" | undefined,
          },
        ]);
      };

      const systemHandler = (msg: string) => {
        setMessages((prev) => [
          ...prev,
          {
            user: "system",
            sender: "system",
            content: msg,
            timestamp: Date.now(),
            type: "system",
          },
        ]);
      };

      console.log("🔌 [Client] Registering socket listeners for room:", roomId);
      socketRef.current.on("room-history", historyHandler);
      socketRef.current.on("chat-message", chatHandler);
      socketRef.current.on("system-message", systemHandler);

      // changed joinRoom logic to handle random room users [works for now]

      socketRef.current.on("connect", () => {
        setIsConnected(true);
        // On reconnect, re-identify with persistent user ID
        const persistentUserId = localStorage.getItem("dialectica_user_id");
        if (persistentUserId && socketRef.current) {
          socketRef.current.emit("identify", persistentUserId);
          setCurrentUserId(persistentUserId);
          console.log("🔄 [Client] Reconnected and re-identified as:", persistentUserId);
        }
      });

      socketRef.current.on("disconnect", () => {
        setIsConnected(false);
      });

      // Check if user came from random room (already joined via requestRandomRoom)
      const urlParams = new URLSearchParams(window.location.search);
      const fromRandom = urlParams.get("fromRandom");

      if (fromRandom && !hasAddedWelcomeMessage) {
        console.log("🎲 [Client] Coming from random room, skipping joinRoom emit");
        // For random room users, send a welcome message since they're already in the room
        setMessages((prev) => [
          ...prev,
          {
            user: "system",
            sender: "system",
            content: `You joined room: ${roomId}`,
            timestamp: Date.now(),
            type: "system",
          },
        ]);

        setHasAddedWelcomeMessage(true);

        // Clear the URL parameter to prevent duplicate messages on re-render (idk if it really does help solve the issue. but works for now)
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      } else if (!fromRandom) {
        // calling joinRoom if NOT coming from random room
        console.log("🚪 [Client] Emitting joinRoom for:", roomId);
        socketRef.current.emit("joinRoom", roomId);
      }

      return () => {
        if (socketRef.current) {
          socketRef.current.off("room-history", historyHandler);
          socketRef.current.off("chat-message", chatHandler);
          socketRef.current.off("system-message", systemHandler);
          socketRef.current.off("connect");
          socketRef.current.off("disconnect");
        }
      };
    }
  }, [roomId, hasAddedWelcomeMessage]);

  // Reference to the end of messages for auto-scrolling:
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleLeaveRoom = () => {
    router.push("/main");
  };

  const handleSend = (message: string) => {
    if (message.trim() && roomId && socketRef.current && isConnected) {
      console.log("[Client] Sending message to room:", roomId, "Message:", message);
      socketRef.current.emit("sendMessage", message, roomId);
    } else {
      console.warn("[Client] Cannot send message:", {
        hasInput: !!message.trim(),
        hasRoomId: !!roomId,
        hasSocket: !!socketRef.current,
        isConnected,
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full max-w-screen mx-auto border-0 md:border border-neutral-200 dark:border-neutral-700 overflow-hidden h-screen md:rounded-md">
      <div className="flex flex-1 w-full">
        <div className="p-4 md:p-6 lg:p-10 md:rounded-tl-2xl border-0 md:border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-4 md:gap-6 flex-1 w-full h-full overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 md:pb-6 border-b border-gray-200 dark:border-neutral-700 gap-3 sm:gap-0 flex-shrink-0">
            <div className="min-w-0 flex-1">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-neutral-100 truncate">
                Dialectica AI
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 truncate">
                  Room:{" "}
                  <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                    {roomId}
                  </span>
                </p>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <span
                    className={`text-xs font-medium ${isConnected ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                  >
                    {isConnected ? "Connected" : "Disconnected"}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleLeaveRoom}
              className="px-4 py-2 md:px-5 md:py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors text-sm md:text-base whitespace-nowrap flex-shrink-0"
            >
              Leave Room
            </button>
          </div>

          <div className="border border-gray-200 dark:border-neutral-700 rounded-xl p-3 md:p-6 flex-1 bg-white dark:bg-neutral-800 overflow-y-auto min-h-0">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center px-4">
                <div className="text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 bg-gray-100 dark:bg-neutral-700 rounded-full flex items-center justify-center">
                    <IconMessage className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-neutral-400 text-base md:text-lg font-medium">
                    No messages yet
                  </p>
                  <p className="text-gray-400 dark:text-neutral-500 text-xs md:text-sm mt-1">
                    Start the conversation!
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 md:gap-4">
                {messages.map((msg, idx) => {
                  const isOwnMessage = msg.sender === currentUserId;
                  return (
                    <div key={idx} className={`${msg.type === "system" ? "text-center" : ""}`}>
                      {msg.type === "system" ? (
                        <div className="flex justify-center px-2">
                          <div className="px-3 py-1.5 md:px-4 md:py-2 bg-blue-100 dark:bg-blue-600/5 rounded-full text-xs md:text-sm text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 max-w-full break-words">
                            {msg.content}
                          </div>
                        </div>
                      ) : (
                        <div className={`flex gap-2 md:gap-3 ${isOwnMessage ? "flex-row-reverse" : ""} px-1`}>
                          <div
  className={`w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 ${
    isOwnMessage ? "bg-green-500" : "bg-blue-500"
  }`}
>
  {isOwnMessage && data?.user?.image ? (
    <img
      src={data.user.image}
      alt={data.user.name ? `${data.user.name}'s avatar` : "User avatar"}
      className="w-full h-full object-cover"
      onError={(e)=>{
        e.currentTarget.style.display='none';
      }}
    />
  ) : (
    <span className="text-white text-xs md:text-sm font-semibold">
      {msg.user.substring(0, 2).toUpperCase()}
    </span>
  )}
</div>

                         
    
  


                          <div
                            className={`min-w-0 max-w-[calc(100%-3rem)] md:max-w-[75%] ${isOwnMessage ? "ml-auto" : ""}`}
                          >
                            <div
                              className={`flex items-center gap-2 mb-1 ${isOwnMessage ? "flex-row-reverse" : ""}`}
                            >
                              <span
                                className={`text-xs md:text-sm font-semibold truncate ${msg.role === "pro" ? "text-blue-600" : msg.role === "con" ? "text-red-600" : "text-gray-900 dark:text-gray-100"}`}
                              >
                                {isOwnMessage
                                  ? "You"
                                  : msg.user.length > 15
                                    ? msg.user.substring(0, 15) + "..."
                                    : msg.user}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                                {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>

                            <div
                              className={`${isOwnMessage ? "bg-gray-200 dark:bg-neutral-600 text-gray-900 dark:text-gray-100 rounded-2xl rounded-tr-sm" : "bg-gray-50 dark:bg-neutral-700 rounded-2xl rounded-tl-sm"} px-3 py-2 md:px-4 md:py-3 border ${isOwnMessage ? "border-gray-300 dark:border-neutral-500" : "border-gray-200 dark:border-neutral-600"} break-words`}
                            >
                              <span
                                className={`${isOwnMessage ? "text-gray-900 dark:text-gray-100" : "text-gray-900 dark:text-gray-100"} leading-relaxed text-sm md:text-base`}
                              >
                                {msg.content}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="flex gap-2 md:gap-3 pt-4 md:pt-6 border-t border-gray-200 dark:border-neutral-700 flex-shrink-0">
            <MessageInput
              messageInput={messageInput}
              setMessageInput={setMessageInput}
              onSend={handleSend}
              isConnected={isConnected}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;