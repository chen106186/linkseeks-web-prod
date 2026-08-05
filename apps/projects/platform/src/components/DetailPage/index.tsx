import React, { useEffect, useContext } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { ArrowLeftOutlined } from '@ant-design/icons'
import styles from './index.less'
import { historyContainer } from '@/hooks/useHistoryContainer'
import { Row } from 'antd'

interface DetailPagePropsType {
  children?: React.ReactNode
  title?: React.ReactNode
  extra?: React.ReactNode
}

const DetailPage: React.FC<DetailPagePropsType> = (props) => {
  const { children, title, extra } = props
  const routerInfo = useContext(historyContainer)

  const intl = useIntl()

  const defaultTitle = routerInfo ? routerInfo.name : ''

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className={styles.common_detail_page}>
      <div className={styles.common_header}>
        <Row>
          <div className={styles.back_btn} onClick={() => history.goBack()}>
            <ArrowLeftOutlined />
            <span>{intl.formatMessage({ id: 'components.fanhui' })}</span>
          </div>
          <div className={styles.title}>{title || defaultTitle}</div>
        </Row>
        <div>{extra}</div>
      </div>
      <div className={styles.detail_page_contaner}>{children}</div>
    </div>
  )
}

export default DetailPage
