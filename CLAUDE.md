# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev`: Start development server with Turbopack
- `npm run build`: Build for production  
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run db:generate`: Generate Prisma client
- `npm run db:push`: Push schema to database (development)
- `npm run db:migrate`: Run database migrations
- `npm run db:seed`: Seed database with default categories
- `npm run db:studio`: Open Prisma Studio

## Architecture Overview

This is a Next.js 15 finance management application for couples built with modern full-stack technologies:

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based auth with HTTP-only cookies
- **Styling**: TailwindCSS v4
- **UI Components**: Radix UI + shadcn/ui (New York style)
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React

### Database Schema (Prisma)
The application uses PostgreSQL with household-based multi-tenancy:

**Core Models:**
- **User**: User accounts with JWT authentication
- **Household**: Shared financial spaces for couples
- **HouseholdInvitation**: Partner invitation system
- **Account**: Financial accounts (checking, savings, etc.)
- **Transaction**: Financial transactions with categories
- **Category**: Expense/income categorization (seeded defaults)
- **Goal**: Shared financial goals

**Key Features:**
- Multi-tenant household architecture
- Partner collaboration system  
- JWT authentication with secure cookies
- Prisma ORM with type safety

### File Structure
```
app/
├── api/
│   ├── auth/           # JWT auth endpoints (login, register, logout, me)
│   ├── accounts/       # Account management
│   ├── categories/     # Category management  
│   ├── households/     # Household management
│   └── transactions/   # Transaction management
├── dashboard/          # Main dashboard page
├── login/             # Login page
├── onboarding/        # User onboarding flow
├── signup/            # Registration page
└── page.tsx           # Landing page

lib/
├── auth.ts            # JWT authentication utilities
├── prisma.ts          # Prisma client singleton
└── validations.ts     # Zod schemas

prisma/
├── schema.prisma      # Database schema
└── seed.ts           # Database seeding
```

### Authentication Flow
- JWT-based authentication with HTTP-only cookies
- Secure password hashing with bcryptjs
- Protected routes via middleware
- Automatic token validation and user session management

### Database Setup
1. Ensure PostgreSQL is running locally
2. Update DATABASE_URL in .env
3. Run migrations: `npm run db:push`
4. Seed categories: `npm run db:seed`
5. Generate client: `npm run db:generate`

### Environment Variables Required
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/finanzas_pareja?schema=public"
JWT_SECRET="your-super-secure-jwt-secret-min-32-chars"
NEXTAUTH_SECRET="your-super-secure-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### Component System
- Uses shadcn/ui with New York style variant
- Path aliases: `@/components`, `@/lib`, `@/app`
- CSS variables for theming
- Lucide icons throughout

### Key Features
- **Landing Page**: Modern marketing page with feature showcase
- **Authentication**: Complete login/signup flow with validation
- **Onboarding**: Step-by-step setup for new users
- **Dashboard**: Comprehensive finance management interface
- **Multi-Account Support**: Multiple account types and balances
- **Transaction Management**: Income/expense tracking with categories
- **Household Collaboration**: Partner invitation system
- **Financial Goals**: Shared goal setting and tracking

### Development Notes
- All components are client-side ("use client") for interactivity
- Form validation using Zod schemas
- Error handling and loading states throughout
- Responsive design with mobile-first approach
- Type-safe API routes with Prisma
- Comprehensive middleware for auth protection