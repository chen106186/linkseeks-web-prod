export interface EncryptStrategy {
  encrypt(data: string): string
  decrypt(data: any): any
}
