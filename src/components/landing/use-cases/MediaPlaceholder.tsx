import { ImageIcon, Play } from "lucide-react";
import { cn } from "@/lib/utils";

type MediaPlaceholderProps = {
  label: string;
  className?: string;
};

// Placeholder para video o imagen. Reemplazar por <video> o <Image /> cuando
// existan los assets en /public/videos/casos-de-uso o /public/images/casos-de-uso.
export function MediaPlaceholder({ label, className }: MediaPlaceholderProps) {
  const isVideo = label.toLowerCase().startsWith("video");
  const Icon = isVideo ? Play : ImageIcon;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-muted",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-gray-300)_1px,transparent_1px)] dark:bg-[radial-gradient(var(--color-neutral-800)_1px,transparent_1px)] bg-size-[20px_20px]" />
      <div className="absolute -bottom-24 -right-24 size-72 rounded-full bg-primary/20 blur-3xl" />

      <div className="relative h-full flex flex-col items-center justify-center gap-y-4 p-6 text-center">
        <div
          className={cn(
            "flex items-center justify-center rounded-full",
            isVideo
              ? "size-16 bg-primary text-primary-foreground shadow-[0_6px_26px_0_var(--landing-glow)]"
              : "size-14 glass-card text-foreground",
          )}
        >
          <Icon className={cn("size-6", isVideo && "fill-current ml-0.5")} />
        </div>
        <p className="text-sm text-muted-foreground max-w-60">{label}</p>
      </div>
    </div>
  );
}
