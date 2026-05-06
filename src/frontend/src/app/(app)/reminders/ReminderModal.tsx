"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Reminder } from "@/lib/types";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  medicineName: string;
  dosage: string;
  frequency: string;
  scheduledTime: string;
  notes: string;
  userId: string;
  isActive: boolean;
};

const FREQUENCIES = [
  "Once daily",
  "Twice daily",
  "Three times daily",
  "As needed",
];

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editTarget: Reminder | null;
  onSubmit: (fields: Omit<Reminder, "id" | "createdAt">) => void;
  isPending: boolean;
}

export function ReminderModal({
  open,
  onOpenChange,
  editTarget,
  onSubmit,
  isPending,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      medicineName: "",
      dosage: "",
      frequency: "Once daily",
      scheduledTime: "",
      notes: "",
      userId: "",
      isActive: true,
    },
  });

  const frequencyValue = watch("frequency");

  // Populate form when editing
  useEffect(() => {
    if (open && editTarget) {
      reset({
        medicineName: editTarget.medicineName,
        dosage: editTarget.dosage,
        frequency: editTarget.frequency,
        scheduledTime: editTarget.scheduledTime,
        notes: "",
        userId: editTarget.userId,
        isActive: editTarget.isActive,
      });
    } else if (open && !editTarget) {
      reset({
        medicineName: "",
        dosage: "",
        frequency: "Once daily",
        scheduledTime: "",
        notes: "",
        userId: "",
        isActive: true,
      });
    }
  }, [open, editTarget, reset]);

  function submitHandler(values: FormValues) {
    onSubmit({
      medicineName: values.medicineName.trim(),
      dosage: values.dosage.trim(),
      frequency: values.frequency,
      scheduledTime: values.scheduledTime,
      isActive: values.isActive,
      userId: values.userId,
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent data-ocid="reminders.dialog" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {editTarget ? "Edit Reminder" : "Add Reminder"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4 py-2">
          {/* Medicine Name */}
          <div className="space-y-1.5">
            <Label htmlFor="medicineName">Medicine Name *</Label>
            <Input
              id="medicineName"
              data-ocid="reminders.input"
              placeholder="e.g. Metformin"
              {...register("medicineName", {
                required: "Medicine name is required",
              })}
            />
            {errors.medicineName && (
              <p
                data-ocid="reminders.field_error"
                className="text-xs text-destructive"
              >
                {errors.medicineName.message}
              </p>
            )}
          </div>

          {/* Dosage */}
          <div className="space-y-1.5">
            <Label htmlFor="dosage">Dosage *</Label>
            <Input
              id="dosage"
              placeholder="e.g. 500mg"
              {...register("dosage", { required: "Dosage is required" })}
            />
            {errors.dosage && (
              <p className="text-xs text-destructive">
                {errors.dosage.message}
              </p>
            )}
          </div>

          {/* Frequency */}
          <div className="space-y-1.5">
            <Label htmlFor="frequency">Frequency *</Label>
            <Select
              value={frequencyValue}
              onValueChange={(v) => setValue("frequency", v)}
            >
              <SelectTrigger data-ocid="reminders.select">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {FREQUENCIES.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Scheduled Time */}
          <div className="space-y-1.5">
            <Label htmlFor="scheduledTime">Scheduled Time *</Label>
            <Input
              id="scheduledTime"
              type="time"
              {...register("scheduledTime", {
                required: "Scheduled time is required",
              })}
              className="block"
            />
            {errors.scheduledTime && (
              <p className="text-xs text-destructive">
                {errors.scheduledTime.message}
              </p>
            )}
          </div>

          {/* Notes (optional) */}
          <div className="space-y-1.5">
            <Label htmlFor="notes">
              Notes{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Textarea
              id="notes"
              data-ocid="reminders.textarea"
              placeholder="Any special instructions or notes…"
              rows={3}
              {...register("notes")}
              className="resize-none"
            />
          </div>

          <DialogFooter className="pt-2 gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                data-ocid="reminders.cancel_button"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              data-ocid="reminders.submit_button"
              disabled={isPending}
              className="min-w-[100px]"
            >
              {isPending
                ? editTarget
                  ? "Saving…"
                  : "Adding…"
                : editTarget
                  ? "Save Changes"
                  : "Add Reminder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
