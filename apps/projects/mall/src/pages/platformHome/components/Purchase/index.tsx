import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { SelectAreaItemType } from '@/types/global'
import ImageBox from '@apps/components/src/web/ImageBox'
import { LinkTo } from '@/utils'
import moment from 'moment'
import {
  getPurchaseBiddingSearchSourceList,
  getPurchaseInviteTenderGetInviteTenderListByEnterpriseWeb,
  getPurchasePurchaseInquirySearchSourceList,
  getPurchasePurchaseNoticeList,
} from '@apps/apis'
import { useGlobalConext } from '@/context/globalProvider'
import timerIcon from './imgs/timer_icon.png'
import purchaseIcon from '../icons/purchase_icon.png'
import { getWebIntl } from '@/utils/locales'
import styles from './index.module.less'

interface NoticeItem {
  id: number
  name: string
  type: number // 类型：1.询价；2.招标；3.竞价；
  content: string
  memberId: number
  roleId: number
  createTime: string
}

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

interface PurchaseProps {
  advertList: any[]
  anchor: string
  currentCity: SelectAreaItemType | undefined
}

const Purchase: React.FC<PurchaseProps> = (props) => {
  const { advertList, anchor, currentCity } = props
  const [purchaseType, setPurchaseType] = useState<number>(0)
  const [allList, setAllList] = useState<any[]>([])
  const [inquiryList, setInquiryList] = useState<any[]>([])
  const [tenderList, setTenderList] = useState<any[]>([])
  const [biddingList, setBiddingList] = useState<any[]>([])
  const [noticeList, setNoticeList] = useState<NoticeItem[]>([])
  const [noticeType, setNoticeType] = useState<number>(0)
  const translate = getWebIntl()
  const { mallUrl } = useGlobalConext()

  const initData = async () => {
    const tempInquiryList: any = await getInquiryList()
    const tempTenderList: any = await getInviteTenderList()
    const tempBiddingList: any = await getBiddingList()
    let tempAllList: any[] = []
    if (tempInquiryList.length > 0) {
      const tempList = tempInquiryList.slice(0, 2)
      tempAllList = [...tempAllList, ...tempList]
    }
    if (tempTenderList.length > 0) {
      const tempList = tempTenderList.slice(0, 2)
      tempAllList = [...tempAllList, ...tempList]
    }
    if (tempBiddingList.length > 0) {
      const tempList = tempBiddingList.slice(0, 2)
      tempAllList = [...tempAllList, ...tempList]
    }
    setAllList(tempAllList)
    setInquiryList(tempInquiryList)
    setTenderList(tempTenderList)
    setBiddingList(tempBiddingList)
  }

  useEffect(() => {
    initData()
    getPurchaseNoticeList(0)
  }, [])

  /**
   * 获取采购询价
   * @returns
   */
  const getInquiryList = () => {
    return new Promise((resolve) => {
      const param: any = {
        current: 1,
        pageSize: 6,
        overdue: 1,
        provinceCode: currentCity?.provinceCode,
        cityCode: currentCity?.cityCode,
      }
      const headers: any = {
        shopId: mallUrl?.srmPortal?.id,
      }
      getPurchasePurchaseInquirySearchSourceList(param, { headers })
        .then((res) => {
          if (res.code === 1000) {
            let list: any[] = res.data.data
            list = list.map((item) => {
              return {
                id: item.id,
                details: item.details,
                type: 1,
                count: item.count,
                deliveryTimeStr: moment(item.deliveryTime).format('YYYY-MM-DD'),
                createTimeStr: moment(item.createTime).format('YYYY-MM-DD HH:mm:ss'),
                memberName: item.memberName,
                memberRoleId: item.memberRoleId,
                days: item.days,
                hours: item.hours,
                minutes: item.minutes,
              }
            })
            resolve(list)
          } else {
            resolve([])
          }
        })
        .catch(() => {
          resolve([])
        })
    })
  }

  /**
   * 获取采购招标
   * @returns
   */
  const getInviteTenderList = () => {
    return new Promise((resolve) => {
      const param: any = {
        current: 1,
        pageSize: 6,
        overdue: true,
        provinceCode: currentCity?.provinceCode,
        cityCode: currentCity?.cityCode,
      }
      const headers: any = {
        shopId: mallUrl?.srmPortal?.id,
      }

      getPurchaseInviteTenderGetInviteTenderListByEnterpriseWeb(param, { headers })
        .then((res) => {
          if (res.code === 1000) {
            let list: any[] = res.data.data || []
            list = list.map((item) => {
              return {
                id: item.id,
                details: item.projectName,
                type: 2,
                count: item.inviteTenderMaterielCount,
                deliveryTimeStr: moment(item.hopeDate).format('YYYY-MM-DD'),
                createTimeStr: moment(item.createTime).format('YYYY-MM-DD HH:mm:ss'),
                memberName: item.memberName,
                days: item.days,
                hours: item.hours,
                minutes: item.minutes,
              }
            })
            resolve(list)
          } else {
            resolve([])
          }
        })
        .catch(() => {
          resolve([])
        })
    })
  }

  /**
   * 获取采购竞价
   * @returns
   */
  const getBiddingList = () => {
    return new Promise((resolve) => {
      const param: any = {
        current: 1,
        pageSize: 6,
        overdue: 1,
        // provinceCode: currentCity?.provinceCode,
        // cityCode: currentCity?.cityCode,
      }
      const headers: any = {
        shopId: mallUrl?.srmPortal?.id,
      }
      getPurchaseBiddingSearchSourceList(param, { headers })
        .then((res) => {
          if (res.code === 1000) {
            let list: any[] = res.data.data
            list = list.map((item) => {
              return {
                id: item.id,
                details: item.details,
                type: 3,
                count: item.count,
                deliveryTimeStr: moment(item.deliveryTime).format('YYYY-MM-DD'),
                createTimeStr: moment(item.createTime).format('YYYY-MM-DD HH:mm:ss'),
                memberName: item.memberName,
                days: item.days,
                hours: item.hours,
                minutes: item.minutes,
              }
            })
            resolve(list)
          } else {
            resolve([])
          }
        })
        .catch(() => {
          resolve([])
        })
    })
  }

  const returnTagByType = (type: number) => {
    switch (type) {
      case 1:
        return '询价'
      case 2:
        return '招标'
      case 3:
        return '竞价'
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

    const getLinkByType = (item: ItemType) => {
      switch (item.type) {
        case 1:
          return `${mallUrl?.srmUrl}/InquiryDetail/${item.id}`
        case 2:
          return `${mallUrl?.srmUrl}/biddingDetail/${item.id}`
        case 3:
          return `${mallUrl?.srmUrl}/competeDetail/${item.id}`
        default:
          return '#!'
      }
    }

    return (
      <div className={styles.purchase_list}>
        {list &&
          list.map((item, index) => (
            <div className={styles.purchase_list_item} key={`purchase_list_item_${item.id}_${index}`}>
              <div className={styles.purchase_info}>
                <a href={getLinkByType(item)} target="_blank" className={styles.purchase_name}>
                  {item.details}
                </a>
                <div className={styles.line}>
                  <div className={cx(styles.purchase_type, styles.type1)}>{returnTagByType(item.type)}</div>
                  <div className={styles.line_item}>采购商品 ：{item.count}种</div>
                  <div className={styles.line_item}>交付日期 ：{item.deliveryTimeStr}</div>
                </div>
              </div>
              <div className={styles.purchase_shop_info}>
                <div className={styles.shop_name}>{item.memberName}</div>
                <div className={styles.create_time}>{item.createTimeStr}</div>
              </div>
              <div className={styles.publish_time}>
                <img src={timerIcon} />
                <span>
                  {item.days ? `${item.days}${'天'}:` : ''}
                  {item.hours ? `${item.hours}${'小时'}:` : ''}
                  {`${item.minutes || 0}${'分'}`}
                </span>
              </div>
              <a href={getLinkByType(item)} target="_blank" className={styles.detail_btn}>
                查看详情
              </a>
            </div>
          ))}
      </div>
    )
  }

  const getPurchaseNoticeList = (type: number) => {
    const param: any = {
      current: 1,
      pageSize: 8,
      createTime: 'DESC',
    }
    if (type) {
      param.type = type
    }
    const headers: any = {
      shopId: mallUrl?.srmPortal?.id,
    }
    getPurchasePurchaseNoticeList(param, { headers }).then((res) => {
      if (res.code === 1000) {
        setNoticeList(res.data.data as unknown as NoticeItem[])
      }
    })
  }

  const changeNoticeType = (type: number) => {
    setNoticeType(type)
    getPurchaseNoticeList(type)
  }

  const getNoticeType = (type: number) => {
    switch (type) {
      case 1:
        return '[询价公示]'
      case 2:
        return '[招标公示]'

      case 3:
        return '[竞价公示]'

      default:
        return ''
    }
  }

  const handleLink = (link: string) => {
    if (link) {
      LinkTo(link, 'open')
    }
  }

  return (
    <div className={styles.purchase} id={anchor}>
      <div className={cx(styles.module_card, styles.autoWidth)}>
        <div className={styles.module_card_title}>
          <i className={styles.module_card_title_icon}>
            <img src={purchaseIcon} />
          </i>
          <label className={styles.module_card_title_label}>名企采购</label>
          <div className={styles.type_list}>
            <div
              className={cx(styles.type_list_item, purchaseType === 0 && styles.active)}
              onClick={() => setPurchaseType(0)}
            >
              全部
            </div>
            <div
              className={cx(styles.type_list_item, purchaseType === 1 && styles.active)}
              onClick={() => setPurchaseType(1)}
            >
              询价
            </div>
            <div
              style={{ minWidth: '72px' }}
              className={cx(styles.type_list_item, purchaseType === 2 && styles.active)}
              onClick={() => setPurchaseType(2)}
            >
              招标
            </div>
            <div
              className={cx(styles.type_list_item, purchaseType === 3 && styles.active)}
              onClick={() => setPurchaseType(3)}
            >
              竞价
            </div>
          </div>
          <a href={mallUrl?.srmUrl} className={styles.type_more}>
            更多 &gt;
          </a>
        </div>
        {renderList()}
      </div>
      <div className={styles.purchase_publicity}>
        <div className={styles.purchase_publicity_title}>
          <div className={styles.publicity_type}>
            <div
              className={cx(styles.publicity_type_item, noticeType === 0 ? styles.active : '')}
              onClick={() => changeNoticeType(0)}
            >
              全部
            </div>
            <div
              className={cx(styles.publicity_type_item, noticeType === 1 ? styles.active : '')}
              onClick={() => changeNoticeType(1)}
              style={{ textAlign: 'center', height: '40px' }}
            >
              询价公示
            </div>
            <div
              className={cx(styles.publicity_type_item, noticeType === 2 ? styles.active : '')}
              onClick={() => changeNoticeType(2)}
              style={{ textAlign: 'center', height: '40px' }}
            >
              招标公示
            </div>
            <div
              className={cx(styles.publicity_type_item, noticeType === 3 ? styles.active : '')}
              onClick={() => changeNoticeType(3)}
              style={{ textAlign: 'center', height: '40px' }}
            >
              竞价公示
            </div>
          </div>
          <a href={`${mallUrl?.srmUrl}/procurementPublicity`} target="_blank" className={styles.publicity_more}>
            更多 &gt;
          </a>
        </div>
        <div className={styles.purchase_publicity_body}>
          <div className={styles.publicity_list}>
            {noticeList &&
              noticeList.map((item) => (
                <a
                  href={`${mallUrl?.srmUrl}/publicityPurchasing/${item.id}`}
                  target="_blank"
                  className={styles.publicity_list_item}
                  key={`publicity_list_item_${item.id}`}
                >
                  {getNoticeType(item.type)} {item.content}
                </a>
              ))}
          </div>
          <div className={styles.publicity_advert}>
            {advertList &&
              advertList.map(
                (item, index) =>
                  index < 1 && (
                    <div
                      className={styles.link}
                      key={`${item.name}_${index}`}
                      onClick={() => handleLink(item.link)}
                      title={item.name}
                    >
                      <ImageBox width={340} height={100} src={item.imgUrl} />
                    </div>
                  ),
              )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Purchase
