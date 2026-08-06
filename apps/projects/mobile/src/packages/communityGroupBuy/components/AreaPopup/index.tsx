/*
 * @Description: 选择地址 Popup
 */
import React, { useEffect, useRef } from 'react'
import { View } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import Popup from '@/components/Popup'
import { THEME_COLORS } from '@/constants/theme'
import { getStockStorage } from './utils'
import ShippingAreaIndexes, {
  ShippingAreaIndexesValueType,
  ShippingAreaIndexesRefHandle,
} from './components/ShippingAreaIndexes'
import styles from './index.module.scss'

export type AreaValueType = {
  provinceCode: string
  provinceName: string
  cityCode: string
  cityName: string
  districtCode?: string
  districtName?: string
}

interface IProps {
  /**
   * 是否显示
   */
  visible: boolean
  /**
   * 默认地址
   */
  defaultArea?: AreaValueType | null
  /**
   * 关闭触发事件
   */
  onClose: () => void
  /**
   * 配送地址改变触发事件
   */
  onChange?: (value: AreaValueType) => void
}

const AreaPopup: React.FC<IProps> = (props: IProps) => {
  const { visible, defaultArea, onClose, onChange } = props
  const shippingAreaIndexesRef = useRef<ShippingAreaIndexesRefHandle | null>(null)

  const triggerChange = (next: AreaValueType) => {
    onChange?.(next)
  }

  // useEffect(() => {
  //   const _getStockStorage = async () => {
  //     const history = await getStockStorage()
  //     if (history) {
  //       const [province, city, district] = history.data
  //       triggerChange({
  //         provinceCode: province.code!,
  //         provinceName: province.name!,
  //         cityCode: city?.code || '',
  //         cityName: city?.name || '',
  //         districtCode: district?.code || '',
  //         districtName: district?.name || '',
  //       })
  //       return
  //     }
  //   }
  //   _getStockStorage()
  // }, [])

  useEffect(() => {
    if (defaultArea) {
      triggerChange(defaultArea)
    }
  }, [defaultArea])

  const handleClose = () => {
    onClose?.()
  }

  const handleAreaIndexesChange = (next: ShippingAreaIndexesValueType) => {
    const [province, city, district] = next
    triggerChange({
      provinceCode: province.code!,
      provinceName: province.name!,
      cityCode: city?.code || '',
      cityName: city?.name || '',
      districtCode: district?.code || '',
      districtName: district?.name || '',
    })
    handleClose()
  }

  const handlePopupAfterClose = () => {
    shippingAreaIndexesRef.current?.reset()
  }

  return (
    <Popup
      visible={visible}
      title="选择地址"
      onClose={handleClose}
      overlayStyle={{
        zIndex: 100,
      }}
      zIndex={101}
      customTitleStyle={{
        backgroundColor: THEME_COLORS.surface,
        borderBottom: 'none',
      }}
      onAfterClose={handlePopupAfterClose}
      preload
    >
      <View className={styles.wrapper}>
        <ShippingAreaIndexes onChange={handleAreaIndexesChange} ref={shippingAreaIndexesRef} />
      </View>
    </Popup>
  )
}

export default observer(AreaPopup)
