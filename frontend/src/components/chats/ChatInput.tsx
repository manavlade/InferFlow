import { useState } from "react"

import {
  SendHorizonal,
  StopCircle,
  ChevronDown,
  Sparkles,
} from "lucide-react"

export type Provider = "gemini" | "groq"

interface ChatInputProps {
  onSend: (
    message: string,
    provider: Provider
  ) => void

  onStop: () => void

  disabled?: boolean

  streaming?: boolean
}

const PROVIDERS: {
  value: Provider
  label: string
}[] = [
    {
      value: "gemini",
      label: "Gemini 2.5 Flash"
    },
    {
      value: "groq",
      label: "Groq Llama 3.3"
    },
  ]

const ChatInput = ({
  onSend,
  onStop,
  disabled = false,
  streaming = false
}: ChatInputProps) => {

  const [message, setMessage] =
    useState("")

  const [provider, setProvider] =
    useState<Provider>("gemini")

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault()

    if (!message.trim() || disabled)
      return

    await onSend(message, provider)

    setMessage("")
  }

  return (

    <form
      onSubmit={handleSubmit}
      className="
        border-t
        border-zinc-200
        bg-white/80
        backdrop-blur-xl
        px-4
        py-4
      "
    >

      <div
        className="
          max-w-5xl
          mx-auto
          space-y-3
        "
      >

        {/* Top Row */}
        <div
          className="
            flex
            items-center
            justify-between
            gap-4
            flex-wrap
          "
        >

          {/* Provider Selector */}
          <div className="flex items-center gap-3">

            <div
              className="
                flex items-center gap-2
                px-3 py-1.5
                rounded-full
                bg-blue-50
                border border-blue-100
                text-blue-700
                text-xs
                font-medium
              "
            >

              <Sparkles size={13} />

              AI Provider

            </div>

            <div className="relative">

              <select
                value={provider}
                onChange={(e) =>
                  setProvider(
                    e.target.value as Provider
                  )
                }
                disabled={streaming}
                className="
                  appearance-none

                  bg-white
                  border border-zinc-200

                  text-zinc-700
                  text-sm
                  font-medium

                  rounded-xl

                  px-4 py-2
                  pr-10

                  shadow-sm

                  outline-none

                  transition-all
                  duration-200

                  hover:border-blue-300
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100

                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >

                {PROVIDERS.map((p) => (

                  <option
                    key={p.value}
                    value={p.value}
                  >
                    {p.label}
                  </option>

                ))}

              </select>

              <ChevronDown
                size={16}
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-zinc-400
                  pointer-events-none
                "
              />

            </div>

          </div>

          {/* Status */}
          <div
            className="
              text-xs
              text-zinc-400
              font-medium
            "
          >

            {streaming
              ? "AI is generating response..."
              : "Ready to assist"}

          </div>

        </div>

        {/* Input Box */}
        <div
          className="
            relative

            bg-white
            border border-zinc-200

            rounded-3xl

            shadow-lg
            shadow-zinc-200/50

            transition-all
            duration-300

            focus-within:border-blue-400
            focus-within:ring-4
            focus-within:ring-blue-100
          "
        >

          {/* Soft Glow */}
          <div
            className="
              absolute
              inset-0
              rounded-3xl
              bg-gradient-to-r
              from-blue-50/40
              to-transparent
              pointer-events-none
            "
          />

          <div
            className="
              relative
              flex
              items-end
              gap-3
              p-3
            "
          >

            {/* Input */}
            <textarea
              placeholder={
                streaming
                  ? "AI is responding..."
                  : "Ask anything..."
              }
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              disabled={streaming}
              rows={1}
              className="
                flex-1

                resize-none

                bg-transparent

                px-3
                py-3

                text-zinc-800
                placeholder:text-zinc-400

                outline-none

                max-h-40

                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            />

            {/* Buttons */}
            {streaming ? (

              <button
                type="button"
                onClick={onStop}
                className="
                  flex items-center justify-center

                  h-12 w-12

                  rounded-2xl

                  bg-red-500
                  text-white

                  shadow-lg
                  shadow-red-500/20

                  transition-all
                  duration-200

                  hover:scale-105
                  hover:bg-red-600
                "
              >

                <StopCircle size={22} />

              </button>

            ) : (

              <button
                type="submit"
                disabled={!message.trim()}
                className="
                  flex items-center justify-center

                  h-12 w-12

                  rounded-2xl

                  bg-gradient-to-br
                  from-blue-600
                  to-blue-500

                  text-white

                  shadow-lg
                  shadow-blue-500/20

                  transition-all
                  duration-200

                  hover:scale-105
                  hover:shadow-xl

                  disabled:opacity-40
                  disabled:hover:scale-100
                  disabled:cursor-not-allowed
                "
              >

                <SendHorizonal size={20} />

              </button>

            )}

          </div>

        </div>

      </div>

    </form>
  )
}

export default ChatInput