import { useEffect, useState } from "react";
import type { MedicineReminder } from "../backend";

export function useReminderNotifications(
  reminders: MedicineReminder[] | undefined,
) {
  const [notifPermission, setNotifPermission] =
    useState<NotificationPermission>("default");

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window === "undefined" || !window.Notification) return;

    if (Notification.permission === "default") {
      Notification.requestPermission().then((perm) => {
        setNotifPermission(perm);
      });
    } else {
      setNotifPermission(Notification.permission);
    }
  }, []);

  // Polling interval to check reminders
  useEffect(() => {
    const checkReminders = () => {
      if (!reminders || reminders.length === 0) return;

      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const currentHHMM = `${hh}:${mm}`;
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

      for (const reminder of reminders) {
        if (!reminder.isActive) continue;
        // MedicineReminder has an array of times; check each one
        for (const scheduledTime of reminder.times.length
          ? reminder.times
          : ["08:00"]) {
          if (scheduledTime !== currentHHMM) continue;

          const fireKey = `fired_${reminder.id}_${scheduledTime}_${today}`;

          let alreadyFired = false;
          try {
            alreadyFired = sessionStorage.getItem(fireKey) === "1";
          } catch {
            // sessionStorage unavailable
          }

          if (alreadyFired) continue;

          // Mark as fired
          try {
            sessionStorage.setItem(fireKey, "1");
          } catch {
            // ignore
          }

          // Browser notification popup
          if (
            typeof window !== "undefined" &&
            window.Notification &&
            Notification.permission === "granted"
          ) {
            try {
              new Notification(`Time for ${reminder.name}`, {
                body: `Take ${reminder.dosage} now`,
                icon: "/favicon.ico",
              });
            } catch (e) {
              console.warn("[MediRemind] Notification failed:", e);
            }
          } else {
            // Fallback to alert if notifications are blocked
            window.alert(
              `⏰ Time for ${reminder.name}\nTake ${reminder.dosage} now`,
            );
          }

          // Voice reminder via Web Speech API
          if (typeof window !== "undefined" && window.speechSynthesis) {
            try {
              const utterance = new SpeechSynthesisUtterance(
                `Time to take your ${reminder.name} ${reminder.dosage}`,
              );
              window.speechSynthesis.speak(utterance);
            } catch (e) {
              console.warn("[MediRemind] Speech synthesis failed:", e);
            }
          }
        }
      }
    };

    // Check immediately, then every 30 seconds
    checkReminders();
    const interval = setInterval(checkReminders, 30_000);

    return () => clearInterval(interval);
  }, [reminders]);

  return { notifPermission };
}
