const BASE_URL =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Chat ─────────────────────────────────────────────────────────────────────

export const sendMessage = async (
    message: string,
    conversation_id?: string
): Promise<ChatResponse> => {
    return request<ChatResponse>("/chat", {
        method: "POST",
        body: JSON.stringify({
            message,
            conversation_id: conversation_id || null,
        }),
    });
};

// ─── Conversations ────────────────────────────────────────────────────────────

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