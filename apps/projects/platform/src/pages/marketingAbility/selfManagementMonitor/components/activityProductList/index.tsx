import React from 'react'
import { Row, Col, Image } from 'antd'
import style from './index.less'
import { Card as CardLayout } from '@linkseeks/ui'
import { useIntl } from '@linkseeks/i18n'

const ActivityProductList = () => {
  const intl = useIntl()
  return (
    <CardLayout
      title={intl.formatMessage({ id: 'marketingAbility.huodongshangpinliebiao' })}
      id="activityProductList"
      className={style.cardLayout}
    >
      <Row gutter={[16, 16]}>
        <Col xl={{ span: 8 }} span={12}>
          <div className={style.product_wrap}>
            <div className={style.product_img}>
              <Image
                width={32}
                height={32}
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              />
            </div>
            <div className={style.product_item}>
              <div className={style.product_item_title}>
                {intl.formatMessage({ id: 'marketingAbility.jinkoutoucenghuangniupili' })}
              </div>
              <span className={style.product_item_progress}>50%</span>
            </div>
          </div>
        </Col>
        <Col xl={{ span: 8 }} span={12}>
          <div className={style.product_wrap}>
            <div className={style.product_img}>
              <Image
                width={32}
                height={32}
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              />
            </div>
            <div className={style.product_item}>
              <div className={style.product_item_title}>
                {intl.formatMessage({ id: 'marketingAbility.jinkoutoucenghuangniupili' })}
              </div>
              <span className={style.product_item_progress}>50%</span>
            </div>
          </div>
        </Col>
        <Col xl={{ span: 8 }} span={12}>
          <div className={style.product_wrap}>
            <div className={style.product_img}>
              <Image
                width={32}
                height={32}
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              />
            </div>
            <div className={style.product_item}>
              <div className={style.product_item_title}>
                {intl.formatMessage({ id: 'marketingAbility.jinkoutoucenghuangniupili' })}
              </div>
              <span className={style.product_item_progress}>50%</span>
            </div>
          </div>
        </Col>
        <Col xl={{ span: 8 }} span={12}>
          <div className={style.product_wrap}>
            <div className={style.product_img}>
              <Image
                width={32}
                height={32}
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              />
            </div>
            <div className={style.product_item}>
              <div className={style.product_item_title}>
                {intl.formatMessage({ id: 'marketingAbility.jinkoutoucenghuangniupili' })}
              </div>
              <span className={style.product_item_progress}>50%</span>
            </div>
          </div>
        </Col>
        <Col xl={{ span: 8 }} span={12}>
          <div className={style.product_wrap}>
            <div className={style.product_img}>
              <Image
                width={32}
                height={32}
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              />
            </div>
            <div className={style.product_item}>
              <div className={style.product_item_title}>
                {intl.formatMessage({ id: 'marketingAbility.jinkoutoucenghuangniupili' })}
              </div>
              <span className={style.product_item_progress}>50%</span>
            </div>
          </div>
        </Col>
        <Col xl={{ span: 8 }} span={12}>
          <div className={style.product_wrap}>
            <div className={style.product_img}>
              <Image
                width={32}
                height={32}
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              />
            </div>
            <div className={style.product_item}>
              <div className={style.product_item_title}>
                {intl.formatMessage({ id: 'marketingAbility.jinkoutoucenghuangniupili' })}
              </div>
              <span className={style.product_item_progress}>50%</span>
            </div>
          </div>
        </Col>
      </Row>
    </CardLayout>
  )
}
export default ActivityProductList
