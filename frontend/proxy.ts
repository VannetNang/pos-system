import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "./actions/getAuthUser";

const publicRoutes = ["/login"];

export const proxy = async (req: NextRequest) => {
  const path = req.nextUrl.pathname;
  const isProtected =
    path.startsWith("/dashboard") || path.startsWith("/admin");
  const isPublic = publicRoutes.includes(path);
  const user = await getAuthUser();
  const isAdmin = user?.role === "admin";

  // access a protected route without login
  if (!user && isProtected) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // ignore "/" home page
  if (path === "/") {
    if (!user) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    const dashboard = isAdmin ? "/admin/dashboard" : "/dashboard";
    return NextResponse.redirect(new URL(dashboard, req.nextUrl));
  }

  // if logged in, but tryna access login page
  if (user && isPublic) {
    const dashboard = isAdmin ? "/admin/dashboard" : "/dashboard";
    return NextResponse.redirect(new URL(dashboard, req.nextUrl));
  }

  // if staff tryna access admin route
  if (path.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // otherwise, let the request proceed normally
  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
