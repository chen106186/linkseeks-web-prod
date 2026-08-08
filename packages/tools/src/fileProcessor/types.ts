export enum FileType {
  Image = 'image',
}

export interface CompressionStrategy<O, R> {
  // 压缩逻辑
  compress(file: File, options?: O): R
}
