import { FileType, CompressionStrategy } from './types'
import { ImageCompressionStrategy } from './strategy/image.strategy'
/**
 * 文件处理器
 */
export class FileProcessorFactory {
  static createFileStrategy(fileType: FileType) {
    switch (fileType) {
      case FileType.Image:
        return new ImageCompressionStrategy()

      default:
        throw `不支持的文件类型 -> ${fileType}`
    }
  }
}
