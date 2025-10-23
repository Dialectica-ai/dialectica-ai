"use client";

import { useState } from "react";
import { Wand2, Send, X } from "lucide-react";

interface EnhanceModalProps {
  original: string;
  enhanced: string;
  mode: string;
  onSendOriginal: () => void;
  onSendEnhanced: () => void;
  onClose: () => void;
  isConnected: boolean;
}

function EnhanceModal({
  original,
  enhanced,
  mode,
  onSendOriginal,
  onSendEnhanced,
  onClose,
  isConnected,
}: EnhanceModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] md:max-h-96 flex flex-col">
        <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-200 dark:border-neutral-700 flex-shrink-0">
          <h2 className="text-base md:text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Preview Enhancement ({mode})
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 md:p-4 flex flex-col md:grid md:grid-cols-2 gap-3 md:gap-4">
          {/* Original */}
          <div>
            <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase mb-2">
              Your Original
            </p>
            <div className="p-3 bg-neutral-100 dark:bg-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 text-sm leading-relaxed">
              {original}
            </div>
          </div>

          {/* Enhanced */}
          <div>
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase mb-2">
              AI Enhanced
            </p>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-neutral-900 dark:text-neutral-100 text-sm leading-relaxed border border-blue-200 dark:border-blue-800">
              {enhanced}
            </div>
          </div>
        </div>

        <div className="flex gap-2 md:gap-3 p-3 md:p-4 border-t border-gray-200 dark:border-neutral-700 flex-shrink-0">
          <button
            onClick={onSendOriginal}
            className="flex-1 px-3 py-2 md:px-4 md:py-2 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-900 dark:text-neutral-100 rounded-lg font-medium transition-colors text-sm md:text-base"
          >
            Send Original
          </button>
          <button
            onClick={() => {
              if (!isConnected) {
                console.warn('[Client] Cannot send enhanced message: socket disconnected');
                alert('Not connected — cannot send message right now.');
                return;
              }
              onSendEnhanced();
            }}
            disabled={!isConnected}
            className={`flex-1 px-3 py-2 md:px-4 md:py-2 ${isConnected ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'} rounded-lg font-medium transition-colors text-sm md:text-base`}
          >
            Send Enhanced
          </button>
        </div>
      </div>
    </div>
  );
}

interface MessageInputProps {
  messageInput: string;
  setMessageInput: (value: string) => void;
  onSend: (message: string) => void;
  isConnected: boolean;
}

export function MessageInput({
  messageInput,
  setMessageInput,
  onSend,
  isConnected,
}: MessageInputProps) {
  const [showEnhanceModal, setShowEnhanceModal] = useState(false);
  const [enhanceData, setEnhanceData] = useState<{
    original: string;
    enhanced: string;
    mode: string;
  } | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleEnhance = async () => {
    if (!messageInput.trim()) return;

    setIsEnhancing(true);
    try {
      const res = await fetch("http://localhost:5003/enhance-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageInput,
          mode: "formal",
        }),
      });

      if (!res.ok) throw new Error("Enhancement failed");

      const data = await res.json();
      setEnhanceData(data);
      setShowEnhanceModal(true);
    } catch (error) {
      console.error("Enhancement error:", error);
      alert("Failed to enhance message. Try again.");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSendOriginal = () => {
    onSend(messageInput);
    setMessageInput("");
    setShowEnhanceModal(false);
    setEnhanceData(null);
  };

  const handleSendEnhanced = () => {
    if (enhanceData) {
      onSend(enhanceData.enhanced);
      setMessageInput("");
      setShowEnhanceModal(false);
      setEnhanceData(null);
    }
  };

  const handleSendDirect = () => {
    onSend(messageInput);
    setMessageInput("");
  };

  return (
    <>
      <div className="flex gap-2 w-full">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !isEnhancing && handleSendDirect()}
          placeholder="Type your message..."
          className="flex-1 min-w-0 px-3 md:px-4 py-2 md:py-3 rounded-xl border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm md:text-base"
        />

        {/*enhance button*/}
        <button
          onClick={handleEnhance}
          disabled={!isConnected || !messageInput.trim() || isEnhancing}
          className="px-3 md:px-4 py-2 md:py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white rounded-xl font-medium transition-colors disabled:cursor-not-allowed flex items-center gap-2 flex-shrink-0"
          title="AI enhance your message"
        >
          <Wand2 size={18} className="flex-shrink-0" />
          <span className="hidden sm:inline">{isEnhancing ? "..." : "Enhance"}</span>
        </button>

        {/*send button*/}
        <button
          onClick={handleSendDirect}
          disabled={!isConnected || !messageInput.trim()}
          className="px-3 md:px-6 py-2 md:py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl font-medium transition-colors disabled:cursor-not-allowed flex items-center gap-2 flex-shrink-0"
        >
          <Send size={18} className="flex-shrink-0" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </div>

      {showEnhanceModal && enhanceData && (
        <EnhanceModal
          original={enhanceData.original}
          enhanced={enhanceData.enhanced}
          mode={enhanceData.mode}
          onSendOriginal={handleSendOriginal}
          onSendEnhanced={handleSendEnhanced}
          onClose={() => setShowEnhanceModal(false)}
          isConnected={isConnected}
        />
      )}
    </>
  );
}