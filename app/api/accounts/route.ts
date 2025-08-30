import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { accountSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }
    
    const accounts = await prisma.account.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' },
    })
    
    return NextResponse.json({ accounts })
  } catch (error) {
    console.error('Get accounts error:', error)
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

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
    const validatedData = accountSchema.parse(body)
    
    // Check if user has a household, otherwise create one
    const userData = await prisma.user.findUnique({
      where: { id: user.userId },
      include: { household: true },
    })
    
    if (!userData) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }
    
    let householdId = userData.householdId
    
    // If user doesn't have a household, create one
    if (!householdId) {
      const household = await prisma.household.create({
        data: {
          name: `Hogar de ${userData.name || userData.email}`,
          ownerId: user.userId,
        }
      })
      
      // Update user with household
      await prisma.user.update({
        where: { id: user.userId },
        data: { householdId: household.id },
      })
      
      householdId = household.id
    }
    
    const account = await prisma.account.create({
      data: {
        ...validatedData,
        userId: user.userId,
        householdId: householdId!,
      }
    })
    
    return NextResponse.json({ account }, { status: 201 })
  } catch (error) {
    console.error('Create account error:', error)
    
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