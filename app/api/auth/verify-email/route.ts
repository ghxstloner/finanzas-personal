import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('[VERIFY-EMAIL] Starting email verification process...')
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    console.log('[VERIFY-EMAIL] Received token:', token)

    if (!token) {
      console.log('[VERIFY-EMAIL] No token provided')
      return NextResponse.json(
        { error: 'Token de verificación requerido' },
        { status: 400 }
      )
    }

    console.log('[VERIFY-EMAIL] Searching for user with token...')
    // Find user with this verification token
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: {
          gt: new Date(),
        },
      },
    })

    console.log('[VERIFY-EMAIL] User found:', user ? `User ID: ${user.id}, Email: ${user.email}` : 'No user found')

    if (!user) {
      // Let's also check if there's a user with this token but expired
      const expiredUser = await prisma.user.findFirst({
        where: {
          emailVerificationToken: token,
        },
      })
      console.log('[VERIFY-EMAIL] Expired user check:', expiredUser ? `Found expired token for: ${expiredUser.email}` : 'Token not found in database')
      
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 400 }
      )
    }

    console.log('[VERIFY-EMAIL] Updating user verification status...')
    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    })

    console.log('[VERIFY-EMAIL] User successfully verified:', user.email)
    return NextResponse.json(
      { message: 'Email verificado exitosamente. Ahora puedes iniciar sesión.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[VERIFY-EMAIL] Email verification error:', error)
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}