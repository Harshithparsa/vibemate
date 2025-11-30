import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import AnimatedButton from "@/components/AnimatedButton";
import HoverPreview from "@/components/HoverPreview";
import Tooltip from "@/components/Tooltip";
import NotificationBadge from "@/components/NotificationBadge";
import VibeMateLogo from "@/components/VibeMateLogo";

interface Connection {
  id: string;
  username: string;
  name: string;
  avatar: string;
  location: string;
  country: string;
  area: string;
  latitude: number;
  longitude: number;
  distance: number;
  mutualConnections: number;
  status: "online" | "away" | "offline";
  interests: string[];
  bio: string;
  age: number;
  gender: string;
}

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

const mockConnections: Connection[] = [
  {
    id: "1",
    username: "@sarahj",
    name: "Sarah Johnson",
    avatar: "https://via.placeholder.com/150/ec4899/ffffff?text=SJ",
    location: "Los Angeles, USA",
    country: "United States",
    area: "Los Angeles",
    latitude: 34.0522,
    longitude: -118.2437,
    distance: 0,
    mutualConnections: 5,
    status: "online",
    interests: ["Travel", "Yoga", "Photography"],
    bio: "Adventure seeker exploring the world",
    age: 26,
    gender: "Female",
  },
  {
    id: "2",
    username: "@mikechen",
    name: "Mike Chen",
    avatar: "https://via.placeholder.com/150/3b82f6/ffffff?text=MC",
    location: "Tokyo, Japan",
    country: "Japan",
    area: "Tokyo",
    latitude: 35.6762,
    longitude: 139.6503,
    distance: 0,
    mutualConnections: 3,
    status: "away",
    interests: ["Tech", "Hiking", "Coffee"],
    bio: "Tech enthusiast and nature lover",
    age: 30,
    gender: "Male",
  },
  {
    id: "3",
    username: "@emmaw",
    name: "Emma Williams",
    avatar: "https://via.placeholder.com/150/f97316/ffffff?text=EW",
    location: "London, UK",
    country: "United Kingdom",
    area: "London",
    latitude: 51.5074,
    longitude: -0.1278,
    distance: 0,
    mutualConnections: 8,
    status: "online",
    interests: ["Art", "Travel", "Food"],
    bio: "Artist exploring new cultures",
    age: 24,
    gender: "Female",
  },
  {
    id: "4",
    username: "@alexr",
    name: "Alex Rodriguez",
    avatar: "https://via.placeholder.com/150/8b5cf6/ffffff?text=AR",
    location: "Barcelona, Spain",
    country: "Spain",
    area: "Barcelona",
    latitude: 41.3851,
    longitude: 2.1734,
    distance: 0,
    mutualConnections: 2,
    status: "offline",
    interests: ["Music", "Dancing", "Food"],
    bio: "Music lover and food enthusiast",
    age: 28,
    gender: "Other",
  },
];

