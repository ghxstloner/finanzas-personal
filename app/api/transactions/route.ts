import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { transactionSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')
    const accountId = searchParams.get('accountId')
    const type = searchParams.get('type')
    
    const skip = (page - 1) * limit
    
    const where: Record<string, unknown> = { userId: user.userId }
    
    if (accountId) {
      where.accountId = accountId
    }
    
    if (type) {
      where.type = type
    }
    
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          account: { select: { name: true, type: true } },
          category: { select: { name: true, color: true, icon: true } },
        },
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ])
    
    return NextResponse.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get transactions error:', error)
    
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
    const validatedData = transactionSchema.parse(body)
    
    // Verify account belongs to user
    const account = await prisma.account.findFirst({
      where: {
        id: validatedData.accountId,
        userId: user.userId,
      },
    })
    
    if (!account) {
      return NextResponse.json(
        { error: 'Cuenta no encontrada' },
        { status: 404 }
      )
    }
    
    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        ...validatedData,
        userId: user.userId,
        date: validatedData.date ? new Date(validatedData.date) : new Date(),
      },
      include: {
        account: { select: { name: true, type: true } },
        category: { select: { name: true, color: true, icon: true } },
      },
    })
    
    // Update account balance
    const balanceChange = validatedData.type === 'EXPENSE' 
      ? -validatedData.amount 
      : validatedData.amount
    
    await prisma.account.update({
      where: { id: validatedData.accountId },
      data: {
        balance: {
          increment: balanceChange,
        },
      },
    })
    
    return NextResponse.json({ transaction }, { status: 201 })
  } catch (error) {
    console.error('Create transaction error:', error)
    
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