// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import type { Database } from "./lib/types/supabase"

const PUBLIC_ROUTES = ["/", "/login", "/auth/callback"]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next()
  }

  const supabase = createServerClient<Database>(
    process.env['NEXT_PUBLIC_SUPABASE_URL']!,
process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(`sb-${name}`)?.value
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const { data: profile } = await supabase
    .from("v_authenticated_profiles")
    .select("*")
    .eq("auth_user_id", user.id)
    .maybeSingle() // changed from .single() to .maybeSingle()

  if (!profile || !profile.is_active) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const role = profile.role_slug

  if (pathname.startsWith("/my-advontier/staff") && !role?.startsWith("advontier-")) {
    return NextResponse.redirect(new URL("/unauthorized", req.url))
  }

  if (pathname.startsWith("/my-advontier/client") && !role?.startsWith("client-")) {
    return NextResponse.redirect(new URL("/unauthorized", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/my-advontier/:path*",
    "/admin/:path*",
  ],
}
