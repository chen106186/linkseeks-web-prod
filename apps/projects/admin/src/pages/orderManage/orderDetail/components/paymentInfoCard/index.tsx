/**
 * @Description 付款信息Card
 */
import React from 'react'
import CustomizeColumn, { IProps as CustomizeColumnProps } from '@/components/CustomizeColumn'
import themeConfig from '@apps/config/lingxi.theme.config'

interface PaymentInfoCardProps extends Omit<CustomizeColumnProps, 'data'> {
  /**
   * 币别
   */
  currencyTypeName: string
  /**
   * 付款方式
   */
  paymentTypeName: string
}

const PaymentInfoCard: React.FC<PaymentInfoCardProps> = (props) => {
  const { currencyTypeName, paymentTypeName, ...rest } = props
  return (
    <CustomizeColumn
      title="付款信息"
      column={2}
      data={[
        {
          title: '币别',
          value: currencyTypeName,
        },
        {
          title: '付款方式',
          value: paymentTypeName,
        },
      ]}
      style={{
        marginTop: themeConfig['@margin-md'],
      }}
      {...rest}
    />
  )
}

export default PaymentInfoCard
