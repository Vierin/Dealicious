export function Page({
  children,
  width = "narrow",
}: {
  children: React.ReactNode;
  width?: "narrow" | "wide";
}) {
  const max = width === "wide" ? "max-w-5xl" : "max-w-2xl";
  return <main className={`mx-auto w-full ${max} px-5 py-8`}>{children}</main>;
}
