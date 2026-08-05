import React, { useState, useCallback, useRef, useEffect, ReactNode } from 'react'
import { Modal } from 'antd'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { useIntl } from '@linkseeks/i18n'

export interface ImageCropProps {
  visible: boolean
  imgUrl: string
  handleConfirm: (url: string) => void
  handleWithDraw: () => void
}
interface ICrop {
  aspect?: number
  x?: number
  y?: number
  width?: number
  height?: number
  unit?: 'px' | '%'
}

const pixelRatio = 4

function getResizedCanvas(canvas: any, newWidth: number, newHeight: number) {
  const tmpCanvas = document.createElement('canvas')
  tmpCanvas.width = newWidth
  tmpCanvas.height = newHeight

  const ctx: any = tmpCanvas.getContext('2d')
  ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, newWidth, newHeight)

  return tmpCanvas
}

const ImageCrop: React.FC<ImageCropProps> = (props) => {
  const intl = useIntl()
  const [upImg, setUpImg] = useState('') // 上传的图片url
  const imgRef = useRef(null)
  const previewCanvasRef = useRef(null)
  const [crop, setCrop] = useState<ICrop>({ unit: '%', width: 30, aspect: 1 / 1 })
  const [completedCrop, setCompletedCrop] = useState<ICrop>({})

  const { visible, imgUrl, handleConfirm, handleWithDraw } = props

  // 裁剪后生成url传回父级回调
  const startCrop = (previewCanvas: ReactNode, crop: any) => {
    // console.log(previewCanvas, crop);
    if (!crop || !previewCanvas) {
      return
    }

    const canvas = getResizedCanvas(previewCanvas, crop.width, crop.height)
    // canvas.toBlob(
    //   blob => {
    //     const previewUrl = window.URL.createObjectURL(blob);

    //     window.URL.revokeObjectURL(previewUrl);

    //     handleConfirm(previewUrl);
    //   },
    //   "image/png",
    //   1
    // );
    let url = canvas.toDataURL('image/png', 1) // base64转换
    handleConfirm(url)
  }

  const onLoad = useCallback((img) => {
    imgRef.current = img
  }, [])

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return
    }

    const image: any = imgRef.current
    const canvas: any = previewCanvasRef.current
    const crop: any = completedCrop
    // @ts-ignore
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    const ctx = canvas.getContext('2d')

    canvas.width = crop.width * pixelRatio
    canvas.height = crop.height * pixelRatio

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    ctx.imageSmoothingEnabled = false
    image.setAttribute('crossOrigin', 'Anonymous')
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    )
  }, [completedCrop]) // 监听裁剪参数

  useEffect(() => {
    // console.log(imgUrl);
    setUpImg(imgUrl)
  }, [imgUrl])

  //@ts-ignore
  return (
    <div>
      <Modal
        title={intl.formatMessage({ id: 'components.bianjitupian' })}
        visible={visible}
        onOk={() => startCrop(previewCanvasRef.current, completedCrop)}
        onCancel={handleWithDraw}
        okText={intl.formatMessage({ id: 'components.queding' })}
        cancelText={intl.formatMessage({ id: 'components.quxiao' })}
      >
        <ReactCrop
          src={upImg}
          onImageLoaded={onLoad}
          crop={crop}
          onChange={(c: ICrop) => setCrop(c)}
          onComplete={(c: ICrop) => setCompletedCrop(c)}
          imageStyle={{ textAlign: 'center' }}
          style={{ textAlign: 'center' }}
        />
        <canvas
          ref={previewCanvasRef}
          style={{
            display: 'none',
            width: completedCrop?.width ?? 0,
            height: completedCrop?.height ?? 0,
          }}
        />
      </Modal>
    </div>
  )
}

ImageCrop.defaultProps = {}

export default ImageCrop
