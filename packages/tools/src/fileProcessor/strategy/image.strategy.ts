import { CompressionStrategy } from '../types'
import Compressor from 'compressorjs'

export interface ImageCompressOptions extends Compressor.Options {
  /**
   * 图片清晰度
   *
   * 通常情况下不需要动该参数，因为大部分情况下这个参数对大小的影响不大
   *
   * 如果感觉压缩效果不明显可以调整该数值
   */
  quality?: number

  /**
   * 缩放策略
   *
   * 根据size大小，返回一个比例，缩放时会根据这个比例进行缩放
   *
   * 例如 width height都是100px的图片，若缩放比例为0.9 则返回width height都是90px
   *
   * @param size 单位是B
   */
  scaleStrategy?: (size: number) => number
}

export interface ImageCompressResult {
  size: number
  /**
   * 压缩结果，可直接使用
   */
  result: string | ArrayBuffer | null

  file: File | Blob
}

export interface ElementWH {
  width: number
  height: number
}
export class ImageCompressionStrategy
  implements CompressionStrategy<ImageCompressOptions, Promise<ImageCompressResult>>
{
  async compress(file: File, options?: ImageCompressOptions) {
    const { quality = 0.8, scaleStrategy, ...resetOptions } = options || {}
    // 保留两位小数
    const fileSize = file.size
    let width: number
    let height: number

    // 需要压缩策略
    if (scaleStrategy) {
      const imageProps = await this.getImageWH(file)
      const scale = scaleStrategy(fileSize)
      const resizeWH = this.resize(imageProps, scale)

      width = resizeWH.width
      height = resizeWH.height
    }

    return new Promise<ImageCompressResult>((resolve, reject) => {
      /**
       * 压缩库文档
       * https://github.com/fengyuanchen/compressorjs
       */
      const compressor = new Compressor(file, {
        quality,
        convertSize: 2000,
        width,
        height,
        success(result) {
          const fileReader = new FileReader()
          fileReader.onload = () => {
            resolve({
              size: result.size,
              result: fileReader.result,
              file: result,
            })
          }
          fileReader.readAsDataURL(result)
        },
        error(error) {
          reject(error)
        },
        ...resetOptions,
      })
    })
  }

  /**
   * 获取图片宽高
   */
  async getImageWH(file: File) {
    return new Promise<ElementWH>((resolve) => {
      const fileReader = new FileReader()
      const virtuallyImg = new Image()

      fileReader.onload = (fr) => {
        if (fr.target) {
          virtuallyImg.src = fr.target.result as string
        }
      }

      virtuallyImg.onload = () => {
        const width = virtuallyImg.width
        const height = virtuallyImg.height

        resolve({
          width,
          height,
        })
      }

      fileReader.readAsDataURL(file)
    })
  }

  /**
   * 将宽高按一定比例进行缩放
   */
  resize(elementProps: ElementWH, scale: number): ElementWH {
    const reWidth = elementProps.width * scale
    const reHeight = elementProps.height * scale

    return {
      width: reWidth,
      height: reHeight,
    }
  }
}
