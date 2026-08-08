import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import timerIcon from './imgs/timer_icon.png'
import purchaseIcon from './imgs/purchase_icon.png'
import Banner from './banner'
import styles from './index.less'
import { PlatformLocale } from '../../../locale/types/platform'
import LocaleReceiver from '../../../components/LocaleProvider/LocaleReceiver'

interface ItemType {
  id: number
  details: string
  type: number
  count: number
  deliveryTimeStr: string
  createTimeStr: string
  memberName: string
  days: number
  hours: number
  minutes: number
}

interface NoticeItem {
  id: number
  name: string
  type: number // 类型：1.询价；2.招标；3.竞价；
  content: string
  memberId: number
  roleId: number
  createTime: string
}

interface PurchaseProps {
  allList: ItemType[]
  inquiryList: ItemType[]
  tenderList: ItemType[]
  biddingList: ItemType[]
  getPurchaseNoticeList: (type: number) => Promise<any>
}

const Purchase: React.FC<PurchaseProps> & { Banner: typeof Banner } = (
  props,
) => {
  const {
    children,
    allList,
    inquiryList,
    tenderList,
    biddingList,
    getPurchaseNoticeList,
  } = props
  const [purchaseType, setPurchaseType] = useState<number>(0)
  const [noticeList, setNoticeList] = useState<NoticeItem[]>([])
  const [noticeType, setNoticeType] = useState<number>(0)

  useEffect(() => {
    fetchData(0)
  }, [getPurchaseNoticeList])

  const fetchData = async (type: number) => {
    if (getPurchaseNoticeList && typeof getPurchaseNoticeList === 'function') {
      const list = await getPurchaseNoticeList(type)
      setNoticeList(list)
    }
  }

  const changeNoticeType = (type: number) => {
    setNoticeType(type)
    fetchData(type)
  }

  const renderComponent = (locale: PlatformLocale) => {
    const getNoticeType = (type: number) => {
      switch (type) {
        case 1:
          return `[${locale['platform.inquiry.publicity']}]`
        case 2:
          return `[${locale['platform.invite.publicity']}]`
        case 3:
          return `[${locale['platform.bidding.publicity']}]`
        default:
          return ''
      }
    }

    const returnTagByType = (type: number) => {
      switch (type) {
        case 1:
          return locale['platform.inquiry']
        case 2:
          return locale['platform.invite']
        case 3:
          return locale['platform.bidding']
        default:
          return ''
      }
    }

    const renderList = () => {
      let list: ItemType[] = []
      switch (purchaseType) {
        case 0:
          list = allList
          break
        case 1:
          list = inquiryList
          break
        case 2:
          list = tenderList
          break
        case 3:
          list = biddingList
          break
      }

      return (
        <div className={styles.purchase_list}>
          {list &&
            list.map((item) => (
              <div
                className={styles.purchase_list_item}
                key={`purchase_list_item_${item.id}`}
              >
                <div className={styles.purchase_info}>
                  <div className={styles.purchase_name}>{item.details}</div>
                  <div className={styles.line}>
                    <div className={cx(styles.purchase_type, styles.type1)}>
                      {returnTagByType(item.type)}
                    </div>
                    <div className={styles.line_item}>
                      {locale['platform.buy.goods']}：{item.count}
                      {locale['platform.unit.species']}
                    </div>
                    <div className={styles.line_item}>
                      {locale['platform.delivery.time']}：{item.deliveryTimeStr}
                    </div>
                  </div>
                </div>
                <div className={styles.purchase_shop_info}>
                  <div className={styles.shop_name}>{item.memberName}</div>
                  <div className={styles.create_time}>{item.createTimeStr}</div>
                </div>
                <div className={styles.publish_time}>
                  <img src={timerIcon} />
                  <span>
                    {item.days
                      ? `${item.days}${locale['platform.unit.day']}:`
                      : ''}
                    {item.hours
                      ? `${item.hours}${locale['platform.unit.hour']}:`
                      : ''}
                    {`${item.minutes || 0}${locale['platform.unit.minute']}`}
                  </span>
                </div>
                <div className={styles.detail_btn}>
                  {locale['platform.detail']}
                </div>
              </div>
            ))}
        </div>
      )
    }

    return (
      <div className={styles.purchase}>
        <div className={cx(styles.module_card, styles.autoWidth)}>
          <div className={styles.module_card_title}>
            <i className={styles.module_card_title_icon}>
              <img src={purchaseIcon} />
            </i>
            <label className={styles.module_card_title_label}>
              {locale['platform.purchase.title']}
            </label>
            <div className={styles.type_list}>
              <div
                className={cx(
                  styles.type_list_item,
                  purchaseType === 0 && styles.active,
                )}
                onClick={() => setPurchaseType(0)}
              >
                {locale['platform.information.tab.all']}
              </div>
              <div
                className={cx(
                  styles.type_list_item,
                  purchaseType === 1 && styles.active,
                )}
                onClick={() => setPurchaseType(1)}
              >
                {locale['platform.inquiry']}
              </div>
              <div
                className={cx(
                  styles.type_list_item,
                  purchaseType === 2 && styles.active,
                )}
                onClick={() => setPurchaseType(2)}
              >
                {locale['platform.invite']}
              </div>
              <div
                className={cx(
                  styles.type_list_item,
                  purchaseType === 3 && styles.active,
                )}
                onClick={() => setPurchaseType(3)}
              >
                {locale['platform.bidding']}
              </div>
            </div>
            <div className={styles.type_more}>
              {locale['platform.more.btn']} &gt;
            </div>
          </div>
          {renderList()}
        </div>
        <div className={styles.purchase_publicity}>
          <div className={styles.purchase_publicity_title}>
            <div className={styles.publicity_type}>
              <div
                className={cx(
                  styles.publicity_type_item,
                  noticeType === 0 ? styles.active : '',
                )}
                onClick={() => changeNoticeType(0)}
              >
                {locale['platform.information.tab.all']}
              </div>
              <div
                className={cx(
                  styles.publicity_type_item,
                  noticeType === 1 ? styles.active : '',
                )}
                onClick={() => changeNoticeType(1)}
              >
                {locale['platform.inquiry.publicity']}
              </div>
              <div
                className={cx(
                  styles.publicity_type_item,
                  noticeType === 2 ? styles.active : '',
                )}
                onClick={() => changeNoticeType(2)}
              >
                {locale['platform.invite.publicity']}
              </div>
              <div
                className={cx(
                  styles.publicity_type_item,
                  noticeType === 3 ? styles.active : '',
                )}
                onClick={() => changeNoticeType(3)}
              >
                {locale['platform.bidding.publicity']}
              </div>
            </div>
            <div className={styles.publicity_more}>
              {locale['platform.more.btn']} &gt;
            </div>
          </div>
          <div className={styles.purchase_publicity_body}>
            <div className={styles.publicity_list}>
              {noticeList &&
                noticeList.map((item) => (
                  <div
                    className={styles.publicity_list_item}
                    key={`publicity_list_item_${item.id}`}
                  >
                    {getNoticeType(item.type)} {item.content}
                  </div>
                ))}
            </div>
            <div className={styles.publicity_advert}>{children}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <LocaleReceiver componentName="Platform">{renderComponent}</LocaleReceiver>
  )
}

Purchase.Banner = Banner

export default Purchase
