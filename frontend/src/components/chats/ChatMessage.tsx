interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

const ChatMessage = ({
  role,
  content,
}: ChatMessageProps) => {

  const isUser = role === "user";

  return (

    <div
      className={`
        flex
        ${isUser ? "justify-end" : "justify-start"}
      `}
    >

      <div
        className={`
          max-w-[80%]
          px-4 py-3
          rounded-2xl
          whitespace-pre-wrap
          ${
            isUser
              ? "bg-white text-black"
              : "bg-zinc-900 text-white"
          }
        `}
      >
        {content}
      </div>

    </div>
  );
};

export default ChatMessage;