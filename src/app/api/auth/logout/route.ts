import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/http";
import { signOut } from "@/lib/store";

export async function POST() {
  try {
    await signOut();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
