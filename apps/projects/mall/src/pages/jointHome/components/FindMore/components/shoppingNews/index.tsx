import React, { useEffect, useState, useRef } from 'react'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import cx from 'classnames'
import { Carousel } from 'antd'
import chunk from 'lodash/chunk'
import { getTradeInquiryGetShopInquiryList } from '@apps/apis'
import { getWebIntl } from '@/utils/locales'
import { dateFormat } from '@apps/utils/src/format'
import { useGlobalConext } from '@/context/globalProvider'
import styles from '../../index.module.less'

const ShoppingNews: React.FC = () => {
  const translate = getWebIntl()
  const { mallInfo } = useGlobalConext()
  const [list, setList] = useState<any>([])
  const actionRef = useRef<any>()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    const params: any = {
      current: 1,
      pageSize: 18,
      shopId: mallInfo?.id,
    }
    getTradeInquiryGetShopInquiryList(params).then((res: any) => {
      if (res.code === 1000) {
        setList(chunk(res.data.data, 6))
      }
    })
  }

  return (
    <div className={styles.popular_buy_dynamic}>
      <div className={styles.find_more_title}>
        <label className={styles.blue}>{translate('web.resource.mall.shoppingNews')}</label>
        <div className={styles.find_more_title_page}>
          <div className={cx(styles.page_item, styles.prev)} onClick={() => actionRef.current.prev()}>
            <LeftOutlined translate={undefined} />
          </div>
          <div className={cx(styles.page_item, styles.next)} onClick={() => actionRef.current.next()}>
            <RightOutlined translate={undefined} />
          </div>
        </div>
      </div>
      <Carousel ref={actionRef} autoplaySpeed={5000} autoplay dots={false}>
        {list &&
          list.map((item: any[], index: number) => (
            <div key={`popular_buy_dynamic_list_${index}`}>
              <div className={styles.popular_buy_dynamic_list}>
                {item.map((item, index) => (
                  <div
                    className={styles.popular_buy_dynamic_list_item}
                    key={`popular_buy_dynamic_list_item_${item.id}`}
                  >
                    <div className={styles.popular_buy_dynamic_list_item_header}>
                      <span title={item.memberName}>
                        {item.details}
                        {item.details}
                        {item.details}
                      </span>
                      <div className={cx(styles.status_tag, item.state === 1 ? styles.success : '')}>
                        {item.isFinish
                          ? translate('web.resource.mall.finshed')
                          : translate('web.resource.mall.baojiazhong')}
                      </div>
                    </div>
                    <div className={styles.delivery_tiem}>
                      {translate('web.resource.mall.jiaoqi')}：{dateFormat(new Date(item.deliveryTime || ''), 'MM-DD')}
                    </div>
                    <div className={styles.popular_buy_dynamic_list_item_content}>
                      <span className={styles.content_text}>{item.memberName}</span>
                      <span className={styles.content_time}>
                        {dateFormat(new Date(item.voucherTime || ''), 'MM/DD HH:mm')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </Carousel>
    </div>
  )
}

export default ShoppingNews
