"use client"

import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Unlock, Copy, AlertCircle, CheckCircle, Eye } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { ImageUpload } from './image-upload'
import { ImageSteganography } from '@/lib/steganography'
import { decryptData } from '@/lib/encryption'

export function DecodeTab() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [password, setPassword] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [decodedMessage, setDecodedMessage] = useState('')
  const [isEncrypted, setIsEncrypted] = useState(false)
  const [encryptionData, setEncryptionData] = useState<{ iv: string; salt: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(false)

  const getSteganography = useCallback(() => {
    if (typeof window === 'undefined') return null
    return new ImageSteganography()
  }, [])

  const validateInputs = () => {
    // Clear previous errors
    setError(null)

    // Validate image
    if (!selectedImage) {
      setError('Please select an image file to decode')
      return false
    }

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/bmp', 'image/gif']
    if (!allowedTypes.includes(selectedImage.type)) {
      setError('Please select a valid image file (PNG, JPG, JPEG, BMP, or GIF)')
      return false
    }

    // Validate file size (max 50MB for practical purposes)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (selectedImage.size > maxSize) {
      setError('Image file is too large. Please select an image smaller than 50MB')
      return false
    }

    return true
  }

  const handleDecode = async () => {
    if (!validateInputs()) {
      return
    }

    const steganography = getSteganography()
    if (!steganography) {
      setError('Steganography not available in this environment')
      return
    }

    setIsProcessing(true)
    setError(null)
    setDecodedMessage('') // Clear previous message

    try {
      const decoded = await steganography.decodeMessage(selectedImage!)
      
      if (decoded.isEncrypted) {
        setIsEncrypted(true)
        setEncryptionData(decoded.encryptionData || null)
        
        if (!password.trim()) {
          setError('🔐 This message is encrypted. Please enter the password to decrypt it.')
          setIsProcessing(false)
          return
        }

        if (password.trim().length < 3) {
          setError('⚠️ Password seems too short. Please check your password and try again.')
          setIsProcessing(false)
          return
        }

        if (!decoded.encryptionData) {
          setError('Invalid encryption data found in image')
          setIsProcessing(false)
          return
        }

        try {
          const decryptedMessage = decryptData(
            decoded.message,
            password,
            decoded.encryptionData.iv,
            decoded.encryptionData.salt
          )
          
          // Additional validation for successful decryption
          if (!decryptedMessage || decryptedMessage.trim().length === 0) {
            setError('Incorrect password. Please try again with the correct password.')
            setDecodedMessage('') // Clear any previous message
            setIsProcessing(false)
            return
          }
          
          setDecodedMessage(decryptedMessage)
        } catch (decryptError) {
          // Handle any decryption errors (usually incorrect password)
          const errorMessage = decryptError instanceof Error ? decryptError.message : 'Decryption failed'
          if (errorMessage.includes('incorrect password') || errorMessage.includes('Decryption failed')) {
            setError('❌ Incorrect password. Please verify your password and try again.')
          } else {
            setError(`Decryption error: ${errorMessage}`)
          }
          setDecodedMessage('') // Clear any previous message
          setIsProcessing(false)
          return
        }
      } else {
        setIsEncrypted(false)
        setEncryptionData(null)
        setDecodedMessage(decoded.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to decode message from image')
      setDecodedMessage('') // Clear any previous message
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    // Clear error when user starts typing a new password
    if (error && (error.includes('password') || error.includes('Incorrect'))) {
      setError(null)
    }
  }

  const handleCopyMessage = async () => {
    if (decodedMessage) {
      await navigator.clipboard.writeText(decodedMessage)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const reset = () => {
    setSelectedImage(null)
    setPassword('')
    setDecodedMessage('')
    setIsEncrypted(false)
    setEncryptionData(null)
    setError(null)
    setShowPassword(false)
    setCopied(false)
  }

  return (
    <div className="space-y-8">
      {/* Instructions Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card className="cyber-card bg-gradient-to-r from-secondary/5 to-primary/5 border-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Unlock className="h-6 w-6 text-primary" />
              How to Decode Hidden Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid md:grid-cols-2 gap-6 text-base">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="font-bold text-primary text-lg">1.</span>
                  <div>
                    <span className="font-semibold">Upload Image:</span>
                    <span className="text-muted-foreground block mt-1"> Select an image that contains a secret message</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-primary text-lg">2.</span>
                  <div>
                    <span className="font-semibold">Extract Data:</span>
                    <span className="text-muted-foreground block mt-1"> Click &quot;Decode Message&quot; to reveal hidden content</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="font-bold text-primary text-lg">3.</span>
                  <div>
                    <span className="font-semibold">Enter Password:</span>
                    <span className="text-muted-foreground block mt-1"> If encrypted, you&apos;ll be prompted for the password</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-primary text-lg">4.</span>
                  <div>
                    <span className="font-semibold">Access Secret:</span>
                    <span className="text-muted-foreground block mt-1"> Copy the revealed message or save it securely</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-secondary/10 rounded-xl border border-secondary/20 cyber-card">
              <div className="flex items-center gap-3">
                <span className="text-xl">⚡</span>
                <span className="font-medium text-base">Fast: Decoding happens instantly - no server uploads required!</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="cyber-card border-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Eye className="h-6 w-6 text-primary" />
              Select Encoded Image
            </CardTitle>
            <CardDescription className="text-base">
              Choose an image that contains a hidden message
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ImageUpload
              onImageSelect={setSelectedImage}
              selectedImage={selectedImage}
            />
          </CardContent>
        </Card>
      </motion.div>

      {(isEncrypted || encryptionData) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glow-border border-secondary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Unlock className="h-5 w-5 text-secondary" />
                Encryption Password
              </CardTitle>
              <CardDescription>
                This image contains an encrypted message
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter decryption password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="font-mono pr-10"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 shadow-lg"
        >
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
          <span className="text-sm text-destructive font-medium">{error}</span>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex gap-4"
      >
        <Button
          onClick={handleDecode}
          disabled={!selectedImage || isProcessing}
          className="flex-1"
          size="lg"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Decoding...
            </div>
          ) : (
            'Decode Message'
          )}
        </Button>

        <Button
          variant="outline"
          onClick={reset}
          size="lg"
        >
          Reset
        </Button>
      </motion.div>

      {decodedMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card className="glow-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <CheckCircle className="h-5 w-5" />
                Message Decoded Successfully!
              </CardTitle>
              <CardDescription>
                {isEncrypted ? 'Encrypted message decrypted' : 'Plain text message found'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Textarea
                  value={decodedMessage}
                  readOnly
                  className="min-h-[120px] font-mono bg-muted/50"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleCopyMessage}
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{decodedMessage.length} characters</span>
                {isEncrypted && (
                  <span className="flex items-center gap-1">
                    <Unlock className="h-3 w-3" />
                    Encrypted with AES-256
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
