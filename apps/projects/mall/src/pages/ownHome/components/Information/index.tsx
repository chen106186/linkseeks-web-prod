import React, { useEffect, useState, Fragment } from 'react'
import { RightOutlined } from '@ant-design/icons'
import {
  getManageContentInformationFindAllByRecommendLabel,
  getManageMemberInformationFindAllByRecommendLabel,
} from '@apps/apis'
import ImageBox from '@apps/components/src/web/ImageBox'
import { dateFormat } from '@apps/utils/src/format'
import { useGlobalConext } from '@/context/globalProvider'
import { getWebIntl } from '@/utils/locales'
import styles from './index.module.less'

const Information: React.FC = () => {
  const { userInfo, mallInfo, currentCity } = useGlobalConext()
  const [leadLeftNews, setLeadLeftNews] = useState<any[]>([]) // 头条左边新闻
  const [leadRightNews, setLeadRightNews] = useState<any[]>([]) // 头条右边新闻
  const translate = getWebIntl()
  const memberId = String(mallInfo?.memberId)
  const roleId = String(mallInfo?.memberRoleId)

  useEffect(() => {
    fetchLeadNews()
  }, [])

  const initLeadNewData = (leadNewsList: any[]) => {
    if (leadNewsList.length >= 2) {
      const leftList = leadNewsList.slice(0, Math.round(leadNewsList.length / 2))
      const rightList = leadNewsList.slice(Math.round(leadNewsList.length / 2), leadNewsList.length)
      setLeadLeftNews(leftList)
      setLeadRightNews(rightList)
    } else {
      setLeadLeftNews(leadNewsList)
      setLeadRightNews([])
    }
  }

  /**
   * 获取推荐阅读
   */
  const fetchLeadNews = async () => {
    try {
      const data: any = await fetchNewByLabel('4')
      data && initLeadNewData(data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchNewByLabel = (label: string) => {
    // 1-头条文章 2-轮播新闻 3-图片新闻 4-推荐阅读
    return new Promise((resolve, reject) => {
      const requestApi = mallInfo?.isMemberOperate
        ? getManageMemberInformationFindAllByRecommendLabel
        : getManageContentInformationFindAllByRecommendLabel
      requestApi({ recommendLabel: label, memberId, roleId })
        .then((res: { code: number; data: unknown }) => {
          if (res.code === 1000) {
            resolve(res.data)
          } else {
            reject()
          }
        })
        .catch(() => {
          reject()
        })
    })
  }

  const toDetailLink = (id: number) => {
    return `/${memberId}/info/infoDetail/${id}`
  }

  return leadLeftNews && leadLeftNews.length > 0 ? (
    <div className={styles.information} id="information">
      <div className={styles.information_container}>
        <div className={styles.information_header}>
          <span>{translate('web.resource.mall.nav-info')}</span>
          <a href={`/${memberId}/info`} className={styles.more_link}>
            {translate('web.resource.mall.moreinfo')} <RightOutlined translate={undefined} />
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
                        <a href={toDetailLink(item.id)}>
                          <div className={styles.information_recommand}>
                            <div className={styles.information_recommand_img}>
                              <ImageBox width={220} height={146} src={item.imageUrl} />
                            </div>
                            <div className={styles.information_recommand_content}>
                              <div className={styles.information_recommand_content_title}>{item.title}</div>
                              <div className={styles.information_recommand_content_date}>
                                {dateFormat(new Date(item.createTime), 'YYYY-MM-DD')}
                              </div>
                              <div className={styles.information_recommand_content_content}>{item.digest}</div>
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
                      <Fragment key={`information_recommand_right_${item.id}`}>
                        <a href={toDetailLink(item.id)}>
                          <div className={styles.information_recommand}>
                            <div className={styles.information_recommand_img}>
                              <ImageBox width={220} height={146} src={item.imageUrl} />
                            </div>
                            <div className={styles.information_recommand_content}>
                              <div className={styles.information_recommand_content_title}>{item.title}</div>
                              <div className={styles.information_recommand_content_date}>
                                {dateFormat(new Date(item.createTime), 'YYYY-MM-DD')}
                              </div>
                              <div className={styles.information_recommand_content_content}>{item.digest}</div>
                            </div>
                          </div>
                        </a>
                      </Fragment>
                    ),
                )}
            </div>
          </div>
        </div>
        <div className={styles.information_list} style={{ marginTop: 16, backgroundColor: '#FFF' }}>
          {leadLeftNews && leadLeftNews.length > 1 && (
            <div className={styles.information_list_item}>
              <div className={styles.information_list_item_body}>
                {leadLeftNews.map(
                  (item, index) =>
                    index !== 0 && (
                      <Fragment key={`small_news_list_item_left_${item.id}`}>
                        <a href={toDetailLink(item.id)}>
                          <div className={styles.news_list_item}>
                            <div className={styles.news_list_item_title}>{item.title}</div>
                            <div className={styles.news_list_item_date}>
                              {dateFormat(new Date(item.createTime), 'YYYY-MM-DD')}
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
                      <Fragment key={`small_information_recommand_right_${item.id}`}>
                        <a href={toDetailLink(item.id)}>
                          <div className={styles.news_list_item}>
                            <div className={styles.news_list_item_title}>{item.title}</div>
                            <div className={styles.news_list_item_date}>
                              {dateFormat(new Date(item.createTime), 'YYYY-MM-DD')}
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
  ) : null
}

export default Information
