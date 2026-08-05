import { useState } from 'react'
import cx from 'classnames'
import IconFont from '@/utils/iconfont'
import { PictureOutlined } from '@ant-design/icons'
import { getWebIntl } from '@/utils/locales'
import styles from './index.module.less'

const AboutLayout: React.FC = (props) => {
  const [anchor, setAnchor] = useState<string>('describe')
  const translate = getWebIntl()

  const changeAnchor = (id: string) => {
    setAnchor(id)
    window.location.href = `#${id}`
  }

  return (
    <div className={styles.shop_about}>
      <div className={styles.shop_about_left}>
        <div className={styles.nav_list}>
          <div
            className={cx(styles.nav_list_item, anchor === 'describe' ? styles.active : {})}
            onClick={() => changeAnchor('describe')}
          >
            <IconFont type="icon-gongsi" className={styles.nav_list_item_icon} />
            <span>{translate('web.resource.mall.gongsijianjie')}</span>
          </div>
          <div
            className={cx(styles.nav_list_item, anchor === 'album' ? styles.active : {})}
            onClick={() => changeAnchor('album')}
          >
            <PictureOutlined translate={undefined} className={styles.nav_list_item_icon} />
            <span>{translate('web.resource.mall.gongsixiangce')}</span>
          </div>
          <div
            className={cx(styles.nav_list_item, anchor === 'honorpic' ? styles.active : {})}
            onClick={() => changeAnchor('honorpic')}
          >
            <IconFont type="icon-badge" className={styles.nav_list_item_icon} />
            <span>{translate('web.resource.mall.rongyuzizhi')}</span>
          </div>
          <div
            className={cx(styles.nav_list_item, anchor === 'brochure' ? styles.active : {})}
            onClick={() => changeAnchor('brochure')}
          >
            <IconFont type="icon-data" className={styles.nav_list_item_icon} />
            <span>{translate('web.resource.mall.xuanchuanshouce')}</span>
          </div>
        </div>
      </div>
      <div className={styles.shop_about_main}>{props.children}</div>
    </div>
  )
}

export default AboutLayout
