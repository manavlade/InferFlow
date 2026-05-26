

import type { Message } from "../../api/chats/chat";
import ChatMessage from "./ChatMessage";

interface ChatWindowProps {
  messages: Message[];
}

const ChatWindow = ({
  messages,
}: ChatWindowProps) => {

  if (messages.length === 0) {

    return (
      <div
        className="
          h-full
          flex items-center justify-center
          text-zinc-500
        "
      >
        Start a conversation
      </div>
    );
  }

  return (

    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">

      {messages.map((message, index) => (

        <ChatMessage
          key={index}
          role={message.role}
          content={message.content}
        />

      ))}

    </div>
  );
};

export default ChatWindow;