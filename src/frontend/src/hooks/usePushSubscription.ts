import { useEffect, useState } from "react";

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length) as Uint8Array<ArrayBuffer>;
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushSubscription() {
  const isSupported =
    typeof window !== "undefined" &&
    "PushManager" in window &&
    "serviceWorker" in navigator;

  const [isEnabled, setIsEnabled] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("mediremind_push_enabled") === "true";
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep enabled state in sync if another tab changes it
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "mediremind_push_enabled") {
        setIsEnabled(e.newValue === "true");
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const enable = async () => {
    if (!isSupported) return;
    setIsLoading(true);
    setError(null);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setError(
          "Notification permission denied. Please enable notifications in your browser settings.",
        );
        setIsLoading(false);
        return;
      }
      const registration = await navigator.serviceWorker.ready;
      // Demo VAPID key — will be replaced when backend provides a real key
      const vapidPublicKey =
        "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U";
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });
      localStorage.setItem("mediremind_push_enabled", "true");
      localStorage.setItem(
        "mediremind_push_subscription",
        JSON.stringify(subscription.toJSON()),
      );
      setIsEnabled(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to enable push notifications",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const disable = async () => {
    if (!isSupported) return;
    setIsLoading(true);
    setError(null);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
      }
      localStorage.removeItem("mediremind_push_enabled");
      localStorage.removeItem("mediremind_push_subscription");
      setIsEnabled(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to disable push notifications",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { isSupported, isEnabled, isLoading, error, enable, disable };
}
