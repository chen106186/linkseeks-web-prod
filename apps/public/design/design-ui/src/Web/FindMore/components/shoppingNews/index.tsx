import React, { useState, useRef, useEffect } from 'react'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import cx from 'classnames'
import { Carousel } from 'antd'
import { getWebIntl } from '@apps/locales'
import { dateFormat } from '@apps/utils/src/format'
import chunk from 'lodash/chunk'
import styles from '../../index.less'

export interface InquiryItemType {
  /**
   * 商品询价单id
   */
  id: number
  /**
   * 询价单摘要
   */
  details: string
  /**
   * 被询价会员id
   */
  memberId: number
  /**
   * 被询价会员
   */
  memberName: string
  /**
   * 被询价会员角色id
   */
  memberRoleId: number
  /**
   * 被询价会员角色名称
   */
  memberRoleName: string
  /**
   * 交付日期
   */
  deliveryTime: number
  /**
   * 单据时间
   */
  voucherTime: number
  /**
   * 询价商品id(取第一个)
   */
  inquiryCommodityId: number
  /**
   * 是否已完成
   */
  isFinish: boolean
}

interface IProps {
  list: InquiryItemType[] | undefined
}

const ShoppingNews: React.FC<IProps> = (props) => {
  const { list } = props
  const translate = getWebIntl()
  const actionRef = useRef<any>()
  const [groupList, setGroupList] = useState<Array<InquiryItemType[]>>([])

  useEffect(() => {
    if (list && list.length > 0) {
      setGroupList(chunk(list, 6))
    } else {
      setGroupList([])
    }
  }, [list])

  return (
    <div className={styles.popular_buy_dynamic}>
      <div className={styles.find_more_title}>
        <label className={styles.blue}>
          {translate('web.resource.mall.shoppingNews' as never)}
        </label>
        <div className={styles.find_more_title_page}>
          <div
            className={cx(styles.page_item, styles.prev)}
            onClick={() => actionRef.current.prev()}
          >
            <LeftOutlined translate={undefined} />
          </div>
          <div
            className={cx(styles.page_item, styles.next)}
            onClick={() => actionRef.current.next()}
          >
            <RightOutlined translate={undefined} />
          </div>
        </div>
      </div>
      <Carousel ref={actionRef} autoplaySpeed={5000} autoplay dots={false}>
        {groupList &&
          groupList.map((item, index: number) => (
            <div key={`popular_buy_dynamic_list_${index}`}>
              <div className={styles.popular_buy_dynamic_list}>
                {item.map((item) => (
                  <div
                    className={styles.popular_buy_dynamic_list_item}
                    key={`popular_buy_dynamic_list_item_${item.id}`}
                  >
                    <div
                      className={styles.popular_buy_dynamic_list_item_header}
                    >
                      <span title={item.memberName}>{item.details}</span>
                      <div
                        className={cx(
                          styles.status_tag,
                          item.isFinish ? styles.success : '',
                        )}
                      >
                        {item.isFinish
                          ? translate('web.resource.mall.finshed')
                          : translate('web.resource.mall.baojiazhong')}
                      </div>
                    </div>
                    <div className={styles.delivery_tiem}>
                      {translate('web.resource.mall.jiaoqi')}：
                      {dateFormat(new Date(item.deliveryTime || ''), 'MM-DD')}
                    </div>
                    <div
                      className={styles.popular_buy_dynamic_list_item_content}
                    >
                      <span className={styles.content_text}>
                        {item.memberName}
                      </span>
                      <span className={styles.content_time}>
                        {dateFormat(
                          new Date(item.voucherTime || ''),
                          'MM/DD HH:mm',
                        )}
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
