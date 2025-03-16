import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PUBLIC_ROUTES = [
  "/signup",
  "/signin",
  "/signout",
  "/resetpassword",
  "/docs",
];

const API_ROUTES = ["/api/auth/verified"];

export async function middleware(request: NextRequest) {
  // console.log("[middleware] intercepted request:")
  // console.log(request);

  if (
    PUBLIC_ROUTES.includes(request.nextUrl.pathname) ||
    API_ROUTES.includes(request.nextUrl.pathname)
  ) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // console.log("[middleware] user:")
  // console.log(user);

  if (error) {
    console.error("Auth error:", error.message);
  }

  const nxtPathname = request.nextUrl.pathname;

  const isPublicRoute =
    nxtPathname === "/" ||
    PUBLIC_ROUTES.some((route) => nxtPathname.startsWith(route));

  // Handle protected routes
  if (!isPublicRoute && !user) {
    console.log("[middleware] redirecting unsigned in user to /signin");
    const redirectUrl = new URL("/signin", request.url);

    redirectUrl.searchParams.set("next", request.nextUrl.pathname);

    return NextResponse.redirect(redirectUrl);
  }

  // Handle auth routes when user is already logged in
  if (
    user &&
    (request.nextUrl.pathname.startsWith("/signin") ||
      request.nextUrl.pathname.startsWith("/signup"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
