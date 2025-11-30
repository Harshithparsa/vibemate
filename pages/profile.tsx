import { useState, useRef } from "react";
import Link from "next/link";
import AnimatedButton from "@/components/AnimatedButton";
import HoverPreview from "@/components/HoverPreview";
import Tooltip from "@/components/Tooltip";
import AnimatedIcon from "@/components/AnimatedIcon";
import VibeMateLogo from "@/components/VibeMateLogo";

interface UserProfile {
  id: string;
  displayName: string;
  username: string;
  bio: string;
  age: number;
  gender: string;
  interests: string[];
  lookingFor: string[];
  location: string;
  avatar: string;
  photos: string[];
}

const mockUser: UserProfile = {
  id: "1",
  displayName: "John Doe",
  username: "johndoe",
  bio: "Adventure seeker | Coffee lover | Always up for travel ✈️",
  age: 28,
  gender: "Male",
  interests: ["Travel", "Photography", "Hiking", "Coffee", "Art"],
  lookingFor: ["Friends", "Travel Partner"],
  location: "New York, USA",
  avatar: "https://via.placeholder.com/300/667eea/ffffff?text=John",
  photos: [
    "https://via.placeholder.com/400/667eea",
    "https://via.placeholder.com/400/764ba2",
    "https://via.placeholder.com/400/f093fb",
  ],
};

