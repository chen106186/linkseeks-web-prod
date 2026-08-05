import React, { useEffect, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View, Text, Icons, Image } from '@apps/mobile-ui'
import { getOssUrlPath } from '@apps/constants'
import styles from './index.module.scss'

const sign = getOssUrlPath('/miniprogram/assets/images/sign.png')

interface Iprops {
  // navigation: NavigationProp<{[key: string]: any}, "ElectronicSign">;
  visible: boolean
  onClose?: (() => void) | null
  onConfirm?: (() => void) | null
}

const ElectronicSign: React.FC<Iprops> = (props: Iprops) => {
  const intl = useIntl()
  const { visible, onClose, onConfirm } = props
  const [modalVisible, setModalVisible] = useState(visible)

  useEffect(() => {
    setModalVisible(visible)
  }, [visible])

  // const { navigation } = props;
  const handleCancel = () => {
    if (onClose) {
      setModalVisible(false)
      onClose()
      return
    }
    setModalVisible(false)
  }

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
  }

  if (!modalVisible) {
    return null
  }

  return (
    <View
      // visible
      className={styles['overlay']}
      // position="center"
    >
      <View className={styles['wrap-model']}>
        <View className={styles['modal']}>
          <View className={styles['header']}>
            <Text>{intl.formatMessage({ id: 'confirmOrder_components_electronicSign_header' })}</Text>
          </View>
          <View className={styles['body']}>
            <View className={styles['tips']}>
              <Text className={styles['tips-text']}>
                {intl.formatMessage({ id: 'confirmOrder_components_electronicSign_tipsText_1' })}
              </Text>
              <Text className={styles['tips-text']}>
                {intl.formatMessage({ id: 'confirmOrder_components_electronicSign_tipsText_2' })}
              </Text>
              <Text className={styles['tips-text']}>
                {intl.formatMessage({ id: 'confirmOrder_components_electronicSign_tipsText_3' })}
              </Text>
            </View>
            <View className={styles['btn']} onClick={handleConfirm}>
              <Image className={styles['img']} src={sign} />
              <View className={styles['info']}>
                <Text className={styles['strong']}>
                  {intl.formatMessage({ id: 'confirmOrder_components_electronicSign_strong' })}{' '}
                </Text>
                <Text className={styles['safe']}>
                  {intl.formatMessage({ id: 'confirmOrder_components_electronicSign_safe' })}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className={styles['back']} onClick={handleCancel}>
          <Icons name="Close" color="#fff" size={16} />
        </View>
      </View>
    </View>
  )
}

ElectronicSign.defaultProps = {
  onClose: null,
  onConfirm: null,
}

export default ElectronicSign
