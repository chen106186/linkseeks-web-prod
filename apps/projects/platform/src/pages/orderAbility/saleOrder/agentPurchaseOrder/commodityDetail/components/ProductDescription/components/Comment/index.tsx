import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { Rate, Pagination, Spin } from 'antd'
import ImageViewList from '../ImageViewList'
import defaultAvatar from '@/assets/imgs/default_avatar.png'
import { LAYOUT_TYPE } from '@/constants'
// import { isEmpty } from 'lodash'
import NoData from '../../../../../components/NoData'
import { formatTimeString } from '@/utils'
import styles from './index.less'
import {
  GetMemberCommentMallTradeSummaryResponse,
  getMemberCommentMallTradeHistoryPage,
  getMemberCommentMallTradeSummary,
} from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'

interface CommentPropsType {
  productId: number | undefined
  setCount: Function
  memberId: number
  layoutType: LAYOUT_TYPE
  shopType: number
}

const Comment: React.FC<CommentPropsType> = (props) => {
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
  const intl = useIntl()

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

    // if(layoutType === LAYOUT_TYPE.channel || layoutType === LAYOUT_TYPE.ichannel) {
    //   param.channelMemberId = memberId
    // }

    setSpinLoading(true)

    getMemberCommentMallTradeHistoryPage(param)
      .then((res: any) => {
        setSpinLoading(false)
        if (res.code === 1000) {
          setTotalCount(res.data.totalCount)
          setCommentList(res.data.data)
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

    // if (layoutType === LAYOUT_TYPE.channel || layoutType === LAYOUT_TYPE.ichannel) {
    //   param.channelMemberId = memberId
    // }

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
        title: intl.formatMessage({ id: 'PDtion.Comment.index.AllEvaluation' }),
        sum: allCount,
        sumText: allCount > 200 ? `(200+)` : `(${allCount})`,
        type: 'all',
      },
      {
        title: intl.formatMessage({ id: 'PDtion.Comment.index.GoodEvaluation' }),
        sum: goodCount,
        sumText: goodCount > 100 ? `(100+)` : `(${goodCount})`,
        type: 'good',
      },
      {
        title: intl.formatMessage({ id: 'PDtion.Comment.index.MiddleEvaluation' }),
        sum: middleCount,
        sumText: middleCount > 100 ? `(100+)` : `(${middleCount})`,
        type: 'middle',
      },
      {
        title: intl.formatMessage({ id: 'PDtion.Comment.index.BadEvaluation' }),
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
      <div className={styles.comment_title}>{intl.formatMessage({ id: 'PDtion.Comment.index.TEvaluation' })}</div>
      <div className={styles.favorable_comments}>
        <div className={styles.favorable_comments_item}>
          <span className={styles.favorable_comments_title}>
            {intl.formatMessage({ id: 'shopAbout.index.Satisfaction' })}:{' '}
          </span>
          <Rate className={styles.comment_rate} count={5} disabled value={summaryInfo?.avgStar || 0} />
          <span>{summaryInfo?.avgStar || 0}</span>
        </div>
        <div className={styles.favorable_comments_item_split}></div>
        <div className={styles.favorable_comments_item}>
          <span className={styles.favorable_comments_title}>
            {intl.formatMessage({ id: 'PDtion.Comment.index.FavorableRate' })}
          </span>
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
                    <img src={defaultAvatar} />
                  </div>
                  <div className={styles.user_name}>{item.memberName}</div>
                  {item.levelTag && <div className={styles.user_type}>{item.levelTag}</div>}
                </div>
                <div className={styles.comment_list_item_right}>
                  <Rate className={styles.comment_rate} count={5} disabled defaultValue={item.star || 0} />
                  <div className={styles.comment_content}>{item.comment}</div>
                  {item.pics && item.pics.length > 0 && <ImageViewList imgList={item.pics} />}
                  <div className={styles.comment_date}>{formatTimeString(item.createTime, 'YYYY-MM-DD HH:mm')}</div>
                  {item.replyContent && (
                    <>
                      <div className={styles.reply_split}></div>
                      <div className={styles.reply_content}>
                        {intl.formatMessage({ id: 'PDtion.Comment.index.reply' })}
                        {item.replyContent}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <NoData content={intl.formatMessage({ id: 'PDtion.Comment.index.NoT' })} />
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
