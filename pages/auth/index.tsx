import { useState } from "react";
import { useRouter } from "next/router";
import AnimatedButton from "@/components/AnimatedButton";
import VibeMateLogo from "@/components/VibeMateLogo";
import Tooltip from "@/components/Tooltip";
import AnimatedIcon from "@/components/AnimatedIcon";
import { supabase } from "@/lib/supabaseClient";

type AuthMethod = "email" | "gmail" | "phone";

export default function AuthPage() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<AuthMethod>("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  // Format phone number
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const sendOTP = async () => {
    setLoading(true);
    setError("");

    try {
      if (authMethod === "email") {
        if (!email.includes("@")) {
          setError("Please enter a valid email address");
          setLoading(false);
          return;
        }

        // Use Supabase Auth to send OTP via email
        const { error } = await supabase.auth.signInWithOtp({
          email: email,
          options: {
            shouldCreateUser: isSignUp, // Create user if signing up
          },
        });

        if (error) {
          setError(error.message || "Failed to send OTP. Please try again.");
          setLoading(false);
          return;
        }

        setOtpSent(true);
        setError(""); // Clear any previous errors
      } else if (authMethod === "phone") {
        const cleanedPhone = phone.replace(/\D/g, "");
        if (cleanedPhone.length < 10) {
          setError("Please enter a valid phone number");
          setLoading(false);
          return;
        }

        // Format phone number with country code (assuming +1 for US)
        const formattedPhone = `+1${cleanedPhone}`;

        // Use Supabase Auth to send OTP via SMS
        const { error } = await supabase.auth.signInWithOtp({
          phone: formattedPhone,
          options: {
            shouldCreateUser: isSignUp,
          },
        });

        if (error) {
          setError(error.message || "Failed to send OTP. Please check your phone number and try again.");
          setLoading(false);
          return;
        }

        setOtpSent(true);
        setError(""); // Clear any previous errors
      }
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    setLoading(true);
    setError("");

    try {
      if (otp.length !== 6) {
        setError("Please enter a 6-digit OTP");
        setLoading(false);
        return;
      }

      if (authMethod === "email") {
        // Verify email OTP with Supabase
        const { data, error } = await supabase.auth.verifyOtp({
          email: email,
          token: otp,
          type: isSignUp ? "signup" : "email",
        });

        if (error) {
          setError(error.message || "Invalid OTP. Please try again.");
          setLoading(false);
          return;
        }

        if (data.user) {
          // Successfully authenticated
          router.push(isSignUp ? "/onboarding" : "/");
        }
      } else if (authMethod === "phone") {
        const cleanedPhone = phone.replace(/\D/g, "");
        const formattedPhone = `+1${cleanedPhone}`;

        // Verify phone OTP with Supabase
        const { data, error } = await supabase.auth.verifyOtp({
          phone: formattedPhone,
          token: otp,
          type: isSignUp ? "sms" : "sms",
        });

        if (error) {
          setError(error.message || "Invalid OTP. Please try again.");
          setLoading(false);
          return;
        }

        if (data.user) {
          // Successfully authenticated
          router.push(isSignUp ? "/onboarding" : "/");
        }
      }
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");
      setLoading(false);
    }
  };

  const handleGmailLogin = async () => {
    setLoading(true);
    setError("");

    try {
      // Use Supabase Auth with Google OAuth
      const redirectUrl = typeof window !== "undefined" 
        ? `${window.location.origin}${isSignUp ? "/onboarding" : "/"}`
        : isSignUp ? "/onboarding" : "/";

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        // Check if it's a provider not enabled error
        if (error.message?.includes("provider is not enabled") || error.message?.includes("Unsupported provider")) {
          setError(
            "Google OAuth is not enabled in your Supabase project. " +
            "Please enable it in Supabase Dashboard → Authentication → Providers → Google. " +
            "You'll need to add your Google OAuth Client ID and Secret."
          );
        } else {
          setError(error.message || "Gmail login failed. Please try again.");
        }
        setLoading(false);
      }
      // Note: OAuth redirects to Google, so we don't need to handle success here
      // The redirect will happen automatically
    } catch (err: any) {
      if (err.message?.includes("provider is not enabled") || err.message?.includes("Unsupported provider")) {
        setError(
          "Google OAuth is not enabled in your Supabase project. " +
          "Please enable it in Supabase Dashboard → Authentication → Providers → Google. " +
          "You'll need to add your Google OAuth Client ID and Secret."
        );
    } else {
        setError(err.message || "Gmail login failed. Please try again.");
      }
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    setOtpSent(false);
    setOtp("");
    sendOTP();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4" data-no-bottom-nav>
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <VibeMateLogo size="lg" showText={true} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isSignUp
              ? "Join VibeMate and start connecting"
              : "Sign in to continue to VibeMate"}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-2 border-amber-200/50 dark:border-gray-700/50 rounded-3xl p-8 shadow-2xl">
          {/* Toggle Sign In/Sign Up */}
          <div className="flex gap-2 mb-6 bg-amber-100/50 dark:bg-gray-700/50 rounded-xl p-1">
            <button
              onClick={() => {
                setIsSignUp(false);
                setOtpSent(false);
                setOtp("");
                setError("");
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-300 ${
                !isSignUp
                  ? "bg-white dark:bg-gray-600 text-amber-700 dark:text-amber-300 shadow-md"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsSignUp(true);
                setOtpSent(false);
                setOtp("");
                setError("");
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-300 ${
                isSignUp
                  ? "bg-white dark:bg-gray-600 text-amber-700 dark:text-amber-300 shadow-md"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Gmail Login Button */}
          {!otpSent && (
            <div className="mb-6">
              <AnimatedButton
                onClick={handleGmailLogin}
                variant="primary"
                size="lg"
                className="w-full flex items-center justify-center gap-3"
                disabled={loading}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Gmail
              </AnimatedButton>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                ⚠️ Requires Google OAuth setup in Supabase Dashboard
              </p>
            </div>
          )}

          {/* Divider */}
          {!otpSent && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-amber-200/50 dark:bg-gray-600/50"></div>
              <span className="text-sm text-gray-500 dark:text-gray-400">or</span>
              <div className="flex-1 h-px bg-amber-200/50 dark:bg-gray-600/50"></div>
            </div>
          )}

          {/* Auth Method Selection */}
          {!otpSent && (
            <div className="mb-6">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => {
                    setAuthMethod("email");
                    setError("");
                  }}
                  className={`flex-1 py-2 px-4 rounded-xl font-semibold transition-all duration-300 ${
                    authMethod === "email"
                      ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-2 border-amber-300 dark:border-amber-700"
                      : "bg-white/50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 border-2 border-transparent"
                  }`}
                >
                  <AnimatedIcon icon="✉️" className="mr-2" />
                  Email
                </button>
                <button
                  onClick={() => {
                    setAuthMethod("phone");
                    setError("");
                  }}
                  className={`flex-1 py-2 px-4 rounded-xl font-semibold transition-all duration-300 ${
                    authMethod === "phone"
                      ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-2 border-amber-300 dark:border-amber-700"
                      : "bg-white/50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 border-2 border-transparent"
                  }`}
                >
                  <AnimatedIcon icon="📱" className="mr-2" />
                  Phone
                </button>
              </div>

              {/* Email/Phone Input */}
              <div className="mb-4">
                {authMethod === "email" ? (
                  <>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      className="w-full p-4 bg-white/80 dark:bg-gray-700/80 border-2 border-amber-200/50 dark:border-gray-600/50 rounded-xl text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-amber-400 dark:focus:border-amber-500 focus:ring-4 focus:ring-amber-400/20 transition-all duration-300"
                    />
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                      ✓ OTP will be sent to your email via Supabase
                    </p>
                  </>
                ) : (
                  <>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                        +1
                      </span>
                      <input
                        type="tel"
                        placeholder="(123) 456-7890"
                        value={phone}
                        onChange={handlePhoneChange}
                        maxLength={14}
                        className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-gray-700/80 border-2 border-amber-200/50 dark:border-gray-600/50 rounded-xl text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-amber-400 dark:focus:border-amber-500 focus:ring-4 focus:ring-amber-400/20 transition-all duration-300"
                      />
                    </div>
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                      ⚠️ Phone OTP requires Twilio setup in Supabase. Check your Supabase dashboard.
                    </p>
                  </>
                )}
              </div>

              {/* Send OTP Button */}
              <AnimatedButton
                onClick={sendOTP}
                variant="primary"
                size="lg"
                className="w-full"
                disabled={loading || (authMethod === "email" ? !email : !phone)}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span> Sending...
                  </span>
                ) : (
                  `Send OTP to ${authMethod === "email" ? "Email" : "Phone"}`
                )}
              </AnimatedButton>
            </div>
          )}

          {/* OTP Verification */}
          {otpSent && (
            <div>
              <div className="text-center mb-6">
                <AnimatedIcon icon="✅" className="text-4xl mb-2" />
                <p className="text-gray-700 dark:text-gray-300 font-semibold">
                  OTP sent to {authMethod === "email" ? email : phone}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Enter the 6-digit code
                </p>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setOtp(value);
                    setError("");
                  }}
                  maxLength={6}
                  className="w-full p-4 text-center text-2xl font-bold tracking-widest bg-white/80 dark:bg-gray-700/80 border-2 border-amber-200/50 dark:border-gray-600/50 rounded-xl text-gray-800 dark:text-gray-100 focus:outline-none focus:border-amber-400 dark:focus:border-amber-500 focus:ring-4 focus:ring-amber-400/20 transition-all duration-300"
                />
              </div>

              <div className="flex gap-3">
                <AnimatedButton
                  onClick={handleResendOTP}
                  variant="ghost"
                  size="md"
                  className="flex-1"
                  disabled={loading}
                >
                  Resend
                </AnimatedButton>
                <AnimatedButton
                  onClick={verifyOTP}
                  variant="primary"
                  size="md"
                  className="flex-1"
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? "Verifying..." : "Verify"}
                </AnimatedButton>
              </div>

              <button
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                  setError("");
                }}
                className="w-full mt-4 text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-semibold"
              >
                ← Change {authMethod === "email" ? "email" : "phone"}
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 rounded-xl text-red-700 dark:text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          {/* Terms */}
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-6">
            By continuing, you agree to VibeMate's{" "}
            <a href="#" className="text-amber-600 dark:text-amber-400 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-amber-600 dark:text-amber-400 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
