import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { Rate, Pagination, Spin } from 'antd'
import defaultAvatar from '@/assets/imgs/default_avatar.png'
import moment from 'moment'
import {
  GetMemberCommentMallTradeSummaryResponse,
  getMemberCommentMallTradeHistoryPage,
  getMemberCommentMallTradeSummary,
} from '@apps/apis'
import { getWebIntl } from '@/utils/locales'
import { LAYOUT_TYPE } from '@/types/global'
import NoData from '@/components/NoData'
import ImageViewList from '../ImageViewList'
import styles from './index.module.less'

interface CommentPropsType {
  productId: number | undefined
  setCount: Function
  layoutType: LAYOUT_TYPE
  shopType?: number
}

const Comment: React.FC<CommentPropsType> = (props) => {
  const translate = getWebIntl()
  const { setCount, shopType, productId } = props
  const [current, setCurrent] = useState<number>(1)
  const [pageSize] = useState<number>(10)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [summaryInfo, setSummaryInfo] = useState<GetMemberCommentMallTradeSummaryResponse>()
  const [commentList, setCommentList] = useState<any[]>([])
  const [commentCountList, setCommentCountList] = useState<any>([])
  const [commentType, setCommentType] = useState<string>('all')
  const [spinLoading, setSpinLoading] = useState<boolean>(true)
  const [goodRate, setGoodRate] = useState<number>(0)

  useEffect(() => {
    if (productId) {
      fetchCommentList()
      fetchCommentSummary()
    }
  }, [productId])

  useEffect(() => {
    if (productId) {
      fetchCommentList(commentType)
    }
  }, [current])

  const fetchCommentList = (type = '') => {
    const param: any = {
      current,
      pageSize,
      shopType,
      productId,
    }
    if (type === 'good') {
      param.starLevel = 3
    } else if (type === 'middle') {
      param.starLevel = 2
    } else if (type === 'bad') {
      param.starLevel = 1
    }

    setSpinLoading(true)

    getMemberCommentMallTradeHistoryPage(param)
      .then((res: any) => {
        setSpinLoading(false)
        if (res.code === 1000) {
          if (res.data && res.data.data.length > 0) {
            setTotalCount(res.data.totalCount)
            setCommentList(res.data.data)
          } else {
            setTotalCount(0)
            setCommentList([])
          }
        }
      })
      .catch(() => {
        setSpinLoading(false)
      })
  }

  const fetchCommentSummary = () => {
    const param: any = {
      productId,
      shopType,
    }

    getMemberCommentMallTradeSummary(param).then((res: any) => {
      if (res.code === 1000) {
        setSummaryInfo(res.data)
        getCommentCountBySummary(res.data.rows)
      }
    })
  }

  /**
   * 计算各种评价星级的数量
   * @param data
   */
  const getCommentCountBySummary = (data: any[]) => {
    let goodCount = 0
    let middleCount = 0
    let badCount = 0
    if (data) {
      for (const item of data) {
        switch (item.star) {
          case 1:
          case 2:
            badCount += item.sum || 0
            break
          case 3:
            middleCount += item.sum || 0
            break
          case 4:
          case 5:
            goodCount += item.sum || 0
            break
          default:
            break
        }
      }
    }
    const allCount = goodCount + middleCount + badCount

    const result = [
      {
        title: translate('web.resource.mall.quanbupingjia'),
        sum: allCount,
        sumText: allCount > 200 ? `(200+)` : `(${allCount})`,
        type: 'all',
      },
      {
        title: translate('web.resource.mall.haoping'),
        sum: goodCount,
        sumText: goodCount > 100 ? `(100+)` : `(${goodCount})`,
        type: 'good',
      },
      {
        title: translate('web.resource.mall.zhongping'),
        sum: middleCount,
        sumText: middleCount > 100 ? `(100+)` : `(${middleCount})`,
        type: 'middle',
      },
      {
        title: translate('web.resource.mall.chaping'),
        sum: badCount,
        sumText: badCount > 100 ? `(100+)` : `(${badCount})`,
        type: 'bad',
      },
    ]
    setCommentCountList(result)
    setCount(allCount)
    if (goodCount > 0) {
      setGoodRate(Math.floor((goodCount / allCount) * 100))
    }
  }

  const handleFilterCommentType = (type: string) => {
    setCommentType(type)
    fetchCommentList(type)
  }

  const handlePageChange = (page: number) => {
    setCurrent(page)
  }

  return (
    <div id="comment" className={styles.comment}>
      <div className={styles.comment_title}>{translate('web.resource.mall.jiaoyipingjia')}</div>
      <div className={styles.favorable_comments}>
        <div className={styles.favorable_comments_item}>
          <span className={styles.favorable_comments_title}>{translate('web.resource.mall.manyidu')}: </span>
          <Rate className={styles.comment_rate} count={5} disabled value={summaryInfo?.avgStar || 0} />
          <span>{summaryInfo?.avgStar || 0}</span>
        </div>
        <div className={styles.favorable_comments_item_split}></div>
        <div className={styles.favorable_comments_item}>
          <span className={styles.favorable_comments_title}>{translate('web.resource.mall.haopinglv')}</span>
          <span>
            {goodRate}
            <i>%</i>
          </span>
        </div>
      </div>
      <div className={styles.common_count}>
        {commentCountList.map((item: any, index: number) => (
          <div
            key={`common_count_item_${index}`}
            className={cx(styles.common_count_item, commentType === item.type ? styles.active : '')}
            onClick={() => handleFilterCommentType(item.type)}
          >
            {item.title}
            {item.sumText}
          </div>
        ))}
      </div>
      <Spin spinning={spinLoading}>
        <div className={styles.comment_list}>
          {commentList && commentList.length > 0 ? (
            commentList.map((item) => (
              <div className={styles.comment_list_item} key={item.id}>
                <div className={styles.comment_list_item_left}>
                  <div className={styles.user_avatar}>
                    <img src={item.logo || defaultAvatar} />
                  </div>
                  <div className={styles.user_name}>{item.memberName}</div>
                  {item.levelTag && <div className={styles.user_type}>{item.levelTag}</div>}
                </div>
                <div className={styles.comment_list_item_right}>
                  <Rate className={styles.comment_rate} count={5} disabled defaultValue={item.star || 0} />
                  <div className={styles.comment_content}>{item.comment}</div>
                  {item.pics && item.pics.length > 0 && <ImageViewList imgList={item.pics} />}
                  <div className={styles.comment_date}>{moment(item.createTime).format('YYYY-MM-DD HH:mm')}</div>
                  {item.replyContent && (
                    <>
                      <div className={styles.reply_split}></div>
                      <div className={styles.reply_content}>
                        {translate('web.resource.mall.huifu')}
                        {item.replyContent}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <NoData content={translate('web.resource.mall.zanwujiaoyipingjia')} />
          )}
        </div>
        {totalCount > 0 && (
          <div className={styles.pagination_wrap}>
            <Pagination
              showQuickJumper
              showSizeChanger={false}
              onChange={handlePageChange}
              current={current}
              pageSize={pageSize}
              total={totalCount}
            />
          </div>
        )}
      </Spin>
    </div>
  )
}

export default Comment
