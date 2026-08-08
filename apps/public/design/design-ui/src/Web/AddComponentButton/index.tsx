import React from 'react'
import cx from 'classnames'
import { PlusIcon } from '@linkseeks/icons'
import styles from './index.less'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'
import { GlobalLocale } from '../../locale/types/global'

interface AddGoodsItemProps {
  className?: string
}

const AddComponentButton: React.FC<AddGoodsItemProps> = (props) => {
  const { className, ...others } = props

  const classNameString = cx(styles.add_components_button, className)

  const renderComponent = (locale: GlobalLocale) => (
    <div className={classNameString} {...others}>
      <PlusIcon className={styles.add_icon} size={24} />
      <span className={styles.add_text}>{locale['global.add.components']}</span>
    </div>
  )

  return (
    <LocaleReceiver componentName="global">{renderComponent}</LocaleReceiver>
  )
}

export default AddComponentButton
