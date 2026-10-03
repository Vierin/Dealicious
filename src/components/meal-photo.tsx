import { UtensilsCrossed } from "lucide-react";

export function MealPhoto({ src, className }: { src: string | null; className: string }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="" className={`object-cover ${className}`} />
    );
  }
  return (
    <div className={`flex items-center justify-center bg-[#e6dfd2] text-muted ${className}`}>
      <UtensilsCrossed size={36} strokeWidth={1.25} aria-hidden />
    </div>
  );
}
