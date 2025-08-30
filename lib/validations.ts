import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

const passwordSchema = z.string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
  .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
  .regex(/\d/, 'Debe contener al menos un número')
  .regex(/[@$!%*?&.]/, 'Debe contener al menos un símbolo (@$!%*?&.)')

export const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

export const accountSchema = z.object({
  name: z.string().min(1, 'El nombre de la cuenta es requerido'),
  type: z.enum(['CHECKING', 'SAVINGS', 'CREDIT_CARD', 'INVESTMENT', 'CASH', 'OTHER']),
  balance: z.number().default(0),
})

export const transactionSchema = z.object({
  amount: z.number().positive('El monto debe ser positivo'),
  description: z.string().optional(),
  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
  categoryId: z.string().min(1, 'La categoría es requerida'),
  accountId: z.string().min(1, 'La cuenta es requerida'),
  date: z.string().datetime().optional(),
})

export const goalSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().optional(),
  targetAmount: z.number().positive('El monto objetivo debe ser positivo'),
  targetDate: z.string().datetime().optional(),
})

export const householdSchema = z.object({
  name: z.string().min(1, 'El nombre del hogar es requerido'),
})

export const inviteSchema = z.object({
  email: z.string().email('Email inválido'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type AccountInput = z.infer<typeof accountSchema>
export type TransactionInput = z.infer<typeof transactionSchema>
export type GoalInput = z.infer<typeof goalSchema>
export type HouseholdInput = z.infer<typeof householdSchema>
export type InviteInput = z.infer<typeof inviteSchema>