export default function Profile() {
  const [user, setUser] = useState<UserProfile>(mockUser);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      // Request gallery permission (this is implicit when user selects files)
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setUser({
            ...user,
            photos: [...user.photos, result],
          });
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Failed to upload photo. Please check your permissions.");
    }
  };

  const handleCameraCapture = async () => {
    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      
      // Trigger camera input
      cameraInputRef.current?.click();
    } catch (error) {
      console.error("Camera permission denied:", error);
      alert("Camera permission is required to take photos.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
        multiple
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={handlePhotoUpload}
        className="hidden"
      />
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-amber-200/50 dark:border-gray-700/50 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <VibeMateLogo size="md" showText={true} />
          </Link>
          <Tooltip content="Go to home" position="bottom">
            <Link
              href="/"
              className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 hover:from-amber-200 hover:to-orange-200 dark:hover:from-amber-900/50 dark:hover:to-orange-900/50 transition-all duration-300 font-semibold text-amber-700 dark:text-amber-300"
            >
              Home
            </Link>
          </Tooltip>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto pt-24">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">My Profile</h2>
            <p className="text-gray-600 dark:text-gray-400">Complete and authentic profile</p>
          </div>
          <AnimatedButton
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "success" : "primary"}
          >
            {isEditing ? "✓ Done" : "✎ Edit"}
          </AnimatedButton>
        </div>

        {/* Profile Card */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-2 border-amber-200/50 dark:border-gray-700/50 rounded-3xl p-8 mb-8 shadow-xl">
          {/* Avatar & Basic Info */}
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <HoverPreview
              type="profile"
              content={
                <div className="p-4">
                  <img
                    src={user.avatar}
                    alt={user.displayName}
                    className="w-32 h-32 rounded-full object-cover border-4 border-amber-400 mx-auto mb-3"
                  />
                  <h3 className="font-bold text-xl text-center text-gray-900 dark:text-gray-100 mb-2">
                    {user.displayName}
                  </h3>
                  <p className="text-center text-gray-600 dark:text-gray-400">@{user.username}</p>
                </div>
              }
            >
              <div className="relative" data-profile>
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 p-1 hover:scale-110 transition-transform duration-300">
                  <img
                    src={user.avatar}
                    alt={user.displayName}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-400 rounded-full border-4 border-white dark:border-gray-800 animate-pulse"></div>
              </div>
            </HoverPreview>

            <div className="flex-1">
              <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                {user.displayName}
              </h2>
              <p className="text-amber-600 dark:text-amber-400 text-lg mb-4 font-semibold">@{user.username}</p>
              <Tooltip content="Share your profile with this username" position="right">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>🔗</span>
                  <span className="font-mono">vibemate.com/@{user.username}</span>
                </div>
              </Tooltip>
              <div className="flex flex-wrap gap-4 text-gray-700 dark:text-gray-300">
                <Tooltip content="Age" position="top">
                  <span className="flex items-center gap-2 px-3 py-1.5 bg-amber-100/50 dark:bg-amber-900/20 rounded-full">
                    <span className="text-xl">🎂</span> {user.age} years
                  </span>
                </Tooltip>
                <Tooltip content="Gender" position="top">
                  <span className="flex items-center gap-2 px-3 py-1.5 bg-rose-100/50 dark:bg-rose-900/20 rounded-full">
                    <span className="text-xl">⚧️</span> {user.gender}
                  </span>
                </Tooltip>
                <Tooltip content="Location" position="top">
                  <span className="flex items-center gap-2 px-3 py-1.5 bg-sky-100/50 dark:bg-sky-900/20 rounded-full">
                    <span className="text-xl">📍</span> {user.location}
                  </span>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-8 pb-8 border-b border-amber-200/50 dark:border-gray-700/50">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span>📝</span> About Me
            </h3>
            {isEditing ? (
              <textarea
                value={user.bio}
                onChange={(e) => setUser({ ...user, bio: e.target.value })}
                className="w-full p-4 bg-white/80 dark:bg-gray-700/80 border-2 border-amber-200/50 dark:border-gray-600/50 rounded-xl text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-amber-400 dark:focus:border-amber-500 focus:ring-4 focus:ring-amber-400/20 transition-all duration-300"
                rows={3}
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{user.bio}</p>
            )}
          </div>

          {/* Interests */}
          <div className="mb-8 pb-8 border-b border-amber-200/50 dark:border-gray-700/50">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
              <span>🎯</span> My Interests
            </h3>
            <div className="flex flex-wrap gap-3">
              {user.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border-2 border-amber-300/50 dark:border-amber-700/50 text-amber-700 dark:text-amber-300 rounded-full text-sm font-semibold hover:scale-110 hover:border-amber-400 dark:hover:border-amber-500 transition-all duration-300 cursor-default"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Looking For */}
          <div className="mb-8 pb-8 border-b border-amber-200/50 dark:border-gray-700/50">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
              <span>✨</span> Looking For
            </h3>
            <div className="flex flex-wrap gap-3">
              {user.lookingFor.map((item) => (
                <span
                  key={item}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 border-2 border-emerald-300/50 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-semibold hover:scale-110 transition-all duration-300 cursor-default"
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>

          {/* Photos Gallery */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <span>📸</span> Gallery
              </h3>
              {isEditing && (
                <div className="flex gap-2">
                  <Tooltip content="Upload from gallery" position="top">
                    <AnimatedButton
                      onClick={() => fileInputRef.current?.click()}
                      variant="primary"
                      size="sm"
                    >
                      📁 Upload
                    </AnimatedButton>
                  </Tooltip>
                  <Tooltip content="Take a photo" position="top">
                    <AnimatedButton
                      onClick={handleCameraCapture}
                      variant="secondary"
                      size="sm"
                    >
                      📷 Camera
                    </AnimatedButton>
                  </Tooltip>
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {user.photos.map((photo, idx) => (
                <HoverPreview
                  key={idx}
                  type="media"
                  content={
                    <div className="p-2">
                      <img
                        src={photo}
                        alt={`Photo ${idx + 1}`}
                        className="w-full h-48 object-cover rounded-lg border-2 border-amber-200"
                      />
                    </div>
                  }
                >
                  <div className="relative group overflow-hidden rounded-xl border-2 border-amber-200/50 dark:border-gray-700/50 hover:border-amber-400 dark:hover:border-amber-500 transition-all duration-300" data-media>
                    <img
                      src={photo}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <AnimatedIcon animation="scale">
                        <span className="text-white text-3xl">🖼️</span>
                      </AnimatedIcon>
                    </div>
                  </div>
                </HoverPreview>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <AnimatedButton
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => (window.location.href = "/discover")}
          >
            🔥 Discover People
          </AnimatedButton>
          <AnimatedButton
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => (window.location.href = "/messages")}
          >
            💬 Messages
          </AnimatedButton>
        </div>

        {/* Back Button */}
        <Link href="/">
          <AnimatedButton variant="ghost" size="md" className="w-full">
            ← Back to Home
          </AnimatedButton>
        </Link>
      </div>
    </div>
  );
}
