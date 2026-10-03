import type { InputHTMLAttributes } from "react";

export function Field({
  size = "md",
  className = "",
  ...rest
}: Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & { size?: "md" | "lg" }) {
  const height = size === "lg" ? "h-14 text-lg" : "h-12 text-base";
  return (
    <input
      className={`${height} w-full rounded-2xl border border-line bg-paper px-4 text-ink outline-none focus:border-olive ${className}`}
      {...rest}
    />
  );
}
