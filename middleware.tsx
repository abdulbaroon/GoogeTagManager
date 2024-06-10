import { AuthContext } from '@/context/auth-context';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { useContext } from 'react';

const { currentUser} = useContext(AuthContext)

export function middleware(request: NextRequest) {
  if (!currentUser) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/dashboard'],
};