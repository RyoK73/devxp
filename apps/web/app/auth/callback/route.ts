import { NextResponse } from "next/server";

export async function GET() {
  // TODO: SupabaseのOAuth codeをセッションに交換し、成功後は /dashboard へリダイレクトする
  return NextResponse.json({ status: "not implemented" }, { status: 501 });
}
