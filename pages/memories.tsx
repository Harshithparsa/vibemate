import { useState } from "react";
import Link from "next/link";
import AnimatedButton from "@/components/AnimatedButton";
import HoverPreview from "@/components/HoverPreview";
import Tooltip from "@/components/Tooltip";
import AnimatedIcon from "@/components/AnimatedIcon";
import ReactionButton from "@/components/ReactionButton";
import VibeMateLogo from "@/components/VibeMateLogo";

interface Memory {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  media?: string[];
  timestamp: string;
  location?: string;
  likes: number;
  comments: number;
  reactions: { emoji: string; count: number }[];
}

const mockMemories: Memory[] = [
  {
    id: "1",
    author: "Sarah",
    authorAvatar: "https://via.placeholder.com/150/ec4899/ffffff?text=S",
    content: "Amazing sunset in Tokyo! 🌅 The city never fails to amaze me.",
    media: [
      "https://via.placeholder.com/600/ec4899",
      "https://via.placeholder.com/600/f97316",
    ],
    timestamp: "2 hours ago",
    location: "Tokyo, Japan",
    likes: 24,
    comments: 5,
    reactions: [{ emoji: "❤️", count: 24 }, { emoji: "🔥", count: 8 }],
  },
  {
    id: "2",
    author: "Mike",
    authorAvatar: "https://via.placeholder.com/150/3b82f6/ffffff?text=M",
    content: "Just finished an incredible hiking trail in Bali! The views were absolutely breathtaking. 🏔️",
    media: ["https://via.placeholder.com/600/3b82f6"],
    timestamp: "5 hours ago",
    location: "Bali, Indonesia",
    likes: 42,
    comments: 12,
    reactions: [{ emoji: "👍", count: 42 }, { emoji: "😍", count: 15 }],
  },
  {
    id: "3",
    author: "Emma",
    authorAvatar: "https://via.placeholder.com/150/f97316/ffffff?text=E",
    content: "Exploring the art galleries in Paris. So much inspiration! 🎨",
    media: [
      "https://via.placeholder.com/600/f97316",
      "https://via.placeholder.com/600/8b5cf6",
      "https://via.placeholder.com/600/ec4899",
    ],
    timestamp: "1 day ago",
    location: "Paris, France",
    likes: 38,
    comments: 8,
    reactions: [{ emoji: "❤️", count: 38 }, { emoji: "🎨", count: 10 }],
  },
];

export default function Memories() {
  const [memories] = useState<Memory[]>(mockMemories);
  const [selectedMemory, setSelectedMemory] = useState<string | null>(null);

  const handleLike = (memoryId: string) => {
    // Handle like functionality
    console.log("Liked memory:", memoryId);
  };

  const handleReaction = (memoryId: string, emoji: string) => {
    // Handle reaction functionality
    console.log("Reacted to memory:", memoryId, emoji);
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
            <Tooltip content="Create new memory" position="bottom">
              <AnimatedButton variant="primary" size="sm">
                + Create
              </AnimatedButton>
            </Tooltip>
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

      <div className="max-w-4xl mx-auto pt-24 pb-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Share Your Moments
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Capture and share your life's beautiful moments with your network. Create lasting memories together.
          </p>
        </div>

        {/* Memories Feed */}
        <div className="space-y-6">
          {memories.map((memory) => (
            <div
              key={memory.id}
              className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-2 border-amber-200/50 dark:border-gray-700/50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300"
            >
              {/* Author Header */}
              <div className="flex items-center gap-3 mb-4">
                <HoverPreview
                  type="profile"
                  content={
                    <div className="p-4">
                      <img
                        src={memory.authorAvatar}
                        alt={memory.author}
                        className="w-20 h-20 rounded-full object-cover border-2 border-amber-400 mx-auto mb-3"
                      />
                      <h3 className="font-bold text-xl text-center text-gray-900 dark:text-gray-100">
                        {memory.author}
                      </h3>
                    </div>
                  }
                >
                  <img
                    src={memory.authorAvatar}
                    alt={memory.author}
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-300 dark:border-amber-600"
                    data-profile
                  />
                </HoverPreview>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100">{memory.author}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>{memory.timestamp}</span>
                    {memory.location && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span>📍</span>
                          {memory.location}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <p className="text-gray-800 dark:text-gray-100 mb-4 text-lg leading-relaxed">
                {memory.content}
              </p>

              {/* Media */}
              {memory.media && memory.media.length > 0 && (
                <div
                  className={`grid gap-2 mb-4 ${
                    memory.media.length === 1
                      ? "grid-cols-1"
                      : memory.media.length === 2
                      ? "grid-cols-2"
                      : "grid-cols-2"
                  }`}
                >
                  {memory.media.map((media, idx) => (
                    <HoverPreview
                      key={idx}
                      type="media"
                      content={
                        <div className="p-2">
                          <img
                            src={media}
                            alt={`Memory ${idx + 1}`}
                            className="w-full h-64 object-cover rounded-lg border-2 border-amber-200"
                          />
                        </div>
                      }
                    >
                      <div
                        className={`relative group overflow-hidden rounded-xl border-2 border-amber-200/50 dark:border-gray-700/50 hover:border-amber-400 dark:hover:border-amber-500 transition-all duration-300 ${
                          memory.media!.length === 1 ? "h-96" : "h-48"
                        }`}
                        data-media
                      >
                        <img
                          src={media}
                          alt={`Memory ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {memory.media!.length > 3 && idx === 2 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">
                              +{memory.media!.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                    </HoverPreview>
                  ))}
                </div>
              )}

              {/* Reactions */}
              <div className="flex items-center gap-3 mb-4">
                {memory.reactions.map((reaction, idx) => (
                  <ReactionButton
                    key={idx}
                    emoji={reaction.emoji}
                    count={reaction.count}
                    onClick={() => handleReaction(memory.id, reaction.emoji)}
                    isActive={false}
                  />
                ))}
                <Tooltip content="Add reaction" position="top">
                  <AnimatedIcon
                    animation="scale"
                    onClick={() => {
                      const emojis = ["❤️", "👍", "😊", "🎉", "🔥"];
                      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                      handleReaction(memory.id, randomEmoji);
                    }}
                  >
                    <span className="text-sm">😊</span>
                  </AnimatedIcon>
                </Tooltip>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-amber-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(memory.id)}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                  >
                    <span className="text-xl">❤️</span>
                    <span className="font-semibold">{memory.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors">
                    <span className="text-xl">💬</span>
                    <span className="font-semibold">{memory.comments}</span>
                  </button>
                  <Tooltip content="Share memory" position="top">
                    <AnimatedIcon animation="scale">
                      <span className="text-xl">📤</span>
                    </AnimatedIcon>
                  </Tooltip>
                </div>
                <Tooltip content="Save memory" position="top">
                  <AnimatedIcon animation="scale">
                    <span className="text-xl">🔖</span>
                  </AnimatedIcon>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

