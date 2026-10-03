import type { ButtonHTMLAttributes } from "react";

export function choiceClass(on: boolean, pad = "px-4 py-3"): string {
  return `rounded-2xl border text-left ${pad} ${on ? "border-olive bg-paper" : "border-line bg-paper/60"}`;
}

export function Choice({
  on,
  pad = "px-4 py-3",
  className = "",
  type = "button",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { on: boolean; pad?: string }) {
  return <button type={type} className={`${choiceClass(on, pad)} ${className}`} {...rest} />;
}
