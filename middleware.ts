import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

const isProtected = createRouteMatcher(["/analysis(.*)"]);

// If Clerk env vars are not configured, fall through instead of crashing the
// whole site with MIDDLEWARE_INVOCATION_FAILED. The /analysis pages will then
// load without auth gating, which is the lesser of two evils on a misconfigured
// deploy. Set both keys in Vercel Project Settings to re-enable gating.
const clerkReady =
  !!process.env.CLERK_SECRET_KEY &&
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const middleware = clerkReady
  ? clerkMiddleware(async (auth, req) => {
      if (isProtected(req)) {
        await auth.protect();
      }
    })
  : (_req: NextRequest) => NextResponse.next();

export default middleware;

export const config = {
  matcher: [
    // Skip Next internals and static assets, run on everything else.
    "/((?!_next|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};
