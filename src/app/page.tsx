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
import { LogOut } from "lucide-react"
import { supabase } from '@/lib/supabase'


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
  const [currentUser, setCurrentUser] = useState<{ name: string, email: string } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setCurrentUser({
          name: session.user.email?.split('@')[0] || '',
          email: session.user.email || ''
        })
        setIsLoggedIn(true)
        setShowLoginModal(false)
      } else {
        setIsLoggedIn(false)
        setCurrentUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      setShowLoginModal(false)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setShowLoginModal(true)
  }

  if (!mounted) return null

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <main className="container mx-auto p-4 dark:bg-gray-900 min-h-screen">
        <div className="flex flex-col items-center">
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
          <div className="flex items-center justify-center gap-4">
            <Image
              src="/logo.png"
              alt="IPTV App Logo"
              width={50}
              height={50}
              className="rounded-full object-cover"
            />
            <h1 className="text-3xl font-bold mb-4">Bienvenido a IPTV Buster App</h1>
          </div>
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
          <div className="text-center mt-8 space-y-4">
            <p>Por favor inicie sesión para ver los canales</p>
            <Button
              variant="default"
              onClick={() => setShowLoginModal(true)}
              className="px-6 py-2"
            >
              Iniciar Sesión
            </Button>
          </div>
        )}
      </main>
    </ThemeProvider>
  )
}