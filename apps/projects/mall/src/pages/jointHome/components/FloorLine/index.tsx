import React from 'react'
import { RightOutlined } from '@ant-design/icons'
import { openLink } from '@/utils'
import cx from 'classnames'
import { Brand } from './brand'
import { Goods } from './goods'
import { getWebIntl } from '@/utils/locales'
import Shops from './shops'
import Category from './category'
import { FloorHeader } from './floortHeader'
import { Horizontal } from './horizontal'
import { Vertical } from './vertical'
import { FloorBanner } from './banner'
import styles from './index.module.less'

interface FloorLineProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  prefixCls?: string
  title?: React.ReactNode | string
  anchor?: string
  linkUrl: string
  linkdisable?: boolean
}

interface ItemProps {
  Brand: typeof Brand
  Goods: typeof Goods
  Shops: typeof Shops
  Category: typeof Category
  FloorHeader: typeof FloorHeader
  Banner: typeof FloorBanner
  Vertical: typeof Vertical
  Horizontal: typeof Horizontal
}

const FloorLine: React.FC<FloorLineProps> & ItemProps = (props) => {
  const translate = getWebIntl()
  const { children, title, className, anchor, linkUrl, linkdisable, ...others } = props
  const classString = cx(styles['lingxi-floor_line'])

  return (
    <div className={classString} id={anchor} {...others}>
      <div className={styles.floor_line_container}>
        <div className={styles.floor_line_name}>
          <span className={styles.floor_line_name_text}>{title}</span>
          <span
            onClick={() => openLink(linkUrl, linkdisable)}
            className={cx(styles.floor_line_more, !linkdisable ? styles.link : '')}
          >
            {translate('web.resource.mall.gengduohaohuo')} <RightOutlined translate={undefined} />
          </span>
        </div>
        <div className={styles.floor_line_body}>{children}</div>
      </div>
    </div>
  )
}

FloorLine.Brand = Brand
FloorLine.Goods = Goods
FloorLine.Shops = Shops
FloorLine.Category = Category
FloorLine.FloorHeader = FloorHeader
FloorLine.Banner = FloorBanner
FloorLine.Vertical = Vertical
FloorLine.Horizontal = Horizontal

export default FloorLine
