import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { Button, message, Modal, Pagination } from 'antd'
import { StarFilled } from '@ant-design/icons'
import { PageHeaderWrapper } from '@apps/components'
import ShopCredit from '@/components/ShopCredit'
import NoData from '@/components/NoData'
import { numFormat } from '@/utils/numberFomat'
import { formatTimeString } from '@/utils'
import { REQUEST_HEADER, TOP_DOMAIN } from '@apps/constants'
import { COMMODITY_TYPE } from '@/constants'
import { getCommodityWebShopWebAll, GetCommodityWebShopWebAllResponse } from '@apps/apis'
import styles from '../index.less'
import {
  getProductShopCommodityCollectGetCommodityCollectList,
  postProductShopCommodityCollectDeleteCommodityCollectById,
  GetProductShopCommodityCollectGetCommodityCollectListResponseDetail,
} from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
const Commodity: React.FC = () => {
  const intl = useIntl()
  const [list, setList] = useState<GetProductShopCommodityCollectGetCommodityCollectListResponseDetail[]>([])
  const [buyLoading, setBuyLoading] = useState<boolean>(false)
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
    getShopCommodityCollectList()
  }, [current])

  /**
   * 获取收藏的商品列表
   */
  const getShopCommodityCollectList = () => {
    const params: any = {
      current,
      pageSize,
    }
    getProductShopCommodityCollectGetCommodityCollectList(params).then((res) => {
      if (res.code === 1000) {
        setList(res.data.data)
        setTotalCount(res.data.totalCount)
      }
    })
  }

  const getMallUrl = async (shopId: number) => {
    let mallList = allMallList
    if (mallList.length === 0) {
      mallList = await fetchMallList()
    }
    const findItem = mallList.find((item) => item.id === shopId)
    if (findItem) {
      return findItem
    }

    // 如果没有匹配的商城，这匹配一个默认的联营商城
    if (!findItem && mallList.length > 0) {
      const filterMallList = mallList.filter((item) => item.environment === 1 && item.type === 1 && !item.isSelf)
      const defaultMall = filterMallList.find((item) => item.isDefault)
      if (defaultMall) return defaultMall
      return filterMallList[0]
    }
    return undefined
  }

  const linkToDetail = async (detail) => {
    if (detail.isPublish) {
      const el = document.createElement('a')
      const shopInfo = await getMallUrl(detail.shopId)
      if (shopInfo) {
        const mallUrl = `${REQUEST_HEADER}${shopInfo.url}.${TOP_DOMAIN}`
        if (!shopInfo.isSelf) {
          switch (detail.commodity.priceType) {
            case 1:
            case 2:
            case 4:
              el.href = `${mallUrl}/shop/${detail.commodity.storeId}/commodity/detail/${detail.commodity.id}`
              break
            case 3:
              el.href = `${mallUrl}/shop/${detail.commodity.storeId}/integral/detail/${detail.commodity.id}`
              break
          }
        } else {
          const url = `${REQUEST_HEADER}${shopInfo.url}.${TOP_DOMAIN}`
          el.href = `${url}/${detail.commodity.memberId}/commodity/detail/${detail.commodity.id}`
        }
      }

      el.target = '_blank'
      el.id = detail.commodity.id
      // 防止反复添加
      if (!document.getElementById(detail.commodity.id)) {
        document.body.appendChild(el)
      }
      el.click()
    } else {
      message.destroy()
      message.info(intl.formatMessage({ id: 'systemSetting.collection.itemTakenOffShelf' }))
    }
  }

  const renderBtn = (priceType, commodity) => {
    switch (priceType) {
      case COMMODITY_TYPE.prompt:
      case COMMODITY_TYPE.gift:
        return (
          <Button
            loading={buyLoading}
            className={styles.collection_state_wrap_btn}
            type="link"
            onClick={() => linkToDetail(commodity)}
          >
            {intl.formatMessage({ id: 'systemSetting.collection.buyAgain' })}
          </Button>
        )
      case COMMODITY_TYPE.integral:
        return (
          <Button
            loading={buyLoading}
            className={styles.collection_state_wrap_btn}
            type="link"
            onClick={() => linkToDetail(commodity)}
          >
            {intl.formatMessage({ id: 'systemSetting.collection.redeemNow' })}
          </Button>
        )
      case COMMODITY_TYPE.inquiry:
        return (
          <Button
            loading={buyLoading}
            className={styles.collection_state_wrap_btn}
            type="link"
            onClick={() => linkToDetail(commodity)}
          >
            {intl.formatMessage({ id: 'systemSetting.collection.InquiryNow' })}
          </Button>
        )
    }
  }

  const renderPrice = (priceType, commodity) => {
    switch (priceType) {
      case COMMODITY_TYPE.prompt:
        return (
          <div className={styles.commodity_price}>
            <span>{intl.formatMessage({ id: 'common.money' })}</span>
            <label>
              {commodity.min === commodity.max
                ? numFormat(commodity.min)
                : `${numFormat(commodity.min)}~${numFormat(commodity.max)}`}
            </label>
          </div>
        )
      case COMMODITY_TYPE.integral:
        return (
          <div className={styles.commodity_point}>
            {commodity.min === commodity.max
              ? numFormat(commodity.min)
              : `${numFormat(commodity.min)}~${numFormat(commodity.max)}`}
            {intl.formatMessage({ id: 'systemSetting.collection.integral' })}
          </div>
        )
      case COMMODITY_TYPE.inquiry:
        return (
          <div className={styles.commodity_tag}>
            {intl.formatMessage({ id: 'systemSetting.collection.onlineInquiry' })}
          </div>
        )
    }
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
          }

          postProductShopCommodityCollectDeleteCommodityCollectById(param)
            .then((res) => {
              if (res.code === 1000) {
                getShopCommodityCollectList()
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
      <div className={styles.commodity_list}>
        {list.length > 0 ? (
          list.map((item, index) => (
            <div className={styles.commodity_list_item} key={`commodity_list_item_${index}`}>
              <div className={cx(styles.commodity_list_item_item, styles.morehalf)}>
                <div className={styles.shop_header_info}>
                  <div className={styles.shop_header_info_logo}>
                    <img src={item.commodity.mainPic} />
                  </div>
                  <div className={styles.shop_header_info_content}>
                    <p className={styles.commodity_name} onClick={() => linkToDetail(item)}>
                      {item.commodity.name}
                    </p>
                    <ul className={styles.tags_list}>
                      {item.commodity.sellingPoint &&
                        item.commodity.sellingPoint.map((pointItem, pointIndex) => (
                          <li className={styles.tags_list_item} key={`tags_list_item_${pointIndex}`}>
                            {pointItem}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className={cx(styles.commodity_list_item_item)}>
                <ShopCredit creditPoint={item.commodity.creditScore || 0} />
                <div className={styles.commodity_shopname}>{item.commodity.memberName}</div>
              </div>
              <div className={cx(styles.commodity_list_item_item)}>
                {renderPrice(item.commodity.priceType, item.commodity)}
              </div>
              <div className={cx(styles.commodity_list_item_item)}>
                <span className={styles.date}>{formatTimeString(item.createTime, 'YYYY-MM-DD HH:mm')}</span>
              </div>
              <div className={cx(styles.commodity_list_item_item, styles.float_right)}>
                <div className={styles.collection_state_wrap}>
                  <AuthButton type="custom" code="purchase">
                    {renderBtn(item.commodity.priceType, item)}
                  </AuthButton>
                  <AuthButton type="custom" code="collection">
                    <div className={cx(styles.collection_state)} onClick={() => handleCancelCollect(item)}>
                      <StarFilled />
                      <label>{intl.formatMessage({ id: 'systemSetting.collection.collection' })}</label>
                    </div>
                  </AuthButton>
                </div>
              </div>
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

export default Commodity
