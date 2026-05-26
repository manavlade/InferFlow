import './App.css'

import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'

import Navbar from './components/shared/Navbar'
import Sidebar from './components/shared/sidebar'

import {
  fetchConversations,
  fetchLogs,
  type Conversation,
  type InferenceLog
} from "@/api/chats/chat"

import ChatPage from './components/chats/ChatPage'
import Dashboard from './components/chats/Dashboard'

function App() {

  const [conversations, setConversations] =
    useState<Conversation[]>([])

  const [logs, setLogs] =
    useState<InferenceLog[]>([])

  const [activeConversationId, setActiveConversationId] =
    useState<string>()

  useEffect(() => {

    const loadData = async () => {

      try {

        // Fetch conversations
        const conversationsData =
          await fetchConversations()

        setConversations(conversationsData)

        // Fetch logs
        const logsData =
          await fetchLogs()

        setLogs(logsData)

      } catch (error) {

        console.error(error)

      }
    }

    loadData()

  }, [])

  return (

    <div className="flex h-screen bg-black overflow-hidden">

      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={(id) => {
          setActiveConversationId(id)
        }}
        onNewChat={() => {
          setActiveConversationId(undefined)
        }}
      />

      <div className="flex-1 flex flex-col overflow-hidden">

        <Navbar />

        <div className="flex-1 overflow-y-auto">

          <Routes>

            <Route
              path="/"
              element={
                <ChatPage
                  conversationId={activeConversationId}
                />
              }
            />

            <Route
              path="/dashboard"
              element={<Dashboard logs={logs} />}
            />

          </Routes>

        </div>

      </div>

    </div>
  )
}

export default App