/**
 * @Description 付款信息Card
 */
import { useContext, useEffect, useState } from 'react'
import type { IProps as CustomizeColumnProps } from '@/components/CustomizeColumn'
import { ALTERATION } from '../orderDetailSection'
import { OrderDetailContext } from '../../_public/order/context'
import { formatContext } from '../../../orderAbility/components/purchaseOrderPreview'
import RadioChangeButtonCard from '../radioChangeButton'
import MellowCard from '@/components/MellowCard'
import RenderCard from '../renderCard'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
interface PaymentInfoCardProps extends Omit<CustomizeColumnProps, 'data'> {
  /**
   * 币别
   */
  currencyName: string
  /**
   * 币别是否变更
   */
  currencyNameChangeStatus?: number
  /**
   * 付款方式
   */
  paymentTypeName: string
  /**
   * 付款方式是否变更
   */
  paymentTypeNameChangeStatus?: number
}

const paymentInfo = [
  { title: translate('web.resource.member.bibie'), name: 'currencyName' },
  { title: translate('web.resource.member.fukuanfangshi'), name: 'paymentTypeName' },
]

const PaymentInfoCard = () => {
  const { versionContext, formContext } = useContext(OrderDetailContext)
  const { data } = formContext
  const payment = {
    currencyName: data?.currencyTypeName,
    paymentTypeName: data?.paymentTypeName,
  }
  const [alteation, setAlteation] = useState<number>(ALTERATION.AFTER_ALTERATION)
  const [dataBo, setDataBo] = useState<PaymentInfoCardProps>()

  const handRenderValue = (value) => {
    const { currencyTypeName, currencyNameChangeStatus, paymentTypeName, paymentTypeNameChangeStatus } = formatContext(
      versionContext,
      value,
    )

    setDataBo({
      currencyName: currencyTypeName,
      currencyNameChangeStatus,
      paymentTypeName,
      paymentTypeNameChangeStatus,
    })
  }

  const handleVersions = (e) => {
    const { value } = e.target
    if (value === ALTERATION.BEFORE_ALTERATION) {
      handRenderValue('before')
    } else {
      handRenderValue('after')
    }
    setAlteation(value)
  }

  useEffect(() => {
    if (versionContext) {
      setAlteation(ALTERATION.AFTER_ALTERATION)
      handRenderValue('after')
    }
  }, [versionContext])

  return (
    <MellowCard
      id="paymentInfo"
      title={translate('web.resource.payment.fukuangxinxi')}
      fullHeight
      extra={versionContext && <RadioChangeButtonCard handleVersions={handleVersions} />}
    >
      <RenderCard
        infoList={paymentInfo}
        dataSource={versionContext ? { ...dataBo } : payment}
        versionContext={versionContext}
        alteation={alteation}
      />
    </MellowCard>
  )
}

export default PaymentInfoCard
