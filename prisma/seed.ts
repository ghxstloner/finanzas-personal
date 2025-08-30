import { PrismaClient, CategoryType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Default income categories
  const incomeCategories = [
    { name: 'Salario', type: CategoryType.INCOME, color: '#10B981', icon: 'Briefcase' },
    { name: 'Freelance', type: CategoryType.INCOME, color: '#8B5CF6', icon: 'Code' },
    { name: 'Inversiones', type: CategoryType.INCOME, color: '#F59E0B', icon: 'TrendingUp' },
    { name: 'Negocios', type: CategoryType.INCOME, color: '#3B82F6', icon: 'Building' },
    { name: 'Otros Ingresos', type: CategoryType.INCOME, color: '#6B7280', icon: 'Plus' },
  ]

  // Default expense categories
  const expenseCategories = [
    { name: 'Alimentación', type: CategoryType.EXPENSE, color: '#EF4444', icon: 'ShoppingCart' },
    { name: 'Transporte', type: CategoryType.EXPENSE, color: '#F97316', icon: 'Car' },
    { name: 'Vivienda', type: CategoryType.EXPENSE, color: '#84CC16', icon: 'Home' },
    { name: 'Servicios', type: CategoryType.EXPENSE, color: '#06B6D4', icon: 'Zap' },
    { name: 'Entretenimiento', type: CategoryType.EXPENSE, color: '#8B5CF6', icon: 'GameController2' },
    { name: 'Salud', type: CategoryType.EXPENSE, color: '#EC4899', icon: 'Heart' },
    { name: 'Educación', type: CategoryType.EXPENSE, color: '#10B981', icon: 'GraduationCap' },
    { name: 'Ropa', type: CategoryType.EXPENSE, color: '#F59E0B', icon: 'Shirt' },
    { name: 'Tecnología', type: CategoryType.EXPENSE, color: '#6366F1', icon: 'Smartphone' },
    { name: 'Otros Gastos', type: CategoryType.EXPENSE, color: '#6B7280', icon: 'MoreHorizontal' },
  ]

  console.log('Seeding default categories...')

  // Create income categories
  for (const category of incomeCategories) {
    await prisma.category.create({
      data: {
        ...category,
        isDefault: true,
      },
    })
  }

  // Create expense categories
  for (const category of expenseCategories) {
    await prisma.category.create({
      data: {
        ...category,
        isDefault: true,
      },
    })
  }

  console.log('Default categories created successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })