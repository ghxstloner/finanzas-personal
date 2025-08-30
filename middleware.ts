import { NextResponse, type NextRequest } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Define protected and public routes
  const protectedRoutes = ['/dashboard', '/onboarding']
  const publicApiRoutes = ['/api/auth/login', '/api/auth/register', '/api/auth/verify-email']
  
  // Check route type
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isPublicApiRoute = publicApiRoutes.some(route => pathname.startsWith(route))
  
  // Get user from token
  const user = getUserFromRequest(request)
  
  // Log para debugging (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    console.log(`Middleware - Ruta: ${pathname}, Usuario autenticado: ${!!user}`)
  }
  
  // Only redirect unauthenticated users from protected routes
  if (isProtectedRoute && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // Handle API routes
  if (pathname.startsWith('/api/') && !isPublicApiRoute && !user) {
    return NextResponse.json(
      { success: false, message: 'authentication required' },
      { status: 401 }
    )
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
