"use client"

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Eye, Download, AlertCircle } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Switch } from './ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { ImageUpload } from './image-upload'
import { ImageSteganography } from '@/lib/steganography'
import { encryptData } from '@/lib/encryption'
import { downloadFile } from '@/lib/utils'

export function EncodeTab() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const [password, setPassword] = useState('')
  const [useEncryption, setUseEncryption] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [encodedImage, setEncodedImage] = useState<Blob | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const getSteganography = useCallback(() => {
    if (typeof window === 'undefined') return null
    return new ImageSteganography()
  }, [])

  const validateInputs = () => {
    // Clear previous errors
    setError(null)

    // Validate image
    if (!selectedImage) {
      setError('Please select an image file')
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

    // Validate message
    if (!message.trim()) {
      setError('Please enter a message to hide')
      return false
    }

    // Validate message length (basic capacity check)
    const maxMessageLength = Math.floor(selectedImage.size / 8) // Rough estimate: 1 bit per byte
    if (message.length > maxMessageLength) {
      setError(`Message is too long for this image. Maximum capacity is approximately ${maxMessageLength} characters`)
      return false
    }

    // Validate encryption password if encryption is enabled
    if (useEncryption) {
      if (!password.trim()) {
        setError('Please enter a password for encryption')
        return false
      }
      
      if (password.length < 6) {
        setError('Password must be at least 6 characters long')
        return false
      }

      // Check for password strength
      const hasUpperCase = /[A-Z]/.test(password)
      const hasLowerCase = /[a-z]/.test(password)
      const hasNumbers = /\d/.test(password)
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
      
      const strengthCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length
      
      if (strengthCount < 2) {
        setError('Password should contain at least 2 of: uppercase letters, lowercase letters, numbers, special characters')
        return false
      }
    }

    return true
  }

  const handleEncode = async () => {
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

    try {
      let finalMessage = message
      let encryptionData = undefined

      if (useEncryption && password) {
        const encrypted = encryptData(message, password)
        finalMessage = encrypted.encryptedData
        encryptionData = {
          iv: encrypted.iv,
          salt: encrypted.salt
        }
      }

      const encodedBlob = await steganography.encodeMessage(selectedImage, {
        message: finalMessage,
        isEncrypted: useEncryption,
        encryptionData
      })

      setEncodedImage(encodedBlob)
      const url = URL.createObjectURL(encodedBlob)
      setPreviewUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to encode message')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (encodedImage) {
      const filename = `encoded_${selectedImage?.name || 'image.png'}`
      downloadFile(encodedImage, filename)
    }
  }

  const reset = () => {
    setSelectedImage(null)
    setMessage('')
    setPassword('')
    setUseEncryption(false)
    setEncodedImage(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    setError(null)
  }

  return (
    <div className="space-y-8">
      {/* Instructions Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card className="cyber-card bg-gradient-to-r from-primary/5 to-secondary/5 border-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Lock className="h-6 w-6 text-primary" />
              How to Encode Secret Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid md:grid-cols-2 gap-6 text-base">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="font-bold text-primary text-lg">1.</span>
                  <div>
                    <span className="font-semibold">Choose Your Image:</span>
                    <span className="text-muted-foreground block mt-1"> Upload PNG, JPG, JPEG, BMP, or GIF. Larger images = more capacity!</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-primary text-lg">2.</span>
                  <div>
                    <span className="font-semibold">Write Your Secret:</span>
                    <span className="text-muted-foreground block mt-1"> Type any message - text, passwords, or data</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="font-bold text-primary text-lg">3.</span>
                  <div>
                    <span className="font-semibold">Add Security:</span>
                    <span className="text-muted-foreground block mt-1"> Toggle encryption ON and set a strong password</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-primary text-lg">4.</span>
                  <div>
                    <span className="font-semibold">Generate & Download:</span>
                    <span className="text-muted-foreground block mt-1"> Get a visually identical image with your hidden message</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-primary/10 rounded-xl border border-primary/20 cyber-card">
              <div className="flex items-center gap-3">
                <span className="text-xl">💡</span>
                <span className="font-medium text-base">Tip: The output image looks exactly the same but secretly contains your data!</span>
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
              Select Image
            </CardTitle>
            <CardDescription className="text-base">
              Choose an image to hide your secret message in
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="cyber-card border-2 smooth-height-transition">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Secret Message</CardTitle>
            <CardDescription className="text-base">
              Enter the text you want to hide in the image
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-0">
            <Textarea
              placeholder="Type your secret message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px] font-mono"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={useEncryption}
                  onCheckedChange={setUseEncryption}
                />
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Enable Encryption</span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {message.length} characters
              </span>
            </div>

            <AnimatePresence mode="wait">
              {useEncryption && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="space-y-2 overflow-hidden"
                >
                  <Input
                    type="password"
                    placeholder="Enter encryption password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    This password will be required to decode the message
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 border border-destructive/20"
        >
          <AlertCircle className="h-4 w-4 text-destructive" />
          <span className="text-sm text-destructive">{error}</span>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex gap-4"
      >
        <Button
          onClick={handleEncode}
          disabled={!selectedImage || !message.trim() || isProcessing}
          className="flex-1"
          size="lg"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Encoding...
            </div>
          ) : (
            'Encode Message'
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

      {encodedImage && previewUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card className="glow-border">
            <CardHeader>
              <CardTitle className="text-success">Encoding Complete!</CardTitle>
              <CardDescription>
                Your message has been successfully hidden in the image
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative rounded-lg overflow-hidden border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Encoded image"
                  className="w-full max-h-64 object-cover"
                />
              </div>
              
              <Button
                onClick={handleDownload}
                className="w-full"
                size="lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Encoded Image
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
