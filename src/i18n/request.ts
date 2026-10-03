import "./global";
import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isLocale } from "./config";

export default getRequestConfig(async () => {
  const store = await cookies();
  const picked = store.get("locale")?.value;
  const locale = isLocale(picked) ? picked : defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
