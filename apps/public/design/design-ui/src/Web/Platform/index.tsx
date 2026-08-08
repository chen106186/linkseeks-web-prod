import React from 'react'
import cx from 'classnames'
import Advert from './Advert'
import QuickNav, { QuickNavItemType } from './QuickNav'
import Goods from './Goods'
import AddGoodsItem from './AddGoodsItem'
import Brand from './Brand'
import Merchant from './Merchant'
import Information from './Information'
import Purchase from './Purchase'
import Logistics from './Logistics'
import Process from './Process'
import Service from './Service'
import styles from './index.less'
import Category from '../Category'
import MallMainNav from '../MallMainNav'
import Header from '../Header'
import TopBar from '../TopBar'

export interface AdvertItemType {
  id: number
  /**
   * 广告名称
   */
  name: string
  /**
   * 广告图片
   */
  imgUrl: string
  /**
   * 链接
   */
  link: string
  sort: number
  expand?: boolean
}

export interface NavItemType {
  id: 0
  link: string
  name: string
  status: true
  key: string
}

export interface DesingConfigItemType {
  name: string
  status: boolean
  content: any
}

interface PlatformIndexProps {
  className?: string
  /** 站点名称 */
  shopname: string
  /** 站点logo */
  logoUrl: string
  /** 平台首页导航 */
  navList: NavItemType[]
  /** 品类树 */
  categoryList: any[]
  /** 广告列表 */
  bannerAdvertList: AdvertItemType[]
  bannerRightAdvertList: AdvertItemType[]
  bannerBottomAdvertList: AdvertItemType[]
  sellQuickNavList: QuickNavItemType[]
  buyQuickNavList: QuickNavItemType[]
  quickNavList: QuickNavItemType[]
  designConfig: DesingConfigItemType[]
}

interface PlatformSubComponentsType {
  TopBar: typeof TopBar
  Header: typeof Header
  MallMainNav: typeof MallMainNav
  Category: typeof Category
  Advert: typeof Advert
  QuickNav: typeof QuickNav
  Goods: typeof Goods
  AddGoodsItem: typeof AddGoodsItem
  Brand: typeof Brand
  Merchant: typeof Merchant
  Information: typeof Information
  Purchase: typeof Purchase
  Logistics: typeof Logistics
  Process: typeof Process
  Service: typeof Service
}

const PlatformIndex: React.FC<PlatformIndexProps> = (props) => {
  const { children, className } = props

  const classNameString = cx(styles.platform, className)

  return <div className={classNameString}>{children}</div>
}

export default PlatformIndex
