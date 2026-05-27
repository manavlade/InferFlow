import { useLocation } from "react-router-dom"

import {
  Trash2,
  XCircle,
  Plus,
  MessageSquare,
  Sparkles,
  Clock3,
} from "lucide-react"

import {
  deleteConversation,
  cancelConversation,
  type Conversation
} from "@/api/chats/chat"

interface SidebarProps {
  conversations: Conversation[]
  onSelectConversation: (id: string) => void
  onNewChat: () => void
  onConversationChange: () => void
}

const Sidebar = ({
  conversations,
  onSelectConversation,
  onNewChat,
  onConversationChange,
}: SidebarProps) => {

  const safeConversations = conversations || []

  const location = useLocation()

  const handleDelete = async (
    e: React.MouseEvent,
    id: string
  ) => {

    e.stopPropagation()

    try {

      await deleteConversation(id)

      onConversationChange()

    } catch (error) {

      console.error(error)
    }
  }

  const handleCancel = async (
    e: React.MouseEvent,
    id: string
  ) => {

    e.stopPropagation()

    try {

      await cancelConversation(id)

      onConversationChange()

    } catch (error) {

      console.error(error)
    }
  }

  return (

    <aside
      className=" w-72 hidden md:flex flex-col h-full bg-white/80 backdrop-blur-xl border-r border-zinc-200 shadow-sm
      "
    >

      <div
        className=" p-5 border-b border-zinc-200
        "
      >

        {/* Logo */}
        <div
          className=" flex items-center gap-3 mb-5"
        >

          <div
            className=" relative w-11 h-11"
          >

            <div
              className=" absolute inset-0 rounded-2xl bg-blue-500/20 blur-xl"
            />

            <div
              className=" relative w-full h-full rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20"
            >

              <Sparkles
                size={20}
                className="text-white"
              />

            </div>

          </div>

          <div>

            <h1
              className=" text-lg  font-bold text-zinc-900">
              InferFlow
            </h1>

            <p
              className="text-xs text-zinc-500">
              AI Conversation Studio
            </p>

          </div>

        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="  w-full  flex items-center justify-center gap-2 px-4 py-3 rounded-2xl  bg-gradient-to-r  from-blue-600  to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/20 hover:scale-[1.01] transition-all duration-200 cursor-pointer"
        >

          <Plus size={18} />

          New Chat

        </button>

      </div>

      {/* Conversations */}
      <div
        className=" flex-1 overflow-y-auto px-3 py-4">

        {/* Section Heading */}
        <div
          className=" flex items-center gap-2 px-2 mb-4">

          <Clock3
            size={14}
            className="text-zinc-400"/>

          <p
            className=" text-xs font-semibold tracking-wide uppercase text-zinc-400">
            Recent Conversations
          </p>

        </div>

        {/* Empty State */}
        {safeConversations.length === 0 && (

          <div
            className=" mt-10 text-center px-4">

            <div
              className=" w-14 h-14 mx-auto mb-4 rounded-2xl bg-zinc-100 flex items-center justify-center">

              <MessageSquare
                size={24}
                className="text-zinc-400"/>

            </div>

            <h3
              className=" text-sm font-semibold text-zinc-700 mb-1">
              No conversations yet
            </h3>

            <p
              className=" text-xs text-zinc-500 leading-relaxed">
              Start a new AI conversation to see your chats here.
            </p>

          </div>

        )}

        {/* Conversations List */}
        <div className="space-y-2">

          {safeConversations.map((convo) => {

            const isActive =
              location.pathname === `/chat/${convo.id}`

            const isCancelled =
              convo.status === "cancelled"

            return (

              <div
                key={convo.id}
                onClick={() =>
                  onSelectConversation(convo.id)
                }
                className={` group relative rounded-2xl border cursor-pointer transition-all duration-200 overflow-hidden ${
                    isActive
                      ? `bg-gradient-to-r from-blue-600 to-cyan-500 border-transparent shadow-lg shadow-blue-500/20 text-white`
                      : `bg-white/70 border-zinc-200 hover:border-blue-200 hover:bg-blue-50/50`
                  }
                `}
              >

                {/* Glow */}
                {isActive && (

                  <div
                    className="absolute inset-0 bg-white/5"/>

                )}

                <div
                  className=" relative flex items-start justify-between gap-3 p-4">

                  {/* Left */}
                  <div
                    className=" flex items-start gap-3 flex-1 min-w-0">

                    <div
                      className={` mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isActive
                            ? "bg-white/20 text-white"
                            : "bg-zinc-100 text-zinc-500"
                        }`}
                    >

                      <MessageSquare size={16} />

                    </div>

                    <div className="min-w-0">

                      <p
                        className={`text-sm font-medium truncate ${isActive ? "text-white" : "text-zinc-800"}`}>

                        {convo.title}

                      </p>

                      <div className="flex items-center gap-2 mt-1">

                        <span
                          className={`text-xs ${isActive ? "text-blue-100" : "text-zinc-400"}`} 
                        >
                          {isCancelled
                            ? "Cancelled"
                            : "Active"}
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* Actions */}
                  <div
                    className=" opacity-0 group-hover:opacity-100 transition flex items-center gap-1">

                    {!isCancelled && (

                      <button
                        onClick={(e) =>
                          handleCancel(e, convo.id)
                        }
                        className={` p-2 rounded-lg transition ${
                            isActive
                              ? ` hover:bg-white/20 text-white`
                              : `hover:bg-amber-100 text-zinc-500 hover:text-amber-600`
                          }
                        `}
                        title="Cancel conversation"
                      >

                        <XCircle size={15} />

                      </button>

                    )}

                    <button
                      onClick={(e) =>
                        handleDelete(e, convo.id)
                      }
                      className={`
                        p-2
                        rounded-lg
                        transition
                        ${
                          isActive
                            ? `
                              hover:bg-white/20
                              text-white
                            `
                            : `
                              hover:bg-red-100
                              text-zinc-500
                              hover:text-red-600
                            `
                        }
                      `}
                      title="Delete conversation"
                    >

                      <Trash2 size={15} />

                    </button>

                  </div>

                </div>

              </div>
            )
          })}

        </div>

      </div>

      {/* Footer */}
      <div className="  p-4 border-t border-zinc-200 bg-white/70">

        <div className="rounded-2xl border border-zinc-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-4">

          <p className="text-sm font-semibold text-zinc-800 mb-1">

            AI Monitoring Enabled

          </p>

          <p
            className="text-xs leading-relaxed text-zinc-500">

            All inference logs, latency,
            and token usage are tracked
            in real time.
          </p>

        </div>

      </div>

    </aside>
  )
}

export default Sidebar