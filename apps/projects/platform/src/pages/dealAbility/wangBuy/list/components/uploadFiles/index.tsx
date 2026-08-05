import React, { useState } from 'react'
import { Upload, message, Typography } from 'antd'
import { Button } from '@linkseeks/ui'
import data from './uploadProps'
import { DeleteOutlined, FilePdfOutlined, UploadOutlined } from '@ant-design/icons'
import style from './index.less'
import isEmpty from 'lodash/isEmpty'
import { getIntl } from '@linkseeks/i18n'
import { downloadFileByNameAndUrl } from '@apps/utils'

type fileType = {
  /** 名字 */
  name: string
  /** 链接 */
  url: string
}
interface UploadFilesProps {
  visible?: boolean
  /** label */
  label?: React.ReactNode | string
  /** name */
  name?: string
  /** 宽度 */
  width?: string
  /** 对齐方式 */
  labelAlign?: 'left' | 'right'
  /** 限制文件类型 */
  accept?: string
  /** 限制上传大小 */
  size?: number
  /** 回显数据 */
  fileList?: fileType[]
  /** 返回数据 */
  onChange?: (e?: any[]) => void
  /** 返回单个数据 */
  fileChange?: (e?: any) => void
  /** 删除 */
  onRemove?: (e: number) => void
  /** 上传按钮类型 */
  btnType?: 'link' | 'default'
  /** 提示信息 */
  tipsText?: React.ReactNode | string
  /** 超过数量禁止上传 */
  disabled?: boolean
}

const intl = getIntl()
const UploadFilesString: React.FC<UploadFilesProps> = (props: any) => {
  const {
    visible = true,
    width,
    accept,
    size,
    fileList,
    onChange,
    onRemove,
    fileChange,
    btnType = 'link',
    tipsText,
    disabled,
  } = props
  const [loading, setLoading] = useState<boolean>(false)

  const beforeUpload = (file: any) => {
    const isSize = file.size / 1024 / 1024 < size
    let index = file['name'].lastIndexOf('.')
    //获取后缀
    let ext = file['name'].substr(index + 1)
    const accepts = accept.split(',').some((item) => item === `.${ext}`)
    if (!accepts) {
      message.error(`${intl.formatMessage({ id: 'transaction_components.wenjianleixingbixuwei' })}${accept}`)
    }
    if (!isSize) {
      message.error(
        `${intl.formatMessage({
          id: 'transaction_components.shangchuanwenjiandaxiaobuchao1',
        })} ${size}M!`,
      )
      return Upload.LIST_IGNORE
    }
    return accepts && isSize
  }

  const handleFilesChange = ({ file }) => {
    setLoading(true)
    if (file.status !== 'done') {
      return
    }
    const files = [
      {
        name: file.name,
        url: file.response.data,
      },
    ]
    if (fileChange) {
      fileChange({
        name: file.name,
        url: file.response.data,
      })
    } else {
      onChange([...files])
    }
    setLoading(false)
  }

  return (
    <>
      <div className={style.uploadList} style={{ width: width ? width : '100%' }}>
        {!isEmpty(fileList) &&
          fileList.map((item: fileType, index: number) => (
            <div className={style.uploadListItem} key={`file${index}_1`}>
              <div className={style.uploadInfo}>
                <Typography.Link
                  style={{ display: 'flex', alignItems: 'center' }}
                  onClick={() => downloadFileByNameAndUrl(item.url, item.name)}
                  ellipsis
                >
                  <FilePdfOutlined style={{ marginRight: '5px' }} />
                  <span style={{ flex: 1 }}>{item.name}</span>
                </Typography.Link>
              </div>
              {visible && (
                <div className={style.uploadOperate} onClick={() => onRemove(index)}>
                  <DeleteOutlined />
                </div>
              )}
            </div>
          ))}
      </div>
      {visible && !disabled && (
        <>
          <Upload
            {...data}
            maxCount={1}
            showUploadList={false}
            accept={accept}
            beforeUpload={beforeUpload}
            onChange={handleFilesChange}
            disabled={disabled || loading}
          >
            <Button loading={loading} icon={<UploadOutlined />} type="secondary">
              {intl.formatMessage({ id: 'transaction_components.shangchuanwenjian' })}
            </Button>
          </Upload>
          {tipsText && <p style={{ marginTop: 8 }}>{tipsText}</p>}
        </>
      )}
    </>
  )
}

export default UploadFilesString
