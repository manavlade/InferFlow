import { useState } from "react";

import { SendHorizonal } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
}

const ChatInput = ({
  onSend,
}: ChatInputProps) => {

  const [message, setMessage] = useState("");


  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (!message.trim()) return;

    await onSend(message);

    setMessage("");
  };


  return (

    <form
      onSubmit={handleSubmit}
      className="
        border-t border-zinc-800
        p-4 bg-black
      "
    >

      <div
        className="
          max-w-4xl mx-auto
          flex items-center gap-2
        "
      >

        <input
          type="text"
          placeholder="Send a message..."
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          className="
            flex-1
            bg-zinc-900
            border border-zinc-800
            rounded-xl
            px-4 py-3
            outline-none
            text-white
          "
        />

        <button
          type="submit"
          className="
            p-3
            rounded-xl
            bg-white text-black
            hover:opacity-90
          "
        >
          <SendHorizonal size={20} />
        </button>

      </div>

    </form>
  );
};

export default ChatInput;