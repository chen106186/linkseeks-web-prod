import React, { useEffect, useContext } from 'react'
import cx from 'classnames'
import { history } from '@linkseeks/router-manager'
import { ArrowLeftOutlined } from '@ant-design/icons'
import styles from './index.less'
import { historyContainer } from '@/hooks/useHistoryContainer'
import { Row } from 'antd'

interface DetailPagePropsType {
  children?: React.ReactNode
  title?: React.ReactNode
  extra?: React.ReactNode
  extraPageClassName?: string
  extraPageDetailClassName?: string
}

const DetailPage: React.FC<DetailPagePropsType> = (props) => {
  const { children, title, extra, extraPageClassName, extraPageDetailClassName } = props
  const routerInfo = useContext(historyContainer)

  const defaultTitle = routerInfo ? routerInfo.name : ''
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <div className={cx(styles.common_detail_page, extraPageClassName)}>
      <div className={styles.common_header}>
        <Row>
          <div className={styles.back_btn} onClick={() => history.back()}>
            <ArrowLeftOutlined />
            <span>返回</span>
          </div>
          <div className={styles.title}>{title || defaultTitle}</div>
        </Row>
        <div>{extra}</div>
      </div>
      <div className={cx(styles.detail_page_contaner, extraPageDetailClassName)}>{children}</div>
    </div>
  )
}

export default DetailPage
