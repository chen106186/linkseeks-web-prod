/**
 * 流程规则组件
 * @author: Crayon
 */
import React from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import styles from './index.less'
import { useIntl } from '@linkseeks/i18n'

type PropsType = {
  title?: string | React.ReactNode
  onClick?: () => void
  children?: React.ReactNode
}

const ConfigFieldCard: React.FC<PropsType> = ({ title, onClick, children }) => {
  const intl = useIntl()
  return (
    <div className={styles['card']}>
      <div className={styles['header']}>
        <div className={styles['title']}>{title}</div>
        {onClick ? (
          <div
            className={styles['icon']}
            onClick={onClick}
            title={intl.formatMessage({ id: 'common.button.delete', defaultMessage: '删除' })}
          >
            <DeleteOutlined />
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div className={styles['body']}>{children}</div>
    </div>
  )
}

export default ConfigFieldCard
