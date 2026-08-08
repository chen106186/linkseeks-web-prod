import React, { useRef, useState } from 'react'
import { Card } from '@linkseeks/ui'
import { getIntl } from '@linkseeks/i18n'
import Demand from './demand'
const intl = getIntl()

const DemandWarp: React.FC<any> = (props: any) => {
  const { shopList, form, askPurchaseMemberResponses } = props
  const [badge, setbadge] = useState<any>([0, 0, 0, 0, 0, 0])
  const [demand] = useState<any>({})
  const currentDemand = useRef<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [isShop] = useState<boolean>(false)

  /**必填没填写出现角标 */
  const getError = (num: number, idx: number) => {
    const data = [...badge]
    data[idx] = num
    setbadge(data)
    if (num !== 0) {
      setLoading(false)
    }
  }
  return (
    <Card
      id="attachLayout"
      title={intl.formatMessage({
        id: 'transaction_components.xuqiuduijie',
        defaultMessage: '需求对接',
      })}
    >
      <Demand
        currentRef={currentDemand}
        fetchdata={demand}
        onBadge={getError}
        badgeIndex={5}
        needOperate={false}
        isShop={isShop}
        form={form}
        shopList={shopList}
        askPurchaseMemberResponses={askPurchaseMemberResponses}
      />
    </Card>
  )
}
export default DemandWarp
