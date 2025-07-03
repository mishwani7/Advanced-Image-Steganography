"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Moon, Sun, Github, Info } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Button } from './ui/button'
import { EncodeTab } from './encode-tab'
import { DecodeTab } from './decode-tab'
import { AboutTab } from './about-tab'
import { useTheme } from '@/components/providers/theme-provider'

export function SteganographyApp() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }

  return (
    <div className={`min-h-screen theme-transition futuristic-grid ${
      theme === 'light' ? 'bg-white text-gray-900' : 'bg-gradient-to-br from-background via-background to-background/80'
    }`} style={theme === 'light' ? { backgroundColor: 'white', color: '#111827' } : {}}>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-primary/3 rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-20 theme-transition backdrop-blur-xl ${
        theme === 'light' 
          ? 'border-b border-gray-200 bg-white/70 backdrop-saturate-150 shadow-sm' 
          : 'border-b border-border/50 bg-card/60 backdrop-saturate-150 shadow-sm'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6">
          <div className="flex items-center justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 flex-1"
            >
              <div className="relative flex-shrink-0">
                <Shield className="h-6 w-6 sm:h-7 sm:w-7 lg:h-9 lg:w-9 text-primary drop-shadow-lg" />
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className={`font-bold ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                } text-xl sm:text-2xl tracking-tight`}>
                  <span className="hidden sm:inline">Advanced </span>Image Steganography
                </h1>
                <p className={`text-sm sm:text-base hidden sm:block mt-1 ${
                  theme === 'light' ? 'text-gray-600' : 'text-muted-foreground'
                }`}>
                  Conceal. Encrypt. Reveal.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="w-8 h-8 sm:w-10 sm:h-10 p-0 theme-transition cyber-card border-2"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </Button>
              
              <a
                href="https://github.com/mishwani7/Advanced-Image-Steganography"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 p-0 theme-transition cyber-card border-2 rounded-md transition-all duration-300 ${
                  theme === 'light'
                    ? 'border-gray-400 bg-white text-gray-900 hover:bg-gray-50 hover:shadow-md hover:border-gray-500'
                    : 'border-gray-400 bg-transparent text-gray-100 hover:bg-gray-700 hover:text-white hover:shadow-md hover:border-gray-300'
                }`}
                title="View on GitHub"
                onClick={(e) => {
                  // Remove focus after click
                  setTimeout(() => {
                    if (e.currentTarget) {
                      e.currentTarget.blur()
                    }
                  }, 100)
                }}
              >
                <Github className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            <Tabs defaultValue="encode" className="space-y-6 sm:space-y-8 lg:space-y-10">
              <div className="flex justify-center mb-6 sm:mb-8">
                <TabsList className={`grid w-full max-w-2xl grid-cols-3 cyber-card p-1 sm:p-2 ${
                  theme === 'light' 
                    ? 'bg-white/80 border border-gray-200' 
                    : 'bg-card/50'
                }`}>
                <TabsTrigger
                  value="encode"
                  className="rounded-lg py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base font-medium transition-all duration-300"
                >
                  Encode
                </TabsTrigger>
                <TabsTrigger
                  value="decode"
                  className="rounded-lg py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base font-medium transition-all duration-300"
                >
                  Decode
                </TabsTrigger>
                <TabsTrigger
                  value="about"
                  className="rounded-lg py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base font-medium transition-all duration-300"
                >
                  About
                </TabsTrigger>
                </TabsList>
              </div>

              <div className="w-full pb-16 sm:pb-20">
                <TabsContent value="encode" className="space-y-6 sm:space-y-8 mt-0">
                  <EncodeTab />
                </TabsContent>

                <TabsContent value="decode" className="space-y-6 sm:space-y-8 mt-0">
                  <DecodeTab />
                </TabsContent>

                <TabsContent value="about" className="space-y-6 sm:space-y-8 mt-0">
                  <AboutTab />
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`relative z-10 mt-8 lg:mt-12 theme-transition border-t-2 ${
        theme === 'light' 
          ? 'border-t-gray-300 bg-gray-50/80' 
          : 'border-t-border bg-card/30'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className={`text-center ${
            theme === 'light' ? 'text-gray-600' : 'text-muted-foreground'
          }`}>
            <p className="text-sm sm:text-base font-medium">
              Built with <span className="heartbeat">💙</span> for <span className="rotate-slow">🌍</span> by Abu Zar Mishwani
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
