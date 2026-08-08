import React, { useEffect, useState, Fragment } from 'react'
import { RightOutlined } from '@ant-design/icons'
import ImageBox from '@apps/components/src/web/ImageBox'
import cx from 'classnames'
import { getWebIntl } from '@apps/locales'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'
import { GlobalLocale } from '../../locale/types/global'
import { dateFormat } from '../../utils/date'
import { getUrlMemberId } from '../../utils/index'
import styles from './index.less'

interface InformationPropsType {
  visible?: boolean
  /** 显示控制：商城端控制 */
  visibleControl?: boolean
  newsList: any[]
  className?: string
}

const Information: React.FC<InformationPropsType> = (props) => {
  const {
    visible = true,
    visibleControl = false,
    newsList = [],
    className,
    ...others
  } = props
  const translate = getWebIntl()
  const pathname =
    typeof window !== 'undefined'
      ? window.location.pathname === '/'
        ? ''
        : window.location.pathname
      : ''

  const memberId = getUrlMemberId(pathname)
  const prefixUrl = memberId ? `/${memberId}` : ''

  const [leadLeftNews, setLeadLeftNews] = useState<any[]>([]) // 头条左边新闻
  const [leadRightNews, setLeadRightNews] = useState<any[]>([]) // 头条右边新闻

  useEffect(() => {
    if (newsList && newsList.length > 0) {
      initLeadNewData(newsList)
    }
  }, [newsList])

  const initLeadNewData = (leadNewsList: any[]) => {
    if (leadNewsList.length >= 2) {
      const leftList = leadNewsList.slice(
        0,
        Math.round(leadNewsList.length / 2),
      )
      const rightList = leadNewsList.slice(
        Math.round(leadNewsList.length / 2),
        leadNewsList.length,
      )
      setLeadLeftNews(leftList)
      setLeadRightNews(rightList)
    } else {
      setLeadLeftNews(leadNewsList)
      setLeadRightNews([])
    }
  }

  const toDetailLink = (id: number) => {
    if (!visibleControl) {
      return undefined
    }
    return `${prefixUrl}/info/infoDetail/${id}`
  }

  const renderComponent = (locale: GlobalLocale) =>
    (visibleControl ? visible : true) && (
      <div className={cx(styles.information, className)} {...others}>
        <div className={styles.information_container}>
          <div className={styles.information_header}>
            <span>{translate('web.resource.mall.nav-info')}</span>
            <a
              href={visibleControl ? `${prefixUrl}/info` : undefined}
              className={styles.more_link}
            >
              {translate('web.resource.mall.moreinfo')} <RightOutlined />
            </a>
          </div>
          <div className={styles.information_list}>
            <div className={styles.information_list_item}>
              <div className={styles.information_list_item_body}>
                {leadLeftNews &&
                  leadLeftNews.length > 0 &&
                  leadLeftNews.map(
                    (item, index) =>
                      index === 0 && (
                        <Fragment key={`news_list_item_left_${item.id}`}>
                          <a href={toDetailLink(item.id)} title={item.title}>
                            <div className={styles.information_recommand}>
                              <div className={styles.information_recommand_img}>
                                <ImageBox
                                  width={220}
                                  height={146}
                                  src={item.imageUrl}
                                />
                              </div>
                              <div
                                className={styles.information_recommand_content}
                              >
                                <div
                                  className={
                                    styles.information_recommand_content_title
                                  }
                                >
                                  {item.title}
                                </div>
                                <div
                                  className={
                                    styles.information_recommand_content_date
                                  }
                                >
                                  {dateFormat(
                                    new Date(item.createTime),
                                    'YYYY-MM-DD',
                                  )}
                                </div>
                                <div
                                  className={
                                    styles.information_recommand_content_content
                                  }
                                >
                                  {item.digest}
                                </div>
                              </div>
                            </div>
                          </a>
                        </Fragment>
                      ),
                  )}
              </div>
            </div>
            <div className={styles.information_list_item}>
              <div className={styles.information_list_item_body}>
                {leadRightNews &&
                  leadRightNews.length > 0 &&
                  leadRightNews.map(
                    (item, index) =>
                      index === 0 && (
                        <Fragment
                          key={`information_recommand_right_${item.id}`}
                        >
                          <a href={toDetailLink(item.id)} title={item.title}>
                            <div className={styles.information_recommand}>
                              <div className={styles.information_recommand_img}>
                                <ImageBox
                                  width={220}
                                  height={146}
                                  src={item.imageUrl}
                                />
                              </div>
                              <div
                                className={styles.information_recommand_content}
                              >
                                <div
                                  className={
                                    styles.information_recommand_content_title
                                  }
                                >
                                  {item.title}
                                </div>
                                <div
                                  className={
                                    styles.information_recommand_content_date
                                  }
                                >
                                  {dateFormat(
                                    new Date(item.createTime),
                                    'YYYY-MM-DD',
                                  )}
                                </div>
                                <div
                                  className={
                                    styles.information_recommand_content_content
                                  }
                                >
                                  {item.digest}
                                </div>
                              </div>
                            </div>
                          </a>
                        </Fragment>
                      ),
                  )}
              </div>
            </div>
          </div>
          <div
            className={styles.information_list}
            style={{ marginTop: 16, backgroundColor: '#FFF' }}
          >
            {leadLeftNews && leadLeftNews.length > 1 && (
              <div className={styles.information_list_item}>
                <div className={styles.information_list_item_body}>
                  {leadLeftNews.map(
                    (item, index) =>
                      index !== 0 && (
                        <Fragment key={`small_news_list_item_left_${item.id}`}>
                          <a href={toDetailLink(item.id)} title={item.title}>
                            <div className={styles.news_list_item}>
                              <div className={styles.news_list_item_title}>
                                {item.title}
                              </div>
                              <div className={styles.news_list_item_date}>
                                {dateFormat(
                                  new Date(item.createTime),
                                  'YYYY-MM-DD',
                                )}
                              </div>
                            </div>
                          </a>
                        </Fragment>
                      ),
                  )}
                </div>
              </div>
            )}
            {leadRightNews && leadRightNews.length > 1 && (
              <div className={styles.information_list_item}>
                <div className={styles.information_list_item_body}>
                  {leadRightNews.map(
                    (item, index) =>
                      index !== 0 && (
                        <Fragment
                          key={`small_information_recommand_right_${item.id}`}
                        >
                          <a href={toDetailLink(item.id)} title={item.title}>
                            <div className={styles.news_list_item}>
                              <div className={styles.news_list_item_title}>
                                {item.title}
                              </div>
                              <div className={styles.news_list_item_date}>
                                {dateFormat(
                                  new Date(item.createTime),
                                  'YYYY-MM-DD',
                                )}
                              </div>
                            </div>
                          </a>
                        </Fragment>
                      ),
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )

  return (
    <LocaleReceiver componentName="global">{renderComponent}</LocaleReceiver>
  )
}

export default Information
