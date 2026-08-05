import React from 'react'
import { RightOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import { LinkTo } from '@/utils'
import { getWebIntl } from '@/utils/locales'
import Goods from './goods'
import Category from './category'
import styles from './index.module.less'

interface ShopFloorLineProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  prefixCls?: string
  title?: React.ReactNode | string
  anchor?: string
  linkUrl: string
  linkdisable?: boolean
}

interface ItemProps {
  Goods: typeof Goods
  Category: typeof Category
}

const ShopFloorLine: React.FC<ShopFloorLineProps> & ItemProps = (props) => {
  const { children, title, className, anchor, linkUrl, linkdisable, ...others } = props
  const classString = classNames(styles['lingxi-shop_floor_line'])
  const translate = getWebIntl()

  return (
    <div className={classString} id={anchor} {...others}>
      <div className={styles.floor_line_container}>
        <div className={styles.floor_line_name}>
          <span className={styles.floor_line_name_text}>{title}</span>
          <span
            onClick={() => LinkTo(linkUrl)}
            className={classNames(styles.floor_line_more, !linkdisable ? styles.link : '')}
          >
            {translate('web.resource.mall.gengduohaohuo')} <RightOutlined translate={undefined} />
          </span>
        </div>
        <div className={styles.floor_line_body}>{children}</div>
      </div>
    </div>
  )
}

ShopFloorLine.Goods = Goods
ShopFloorLine.Category = Category

export default ShopFloorLine
