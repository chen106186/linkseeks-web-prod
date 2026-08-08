import React, { Fragment } from 'react'
import { Button } from '@linkseeks/ui'
import { useIntl } from '@linkseeks/i18n'
import { FileItem, UploadImage } from '@apps/components'
import styles from '../index.less'
import { CloudUploadOutlined } from '@ant-design/icons'

const CustomUpload = (props) => {
  const { mutators, editable } = props
  const intl = useIntl()
  const XComponentProps = props.props['x-component-props'] || {}
  const uploadProps = {
    ...XComponentProps,
    disabled: !editable || XComponentProps.disabled,
  }
  return (
    <Fragment>
      <UploadImage
        imgUrl={props.value}
        onChange={(data) => {
          // 这里能拿到change后的data值
          mutators.change(data)
        }}
        {...uploadProps}
      >
        {XComponentProps?.listType && XComponentProps?.listType === 'text' && (
          <Button
            className={styles['common-upload-button']}
            icon={<CloudUploadOutlined className={styles['common-upload-button-icon']} />}
          >
            {intl.formatMessage({
              id: 'commodity.products.addProductsItem.productImageForm.uploadButton',
              defaultMessage: '点击上传',
            })}
          </Button>
        )}
      </UploadImage>
      {XComponentProps?.listType && XComponentProps?.listType === 'text' && props.value && (
        <div className={styles['common-upload-button-img']}>
          <FileItem imagePreview file={props.value} />
        </div>
      )}
    </Fragment>
  )
}

CustomUpload.isFieldComponent = true

export default CustomUpload
