import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  HomeIcon,
  AfterSalesIcon,
  LogisticsIcon,
  MarketingIcon,
  OrderIcon,
  SystemIcon,
  MemberIcon,
  BrowserIcon,
  EmotionIcon,
  ProductIcon,
  ArticleIcon,
  LayersIcon,
  SettlementIcon,
  ShoppingIcon,
  DescriptionIcon,
  ShopIcon,
} from '@linkseeks/icons'
import { useNavigate, useLocation } from '@linkseeks/router-core'
import mx from 'classnames'
import { useMemoizedFn } from '@linkseeks/hooks'
import defaultLogo from '../../assets/images/default_logo.svg'
import { useMenu } from '../../../useMenu'
import styles from './index.less'

export interface OutSlideProps {}

const MenuCodeMaps = {
  home: HomeIcon,
  afterManage: AfterSalesIcon,
  contentManage: DescriptionIcon,
  logisticsManage: LogisticsIcon,
  marketingManage: MarketingIcon,
  mallManage: ShopIcon,
  orderManage: OrderIcon,
  pageCustomized: BrowserIcon,
  systemManage: SystemIcon,
  memberManage: MemberIcon,
  productManage: ProductIcon,
  purchaseManage: ArticleIcon,
  manufactureManage: LayersIcon,
  settlementManage: SettlementIcon,
  transactionManage: ShoppingIcon,
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
      <RenderIcon size={16} />
      <span className={styles['item-title']}>{title}</span>
    </li>
  )
}

const OutSlide = (props: OutSlideProps) => {
  const { menuData, activeCode } = useMenu()
  const renderMenu = useMemoizedFn(() =>
    menuData.map((v) => <OutSlideItem isActive={v.code === activeCode} key={v.routeKey} {...v} />),
  )

  return (
    <div className={styles['out-slide']}>
      <div className={styles['logo']}>
        <img src={defaultLogo} />
      </div>
      <ul className={styles['slide-list']}>{renderMenu()}</ul>
    </div>
  )
}

export default OutSlide
