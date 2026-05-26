import { useState } from "react";
import {
  Menu,
  MessageSquare,
  Plus,
  X,
} from "lucide-react";
import type { Conversation } from "@/api/chats/chat";


interface SidebarProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
}

const Sidebar = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
}: SidebarProps) => {

  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Topbar */}
      <div
        className="
          md:hidden
          flex items-center justify-between
          px-4 py-4
          border-b
          border-zinc-800
          bg-zinc-950
          text-white
        "
      >
        <button onClick={() => setOpen(true)}>
          <Menu size={24} />
        </button>

        <h1 className="text-lg font-semibold">
          InferFlow
        </h1>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="
            fixed inset-0 z-40
            bg-black/50
            md:hidden
          "
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-50
          h-screen w-[280px]
          bg-zinc-950 text-white
          border-r border-zinc-800
          flex flex-col
          transition-transform duration-300
          ${
            open
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >

        {/* Header */}
        <div
          className="
            flex items-center justify-between
            px-4 py-4
            border-b border-zinc-800
          "
        >
          <h2 className="text-xl font-bold">
            InferFlow
          </h2>

          <button
            className="md:hidden"
            onClick={() => setOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={onNewChat}
            className="
              w-full
              flex items-center gap-2
              px-4 py-3
              rounded-xl
              bg-white text-black
              font-medium
              hover:opacity-90
              transition
            "
          >
            <Plus size={18} />
            New Chat
          </button>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto px-2 pb-4">

          <div className="space-y-1">

            {conversations.length === 0 ? (

              <div
                className="
                  text-sm text-zinc-400
                  text-center mt-10
                "
              >
                No conversations yet
              </div>

            ) : (

              conversations.map((chat) => (

                <button
                  key={chat.id}
                  onClick={() => {
                    onSelectConversation(chat.id);
                    setOpen(false);
                  }}
                  className={`
                    w-full
                    flex items-center gap-3
                    px-3 py-3
                    rounded-xl
                    text-left
                    transition-all
                    ${
                      activeConversationId === chat.id
                        ? "bg-zinc-800"
                        : "hover:bg-zinc-900"
                    }
                  `}
                >
                  <MessageSquare size={18} />

                  <span className="truncate text-sm">
                    {chat.title}
                  </span>
                </button>

              ))

            )}

          </div>

        </div>

      </aside>
    </>
  );
};

export default Sidebar;