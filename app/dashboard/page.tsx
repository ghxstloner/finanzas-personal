"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Heart, 
  Plus, 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users,
  Settings,
  LogOut,
  Loader2
} from "lucide-react"

interface User {
  id: string
  email: string
  name: string
  household?: {
    id: string
    name: string
  }
}

interface Account {
  id: string
  name: string
  type: string
  balance: number
}

interface Transaction {
  id: string
  amount: number
  description: string
  type: string
  date: string
  account: { name: string; type: string }
  category: { name: string; color?: string; icon?: string }
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user data
        const userResponse = await fetch("/api/auth/me")
        if (!userResponse.ok) {
          router.push("/login")
          return
        }
        
        const userData = await userResponse.json()
        setUser(userData.user)

        // If no household, redirect to onboarding
        if (!userData.user.household) {
          router.push("/onboarding")
          return
        }

        // Get accounts
        const accountsResponse = await fetch("/api/accounts")
        if (accountsResponse.ok) {
          const accountsData = await accountsResponse.json()
          setAccounts(accountsData.accounts)
        }

        // Get recent transactions
        const transactionsResponse = await fetch("/api/transactions?limit=10")
        if (transactionsResponse.ok) {
          const transactionsData = await transactionsResponse.json()
          setTransactions(transactionsData.transactions)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!user) return null

  const totalBalance = accounts.reduce((sum, account) => sum + Number(account.balance), 0)
  const monthlyIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + Number(t.amount), 0)
  const monthlyExpenses = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-red-500" />
                <span className="text-2xl font-bold text-gray-900">Finanzas Pareja</span>
              </div>
              {user.household && (
                <Badge variant="outline" className="text-sm">
                  {user.household.name}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarFallback>
                  {user.name?.split(' ').map(n => n[0]).join('') || user.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Financial Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Balance Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalBalance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                Suma de todas las cuentas
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${monthlyIncome.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                Ingresos registrados
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gastos del Mes</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${monthlyExpenses.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                Gastos registrados
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="accounts">Cuentas</TabsTrigger>
            <TabsTrigger value="transactions">Transacciones</TabsTrigger>
            <TabsTrigger value="goals">Metas</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Transactions */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Transacciones Recientes
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {transactions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No hay transacciones registradas</p>
                      <p className="text-sm">Agrega tu primera transacción</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {transactions.slice(0, 5).map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-medium"
                              style={{ backgroundColor: transaction.category.color || '#6B7280' }}
                            >
                              {transaction.category.name[0]}
                            </div>
                            <div>
                              <p className="font-medium">{transaction.description || transaction.category.name}</p>
                              <p className="text-sm text-gray-500">{transaction.account.name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium ${
                              transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'INCOME' ? '+' : '-'}${Number(transaction.amount).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(transaction.date).toLocaleDateString('es-MX')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Acciones Rápidas</CardTitle>
                  <CardDescription>
                    Gestiona tus finanzas de manera eficiente
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Transacción
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Nueva Cuenta
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Crear Meta
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Invitar Pareja
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Accounts Tab */}
          <TabsContent value="accounts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Cuentas</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Cuenta
              </Button>
            </div>
            
            {accounts.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="text-center py-16">
                  <CreditCard className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold mb-2">No hay cuentas registradas</h3>
                  <p className="text-gray-500 mb-4">Agrega tu primera cuenta para empezar a trackear tus finanzas</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Cuenta
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map((account) => (
                  <Card key={account.id} className="border-0 shadow-lg">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{account.name}</CardTitle>
                        <Badge variant="outline">{account.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold mb-2">
                        ${Number(account.balance).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Saldo actual</span>
                        <Button size="sm" variant="ghost">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Transacciones</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Transacción
              </Button>
            </div>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                {transactions.length === 0 ? (
                  <div className="text-center py-16">
                    <DollarSign className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold mb-2">No hay transacciones</h3>
                    <p className="text-gray-500 mb-4">Comienza agregando tu primera transacción</p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Transacción
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-100"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className="h-12 w-12 rounded-full flex items-center justify-center text-white font-medium"
                            style={{ backgroundColor: transaction.category.color || '#6B7280' }}
                          >
                            {transaction.category.name[0]}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description || transaction.category.name}</p>
                            <p className="text-sm text-gray-500">
                              {transaction.account.name} • {new Date(transaction.date).toLocaleDateString('es-MX')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-medium ${
                            transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'INCOME' ? '+' : '-'}${Number(transaction.amount).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {transaction.category.name}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Metas Financieras</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Meta
              </Button>
            </div>

            <Card className="border-0 shadow-lg">
              <CardContent className="text-center py-16">
                <TrendingUp className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold mb-2">No hay metas definidas</h3>
                <p className="text-gray-500 mb-4">Establece metas financieras para lograr objetivos juntos</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Meta
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}