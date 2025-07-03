import * as React from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/providers/theme-provider"

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg"
  }
>(({ className, variant = "default", size = "default", onClick, ...props }, ref) => {
  const { theme } = useTheme()
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Call the original onClick handler
    if (onClick) {
      onClick(e)
    }
    
    // Remove focus from the button after click to prevent persistent outline
    setTimeout(() => {
      if (e.currentTarget) {
        e.currentTarget.blur()
      }
    }, 100)
  }
  
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium font-mono transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background theme-transition",
        {
          // Enhanced contrast for default buttons
          [theme === 'light' 
            ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg border border-blue-600 shadow-sm font-semibold" 
            : "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg border border-blue-500 font-semibold shadow-sm"
          ]: variant === "default",
          
          [theme === 'light'
            ? "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg border border-red-600 font-semibold"
            : "bg-red-500 text-white hover:bg-red-600 hover:shadow-lg border border-red-500 font-semibold"
          ]: variant === "destructive",
          
          [theme === 'light'
            ? "border-2 border-gray-400 bg-white text-gray-900 hover:bg-gray-50 hover:shadow-md hover:border-gray-500 font-semibold"
            : "border-2 border-gray-400 bg-transparent text-gray-100 hover:bg-gray-700 hover:text-white hover:shadow-md hover:border-gray-300 font-semibold"
          ]: variant === "outline",
          
          [theme === 'light'
            ? "bg-gray-200 text-gray-900 hover:bg-gray-300 hover:shadow-lg font-semibold"
            : "bg-gray-600 text-gray-100 hover:bg-gray-500 hover:shadow-lg font-semibold"
          ]: variant === "secondary",
          
          [theme === 'light'
            ? "hover:bg-gray-100 text-gray-900 hover:text-gray-900"
            : "hover:bg-gray-700 text-gray-200 hover:text-gray-100"
          ]: variant === "ghost",
          
          "underline-offset-4 hover:underline text-primary font-semibold": variant === "link",
        },
        {
          "h-10 py-2 px-4": size === "default",
          "h-9 px-3 rounded-md": size === "sm",
          "h-11 px-8 rounded-md": size === "lg",
        },
        className
      )}
      ref={ref}
      onClick={handleClick}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
