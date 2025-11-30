import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import AnimatedButton from "@/components/AnimatedButton";
import HoverPreview from "@/components/HoverPreview";
import Tooltip from "@/components/Tooltip";
import VibeMateLogo from "@/components/VibeMateLogo";

interface TravelBuddy {
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
  destination: string;
  travelDate: string;
  interests: string[];
  bio: string;
  lookingFor: string;
  verified: boolean;
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

const mockTravelBuddies: TravelBuddy[] = [
  {
    id: "1",
    username: "@sarahtravels",
    name: "Sarah",
    avatar: "https://via.placeholder.com/150/ec4899/ffffff?text=S",
    location: "Los Angeles, USA",
    country: "United States",
    area: "Los Angeles",
    latitude: 34.0522,
    longitude: -118.2437,
    distance: 0,
    destination: "Tokyo, Japan",
    travelDate: "March 2025",
    interests: ["Photography", "Food", "Culture"],
    bio: "Looking for a travel partner to explore Japan's rich culture and amazing food scene!",
    lookingFor: "Travel Partner",
    verified: true,
    age: 26,
    gender: "Female",
  },
  {
    id: "2",
    username: "@mikeadventures",
    name: "Mike",
    avatar: "https://via.placeholder.com/150/3b82f6/ffffff?text=M",
    location: "Chicago, USA",
    country: "United States",
    area: "Chicago",
    latitude: 41.8781,
    longitude: -87.6298,
    distance: 0,
    destination: "Bali, Indonesia",
    travelDate: "April 2025",
    interests: ["Adventure", "Beaches", "Hiking"],
    bio: "Adventure seeker looking for someone to explore Bali's beautiful landscapes!",
    lookingFor: "Travel Partner",
    verified: true,
    age: 30,
    gender: "Male",
  },
  {
    id: "3",
    username: "@emmaexplorer",
    name: "Emma",
    avatar: "https://via.placeholder.com/150/f97316/ffffff?text=E",
    location: "London, UK",
    country: "United Kingdom",
    area: "London",
    latitude: 51.5074,
    longitude: -0.1278,
    distance: 0,
    destination: "Paris, France",
    travelDate: "May 2025",
    interests: ["Art", "Museums", "Food"],
    bio: "Art lover planning a cultural trip to Paris. Would love a companion!",
    lookingFor: "Travel Partner",
    verified: false,
    age: 24,
    gender: "Female",
  },
];

export default function TravelBuddies() {
  const [allBuddies] = useState<TravelBuddy[]>(mockTravelBuddies);
  const [filters, setFilters] = useState({
    gender: "",
    ageMin: "",
    ageMax: "",
    country: "",
    username: "",
    verified: false,
    sortBy: "distance" as "distance" | "date" | "name",
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

  // Filter and sort buddies
  const filteredAndSortedBuddies = useMemo(() => {
    let filtered = [...allBuddies];

    // Apply filters
    if (filters.gender) {
      filtered = filtered.filter((buddy) => buddy.gender === filters.gender);
    }

    if (filters.ageMin && filters.ageMin.trim() !== "") {
      const minAge = parseInt(filters.ageMin);
      if (!isNaN(minAge)) {
        filtered = filtered.filter((buddy) => buddy.age >= minAge);
      }
    }

    if (filters.ageMax && filters.ageMax.trim() !== "") {
      const maxAge = parseInt(filters.ageMax);
      if (!isNaN(maxAge)) {
        filtered = filtered.filter((buddy) => buddy.age <= maxAge);
      }
    }

    if (filters.country) {
      filtered = filtered.filter((buddy) => buddy.country === filters.country);
    }

    if (filters.verified) {
      filtered = filtered.filter((buddy) => buddy.verified);
    }

    if (filters.username) {
      filtered = filtered.filter((buddy) =>
        buddy.username.toLowerCase().includes(filters.username.toLowerCase()) ||
        buddy.name.toLowerCase().includes(filters.username.toLowerCase())
      );
    }

    // Calculate distances
    const buddiesWithDistance = filtered.map((buddy) => {
      let distance = 0;
      if (userLocation) {
        distance = calculateDistance(
          userLocation.lat,
          userLocation.lon,
          buddy.latitude,
          buddy.longitude
        );
      }
      return { ...buddy, distance };
    });

    // Sort
    buddiesWithDistance.sort((a, b) => {
      if (filters.sortBy === "distance") {
        return a.distance - b.distance;
      } else if (filters.sortBy === "date") {
        return a.travelDate.localeCompare(b.travelDate);
      } else {
        return a.name.localeCompare(b.name);
      }
    });

    return buddiesWithDistance;
  }, [allBuddies, filters, userLocation]);

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
            Find Your Perfect Travel Companion
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Connect with fellow travelers, share adventures, and explore the world together.
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
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as "distance" | "date" | "name" })}
                className="p-3 bg-white/80 dark:bg-gray-700/80 border-2 border-amber-200/50 dark:border-gray-600/50 rounded-xl text-gray-800 dark:text-gray-100 focus:outline-none focus:border-amber-400 dark:focus:border-amber-500 focus:ring-4 focus:ring-amber-400/20 transition-all duration-300 backdrop-blur-sm text-sm"
              >
                <option value="distance">Distance (Near to Far)</option>
                <option value="date">Travel Date</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </Tooltip>

