"use client"

import * as React from "react"
import { Moon, Sun, Palette } from "lucide-react"
import { useTheme, useColor } from "@/components/theme-provider"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

export function ModeToggle() {
  const { setTheme } = useTheme()
  const { color, setColor } = useColor();
  const [customColor, setCustomColor] = React.useState(color);

  React.useEffect(() => {
    setCustomColor(color);
  }, [color]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value);
  }

  const applyColor = () => {
    setColor(customColor);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Custom Color</DropdownMenuLabel>
        <div className="px-2 py-1.5">
           <div className="relative flex items-center">
            <Palette className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input 
                id="custom-bg-color"
                type="text" 
                value={customColor} 
                onChange={handleColorChange}
                onBlur={applyColor}
                className="pl-9 h-9"
                placeholder="e.g. #000000"
            />
            <input 
                type="color" 
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  setColor(e.target.value);
                }}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-1 rounded-md cursor-pointer bg-transparent border-none appearance-none"
            />
        </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
