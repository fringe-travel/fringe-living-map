import { viberGradient, viberInitial } from "@/lib/vibers";

export function ViberAvatar({
  handle,
  size = 48,
  className = "",
}: {
  handle: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-extrabold text-white shadow-sm ring-2 ring-background ${className}`}
      style={{
        width: size,
        height: size,
        backgroundImage: viberGradient(handle),
        fontSize: Math.round(size * 0.42),
      }}
      aria-hidden="true"
    >
      {viberInitial(handle)}
    </span>
  );
}
