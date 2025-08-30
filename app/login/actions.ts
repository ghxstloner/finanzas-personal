'use server'

import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { comparePasswords, signToken } from '@/lib/auth'
import { loginSchema, LoginInput } from '@/lib/validations'

export async function loginAction(data: LoginInput) {
  try {
    // Validate input
    const validatedData = loginSchema.parse(data)
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      include: {
        household: true,
      }
    })
    
    if (!user) {
      return { success: false, error: 'Credenciales inválidas' }
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return { 
        success: false, 
        error: 'Por favor verifica tu email antes de iniciar sesión. Revisa tu bandeja de entrada.' 
      }
    }
    
    // Check password
    const isValidPassword = await comparePasswords(validatedData.password, user.password)
    
    if (!isValidPassword) {
      return { success: false, error: 'Credenciales inválidas' }
    }
    
    // Create JWT token
    const token = signToken({ userId: user.id, email: user.email })
    
    // Set cookie with explicit configuration
    const cookieStore = await cookies()
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    
    console.log('Cookie establecida para usuario:', user.email)
    
    // Return success with user info for verification
    return { 
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        hasHousehold: !!user.household,
        emailVerified: user.emailVerified
      }
    }
    
  } catch (error) {
    console.error('Login error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return { success: false, error: 'Datos inválidos' }
    }
    
    return { success: false, error: 'Error interno del servidor' }
  }
}