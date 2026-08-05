/*
 * @Description: 选择地址 Popup
 */
import React, { useEffect, useRef } from 'react'
import { View } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import { useIntl } from '@linkseeks/i18n'
import Popup from '@/components/Popup'
import ShippingAreaIndexes, {
  ShippingAreaIndexesValueType,
  ShippingAreaIndexesRefHandle,
} from './components/ShippingAreaIndexes'
import styles from './index.module.scss'

export type StockAddressValueType = {
	id?: number
	provinceCode: string
	provinceName: string
	cityCode: string
	cityName: string
	districtCode?: string
	districtName?: string
	streetCode?: string
	streetName?: string
}

interface IProps {
	/**
	 * 是否显示
	 */
	visible: boolean
	/**
	 * 关闭触发事件
	 */
	onClose: () => void
	/**
	 * 配送地址改变触发事件
	 */
	onChange?: (value: StockAddressValueType) => void
}

const StockAddressPopup: React.FC<IProps> = (props: IProps) => {
  const { visible, onClose, onChange } = props
  const shippingAreaIndexesRef = useRef<ShippingAreaIndexesRefHandle | null>(null)
  const intl = useIntl()

  const triggerChange = (next: StockAddressValueType) => {
		onChange?.(next)
  }

  const handleClose = () => {
		onClose?.()
  }

  const handleAreaIndexesChange = (next: ShippingAreaIndexesValueType) => {
    const [province, city, district, street] = next
    triggerChange({
      provinceCode: province.code!,
      provinceName: province.name!,
      cityCode: city?.code || '',
      cityName: city?.name || '',
      districtCode: district?.code || '',
      districtName: district?.name || '',
      streetCode: street?.code || '',
      streetName: street?.name || '',
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
        backgroundColor: '#FFFFFF',
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

export default observer(StockAddressPopup)
