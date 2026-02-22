import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ArrowLeft, Search } from "lucide-react";
import { toast } from "sonner";
import { ChatData } from "../../lib/types";


import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import chatService from "../../api/services/chat.service";
import ChatWindow from "../../components/chat/chat.windows";

export default function Chat() {
  const { setIsLoading } = useContext(AppContext);
  const [chats, setChats] = useState<ChatData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChat, setSelectedChat] = useState<ChatData | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setIsLoading(true);
        const data = await chatService.getChats();
        setChats(data);
      } catch (error) {
        console.error("Error fetching chats:", error);
        toast.error("Failed to load chats");
      } finally {
        setIsLoading(false);
      }
    };
    fetchChats();
  }, [setIsLoading]);

  const filteredChats = chats.filter((chat) =>
    chat.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container h-[calc(100vh-4rem)] px-4 py-8 mx-auto">
      <div className="flex h-full overflow-hidden border rounded-lg">
        {/* Chat List */}
        <div
          className={`w-full border-r md:w-80 ${
            isMobileView && selectedChat ? "hidden" : "block"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <h2 className="mb-4 text-xl font-bold">Messages</h2>
              <div className="relative">
                <Search className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-foreground/50" />
                <Input
                  className="pl-10"
                  placeholder="Search chats..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredChats.map((chat) => (
                <Button
                  key={chat.id}
                  variant="ghost"
                  className="flex items-start justify-start w-full gap-3 p-4 h-fit hover:bg-muted"
                  onClick={() => setSelectedChat(chat)}
                >
                  <Avatar>
                    <AvatarImage src={chat.user.image} />
                    <AvatarFallback>{chat.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="font-medium">{chat.user.name}</p>
                    {chat.messages && chat.messages.length > 0 && (
                      <p className="text-sm text-foreground/70">
                        {chat.messages[chat.messages.length - 1].content}
                      </p>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div
          className={`flex-1 ${
            isMobileView && !selectedChat ? "hidden" : "block"
          }`}
        >
          {selectedChat ? (
            <div className="h-full">
              {isMobileView && (
                <div className="p-2 border-b">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedChat(null)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to chats
                  </Button>
                </div>
              )}
              <ChatWindow chat={selectedChat} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h3 className="mb-2 text-lg font-medium">Select a chat</h3>
              <p className="text-sm text-foreground/70">
                Choose a conversation to start messaging
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
