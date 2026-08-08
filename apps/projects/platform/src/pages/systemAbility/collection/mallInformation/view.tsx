import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { Pagination, message, Modal } from 'antd'
import { ImageBox, PageHeaderWrapper } from '@apps/components'
import { StarFilled, EyeOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { numFormat } from '@/utils/numberFomat'
import NoData from '@/components/NoData'
import { INFO_CENTER_URL } from '@/constants'
import { formatTimeString } from '@/utils'
import styles from '../index.less'
import {
  GetManageMemberInformationCollectListResponseDetail,
  getManageMemberInformationCollectList,
  postManageMemberInformationCollect,
} from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'

const Information: React.FC = () => {
  const intl = useIntl()
  const [list, setList] = useState<GetManageMemberInformationCollectListResponseDetail[]>([])
  const [current, setCurrent] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [totalCount, setTotalCount] = useState<number>(0)

  useEffect(() => {
    fetchCollectInformationList()
  }, [current])

  /**
   * 获取收藏的资讯列表
   */
  const fetchCollectInformationList = () => {
    const param: any = {
      current,
      pageSize,
    }

    getManageMemberInformationCollectList(param).then((res) => {
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
    if (detail.status === 2) {
      const el = document.createElement('a')
      el.href = detail.url
      el.target = '_blank'
      el.id = detail.id
      if (!document.getElementById(detail.id)) {
        document.body.appendChild(el)
      }
      el.click()
    } else {
      message.destroy()
      message.info(intl.formatMessage({ id: 'systemSetting.collection.articleTakenOffShelf' }))
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
            informationId: detail.id,
            status: false,
          }
          postManageMemberInformationCollect(param)
            .then((res) => {
              if (res.code === 1000) {
                // fetchPurchaseList()
                fetchCollectInformationList()
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
                    <ImageBox width={90} height={70} src={item.imageUrl} />
                  </div>
                  <div className={styles.information_header_info_content}>
                    <div className={styles.information_header_info_content_name} onClick={() => linkToDetail(item)}>
                      <span>{item.title}</span>
                    </div>
                    <div className={styles.information_header_info_content_about}>
                      <div className={styles.information_header_info_content_about_item}>
                        <ClockCircleOutlined />
                        <span>{formatTimeString(item.createTime, 'YYYY-MM-DD HH:mm')}</span>
                      </div>
                      <div className={styles.information_header_info_content_about_item}>
                        <EyeOutlined />
                        <span>{numFormat(item.readCount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={cx(styles.information_list_item_item)}>
                <span className={styles.date}>{formatTimeString(item.collectTime, 'YYYY-MM-DD HH:mm')}</span>
              </div>
              <AuthButton type="custom" code="collection">
                <div className={cx(styles.information_list_item_item, styles.float_right)}>
                  <div className={cx(styles.collection_state)} onClick={() => handleCancelCollect(item)}>
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

export default Information
