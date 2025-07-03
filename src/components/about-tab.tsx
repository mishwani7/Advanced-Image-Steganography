"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Search, Lock, Zap, Eye, Download, Unlock, Copy, Globe, History, BookOpen, Cpu, Key, Image as ImageIcon, FileText, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { useTheme } from '@/components/providers/theme-provider'

export function AboutTab() {
  const { theme } = useTheme()
  
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* What is Steganography Section */}
      <motion.div {...fadeInUp}>
        <Card className="cyber-card border-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Shield className="h-7 w-7 text-primary" />
              What is Steganography?
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className={`text-base leading-relaxed ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Steganography is the ancient art of hiding information in plain sight. Unlike encryption which scrambles data, 
              steganography conceals the very existence of secret messages by embedding them within ordinary-looking files like images.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* How Our Technology Works */}
      <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
        <Card className="cyber-card border-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Cpu className="h-6 w-6 text-primary" />
              How Our Technology Works
            </CardTitle>
            <CardDescription className="text-base">A deep dive into the technical implementation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-0">
            {/* LSB Steganography */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                <h4 className="text-lg font-semibold">LSB Steganography</h4>
              </div>
              <p className={`text-sm leading-relaxed ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                We use Least Significant Bit (LSB) substitution - the most reliable steganographic technique. Each pixel 
                in an image has red, green, and blue values from 0-255. By modifying only the last bit of each color channel, 
                we can hide data while keeping visual changes imperceptible (less than 0.4% difference).
              </p>
              <div className={`bg-gradient-to-r ${
                theme === 'light' ? 'from-gray-50 to-gray-100' : 'from-gray-800 to-gray-700'
              } p-4 rounded-lg border font-mono text-sm`}>
                <div className="space-y-1">
                  <div>Original: RGB(254, 162, 89)</div>
                  <div>Modified: RGB(255, 163, 88)</div>
                  <div className="text-primary font-semibold">Human eye: No difference! 🎯</div>
                </div>
              </div>
            </div>

            {/* AES-256 Encryption */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <h4 className="text-lg font-semibold">AES-256 Encryption Layer</h4>
              </div>
              <p className={`text-sm leading-relaxed ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                Before hiding your message, we optionally encrypt it using AES-256 in CBC mode with PBKDF2 key derivation 
                (100,000 iterations). This adds an extra layer of protection - even if someone suspects steganography, 
                they still need your password to decrypt the message.
              </p>
              <div className={`bg-gradient-to-r ${
                theme === 'light' ? 'from-blue-50 to-blue-100' : 'from-blue-900/20 to-blue-800/20'
              } p-4 rounded-lg border`}>
                <div className="text-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Message → Encrypt → Embed → Image</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Image → Extract → Decrypt → Message</span>
                  </div>
                  <div className="text-primary font-semibold">Double protection! 🛡️</div>
                </div>
              </div>
            </div>

            {/* Pro Tip */}
            <div className={`p-4 rounded-lg border-l-4 border-primary ${
              theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/20'
            }`}>
              <div className="flex items-start gap-2">
                <Zap className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h5 className="font-semibold text-primary">Pro Tip:</h5>
                  <p className={`text-sm ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    The capacity of an image depends on its pixel count. A 1920×1080 image can hide approximately 777KB 
                    of data, while maintaining perfect visual fidelity. That&apos;s enough for novels, documents, or even small files!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Advanced Features */}
      <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
        <Card className="cyber-card border-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Key className="h-6 w-6 text-primary" />
              Advanced Features
            </CardTitle>
            <CardDescription className="text-base">Enterprise-grade capabilities in a simple interface</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Military-Grade Security</h4>
                    <p className={`text-sm ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      AES-256 encryption with PBKDF2 key derivation ensures your secrets stay secret.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Eye className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Invisible to Detection</h4>
                    <p className={`text-sm ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      Messages are hidden in the least significant bits of pixels - completely undetectable to the naked eye.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <ImageIcon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Multiple Formats</h4>
                    <p className={`text-sm ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      Support for PNG, JPG, JPEG, BMP, and GIF images of any size. Larger images can hide more data.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Cpu className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Advanced Algorithms</h4>
                    <p className={`text-sm ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      Implements proven LSB (Least Significant Bit) steganography with cryptographic integrity.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Zap className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Real-time Processing</h4>
                    <p className={`text-sm ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      Fast encoding and decoding - no server uploads required. Everything happens in your browser.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FileText className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Metadata Preservation</h4>
                    <p className={`text-sm ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      Original image properties and quality are maintained while hiding your secret data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Real-World Applications */}
      <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
        <Card className="cyber-card border-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Users className="h-6 w-6 text-primary" />
              Real-World Applications
            </CardTitle>
            <CardDescription className="text-base">Where steganography makes a difference</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🕵️</span>
                  <span>Secure communication in sensitive environments</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">📝</span>
                  <span>Hidden backup of important passwords or keys</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎨</span>
                  <span>Digital watermarking for copyright protection</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔐</span>
                  <span>Covert file transfer without raising suspicion</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">📸</span>
                  <span>Adding metadata that survives image sharing</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎯</span>
                  <span>Educational demonstrations of cryptography</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* A Brief History */}
      <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
        <Card className="cyber-card border-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <History className="h-6 w-6 text-primary" />
              A Brief History
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className={`text-sm leading-relaxed ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              Steganography dates back to 440 BC when Histiaeus tattooed a message on his slave&apos;s scalp, let the hair grow back, 
              and sent him as a messenger. During WWII, spies used invisible ink and microdots.
            </p>
            <br />
            <p className={`text-sm leading-relaxed ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              Today&apos;s digital steganography leverages the complexity of digital media files. Our implementation follows modern 
              cryptographic standards while maintaining the time-tested principle of security through obscurity, backed by mathematics.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
