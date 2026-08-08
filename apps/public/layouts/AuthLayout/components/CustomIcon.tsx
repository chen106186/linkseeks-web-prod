import React, { FC } from 'react'
import { ReactComponent as afterSale } from '../../assets/menuIcon/afterSale.svg'
import { ReactComponent as channel } from '../../assets/menuIcon/channel.svg'
import { ReactComponent as contract } from '../../assets/menuIcon/contract.svg'
import { ReactComponent as logistics } from '../../assets/menuIcon/logistics.svg'
import { ReactComponent as maching } from '../../assets/menuIcon/maching.svg'
import { ReactComponent as member } from '../../assets/menuIcon/member.svg'
import { ReactComponent as order } from '../../assets/menuIcon/order.svg'
import { ReactComponent as payment } from '../../assets/menuIcon/payment.svg'
import { ReactComponent as purchase } from '../../assets/menuIcon/purchase.svg'
import { ReactComponent as settlement } from '../../assets/menuIcon/settlement.svg'
import { ReactComponent as shop } from '../../assets/menuIcon/shop.svg'
import { ReactComponent as system } from '../../assets/menuIcon/system.svg'
import { ReactComponent as transcation } from '../../assets/menuIcon/transcation.svg'
import { ReactComponent as home } from '../../assets/menuIcon/home.svg'
import { ReactComponent as commodity } from '../../assets/menuIcon/commodity.svg'
import Icon from '@ant-design/icons'
import { IconComponentProps } from '@ant-design/icons/lib/components/Icon'

const iconMap = {
  afterSale,
  channel,
  contract,
  logistics,
  maching,
  member,
  order,
  payment,
  purchase,
  settlement,
  shop,
  system,
  transcation,
  home,
  commodity,
}

function RenderComponent({ type, ...props }: { type: keyof typeof iconMap }) {
  const Component = iconMap[type]
  return <Component {...props} />
}

const CustomIcon: FC<IconComponentProps> = ({ type, ...props }: { type: keyof typeof iconMap }) => {
  // return <Icon component={() => <RenderComponent type={type} {...props}/>}/>
  // @处理未配置icon报错
  return type ? <Icon component={() => <RenderComponent type={type} {...props} />} /> : null
}

export default CustomIcon
