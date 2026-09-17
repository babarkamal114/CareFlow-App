import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./auth";

export const VERIFICATION_ROUTE = '/verify-email'
export const SUBSCRIPTION_ROUTE = '/subscription'
export const AGENCY_CREATION_ROUTE = '/create-agency'

export async function proxy(request: NextRequest): Promise<NextResponse> {
  // TEMP: bypassing auth checks to work on dashboard UI without backend running
  // TODO: remove this before pushing/merging
  return NextResponse.next();

  const { pathname } = request.nextUrl;
  const session = await auth();
  
  const isLoggedIn = !!session?.user;
  
 
  const isEmailVerified = session?.user?.isEmailVerified === true;
  const hasActiveSubscription = session?.user?.hasActiveSubscription === true;
  const hasAgency = session?.user?.hasAgency === true;
  const userType = session?.user?.userType; 
  const role = session?.user?.role; 


  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password");


  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }


  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }


  if (!isEmailVerified && pathname !== VERIFICATION_ROUTE) {
    return NextResponse.redirect(new URL(VERIFICATION_ROUTE, request.url));
  }
  if (isEmailVerified && pathname === VERIFICATION_ROUTE) {
    return NextResponse.redirect(new URL("/", request.url));
  }


  const isAgencyStaffOrMember = 
    userType === 'STAFF' || 
    userType === 'ADMIN_MEMBER' ||
    role === 'manager' ||
    role === 'coordinator' ||
    role === 'carer' ||
    role === 'patient';
  
  if (isAgencyStaffOrMember) {

    if (pathname === SUBSCRIPTION_ROUTE || pathname === AGENCY_CREATION_ROUTE) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next(); // Let them access the dashboard
  }


  if (
    userType === 'ADMIN_OWNER' || 
    userType === 'NO_AGENCY' ||
    role === 'agency_admin' ||
    role === 'super_admin'
  ) {
    
  
    if (!hasActiveSubscription && pathname !== SUBSCRIPTION_ROUTE) {
      return NextResponse.redirect(new URL(SUBSCRIPTION_ROUTE, request.url));
    }


    if (hasActiveSubscription && pathname === SUBSCRIPTION_ROUTE) {
      return NextResponse.redirect(new URL(AGENCY_CREATION_ROUTE, request.url));
    }

    if (hasActiveSubscription && !hasAgency && pathname !== AGENCY_CREATION_ROUTE) {
      return NextResponse.redirect(new URL(AGENCY_CREATION_ROUTE, request.url));
    }


    if (hasActiveSubscription && hasAgency) {
      if (pathname === SUBSCRIPTION_ROUTE || pathname === AGENCY_CREATION_ROUTE) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }


  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};