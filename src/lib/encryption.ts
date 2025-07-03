import CryptoJS from 'crypto-js'

export interface EncryptionResult {
  encryptedData: string
  iv: string
  salt: string
}

export function encryptData(data: string, password: string): EncryptionResult {
  const salt = CryptoJS.lib.WordArray.random(256/8)
  const key = CryptoJS.PBKDF2(password, salt, {
    keySize: 256/32,
    iterations: 10000
  })
  
  const iv = CryptoJS.lib.WordArray.random(128/8)
  const encrypted = CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  })
  
  return {
    encryptedData: encrypted.toString(),
    iv: iv.toString(),
    salt: salt.toString()
  }
}

export function decryptData(
  encryptedData: string,
  password: string,
  iv: string,
  salt: string
): string {
  try {
    const key = CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(salt), {
      keySize: 256/32,
      iterations: 10000
    })
    
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    })
    
    const result = decrypted.toString(CryptoJS.enc.Utf8)
    
    // Check if decryption was successful
    if (!result || result.length === 0) {
      throw new Error('Decryption failed - incorrect password')
    }
    
    // Additional validation: check if result contains valid UTF-8 characters
    // If password is wrong, the result often contains invalid characters
    try {
      // Try to encode and decode the result to validate UTF-8
      encodeURIComponent(result)
    } catch {
      throw new Error('Decryption failed - incorrect password')
    }
    
    return result
  } catch (error) {
    if (error instanceof Error && error.message.includes('incorrect password')) {
      throw error
    }
    throw new Error('Decryption failed - incorrect password')
  }
}
