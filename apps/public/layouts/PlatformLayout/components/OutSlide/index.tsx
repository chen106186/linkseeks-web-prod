import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  HomeIcon,
  CommodityIcon,
  UserCrowdIcon,
  StorefrontIcon,
  ShopIcon,
  ArticleIcon,
  ShoppingIcon,
  ContractIcon,
  ArticleListIcon,
  ShieldIcon,
  PaymentIcon,
  LiquidationIcon,
  LogisticsIcon,
  LayersFillIcon,
  AfterSalesIcon,
  MarketingIcon,
  SystemIcon,
  EmotionIcon,
  MemberIcon,
  LiquidationFillIcon,
  DescriptionIcon,
  ConfirmOrderIcon,
  PieChartIcon,
} from '@linkseeks/icons'
import { authService } from '@apps/services'
import { useNavigate, useLocation } from '@linkseeks/router-core'
import mx from 'classnames'
import { useMemoizedFn } from '@linkseeks/hooks'
import defaultLogo from '../../assets/images/default_logo.svg'
import { useMenu } from '../../../useMenu'
import styles from './index.less'
import { useGlobal } from '@apps/container'

export interface OutSlideProps {}

const MenuCodeMaps = {
  home: HomeIcon,
  srmHome: HomeIcon,
  afterAbility: AfterSalesIcon,
  contentAbility: DescriptionIcon,
  logisticsAbility: LogisticsIcon,
  marketingAbility: MarketingIcon,
  orderAbility: ArticleIcon,
  systemAbility: SystemIcon,
  commodityAbility: CommodityIcon,
  mallAbility: ShopIcon,
  shopAbility: StorefrontIcon,
  customerAbility: UserCrowdIcon,
  supplierAbility: UserCrowdIcon,
  dealAbility: ShoppingIcon,
  balance: LiquidationFillIcon,
  contract: ContractIcon,
  qualityAbility: CommodityIcon,
  payandSettle: PaymentIcon,
  procurementAbility: ConfirmOrderIcon,
  handling: LayersFillIcon,
  dataAbility: PieChartIcon,
}

const OutSlideItem = (props) => {
  const { code, title, path, isActive } = props
  const navigate = useNavigate()
  const RenderIcon = MenuCodeMaps[code] || EmotionIcon

  const handleActive = () => {
    navigate(path)
  }

  return (
    <li className={mx(styles['slide-item'], isActive && styles['slide-item-active'])} onClick={handleActive}>
      {/* <Tooltip placement='right' title={title}>
      	<RenderIcon size={24} />
			</Tooltip> */}
      <RenderIcon size={14} />
      <span className={styles['item-title']}>{title}</span>
    </li>
  )
}

const OutSlide = (props: OutSlideProps) => {
  const { menuData, activeCode } = useMenu()
  const { avatar } = useGlobal()
  const renderMenu = useMemoizedFn(() =>
    menuData.map((v) => <OutSlideItem isActive={v.code === activeCode} key={v.routeKey} {...v} />),
  )

  return (
    <div className={styles['out-slide']}>
      <div className={styles['logo']}>
        <img src={avatar || defaultLogo} />
      </div>
      <ul className={styles['slide-list']}>{renderMenu()}</ul>
    </div>
  )
}

export default OutSlide
