import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { PostMarketingMobileActivityOrderGroupPurchaseListResponseDetail } from '@apps/apis'
import MellowCard from '@/components/MellowCard'
import { Icons } from '@apps/mobile-ui'
import CollageItem from './collageItem'

interface Iprops {
  teamList: PostMarketingMobileActivityOrderGroupPurchaseListResponseDetail[]
  /** 正在拼团人数 */
  teamsCount: number
  // /** 商品id */
  // commodityId: number,
  /** 参加拼团 */
  onJoin: (option: { teamId: number; isInvite: boolean; leftNum: number; endTime: number }) => void
  onShare: (teamId: number) => void
  // collageShareInfo: ProductInfoType & { commodityId: number } & ShopInfoType | null
  onHeaderClick: () => void
}

const CollageCard: React.FC<Iprops> = (props: Iprops) => {
  const { teamList, teamsCount, onJoin, onShare, onHeaderClick } = props

  const intl = useIntl()

  const handleClick = () => {
    onHeaderClick?.()
  }
  const handleJoin = (params: { id: number; isInvite: boolean; leftNum: number; endTime: number }) => {
    const { id, isInvite } = params
    onJoin({ teamId: id, isInvite, leftNum: params.leftNum, endTime: params.endTime })
  }

  return (
    <MellowCard
      title={intl.formatMessage({ id: 'commodityMerge.stocksSourcing.components.collage.title', num: teamsCount })}
      extra={<Icons name="ChevronRight" onClick={handleClick} color="#000" />}
      bodyStyle={{ paddingTop: pxTransform(0), paddingBottom: pxTransform(0) }}
    >
      {teamList.map((_item) => (
        <CollageItem key={_item.id} {..._item} onJoin={handleJoin} onShare={onShare} />
      ))}
    </MellowCard>
  )
}

export default CollageCard
