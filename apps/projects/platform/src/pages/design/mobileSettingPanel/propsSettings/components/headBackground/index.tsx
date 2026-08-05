import React from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { changeProps } from '@apps/design-core'
import { useIntl } from '@linkseeks/i18n'
import { UploadImage } from '@apps/components'
import uploadImgIcon from '@/assets/icons/upload_img_icon.svg'
import styles from './index.less'

interface BannerPropsType {
  backdrop: string
}

const HeadBackground: React.FC<BannerPropsType> = (props) => {
  const { backdrop } = props
  const intl = useIntl()

  const _onChangeImg = (url: any) => {
    changeProps({
      props: Object.assign({ ...props }, { backdrop: url }),
    })
  }

  return (
    <div className={styles['banner']}>
      <div className={styles['banner-box']}>
        <div className={styles['banner-box-label']}>{intl.formatMessage({ id: 'editor.template.shop.backdrop' })}</div>
        {backdrop ? (
          <div className={styles['banner-box-icon']}>
            <img src={backdrop} />
            <div className={styles['banner-box-icon-cover']}>
              <UploadImage
                onChange={(url) => {
                  _onChangeImg(url)
                }}
                listType="text"
              >
                <div className={styles['banner-box-icon-cover-bottom']}>
                  {intl.formatMessage({ id: 'editor.setting.upload.btn' })}
                </div>
              </UploadImage>
              <DeleteOutlined
                className={styles['banner-box-icon-cover-delete']}
                onClick={() => {
                  _onChangeImg('')
                }}
              />
            </div>
          </div>
        ) : (
          <UploadImage
            onChange={(url) => {
              _onChangeImg(url)
            }}
            listType="text"
          >
            <div className={styles['banner-box-icon']}>
              <img src={uploadImgIcon} className={styles['banner-box-icon-add']} />
              <div className={styles['banner-box-icon-cover']}>
                <div className={styles['banner-box-icon-cover-bottom']}>
                  {intl.formatMessage({ id: 'editor.setting.upload.btn' })}
                </div>
              </div>
            </div>
          </UploadImage>
        )}
      </div>
    </div>
  )
}

export default HeadBackground
