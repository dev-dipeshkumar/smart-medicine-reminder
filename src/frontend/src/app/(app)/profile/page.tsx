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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddCheckupReport,
  useAddDoctorGuidance,
  useCheckupReports,
  useDeleteCheckupReport,
  useDeleteDoctorGuidance,
  useDoctorGuidances,
  useUpdateCheckupReport,
  useUpdateDoctorGuidance,
} from "@/hooks/useMedicalData";
import {
  useProfile,
  useUpdateProfile,
  useUploadPhoto,
} from "@/hooks/useProfile";
import { useReminders } from "@/hooks/useReminders";
import type { CheckupReport, DoctorGuidance } from "@/lib/types";
import { getInitials } from "@/lib/utils";
import {
  Camera,
  Check,
  Clock,
  Edit2,
  LogOut,
  Pill,
  Plus,
  Stethoscope,
  Trash2,
  User,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useRef, useState } from "react";

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatDate(ts: number | string): string {
  const d = typeof ts === "number" ? new Date(ts) : new Date(ts);
  if (Number.isNaN(d.getTime())) return String(ts);
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Profile Card ─────────────────────────────────────────────────────────────

function ProfileCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center gap-4 mb-5">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
      <Skeleton className="h-9 w-28 rounded-lg" />
    </div>
  );
}

interface ProfileCardProps {
  user: {
    username: string;
    fullName?: string;
    email?: string;
    age?: number;
    gender?: string;
    locality?: string;
    photoUrl?: string;
    updatedAt: number;
  };
}

