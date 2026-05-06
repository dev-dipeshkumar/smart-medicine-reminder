export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      {/* Subtle health-themed gradient backdrop */}
      <div
        className="absolute inset-0 -z-10 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.68 0.16 178 / 0.18), transparent 70%), radial-gradient(ellipse 60% 50% at 80% 100%, oklch(0.6 0.18 145 / 0.12), transparent 60%)",
        }}
      />
      <div className="relative z-10 w-full max-w-md px-4 py-8">{children}</div>
    </div>
  );
}
