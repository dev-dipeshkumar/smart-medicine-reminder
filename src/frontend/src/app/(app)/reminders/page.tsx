"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCreateReminder,
  useDeleteReminder,
  useReminders,
  useUpdateReminder,
} from "@/hooks/useReminders";
import type { Reminder } from "@/lib/types";
import { Bell, Clock, Pill, Plus } from "lucide-react";
import { useState } from "react";
import { ReminderCard } from "./ReminderCard";
import { ReminderModal } from "./ReminderModal";

export default function RemindersPage() {
  const { data: reminders, isLoading } = useReminders();
  const createReminder = useCreateReminder();
  const updateReminder = useUpdateReminder();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Reminder | null>(null);

  function openAdd() {
    setEditTarget(null);
    setModalOpen(true);
  }

  function openEdit(r: Reminder) {
    setEditTarget(r);
    setModalOpen(true);
  }

  function handleSubmit(fields: Omit<Reminder, "id" | "createdAt">) {
    if (editTarget) {
      updateReminder.mutate(
        { id: editTarget.id, ...fields },
        { onSuccess: () => setModalOpen(false) },
      );
    } else {
      createReminder.mutate(fields, { onSuccess: () => setModalOpen(false) });
    }
  }

  return (
    <div data-ocid="reminders.page" className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">My Reminders</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your medicine schedule
          </p>
        </div>
        <Button
          data-ocid="reminders.add_button"
          onClick={openAdd}
          className="gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Reminder
        </Button>
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div
          data-ocid="reminders.loading_state"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-8 w-16 rounded-lg" />
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && (!reminders || reminders.length === 0) && (
        <div
          data-ocid="reminders.empty_state"
          className="flex flex-col items-center justify-center gap-5 py-20 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Pill className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">
              No reminders yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Add your first medicine reminder and never miss a dose again.
            </p>
          </div>
          <Button
            data-ocid="reminders.empty_add_button"
            onClick={openAdd}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Your First Reminder
          </Button>
        </div>
      )}

      {/* Reminders grid */}
      {!isLoading && reminders && reminders.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reminders.map((reminder, idx) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              index={idx + 1}
              onEdit={openEdit}
            />
          ))}
        </div>
      )}

      {/* Add / Edit modal */}
      <ReminderModal
        open={modalOpen}
        onOpenChange={(v) => {
          setModalOpen(v);
          if (!v) setEditTarget(null);
        }}
        editTarget={editTarget}
        onSubmit={handleSubmit}
        isPending={createReminder.isPending || updateReminder.isPending}
      />
    </div>
  );
}
