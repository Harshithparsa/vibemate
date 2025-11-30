import { useState } from "react";
import Link from "next/link";
import AnimatedButton from "@/components/AnimatedButton";
import HoverPreview from "@/components/HoverPreview";
import Tooltip from "@/components/Tooltip";
import NotificationBadge from "@/components/NotificationBadge";
import AnimatedIcon from "@/components/AnimatedIcon";
import VibeMateLogo from "@/components/VibeMateLogo";

interface ChatRoom {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  status: "online" | "away" | "offline";
  type: "direct" | "group";
}

const mockChatRooms: ChatRoom[] = [
  {
    id: "1",
    name: "Sarah",
    avatar: "https://via.placeholder.com/150/ec4899/ffffff?text=S",
    lastMessage: "Hey! How are you doing?",
    timestamp: "2 min ago",
    unread: 2,
    status: "online",
    type: "direct",
  },
  {
    id: "2",
    name: "Travel Buddies Group",
    avatar: "https://via.placeholder.com/150/3b82f6/ffffff?text=TB",
    lastMessage: "Mike: Let's plan our next trip!",
    timestamp: "1h ago",
    unread: 5,
    status: "online",
    type: "group",
  },
  {
    id: "3",
    name: "Emma",
    avatar: "https://via.placeholder.com/150/f97316/ffffff?text=E",
    lastMessage: "Thanks for the recommendation!",
    timestamp: "3h ago",
    unread: 0,
    status: "away",
    type: "direct",
  },
];

export default function Chat() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [rooms] = useState<ChatRoom[]>(mockChatRooms);

  const currentRoom = rooms.find((r) => r.id === selectedRoom);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle sending message
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-amber-200/50 dark:border-gray-700/50 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <VibeMateLogo size="md" showText={true} />
          </Link>
          <div className="flex items-center gap-4">
            <Tooltip content="Go to home" position="bottom">
              <Link
                href="/"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 hover:from-amber-200 hover:to-orange-200 dark:hover:from-amber-900/50 dark:hover:to-orange-900/50 transition-all duration-300 font-semibold text-amber-700 dark:text-amber-300"
              >
                Home
              </Link>
            </Tooltip>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto pt-24 pb-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Real-Time Chat
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Connect instantly with your network. Send messages, share media, and stay in touch in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Rooms Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-2 border-amber-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-amber-200/50 dark:border-gray-700/50 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20">
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">Chats</h3>
              </div>
              {rooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room.id)}
                  className={`w-full p-4 border-b border-amber-200/30 dark:border-gray-700/30 hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/50 dark:hover:from-amber-900/20 dark:hover:to-orange-900/20 transition-all duration-300 text-left ${
                    selectedRoom === room.id
                      ? "bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 border-l-4 border-l-amber-500"
                      : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="relative">
                      <img
                        src={room.avatar}
                        alt={room.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-amber-300 dark:border-amber-600"
                      />
                      <div
                        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-800 ${
                          room.status === "online"
                            ? "bg-emerald-400"
                            : room.status === "away"
                            ? "bg-amber-400"
                            : "bg-gray-400"
                        }`}
                      ></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                          {room.name}
                        </h3>
                        {room.unread > 0 && (
                          <NotificationBadge count={room.unread} variant="pulse">
                            <div className="w-2 h-2"></div>
                          </NotificationBadge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {room.lastMessage}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {room.timestamp}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {currentRoom ? (
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-2 border-amber-200/50 dark:border-gray-700/50 rounded-2xl h-[600px] flex flex-col overflow-hidden shadow-xl">
                {/* Chat Header */}
                <div className="p-6 border-b border-amber-200/50 dark:border-gray-700/50 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20">
                  <div className="flex items-center justify-between">
                    <HoverPreview
                      type="profile"
                      content={
                        <div className="p-4">
                          <img
                            src={currentRoom.avatar}
                            alt={currentRoom.name}
                            className="w-20 h-20 rounded-full object-cover border-2 border-amber-400 mx-auto mb-3"
                          />
                          <h3 className="font-bold text-xl text-center text-gray-900 dark:text-gray-100">
                            {currentRoom.name}
                          </h3>
                          <p className="text-center text-gray-600 dark:text-gray-400">
                            {currentRoom.status === "online" ? "🟢 Online" : currentRoom.status === "away" ? "🟡 Away" : "⚫ Offline"}
                          </p>
                        </div>
                      }
                    >
                      <div className="flex items-center gap-3" data-profile>
                        <img
                          src={currentRoom.avatar}
                          alt={currentRoom.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-amber-400"
                        />
                        <div>
                          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                            {currentRoom.name}
                          </h2>
                          <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                            {currentRoom.status === "online" ? "Online" : currentRoom.status === "away" ? "Away" : "Offline"}
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
                      <Tooltip content="Voice call" position="bottom">
                        <AnimatedIcon animation="scale" tooltip="Voice call">
                          <span className="text-xl">📞</span>
                        </AnimatedIcon>
                      </Tooltip>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <div className="flex justify-start">
                    <div className="max-w-xs px-4 py-3 bg-white/80 dark:bg-gray-700/80 border-2 border-amber-200/50 dark:border-gray-600/50 rounded-2xl rounded-bl-none text-gray-800 dark:text-gray-100">
                      <p>Hey! How are you doing?</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">2 min ago</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-xs px-4 py-3 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-white rounded-2xl rounded-br-none">
                      <p>I'm doing great! Thanks for asking!</p>
                      <p className="text-xs text-amber-100 mt-2">Just now</p>
                    </div>
                  </div>
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
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
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
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-2 border-amber-200/50 dark:border-gray-700/50 rounded-2xl h-[600px] flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 shadow-xl">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-lg font-semibold">Select a chat to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

