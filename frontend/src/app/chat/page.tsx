"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import BackendConnecting from "@/components/chat/BackendConnecting";
import ChatComposer from "@/components/chat/ChatComposer";
import ChatHeader from "@/components/chat/ChatHeader";
import EmptyState from "@/components/chat/EmptyState";
import MessageBubble from "@/components/chat/MessageBubble";
import Sidebar from "@/components/chat/Sidebar";
import TypingIndicator from "@/components/chat/TypingIndicator";
import { ApiError, askQuestion, checkHealth, processSource, resetSession } from "@/lib/api";
import type { AssistantStatus, ChatMessage, SourceInfo, SourceType } from "@/lib/types";
import { useRecentSources } from "@/lib/useRecentSources";

function getCurrentTimestamp() {
  return Date.now();
}

function useSessionId() {
  const [userId] = useState(() => {
    if (typeof window === "undefined") return "";

    let id = window.sessionStorage.getItem("research-assistant:userid");
    if (!id) {
      id = crypto.randomUUID();
      window.sessionStorage.setItem("research-assistant:userid", id);
    }
    return id;
  });

  return userId;
}

export default function ChatPage() {
  const userId = useSessionId();
  const [backendStatus, setBackendStatus] = useState<"checking" | "ready" | "unreachable">("checking");

  const [source, setSource] = useState<SourceInfo | null>(null);
  const [isProcessingSource, setIsProcessingSource] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<AssistantStatus>("idle");

  const { items: recentSources, addSource } = useRecentSources();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const statusTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const messageTimestampRef = useRef(0);

  // ---- Backend health check ------------------------------------------------
  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    async function poll() {
      const ok = await checkHealth();
      if (cancelled) return;

      if (ok) {
        setBackendStatus("ready");
        return;
      }

      attempts += 1;
      if (attempts >= 5) setBackendStatus("unreachable");
      setTimeout(poll, 3000);
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, []);

  // ---- Autoscroll ------------------------------------------------------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  // ---- Cleanup any pending status timers on unmount --------------------------
  useEffect(() => () => statusTimers.current.forEach(clearTimeout), []);

  function runStatusSequence() {
    statusTimers.current.forEach(clearTimeout);
    statusTimers.current = [];

    setStatus("preparing");
    statusTimers.current.push(setTimeout(() => setStatus("searching"), 350));
    statusTimers.current.push(setTimeout(() => setStatus("processing"), 900));
    statusTimers.current.push(setTimeout(() => setStatus("generating"), 1600));
  }

  async function handleSubmitSource(type: SourceType, value: string | File) {
    if (!userId) return;

    setIsProcessingSource(true);
    try {
      const result: SourceInfo = await processSource(userId, type, value);
      setSource(result);
      addSource(result.title, result.type);
      setMessages([]);
      setStatus("idle");
      setSidebarOpen(false);
      toast.success(`"${result.title}" is ready. Ask away.`);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Unable to connect to the backend.";
      toast.error(message);
    } finally {
      setIsProcessingSource(false);
    }
  }

  async function handleSend(overrideText?: string) {
    const text = (overrideText ?? input).trim();
    if (!text) return;

    if (!source) {
      toast.error("Add a source before asking a question.");
      return;
    }

    messageTimestampRef.current = getCurrentTimestamp();
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      createdAt: messageTimestampRef.current,
    };

    const historySnapshot = [...messages, userMessage];
    setMessages(historySnapshot);
    setInput("");
    runStatusSequence();

    try {
      const { answer, citations } = await askQuestion(userId, text, messages);

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: answer,
          citations,
          createdAt: Date.now(),
        },
      ]);
      setStatus("completed");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to reach the backend. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "",
          error: message,
          createdAt: Date.now(),
        },
      ]);
      setStatus("error");
    } finally {
      statusTimers.current.forEach(clearTimeout);
      setTimeout(() => setStatus("idle"), 600);
    }
  }

  function handleRetry(failedMessageId: string) {
    const index = messages.findIndex((m) => m.id === failedMessageId);
    if (index <= 0) return;

    const precedingUserMessage = [...messages.slice(0, index)].reverse().find((m) => m.role === "user");
    if (!precedingUserMessage) return;

    setMessages((prev) => prev.filter((m) => m.id !== failedMessageId));
    handleSend(precedingUserMessage.content);
  }

  async function handleNewSession() {
    if (userId) await resetSession(userId);
    setSource(null);
    setMessages([]);
    setInput("");
    setStatus("idle");
    setSidebarOpen(false);
  }

  if (backendStatus !== "ready") {
    return <BackendConnecting unreachable={backendStatus === "unreachable"} />;
  }

  const isBusy = status !== "idle" && status !== "completed" && status !== "error";

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        source={source}
        isProcessing={isProcessingSource}
        onSubmitUrl={(type, url) => handleSubmitSource(type, url)}
        onSubmitFile={(file) => handleSubmitSource("pdf", file)}
        onNewSession={handleNewSession}
        recentSources={recentSources}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <ChatHeader onMenuClick={() => setSidebarOpen(true)} source={source} />

        <main className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <EmptyState source={source} />
          ) : (
            <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onRetry={message.error ? () => handleRetry(message.id) : undefined}
                />
              ))}

              {isBusy && <TypingIndicator status={status} />}

              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        <ChatComposer
          value={input}
          onChange={setInput}
          onSend={() => handleSend()}
          disabled={isBusy || !source}
          hasSource={Boolean(source)}
        />
      </div>
    </div>
  );
}
