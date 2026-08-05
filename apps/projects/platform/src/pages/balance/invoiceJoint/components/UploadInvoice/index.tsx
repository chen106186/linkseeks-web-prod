import React from 'react'
import UploadFiles from '@/components/UploadFiles/UploadFiles'
import pdfIcon from '@/assets/imgs/pdf_icon.png'
import photoIcon from '@/assets/imgs/file_photo.png'
import othersIcon from '@/assets/imgs/file_others.png'
import { UploadFile, UploadChangeParam } from 'antd/lib/upload/interface'
import { DeleteOutlined } from '@ant-design/icons'
import styles from './index.less'

interface UploadInvoiceProps {
  path: string
  name: string
  value: string[]
  props: {
    readOnly: boolean
  }
  editable: boolean
  mutators: {
    change: (params: any) => void
  }
}

const UploadInvoice: React.FC<UploadInvoiceProps> & { isFieldComponent: boolean } = (props) => {
  const { value = [], mutators, editable } = props

  const handleFilesChange = (info: UploadChangeParam) => {
    if (info) {
      const fileList = info.fileList
      const urlList = fileList.map((file) => file.response?.data).filter((item) => item !== undefined)
      mutators.change([...urlList, ...value])
    }
  }

  const handleDeleteItem = (imgUrl: string) => {
    const newList = value.filter((url) => url !== imgUrl)
    mutators.change([...newList])
  }

  const handleFileRemove = (fileItem: UploadFile) => {
    if (value && fileItem.url) {
      const filterUrlList = value.filter((imgUrl) => imgUrl !== fileItem.url)
      mutators.change([...filterUrlList])
    }
  }

  const getIconByName = (name: string) => {
    if (name && typeof name === 'string') {
      const tempList = name.split('.')
      const fileType = tempList[tempList.length - 1].toLocaleUpperCase()
      if (fileType.indexOf('PDF') > -1) {
        return pdfIcon
      } else if (['JPG', 'PNG', 'GIF', 'JPEG'].includes(fileType)) {
        return photoIcon
      } else {
        return othersIcon
      }
    }
    return othersIcon
  }

  const formatImgUrl = (url: string): string => {
    return url && typeof url === 'string' ? url.slice(-25) : ''
  }

  return (
    <div className={styles.upload_invoice}>
      {value && value.length > 0 && (
        <div className={styles.upload_file_list}>
          {value.map((item, index) => (
            <div className={styles.upload_file_list_item} key={`img_item_${index}`}>
              <img className={styles.file_type_icon} src={getIconByName(item)} />
              <a className={styles.file_name} href={item} target="_blank" title={item} rel="noreferrer">
                {formatImgUrl(item)}
              </a>
              {editable && <DeleteOutlined onClick={() => handleDeleteItem(item)} className={styles.delete_btn} />}
            </div>
          ))}
        </div>
      )}
      {editable && (
        <UploadFiles
          btnClassName={styles.upload_btn}
          showFiles={false}
          buttonText="上传"
          onChange={handleFilesChange}
          onRemove={handleFileRemove}
        />
      )}
    </div>
  )
}

UploadInvoice.isFieldComponent = true

export default UploadInvoice
