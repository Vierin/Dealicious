const MODEL = "gpt-5.4-mini";

type ChatResponse = {
  choices?: { message?: { content?: unknown } }[];
  error?: { message?: string };
};

function messageText(content: unknown): string {
  if (typeof content === "string") return content.trim();
  if (!Array.isArray(content)) return "";
  return content
    .map((part) => {
      if (!part || typeof part !== "object") return "";
      const text = (part as { text?: unknown }).text;
      return typeof text === "string" ? text : "";
    })
    .join("")
    .trim();
}

async function complete(key: string, body: Record<string, unknown>): Promise<{ status: number; data: ChatResponse }> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${key}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = (await response.json().catch(() => ({}))) as ChatResponse;
  return { status: response.status, data };
}

export async function askJson(system: string, user: string): Promise<unknown> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("errors.cookKey");
  const base = {
    model: MODEL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    response_format: { type: "json_object" },
    max_completion_tokens: 4000,
  };
  let result = await complete(key, { ...base, reasoning_effort: "low" });
  const rejected = result.data.error?.message ?? "";
  if (result.status === 400 && /reasoning_effort|reasoning effort/i.test(rejected)) {
    result = await complete(key, base);
  }
  if (result.status === 401) throw new Error("errors.cookKey");
  if (result.status < 200 || result.status >= 300) {
    console.error(result.data.error?.message ?? `openai ${result.status}`);
    throw new Error("errors.cookModel");
  }
  const text = messageText(result.data.choices?.[0]?.message?.content);
  if (!text) throw new Error("errors.cookModel");
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error("errors.cookBad");
  }
}
