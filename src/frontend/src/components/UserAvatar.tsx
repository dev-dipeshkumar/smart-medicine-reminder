import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  name: string;
  photoUrl?: string | null;
  size?: "sm" | "md";
  onClick?: () => void;
}

export function UserAvatar({
  name,
  photoUrl,
  size = "sm",
  onClick,
}: UserAvatarProps) {
  const dims = size === "md" ? "w-12 h-12" : "w-8 h-8";
  const initials =
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <button
      type="button"
      data-ocid="app.user_avatar"
      aria-label="Go to your profile"
      onClick={onClick}
      className={`${dims} rounded-full focus:outline-none focus:ring-2 focus:ring-ring`}
    >
      <Avatar
        className={`${dims} border border-border hover:ring-2 hover:ring-primary/40 transition-all`}
      >
        <AvatarImage src={photoUrl ?? undefined} alt={name} />
        <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
          {initials}
        </AvatarFallback>
      </Avatar>
    </button>
  );
}
