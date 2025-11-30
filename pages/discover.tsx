import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import AnimatedButton from "@/components/AnimatedButton";
import HoverPreview from "@/components/HoverPreview";
import Tooltip from "@/components/Tooltip";
import AnimatedIcon from "@/components/AnimatedIcon";
import ReactionButton from "@/components/ReactionButton";
import VibeMateLogo from "@/components/VibeMateLogo";

interface User {
  id: string;
  username: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  country: string;
  area: string;
  latitude: number;
  longitude: number;
  interests: string[];
  lookingFor: string[];
  avatar: string;
  bio: string;
  photos?: string[];
}

// Comprehensive list of countries
const ALL_COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
  "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
  "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
  "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
  "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
  "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal",
  "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan",
  "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
  "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia",
  "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
  "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
  "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
].sort();

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const mockUsers: User[] = [
  {
    id: "2",
    username: "@sarahj",
    name: "Sarah",
    age: 26,
    gender: "Female",
    location: "Los Angeles, USA",
    country: "United States",
    area: "Los Angeles",
    latitude: 34.0522,
    longitude: -118.2437,
    interests: ["Travel", "Yoga", "Photography", "Nature"],
    lookingFor: ["Travel Partner", "Friends"],
    avatar: "https://via.placeholder.com/400/ec4899/ffffff?text=Sarah",
    bio: "Adventure seeker exploring the world one country at a time ✈️",
    photos: [
      "https://via.placeholder.com/400/ec4899",
      "https://via.placeholder.com/400/f97316",
      "https://via.placeholder.com/400/3b82f6",
    ],
  },
  {
    id: "3",
    username: "@mikec",
    name: "Mike",
    age: 30,
    gender: "Male",
    location: "Chicago, USA",
    country: "United States",
    area: "Chicago",
    latitude: 41.8781,
    longitude: -87.6298,
    interests: ["Hiking", "Coffee", "Music", "Tech"],
    lookingFor: ["Friends", "Dating"],
    avatar: "https://via.placeholder.com/400/3b82f6/ffffff?text=Mike",
    bio: "Tech enthusiast who loves outdoor adventures",
    photos: [
      "https://via.placeholder.com/400/3b82f6",
      "https://via.placeholder.com/400/10b981",
      "https://via.placeholder.com/400/f59e0b",
    ],
  },
  {
    id: "4",
    username: "@emmaw",
    name: "Emma",
    age: 24,
    gender: "Female",
    location: "Boston, USA",
    country: "United States",
    area: "Boston",
    latitude: 42.3601,
    longitude: -71.0589,
    interests: ["Art", "Travel", "Food", "Photography"],
    lookingFor: ["Friends"],
    avatar: "https://via.placeholder.com/400/f97316/ffffff?text=Emma",
    bio: "Artist and foodie exploring new cultures",
    photos: [
      "https://via.placeholder.com/400/f97316",
      "https://via.placeholder.com/400/8b5cf6",
      "https://via.placeholder.com/400/ec4899",
    ],
  },
  {
    id: "5",
    username: "@alexr",
    name: "Alex",
    age: 28,
    gender: "Other",
    location: "New York, USA",
    country: "United States",
    area: "New York",
    latitude: 40.7128,
    longitude: -74.0060,
    interests: ["Music", "Dancing", "Food", "Travel"],
    lookingFor: ["Friends", "Dating"],
    avatar: "https://via.placeholder.com/400/8b5cf6/ffffff?text=Alex",
    bio: "Music lover and food enthusiast",
    photos: [
      "https://via.placeholder.com/400/8b5cf6",
      "https://via.placeholder.com/400/ec4899",
      "https://via.placeholder.com/400/10b981",
    ],
  },
  {
    id: "6",
    username: "@davidt",
    name: "David",
    age: 32,
    gender: "Male",
    location: "San Francisco, USA",
    country: "United States",
    area: "San Francisco",
    latitude: 37.7749,
    longitude: -122.4194,
    interests: ["Tech", "Hiking", "Photography", "Coffee"],
    lookingFor: ["Friends", "Travel Partner"],
    avatar: "https://via.placeholder.com/400/10b981/ffffff?text=David",
    bio: "Tech professional who loves nature",
    photos: [
      "https://via.placeholder.com/400/10b981",
      "https://via.placeholder.com/400/3b82f6",
      "https://via.placeholder.com/400/f59e0b",
    ],
  },
  {
    id: "7",
    username: "@sophiel",
    name: "Sophie",
    age: 27,
    gender: "Female",
    location: "London, UK",
    country: "United Kingdom",
    area: "London",
    latitude: 51.5074,
    longitude: -0.1278,
    interests: ["Art", "Travel", "Food", "Photography"],
    lookingFor: ["Friends", "Travel Partner"],
    avatar: "https://via.placeholder.com/400/ec4899/ffffff?text=Sophie",
    bio: "Art lover exploring the world",
    photos: [
      "https://via.placeholder.com/400/ec4899",
      "https://via.placeholder.com/400/f97316",
      "https://via.placeholder.com/400/3b82f6",
    ],
  },
  {
    id: "8",
    username: "@lucasp",
    name: "Lucas",
    age: 29,
    gender: "Male",
    location: "Paris, France",
    country: "France",
    area: "Paris",
    latitude: 48.8566,
    longitude: 2.3522,
    interests: ["Food", "Travel", "Photography", "Music"],
    lookingFor: ["Friends", "Dating"],
    avatar: "https://via.placeholder.com/400/3b82f6/ffffff?text=Lucas",
    bio: "Food enthusiast and traveler",
    photos: [
      "https://via.placeholder.com/400/3b82f6",
      "https://via.placeholder.com/400/10b981",
      "https://via.placeholder.com/400/f59e0b",
    ],
  },
  {
    id: "9",
    username: "@mariak",
    name: "Maria",
    age: 25,
    gender: "Female",
    location: "Tokyo, Japan",
    country: "Japan",
    area: "Tokyo",
    latitude: 35.6762,
    longitude: 139.6503,
    interests: ["Travel", "Food", "Photography", "Art"],
    lookingFor: ["Friends", "Travel Partner"],
    avatar: "https://via.placeholder.com/400/f97316/ffffff?text=Maria",
    bio: "Exploring Japanese culture and cuisine",
    photos: [
      "https://via.placeholder.com/400/f97316",
      "https://via.placeholder.com/400/8b5cf6",
      "https://via.placeholder.com/400/ec4899",
    ],
  },
];

