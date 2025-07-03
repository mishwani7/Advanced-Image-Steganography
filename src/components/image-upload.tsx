"use client"

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Upload, Image as ImageIcon, X, AlertCircle } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  onImageSelect: (file: File) => void
  selectedImage?: File | null
  className?: string
}

export function ImageUpload({ onImageSelect, selectedImage, className }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/bmp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return 'Please select a valid image file (PNG, JPG, JPEG, BMP, or GIF)'
    }

    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return 'Image file is too large. Please select an image smaller than 50MB'
    }

    // Check minimum size (at least 1KB to ensure it's a real image)
    if (file.size < 1024) {
      return 'Image file appears to be corrupted or too small'
    }

    return null
  }

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null)
    
    if (rejectedFiles.length > 0) {
      setError('Invalid file type. Please select PNG, JPG, JPEG, BMP, or GIF images only')
      return
    }

    const file = acceptedFiles[0]
    if (file) {
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        return
      }

      onImageSelect(file)
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)
    }
    setDragActive(false)
  }, [onImageSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.bmp', '.gif']
    },
    multiple: false,
    maxSize: 50 * 1024 * 1024, // 50MB
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDropRejected: () => {
      setError('Invalid file type or size. Please select PNG, JPG, JPEG, BMP, or GIF images under 50MB')
    }
  })

  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview)
    }
    setPreview(null)
    setError(null)
    onImageSelect(null as any)
  }

  React.useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  if (selectedImage && preview) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("relative rounded-lg overflow-hidden border-2 border-primary/20", className)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={preview}
          alt="Selected image"
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-2 right-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={removeImage}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute bottom-2 left-2 text-white">
          <p className="text-xs sm:text-sm font-medium truncate max-w-[200px]">{selectedImage.name}</p>
          <p className="text-xs opacity-75">
            {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={cn(
          "relative cursor-pointer rounded-lg border-2 border-dashed transition-all duration-300",
          isDragActive || dragActive
            ? "border-primary bg-primary/10 scale-105"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5",
          error ? "border-red-500" : "",
          className
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <motion.div
            animate={{
              scale: isDragActive ? 1.1 : 1,
              rotate: isDragActive ? 5 : 0
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {isDragActive ? (
              <Upload className="h-12 w-12 text-primary mb-4" />
            ) : (
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            )}
          </motion.div>
          
          <h3 className="text-lg font-semibold mb-2">
            {isDragActive ? "Drop your image here" : "Upload an image"}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop an image file, or click to browse
          </p>
          
          <p className="text-xs text-muted-foreground">
            Supports PNG, JPG, JPEG, BMP, GIF (max 50MB)
          </p>
        </div>
        
        {(isDragActive || dragActive) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 rounded-lg bg-primary/20 border-2 border-primary"
          />
        )}
      </div>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-red-500 text-sm"
        >
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  )
}
