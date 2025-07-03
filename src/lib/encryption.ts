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
  const key = CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(salt), {
    keySize: 256/32,
    iterations: 10000
  })
  
  const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
    iv: CryptoJS.enc.Hex.parse(iv),
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  })
  
  return decrypted.toString(CryptoJS.enc.Utf8)
}