export default function Network() {
  const [allConnections] = useState<Connection[]>(mockConnections);
  const [filters, setFilters] = useState({
    gender: "",
    ageMin: "",
    ageMax: "",
    country: "",
    username: "",
    sortBy: "distance" as "distance" | "mutual" | "name",
  });
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

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
        () => {
          setUserLocation({ lat: 40.7128, lon: -74.0060 }); // Default to New York
        }
      );
    } else {
      setUserLocation({ lat: 40.7128, lon: -74.0060 });
    }
  }, []);

  // Filter and sort connections
  const filteredAndSortedConnections = useMemo(() => {
    let filtered = [...allConnections];

    // Apply filters
    if (filters.gender) {
      filtered = filtered.filter((conn) => conn.gender === filters.gender);
    }

    if (filters.ageMin && filters.ageMin.trim() !== "") {
      const minAge = parseInt(filters.ageMin);
      if (!isNaN(minAge)) {
        filtered = filtered.filter((conn) => conn.age >= minAge);
      }
    }

    if (filters.ageMax && filters.ageMax.trim() !== "") {
      const maxAge = parseInt(filters.ageMax);
      if (!isNaN(maxAge)) {
        filtered = filtered.filter((conn) => conn.age <= maxAge);
      }
    }

    if (filters.country) {
      filtered = filtered.filter((conn) => conn.country === filters.country);
    }

    if (filters.username) {
      filtered = filtered.filter((conn) =>
        conn.username.toLowerCase().includes(filters.username.toLowerCase()) ||
        conn.name.toLowerCase().includes(filters.username.toLowerCase())
      );
    }

    // Calculate distances
    const connectionsWithDistance = filtered.map((conn) => {
      let distance = 0;
      if (userLocation) {
        distance = calculateDistance(
          userLocation.lat,
          userLocation.lon,
          conn.latitude,
          conn.longitude
        );
      }
      return { ...conn, distance };
    });

    // Sort
    connectionsWithDistance.sort((a, b) => {
      if (filters.sortBy === "distance") {
        return a.distance - b.distance;
      } else if (filters.sortBy === "mutual") {
        return b.mutualConnections - a.mutualConnections;
      } else {
        return a.name.localeCompare(b.name);
      }
    });

    return connectionsWithDistance;
  }, [allConnections, filters, userLocation]);

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
            Your Global Network
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Connect with people from around the world. Build meaningful relationships across borders.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-2 border-amber-200/50 dark:border-gray-700/50 rounded-2xl p-4 mb-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span>🔍</span> Filter & Search
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

            <Tooltip content="Sort by" position="top">
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as "distance" | "mutual" | "name" })}
                className="p-3 bg-white/80 dark:bg-gray-700/80 border-2 border-amber-200/50 dark:border-gray-600/50 rounded-xl text-gray-800 dark:text-gray-100 focus:outline-none focus:border-amber-400 dark:focus:border-amber-500 focus:ring-4 focus:ring-amber-400/20 transition-all duration-300 backdrop-blur-sm text-sm"
              >
                <option value="distance">Distance (Near to Far)</option>
                <option value="mutual">Mutual Connections</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </Tooltip>

            <Tooltip content="Clear all filters" position="top">
              <AnimatedButton
                onClick={() => setFilters({ gender: "", ageMin: "", ageMax: "", country: "", username: "", sortBy: "distance" })}
                variant="ghost"
                size="sm"
                className="w-full"
              >
                Clear Filters
              </AnimatedButton>
            </Tooltip>
          </div>
        </div>

        {/* Connections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedConnections.map((connection) => (
            <div
              key={connection.id}
              className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-2 border-amber-200/50 dark:border-gray-700/50 rounded-2xl p-6 hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              <HoverPreview
                type="profile"
                content={
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={connection.avatar}
                        alt={connection.name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-amber-400"
                      />
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100">
                          {connection.name}
                        </h3>
                        <p className="text-sm text-amber-600 dark:text-amber-400 font-semibold">
                          {connection.username}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {connection.location}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      {connection.bio}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {connection.interests.map((interest) => (
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
                <div className="text-center" data-profile>
                  <div className="relative inline-block mb-4">
                    <img
                      src={connection.avatar}
                      alt={connection.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-amber-300 dark:border-amber-600 mx-auto"
                    />
                    <div
                      className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-4 border-white dark:border-gray-800 ${
                        connection.status === "online"
                          ? "bg-emerald-400"
                          : connection.status === "away"
                          ? "bg-amber-400"
                          : "bg-gray-400"
                      }`}
                    ></div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                    {connection.name}
                  </h3>
                  <p className="text-amber-600 dark:text-amber-400 font-semibold mb-2">
                    {connection.username}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-2 text-sm">
                    {connection.area}, {connection.country}
                  </p>
                  {connection.distance > 0 && (
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <span className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                        📏 {connection.distance < 1
                          ? `${Math.round(connection.distance * 1000)}m away`
                          : `${connection.distance.toFixed(1)} km away`}
                      </span>
                    </div>
                  )}
                  {connection.mutualConnections > 0 && (
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {connection.mutualConnections} mutual connections
                      </span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {connection.interests.slice(0, 3).map((interest) => (
                      <span
                        key={interest}
                        className="px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border-2 border-amber-300/50 dark:border-amber-700/50 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <AnimatedButton variant="primary" size="sm" className="flex-1">
                      Message
                    </AnimatedButton>
                    <AnimatedButton variant="ghost" size="sm" className="flex-1">
                      View
                    </AnimatedButton>
                  </div>
                </div>
              </HoverPreview>
            </div>
          ))}
        </div>

        {filteredAndSortedConnections.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">No connections found</p>
            <AnimatedButton
              onClick={() => setFilters({ gender: "", ageMin: "", ageMax: "", country: "", username: "", sortBy: "distance" })}
              variant="primary"
            >
              Clear Filters
            </AnimatedButton>
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-2 border-amber-200/50 dark:border-gray-700/50 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent mb-2">
              {allConnections.length}
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-semibold">Total Connections</p>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-2 border-amber-200/50 dark:border-gray-700/50 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent mb-2">
              {allConnections.filter((c) => c.status === "online").length}
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-semibold">Online Now</p>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-2 border-amber-200/50 dark:border-gray-700/50 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent mb-2">
              {new Set(allConnections.map((c) => c.country)).size}
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-semibold">Countries</p>
          </div>
        </div>
      </div>
    </div>
  );
}
