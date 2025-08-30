import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { registerSchema } from '@/lib/validations'
import { sendEmail, generateVerificationEmailHtml } from '@/lib/email'
import { randomBytes } from 'crypto'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = registerSchema.parse(body)
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'El usuario ya existe' },
        { status: 400 }
      )
    }
    
    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)
    
    // Generate email verification token
    const verificationToken = randomBytes(32).toString('hex')
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    
    // Create user (not verified initially)
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
      },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        createdAt: true,
      }
    })
    
    // Generate verification link
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const verificationLink = `${baseUrl}/verify-email?token=${verificationToken}`
    
    // Send verification email
    console.log('[REGISTER] Preparing to send verification email to:', user.email)
    const emailHtml = generateVerificationEmailHtml(user.name || 'Usuario', verificationLink)
    const emailResult = await sendEmail({
      to: user.email,
      subject: '¡Verifica tu cuenta en Finanzas Pareja!',
      html: emailHtml,
    })
    console.log('[REGISTER] Email send result:', emailResult)
    
    return NextResponse.json(
      { 
        user,
        message: 'Cuenta creada exitosamente. Por favor verifica tu email antes de iniciar sesión.' 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}