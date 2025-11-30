import { useState } from "react";
import Link from "next/link";
import AnimatedButton from "@/components/AnimatedButton";
import HoverPreview from "@/components/HoverPreview";
import NotificationBadge from "@/components/NotificationBadge";
import ReactionButton from "@/components/ReactionButton";
import AnimatedIcon from "@/components/AnimatedIcon";
import Tooltip from "@/components/Tooltip";
import VibeMateLogo from "@/components/VibeMateLogo";

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  status: "online" | "away" | "offline";
  bio?: string;
}

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  type: "text" | "image" | "file";
  reactions?: { emoji: string; count: number }[];
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    name: "Sarah",
    avatar: "https://via.placeholder.com/150/ec4899/ffffff?text=Sarah",
    lastMessage: "That sounds great! When are you free?",
    timestamp: "2 min",
    unread: true,
    status: "online",
    bio: "Adventure seeker exploring the world ✈️",
  },
  {
    id: "2",
    name: "Mike",
    avatar: "https://via.placeholder.com/150/3b82f6/ffffff?text=Mike",
    lastMessage: "Let's meet up next weekend!",
    timestamp: "1h ago",
    unread: false,
    status: "away",
    bio: "Tech enthusiast who loves outdoor adventures",
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    sender: "Sarah",
    text: "Hey! How are you?",
    timestamp: "10:30 AM",
    type: "text",
    reactions: [{ emoji: "❤️", count: 1 }],
  },
  {
    id: "2",
    sender: "You",
    text: "Hi Sarah! I'm doing great, thanks for asking!",
    timestamp: "10:35 AM",
    type: "text",
  },
  {
    id: "3",
    sender: "Sarah",
    text: "That sounds great! When are you free?",
    timestamp: "10:40 AM",
    type: "text",
  },
];

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [messageReactions, setMessageReactions] = useState<Record<string, { emoji: string; count: number }[]>>({
    "1": [{ emoji: "❤️", count: 1 }],
  });

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: (messages.length + 1).toString(),
        sender: "You",
        text: inputMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "text",
      };
      setMessages([...messages, newMessage]);
      setInputMessage("");
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessageReactions((prev) => {
      const current = prev[messageId] || [];
      const existing = current.find((r) => r.emoji === emoji);
      if (existing) {
        return {
          ...prev,
          [messageId]: current.map((r) =>
            r.emoji === emoji ? { ...r, count: r.count + 1 } : r
          ),
        };
      }
      return {
        ...prev,
        [messageId]: [...current, { emoji, count: 1 }],
      };
    });
  };

  const selectedConv = mockConversations.find((c) => c.id === selectedConversation);
  const unreadCount = mockConversations.filter((c) => c.unread).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-amber-200/50 dark:border-gray-700/50 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <VibeMateLogo size="md" showText={true} />
          </Link>
            {unreadCount > 0 && (
              <NotificationBadge count={unreadCount} variant="pulse">
                <div className="w-2 h-2"></div>
              </NotificationBadge>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Tooltip content="Discover new connections" position="bottom">
              <Link
                href="/discover"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 hover:from-amber-200 hover:to-orange-200 dark:hover:from-amber-900/50 dark:hover:to-orange-900/50 transition-all duration-300 font-semibold text-amber-700 dark:text-amber-300"
              >
                Discover
              </Link>
            </Tooltip>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto pt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Conversations Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-2 border-amber-200/50 dark:border-gray-700/50 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-amber-200/50 dark:border-gray-700/50 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20">
              <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">Conversations</h2>
            </div>
            {mockConversations.map((conv) => (
              <HoverPreview
                key={conv.id}
                type="profile"
                content={
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={conv.avatar}
                        alt={conv.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-amber-400"
                      />
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{conv.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {conv.status === "online" ? "🟢 Online" : conv.status === "away" ? "🟡 Away" : "⚫ Offline"}
                        </p>
                      </div>
                    </div>
                    {conv.bio && (
                      <p className="text-sm text-gray-700 dark:text-gray-300">{conv.bio}</p>
                    )}
                  </div>
                }
              >
                <button
                  data-profile
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full p-4 border-b border-amber-200/30 dark:border-gray-700/30 hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/50 dark:hover:from-amber-900/20 dark:hover:to-orange-900/20 transition-all duration-300 text-left group ${
                    selectedConversation === conv.id
                      ? "bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 border-l-4 border-l-amber-500"
                      : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="relative">
                      <img
                        src={conv.avatar}
                        alt={conv.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-amber-300 dark:border-amber-600 group-hover:scale-110 transition-transform duration-300"
                      />
                      <div
                        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-800 ${
                          conv.status === "online"
                            ? "bg-emerald-400"
                            : conv.status === "away"
                            ? "bg-amber-400"
                            : "bg-gray-400"
                        }`}
                      ></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {conv.name}
                        </h3>
                        {conv.unread && (
                          <NotificationBadge count={1} variant="pulse">
                            <div className="w-2 h-2"></div>
                          </NotificationBadge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{conv.lastMessage}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{conv.timestamp}</p>
                    </div>
                  </div>
                </button>
              </HoverPreview>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2">
          {selectedConversation && selectedConv ? (
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-2 border-amber-200/50 dark:border-gray-700/50 rounded-3xl h-[600px] flex flex-col overflow-hidden shadow-xl">
              {/* Chat Header */}
              <div className="p-6 border-b border-amber-200/50 dark:border-gray-700/50 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20">
                <div className="flex items-center justify-between">
                  <HoverPreview
                    type="profile"
                    content={
                      <div className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={selectedConv.avatar}
                            alt={selectedConv.name}
                            className="w-20 h-20 rounded-full object-cover border-2 border-amber-400"
                          />
                          <div>
                            <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100">{selectedConv.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {selectedConv.status === "online" ? "🟢 Online" : selectedConv.status === "away" ? "🟡 Away" : "⚫ Offline"}
                            </p>
                          </div>
                        </div>
                        {selectedConv.bio && (
                          <p className="text-sm text-gray-700 dark:text-gray-300">{selectedConv.bio}</p>
                        )}
                      </div>
                    }
                  >
                    <div className="flex items-center gap-3" data-profile>
                      <img
                        src={selectedConv.avatar}
                        alt={selectedConv.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 hover:scale-110 transition-transform duration-300"
                      />
                      <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{selectedConv.name}</h2>
                        <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                          {selectedConv.status === "online" ? "Online" : selectedConv.status === "away" ? "Away" : "Offline"}
                        </p>
                      </div>
                    </div>
                  </HoverPreview>
                  <div className="flex items-center gap-2">
                    <Tooltip content="Video call" position="bottom">
                      <AnimatedIcon animation="scale" tooltip="Video call">
                        <span className="text-xl">📹</span>
                      </AnimatedIcon>
                    </Tooltip>
                    <Tooltip content="More options" position="bottom">
                      <AnimatedIcon animation="rotate" tooltip="More options">
                        <span className="text-xl">⋯</span>
                      </AnimatedIcon>
                    </Tooltip>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    data-message
                    className={`flex flex-col ${msg.sender === "You" ? "items-end" : "items-start"} group`}
                  >
                    <div
                      className={`max-w-xs px-4 py-3 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 ${
                        msg.sender === "You"
                          ? "bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-white rounded-br-none"
                          : "bg-white/80 dark:bg-gray-700/80 border-2 border-amber-200/50 dark:border-gray-600/50 text-gray-800 dark:text-gray-100 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p
                          className={`text-xs ${
                            msg.sender === "You" ? "text-amber-100" : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                    {/* Reactions */}
                    <div className="flex items-center gap-2 mt-2">
                      {(messageReactions[msg.id] || []).map((reaction, idx) => (
                        <ReactionButton
                          key={idx}
                          emoji={reaction.emoji}
                          count={reaction.count}
                          onClick={() => handleReaction(msg.id, reaction.emoji)}
                          isActive={false}
                        />
                      ))}
                      <Tooltip content="Add reaction" position="top">
                        <AnimatedIcon
                          animation="scale"
                          onClick={() => {
                            const emojis = ["❤️", "👍", "😊", "🎉", "🔥"];
                            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                            handleReaction(msg.id, randomEmoji);
                          }}
                        >
                          <span className="text-sm">😊</span>
                        </AnimatedIcon>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-amber-200/50 dark:border-gray-700/50 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20 flex gap-3">
                <Tooltip content="Add media" position="top">
                  <AnimatedIcon animation="scale" tooltip="Add media">
                    <span className="text-xl">📎</span>
                  </AnimatedIcon>
                </Tooltip>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                  className="flex-1 px-4 py-3 bg-white/80 dark:bg-gray-700/80 border-2 border-amber-200/50 dark:border-gray-600/50 rounded-full text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-amber-400 dark:focus:border-amber-500 focus:ring-4 focus:ring-amber-400/20 transition-all duration-300"
                />
                <AnimatedButton onClick={handleSendMessage} variant="primary" size="md">
                  Send
                </AnimatedButton>
              </div>
            </div>
          ) : (
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-2 border-amber-200/50 dark:border-gray-700/50 rounded-3xl h-[600px] flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 shadow-xl">
              <div className="text-6xl mb-4 animate-bounce">💬</div>
              <p className="text-lg font-semibold">Select a conversation to start chatting</p>
              <p className="text-sm mt-2 text-gray-400 dark:text-gray-500">Choose someone from the sidebar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
