import { PageHeaderWrapper, UploadImage } from '@apps/components'
import { FileProcessorFactory, FileType } from '@linkseeks/tools'
import { Button, Card, Divider, Upload, message } from '@linkseeks/ui'
import { useState } from 'react'

const MAX_SIZE = 1024 * 1024 * 5

export default () => {
  const [img1, setImg1] = useState<any>()
  const [size1, setSize1] = useState(0)
  const [img2, setImg2] = useState<any>()
  const [size2, setSize2] = useState(0)
  const imageFile = FileProcessorFactory.createFileStrategy(FileType.Image)

  const transformSize = (size: number) => {
    return (size / 1024).toFixed(2)
  }

  const handleBeforeUpload = async (files: File) => {
    if (files.size > MAX_SIZE) {
      message.error('图片大小不得超过5M')
      return
    }
    // 原图片宽度
    const { width: originWidth } = await imageFile.getImageWH(files)
    let width = Math.min(originWidth, 1500)

    const originImg = await file2Img(files)
    setImg1(originImg)
    setSize1(Number(transformSize(files.size)))
    const nameSplit = files.name.split('.')
    const fileType = nameSplit[nameSplit.length - 1]
    const result = await imageFile.compress(files, { width })
    const afterImg = await file2Img(result.file as any)
    setImg2(afterImg)
    const tSize = Number(transformSize(result.file.size))
    setSize2(tSize)
  }

  const file2Img = (files: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(files)
      reader.onload = (event) => {
        resolve(event.target?.result)
      }
    })
  }

  const reset = () => {
    setImg1('')
    setImg2('')
    setSize1(0)
    setSize2(0)
  }
  return (
    <PageHeaderWrapper
      title="图片测试"
      extra={
        <Button onClick={reset} type="primary">
          重置所有
        </Button>
      }
    >
      <Card title="上传前图片">
        <Upload beforeUpload={handleBeforeUpload} showUploadList={false}>
          <Button type="primary">点击上传</Button>
        </Upload>
        <div>
          <img src={img1} />
          <p>size为 {size1} KB</p>
        </div>
      </Card>
      <Divider />
      分割线
      <Divider />
      <Divider />
      <Divider />
      <Divider />
      <Divider />
      <Card title="上传后图片">
        <div>
          <img src={img2} />
          <p>size为 {size2} KB</p>
          <p>压缩比例为减少 {((1 - size2 / size1) * 100).toFixed(2)}%</p>
        </div>
      </Card>
    </PageHeaderWrapper>
  )
}
