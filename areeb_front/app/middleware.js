'use client'
import { NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  // Get token from cookies
  const token = request.cookies.get('token')
  
  // Define public routes that don't need authentication
  const publicPaths = [
    '/',
    '/about',
    '/event'
  ]

  // Get the current path
  const currentPath = request.nextUrl.pathname

  // Check if the current path is public
  const isPublicPath = publicPaths.some(path => 
    currentPath === path || currentPath.startsWith(`${path}/`)
  )

  // Strict token validation
  const isValidToken = token && token.value && token.value.length > 10

  // If it's not a public path and no valid token exists, redirect to home
  if (!isPublicPath && !isValidToken) {
    // Create the response
    const response = NextResponse.redirect(new URL('/', request.url))
    
    // Always remove token if not valid
    response.cookies.delete('token')

    return response
  }

  return NextResponse.next()
}

// Configure middleware to match all paths except static files and api routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|شعار_التأهيلية.ico|public).*)',
  ],
} 