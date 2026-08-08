import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import { Button, Badge } from 'antd'
import styles from './Container.less'
import { Skeleton } from 'antd'
import { Link } from '@linkseeks/router-core'
import { useIntl, getIntl } from '@linkseeks/i18n'
import layoutStyles from './center.less'
import Authorize from '../Authorize'
import { BellOutlined, RightOutlined } from '@ant-design/icons'
import cx from 'classnames'
import { getEnableMultiTenancy } from '@/utils/auth'
import { isEmpty } from 'lodash'

interface LayoutType {
  StaticsDataList: typeof StaticsDataList
  Tag: typeof Tags
  AlertTip: typeof AlertTip
}

interface Iprops {
  viewRef?: any
  /**
   * 是否没数据
   */
  isEmpty?: boolean
  /** 是否有权限 */
  hasAuth?: boolean
  /**
   * 标题
   */
  title?: string
  /**
   * 标题下面的一行字
   */
  tips?: string
  /**
   * 主要用在header 右边连接ReactNode
   */
  extra?: ReactNode
  children: React.ReactNode
  /**
   * request
   */
  // fn: <T, P>(params: T) => Promise<P>
  loading: boolean
  /**
   * 是否出错
   */
  isError?: boolean
  /**
   * 出错是的render方法
   */
  customizeErrorRender?: (() => React.ReactElement) | null
  onRefresh?: (params: any) => void
}

const Layout: LayoutType & React.FC<Iprops> = (props) => {
  const intl = useIntl()
  const {
    title,
    tips,
    extra,
    children,
    loading,
    isError,
    customizeErrorRender,
    viewRef,
    onRefresh,
    isEmpty = false,
    hasAuth = true,
  } = props

  const handleRefresh = () => {
    onRefresh?.({})
  }

  const renderStatus = () => {
    if (loading) {
      return <Skeleton active />
    }
    if (isError) {
      return (
        customizeErrorRender?.() || (
          <div>
            <Button onClick={handleRefresh}>{intl.formatMessage({ id: 'home.layout.isError' })}</Button>
          </div>
        )
      )
    }

    return children
  }

  const containerCs = cx(styles.container)

  return (
    <div>
      {(hasAuth && (
        <div className={containerCs} ref={viewRef}>
          <div className={styles.header}>
            <div className={styles.left}>
              <div className={styles.title}>{title}</div>
              <div className={styles.tips}>{tips}</div>
            </div>
            <div className={styles.extra}>{extra}</div>
          </div>
          <div className={styles.body}>{renderStatus()}</div>
        </div>
      )) ||
        null}
    </div>
  )
}

export interface IDataListProps {
  dataSource: {
    [key: string]:
      | {
          name: string
          link: string
          count: number
        }[]
      | null
  }
  title: {
    [key: string]: string
  }
}

const StaticsDataList = (props: IDataListProps) => {
  const { dataSource, title } = props
  const enableMultiTenancy = getEnableMultiTenancy()

  useEffect(() => {
    if (!isEmpty(dataSource) && enableMultiTenancy) {
      delete dataSource?.platformList
      delete dataSource?.platformScoreList
    }
  }, [enableMultiTenancy])

  return (
    <>
      {dataSource &&
        Object.keys(dataSource).map((record) => {
          const list = dataSource[record] || []
          return (
            list.length > 0 && (
              <div className={layoutStyles.wrapRow} key={record}>
                <span className={layoutStyles.rowTitle}>{title?.[record]}</span>
                <div className={layoutStyles.rowValues}>
                  {dataSource[record]?.map((_item, key) => {
                    return (
                      <div className={layoutStyles.wrapCol} key={key}>
                        <div className={layoutStyles.colTitle}>{_item.name}</div>
                        {_item.link ? (
                          <Link to={_item.link} className={layoutStyles.colValue}>
                            {_item.count}
                          </Link>
                        ) : (
                          <div className={layoutStyles.colValue}>{_item.count}</div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          )
        })}
    </>
  )
}

interface TagProps {
  tagList: {
    icon: any
    url: string
    title: string
    hasAuth?: boolean
    count?: number
    enableMulti?: boolean
  }[]
}

const Tags = (props: TagProps) => {
  const { tagList } = props
  const list = useMemo(() => {
    return tagList
      .filter((_item) => {
        if (typeof _item.hasAuth === 'undefined' || _item.hasAuth) {
          return true
        }
        return false
      })
      .filter((item) => !item.enableMulti)
  }, [tagList])

  return (
    <div className={layoutStyles.centerRow}>
      {list.map((_item) => {
        return (
          <div className={layoutStyles.wrapTagsItem} key={`${_item.title}-${_item.url}`}>
            <Badge count={_item.count || 0}>
              <Link to={_item.url} className={layoutStyles.tagsItem}>
                <div className={layoutStyles.hoverLink}>
                  <img src={_item.icon} className={layoutStyles.icon} />
                  <div className={layoutStyles.text}>{_item.title}</div>
                  <div className={layoutStyles.hoverIconConatiner}>
                    <div className={layoutStyles.hoverIcon}>
                      <RightOutlined style={{ color: '#fff', fontSize: '8px' }} />
                    </div>
                  </div>
                </div>
              </Link>
            </Badge>
          </div>
        )
      })}
    </div>
  )
}

interface AlterTipProps {
  content: string
  extra?: React.ReactNode
  url?: string
}

const AlertTip = (props: AlterTipProps) => {
  const intl = useIntl()
  const { content, extra = null, url = '' } = props
  return (
    <div className={layoutStyles.ding_tips}>
      <div>
        <BellOutlined />
        <span style={{ marginLeft: '12px' }}>{content}</span>
      </div>
      {extra || (
        <Link to={url}>
          <Button size="small" type="primary">
            {intl.formatMessage({ id: 'home.layout.extra' })}
          </Button>
        </Link>
      )}
    </div>
  )
}

Layout.AlertTip = AlertTip

Layout.Tag = Tags

Layout.StaticsDataList = StaticsDataList

Layout.defaultProps = {
  title: '',
  tips: '',
  extra: null,
  isError: false,
  customizeErrorRender: null,
  onRefresh: undefined,
}

export default Layout
