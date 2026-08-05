import React, { useState, useEffect, useRef } from 'react'
import cx from 'classnames'
import { CloseOutlined, SearchOutlined } from '@ant-design/icons'
import { COMMODITY_TYPE } from '@/constants'
import { Input, Pagination, Spin, Empty, message } from 'antd'
import {
  getProductCommodityOftenBuyGetOftenBuyCommodityList,
  postProductShopPurchaseSaveOrUpdatePurchase,
} from '@apps/apis'
import noResultIcon from '@/assets/imgs/no_result_icon.png'
import IconFont from '@/utils/iconfont'
import { getWebIntl } from '@/utils/locales'
import { useGlobalConext } from '@/context/globalProvider'
import ImageBox from '@apps/components/src/web/ImageBox'
import styles from './index.module.less'
import useLink from '@/hooks/useLink'
import { LAYOUT_TYPE } from '@/types/global'

interface FootPrintPropsType {
  visible: boolean
  onClose: Function
  OrderStore?: any
}

// 提取价格
const getPrice = (unitPrice: Object) => {
  if (unitPrice) {
    return Object.values(unitPrice)[0] || null
  } else {
    return null
  }
}

/**
 * 常购清单
 * @param props
 * @returns
 */
const BuyList: React.FC<FootPrintPropsType> = (props) => {
  const translate = getWebIntl()
  const { visible = false, onClose } = props
  const { userInfo, mallInfo, layoutType } = useGlobalConext()
  const [oftenBuyCommodityList, setOftenBuyCommodityList] = useState<any[]>()
  const [total, setTotal] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchValue, setSearchValue] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)

  const searchValueRef = useRef<string>()
  const clickFlag = useRef<boolean>(true)
  const { linkPrefix } = useLink()

  // 去商品详情
  const goDetail = (commodityItem: any) => {
    const priceTypeKey = commodityItem.commoditySku?.priceType === COMMODITY_TYPE.prompt ? 'commodity' : 'inquiry'
    const link = linkPrefix(
      layoutType === LAYOUT_TYPE.own
        ? `/${priceTypeKey}/detail/${commodityItem.commoditySku?.commodityId}`
        : `/shop/${commodityItem.commoditySku?.storeId}/${priceTypeKey}/detail/${commodityItem.commoditySku?.commodityId}`,
    )
    commodityItem.isPublish && window.open(link)
  }

  /**
   * 获取常购清单列表
   * @param current 页码
   */
  const getOftenBuyCommodityList = (current = 1, name = '') => {
    setLoading(true)
    const param: any = {
      current,
      pageSize: 10,
      name,
    }

    const headers = {
      shopId: mallInfo?.id,
    }
    getProductCommodityOftenBuyGetOftenBuyCommodityList(param, { headers })
      .then((res) => {
        const { code, data } = res
        if (code === 1000) {
          setOftenBuyCommodityList(data.data || [])
          setTotal(data.totalCount || 0)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  /**
   * 搜索常购清单商品
   */
  const onSearchCommodity = () => {
    getOftenBuyCommodityList(1, searchValueRef.current)
  }

  /**
   * 搜索值改变
   * @param e
   */
  const onSearchValueChange = (e: any) => {
    setSearchValue(e.target.value)
    searchValueRef.current = e.target.value
  }

  /**
   * 页码改变
   */
  const onChangePage = (page: number) => {
    setCurrentPage(page)
    getOftenBuyCommodityList(page)
  }

  /**
   * 加入进货单
   */
  const handleAddToPurchase = (commodityItem: any) => {
    if (!commodityItem.isPublish) {
      return message.warning(translate('web.resource.mall.shangpinyixiajia'))
    }
    if (!checkoutUserInfo()) return
    if (clickFlag.current) {
      clickFlag.current = false
      const param: any = {
        commoditySkuId: commodityItem.commoditySku?.id,
        count: commodityItem.commoditySku?.minOrder || 1,
      }
      const headers = {
        shopId: mallInfo?.id,
      }
      postProductShopPurchaseSaveOrUpdatePurchase(param, {
        headers,
        ctlType: 'none',
      })
        .then((res: any) => {
          if (res.code === 1000) {
            message.success(translate('web.resource.mall.itemAddedPurchaseOrder'))
            // getPurchaseList(mallInfo.id);
          } else {
            message.error(res.message)
          }
        })
        .finally(() => {
          clickFlag.current = true
        })
    }
  }

  const checkoutUserInfo = () => {
    if (userInfo) {
      if (userInfo.memberRoleType !== 2) {
        message.info(translate('web.resource.mall.currentRole'))
        return false
      }
      return true
    } else {
      message.info(translate('web.resource.mall.qingxiandenglu'))
      return false
    }
  }

  useEffect(() => {
    if (visible) {
      setSearchValue('')
      getOftenBuyCommodityList()
    }
  }, [visible])

  return (
    <div className={cx(styles.footprint, styles.buyList, visible ? styles.show : styles.hide)}>
      <div className={styles.footprint_title}>
        <div className={styles.footprint_title_text}>
          <IconFont className={styles.side_nav_list_item_icon} type="icon-buylist" style={{ fontSize: 16 }} />
          <span>{translate('web.resource.mall.frequentPurchaseList')}</span>
        </div>
        <CloseOutlined onClick={() => onClose()} className={styles.footprint_title_close} translate={undefined} />
      </div>
      <div className={styles.search}>
        <Input
          value={searchValue}
          className={styles.search_input}
          onChange={onSearchValueChange}
          suffix={
            <div className={styles.search_btn} onClick={onSearchCommodity}>
              <SearchOutlined style={{ fontSize: 16 }} translate={undefined} />
            </div>
          }
        />
      </div>
      {oftenBuyCommodityList?.length ? (
        <>
          <div className={styles.commodityList} style={{ paddingBottom: 50 }}>
            <Spin spinning={loading}>
              {oftenBuyCommodityList.map((commodityItem: any, index: number) => (
                <div className={styles.commodityItem} key={`commodityItem${commodityItem.id}${index}`}>
                  <div className={styles.commodityItemBody}>
                    <a onClick={() => goDetail(commodityItem)}>
                      {!commodityItem.isPublish && (
                        <div className={styles.mask}>{translate('web.common.yixiajia')}</div>
                      )}
                      <ImageBox width={105} height={105} src={commodityItem.commoditySku?.commodityPic[0]} />
                      <div className={styles.commodityName}>{commodityItem.commoditySku?.name}</div>
                      {commodityItem.commoditySku?.priceType === COMMODITY_TYPE.gift && (
                        <div className={styles.commodityPrice}>
                          <span>{translate('web.common.currencySymbol')}</span>
                          <span>0</span>
                        </div>
                      )}
                      {commodityItem.commoditySku?.priceType === COMMODITY_TYPE.prompt && (
                        <div className={styles.commodityPrice}>
                          <span>{translate('web.common.currencySymbol')}</span>
                          <span>{getPrice(commodityItem.commoditySku?.unitPrice)}</span>
                        </div>
                      )}
                      {commodityItem.commoditySku?.priceType === COMMODITY_TYPE.inquiry && (
                        <div className={styles.commodityPrice}>
                          <span className={styles.inquiryBtn}>{translate('web.resource.mall.lijixunjia')}</span>
                        </div>
                      )}
                    </a>
                    <div className={styles.commodityOrder}>
                      <span className={styles.frequency}>
                        {translate('web.resource.mall.yigoucishu', { count: commodityItem.buyCount })}
                      </span>
                      {commodityItem.commoditySku?.priceType === COMMODITY_TYPE.prompt && (
                        <div
                          onClick={() => handleAddToPurchase(commodityItem)}
                          title={translate('web.resource.mall.jiarujinhuodan')}
                        >
                          <IconFont
                            className={styles.side_nav_list_item_icon}
                            type="icon-xiadan"
                            style={{ fontSize: 16, cursor: 'pointer' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </Spin>
          </div>
          {total > 10 && (
            <div className={styles.pagination}>
              <Pagination
                current={currentPage}
                total={total}
                hideOnSinglePage={true}
                size="small"
                showLessItems={true}
                showSizeChanger={false}
                onChange={onChangePage}
              />
            </div>
          )}
        </>
      ) : oftenBuyCommodityList && !oftenBuyCommodityList.length ? (
        <Empty
          image={noResultIcon}
          imageStyle={{ height: 40, marginTop: 16 }}
          description={<span>{translate('web.resource.mall.baoqianmeiyouzhaodaoshangpin')}</span>}
        />
      ) : null}
    </div>
  )
}

export default BuyList
