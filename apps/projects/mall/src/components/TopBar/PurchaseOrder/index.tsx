import React, { useState } from 'react'
import { CaretDownOutlined } from '@ant-design/icons'
import { Button, Spin, Modal, Empty } from 'antd'
import isEmpty from 'lodash/isEmpty'
import { getWebIntl } from '@/utils/locales'
import { useGlobalConext } from '@/context/globalProvider'
import { usePurchaseOrderContext } from '@/context/purchaseOrderProvider'
import ImageBox from '@apps/components/src/web/ImageBox'
import { priceFormat } from '@apps/utils/src/format'
import { LinkTo } from '@/utils'
import useLink from '@/hooks/useLink'
import styles from './index.module.less'
import { validateLoginWrapper } from '@/utils/validateLogin'

const PurchaseOrder: React.FC = () => {
  const translate = getWebIntl()
  const { mallInfo } = useGlobalConext()
  const { purchaseList, purchaseCount, purchaseDelete } = usePurchaseOrderContext()
  const [spinningState] = useState<boolean>(false)
  const { linkPrefix } = useLink()

  const getMaxCountRange = (priceRange: any[], buyCount: number) => {
    const priceList = [...priceRange]
    const result = priceList.sort((a, b) =>
      Number(b.max) < Number(buyCount) && Number(buyCount) < Number(a.min) ? 1 : -1,
    )
    return result[0]
  }

  /**
   * 计算单个商品总价格
   * @param priceRange
   * @param count
   */
  const computeItemPrice = (unitPrice: any, count: number, parameter: number = 1) => {
    if (!unitPrice) {
      return 0
    }
    let priceRange: any[] = []
    Object.keys(unitPrice).forEach((key) => {
      const keyArr = key.split('-')
      const min = keyArr[0]
      const max = keyArr[1]
      priceRange.push({
        range: key,
        min,
        max,
        price: Number(unitPrice[key]),
      })
    })
    try {
      priceRange = priceRange.sort((a, b) => (a.price < b.price ? 1 : -1))
    } catch (error) {
      console.log(error)
    }

    count = Number(count)
    if (priceRange.length === 1) {
      return parseFloat(priceRange[0].price) * count * parameter
    } else {
      let priceItem: any = {}
      for (const item of priceRange) {
        if (Number(item.min) <= count && count <= Number(item.max)) {
          priceItem = item
        }
      }
      if (isEmpty(priceItem)) {
        priceItem = getMaxCountRange(priceRange, count)
      }
      return priceItem && priceItem.price ? parseFloat(priceItem.price) * count * parameter : 0
    }
  }

  /**
   * 删除购物车的商品
   * @param id
   */
  const handleDeleteItem = (id: number) => {
    Modal.confirm({
      centered: true,
      className: styles.mallComfirm,
      content: translate('web.resource.mall.shifoucongjinhuodanzhongyichu'),
      okText: translate('web.common.confirm'),
      cancelText: translate('web.common.cancel'),
      onOk: () => {
        return purchaseDelete([id], mallInfo?.id)
      },
    })
  }

  const handleLink = validateLoginWrapper(() => {
    LinkTo(linkPrefix('/purchaseOrder'))
  })

  return (
    <>
      <li className={styles.topbar_menu_item}>
        <div className={styles.topbar_body_bg}>
          <div className={styles.topbar_menu_item_body}>
            <span>{translate('web.resource.marketing.jinhuodan')}</span>
            {purchaseCount ? (
              <div className={styles.order_count_box}>
                <span>{purchaseCount}</span>
              </div>
            ) : null}
            <CaretDownOutlined className={styles.arrow_icon} translate={undefined} />
          </div>
        </div>

        <div className={styles.order_list_box}>
          <Spin spinning={spinningState}>
            <div className={styles.order_list_box_wrap}>
              <div className={styles.order_list_box_title}>
                {translate('web.resource.mall.zuijinjiarudeshangpin')}：
              </div>
              {purchaseList && purchaseList.length > 0 ? (
                <div className={styles.order_list}>
                  {purchaseList.map((item: any, index: number) => (
                    <div className={styles.order_list_item} key={`order_list_item_${item.id}_${index}`}>
                      <ImageBox
                        width={40}
                        height={40}
                        className={styles.img}
                        src={item.purchaseSkuResp.commodity?.mainPic || ''}
                      />
                      <div className={styles.order_list_item_main}>
                        <div className={styles.commodity_name}>{item.purchaseSkuResp.commodity?.name}</div>
                        <div className={styles.commodity_attr}>
                          {item.purchaseSkuResp.commoditySkuAttributeList &&
                            item.purchaseSkuResp.commoditySkuAttributeList.map((attrItem: any, attrIndex: number) => (
                              <span key={`${item.id}_${attrItem.id}_${attrIndex}`}>
                                {attrItem.customerAttribute.name}：{attrItem.customerAttributeValue.value}
                              </span>
                            ))}
                        </div>
                      </div>
                      <div className={styles.order_list_item_right}>
                        <div className={styles.commodity_price}>
                          {translate('web.common.currencySymbol')}{' '}
                          {priceFormat(computeItemPrice(item.purchaseSkuResp?.unitPrice, 1))}
                        </div>
                        <div className={styles.del_btn} onClick={() => handleDeleteItem(item.id)}>
                          {translate('web.common.delete')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty
                  style={{ padding: '24px 0' }}
                  description={translate('web.resource.mall.jinhuodanzanwushangpin')}
                />
              )}
            </div>
          </Spin>
          <div className={styles.order_list_box_bottom}>
            <div className={styles.order_count}>
              <span>{translate('web.resource.mall.jinhuodanshengyushangpin')}：</span>
              <span>{purchaseList.length}</span>
            </div>
            <Button type="primary" size="small" onClick={handleLink}>
              {translate('web.resource.mall.chakanjinhuodan')}
            </Button>
          </div>
        </div>
      </li>
    </>
  )
}

export default PurchaseOrder
