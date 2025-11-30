import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AnimatedButton from "@/components/AnimatedButton";
import VibeMateLogo from "@/components/VibeMateLogo";
import Tooltip from "@/components/Tooltip";
import AnimatedIcon from "@/components/AnimatedIcon";
import HoverPreview from "@/components/HoverPreview";

interface TravelPlan {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  budgetAmount: number;
  travelers: number;
  description: string;
  activities: string[];
  lookingFor: string[];
  privacy: "public" | "friends" | "private";
}

const ACTIVITIES = [
  "Beach", "Hiking", "City Tour", "Food & Dining", "Nightlife",
  "Adventure Sports", "Cultural Sites", "Shopping", "Photography",
  "Wildlife", "Museums", "Music & Festivals", "Spa & Wellness", "Water Sports"
];

const LOOKING_FOR = [
  "Travel Partner", "Group Travel", "Local Guide", "Accommodation Share",
  "Transport Share", "Activity Buddy", "Photography Partner", "Foodie Friend"
];

export default function CreateTravelPlan() {
  const router = useRouter();
  const [plan, setPlan] = useState<TravelPlan>({
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    budgetAmount: 0,
    travelers: 1,
    description: "",
    activities: [],
    lookingFor: [],
    privacy: "public",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!plan.title.trim()) newErrors.title = "Title is required";
    if (!plan.destination.trim()) newErrors.destination = "Destination is required";
    if (!plan.startDate) newErrors.startDate = "Start date is required";
    if (!plan.endDate) newErrors.endDate = "End date is required";
    if (plan.startDate && plan.endDate && new Date(plan.startDate) > new Date(plan.endDate)) {
      newErrors.endDate = "End date must be after start date";
    }
    if (!plan.budget) newErrors.budget = "Budget range is required";
    if (plan.travelers < 1) newErrors.travelers = "At least 1 traveler required";
    if (!plan.description.trim()) newErrors.description = "Description is required";
    if (plan.activities.length === 0) newErrors.activities = "Select at least one activity";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      console.log("Travel plan created:", plan);
      
      // Redirect to travel buddies page
      router.push("/travel-buddies");
    } catch (err: any) {
      console.error("Error creating travel plan:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleActivity = (activity: string) => {
    setPlan((prev) => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter((a) => a !== activity)
        : [...prev.activities, activity],
    }));
    if (errors.activities) {
      setErrors((prev) => ({ ...prev, activities: "" }));
    }
  };

  const toggleLookingFor = (item: string) => {
    setPlan((prev) => ({
      ...prev,
      lookingFor: prev.lookingFor.includes(item)
        ? prev.lookingFor.filter((l) => l !== item)
        : [...prev.lookingFor, item],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-amber-200/50 dark:border-gray-700/50 z-50 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <VibeMateLogo size="md" showText={true} />
          </Link>
          <Tooltip content="Go back" position="bottom">
            <Link
              href="/travel-buddies"
              className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 hover:from-amber-200 hover:to-orange-200 dark:hover:from-amber-900/50 dark:hover:to-orange-900/50 transition-all duration-300 font-semibold text-amber-700 dark:text-amber-300"
            >
              Cancel
            </Link>
          </Tooltip>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto pt-24 pb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-3">
            Create Your Travel Plan
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Share your travel plans and find the perfect companions
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-2 border-amber-200/50 dark:border-gray-700/50 rounded-3xl p-8 shadow-2xl space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Trip Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Summer Adventure in Bali"
                value={plan.title}
                onChange={(e) => {
                  setPlan((prev) => ({ ...prev, title: e.target.value }));
                  if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
                }}
                className={`w-full p-4 bg-white/80 dark:bg-gray-700/80 border-2 rounded-xl text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-4 transition-all duration-300 ${
                  errors.title
                    ? "border-red-400 dark:border-red-600 focus:ring-red-400/20"
                    : "border-amber-200/50 dark:border-gray-600/50 focus:border-amber-400 dark:focus:border-amber-500 focus:ring-amber-400/20"
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Destination */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Destination <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Bali, Indonesia"
                value={plan.destination}
                onChange={(e) => {
                  setPlan((prev) => ({ ...prev, destination: e.target.value }));
                  if (errors.destination) setErrors((prev) => ({ ...prev, destination: "" }));
                }}
                className={`w-full p-4 bg-white/80 dark:bg-gray-700/80 border-2 rounded-xl text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-4 transition-all duration-300 ${
                  errors.destination
                    ? "border-red-400 dark:border-red-600 focus:ring-red-400/20"
                    : "border-amber-200/50 dark:border-gray-600/50 focus:border-amber-400 dark:focus:border-amber-500 focus:ring-amber-400/20"
                }`}
              />
              {errors.destination && (
                <p className="text-red-500 text-sm mt-1">{errors.destination}</p>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={plan.startDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    setPlan((prev) => ({ ...prev, startDate: e.target.value }));
                    if (errors.startDate) setErrors((prev) => ({ ...prev, startDate: "" }));
                  }}
                  className={`w-full p-4 bg-white/80 dark:bg-gray-700/80 border-2 rounded-xl text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-4 transition-all duration-300 ${
                    errors.startDate
                      ? "border-red-400 dark:border-red-600 focus:ring-red-400/20"
                      : "border-amber-200/50 dark:border-gray-600/50 focus:border-amber-400 dark:focus:border-amber-500 focus:ring-amber-400/20"
                  }`}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={plan.endDate}
                  min={plan.startDate || new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    setPlan((prev) => ({ ...prev, endDate: e.target.value }));
                    if (errors.endDate) setErrors((prev) => ({ ...prev, endDate: "" }));
                  }}
                  className={`w-full p-4 bg-white/80 dark:bg-gray-700/80 border-2 rounded-xl text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-4 transition-all duration-300 ${
                    errors.endDate
                      ? "border-red-400 dark:border-red-600 focus:ring-red-400/20"
                      : "border-amber-200/50 dark:border-gray-600/50 focus:border-amber-400 dark:focus:border-amber-500 focus:ring-amber-400/20"
                  }`}
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                )}
              </div>
            </div>

            {/* Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Budget Range <span className="text-red-500">*</span>
                </label>
                <select
                  value={plan.budget}
                  onChange={(e) => {
                    setPlan((prev) => ({ ...prev, budget: e.target.value }));
                    if (errors.budget) setErrors((prev) => ({ ...prev, budget: "" }));
                  }}
                  className={`w-full p-4 bg-white/80 dark:bg-gray-700/80 border-2 rounded-xl text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-4 transition-all duration-300 ${
                    errors.budget
                      ? "border-red-400 dark:border-red-600 focus:ring-red-400/20"
                      : "border-amber-200/50 dark:border-gray-600/50 focus:border-amber-400 dark:focus:border-amber-500 focus:ring-amber-400/20"
                  }`}
                >
                  <option value="">Select budget range</option>
                  <option value="budget">Budget ($0 - $500)</option>
                  <option value="moderate">Moderate ($500 - $1,500)</option>
                  <option value="comfortable">Comfortable ($1,500 - $3,000)</option>
                  <option value="luxury">Luxury ($3,000+)</option>
                </select>
                {errors.budget && (
                  <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Number of Travelers
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={plan.travelers}
                  onChange={(e) => {
                    setPlan((prev) => ({ ...prev, travelers: parseInt(e.target.value) || 1 }));
                  }}
                  className="w-full p-4 bg-white/80 dark:bg-gray-700/80 border-2 border-amber-200/50 dark:border-gray-600/50 rounded-xl text-gray-800 dark:text-gray-100 focus:outline-none focus:border-amber-400 dark:focus:border-amber-500 focus:ring-4 focus:ring-amber-400/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Tell us about your travel plans, what you're looking forward to, and what kind of travel companion you're seeking..."
                value={plan.description}
                onChange={(e) => {
                  setPlan((prev) => ({ ...prev, description: e.target.value }));
                  if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
                }}
                rows={5}
                className={`w-full p-4 bg-white/80 dark:bg-gray-700/80 border-2 rounded-xl text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-4 transition-all duration-300 resize-none ${
                  errors.description
                    ? "border-red-400 dark:border-red-600 focus:ring-red-400/20"
                    : "border-amber-200/50 dark:border-gray-600/50 focus:border-amber-400 dark:focus:border-amber-500 focus:ring-amber-400/20"
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Activities */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                Activities <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {ACTIVITIES.map((activity) => (
                  <button
                    key={activity}
                    type="button"
                    onClick={() => toggleActivity(activity)}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                      plan.activities.includes(activity)
                        ? "bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg scale-105"
                        : "bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 border-2 border-amber-200/50 dark:border-gray-600/50 hover:border-amber-400 dark:hover:border-amber-500"
                    }`}
                  >
                    {activity}
                  </button>
                ))}
              </div>
              {errors.activities && (
                <p className="text-red-500 text-sm mt-2">{errors.activities}</p>
              )}
            </div>

            {/* Looking For */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                Looking For
              </label>
              <div className="flex flex-wrap gap-2">
                {LOOKING_FOR.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleLookingFor(item)}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                      plan.lookingFor.includes(item)
                        ? "bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-lg scale-105"
                        : "bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 border-2 border-emerald-200/50 dark:border-gray-600/50 hover:border-emerald-400 dark:hover:border-emerald-500"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Privacy */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                Privacy
              </label>
              <div className="flex gap-3">
                {(["public", "friends", "private"] as const).map((privacy) => (
                  <button
                    key={privacy}
                    type="button"
                    onClick={() => setPlan((prev) => ({ ...prev, privacy }))}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 capitalize ${
                      plan.privacy === privacy
                        ? "bg-amber-400 dark:bg-amber-600 text-white shadow-lg"
                        : "bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 border-2 border-amber-200/50 dark:border-gray-600/50"
                    }`}
                  >
                    {privacy === "public" && "🌍 Public"}
                    {privacy === "friends" && "👥 Friends Only"}
                    {privacy === "private" && "🔒 Private"}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <AnimatedButton
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span> Creating Plan...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <AnimatedIcon icon="✈️" /> Create Travel Plan
                  </span>
                )}
              </AnimatedButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