export default function Discover() {
  const [allUsers] = useState<User[]>(mockUsers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filters, setFilters] = useState({
    gender: "",
    ageMin: "",
    ageMax: "",
    country: "",
    lookingFor: "",
    username: "",
  });
  const [liked, setLiked] = useState<string[]>([]);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationError, setLocationError] = useState<string>("");

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          setLocationError("Location access denied. Using default location.");
          // Default to a central location if geolocation fails
          setUserLocation({ lat: 40.7128, lon: -74.0060 }); // New York as default
        }
      );
    } else {
      setLocationError("Geolocation not supported. Using default location.");
      setUserLocation({ lat: 40.7128, lon: -74.0060 }); // New York as default
    }
  }, []);

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = [...allUsers];

    // Apply filters
    if (filters.gender) {
      filtered = filtered.filter((user) => user.gender === filters.gender);
    }

    // Only apply age filters if they have values
    if (filters.ageMin && filters.ageMin.trim() !== "") {
      const minAge = parseInt(filters.ageMin);
      if (!isNaN(minAge)) {
        filtered = filtered.filter((user) => user.age >= minAge);
      }
    }

    if (filters.ageMax && filters.ageMax.trim() !== "") {
      const maxAge = parseInt(filters.ageMax);
      if (!isNaN(maxAge)) {
        filtered = filtered.filter((user) => user.age <= maxAge);
      }
    }

    if (filters.country) {
      filtered = filtered.filter((user) => user.country === filters.country);
    }

    if (filters.lookingFor) {
      filtered = filtered.filter((user) => user.lookingFor.includes(filters.lookingFor));
    }

    if (filters.username) {
      filtered = filtered.filter((user) =>
        user.username.toLowerCase().includes(filters.username.toLowerCase()) ||
        user.name.toLowerCase().includes(filters.username.toLowerCase())
      );
    }

    // Calculate distances and add to users
    const usersWithDistance = filtered.map((user) => {
      let distance = 0;
      if (userLocation) {
        distance = calculateDistance(
          userLocation.lat,
          userLocation.lon,
          user.latitude,
          user.longitude
        );
      }
      return { ...user, distance };
    });

    // Sort by distance (near to far)
    usersWithDistance.sort((a, b) => a.distance - b.distance);

    return usersWithDistance;
  }, [allUsers, filters, userLocation]);

  const currentUser = filteredAndSortedUsers[currentIndex];

  const handleLike = () => {
    if (currentUser) {
      setLiked([...liked, currentUser.id]);
      setShowLikeAnimation(true);
      setTimeout(() => setShowLikeAnimation(false), 1000);
      setTimeout(() => nextProfile(), 500);
    }
  };

  const handlePass = () => {
    nextProfile();
  };

  const nextProfile = () => {
    if (currentIndex < filteredAndSortedUsers.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">No users found matching your filters</p>
          <AnimatedButton
            onClick={() => setFilters({ gender: "", ageMin: "", ageMax: "", country: "", lookingFor: "", username: "" })}
            variant="primary"
          >
            Clear Filters
          </AnimatedButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-amber-200/50 dark:border-gray-700/50 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <VibeMateLogo size="md" showText={true} />
          </Link>
          <div className="flex items-center gap-4">
            {locationError && (
              <span className="text-xs text-amber-600 dark:text-amber-400">{locationError}</span>
            )}
            <Tooltip content="View your profile" position="bottom">
              <Link
                href="/profile"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 hover:from-amber-200 hover:to-orange-200 dark:hover:from-amber-900/50 dark:hover:to-orange-900/50 transition-all duration-300 font-semibold text-amber-700 dark:text-amber-300"
              >
                Profile
              </Link>
            </Tooltip>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto pt-24 pb-8">
        {/* Filters */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-2 border-amber-200/50 dark:border-gray-700/50 rounded-2xl p-4 mb-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span>🔍</span> Filter People
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <Tooltip content="Search by username or name" position="top">
              <input
                type="text"
                placeholder="Search by @username or name"
                value={filters.username}
                onChange={(e) => setFilters({ ...filters, username: e.target.value })}
                className="p-3 bg-white/80 dark:bg-gray-700/80 border-2 border-amber-200/50 dark:border-gray-600/50 rounded-xl text-gray-800 dark:text-gray-100 focus:outline-none focus:border-amber-400 dark:focus:border-amber-500 focus:ring-4 focus:ring-amber-400/20 transition-all duration-300 backdrop-blur-sm text-sm"
              />
            </Tooltip>

            <Tooltip content="Filter by gender" position="top">
              <select
                value={filters.gender}
                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                className="p-3 bg-white/80 dark:bg-gray-700/80 border-2 border-amber-200/50 dark:border-gray-600/50 rounded-xl text-gray-800 dark:text-gray-100 focus:outline-none focus:border-amber-400 dark:focus:border-amber-500 focus:ring-4 focus:ring-amber-400/20 transition-all duration-300 backdrop-blur-sm text-sm"
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </Tooltip>

            <div className="grid grid-cols-2 gap-2">
              <Tooltip content="Minimum age" position="top">
                <input
                  type="number"
                  placeholder="Min Age"
                  value={filters.ageMin}
                  onChange={(e) => setFilters({ ...filters, ageMin: e.target.value })}
                  className="p-3 bg-white/80 dark:bg-gray-700/80 border-2 border-amber-200/50 dark:border-gray-600/50 rounded-xl text-gray-800 dark:text-gray-100 focus:outline-none focus:border-amber-400 dark:focus:border-amber-500 focus:ring-4 focus:ring-amber-400/20 transition-all duration-300 backdrop-blur-sm text-sm"
                  min="18"
                  max="100"
                />
              </Tooltip>

              <Tooltip content="Maximum age" position="top">
                <input
                  type="number"
                  placeholder="Max Age"
                  value={filters.ageMax}
                  onChange={(e) => setFilters({ ...filters, ageMax: e.target.value })}
                  className="p-3 bg-white/80 dark:bg-gray-700/80 border-2 border-amber-200/50 dark:border-gray-600/50 rounded-xl text-gray-800 dark:text-gray-100 focus:outline-none focus:border-amber-400 dark:focus:border-amber-500 focus:ring-4 focus:ring-amber-400/20 transition-all duration-300 backdrop-blur-sm text-sm"
                  min="18"
                  max="100"
                />
              </Tooltip>
            </div>

            <Tooltip content="Filter by country" position="top">
              <select
                value={filters.country}
                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                className="p-3 bg-white/80 dark:bg-gray-700/80 border-2 border-amber-200/50 dark:border-gray-600/50 rounded-xl text-gray-800 dark:text-gray-100 focus:outline-none focus:border-amber-400 dark:focus:border-amber-500 focus:ring-4 focus:ring-amber-400/20 transition-all duration-300 backdrop-blur-sm text-sm"
              >
                <option value="">All Countries</option>
                {ALL_COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </Tooltip>

            <Tooltip content="Filter by what they're looking for" position="top">
              <select
                value={filters.lookingFor}
                onChange={(e) => setFilters({ ...filters, lookingFor: e.target.value })}
                className="p-3 bg-white/80 dark:bg-gray-700/80 border-2 border-amber-200/50 dark:border-gray-600/50 rounded-xl text-gray-800 dark:text-gray-100 focus:outline-none focus:border-amber-400 dark:focus:border-amber-500 focus:ring-4 focus:ring-amber-400/20 transition-all duration-300 backdrop-blur-sm text-sm"
              >
                <option value="">Looking For</option>
                <option value="Friends">Friends</option>
                <option value="Travel Partner">Travel Partner</option>
                <option value="Dating">Dating</option>
              </select>
            </Tooltip>

            <Tooltip content="Clear all filters" position="top">
              <AnimatedButton
                onClick={() => setFilters({ gender: "", ageMin: "", ageMax: "", country: "", lookingFor: "", username: "" })}
                variant="ghost"
                size="sm"
                className="w-full"
              >
                Clear Filters
              </AnimatedButton>
            </Tooltip>
          </div>
        </div>

        {/* Profile Card with Animation */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-2 border-amber-200/50 dark:border-gray-700/50 rounded-3xl overflow-hidden shadow-2xl mb-8 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
          {/* Profile Image */}
          <div className="relative h-96 overflow-hidden group">
            <HoverPreview
              type="media"
              content={
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-gray-100">Photos</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {currentUser.photos?.map((photo, idx) => (
                      <img
                        key={idx}
                        src={photo}
                        alt={`Photo ${idx + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-amber-200"
                      />
                    ))}
                  </div>
                </div>
              }
            >
              <img
                data-media
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </HoverPreview>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

            {/* Like Animation Overlay */}
            {showLikeAnimation && (
              <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                <div className="text-9xl animate-scale-in">❤️</div>
              </div>
            )}

            {/* Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <HoverPreview
                type="profile"
                content={
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-amber-400"
                      />
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100">
                          {currentUser.name}, {currentUser.age}
                        </h3>
                        <p className="text-sm text-amber-600 dark:text-amber-400 font-semibold">
                          {currentUser.username}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{currentUser.location}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{currentUser.bio}</p>
                    <div className="flex flex-wrap gap-2">
                      {currentUser.interests.map((interest) => (
                        <span
                          key={interest}
                          className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                }
              >
                <div data-profile>
                  <h2 className="text-4xl font-bold text-white mb-1 drop-shadow-lg">
                    {currentUser.name}, {currentUser.age}
                  </h2>
                  <p className="text-amber-200 font-semibold mb-2 drop-shadow-md">
                    {currentUser.username}
                  </p>
                  <div className="flex items-center gap-4 text-white/90 text-lg drop-shadow-md mb-2">
                    <div className="flex items-center gap-1">
                      <span>📍</span>
                      <span>{currentUser.area}, {currentUser.country}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                      <span>📏</span>
                      <span className="font-semibold">
                        {currentUser.distance < 1
                          ? `${Math.round(currentUser.distance * 1000)}m away`
                          : `${currentUser.distance.toFixed(1)} km away`}
                      </span>
                    </div>
                  </div>
                </div>
              </HoverPreview>
            </div>

            {/* Like Indicator */}
            {liked.includes(currentUser.id) && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-rose-400 to-pink-400 px-4 py-2 rounded-full text-white font-bold animate-pulse shadow-lg">
                ❤️ Liked
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="p-8">
            {/* Distance and Location Info */}
            <div className="mb-6 pb-6 border-b border-amber-200/50 dark:border-gray-700/50">
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-full border-2 border-emerald-300/50 dark:border-emerald-700/50">
                  <span className="text-lg">📏</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">
                    {currentUser.distance < 1
                      ? `${Math.round(currentUser.distance * 1000)}m away`
                      : `${currentUser.distance.toFixed(1)} km away`}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-100 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/30 rounded-full border-2 border-sky-300/50 dark:border-sky-700/50">
                  <span className="text-lg">🌍</span>
                  <span className="font-semibold text-sky-700 dark:text-sky-300">{currentUser.country}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full border-2 border-amber-300/50 dark:border-amber-700/50">
                  <span className="text-lg">📍</span>
                  <span className="font-semibold text-amber-700 dark:text-amber-300">{currentUser.area}</span>
                </div>
              </div>
            </div>

            <div className="mb-6 pb-6 border-b border-amber-200/50 dark:border-gray-700/50">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                <span>📝</span> About
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{currentUser.bio}</p>
            </div>

            <div className="mb-6 pb-6 border-b border-amber-200/50 dark:border-gray-700/50">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                <span>🎯</span> Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentUser.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1.5 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border-2 border-amber-300/50 dark:border-amber-700/50 text-amber-700 dark:text-amber-300 rounded-full text-sm font-medium hover:scale-110 transition-transform duration-300"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                <span>✨</span> Looking For
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentUser.lookingFor.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 border-2 border-emerald-300/50 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium hover:scale-110 transition-transform duration-300"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <AnimatedButton
            onClick={handlePass}
            variant="danger"
            size="lg"
            className="flex-1"
          >
            ✕ Pass
          </AnimatedButton>
          <AnimatedButton
            onClick={handleLike}
            variant="success"
            size="lg"
            className="flex-1"
          >
            ♥ Like
          </AnimatedButton>
        </div>

        {/* Counter and Navigation */}
        <div className="flex justify-between items-center text-gray-700 dark:text-gray-300">
          <Tooltip content="Go to your profile" position="top">
            <Link
              href="/profile"
              className="px-4 py-2 rounded-full bg-white/60 dark:bg-gray-700/60 hover:bg-white/80 dark:hover:bg-gray-700/80 border-2 border-amber-200/50 dark:border-gray-600/50 transition-all duration-300 font-semibold"
            >
              ← Profile
            </Link>
          </Tooltip>
          <span className="text-sm font-semibold bg-white/60 dark:bg-gray-700/60 px-4 py-2 rounded-full border-2 border-amber-200/50 dark:border-gray-600/50">
            {currentIndex + 1} / {filteredAndSortedUsers.length}
          </span>
          <Tooltip content="View messages" position="top">
            <Link
              href="/messages"
              className="px-4 py-2 rounded-full bg-white/60 dark:bg-gray-700/60 hover:bg-white/80 dark:hover:bg-gray-700/80 border-2 border-amber-200/50 dark:border-gray-600/50 transition-all duration-300 font-semibold"
            >
              Messages →
            </Link>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
