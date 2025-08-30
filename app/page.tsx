"use client"

import Link from "next/link"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ArrowRight, 
  DollarSign, 
  Heart, 
  PieChart, 
  Shield, 
  Users,
  Sparkles,
  Target,
  Globe
} from "lucide-react"

export default function LandingPage() {
  const features = [
    {
      title: "Colaboración en Tiempo Real",
      description: "Ambos pueden ver y gestionar las finanzas del hogar desde cualquier dispositivo, manteniendo transparencia total.",
      icon: <Users className="h-8 w-8 text-blue-500" />
    },
    {
      title: "Control de Gastos Inteligente", 
      description: "Rastrea todos los ingresos y gastos con categorías personalizables y análisis detallados.",
      icon: <DollarSign className="h-8 w-8 text-green-500" />
    },
    {
      title: "Visualización Avanzada",
      description: "Gráficos interactivos y reportes que te ayudan a entender tus patrones de gasto y optimizar tu presupuesto.",
      icon: <PieChart className="h-8 w-8 text-purple-500" />
    },
    {
      title: "Metas Compartidas",
      description: "Establece y monitorea metas financieras juntos, desde el fondo de emergencia hasta las vacaciones soñadas.",
      icon: <Target className="h-8 w-8 text-orange-500" />
    },
    {
      title: "Seguridad Bancaria",
      description: "Tus datos están protegidos con encriptación de nivel bancario y autenticación de dos factores.",
      icon: <Shield className="h-8 w-8 text-red-500" />
    },
    {
      title: "Multi-Currency",
      description: "Soporte para múltiples divisas (COP, USD, EUR, etc.) para parejas con finanzas internacionales.",
      icon: <Globe className="h-8 w-8 text-indigo-500" />
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-red-500" />
            <span className="text-2xl font-bold">Finanzas Pareja</span>
          </div>
          
          <nav className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Iniciar Sesión</Button>
            </Link>
            <Link href="/signup">
              <Button>Registrarse</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-3">
              <Heart className="h-12 w-12 text-red-500" />
              <span className="text-4xl font-bold">Finanzas Pareja</span>
            </div>
          </div>

          <h1 className="text-5xl font-bold mb-6">
            Gestiona tus <span className="text-blue-600">finanzas</span> en{" "}
            <span className="text-purple-600">pareja</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            La plataforma más avanzada diseñada para parejas que quieren 
            tomar control de sus finanzas juntos. 
            Planifica, ahorra y alcanza tus metas financieras como equipo.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-3">
                <Sparkles className="mr-2 h-5 w-5" />
                Comenzar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                <Globe className="mr-2 h-5 w-5" />
                Explorar Características
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Seguridad Bancaria</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Colaborativo</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>Multi-Currency</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Todo lo que necesitan como <span className="text-blue-600">pareja moderna</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Herramientas diseñadas específicamente para la gestión financiera colaborativa 
              con tecnología de vanguardia
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, i) => (
              <Card key={i} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    {feature.icon}
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Construyendo el futuro financiero de las parejas
            </h2>
            <p className="text-xl opacity-90">
              Únete a miles de parejas que ya están transformando sus finanzas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-lg opacity-90">Parejas Activas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">$2.5M+</div>
              <div className="text-lg opacity-90">Dinero Gestionado</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-lg opacity-90">Satisfacción</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">
              ¿Listos para revolucionar sus finanzas?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Únete a la nueva generación de parejas que están construyendo 
              un futuro financiero sólido con tecnología de vanguardia.
            </p>
            
            <Link href="/signup">
              <Button size="lg" className="text-lg px-12 py-3">
                <Heart className="mr-2 h-5 w-5" />
                Crear Cuenta Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <p className="text-sm text-muted-foreground mt-4">
              Comienza en menos de 2 minutos • No se requiere tarjeta de crédito
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Heart className="h-6 w-6 text-red-500" />
              <span className="text-xl font-bold">Finanzas Pareja</span>
            </div>
            <p className="text-muted-foreground text-center">
              © {new Date().getFullYear()} Finanzas Pareja. Construyendo futuros financieros juntos.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}