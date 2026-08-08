// 上传身份证照片
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View, Image, Upload, Icons } from '@apps/mobile-ui'
import { hideLoading, previewImage, showLoading } from '@apps/mobile-services/utils/taro'
import styles from './index.module.scss'
// 人像面背景图
const frontCardImg = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/front-card.png'
// 国徽面背景图
const reverseCardImg = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/reverse-card.png'
import uploadFileRequest from '@/utils/uploadFileRequest'

type Props = {
  /** 身份证正面(人头像) */
  frontUrl?: string
  /** 身份证反面(国徽像) */
  backUrl?: string
  onUploadSuccess: (data: { frontUrl?: string; backUrl?: string }) => void
  disabled?: boolean
}

const IdCardUploader = ({ frontUrl, backUrl, onUploadSuccess, disabled = false }: Props) => {
  const intl = useIntl()

  /** 上传人像照 */
  const handleFrontUrl = async (result) => {
    showLoading()
    try {
      const uploadResult = await uploadFileRequest(result)
      console.log('uploadResult', uploadResult)
      if (uploadResult[0]) {
        const url = uploadResult[0].thumbUrl
        onUploadSuccess({ frontUrl: url, backUrl })
      }
    } finally {
      hideLoading()
    }
  }

  /** 上传国徽照 */
  const onUploadBack = async (result) => {
    showLoading()
    try {
      const uploadResult = await uploadFileRequest(result)
      if (uploadResult[0]) {
        const url = uploadResult[0].thumbUrl
        onUploadSuccess({ frontUrl, backUrl: url })
      }
    } finally {
      hideLoading()
    }
  }

  /** 清除图片 */
  const handleCircle = (name: string) => {
    if (disabled) return
    switch (name) {
      case 'frontUrl':
        onUploadSuccess({ frontUrl: undefined, backUrl })
        break
      case 'backUrl':
        onUploadSuccess({ frontUrl, backUrl: undefined })
        break
    }
  }

  return (
    <View className={styles['realChange']}>
      {/* front人像面 */}
      <View className={styles['realChange-cardFile']}>
        {frontUrl ? (
          <View className={styles['realChange-fileLayout']}>
            <View className={styles['realChange-imageBox']}>
              <View className={styles['realChange-clear']} onClick={() => handleCircle('frontUrl')}>
                <Icons color="#000000" name="MinusCircle" />
              </View>
              <Image
                className={styles['realChange-image']}
                src={frontUrl}
                onClick={() => previewImage({ urls: [frontUrl] })}
              />
            </View>
          </View>
        ) : (
          <View className={styles['realChange-fileLayout']}>
            {disabled ? (
              <View className={styles['realChange-imageBox']}>
                <Image className={styles['realChange-image']} src={frontCardImg} />
              </View>
            ) : (
              <Upload fileList={[]} pickerMax={1} actions={handleFrontUrl}>
                <View className={styles['realChange-imageBox']}>
                  <Image className={styles['realChange-image']} src={frontCardImg} />
                </View>
              </Upload>
            )}
          </View>
        )}
        <View className={styles['realChange-fileText']}>
          {intl.formatMessage({ id: 'teamLeader.renxiangmian', defaultMessage: '人像面' })}
        </View>
      </View>

      {/* back国徽面 */}
      <View className={styles['realChange-cardFile']}>
        {backUrl ? (
          <View className={styles['realChange-fileLayout']}>
            <View className={styles['realChange-imageBox']}>
              <View className={styles['realChange-clear']} onClick={() => handleCircle('backUrl')}>
                <Icons color="#000000" name="MinusCircle" />
              </View>
              <Image
                className={styles['realChange-image']}
                src={backUrl}
                onClick={() => previewImage({ urls: [backUrl] })}
              />
            </View>
          </View>
        ) : (
          <View className={styles['realChange-fileLayout']}>
            {disabled ? (
              <View className={styles['realChange-imageBox']}>
                <Image className={styles['realChange-image']} src={reverseCardImg} />
              </View>
            ) : (
              <Upload fileList={[]} pickerMax={1} actions={onUploadBack}>
                <View className={styles['realChange-imageBox']}>
                  <Image className={styles['realChange-image']} src={reverseCardImg} />
                </View>
              </Upload>
            )}
          </View>
        )}
        <View className={styles['realChange-fileText']}>
          {intl.formatMessage({ id: 'teamLeader.guohuimian', defaultMessage: '国徽面' })}
        </View>
      </View>
    </View>
  )
}

export default IdCardUploader
