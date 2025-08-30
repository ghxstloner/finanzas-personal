"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, CheckCircle, XCircle, Loader2 } from "lucide-react"

function VerifyEmailContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token')

      if (!token) {
        setStatus('error')
        setMessage('Token de verificación faltante')
        return
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`)
        const result = await response.json()

        if (response.ok) {
          setStatus('success')
          setMessage(result.message)
        } else {
          setStatus('error')
          setMessage(result.error || 'Error al verificar el email')
        }
      } catch {
        setStatus('error')
        setMessage('Error de conexión')
      }
    }

    verifyEmail()
  }, [searchParams])

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
            <div className="flex justify-center mb-4">
              {status === 'loading' && (
                <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
              )}
              {status === 'success' && (
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              )}
              {status === 'error' && (
                <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              )}
            </div>
            
            <CardTitle className="text-2xl font-bold">
              {status === 'loading' && 'Verificando Email...'}
              {status === 'success' && '¡Email Verificado!'}
              {status === 'error' && 'Error de Verificación'}
            </CardTitle>
            
            <CardDescription>
              {message}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center">
            {status === 'success' && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Tu cuenta ha sido verificada exitosamente. Ahora puedes iniciar sesión y comenzar a gestionar tus finanzas.
                </p>
                <Button
                  onClick={() => router.push('/login')}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Iniciar Sesión
                </Button>
              </div>
            )}
            
            {status === 'error' && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Hubo un problema al verificar tu cuenta. El enlace puede haber expirado o ser inválido.
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => router.push('/signup')}
                    variant="outline"
                    className="flex-1"
                  >
                    Registrarse de Nuevo
                  </Button>
                  <Button
                    onClick={() => router.push('/login')}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Iniciar Sesión
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}