import { NextResponse } from "next/server";

export default function middleware(req) {
  const verify = req.cookies.get("session");
  const baseUrl = req?.url;
  if (!verify) {
    // Yönlendirilen URL'e bir sorgu parametresi ekleyin
    const loginUrl = new URL("/auth/signin", baseUrl);
    loginUrl.searchParams.set("message", "Please sign in before continuing.");

    if (baseUrl.includes("orders") || baseUrl.includes("tickets")) {
      return NextResponse.redirect(loginUrl);
    }
  }
  // if (verify) return NextResponse.redirect(new URL("/tickets", req.url));
}
