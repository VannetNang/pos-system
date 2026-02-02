import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "./actions/getAuthUser";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login"];

export const proxy = async (req: NextRequest) => {
  const path = req.nextUrl.pathname;
  const isProtected = protectedRoutes.includes(path);
  const isPublic = publicRoutes.includes(path);
  const user = await getAuthUser();

  // ignore "/" home page
  if (path === "/") {
    return user
      ? NextResponse.redirect(new URL("/dashboard", req.nextUrl))
      : NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // access a protected route without login
  if (!user && isProtected) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // if logged in and try to access a public route (like login)
  if (user && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // otherwise, let the request proceed normally
  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
