
"use client"

import * as React from "react"
import { Moon, Sun, Sparkles, Flower2, BookOpen, Terminal, Paintbrush, Wind, Gamepad2 } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const themes = [
    { name: "Light", value: "light", icon: Sun },
    { name: "Dark", value: "dark", icon: Moon },
    { name: "Neon", value: "neon", icon: Sparkles },
    { name: "Pink Blossom", value: "pink-blossom", icon: Flower2 },
    { name: "Classic Mystery", value: "classic-mystery", icon: BookOpen },
    { name: "Hacker Green", value: "hacker-green", icon: Terminal },
    { name: "Playful Light", value: "playful-light", icon: Paintbrush },
    { name: "Zen Minimal", value: "zen-minimal", icon: Wind },
    { name: "Retro Arcade", value: "retro-arcade", icon: Gamepad2 },
];


export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-2 w-64">
        <div className="grid grid-cols-3 gap-2">
            {themes.map((item) => {
                const Icon = item.icon;
                return (
                    <button
                        key={item.value}
                        onClick={() => setTheme(item.value)}
                        className={cn(
                            "flex flex-col items-center justify-center gap-2 rounded-md p-2 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                            theme === item.value && "bg-accent"
                        )}
                    >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                    </button>
                )
            })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
