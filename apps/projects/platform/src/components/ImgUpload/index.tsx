import { useState, useImperativeHandle, forwardRef } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Upload, message, UploadProps, Modal, Space } from 'antd'
import styles from './index.less'
import { useIntl } from '@linkseeks/i18n'
export interface IProps extends Omit<UploadProps, 'onChange'> {
  maxSize?: number // 图片大小(默认单位：MB)
  fileType?: Array<'image/jpeg' | 'image/png' | 'image/jpg' | 'image/gif'> // 图片类型
  unit?: 'MB' | 'KB' // 图片大小单位
  onChange?: (imgData: string[] | string, fileList?: any[]) => void // 结果回调
  tips?: string | boolean // 上传提示
  disabled?: boolean // 是否禁用
  imgSizeText?: string // 图片尺寸文本提示
  urlKey?: string // 接口相应数据图片url对应的字段
}

export interface imgUploadRefProps {
  setData: (x: string[]) => void // 设置图片数据
}

/**
 * 图片上传
 * @param {IProps} props
 * @param ref
 *  * props 参数说明：
 * + maxCount {number} - 图片数量, 默认 1
 * + maxSize {number} - 图片大小, 默认 10
 * + unit {'MB' | 'KB'} - 图片大小单位
 * + fileType - 图片类型, 默认 ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
 * + onChange - 结果回调
 * + tips {string} - 提示语
 * + disabled {boolean} - 是否禁用
 * + imgSizeText {string} - 图片尺寸文本提示
 * + urlKey {string} - 接口相应数据图片url对应的字段
 * @returns
 */
const ImgUpload = forwardRef((props: IProps, ref: any) => {
  const {
    maxCount = 1, // 图片数量
    maxSize = 10, // 图片大小(单位：M)
    imgSizeText = '???', // 图片尺寸
    fileType = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'], // 图片类型
    unit = 'MB',
    onChange,
    tips = true,
    disabled = false,
    urlKey,
    ...rest
  } = props
  const intl = useIntl()
  const [fileList, setFileList] = useState<any[]>([])
  const [showImage, setShowImage] = useState<boolean>(false)
  const [previewImage, setPreviewImage] = useState<string>()

  useImperativeHandle(ref, () => ({
    setData(imgs: string[]) {
      if (imgs) {
        const newFileList = imgs.map((item, index) => {
          return {
            uid: `uid${index}`,
            name: 'image.png',
            status: 'done',
            url: item,
          }
        })
        // 直接走一次回调，使值可以set进表单
        handleChange({ file: { status: 'success' }, fileList: newFileList })
        // setFileList(newFileList)
      }
    },
  }))

  // 图片上传限制验证
  const beforeUpload = (file: any) => {
    let { type, size, name } = file

    let fileTypeOutcome = fileType.includes(type)
    let fileTypeTips = fileType.map((item) => item.replace('image/', '').toLocaleUpperCase()).join('/')

    let fileSizeOutcome = unit === 'MB' ? size / 1024 / 1024 <= maxSize : size / 1024 <= maxSize

    // 图片类型校验
    if (!fileTypeOutcome) {
      message.error(
        `${intl.formatMessage({ id: 'components.jinzhichishangchuan' })} ${fileTypeTips} ${intl.formatMessage({
          id: 'components.leixing',
        })}`,
      )
    }
    // 图片大小校验
    if (!fileSizeOutcome) {
      message.error(`${intl.formatMessage({ id: 'components.shangchuantupianbuchaoguo' })}${maxSize} ${unit}!`)
    }
    return fileTypeOutcome && fileSizeOutcome
  }

  // 上传结果回调
  const handleChange = ({ file, fileList }: any) => {
    // 若上传受条件限制，则不做数据存储
    if (!file.status) return

    // upload受控模式需始终setState fileList, 保证所有状态同步到upload
    setFileList(fileList)

    if (file.status === 'error') {
      return message.error(intl.formatMessage({ id: 'components.wenjianshangchuanshibai' }))
    }
    let imgData: string[] = []
    fileList.map((item: any) => {
      if (item.url || (item.response && item.response.data)) {
        const url = item.url || (urlKey ? item.response.data[urlKey] : item.response.data)
        imgData.push(url)
      }
    })
    onChange && onChange(maxCount === 1 ? imgData[0] : imgData, fileList)
  }

  // 查看图片
  const handlePreview = (file: any) => {
    if (file.status === 'done') {
      const url = file.url || (urlKey ? file.response.data[urlKey] : file.response.data)
      setPreviewImage(url)
      setShowImage(true)
    }
  }

  return (
    <div>
      <Space size={16}>
        <Upload
          name="file"
          action="/api/support/file/upload"
          listType="picture-card"
          maxCount={maxCount}
          fileList={fileList}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          onPreview={handlePreview}
          disabled={disabled}
          {...rest}
        >
          {fileList.length >= maxCount || disabled ? null : uploadButtonElement()}
        </Upload>
        {tips && (
          <div className={styles.tips}>
            <div>
              {intl.formatMessage({ id: 'components.zhichi' })} {fileType.map((item) => item.split('/')[1]).join('/')}
            </div>
            <div>
              {intl.formatMessage({ id: 'components.zuidabuchaoguo' })} {maxSize} {unit}，
            </div>
            <div>
              {intl.formatMessage({ id: 'components.chicun' })}: {imgSizeText}
            </div>
            {typeof tips === 'string' && tips}
          </div>
        )}
      </Space>
      <Modal
        visible={showImage}
        title={intl.formatMessage({ id: 'components.tupianzhakan' })}
        footer={null}
        onCancel={() => setShowImage(false)}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  )
})

// 处理fileList格式
const fnDealFileList = (fileList: any[]) => {
  const newFileList = fileList.map((item) => {
    if (typeof item === 'string') {
      return {
        uid: item,
        name: 'image.png',
        status: 'done',
        url: item,
      }
    } else {
      return item
    }
  })
  return newFileList
}

// 上传框按钮样式
const uploadButtonElement = () => {
  const intl = useIntl()
  return (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">{intl.formatMessage({ id: 'components.shangchuantupian' })}</div>
    </div>
  )
}

export default ImgUpload
