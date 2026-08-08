import React, { useState } from 'react'
import { Upload, Button, message, Typography } from 'antd'
import data from '@/constants/uploadProps'
import { DeleteOutlined, FilePdfOutlined, UploadOutlined } from '@ant-design/icons'
import style from './index.less'
import { isEmpty } from 'lodash'
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
  /** 删除 */
  onRemove?: (e?: number) => void
}

const intl = getIntl()
const UploadFiles: React.FC<UploadFilesProps> = (props: any) => {
  const { visible = true, width, accept, size, fileList, onChange, onRemove } = props
  const [loading, setLoading] = useState<boolean>(false)

  const beforeUpload = (file: any) => {
    const isSize = file.size / 1024 / 1024 < size
    let index = file['name'].lastIndexOf('.')
    //获取后缀
    let ext = file['name'].substr(index + 1)
    const accepts = accept.split(',').some((item) => item === `.${ext}`)
    if (!accepts) {
      message.error(`${intl.formatMessage({ id: 'transaction_components.wenjianleixingbixuwei' })}${accept}`)
      return Upload.LIST_IGNORE
    }
    if (!isSize) {
      message.error(`${intl.formatMessage({ id: 'transaction_components.shangchuanwenjiandaxiaobuchao1' })} ${size}M!`)
      return Upload.LIST_IGNORE
    }
    return accepts && isSize
  }

  const handleFilesChange = ({ file }) => {
    setLoading(true)
    if (file.status !== 'done') {
      return
    }
    const files: fileType[] = fileList
    files.push({
      name: file.name,
      url: file.response.data,
    })
    onChange([...files])
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
                  style={{ display: 'block' }}
                  onClick={() => downloadFileByNameAndUrl(item.url, item.name)}
                >
                  <FilePdfOutlined style={{ marginRight: '5px' }} />
                  {item.name}
                </Typography.Link>
              </div>
              <div className={style.uploadOperate} onClick={() => onRemove(index)}>
                <DeleteOutlined />
              </div>
            </div>
          ))}
      </div>
      {visible && (
        <Upload
          {...data}
          showUploadList={false}
          accept={accept}
          beforeUpload={beforeUpload}
          onChange={handleFilesChange}
        >
          <Button loading={loading} icon={<UploadOutlined />}>
            {intl.formatMessage({ id: 'transaction_components.shangchuanwenjian' })}
          </Button>
          <div style={{ marginTop: '8px', color: '#909399' }}>
            {intl.formatMessage({ id: 'transaction_components.yicishangchuanyigewenjian1' })} {size}M
          </div>
        </Upload>
      )}
    </>
  )
}

export default UploadFiles
