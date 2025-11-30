"use client";

import { useState, useEffect } from "react";
import AnimatedButton from "./AnimatedButton";

interface PermissionStatus {
  camera: PermissionState | null;
  microphone: PermissionState | null;
  notifications: PermissionState | null;
  geolocation: PermissionState | null;
}

export default function PermissionManager() {
  const [permissions, setPermissions] = useState<PermissionStatus>({
    camera: null,
    microphone: null,
    notifications: null,
    geolocation: null,
  });
  const [showPrompt, setShowPrompt] = useState(false);
  const [requestedPermissions, setRequestedPermissions] = useState<string[]>([]);

  useEffect(() => {
    checkPermissions();
    // Show permission prompt after a short delay
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const checkPermissions = async () => {
    const status: PermissionStatus = {
      camera: null,
      microphone: null,
      notifications: null,
      geolocation: null,
    };

    // Check camera permission
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const cameraPermission = await navigator.permissions.query({ name: "camera" as PermissionName });
        status.camera = cameraPermission.state;
      }
    } catch (e) {
      // Camera permission check not supported
    }

    // Check microphone permission
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const micPermission = await navigator.permissions.query({ name: "microphone" as PermissionName });
        status.microphone = micPermission.state;
      }
    } catch (e) {
      // Microphone permission check not supported
    }

    // Check notifications permission
    if ("Notification" in window) {
      status.notifications = Notification.permission as PermissionState;
    }

    // Check geolocation permission
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const geoPermission = await navigator.permissions.query({ name: "geolocation" as PermissionName });
        status.geolocation = geoPermission.state;
      }
    } catch (e) {
      // Geolocation permission check not supported
    }

    setPermissions(status);
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop()); // Stop the stream immediately
      setRequestedPermissions((prev) => [...prev, "camera"]);
      await checkPermissions();
    } catch (error) {
      console.error("Camera permission denied:", error);
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop()); // Stop the stream immediately
      setRequestedPermissions((prev) => [...prev, "microphone"]);
      await checkPermissions();
    } catch (error) {
      console.error("Microphone permission denied:", error);
    }
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setRequestedPermissions((prev) => [...prev, "notifications"]);
      await checkPermissions();
    }
  };

  const requestGeolocationPermission = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setRequestedPermissions((prev) => [...prev, "geolocation"]);
          checkPermissions();
        },
        () => {
          console.error("Geolocation permission denied");
        }
      );
    }
  };

  const requestAllPermissions = async () => {
    await Promise.all([
      requestCameraPermission(),
      requestMicrophonePermission(),
      requestNotificationPermission(),
      requestGeolocationPermission(),
    ]);
    setShowPrompt(false);
  };

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case "camera":
        return "📷";
      case "microphone":
        return "🎤";
      case "notifications":
        return "🔔";
      case "geolocation":
        return "📍";
      default:
        return "⚙️";
    }
  };

  const getPermissionStatus = (permission: keyof PermissionStatus): string => {
    const status = permissions[permission];
    if (status === "granted") return "✅ Granted";
    if (status === "denied") return "❌ Denied";
    if (status === "prompt") return "⏳ Pending";
    return "❓ Unknown";
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-2 border-amber-200/50 dark:border-gray-700/50 rounded-3xl p-8 max-w-2xl w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <span>🔐</span> Permissions Required
          </h2>
          <button
            onClick={() => setShowPrompt(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-6">
          To provide the best experience, we need access to the following:
        </p>

        <div className="space-y-4 mb-6">
          {/* Camera Permission */}
          <div className="flex items-center justify-between p-4 bg-white/60 dark:bg-gray-700/60 rounded-xl border-2 border-amber-200/50 dark:border-gray-600/50">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getPermissionIcon("camera")}</span>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Camera</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">For video calls and profile photos</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {getPermissionStatus("camera")}
              </span>
              {permissions.camera !== "granted" && (
                <AnimatedButton
                  onClick={requestCameraPermission}
                  variant="primary"
                  size="sm"
                >
                  Allow
                </AnimatedButton>
              )}
            </div>
          </div>

          {/* Microphone Permission */}
          <div className="flex items-center justify-between p-4 bg-white/60 dark:bg-gray-700/60 rounded-xl border-2 border-amber-200/50 dark:border-gray-600/50">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getPermissionIcon("microphone")}</span>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Microphone</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">For voice and video calls</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {getPermissionStatus("microphone")}
              </span>
              {permissions.microphone !== "granted" && (
                <AnimatedButton
                  onClick={requestMicrophonePermission}
                  variant="primary"
                  size="sm"
                >
                  Allow
                </AnimatedButton>
              )}
            </div>
          </div>

          {/* Notifications Permission */}
          <div className="flex items-center justify-between p-4 bg-white/60 dark:bg-gray-700/60 rounded-xl border-2 border-amber-200/50 dark:border-gray-600/50">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getPermissionIcon("notifications")}</span>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Notifications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">For messages and connection updates</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {getPermissionStatus("notifications")}
              </span>
              {permissions.notifications !== "granted" && (
                <AnimatedButton
                  onClick={requestNotificationPermission}
                  variant="primary"
                  size="sm"
                >
                  Allow
                </AnimatedButton>
              )}
            </div>
          </div>

          {/* Geolocation Permission */}
          <div className="flex items-center justify-between p-4 bg-white/60 dark:bg-gray-700/60 rounded-xl border-2 border-amber-200/50 dark:border-gray-600/50">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getPermissionIcon("geolocation")}</span>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Location</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">To find nearby people</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {getPermissionStatus("geolocation")}
              </span>
              {permissions.geolocation !== "granted" && (
                <AnimatedButton
                  onClick={requestGeolocationPermission}
                  variant="primary"
                  size="sm"
                >
                  Allow
                </AnimatedButton>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <AnimatedButton
            onClick={requestAllPermissions}
            variant="primary"
            className="flex-1"
          >
            Allow All Permissions
          </AnimatedButton>
          <AnimatedButton
            onClick={() => setShowPrompt(false)}
            variant="ghost"
            className="flex-1"
          >
            Maybe Later
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
}

