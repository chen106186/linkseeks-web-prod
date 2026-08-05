import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { Pagination, message, Modal } from 'antd'
import { StarFilled } from '@ant-design/icons'
import { PageHeaderWrapper } from '@apps/components'
import NoData from '@/components/NoData'
import { formatTimeString } from '@/utils'
import styles from '../index.less'
import {
  GetCommodityWebMemberProcessWebCollectListResponseDetail,
  getCommodityWebMemberProcessWebCollectList,
  postCommodityWebMemberProcessWebCollect,
} from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import { AuthButton } from '@apps/components'
import useShopUrl from '../hooks/useShopUrl'

const Process: React.FC = () => {
  const intl = useIntl()
  const [list, setList] = useState<GetCommodityWebMemberProcessWebCollectListResponseDetail[]>([])
  const [current, setCurrent] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [totalCount, setTotalCount] = useState<number>(0)
  const { shopLink } = useShopUrl({ shopType: 4 })

  useEffect(() => {
    fetchCollectList()
  }, [current])

  /**
   * 获取收藏的资讯列表
   */
  const fetchCollectList = async () => {
    const param: any = {
      current,
      pageSize,
    }

    getCommodityWebMemberProcessWebCollectList(param).then((res) => {
      if (res.code === 1000) {
        setList(res.data.data)
        setTotalCount(res.data.totalCount)
      }
    })
  }

  const handleChange = (page) => {
    setCurrent(page)
  }

  const linkToDetail = (detail) => {
    if (detail.status !== 0 && shopLink) {
      const el = document.createElement('a')
      el.href = `${shopLink}/aboutUs/${detail.id}`
      el.target = '_blank'
      el.id = detail.id
      if (!document.getElementById(detail.id)) {
        document.body.appendChild(el)
      }
      el.click()
    } else {
      message.destroy()
      message.info(intl.formatMessage({ id: 'systemSetting.collection.processorFrozen' }))
    }
  }

  const handleCancelCollect = (detail) => {
    Modal.confirm({
      centered: true,
      className: styles.mallComfirm,
      content: intl.formatMessage({ id: 'systemSetting.collection.cancelCollection' }),
      onOk: () => {
        return new Promise((resolve, reject) => {
          const param = {
            id: detail.id,
            status: false,
          }
          postCommodityWebMemberProcessWebCollect(param)
            .then((res) => {
              if (res.code === 1000) {
                // fetchPurchaseList()
                fetchCollectList()
                resolve(true)
              } else {
                reject()
              }
            })
            .catch(() => {
              reject()
            })
        })
      },
    })
  }

  return (
    <PageHeaderWrapper>
      <div className={styles.information_list}>
        {list.length > 0 ? (
          list.map((item, index) => (
            <div className={styles.information_list_item} key={`information_list_item_${index}`}>
              <div className={cx(styles.information_list_item_item, styles.morehalf)}>
                <div className={styles.information_header_info}>
                  <div className={styles.information_header_info_logo}>
                    <img src={item.logo} />
                  </div>
                  <div className={styles.information_header_info_content}>
                    <div className={styles.information_header_info_content_name} onClick={() => linkToDetail(item)}>
                      <span>{item.memberName}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={cx(styles.information_list_item_item)}>
                <span className={styles.date}>{formatTimeString(item.createTime, 'YYYY-MM-DD HH:mm')}</span>
              </div>
              <AuthButton type="custom" code="collection">
                <div
                  className={cx(styles.information_list_item_item, styles.float_right)}
                  onClick={() => handleCancelCollect(item)}
                >
                  <div className={cx(styles.collection_state)}>
                    <StarFilled />
                    <label>{intl.formatMessage({ id: 'systemSetting.collection.collection' })}</label>
                  </div>
                </div>
              </AuthButton>
            </div>
          ))
        ) : (
          <NoData />
        )}
      </div>
      {totalCount > 0 && (
        <div className={styles.pagination_wrap}>
          <Pagination
            showSizeChanger={false}
            current={current}
            total={totalCount}
            pageSize={pageSize}
            onChange={handleChange}
          />
        </div>
      )}
    </PageHeaderWrapper>
  )
}

export default Process
