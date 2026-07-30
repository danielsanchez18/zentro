"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Cambiar tema"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 dark:scale-0 dark:opacity-0 transition-all" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 opacity-0 dark:scale-100 dark:opacity-100 transition-all" />
    </Button>
  )
}
