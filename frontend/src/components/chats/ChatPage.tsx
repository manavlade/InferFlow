import { useEffect, useState } from "react";

import {
  fetchConversationById,
  sendMessage,
  type ConversationDetail,
} from "../../api/chats/chat";

import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";

interface ChatPageProps {
  conversationId?: string;
}

const ChatPage = ({
  conversationId,
}: ChatPageProps) => {

  const [conversation, setConversation] =
    useState<ConversationDetail | null>(null);

  const [loading, setLoading] = useState(false);


  // Fetch selected conversation
  useEffect(() => {

    if (!conversationId) {
      setConversation(null);
      return;
    }

    const loadConversation = async () => {

      try {

        setLoading(true);

        const data =
          await fetchConversationById(conversationId);

        setConversation(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }
    };

    loadConversation();

  }, [conversationId]);


  // Send message
  const handleSendMessage = async (
    message: string
  ) => {

    try {

      const response = await sendMessage(
        message,
        conversationId
      );

      // Refetch updated conversation
      const updatedConversation =
        await fetchConversationById(
          response.conversation_id
        );

      setConversation(updatedConversation);

    } catch (error) {

      console.error(error);

    }
  };


  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }


  return (

    <div className="flex flex-col h-full bg-black text-white">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">

        <ChatWindow
          messages={conversation?.messages || []}
        />

      </div>

      {/* Input */}
      <ChatInput
        onSend={handleSendMessage}
      />

    </div>
  );
};

export default ChatPage;