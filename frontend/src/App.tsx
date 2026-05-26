import './App.css'

import { useEffect, useState } from 'react'

import {
  Route,
  Routes,
  useNavigate,
  useParams,
  useLocation,
} from 'react-router-dom'

import {
  Sparkles,
  LayoutDashboard,
} from 'lucide-react'

import Navbar from './components/shared/Navbar'

import {
  fetchConversations,
  fetchLogs,
  type Conversation,
  type InferenceLog,
} from "@/api/chats/chat"

import ChatPage from './components/chats/ChatPage'
import Dashboard from './components/chats/Dashboard'
import Sidebar from './components/shared/sidebar'

// ─────────────────────────────────────────────────────────────
// Wrapper
// ─────────────────────────────────────────────────────────────

const ChatPageWrapper = ({
  onConversationUpdate
}: {
  onConversationUpdate: () => void
}) => {

  const { conversationId } = useParams()

  return (
    <ChatPage
      conversationId={conversationId}
      onConversationUpdate={onConversationUpdate}
    />
  )
}

// ─────────────────────────────────────────────────────────────
// App
// ─────────────────────────────────────────────────────────────

function App() {

  const [conversations, setConversations] =
    useState<Conversation[]>([])

  const [logs, setLogs] =
    useState<InferenceLog[]>([])

  const navigate = useNavigate()

  const location = useLocation()

  const isDashboard =
    location.pathname === "/dashboard"

  // ───────────────────────────────────────────────────────────
  // Load Conversations
  // ───────────────────────────────────────────────────────────

  const loadConversations = async () => {

    try {

      const data =
        await fetchConversations()

      setConversations(data)

    } catch (error) {

      console.error(error)
    }
  }

  // ───────────────────────────────────────────────────────────
  // Load Logs
  // ───────────────────────────────────────────────────────────

  const loadLogs = async () => {

    try {

      const data =
        await fetchLogs()

      setLogs(data)

    } catch (error) {

      console.error(error)
    }
  }

  // ───────────────────────────────────────────────────────────
  // Initial Load
  // ───────────────────────────────────────────────────────────

  useEffect(() => {

    loadConversations()

    loadLogs()

  }, [])

  return (

    <div
      className="
        flex
        h-screen
        overflow-hidden
        bg-gradient-to-b
        from-white
        via-zinc-50
        to-zinc-100
      "
    >

      {/* Sidebar */}
      {!isDashboard && (

        <Sidebar
          conversations={conversations}
          onSelectConversation={(id) =>
            navigate(`/chat/${id}`)
          }
          onNewChat={() => navigate("/")}
          onConversationChange={() => {
            loadConversations()
            loadLogs()
          }}
        />

      )}

      {/* Main Layout */}
      <div
        className="
          flex-1
          flex
          flex-col
          overflow-hidden
        "
      >

        {/* Navbar */}
        <div
          className="
            sticky
            top-0
            z-50
            bg-white/80
            backdrop-blur-xl
            border-b
            border-zinc-200
          "
        >

          <Navbar />

        </div>

        {/* Top Action Bar */}
        <div
          className="
            flex
            items-center
            justify-between
            px-6
            py-4
            border-b
            border-zinc-200
            bg-white/60
            backdrop-blur-xl
          "
        >

          <div>

            <div
              className="
                inline-flex
                items-center
                gap-2
                px-4 py-2
                rounded-full
                bg-blue-50
                border
                border-blue-100
                text-blue-700
                text-sm
                font-medium
                shadow-sm
              "
            >

              <Sparkles size={14} />

              AI Workspace

            </div>

          </div>

          <button
            onClick={() =>
              navigate(
                isDashboard
                  ? "/"
                  : "/dashboard"
              )
            }
            className="
              flex
              items-center
              gap-2
              px-4 py-2.5
              rounded-2xl

              bg-gradient-to-r
              from-blue-600
              to-blue-500

              text-white
              font-medium

              shadow-lg
              shadow-blue-500/20

              hover:scale-[1.02]
              hover:shadow-xl
              hover:shadow-blue-500/30

              transition-all
              duration-200
            "
          >

            <LayoutDashboard size={18} />

            {isDashboard
              ? "Back to Chat"
              : "Dashboard"}

          </button>

        </div>

        {/* Page Content */}
        <div
          className="
            flex-1
            overflow-y-auto
          "
        >

          <Routes>

            {/* Home */}
            <Route
              path="/"
              element={
                <ChatPage
                  onConversationUpdate={() => {
                    loadConversations()
                    loadLogs()
                  }}
                />
              }
            />

            {/* Chat */}
            <Route
              path="/chat/:conversationId"
              element={
                <ChatPageWrapper
                  onConversationUpdate={() => {
                    loadConversations()
                    loadLogs()
                  }}
                />
              }
            />

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={
                <Dashboard logs={logs} />
              }
            />

          </Routes>

        </div>

      </div>

    </div>
  )
}

export default App