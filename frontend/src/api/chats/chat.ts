const BASE_URL =
    import.meta.env.VITE_BACKEND_URL;

export interface Message {
    role: "user" | "assistant";
    content: string;
}

export interface Conversation {
    id: string;
    title: string;
    created_at: string | null;
    status: "active" | "cancelled";
}

export interface ConversationDetail {
    id: string;
    title: string;
    messages: Message[];
    provider: string;
    model: string;
    status: "active" | "cancelled";
}

export interface ChatResponse {
    conversation_id: string;
    response: string;
}

export interface InferenceLog {
    id: string;
    conversation_id: string;
    provider: string;
    model: string;
    latency: number;
    prompt_tokens: number | null;
    completion_tokens: number | null;
    total_tokens: number | null;
    status: "success" | "error";
    created_at: string | null;
    input_preview: string;
    output_preview: string | null;
    error_message: string | null;
}

// ─── Generic Fetch Wrapper ────────────────────────────────────────────────────

const request = async <T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
        },
        ...options,
    });

    let data;

    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        const message =
            data?.detail ||
            data?.message ||
            "Something went wrong";

        console.error(`[API Error] ${response.status}: ${message}`);

        throw new Error(message);
    }

    return data;
};

// Update sendMessageStream signature
export const sendMessageStream = async (
    message: string,
    conversation_id: string | undefined,
    provider: "gemini" | "groq",
    onChunk: (text: string) => void,
    onConversationId: (id: string) => void,
    onDone: (conversationId: string) => void,
    onError: (error: string) => void,
    signal?: AbortSignal
): Promise<void> => {

    const response = await fetch(`${BASE_URL}/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            message,
            conversation_id: conversation_id || null,
            provider
        }),
        signal
    })

    if (!response.ok) {
        const data = await response.json()
        throw new Error(data?.detail || "Stream request failed")
    }

    const reader = response.body!.getReader()
    const decoder = new TextDecoder()

    while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const raw = decoder.decode(value, { stream: true })
        const lines = raw.split("\n\n").filter(Boolean)

        for (const line of lines) {
            const text = line.replace(/^data: /, "")

            if (text.startsWith("[ID]")) {
                onConversationId(text.replace("[ID]", ""))
            } else if (text.startsWith("[DONE]")) {
                onDone(text.replace("[DONE]", ""))
            } else if (text.startsWith("[ERROR]")) {
                onError(text.replace("[ERROR]", ""))
            } else {
                onChunk(text)
            }
        }
    }
}

export const fetchConversations = async (): Promise<Conversation[]> => {
    return request<Conversation[]>("/conversations");
};

export const fetchConversationById = async (
    id: string
): Promise<ConversationDetail> => {
    return request<ConversationDetail>(`/conversation/${id}`);
};

export const deleteConversation = async (
    id: string
): Promise<void> => {
    await request<void>(`/conversation/${id}`, {
        method: "DELETE",
    });
};

export const cancelConversation = async (
    id: string
): Promise<{ message: string }> => {
    return request<{ message: string }>(
        `/conversation/${id}/cancel`,
        {
            method: "PATCH",
        }
    );
};

// ─── Logs ─────────────────────────────────────────────────────────────────────

export const fetchLogs = async (): Promise<InferenceLog[]> => {
    return request<InferenceLog[]>("/logs");
};