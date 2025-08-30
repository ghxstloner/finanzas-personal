"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, Loader2 } from "lucide-react"
import { registerSchema, RegisterInput } from "@/lib/validations"

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [status, setStatus] = useState<'form' | 'success'>('form')
  const [message, setMessage] = useState("")
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        // Show success message and redirect to login
        setStatus('success')
        setMessage(result.message)
      } else {
        setError(result.error || "Error al crear la cuenta")
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-red-500" />
            <span className="text-2xl font-bold text-gray-900">Finanzas Pareja</span>
          </Link>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {status === 'form' ? 'Crear Cuenta' : '¡Cuenta Creada!'}
            </CardTitle>
            <CardDescription>
              {status === 'form' 
                ? 'Únete y comienza a gestionar tus finanzas en pareja'
                : 'Revisa tu email para verificar tu cuenta'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status === 'form' ? (
              <>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Tu nombre completo"
                      {...register("name")}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      {...register("email")}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Mínimo 8 caracteres, mayúsculas, minúsculas, números y símbolos"
                      {...register("password")}
                      className={errors.password ? "border-red-500" : ""}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Repite tu contraseña"
                      {...register("confirmPassword")}
                      className={errors.confirmPassword ? "border-red-500" : ""}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md text-xs">
                    <strong>Requisitos de contraseña:</strong>
                    <ul className="mt-1 space-y-1">
                      <li>• Mínimo 8 caracteres</li>
                      <li>• Al menos una mayúscula (A-Z)</li>
                      <li>• Al menos una minúscula (a-z)</li>
                      <li>• Al menos un número (0-9)</li>
                      <li>• Al menos un símbolo (@$!%*?&.)</li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creando cuenta...
                      </>
                    ) : (
                      "Crear Cuenta"
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                  ¿Ya tienes cuenta?{" "}
                  <Link href="/login" className="text-blue-600 hover:underline font-medium">
                    Inicia sesión aquí
                  </Link>
                </div>

                <div className="mt-4 text-xs text-gray-500 text-center">
                  Al crear una cuenta, aceptas nuestros términos de servicio y política de privacidad.
                </div>
              </>
            ) : (
              <div className="text-center space-y-4">
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                  {message}
                </div>
                <div className="text-gray-600">
                  <p className="mb-4">
                    Hemos enviado un enlace de verificación a tu correo electrónico. 
                    Haz clic en el enlace para activar tu cuenta y poder iniciar sesión.
                  </p>
                  <p className="text-sm text-gray-500">
                    ¿No recibiste el correo? Revisa tu carpeta de spam o correo no deseado.
                  </p>
                </div>
                <Button
                  onClick={() => router.push('/login')}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Ir al Login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}