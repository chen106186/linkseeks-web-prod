import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { Pagination, Modal, message } from 'antd'
import { StarFilled } from '@ant-design/icons'
import { PageHeaderWrapper } from '@apps/components'
import NoData from '@/components/NoData'
import ShopCredit from '@/components/ShopCredit'
import StarRate from '@/components/StarRate'
import { REQUEST_HEADER, TOP_DOMAIN } from '@apps/constants'
import { formatTimeString } from '@/utils'
import styles from '../index.less'
import {
  getCommodityWebStoreWebCollectList,
  postCommodityWebStoreWebCollect,
  GetCommodityWebStoreWebCollectListResponseDetail,
  getCommodityWebShopWebAll,
  GetCommodityWebShopWebAllResponse,
} from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
const Shops: React.FC = () => {
  const intl = useIntl()
  const [list, setList] = useState<GetCommodityWebStoreWebCollectListResponseDetail[]>([])
  const [current, setCurrent] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [allMallList, setAllMallList] = useState<GetCommodityWebShopWebAllResponse>([])

  const fetchMallList = async () => {
    const res = await getCommodityWebShopWebAll(
      {
        environment: 1,
      },
      { ctlType: 'none' },
    )
    if (res.code === 1000 && res.data) {
      setAllMallList(res.data)
      return res.data
    }
    return []
  }

  useEffect(() => {
    fetchMallList()
  }, [])

  useEffect(() => {
    fetchCollectShopList()
  }, [current])

  /**
   * 获取收藏的店铺列表
   */
  const fetchCollectShopList = () => {
    const param: any = {
      current,
      pageSize,
    }

    getCommodityWebStoreWebCollectList(param).then((res) => {
      if (res.code === 1000) {
        setList(res.data.data)
        setTotalCount(res.data.totalCount)
      }
    })
  }

  const handleChange = (page) => {
    setCurrent(page)
  }

  const handleCancelCollect = (detail) => {
    Modal.confirm({
      centered: true,
      className: styles.mallComfirm,
      content: intl.formatMessage({ id: 'systemSetting.collection.cancelCollection' }),
      onOk: () => {
        return new Promise((resolve, reject) => {
          const param: any = {
            id: detail.id,
            status: false,
          }
          postCommodityWebStoreWebCollect(param)
            .then((res) => {
              if (res.code === 1000) {
                // fetchPurchaseList()
                fetchCollectShopList()
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

  const getMallUrl = async () => {
    let mallList = allMallList
    if (mallList.length === 0) {
      mallList = await fetchMallList()
    }
    const findItem = mallList.find((item: any) => item.type === 1 && !item.isSelf)
    if (findItem) {
      return findItem
    }
    return undefined
  }

  const linkToDetail = async (detail) => {
    if (detail.status === 1) {
      const el = document.createElement('a')
      const shopInfo = await getMallUrl()
      if (shopInfo) {
        el.href = `${REQUEST_HEADER}${shopInfo.url}.${TOP_DOMAIN}/shop/${detail.id}`
        el.target = '_blank'
        el.id = detail.id
        if (!document.getElementById(detail.id)) {
          document.body.appendChild(el)
        }
        el.click()
      }
    } else {
      message.destroy()
      message.info(intl.formatMessage({ id: 'systemSetting.collection.shopFrozen' }))
    }
  }

  return (
    <PageHeaderWrapper>
      <div className={styles.shops_list}>
        {list.length > 0 ? (
          list.map((item, index) => (
            <div className={styles.shops_list_item} key={`shops_list_item_${index}`}>
              <div className={cx(styles.shops_list_item_item)}>
                <div className={styles.shop_header_info}>
                  <div className={styles.shop_header_info_logo}>
                    <img src={item.logo} />
                  </div>
                  <div className={styles.shop_header_info_content}>
                    <div className={styles.shop_header_info_content_name} onClick={() => linkToDetail(item)}>
                      <span>{item.name}</span>
                    </div>
                    <div className={styles.shop_header_info_content_about}>
                      <ShopCredit creditPoint={item.creditPoint || 0} />
                    </div>
                  </div>
                </div>
              </div>
              <div className={cx(styles.shops_list_item_item)}>
                <div className={styles.rate_wrap}>
                  <span>{intl.formatMessage({ id: 'systemSetting.collection.satisfaction' })}：</span>
                  <StarRate value={item.avgTradeCommentStar || 0} />
                </div>
              </div>
              <div className={cx(styles.shops_list_item_item)}>
                <span className={styles.date}>{formatTimeString(item.createTime, 'YYYY-MM-DD HH:mm')}</span>
              </div>
              <AuthButton type="custom" code="collection">
                <div className={cx(styles.shops_list_item_item, styles.float_right)}>
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
      {totalCount > pageSize && (
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

export default Shops
