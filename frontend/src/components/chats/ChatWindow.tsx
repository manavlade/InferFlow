import type { Message } from "../../api/chats/chat"
import ChatMessage from "./ChatMessage"

interface ChatWindowProps {
  messages: Message[]
  streamingMessage?: string    // ← this line must be here
}

const ChatWindow = ({
  messages,
  streamingMessage
}: ChatWindowProps) => {

  if (messages.length === 0 && !streamingMessage) {
    return (
      <div className="h-full flex items-center justify-center px-6">

        <div
          className="
          relative
          max-w-2xl
          w-full
          overflow-hidden
          rounded-3xl
          border border-zinc-200
          bg-gradient-to-br from-white via-zinc-50 to-zinc-100
          shadow-2xl
          p-10
        "
        >

          {/* Glow Effect */}
          <div
            className="
            absolute
            top-0 right-0
            w-64 h-64
            bg-blue-500/10
            blur-3xl
            rounded-full
            pointer-events-none
          "
          />

          {/* Content */}
          <div className="relative z-10">

            {/* Badge */}
            <div
              className="
              inline-flex
              items-center
              gap-2
              px-4 py-2
              rounded-full
              bg-blue-50
              border border-blue-100
              text-blue-600
              text-sm
              font-medium
              mb-6
            "
            >
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              AI Inference Platform
            </div>

            {/* Heading */}
            <h1
              className="
              text-4xl
              md:text-5xl
              font-bold
              tracking-tight
              text-zinc-900
              leading-tight
              mb-4
            "
            >
              Start your
              <span className="text-blue-600"> conversation </span>
              with AI
            </h1>

            {/* Description */}
            <p
              className="
              text-zinc-600
              text-lg
              leading-relaxed
              max-w-xl
              mb-8
            "
            >
              Ask questions, analyze responses, monitor inference
              logs, and interact with multiple AI models through a
              clean and modern interface.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">

              <button
                className="
                px-6 py-3
                rounded-2xl
                bg-blue-600
                hover:bg-blue-700
                text-white
                font-medium
                shadow-lg shadow-blue-500/20
                transition-all duration-300
                hover:-translate-y-0.5
              "
              >
                New Chat
              </button>

              <button
                className="
                px-6 py-3
                rounded-2xl
                border border-zinc-300
                bg-white/70
                backdrop-blur-sm
                text-zinc-700
                hover:bg-zinc-100
                transition-all duration-300
              "
              >
                View Dashboard
              </button>

            </div>

          </div>

        </div>

      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white via-zinc-50 to-zinc-100">

      <div
        className="
      max-w-5xl
      mx-auto
      px-4
      sm:px-6
      py-8
      space-y-6
    "
      >

        {messages.map((message, index) => (

          <div
            key={index}
            className={`
          flex
          ${message.role === "user"
                ? "justify-end"
                : "justify-start"}
        `}
          >

            <div
              className={`
            relative
            max-w-[90%]
            sm:max-w-[80%]
            transition-all
            duration-300
            hover:-translate-y-0.5
            ${message.role === "user"
                  ? `
                  bg-gradient-to-br
                  from-blue-600
                  to-blue-500
                  text-white
                  rounded-[28px]
                  rounded-br-md
                  shadow-lg
                  shadow-blue-500/20
                `
                  : `
                  bg-white/90
                  backdrop-blur-xl
                  text-zinc-800
                  border
                  border-zinc-200
                  rounded-[28px]
                  rounded-bl-md
                  shadow-xl
                  shadow-zinc-200/60
                `
                }
          `}
            >

              {/* Glow Effect */}
              {message.role === "assistant" && (
                <div
                  className="
                absolute
                inset-0
                rounded-[28px]
                bg-gradient-to-r
                from-blue-100/40
                to-transparent
                pointer-events-none
              "
                />
              )}

              <div className="relative px-5 py-4">

                {/* Label */}
                <div
                  className={`
                text-xs
                font-semibold
                mb-2
                tracking-wide
                uppercase
                ${message.role === "user"
                      ? "text-blue-100"
                      : "text-blue-600"
                    }
              `}
                >
                  {message.role === "user"
                    ? "You"
                    : "InferFlow AI"}
                </div>

                {/* Content */}
                <ChatMessage
                  role={message.role}
                  content={message.content}
                />

              </div>

            </div>

          </div>

        ))}

        {/* Streaming Message */}
        {streamingMessage && (

          <div className="flex justify-start">

            <div
              className="
            relative
            max-w-[90%]
            sm:max-w-[80%]
            bg-white/90
            backdrop-blur-xl
            border border-zinc-200
            rounded-[28px]
            rounded-bl-md
            shadow-xl
            shadow-zinc-200/60
          "
            >

              <div
                className="
              absolute
              inset-0
              rounded-[28px]
              bg-gradient-to-r
              from-blue-100/40
              to-transparent
              pointer-events-none
            "
              />

              <div className="relative px-5 py-4">

                <div
                  className="
                text-xs
                font-semibold
                mb-2
                tracking-wide
                uppercase
                text-blue-600
              "
                >
                  InferFlow AI
                </div>

                <ChatMessage
                  role="assistant"
                  content={streamingMessage}
                  isStreaming
                />

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  )
}

export default ChatWindow