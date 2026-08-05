import { ImageProps, Modal } from 'antd'
import { Button, Image, Space } from '@linkseeks/ui'
import React from 'react'
import './index.less'
import { EyeFillIcon, TrashFillIcon } from '@linkseeks/icons'
import { useToggle } from '@linkseeks/hooks'
import { useWebIntl } from '@apps/locales'
import ImageBox from '../ImageBox'

export interface StandardImageProps extends ImageProps {
  handleDelete?(image: string): void
}

const StandardImage = (props: StandardImageProps) => {
  const { preview, width, height, style, handleDelete, ...imageProps } = props
  const translate = useWebIntl()
  const [visible, toggle] = useToggle(false)
  const wrapperStyle = {
    width,
    height,
    ...style,
  }

  const handlePreview = () => {
    toggle()
  }

  const handleSubmitDelete = () => {
    handleDelete && handleDelete(props.src || '')
  }

  const getFileTypeFromExtension = (fileName) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff']
    const videoExtensions = ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm']

    const extension = fileName.split('.').pop().toLowerCase()

    if (imageExtensions.includes(extension)) {
      return 'image'
    } else if (videoExtensions.includes(extension)) {
      return 'video'
    } else {
      return 'unknown'
    }
  }

  const renderMedia = (fill = false) => {
    if (getFileTypeFromExtension(imageProps.src) === 'video') {
      return (
        <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center' }}>
          <video autoPlay loop={false} muted playsInline width={'100%'} src={imageProps.src} />
        </div>
      )
    }
    if (fill) {
      return <ImageBox preview={false} width={'100%'} height={'100%'} {...imageProps} />
    } else {
      return <Image {...imageProps} preview={false} width={'100%'} />
    }
  }

  return (
    <div className="standard-image-container" style={wrapperStyle}>
      {renderMedia()}
      <div className="standard-image-mask">
        <Space align="center">
          {handleDelete && (
            <div onClick={handleSubmitDelete} className="standard-image-mask-btn">
              <TrashFillIcon size={20} color="#fff" />
            </div>
          )}
          {preview && (
            <div onClick={handlePreview} className="standard-image-mask-btn">
              <EyeFillIcon size={20} color="#fff" />
            </div>
          )}
        </Space>
      </div>
      <Modal title={translate('web.common.preview')} open={visible} onCancel={toggle} width={600} footer={null}>
        {renderMedia()}
      </Modal>
    </div>
  )
}

export default StandardImage