function ProfileCard({ user }: ProfileCardProps) {
  const updateProfile = useUpdateProfile();
  const uploadPhoto = useUploadPhoto();
  const fileRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: user.fullName ?? "",
    email: user.email ?? "",
    age: user.age ? String(user.age) : "",
    gender: user.gender ?? "",
    locality: user.locality ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (form.email && !/^[^@]+@[^@]+\.[^@]+$/.test(form.email))
      e.email = "Enter a valid email address";
    if (
      form.age &&
      (Number.isNaN(Number(form.age)) ||
        Number(form.age) < 1 ||
        Number(form.age) > 120)
    )
      e.age = "Enter a valid age (1–120)";
    return e;
  }

  function startEdit() {
    setForm({
      fullName: user.fullName ?? "",
      email: user.email ?? "",
      age: user.age ? String(user.age) : "",
      gender: user.gender ?? "",
      locality: user.locality ?? "",
    });
    setErrors({});
    setEditing(true);
  }

  async function handleSave() {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    await updateProfile.mutateAsync({
      fullName: form.fullName || undefined,
      email: form.email || undefined,
      age: form.age ? Number(form.age) : undefined,
      gender: form.gender || undefined,
      locality: form.locality || undefined,
    });
    setEditing(false);
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadPhoto.mutateAsync(file);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const displayName = user.fullName || user.username;

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      {/* Avatar + name row */}
      <div className="flex items-start gap-5 mb-6">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-primary flex items-center justify-center ring-4 ring-primary/20">
            {user.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.photoUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-primary-foreground text-2xl font-bold">
                {getInitials(displayName) || <User className="w-8 h-8" />}
              </span>
            )}
          </div>
          {/* Change photo button */}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            data-ocid="profile.photo_upload_button"
            aria-label="Change profile photo"
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {uploading ? (
              <span className="w-3 h-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <Camera className="w-3.5 h-3.5" />
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
            data-ocid="profile.photo_input"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold text-foreground truncate">
            {displayName}
          </h2>
          <p className="text-sm text-muted-foreground truncate">
            @{user.username}
          </p>
          {user.email && (
            <p className="text-sm text-muted-foreground truncate mt-0.5">
              {user.email}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Last updated: {formatDate(user.updatedAt)}
          </p>
        </div>
      </div>

      {/* Edit form */}
      {editing ? (
        <div className="space-y-4" data-ocid="profile.edit_form">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="pf-fullname">Full Name</Label>
              <Input
                id="pf-fullname"
                data-ocid="profile.fullname_input"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="Your full name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-email">Email</Label>
              <Input
                id="pf-email"
                type="email"
                data-ocid="profile.email_input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="profile.email.field_error"
                >
                  {errors.email}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-age">Age</Label>
              <Input
                id="pf-age"
                type="number"
                data-ocid="profile.age_input"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                placeholder="Your age"
                min={1}
                max={120}
              />
              {errors.age && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="profile.age.field_error"
                >
                  {errors.age}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-gender">Gender</Label>
              <Select
                value={form.gender}
                onValueChange={(v) => setForm({ ...form, gender: v })}
              >
                <SelectTrigger id="pf-gender" data-ocid="profile.gender_select">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                  <SelectItem value="Prefer not to say">
                    Prefer not to say
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="pf-locality">Locality / Address</Label>
              <Input
                id="pf-locality"
                data-ocid="profile.locality_input"
                value={form.locality}
                onChange={(e) => setForm({ ...form, locality: e.target.value })}
                placeholder="Your address or locality"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              onClick={handleSave}
              disabled={updateProfile.isPending}
              data-ocid="profile.save_button"
              size="sm"
            >
              {updateProfile.isPending ? (
                <span className="w-3.5 h-3.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-1.5" />
              ) : (
                <Check className="w-3.5 h-3.5 mr-1.5" />
              )}
              Save changes
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditing(false)}
              data-ocid="profile.cancel_button"
            >
              <X className="w-3.5 h-3.5 mr-1.5" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 mb-4">
            <InfoField
              label="Age"
              value={user.age ? `${user.age} years` : undefined}
            />
            <InfoField label="Gender" value={user.gender} />
            <InfoField
              label="Locality"
              value={user.locality}
              className="col-span-2"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={startEdit}
            data-ocid="profile.edit_button"
          >
            <Edit2 className="w-3.5 h-3.5 mr-1.5" />
            Edit Profile
          </Button>
        </div>
      )}
    </div>
  );
}

function InfoField({
  label,
  value,
  className = "",
}: {
  label: string;
  value?: string | number;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm font-medium text-foreground truncate">
        {value ?? <span className="text-muted-foreground italic">—</span>}
      </p>
    </div>
  );
}

// ─── Doctor Guidance Card ────────────────────────────────────────────────────

function DoctorGuidanceCard() {
  const { data: records = [], isLoading } = useDoctorGuidances();
  const addGuidance = useAddDoctorGuidance();
  const updateGuidance = useUpdateDoctorGuidance();
  const deleteGuidance = useDeleteDoctorGuidance();

  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [newForm, setNewForm] = useState({
    doctorName: "",
    prescribedTreatment: "",
  });
  const [editForm, setEditForm] = useState({
    doctorName: "",
    prescribedTreatment: "",
  });

  async function handleAdd() {
    if (!newForm.doctorName.trim()) return;
    await addGuidance.mutateAsync({
      doctorName: newForm.doctorName.trim(),
      prescribedTreatment: newForm.prescribedTreatment.trim(),
    });
    setNewForm({ doctorName: "", prescribedTreatment: "" });
    setAdding(false);
  }

  function startEdit(rec: DoctorGuidance) {
    setEditId(rec.id);
    setEditForm({
      doctorName: rec.doctorName,
      prescribedTreatment: rec.prescribedTreatment,
    });
  }

  async function handleUpdate() {
    if (!editId || !editForm.doctorName.trim()) return;
    await updateGuidance.mutateAsync({
      id: editId,
      doctorName: editForm.doctorName.trim(),
      prescribedTreatment: editForm.prescribedTreatment.trim(),
    });
    setEditId(null);
  }

  return (
    <div
      className="bg-card border border-border rounded-2xl p-6 space-y-4"
      data-ocid="doctor_guidance.card"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Stethoscope className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Doctor Guidance</h3>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            setAdding(true);
            setEditId(null);
          }}
          data-ocid="doctor_guidance.open_modal_button"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add
        </Button>
      </div>

      {/* Add form */}
      {adding && (
        <div
          className="bg-muted/40 rounded-xl p-4 space-y-3 border border-border"
          data-ocid="doctor_guidance.add_form"
        >
          <div className="space-y-1.5">
            <Label htmlFor="dg-name">Doctor Name *</Label>
            <Input
              id="dg-name"
              data-ocid="doctor_guidance.name_input"
              value={newForm.doctorName}
              onChange={(e) =>
                setNewForm({ ...newForm, doctorName: e.target.value })
              }
              placeholder="Dr. Sharma"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dg-treatment">Prescribed Treatment</Label>
            <Textarea
              id="dg-treatment"
              data-ocid="doctor_guidance.treatment_textarea"
              value={newForm.prescribedTreatment}
              onChange={(e) =>
                setNewForm({ ...newForm, prescribedTreatment: e.target.value })
              }
              placeholder="Metformin 500mg twice daily, avoid sugar..."
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handleAdd}
              disabled={addGuidance.isPending || !newForm.doctorName.trim()}
              data-ocid="doctor_guidance.submit_button"
            >
              {addGuidance.isPending && (
                <span className="w-3.5 h-3.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-1.5" />
              )}
              Save
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setAdding(false)}
              data-ocid="doctor_guidance.cancel_button"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Records list */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      ) : records.length === 0 && !adding ? (
        <div
          className="text-center py-8 text-muted-foreground"
          data-ocid="doctor_guidance.empty_state"
        >
          <Stethoscope className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No doctor guidance added yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((rec, idx) => (
            <div
              key={rec.id}
              className="border border-border rounded-xl p-4"
              data-ocid={`doctor_guidance.item.${idx + 1}`}
            >
              {editId === rec.id ? (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label>Doctor Name *</Label>
                    <Input
                      data-ocid={`doctor_guidance.edit_name_input.${idx + 1}`}
                      value={editForm.doctorName}
                      onChange={(e) =>
                        setEditForm({ ...editForm, doctorName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Prescribed Treatment</Label>
                    <Textarea
                      data-ocid={`doctor_guidance.edit_treatment_textarea.${idx + 1}`}
                      value={editForm.prescribedTreatment}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          prescribedTreatment: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleUpdate}
                      disabled={
                        updateGuidance.isPending || !editForm.doctorName.trim()
                      }
                      data-ocid={`doctor_guidance.save_button.${idx + 1}`}
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setEditId(null)}
                      data-ocid={`doctor_guidance.cancel_button.${idx + 1}`}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">
                      {rec.doctorName}
                    </p>
                    {rec.prescribedTreatment && (
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                        {rec.prescribedTreatment}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => startEdit(rec)}
                      data-ocid={`doctor_guidance.edit_button.${idx + 1}`}
                      aria-label="Edit"
                      className="h-8 w-8"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          data-ocid={`doctor_guidance.delete_button.${idx + 1}`}
                          aria-label="Delete"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent data-ocid="doctor_guidance.dialog">
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete this record?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove the doctor guidance
                            record for {rec.doctorName}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel data-ocid="doctor_guidance.cancel_button">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteGuidance.mutate(rec.id)}
                            data-ocid="doctor_guidance.confirm_button"
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Checkup Reports Card ────────────────────────────────────────────────────

function CheckupReportsCard() {
  const { data: reports = [], isLoading } = useCheckupReports();
  const addReport = useAddCheckupReport();
  const updateReport = useUpdateCheckupReport();
  const deleteReport = useDeleteCheckupReport();

  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [newForm, setNewForm] = useState({ checkupDate: "", notes: "" });
  const [editForm, setEditForm] = useState({ checkupDate: "", notes: "" });

  async function handleAdd() {
    if (!newForm.checkupDate.trim()) return;
    await addReport.mutateAsync({
      checkupDate: newForm.checkupDate.trim(),
      notes: newForm.notes.trim(),
    });
    setNewForm({ checkupDate: "", notes: "" });
    setAdding(false);
  }

  function startEdit(rep: CheckupReport) {
    setEditId(rep.id);
    setEditForm({ checkupDate: rep.checkupDate, notes: rep.notes });
  }

  async function handleUpdate() {
    if (!editId || !editForm.checkupDate.trim()) return;
    await updateReport.mutateAsync({
      id: editId,
      checkupDate: editForm.checkupDate.trim(),
      notes: editForm.notes.trim(),
    });
    setEditId(null);
  }

  return (
    <div
      className="bg-card border border-border rounded-2xl p-6 space-y-4"
      data-ocid="checkup_reports.card"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <User className="w-4 h-4 text-accent" />
          </div>
          <h3 className="font-semibold text-foreground">Checkup Reports</h3>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            setAdding(true);
            setEditId(null);
          }}
          data-ocid="checkup_reports.open_modal_button"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add
        </Button>
      </div>

      {/* Add form */}
      {adding && (
        <div
          className="bg-muted/40 rounded-xl p-4 space-y-3 border border-border"
          data-ocid="checkup_reports.add_form"
        >
          <div className="space-y-1.5">
            <Label htmlFor="cr-date">Checkup Date *</Label>
            <Input
              id="cr-date"
              type="date"
              data-ocid="checkup_reports.date_input"
              value={newForm.checkupDate}
              onChange={(e) =>
                setNewForm({ ...newForm, checkupDate: e.target.value })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cr-notes">Notes / Findings</Label>
            <Textarea
              id="cr-notes"
              data-ocid="checkup_reports.notes_textarea"
              value={newForm.notes}
              onChange={(e) =>
                setNewForm({ ...newForm, notes: e.target.value })
              }
              placeholder="Blood pressure normal, HbA1c 6.4%..."
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handleAdd}
              disabled={addReport.isPending || !newForm.checkupDate.trim()}
              data-ocid="checkup_reports.submit_button"
            >
              {addReport.isPending && (
                <span className="w-3.5 h-3.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-1.5" />
              )}
              Save
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setAdding(false)}
              data-ocid="checkup_reports.cancel_button"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Records */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      ) : reports.length === 0 && !adding ? (
        <div
          className="text-center py-8 text-muted-foreground"
          data-ocid="checkup_reports.empty_state"
        >
          <User className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No checkup reports added yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((rep, idx) => (
            <div
              key={rep.id}
              className="border border-border rounded-xl p-4"
              data-ocid={`checkup_reports.item.${idx + 1}`}
            >
              {editId === rep.id ? (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label>Checkup Date *</Label>
                    <Input
                      type="date"
                      data-ocid={`checkup_reports.edit_date_input.${idx + 1}`}
                      value={editForm.checkupDate}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          checkupDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Notes</Label>
                    <Textarea
                      data-ocid={`checkup_reports.edit_notes_textarea.${idx + 1}`}
                      value={editForm.notes}
                      onChange={(e) =>
                        setEditForm({ ...editForm, notes: e.target.value })
                      }
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleUpdate}
                      disabled={
                        updateReport.isPending || !editForm.checkupDate.trim()
                      }
                      data-ocid={`checkup_reports.save_button.${idx + 1}`}
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setEditId(null)}
                      data-ocid={`checkup_reports.cancel_button.${idx + 1}`}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">
                      {formatDate(rep.checkupDate)}
                    </p>
                    {rep.notes && (
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                        {rep.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => startEdit(rep)}
                      data-ocid={`checkup_reports.edit_button.${idx + 1}`}
                      aria-label="Edit"
                      className="h-8 w-8"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          data-ocid={`checkup_reports.delete_button.${idx + 1}`}
                          aria-label="Delete"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent data-ocid="checkup_reports.dialog">
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete this report?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove the checkup report from{" "}
                            {formatDate(rep.checkupDate)}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel data-ocid="checkup_reports.cancel_button">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteReport.mutate(rep.id)}
                            data-ocid="checkup_reports.confirm_button"
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Medication Reports Card (read-only) ─────────────────────────────────────

function MedicationReportsCard() {
  const { data: reminders = [], isLoading } = useReminders();
  const active = reminders.filter((r) => r.isActive);

  return (
    <div
      className="bg-card border border-border rounded-2xl p-6 space-y-4"
      data-ocid="medication_reports.card"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Pill className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Current Medications</h3>
          <p className="text-xs text-muted-foreground">
            From your active reminders
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      ) : active.length === 0 ? (
        <div
          className="text-center py-8 text-muted-foreground"
          data-ocid="medication_reports.empty_state"
        >
          <Pill className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No active medications</p>
          <p className="text-xs mt-1">
            Add reminders in the Reminders tab to see them here
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {active.map((r, idx) => (
            <div
              key={r.id}
              className="flex items-center gap-3 px-4 py-3 bg-muted/40 rounded-xl border border-border"
              data-ocid={`medication_reports.item.${idx + 1}`}
            >
              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {r.medicineName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {r.dosage} · {r.frequency} · {r.scheduledTime}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground flex items-center gap-1">
        <span>To modify medications, go to the</span>
        <span className="text-primary font-medium">Reminders tab</span>
      </p>
    </div>
  );
}

// ─── Logout Section ──────────────────────────────────────────────────────────

function LogoutSection() {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await signOut({ callbackUrl: "/login" });
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h3 className="font-semibold text-foreground mb-1">Session</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Sign out of your MediRemind account on this device.
      </p>
      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant="destructive"
            className="w-full sm:w-auto"
            data-ocid="profile.logout_button"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent data-ocid="profile.logout_dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Log out of MediRemind?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be redirected to the login page. Your data is safely
              saved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="profile.logout_cancel_button">
              Stay logged in
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              disabled={loading}
              data-ocid="profile.logout_confirm_button"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading && (
                <span className="w-3.5 h-3.5 border-2 border-destructive-foreground border-t-transparent rounded-full animate-spin mr-1.5" />
              )}
              Yes, log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { data: user, isLoading } = useProfile();

  return (
    <div data-ocid="profile.page" className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Manage your personal details, medical records, and account settings
        </p>
      </div>

      {/* Profile Card */}
      {isLoading ? (
        <ProfileCardSkeleton />
      ) : user ? (
        <ProfileCard user={user} />
      ) : (
        <div
          className="bg-card border border-border rounded-2xl p-6 text-center text-muted-foreground"
          data-ocid="profile.error_state"
        >
          <p>Unable to load profile. Please try refreshing.</p>
        </div>
      )}

      {/* Medical Records */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Medical Records
        </h2>
        <div className="space-y-4">
          <DoctorGuidanceCard />
          <CheckupReportsCard />
          <MedicationReportsCard />
        </div>
      </div>

      {/* Logout */}
      <LogoutSection />
    </div>
  );
}
