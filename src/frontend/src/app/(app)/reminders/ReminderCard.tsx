"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useDeleteReminder, useUpdateReminder } from "@/hooks/useReminders";
import type { Reminder } from "@/lib/types";
import { Clock, Pencil, Pill, Trash2 } from "lucide-react";
import { useState } from "react";

interface Props {
  reminder: Reminder;
  index: number;
  onEdit: (r: Reminder) => void;
}

export function ReminderCard({ reminder, index, onEdit }: Props) {
  const updateReminder = useUpdateReminder();
  const deleteReminder = useDeleteReminder();
  const [deleteOpen, setDeleteOpen] = useState(false);

  function toggleActive() {
    updateReminder.mutate({ id: reminder.id, isActive: !reminder.isActive });
  }

  function handleDelete() {
    deleteReminder.mutate(reminder.id, {
      onSuccess: () => setDeleteOpen(false),
    });
  }

  // Format time for display
  function formatTime(t: string) {
    try {
      const [h, m] = t.split(":").map(Number);
      const date = new Date();
      date.setHours(h, m);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return t;
    }
  }

  return (
    <div
      data-ocid={`reminders.item.${index}`}
      className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 space-y-4"
    >
      {/* Top row: name + active badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Pill className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-bold text-foreground truncate text-base leading-tight">
            {reminder.medicineName}
          </h3>
        </div>
        <button
          type="button"
          data-ocid={`reminders.toggle.${index}`}
          onClick={toggleActive}
          className="shrink-0"
          aria-label={`Toggle ${reminder.medicineName} active status`}
        >
          <Badge
            variant={reminder.isActive ? "default" : "secondary"}
            className={`cursor-pointer transition-colors ${
              reminder.isActive
                ? "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20"
                : "opacity-60"
            }`}
          >
            {reminder.isActive ? "Active" : "Inactive"}
          </Badge>
        </button>
      </div>

      {/* Details */}
      <div className="space-y-1.5 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="font-medium text-foreground">{reminder.dosage}</span>
          <span>·</span>
          <span>{reminder.frequency}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>{formatTime(reminder.scheduledTime)}</span>
        </div>
      </div>

      {/* Actions row */}
      <div className="flex items-center justify-between pt-1">
        <Switch
          data-ocid={`reminders.switch.${index}`}
          checked={reminder.isActive}
          onCheckedChange={toggleActive}
          disabled={updateReminder.isPending}
          aria-label={`${reminder.medicineName} active toggle`}
        />
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            data-ocid={`reminders.edit_button.${index}`}
            onClick={() => onEdit(reminder)}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </Button>

          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                data-ocid={`reminders.delete_button.${index}`}
                className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent data-ocid={`reminders.dialog.${index}`}>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete reminder?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the reminder for{" "}
                  <span className="font-semibold text-foreground">
                    {reminder.medicineName}
                  </span>
                  . This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  data-ocid={`reminders.cancel_button.${index}`}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  data-ocid={`reminders.confirm_button.${index}`}
                  onClick={handleDelete}
                  disabled={deleteReminder.isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleteReminder.isPending ? "Deleting…" : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
