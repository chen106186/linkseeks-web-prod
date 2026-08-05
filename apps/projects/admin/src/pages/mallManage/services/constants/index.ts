import { SHOP_TYPE_ENUM } from '@apps/constants'
import mainDoorIcon from '../components/PortalItem/icons/menhu.svg'
import purchaseDoorIcon from '../components/PortalItem/icons/caigou.svg'
import logisticsIcon from '../components/PortalItem/icons/wuliu.svg'
import mainufactureDoorIcon from '../components/PortalItem/icons/jiagong.svg'
import infoDoorIcon from '../components/PortalItem/icons/zixun.svg'

/**
 * 商城环境选项
 * 适用环境: 0.全部 1.WEB 2.H5 3.小程序 4.APP
 */
export const ENVIRONMENT_OPTIONS = [
  {
    key: '0',
    label: '全部',
  },
  {
    key: '1',
    label: 'WEB',
  },
  {
    key: '2',
    label: 'H5',
  },
  {
    key: '3',
    label: '小程序',
  },
  {
    key: '4',
    label: 'APP',
  },
]

export const MALL_STATUS_TYPE = {
  default: {
    name: '默认',
    background: '#EBF9F6',
    color: '#00A98F',
  },
  deactivate: {
    name: '停用',
    background: '#F5F6F7',
    color: '#5C626A',
  },
}

export const DOOR_ICONS = {
  [SHOP_TYPE_ENUM.MAIN_PORTAL]: mainDoorIcon,
  [SHOP_TYPE_ENUM.PURCHASE]: purchaseDoorIcon,
  [SHOP_TYPE_ENUM.LOGISTICS]: logisticsIcon,
  [SHOP_TYPE_ENUM.PROCESS]: mainufactureDoorIcon,
  [SHOP_TYPE_ENUM.INFOMATION]: infoDoorIcon,
}
