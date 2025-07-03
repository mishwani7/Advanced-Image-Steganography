export interface SteganographyOptions {
  message: string
  isEncrypted: boolean
  encryptionData?: {
    iv: string
    salt: string
  }
}

export interface DecodedData {
  message: string
  isEncrypted: boolean
  encryptionData?: {
    iv: string
    salt: string
  }
}

export class ImageSteganography {
  private canvas: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null

  constructor() {
    // Initialize canvas only in browser environment
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      this.canvas = document.createElement('canvas')
      this.ctx = this.canvas.getContext('2d')!
    }
  }

  private ensureCanvas(): void {
    if (!this.canvas || !this.ctx) {
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        throw new Error('ImageSteganography requires a browser environment')
      }
      this.canvas = document.createElement('canvas')
      this.ctx = this.canvas.getContext('2d')!
    }
  }

  async encodeMessage(imageFile: File, options: SteganographyOptions): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        try {
          this.ensureCanvas()
          this.canvas!.width = img.width
          this.canvas!.height = img.height
          this.ctx!.drawImage(img, 0, 0)

          const imageData = this.ctx!.getImageData(0, 0, img.width, img.height)
          const data = imageData.data

          // Create metadata header
          const metadata = {
            isEncrypted: options.isEncrypted,
            encryptionData: options.encryptionData,
            messageLength: options.message.length
          }
          
          const metadataString = JSON.stringify(metadata)
          const fullMessage = metadataString + '|||' + options.message
          
          // Convert message to binary
          const binaryMessage = this.stringToBinary(fullMessage) + '1111111111111110' // End marker
          
          if (binaryMessage.length > data.length / 4) {
            reject(new Error('Message too long for this image'))
            return
          }

          // Encode message into LSBs of red channel
          for (let i = 0; i < binaryMessage.length; i++) {
            const pixelIndex = i * 4 // Red channel of each pixel
            const bit = parseInt(binaryMessage[i])
            data[pixelIndex] = (data[pixelIndex] & 0xFE) | bit
          }

          this.ctx!.putImageData(imageData, 0, 0)
          
          this.canvas!.toBlob((blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Failed to create blob'))
            }
          }, 'image/png')
        } catch (error) {
          reject(error)
        }
      }
      
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(imageFile)
    })
  }

  async decodeMessage(imageFile: File): Promise<DecodedData> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        try {
          this.ensureCanvas()
          this.canvas!.width = img.width
          this.canvas!.height = img.height
          this.ctx!.drawImage(img, 0, 0)

          const imageData = this.ctx!.getImageData(0, 0, img.width, img.height)
          const data = imageData.data

          // Extract binary message from LSBs
          let binaryMessage = ''
          const endMarker = '1111111111111110'
          
          for (let i = 0; i < data.length; i += 4) {
            const bit = data[i] & 1
            binaryMessage += bit
            
            // Check for end marker
            if (binaryMessage.endsWith(endMarker)) {
              binaryMessage = binaryMessage.slice(0, -endMarker.length)
              break
            }
          }

          if (!binaryMessage) {
            reject(new Error('No hidden message found'))
            return
          }

          const fullMessage = this.binaryToString(binaryMessage)
          const separatorIndex = fullMessage.indexOf('|||')
          
          if (separatorIndex === -1) {
            reject(new Error('Invalid message format'))
            return
          }

          const metadataString = fullMessage.substring(0, separatorIndex)
          const message = fullMessage.substring(separatorIndex + 3)
          
          try {
            const metadata = JSON.parse(metadataString)
            resolve({
              message,
              isEncrypted: metadata.isEncrypted,
              encryptionData: metadata.encryptionData
            })
          } catch {
            reject(new Error('Invalid metadata format'))
          }
        } catch (error) {
          reject(error)
        }
      }
      
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(imageFile)
    })
  }

  private stringToBinary(str: string): string {
    return str.split('').map(char => 
      char.charCodeAt(0).toString(2).padStart(8, '0')
    ).join('')
  }

  private binaryToString(binary: string): string {
    const bytes = binary.match(/.{8}/g) || []
    return bytes.map(byte => String.fromCharCode(parseInt(byte, 2))).join('')
  }

  getImagePreview(imageFile: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        this.ensureCanvas()
        this.canvas!.width = img.width
        this.canvas!.height = img.height
        this.ctx!.drawImage(img, 0, 0)
        resolve(this.canvas!.toDataURL())
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(imageFile)
    })
  }
}
