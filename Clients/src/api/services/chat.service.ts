
import { ChatData, MessageData } from "../../lib/types";
import apiClient from "../api.client";

const chatService = {
  getChats: async (): Promise<ChatData[]> => {
    const { data } = await apiClient.get("/api/chat");
    return data.chats;
  },

  getChatMessages: async (chatId: string): Promise<MessageData[]> => {
    const { data } = await apiClient.get(`/api/chat/${chatId}/messages`);
    return data.chat.messages;
  },

  createChat: async (dermatologistId: string): Promise<string> => {
    const { data } = await apiClient.post("/api/chat", { dermatologistId });
    return data.chatId;
  },
};

export default chatService;
