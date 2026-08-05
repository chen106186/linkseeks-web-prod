import React from 'react'
import { PlusCircleOutlined } from '@ant-design/icons'
import cx from 'classnames'
import styles from './index.less'
import LocaleReceiver from '../../../components/LocaleProvider/LocaleReceiver'
import { PlatformLocale } from '../../../locale/types/platform'

interface AddGoodsItemProps {
  className?: string
}

const AddGoodsItem: React.FC<AddGoodsItemProps> = (props) => {
  const { className, ...others } = props

  const classNameString = cx(styles.add_goods_item, className)

  const renderComponent = (locale: PlatformLocale) => (
    <div className={classNameString} {...others}>
      <PlusCircleOutlined className={styles.add_icon} />
      <span className={styles.add_text}>
        {locale['platform.add.goods.module']}
      </span>
    </div>
  )

  return (
    <LocaleReceiver componentName="Platform">{renderComponent}</LocaleReceiver>
  )
}

export default AddGoodsItem
