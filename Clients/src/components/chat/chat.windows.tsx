import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { ChatData, MessageData } from "../../lib/types";

import { toast } from "sonner";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import io from "socket.io-client";
import chatService from "../../api/services/chat.service";

type SocketClient = ReturnType<typeof io>;

interface ChatWindowProps {
  chat: ChatData;
  onClose?: () => void;
}

export default function ChatWindow({ chat, onClose }: ChatWindowProps) {
  const { userData } = useContext(AppContext);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<SocketClient | null>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 50);
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await chatService.getChatMessages(chat.id);
      setMessages(data);
      scrollToBottom();
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  }, [chat.id, scrollToBottom]);

  useEffect(() => {
    fetchMessages();

    // Create Socket.IO connection
    socketRef.current = io(import.meta.env.VITE_BACKEND_URL || "", {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    // Set up event listener for receiving messages
    socketRef.current.on("receive_message", (message: MessageData) => {
      if (message.chatId === chat.id) {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      }
    });

    // Cleanup function to disconnect socket when component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [chat.id, fetchMessages, scrollToBottom]); // Added `fetchMessages` to the dependency array

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      // Emit the message event through Socket.IO
      if (socketRef.current) {
        socketRef.current.emit("send_message", {
          chatId: chat.id,
          content: newMessage,
        });
      }

      // Optimistically add message to UI
      if (userData) {
        const optimisticMessage: MessageData = {
          id: Date.now().toString(),
          content: newMessage,
          chatId: chat.id,
          senderId: userData.id,
          createdAt: new Date().toISOString(),
          read: false,
          sender: {
            id: userData.id,
            name: userData.name,
            image: userData.image,
          },
        };

        setMessages([...messages, optimisticMessage]);
      }

      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b shrink-0">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={
                userData?.role === "USER"
                  ? chat.dermatologist.image
                  : chat.user.image
              }
            />
            <AvatarFallback>
              {(userData?.role === "USER"
                ? chat.dermatologist.name
                : chat.user.name
              ).charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">
              {userData?.role === "USER"
                ? chat.dermatologist.name
                : chat.user.name}
            </h3>
            <p className="text-sm text-foreground/70">
              {userData?.role === "USER" ? "Dermatologist" : "Patient"}
            </p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      <div className="flex-1 min-h-0 p-4 overflow-y-auto ">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4 ">
            {messages.map((message) => {
              const isOwnMessage = message.sender.id === userData?.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${
                    isOwnMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      isOwnMessage
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isOwnMessage
                          ? "text-primary-foreground/70"
                          : "text-foreground/70"
                      }`}
                    >
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2 p-4 border-t shrink-0 bg-background max-md:mb-12"
      >
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className=""
        />
        <Button type="submit" size="icon" className="shrink-0">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
