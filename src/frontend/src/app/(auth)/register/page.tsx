"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    age: "",
    gender: "",
    locality: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.username.trim() || !form.password) {
      setError("Username and password are required.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username.trim(),
          password: form.password,
          fullName: form.fullName.trim() || undefined,
          email: form.email.trim() || undefined,
          age: form.age ? Number(form.age) : undefined,
          gender: form.gender || undefined,
          locality: form.locality.trim() || undefined,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Registration failed.");
        return;
      }
      // Auto sign-in after successful registration
      const result = await signIn("credentials", {
        username: form.username.trim(),
        password: form.password,
        redirect: false,
      });
      if (result?.ok) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-card border border-border rounded-2xl shadow-card p-8">
      {/* Logo */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-3">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-7 h-7 text-primary-foreground"
            stroke="currentColor"
            strokeWidth={2}
          >
            <title>Pill</title>
            <path d="M10.5 3.5a4.5 4.5 0 0 1 6.364 6.364L12 14.728l-4.864-4.864A4.5 4.5 0 0 1 10.5 3.5Z" />
            <path d="M12 14.728l4.864 4.864a4.5 4.5 0 0 1-6.364-6.364" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Join MediRemind today
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              data-ocid="register.full_name_input"
              placeholder="Your full name"
              value={form.fullName}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              data-ocid="register.email_input"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="age">
              Age <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="age"
              name="age"
              type="number"
              min={1}
              max={120}
              data-ocid="register.age_input"
              placeholder="e.g. 30"
              value={form.age}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="gender">
              Gender <span className="text-muted-foreground">(optional)</span>
            </Label>
            <select
              id="gender"
              name="gender"
              data-ocid="register.gender_select"
              value={form.gender}
              onChange={handleChange}
              disabled={loading}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
            >
              <option value="">Select…</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not">Prefer not to say</option>
            </select>
          </div>

          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="locality">
              Locality / Address{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="locality"
              name="locality"
              data-ocid="register.locality_input"
              placeholder="City, State"
              value={form.locality}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="username">
              Username <span className="text-destructive">*</span>
            </Label>
            <Input
              id="username"
              name="username"
              data-ocid="register.username_input"
              placeholder="Choose a username"
              autoComplete="username"
              value={form.username}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="password">
              Password <span className="text-destructive">*</span>
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              data-ocid="register.password_input"
              placeholder="Minimum 6 characters"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        {error && (
          <p
            data-ocid="register.error_state"
            className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2"
          >
            {error}
          </p>
        )}

        <Button
          type="submit"
          data-ocid="register.submit_button"
          className="w-full mt-2"
          disabled={loading}
        >
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-5">
        Already have an account?{" "}
        <Link
          href="/login"
          data-ocid="register.login_link"
          className="text-primary font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
