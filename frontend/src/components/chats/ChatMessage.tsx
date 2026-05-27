import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

const ChatMessage = ({
  role,
  content,
  isStreaming,
}: ChatMessageProps) => {

  const isUser = role === "user";

  return (

    <div
      className={`
        flex w-full
        ${isUser ? "justify-end" : "justify-start"}
      `}
    >

      <div
        className={`  relative overflow-hidden  max-w-[90%] sm:max-w-[80%] px-5 py-4 rounded-[28px] shadow-lg transition-all duration-300 hover:-translate-y-0.5

          ${isUser
            ? `  bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-br-md shadow-blue-500/20`
            : `  bg-white/90 backdrop-blur-xl text-zinc-800 border border-zinc-200 rounded-bl-md shadow-zinc-200/70`
          }
        `}
      >

        {/* Soft Glow */}
        {!isUser && (
          <div
            className="absolute inset-0 bg-gradient-to-r from-blue-100/40 to-transparent pointer-events-none"
          />
        )}

        <div className="relative z-10">

          {/* Label */}
          <div
            className={` text-xs uppercase tracking-wide font-semibold mb-3

              ${isUser
                ? "text-blue-100"
                : "text-blue-600"
              }
            `}
          >
            {isUser ? "You" : "InferFlow AI"}
          </div>

          {/* User Message */}
          {isUser ? (

            <p className="whitespace-pre-wrap leading-7 text-[15px]">{content}</p>

          ) : (

            <div
              className="
                prose
                max-w-none

                prose-p:text-zinc-700
                prose-p:leading-7
                prose-p:my-3

                prose-headings:text-zinc-900
                prose-headings:font-bold

                prose-strong:text-zinc-900

                prose-a:text-blue-600
                prose-a:no-underline
                hover:prose-a:underline

                prose-code:text-blue-700
                prose-code:bg-blue-50
                prose-code:px-1.5
                prose-code:py-0.5
                prose-code:rounded-md
                prose-code:before:content-none
                prose-code:after:content-none

                prose-pre:bg-zinc-950
                prose-pre:text-zinc-100
                prose-pre:border
                prose-pre:border-zinc-800
                prose-pre:rounded-2xl
                prose-pre:p-4
                prose-pre:shadow-lg

                prose-li:text-zinc-700
                prose-li:marker:text-zinc-400

                prose-blockquote:border-blue-500
                prose-blockquote:text-zinc-600
              "
            >

              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
              >
                {content}
              </ReactMarkdown>

            </div>

          )}

          {isStreaming && (

            <span
              className="
                inline-block
                w-2 h-5
                ml-1
                rounded-sm
                bg-blue-500
                animate-pulse
                align-middle
              "
            />

          )}

        </div>

      </div>

    </div>
  );
};

export default ChatMessage;