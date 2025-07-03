import * as React from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/providers/theme-provider"

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg"
  }
>(({ className, variant = "default", size = "default", ...props }, ref) => {
  const { theme } = useTheme()
  
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium font-mono transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background theme-transition",
        {
          // Enhanced contrast for default buttons
          [theme === 'light' 
            ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg border border-primary shadow-sm" 
            : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg border border-primary font-semibold shadow-sm"
          ]: variant === "default",
          
          [theme === 'light'
            ? "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg"
            : "bg-red-500 text-white hover:bg-red-600 hover:shadow-lg"
          ]: variant === "destructive",
          
          [theme === 'light'
            ? "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 hover:shadow-md"
            : "border border-gray-600 bg-transparent text-gray-100 hover:bg-gray-800 hover:text-white hover:shadow-md"
          ]: variant === "outline",
          
          [theme === 'light'
            ? "bg-gray-100 text-gray-900 hover:bg-gray-200 hover:shadow-lg"
            : "bg-gray-700 text-gray-100 hover:bg-gray-600 hover:shadow-lg"
          ]: variant === "secondary",
          
          "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
          "underline-offset-4 hover:underline text-primary": variant === "link",
        },
        {
          "h-10 py-2 px-4": size === "default",
          "h-9 px-3 rounded-md": size === "sm",
          "h-11 px-8 rounded-md": size === "lg",
        },
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
