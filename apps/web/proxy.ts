import { NextResponse } from "next/server";

export function proxy() {
  // TODO: Supabaseセッションを確認し、/dashboard/* で未ログインなら /login へリダイレクトする
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
