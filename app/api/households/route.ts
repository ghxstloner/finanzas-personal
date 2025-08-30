import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { householdSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const validatedData = householdSchema.parse(body)
    
    // Check if user already has a household
    const existingUser = await prisma.user.findUnique({
      where: { id: user.userId },
      include: { household: true },
    })
    
    if (existingUser?.household) {
      return NextResponse.json(
        { error: 'Ya tienes un hogar creado' },
        { status: 400 }
      )
    }
    
    // Create household
    const household = await prisma.household.create({
      data: {
        name: validatedData.name,
        ownerId: user.userId,
      }
    })
    
    // Update user to link with household
    await prisma.user.update({
      where: { id: user.userId },
      data: { householdId: household.id },
    })
    
    return NextResponse.json({ household }, { status: 201 })
  } catch (error) {
    console.error('Create household error:', error)
    
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