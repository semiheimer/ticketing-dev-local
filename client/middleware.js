import { NextResponse } from "next/server";

export default function middleware(req) {
  const verify = req.cookies.get("session");
  const baseUrl = req?.url;
  if (!verify) {
    if (baseUrl.includes("orders") || baseUrl.includes("tickets"))
      return NextResponse.redirect(new URL("/", baseUrl));
  }
  // if (verify) return NextResponse.redirect(new URL("/tickets", req.url));
}
