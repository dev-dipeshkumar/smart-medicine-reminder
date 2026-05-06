"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        username: username.trim(),
        password,
        redirect: false,
      });
      if (result?.ok) {
        router.push("/dashboard");
      } else {
        setError("Invalid username or password.");
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
      <div className="flex flex-col items-center mb-8">
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
        <h1 className="text-2xl font-bold text-foreground">MediRemind</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sign in to your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            data-ocid="login.input"
            type="text"
            autoComplete="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            data-ocid="login.password_input"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        {error && (
          <p
            data-ocid="login.error_state"
            className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2"
          >
            {error}
          </p>
        )}

        <Button
          type="submit"
          data-ocid="login.submit_button"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          data-ocid="login.register_link"
          className="text-primary font-medium hover:underline"
        >
          Create account
        </Link>
      </p>
    </div>
  );
}
