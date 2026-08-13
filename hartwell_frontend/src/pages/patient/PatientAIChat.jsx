import { useEffect, useRef, useState } from "react";
import { sendPatientChat } from "../../services/patientService";

export default function PatientAIChat({ open, onClose }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [conversationId, setConversationId] = useState(null);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        setTimeout(() => inputRef.current?.focus(), 100);
    }, [open]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function handleSend(e) {
        e?.preventDefault();
        const message = input.trim();
        if (!message || sending) return;

        setError("");
        setInput("");

        const userMessage = {
            role: "user",
            content: message,
        };

        setMessages((prev) => [...prev, userMessage]);
        setSending(true);

        try {
            const response = await sendPatientChat(message, conversationId);

            // First response gives us the conversation ID.
            if (!conversationId) {
                setConversationId(response.conversation_id);
            }

            const assistantMessage = {
                role: "assistant",
                content: response.message,
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setSending(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }

    function handleNewConversation() {
        setMessages([]);
        setConversationId(null);
        setError("");
        setTimeout(() => inputRef.current?.focus(), 100);
    }

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-end bg-black/20 p-4 sm:p-6"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="flex h-[85vh] w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:h-[700px] sm:w-[450px]">
                {/* HEADER */}
                <div className="flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m5-4a8 8 0 11-16 0 8 8 0 0116 0z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-800">AI Health Assistant</h2>
                            <p className="text-xs text-gray-500">Your personal healthcare assistant</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={handleNewConversation}
                            title="New conversation"
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        </button>

                        <button
                            onClick={onClose}
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* MESSAGES */}
                <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
                    {messages.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>

                            <h3 className="mt-4 text-lg font-semibold text-gray-800">How can I help?</h3>
                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Ask questions about your health, medical reports, medications, visits, or medical history.
                            </p>

                            <div className="mt-6 grid w-full gap-2">
                                <Suggestion
                                    text="Summarize my recent reports"
                                    onClick={() => setInput("Summarize my recent reports")}
                                />
                                <Suggestion
                                    text="Show me my recent visits"
                                    onClick={() => setInput("Show me my recent visits")}
                                />
                                <Suggestion
                                    text="What medications am I taking?"
                                    onClick={() => setInput("What medications am I taking?")}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
                                >
                                    <div
                                        className={
                                            message.role === "user"
                                                ? "max-w-[80%] rounded-2xl rounded-br-md bg-blue-500 px-4 py-3 text-sm leading-6 text-white"
                                                : "max-w-[85%] rounded-2xl rounded-bl-md border border-gray-200 bg-white px-4 py-3 text-sm leading-6 text-gray-700 shadow-sm"
                                        }
                                    >
                                        {message.content}
                                    </div>
                                </div>
                            ))}

                            {sending && (
                                <div className="flex justify-start">
                                    <div className="rounded-2xl rounded-bl-md border border-gray-200 bg-white px-4 py-3 shadow-sm">
                                        <div className="flex gap-1">
                                            <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                                            <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
                                            <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* ERROR */}
                {error && (
                    <div className="border-t border-red-100 bg-red-50 px-4 py-2 text-xs text-red-600">
                        {error}
                    </div>
                )}

                {/* INPUT */}
                <form onSubmit={handleSend} className="border-t border-gray-200 bg-white p-4">
                    <div className="flex items-end gap-2">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            rows={1}
                            placeholder="Ask your health assistant..."
                            className="max-h-32 min-h-[46px] flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        <button
                            type="submit"
                            disabled={sending || !input.trim()}
                            className="flex h-[46px] w-[46px] items-center justify-center rounded-xl bg-blue-500 text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    <p className="mt-2 text-center text-[11px] text-gray-400">
                        AI responses are for assistance and do not replace professional medical advice.
                    </p>
                </form>
            </div>
        </div>
    );
}

/* =========================================================
   SUGGESTION
========================================================= */

function Suggestion({ text, onClick }) {
    return (
        <button
            onClick={onClick}
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
        >
            {text}
        </button>
    );
}