            <div className="flex gap-2">
              <Tooltip content="Show only verified travelers" position="top">
                <AnimatedButton
                  onClick={() => setFilters({ ...filters, verified: !filters.verified })}
                  variant={filters.verified ? "primary" : "ghost"}
                  size="sm"
                  className="flex-1"
                >
                  {filters.verified ? "✓ Verified" : "Verified"}
                </AnimatedButton>
              </Tooltip>
              <Tooltip content="Clear all filters" position="top">
                <AnimatedButton
                  onClick={() => setFilters({ gender: "", ageMin: "", ageMax: "", country: "", username: "", verified: false, sortBy: "distance" })}
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                >
                  Clear
                </AnimatedButton>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Travel Buddies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedBuddies.map((buddy) => (
            <div
              key={buddy.id}
              className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-2 border-amber-200/50 dark:border-gray-700/50 rounded-2xl p-6 hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              <HoverPreview
                type="profile"
                content={
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={buddy.avatar}
                        alt={buddy.name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-amber-400"
                      />
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100">
                          {buddy.name}
                        </h3>
                        <p className="text-sm text-amber-600 dark:text-amber-400 font-semibold">
                          {buddy.username}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {buddy.location}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      {buddy.bio}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {buddy.interests.map((interest) => (
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
                      src={buddy.avatar}
                      alt={buddy.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-amber-300 dark:border-amber-600 mx-auto"
                    />
                    {buddy.verified && (
                      <div className="absolute -top-2 -right-2 bg-emerald-400 rounded-full p-1">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                    {buddy.name}
                  </h3>
                  <p className="text-amber-600 dark:text-amber-400 font-semibold mb-2">
                    {buddy.username}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-2 text-sm">
                    {buddy.area}, {buddy.country}
                  </p>
                  {buddy.distance > 0 && (
                    <div className="flex items-center justify-center gap-1 mb-3">
                      <span className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                        📏 {buddy.distance < 1
                          ? `${Math.round(buddy.distance * 1000)}m away`
                          : `${buddy.distance.toFixed(1)} km away`}
                      </span>
                    </div>
                  )}

                  {/* Travel Info */}
                  <div className="bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-xl p-4 mb-4 border-2 border-sky-200/50 dark:border-sky-700/50">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-2xl">✈️</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">
                        {buddy.destination}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg">📅</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {buddy.travelDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {buddy.interests.map((interest) => (
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
                      Connect
                    </AnimatedButton>
                    <AnimatedButton variant="ghost" size="sm" className="flex-1">
                      Message
                    </AnimatedButton>
                  </div>
                </div>
              </HoverPreview>
            </div>
          ))}
        </div>

        {filteredAndSortedBuddies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">No travel buddies found</p>
            <AnimatedButton
              onClick={() => setFilters({ gender: "", ageMin: "", ageMax: "", country: "", username: "", verified: false, sortBy: "distance" })}
              variant="primary"
            >
              Clear Filters
            </AnimatedButton>
          </div>
        )}

        {/* Create Trip CTA */}
        <div className="mt-12 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl p-8 text-center border-2 border-amber-200/50 dark:border-amber-700/50">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Planning a Trip?
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Create a travel plan and find the perfect companion for your adventure!
          </p>
          <Link href="/create-travel-plan">
            <AnimatedButton variant="primary" size="lg">
              Create Travel Plan
            </AnimatedButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
