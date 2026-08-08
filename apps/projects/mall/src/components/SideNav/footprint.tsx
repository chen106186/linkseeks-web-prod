import React, { useEffect, Fragment, useState } from 'react'
import cx from 'classnames'
import { CloseOutlined } from '@ant-design/icons'
import noResultIcon from '@/assets/imgs/no_result_icon.png'
import {
  GetProductShopBrowseRecordGetBrowseRecordListResponseDetail,
  getProductShopBrowseRecordGetBrowseRecordList,
} from '@apps/apis'
import { Empty, Pagination } from 'antd'
import { useGlobalConext } from '@/context/globalProvider'
import { getWebIntl } from '@/utils/locales'
import { dateFormat, numFormat } from '@apps/utils/src/format'
import ImageBox from '@apps/components/src/web/ImageBox'
import styles from './index.module.less'
import useLink from '@/hooks/useLink'
import { LAYOUT_TYPE } from '@/types/global'

interface FootPrintPropsType {
  visible: boolean
  effectVisible: boolean
  onClose: Function
}

const FootPrint: React.FC<FootPrintPropsType> = (props) => {
  const { visible = false, effectVisible = false, onClose } = props
  const { mallInfo, layoutType } = useGlobalConext()
  const [loading, setLoading] = useState<boolean>(true)
  const [commodityListHistory, setCommodityListHistory] = useState<
    GetProductShopBrowseRecordGetBrowseRecordListResponseDetail[]
  >([])
  const [current] = useState<number>(1)
  const [footMessage, setFootMessage] = useState<{
    [key: string]: GetProductShopBrowseRecordGetBrowseRecordListResponseDetail[]
  }>({})
  const translate = getWebIntl()
  const { linkPrefix } = useLink()

  const fnResetTimeArr = (printArr: GetProductShopBrowseRecordGetBrowseRecordListResponseDetail[]) => {
    const obj: {
      [key: string]: GetProductShopBrowseRecordGetBrowseRecordListResponseDetail[]
    } = {}
    const allId: number[] = []
    let _dataList
    if (current === 1) {
      _dataList = printArr
    } else {
      _dataList = [...commodityListHistory, ...printArr]
    }
    setCommodityListHistory(_dataList)
    _dataList.forEach((item) => {
      const objKey = dateFormat(new Date(item.createTime), 'MM-DD')
      if (obj[objKey]) {
        obj[objKey].push(item)
      } else {
        obj[objKey] = [item]
      }
      allId.push(item.id)
    })

    setFootMessage(obj)
  }

  const fetchBrowerHistoryList = (page = '1') => {
    const param = {
      current: page,
      pageSize: '50',
    }
    const headers: any = {
      shopId: mallInfo?.id,
    }
    setLoading(true)
    getProductShopBrowseRecordGetBrowseRecordList(param, { headers })
      .then((res) => {
        if (res.code === 1000 && res.data) {
          fnResetTimeArr(res.data.data)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (visible) {
      fetchBrowerHistoryList()
    }
  }, [visible])

  const renderPrice = (item: GetProductShopBrowseRecordGetBrowseRecordListResponseDetail) => {
    switch (item.priceType) {
      case 1:
        return (
          <div className={styles.commodityPrice}>
            <span>{translate('web.common.currencySymbol')}</span>
            <span>{item.min}</span>
          </div>
        )
      case 2:
        return (
          <div className={styles.inquiry_price}>
            <label>{translate('web.resource.mall.zaixianxunjia')}</label>
          </div>
        )
      case 3:
        return (
          <div className={styles.goods_price}>
            {numFormat(item.min)}
            {translate('web.resource.mall.integral')}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className={cx(styles.footprint, visible ? styles.show : effectVisible ? styles.effectHide : styles.hide)}>
      <div className={styles.footprint_title}>
        <span>{'浏览记录'}</span>
        <CloseOutlined onClick={() => onClose()} className={styles.footprint_title_close} translate={undefined} />
      </div>
      <div className={styles.commodityList}>
        {footMessage && Object.keys(footMessage).length > 0 ? (
          Object.keys(footMessage).map((date) => {
            const list = footMessage[date]
            return (
              <Fragment key={date}>
                <div className={styles.date}>{date}</div>
                {list.map((commodityItem, commodityItemIndex) => (
                  <div
                    className={styles.commodityItem}
                    key={`commodityItem${commodityItem.commodityId}${commodityItemIndex}`}
                  >
                    <div className={styles.commodityItemBody}>
                      <a
                        href={linkPrefix(
                          layoutType === LAYOUT_TYPE.own
                            ? `/commodity/detail/${commodityItem.commodityId}`
                            : `/shop/${commodityItem.storeId}/commodity/detail/${commodityItem.commodityId}`,
                        )}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ImageBox width={105} height={105} src={commodityItem.mainPic} />
                        <div className={styles.commodityName}>{commodityItem.commodityName}</div>
                        {renderPrice(commodityItem)}
                      </a>
                    </div>
                  </div>
                ))}
              </Fragment>
            )
          })
        ) : !loading ? (
          <Empty
            image={noResultIcon}
            imageStyle={{ height: 40, marginTop: 16 }}
            description={<span>{translate('web.resource.mall.baoqianmeiyouzhaodaoshangpin')}</span>}
          />
        ) : null}
      </div>
    </div>
  )
}

export default FootPrint
