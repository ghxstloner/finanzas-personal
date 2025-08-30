"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, CheckCircle, ArrowRight, Loader2 } from "lucide-react"

interface User {
  id: string
  email: string
  name: string
  household?: {
    id: string
    name: string
  }
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [household, setHousehold] = useState({ name: "" })
  const [account, setAccount] = useState({
    name: "",
    type: "CHECKING",
    balance: 0
  })
  const router = useRouter()

  useEffect(() => {
    // Get user data
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          
          // If user already has a household, redirect to dashboard
          if (data.user.household) {
            router.push("/dashboard")
          }
        } else {
          router.push("/login")
        }
      } catch {
        router.push("/login")
      }
    }

    fetchUser()
  }, [router])

  const handleCreateHousehold = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch("/api/households", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(household),
      })

      if (response.ok) {
        setCurrentStep(2)
      }
    } catch (error) {
      console.error("Error creating household:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAccount = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch("/api/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(account),
      })

      if (response.ok) {
        setCurrentStep(3)
      }
    } catch (error) {
      console.error("Error creating account:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFinish = () => {
    router.push("/dashboard")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-red-500" />
            <span className="text-2xl font-bold text-gray-900">Finanzas Pareja</span>
          </div>
          <div className="flex justify-center space-x-4 mb-6">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step <= currentStep
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step < currentStep ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  step
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Create Household */}
        {currentStep === 1 && (
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">¡Bienvenido, {user.name}!</CardTitle>
              <CardDescription>
                Primero, vamos a crear tu espacio financiero compartido
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="householdName">Nombre de tu hogar</Label>
                  <Input
                    id="householdName"
                    placeholder="Ej: Hogar de Juan y María"
                    value={household.name}
                    onChange={(e) => setHousehold({ ...household, name: e.target.value })}
                  />
                </div>
                
                <Button
                  onClick={handleCreateHousehold}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!household.name.trim() || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      Crear Hogar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Create First Account */}
        {currentStep === 2 && (
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Agrega tu primera cuenta</CardTitle>
              <CardDescription>
                Conecta una cuenta bancaria o billetera para empezar a trackear tus finanzas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accountName">Nombre de la cuenta</Label>
                  <Input
                    id="accountName"
                    placeholder="Ej: Cuenta Corriente Principal"
                    value={account.name}
                    onChange={(e) => setAccount({ ...account, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountType">Tipo de cuenta</Label>
                  <Select
                    value={account.type}
                    onValueChange={(value) => setAccount({ ...account, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CHECKING">Cuenta Corriente</SelectItem>
                      <SelectItem value="SAVINGS">Cuenta de Ahorros</SelectItem>
                      <SelectItem value="CREDIT_CARD">Tarjeta de Crédito</SelectItem>
                      <SelectItem value="CASH">Efectivo</SelectItem>
                      <SelectItem value="INVESTMENT">Inversiones</SelectItem>
                      <SelectItem value="OTHER">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="balance">Saldo inicial (opcional)</Label>
                  <Input
                    id="balance"
                    type="number"
                    placeholder="0"
                    value={account.balance}
                    onChange={(e) => setAccount({ ...account, balance: Number(e.target.value) })}
                  />
                </div>
                
                <Button
                  onClick={handleCreateAccount}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!account.name.trim() || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    <>
                      Agregar Cuenta
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Success */}
        {currentStep === 3 && (
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">¡Todo listo!</CardTitle>
              <CardDescription>
                Tu espacio financiero está configurado. Ahora puedes empezar a gestionar tus finanzas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Próximos pasos:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Agrega transacciones para empezar a trackear gastos</li>
                    <li>• Invita a tu pareja para colaborar</li>
                    <li>• Establece metas financieras compartidas</li>
                  </ul>
                </div>
                
                <Button
                  onClick={handleFinish}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Ir al Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}