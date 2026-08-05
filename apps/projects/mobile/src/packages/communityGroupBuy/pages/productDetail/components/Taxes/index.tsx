/**
 * @Deprecated 税费组件
 */
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import Bookshelf from '../../../../components/Bookshelf'

interface TaxesProps {
  /**
   * 点击跳转触发事件
   */
  onJump?: () => void
  /**
   * 是否是跨境商品
   */
  crossBorder: boolean
  /**
   * 税率
   */
  taxes: number
  /**
   * 商品单价
   */
  price: number
}

const Taxes: React.FC<TaxesProps> = (props: TaxesProps) => {
  const { onJump, crossBorder, taxes, price } = props

  const intl = useIntl()

  const handlePress = () => {
    onJump?.()
  }

  if (!crossBorder) {
    return null
  }

  return (
    <Bookshelf.Item
      label={intl.formatMessage({ id: 'commodityMerge.stocksSourcing.components.taxes.label', defaultMessage: '税费' })}
      labelWidth={64}
      content={
        taxes !== 0
          ? intl.formatMessage({
              id: 'commodityMerge.stocksSourcing.components.taxes.taxes',
              currency: intl.formatMessage({ id: 'currency', defaultMessage: '￥' }),
              amount: (((taxes / 100) * price * 10000) / 10000).toFixed(2),
            })
          : intl.formatMessage({
              id: 'commodityMerge.stocksSourcing.components.taxes.taxes.free',
              defaultMessage: '商品已包税',
            })
      }
      onPress={handlePress}
      isLink
    />
  )
}

export default Taxes
