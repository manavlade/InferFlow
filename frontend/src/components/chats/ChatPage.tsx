import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  Sparkles,
  Lock,
  MessageSquare,
  Zap,
  ShieldCheck,
} from "lucide-react"

import {
  fetchConversationById,
  sendMessageStream,
  type ConversationDetail,
  type Message
} from "../../api/chats/chat"

import ChatWindow from "./ChatWindow"
import ChatInput from "./ChatInput"

interface ChatPageProps {
  conversationId?: string
  onConversationUpdate: () => void
}

const ChatPage = ({
  conversationId,
  onConversationUpdate,
}: ChatPageProps) => {

  const [conversation, setConversation] =
    useState<ConversationDetail | null>(null)

  const [streamingMessage, setStreamingMessage] =
    useState<string>("")

  const [loading, setLoading] = useState(false)

  const [streaming, setStreaming] = useState(false)

  const navigate = useNavigate()

  const abortRef = useRef<AbortController | null>(null)

  const isCancelled =
    conversation?.status === "cancelled"

  useEffect(() => {

    if (!conversationId) {
      setConversation(null)
      return
    }

    const loadConversation = async () => {

      try {

        setLoading(true)

        const data =
          await fetchConversationById(conversationId)

        setConversation(data)

      } catch (error) {

        console.error(error)

      } finally {

        setLoading(false)

      }
    }

    loadConversation()

  }, [conversationId])

  const handleSendMessage = async (
    message: string,
    provider: "gemini" | "groq"
  ) => {

    const userMsg: Message = {
      role: "user",
      content: message
    }

    setConversation((prev) =>
      prev
        ? {
            ...prev,
            messages: [...prev.messages, userMsg]
          }
        : null
    )

    setStreamingMessage("")
    setStreaming(true)

    const abort = new AbortController()

    abortRef.current = abort

    let resolvedConversationId =
      conversationId

    try {

      await sendMessageStream(
        message,
        conversationId,
        provider,

        // onChunk
        (chunk) =>
          setStreamingMessage(
            (prev) => prev + chunk
          ),

        // onConversationId
        (id) => {

          resolvedConversationId = id

          navigate(`/chat/${id}`, {
            replace: true
          })
        },

        // onDone
        async (id) => {

          const updated =
            await fetchConversationById(id)

          setConversation(updated)

          setStreamingMessage("")

          setStreaming(false)

          onConversationUpdate()
        },

        // onError
        (err) => {

          console.error(err)

          setStreamingMessage("")

          setStreaming(false)
        },

        abort.signal
      )

    } catch (err: any) {

      if (err.name === "AbortError") {

        setStreamingMessage("")

        setStreaming(false)

        if (resolvedConversationId) {

          const updated =
            await fetchConversationById(
              resolvedConversationId
            )

          setConversation(updated)
        }

      } else {

        console.error(err)

        setStreaming(false)
      }
    }
  }

  const handleStopStreaming = () => {
    abortRef.current?.abort()
  }

  // ─────────────────────────────────────────────
  // Loading State
  // ─────────────────────────────────────────────

  if (loading) {

    return (

      <div
        className="
          flex-1
          flex
          items-center
          justify-center
          bg-gradient-to-b
          from-white
          via-zinc-50
          to-zinc-100
        "
      >

        <div className="text-center">

          <div
            className="
              relative
              w-16 h-16
              mx-auto mb-6
            "
          >

            <div
              className="
                absolute inset-0
                rounded-3xl
                bg-blue-500/20
                blur-2xl
              "
            />

            <div
              className="
                relative
                w-full h-full
                rounded-3xl
                bg-gradient-to-br
                from-blue-600
                to-blue-500
                flex items-center justify-center
                shadow-2xl shadow-blue-500/20
                animate-pulse
              "
            >

              <Sparkles
                className="text-white"
                size={28}
              />

            </div>

          </div>

          <h2
            className="
              text-2xl
              font-bold
              text-zinc-900
              mb-2
            "
          >
            Loading Conversation
          </h2>

          <p
            className="
              text-zinc-500
              text-sm
            "
          >
            Fetching your AI conversation...
          </p>

        </div>

      </div>
    )
  }

  // ─────────────────────────────────────────────
  // Empty State
  // ─────────────────────────────────────────────

  if (!conversationId && !conversation) {

    return (

      <div
        className="
          flex-1
          flex
          items-center
          justify-center
          bg-gradient-to-b
          from-white
          via-zinc-50
          to-zinc-100
          px-6
          relative
          overflow-hidden
        "
      >

        {/* Background glow */}
        <div
          className="
            absolute
            top-[-100px]
            right-[-100px]
            w-[300px]
            h-[300px]
            rounded-full
            bg-blue-500/10
            blur-3xl
          "
        />

        <div
          className="
            max-w-4xl
            w-full
            grid
            lg:grid-cols-2
            gap-12
            items-center
            relative
            z-10
          "
        >

          {/* Left Content */}
          <div>

            <div
              className="
                inline-flex
                items-center
                gap-2
                px-4 py-2
                rounded-full
                bg-blue-50
                border border-blue-100
                text-blue-700
                text-sm
                font-semibold
                mb-6
                shadow-sm
              "
            >

              <Sparkles size={14} />

              AI Powered Workspace

            </div>

            <h1
              className="
                text-5xl
                lg:text-6xl
                font-bold
                tracking-tight
                text-zinc-900
                leading-tight
                mb-6
              "
            >
              Build smarter
              <span
                className="
                  block
                  bg-gradient-to-r
                  from-blue-600
                  to-cyan-500
                  bg-clip-text
                  text-transparent
                "
              >
                conversations
              </span>
            </h1>

            <p
              className="
                text-lg
                text-zinc-500
                leading-relaxed
                max-w-xl
                mb-8
              "
            >
              Ask questions, analyze concepts,
              generate content, debug code,
              and interact with powerful AI
              models in real time.
            </p>

            <div
              className="
                flex
                flex-wrap
                gap-4
              "
            >

              <div
                className="
                  flex items-center gap-3
                  bg-white
                  border border-zinc-200
                  rounded-2xl
                  px-4 py-3
                  shadow-sm
                "
              >

                <div
                  className="
                    w-10 h-10
                    rounded-xl
                    bg-blue-50
                    flex items-center justify-center
                  "
                >

                  <Zap
                    size={18}
                    className="text-blue-600"
                  />

                </div>

                <div>

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-zinc-800
                    "
                  >
                    Fast Responses
                  </p>

                  <p
                    className="
                      text-xs
                      text-zinc-500
                    "
                  >
                    Real-time streaming AI
                  </p>

                </div>

              </div>

              <div
                className="
                  flex items-center gap-3
                  bg-white
                  border border-zinc-200
                  rounded-2xl
                  px-4 py-3
                  shadow-sm
                "
              >

                <div
                  className="
                    w-10 h-10
                    rounded-xl
                    bg-green-50
                    flex items-center justify-center
                  "
                >

                  <ShieldCheck
                    size={18}
                    className="text-green-600"
                  />

                </div>

                <div>

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-zinc-800
                    "
                  >
                    Secure Conversations
                  </p>

                  <p
                    className="
                      text-xs
                      text-zinc-500
                    "
                  >
                    Logged & monitored safely
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* Right Mock Card */}
          <div
            className="
              relative
              hidden
              lg:block
            "
          >

            <div
              className="
                absolute
                inset-0
                bg-blue-500/10
                blur-3xl
                rounded-full
              "
            />

            <div
              className="
                relative
                bg-white/90
                backdrop-blur-xl
                border border-zinc-200
                rounded-[32px]
                p-6
                shadow-2xl
              "
            >

              <div
                className="
                  flex items-center justify-between
                  mb-6
                "
              >

                <div>

                  <p
                    className="
                      text-sm
                      text-zinc-500
                    "
                  >
                    Active Conversation
                  </p>

                  <h3
                    className="
                      text-xl
                      font-bold
                      text-zinc-900
                    "
                  >
                    InferFlow AI
                  </h3>

                </div>

                <div
                  className="
                    w-12 h-12
                    rounded-2xl
                    bg-gradient-to-br
                    from-blue-600
                    to-cyan-500
                    flex items-center justify-center
                    shadow-lg shadow-blue-500/20
                  "
                >

                  <MessageSquare
                    className="text-white"
                  />

                </div>

              </div>

              <div className="space-y-4">

                <div
                  className="
                    bg-zinc-100
                    rounded-2xl
                    p-4
                  "
                >

                  <p
                    className="
                      text-sm
                      text-zinc-500
                      mb-1
                    "
                  >
                    User
                  </p>

                  <p
                    className="
                      text-zinc-800
                      font-medium
                    "
                  >
                    Explain React hooks
                  </p>

                </div>

                <div
                  className="
                    bg-gradient-to-r
                    from-blue-600
                    to-cyan-500
                    rounded-2xl
                    p-4
                    text-white
                    shadow-lg shadow-blue-500/20
                  "
                >

                  <p
                    className="
                      text-sm
                      text-blue-100
                      mb-1
                    "
                  >
                    AI Assistant
                  </p>

                  <p
                    className="
                      leading-relaxed
                    "
                  >
                    React Hooks let you use
                    state and lifecycle features
                    inside functional components...
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    )
  }

  // ─────────────────────────────────────────────
  // Main Chat UI
  // ─────────────────────────────────────────────

  return (

    <div
      className="
        flex
        flex-col
        h-full
        bg-gradient-to-b
        from-white
        via-zinc-50
        to-zinc-100
      "
    >

      {/* Cancelled Banner */}
      {isCancelled && (

        <div
          className="
            flex items-center justify-center gap-2
            px-4 py-3
            bg-amber-50
            border-b border-amber-200
            text-amber-700
            text-sm
            font-medium
          "
        >

          <Lock size={16} />

          This conversation has been cancelled
          and is read-only.

        </div>

      )}

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto">

        <ChatWindow
          messages={conversation?.messages || []}
          streamingMessage={streamingMessage}
        />

      </div>

      {/* Chat Input */}
      {!isCancelled && (

        <div
          className="
            border-t
            border-zinc-200
            bg-white/80
            backdrop-blur-xl
          "
        >

          <ChatInput
            onSend={handleSendMessage}
            onStop={handleStopStreaming}
            streaming={streaming}
            disabled={streaming}
          />

        </div>

      )}

    </div>
  )
}

export default ChatPage