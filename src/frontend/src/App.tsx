import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Bell,
  Eye,
  EyeOff,
  KeyRound,
  LayoutDashboard,
  Loader2,
  Pill,
  Search,
  UserCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import React, { Suspense } from "react";
import ReportChapter4 from "./ReportChapter4";
import { HealthParticleBackground } from "./components/HealthParticleBackground";
import { useAuth } from "./hooks/useAuth";
import { useAddDoctorGuidance } from "./hooks/useMedicalRecords";
import { useProfile, useUpdateProfile } from "./hooks/useProfile";
import { useReminderNotifications } from "./hooks/useReminderNotifications";
import { useReminders } from "./hooks/useReminders";
import Dashboard from "./pages/Dashboard";
import MedicineSearch from "./pages/MedicineSearch";
import Reminders from "./pages/Reminders";

const ProfileTab = React.lazy(() => import("./components/ProfileTab"));
const History = React.lazy(() => import("./pages/History"));

const TabFallback = () => (
  <div className="flex items-center justify-center h-32">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
  </div>
);

type Tab = "dashboard" | "reminders" | "search" | "history" | "profile";

function AuthScreen() {
  const {
    loginWithPassword,
    registerWithPassword,
    loginWithII,
    isLoggingInWithII,
  } = useAuth();

  const [tab, setTab] = useState<"signin" | "register">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [locality, setLocality] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [showSignInPwd, setShowSignInPwd] = useState(false);
  const [showRegPwd, setShowRegPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const handleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    // Set welcome flags BEFORE awaiting — so they are in sessionStorage
    // the instant the auth state change causes AppInner to mount.
    const displayName = username.trim() || "Friend";
    if (!sessionStorage.getItem("welcome_shown")) {
      sessionStorage.setItem("welcome_name_hint", displayName);
      sessionStorage.setItem("welcome_pending", "1");
    }
    const result = await loginWithPassword(username, password);
    setIsLoading(false);
    if (result.error) {
      // Login failed — clear the flags we speculatively set
      sessionStorage.removeItem("welcome_pending");
      sessionStorage.removeItem("welcome_name_hint");
      if (result.error === "Username not found") {
        setError(
          "No account found with that username. Create one in the 'Create Account' tab.",
        );
      } else {
        setError(result.error);
      }
    }
  };

  const handleRegister = async () => {
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }
    if (age.trim()) {
      const n = Number(age);
      if (Number.isNaN(n) || n < 0 || n > 120) {
        setError("Age must be between 0 and 120");
        return;
      }
    }
    setIsLoading(true);
    const result = await registerWithPassword(username, password);
    setIsLoading(false);
    if (result.error) {
      if (result.error === "Username already taken") {
        setError(
          "Username already taken. If this is your account, try signing in instead.",
        );
      } else {
        setError(result.error);
      }
    } else {
      if (fullName.trim())
        sessionStorage.setItem("reg_fullname", fullName.trim());
      if (email.trim()) sessionStorage.setItem("reg_email", email.trim());
      if (age.trim()) sessionStorage.setItem("reg_age", age.trim());
      if (gender.trim()) sessionStorage.setItem("reg_gender", gender.trim());
      if (locality.trim())
        sessionStorage.setItem("reg_locality", locality.trim());
      if (doctorName.trim())
        sessionStorage.setItem("reg_doctorName", doctorName.trim());
      if (treatmentPlan.trim())
        sessionStorage.setItem("reg_treatmentPlan", treatmentPlan.trim());
      // Flag welcome — set BEFORE auth state change so AppInner reads it on first mount
      if (!sessionStorage.getItem("welcome_shown")) {
        const displayName = fullName.trim() || username.trim() || "Friend";
        sessionStorage.setItem("welcome_name_hint", displayName);
        sessionStorage.setItem("welcome_pending", "1");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (tab === "signin") handleSignIn();
      else handleRegister();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Advanced 3D health particle background — purely decorative */}
      <HealthParticleBackground />

      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-4">
            <Pill className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-1">
            MediRemind
          </h1>
          <p className="text-sm text-muted-foreground">
            Smart medicine reminders
          </p>
        </div>

        {/* Auth card */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
          <Tabs
            value={tab}
            onValueChange={(v) => {
              setTab(v as "signin" | "register");
              setError(null);
              setPassword("");
              setConfirmPassword("");
              setFullName("");
              setEmail("");
              setAge("");
              setGender("");
              setLocality("");
              setDoctorName("");
              setTreatmentPlan("");
            }}
          >
            <TabsList className="w-full mb-5">
              <TabsTrigger
                data-ocid="auth.signin.tab"
                value="signin"
                className="flex-1"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                data-ocid="auth.register.tab"
                value="register"
                className="flex-1"
              >
                Create Account
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="signin-username">Username</Label>
                <Input
                  id="signin-username"
                  data-ocid="auth.signin.input"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={handleKeyDown}
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <div className="relative">
                  <Input
                    id="signin-password"
                    data-ocid="auth.password.input"
                    type={showSignInPwd ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    onKeyDown={handleKeyDown}
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPwd(!showSignInPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={
                      showSignInPwd ? "Hide password" : "Show password"
                    }
                  >
                    {showSignInPwd ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              {error && (
                <div
                  data-ocid="auth.signin.error_state"
                  className="text-xs text-destructive space-y-1"
                >
                  <p>{error}</p>
                  {error.includes("Create Account") && (
                    <button
                      type="button"
                      className="underline font-medium"
                      onClick={() => {
                        setTab("register");
                        setError(null);
                      }}
                    >
                      Go to Create Account →
                    </button>
                  )}
                </div>
              )}
              <Button
                data-ocid="auth.signin.submit_button"
                className="w-full"
                size="lg"
                onClick={handleSignIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </TabsContent>

            <TabsContent value="register" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="reg-fullname">Full Name</Label>
                <Input
                  id="reg-fullname"
                  data-ocid="auth.register.fullname.input"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={handleKeyDown}
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <Input
                  id="reg-email"
                  data-ocid="auth.register.email.input"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={handleKeyDown}
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-age">
                  Age{" "}
                  <span className="text-muted-foreground text-xs">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="reg-age"
                  data-ocid="auth.register.age.input"
                  type="number"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={handleKeyDown}
                  min={0}
                  max={120}
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Gender{" "}
                  <span className="text-muted-foreground text-xs">
                    (optional)
                  </span>
                </Label>
                <Select
                  value={gender}
                  onValueChange={(v) => {
                    setGender(v);
                    setError(null);
                  }}
                >
                  <SelectTrigger data-ocid="auth.register.gender.select">
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
              <div className="space-y-2">
                <Label htmlFor="reg-locality">
                  Locality / City{" "}
                  <span className="text-muted-foreground text-xs">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="reg-locality"
                  data-ocid="auth.register.locality.input"
                  placeholder="Enter your city or locality"
                  value={locality}
                  onChange={(e) => {
                    setLocality(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={handleKeyDown}
                />
              </div>
              {/* Doctor Guidance fields — pre-fill Doctor Guidance section */}
              <div className="space-y-2">
                <Label htmlFor="reg-doctorname">
                  Doctor Name{" "}
                  <span className="text-muted-foreground text-xs">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="reg-doctorname"
                  data-ocid="auth.register.doctorname.input"
                  placeholder="Your doctor name (optional)"
                  value={doctorName}
                  onChange={(e) => {
                    setDoctorName(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-treatment">
                  Treatment Plan{" "}
                  <span className="text-muted-foreground text-xs">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="reg-treatment"
                  data-ocid="auth.register.treatment.input"
                  placeholder="Prescribed treatment (optional)"
                  value={treatmentPlan}
                  onChange={(e) => {
                    setTreatmentPlan(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-username">Username</Label>
                <Input
                  id="reg-username"
                  data-ocid="auth.register.input"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={handleKeyDown}
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Password</Label>
                <div className="relative">
                  <Input
                    id="reg-password"
                    data-ocid="auth.register.password.input"
                    type={showRegPwd ? "text" : "password"}
                    placeholder="Create a password (min 6 chars)"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    onKeyDown={handleKeyDown}
                    autoComplete="new-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPwd(!showRegPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showRegPwd ? "Hide password" : "Show password"}
                  >
                    {showRegPwd ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-confirm">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="reg-confirm"
                    data-ocid="auth.confirm.input"
                    type={showConfirmPwd ? "text" : "password"}
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError(null);
                    }}
                    onKeyDown={handleKeyDown}
                    autoComplete="new-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={
                      showConfirmPwd ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPwd ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              {error && (
                <div
                  data-ocid="auth.register.error_state"
                  className="text-xs text-destructive space-y-1"
                >
                  <p>{error}</p>
                  {error.includes("signing in") && (
                    <button
                      type="button"
                      className="underline font-medium"
                      onClick={() => {
                        setTab("signin");
                        setError(null);
                      }}
                    >
                      Go to Sign In →
                    </button>
                  )}
                </div>
              )}
              <Button
                data-ocid="auth.register.submit_button"
                className="w-full"
                size="lg"
                onClick={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </TabsContent>
          </Tabs>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* II secondary button */}
          <Button
            data-ocid="auth.ii.button"
            variant="outline"
            className="w-full gap-2"
            onClick={loginWithII}
            disabled={isLoggingInWithII}
          >
            {isLoggingInWithII ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <KeyRound className="w-4 h-4" />
            )}
            {isLoggingInWithII
              ? "Opening Internet Identity..."
              : "Continue with Internet Identity"}
          </Button>
          <p className="text-[11px] text-center text-muted-foreground mt-2">
            Internet Identity works best on the deployed version.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function WelcomeScreen({
  name,
  onDismiss,
}: { name: string; onDismiss: () => void }) {
  // Defer particle canvas until after the welcome card has painted.
  // This prevents the canvas repaint cycle from blocking the initial render
  // on mobile/low-end devices, so the card appears in < 100ms.
  const [showParticles, setShowParticles] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      // One more frame to ensure the card is painted before starting canvas
      requestAnimationFrame(() => setShowParticles(true));
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <motion.div
      key="welcome-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97, y: -10 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden"
      data-ocid="welcome.screen"
    >
      {/* Deferred particle background — only starts after card is visible */}
      {showParticles && <HealthParticleBackground />}
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: -8 }}
        transition={{ duration: 0.5, delay: 0.1, type: "spring", bounce: 0.3 }}
        className="flex flex-col items-center gap-6 text-center px-8 max-w-sm relative z-10"
      >
        <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center shadow-lg">
          <Pill className="w-12 h-12 text-primary" />
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground leading-tight">
            Welcome to MediRemind,{" "}
            <span className="text-primary">{name || "Friend"}</span>!
          </h1>
          <p className="text-muted-foreground text-base">
            Your health journey starts here.
          </p>
        </div>
        <Button
          data-ocid="welcome.get_started.primary_button"
          size="lg"
          className="w-full mt-2"
          onClick={onDismiss}
        >
          Get Started
        </Button>
      </motion.div>
    </motion.div>
  );
}

function HeaderAvatar({
  photoUrl,
  username,
  onClick,
}: {
  photoUrl?: string;
  username: string | null;
  onClick: () => void;
}) {
  const initials = username ? username.slice(0, 2).toUpperCase() : "?";

  return (
    <button
      type="button"
      data-ocid="app.profile.open_modal_button"
      onClick={onClick}
      className="focus:outline-none focus:ring-2 focus:ring-ring rounded-full"
      aria-label="Open profile"
    >
      <Avatar className="w-8 h-8 border border-border hover:ring-2 hover:ring-primary/40 transition-all">
        <AvatarImage src={photoUrl} />
        <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
          {initials}
        </AvatarFallback>
      </Avatar>
    </button>
  );
}

function AppInner() {
  const {
    isAuthenticated,
    isInitializing,
    username,
    logout: _logout,
  } = useAuth();
  // Wrap logout to clear welcome flags so the screen shows again on next login
  const logout = () => {
    sessionStorage.removeItem("welcome_shown");
    sessionStorage.removeItem("welcome_pending");
    sessionStorage.removeItem("welcome_name_hint");
    _logout();
  };
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("darkMode") === "true";
    } catch {
      return false;
    }
  });
  // Initialise immediately from the pending flag so the welcome screen
  // appears as soon as the authenticated view mounts — no backend round-trip needed.
  const [showWelcome, setShowWelcome] = useState(() => {
    const pending = sessionStorage.getItem("welcome_pending");
    if (pending && !sessionStorage.getItem("welcome_shown")) {
      sessionStorage.setItem("welcome_shown", "1");
      sessionStorage.removeItem("welcome_pending");
      return true;
    }
    return false;
  });
  const [welcomeName, setWelcomeName] = useState(() => {
    // Captured synchronously so the name is available even before profile loads
    return sessionStorage.getItem("welcome_name_hint") ?? "";
  });

  // Fallback useEffect: catches the race where AppInner mounts a few ms
  // before handleSignIn sets welcome_pending (async await boundary).
  useEffect(() => {
    const pending = sessionStorage.getItem("welcome_pending");
    if (pending && !sessionStorage.getItem("welcome_shown")) {
      const hint = sessionStorage.getItem("welcome_name_hint") ?? "";
      sessionStorage.setItem("welcome_shown", "1");
      sessionStorage.removeItem("welcome_pending");
      setWelcomeName(hint);
      setShowWelcome(true);
    }
  }, []);

  const { data: reminders } = useReminders();
  const { notifPermission } = useReminderNotifications(reminders);
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const addDoctorGuidance = useAddDoctorGuidance();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    try {
      localStorage.setItem("darkMode", String(darkMode));
    } catch {
      /* ignore in iframe contexts */
    }
  }, [darkMode]);

  // Seed registration profile data into the ICP backend once the actor is ready.
  // biome-ignore lint/correctness/useExhaustiveDependencies: updateProfile.mutate and addDoctorGuidance.mutate refs are stable per React Query contract
  useEffect(() => {
    if (profile === undefined) return;
    if (profile?.name) return;
    if (updateProfile.isPending) return;

    const pendingName = sessionStorage.getItem("reg_fullname");
    const pendingAge = sessionStorage.getItem("reg_age");
    const pendingGender = sessionStorage.getItem("reg_gender");
    const pendingLocality = sessionStorage.getItem("reg_locality");
    const pendingDoctorName = sessionStorage.getItem("reg_doctorName");
    const pendingTreatment = sessionStorage.getItem("reg_treatmentPlan");
    const hasPending =
      pendingName || pendingAge || pendingGender || pendingLocality;
    if (!hasPending) return;

    // Clear the pending seed keys immediately to prevent duplicate calls
    sessionStorage.removeItem("reg_fullname");
    sessionStorage.removeItem("reg_email");
    sessionStorage.removeItem("reg_age");
    sessionStorage.removeItem("reg_gender");
    sessionStorage.removeItem("reg_locality");
    sessionStorage.removeItem("reg_doctorName");
    sessionStorage.removeItem("reg_treatmentPlan");

    // Update the displayed name once profile data arrives (welcome may already be showing)
    if (pendingName) {
      setWelcomeName(pendingName.trim());
    }

    updateProfile.mutate(
      {
        name: pendingName?.trim() ?? "",
        age: pendingAge ? BigInt(Math.floor(Number(pendingAge))) : 0n,
        gender: pendingGender ?? "",
        locality: pendingLocality?.trim() ?? "",
        photoUrl: "",
        lastUpdated: BigInt(Date.now()) * 1_000_000n,
      },
      {
        onSuccess: () => {
          // Seed Doctor Guidance if provided during registration
          if (pendingDoctorName || pendingTreatment) {
            const today = new Date().toISOString().split("T")[0];
            addDoctorGuidance.mutate({
              id: `reg-${Date.now()}`,
              doctorName: pendingDoctorName ?? "",
              treatment: pendingTreatment ?? "",
              notes: "Added during registration",
              date: today,
            });
          }
        },
        onError: () => {
          // Restore the pending seed so it retries on the next render cycle
          if (pendingName) sessionStorage.setItem("reg_fullname", pendingName);
          if (pendingAge) sessionStorage.setItem("reg_age", pendingAge);
          if (pendingGender)
            sessionStorage.setItem("reg_gender", pendingGender);
          if (pendingLocality)
            sessionStorage.setItem("reg_locality", pendingLocality);
          if (pendingDoctorName)
            sessionStorage.setItem("reg_doctorName", pendingDoctorName);
          if (pendingTreatment)
            sessionStorage.setItem("reg_treatmentPlan", pendingTreatment);
        },
      },
    );
  }, [profile, updateProfile.isPending]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Pill className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  // Prefer the name hint captured at login time for the welcome screen so it
  // shows a real name before the backend profile fetch completes.
  const displayName =
    welcomeName || profile?.name?.trim() || username || "Friend";

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: "dashboard",
      label: "Home",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    { id: "reminders", label: "Reminders", icon: <Bell className="w-5 h-5" /> },
    { id: "search", label: "Search", icon: <Search className="w-5 h-5" /> },
    {
      id: "history",
      label: "History",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: "profile",
      label: "Profile",
      icon: <UserCircle className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Toaster />

      {/* Welcome overlay — shown immediately after login, user-dismissed */}
      <AnimatePresence>
        {showWelcome && (
          <WelcomeScreen
            name={displayName}
            onDismiss={() => {
              setShowWelcome(false);
              setWelcomeName("");
            }}
          />
        )}
      </AnimatePresence>

      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Pill className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg text-foreground">MediRemind</span>
          {notifPermission === "granted" && (
            <span
              data-ocid="app.notification.success_state"
              className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded-full"
              title="Reminder notifications are active"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-ocid="app.toggle"
            onClick={() => setDarkMode(!darkMode)}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
          <HeaderAvatar
            photoUrl={profile?.photoUrl}
            username={username}
            onClick={() => setActiveTab("profile")}
          />
        </div>
      </header>

      <main className="flex-1 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {activeTab === "dashboard" && <Dashboard />}
            {activeTab === "reminders" && <Reminders />}
            {activeTab === "search" && <MedicineSearch />}
            {activeTab === "history" && (
              <Suspense fallback={<TabFallback />}>
                <History />
              </Suspense>
            )}
            {activeTab === "profile" && (
              <Suspense fallback={<TabFallback />}>
                <ProfileTab onLogout={logout} />
              </Suspense>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur border-t border-border">
        <div className="max-w-lg mx-auto flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              data-ocid={`nav.${tab.id}.link`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors relative ${
                activeTab === tab.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              <span className="text-[10px] font-medium">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 w-8 h-0.5 bg-primary rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<
    | (Event & {
        prompt: () => Promise<void>;
        userChoice: Promise<{ outcome: string }>;
      })
    | null
  >(null);
  const [dismissed, setDismissed] = useState(false);

  // Detect if already running in standalone mode
  const isStandalone =
    typeof window !== "undefined" &&
    window.matchMedia("(display-mode: standalone)").matches;

  const handleInstallPrompt = useCallback((e: Event) => {
    e.preventDefault();
    setDeferredPrompt(
      e as Event & {
        prompt: () => Promise<void>;
        userChoice: Promise<{ outcome: string }>;
      },
    );
  }, []);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    return () =>
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
  }, [handleInstallPrompt]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  if (isStandalone || !deferredPrompt || dismissed) return null;

  return (
    <div
      data-ocid="pwa.install_banner"
      className="fixed bottom-16 left-0 right-0 z-50 px-3 pb-safe"
    >
      <div className="max-w-lg mx-auto flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 shadow-xl">
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
          <Pill className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white leading-tight">
            Install MediRemind
          </p>
          <p className="text-xs text-slate-400 truncate">
            Add to home screen for quick access
          </p>
        </div>
        <button
          type="button"
          data-ocid="pwa.install_button"
          onClick={handleInstall}
          className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-teal-500 to-indigo-500 hover:opacity-90 transition-opacity"
        >
          Install
        </button>
        <button
          type="button"
          data-ocid="pwa.dismiss_button"
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          aria-label="Dismiss install banner"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default function App() {
  if (window.location.pathname === "/report") {
    return <ReportChapter4 />;
  }
  return (
    <>
      <AppInner />
      <InstallBanner />
    </>
  );
}
