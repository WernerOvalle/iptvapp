"use client"
import { ThemeProvider } from "next-themes"
import { ChannelList } from "@/components/custom/channel-list"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import userData from '@/data/users.json'
import { LogOut } from "lucide-react"

// Helper function to generate a session token
const generateSessionToken = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [currentUser, setCurrentUser] = useState<{name: string, email: string} | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedSession = localStorage.getItem('userSession')
    if (savedSession) {
      try {
        const userSession = JSON.parse(savedSession)
        const userExists = userData.users.find(user => user.email === userSession.email)
        
        if (userExists) {
          setCurrentUser({
            name: userSession.name,
            email: userSession.email
          })
          setIsLoggedIn(true)
          setShowLoginModal(false)
        } else {
          localStorage.removeItem('userSession')
          setError('Session expired')
        }
      } catch (error) {
        localStorage.removeItem('userSession')
        setError('Invalid session')
      }
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const user = userData.users.find(
        u => u.email === email && u.password === password
      )

      if (user) {
        const userInfo = {
          email: user.email,
          name: user.name,
          sessionToken: generateSessionToken()
        }
        setCurrentUser({
          email: user.email,
          name: user.name
        })
        setIsLoggedIn(true)
        setShowLoginModal(false)
        localStorage.setItem('userSession', JSON.stringify(userInfo))
      } else {
        setError("Credenciales inválidas")
      }
    } catch (err) {
      setError("Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser(null)
    setShowLoginModal(true)
    localStorage.removeItem('userSession')
  }

  if (!mounted) return null

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <main className="container mx-auto p-4 dark:bg-gray-900 min-h-screen">
        <div className="flex flex-col items-center">
          <Image
            src="/logo.png"
            alt="IPTV App Logo"
            width={150}
            height={150}
            className="rounded-full object-cover"
          />
          <div className="flex justify-between w-full mb-1">
            <ThemeToggle />
            {isLoggedIn && (
              <Button variant="outline" onClick={handleLogout} className="p-2 md:px-4">
                <LogOut className="h-5 w-5 md:hidden" />
                <span className="hidden md:inline">Cerrar Sesión</span>
              </Button>
            )}
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Bienvenido a IPTV Buster App</h1>
          {currentUser && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Bienvenido, {currentUser.name}
            </p>
          )}
        </div>

        <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Iniciar Sesión</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Correo electrónico
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Ingrese su correo electrónico"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Contraseña
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Ingrese su contraseña"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {isLoggedIn ? (
          <ChannelList />
        ) : (
          <div className="text-center mt-8">
            <p>Por favor inicie sesión para ver los canales</p>
          </div>
        )}
      </main>
    </ThemeProvider>
  )
}