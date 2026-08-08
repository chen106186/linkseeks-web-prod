import { useIntl } from '@linkseeks/i18n'
import React from 'react'
import { Row, Col } from 'antd'
import style from './index.less'
import { Card as CardLayout } from '@linkseeks/ui'
import { CaretUpOutlined } from '@ant-design/icons'

const DataLayout = () => {
  const intl = useIntl()
  return (
    <CardLayout
      title={intl.formatMessage({ id: 'marketingAbility.dangqianshangpinshuju' })}
      className={style.cardLayout}
    >
      <Row gutter={[16, 16]}>
        <Col xl={{ span: 6 }} span={12}>
          <div className={style.dataLayout_wrap}>
            <div className={style.dataLayout_wran}>
              {intl.formatMessage({ id: 'marketingAbility.jinricanyukehushu' })}
            </div>
            <div className={style.dataLayout_item}>
              <h4 className={style.dataLayout_num}>10</h4>
              <div className={style.dataLayout_value}>
                <CaretUpOutlined className={style.info_icon_style} />
                25%
              </div>
            </div>
          </div>
        </Col>
        <Col xl={{ span: 6 }} span={12}>
          <div className={style.dataLayout_wrap}>
            <div className={style.dataLayout_wran}>
              {intl.formatMessage({ id: 'marketingAbility.jinridingdanshudan' })}
            </div>
            <div className={style.dataLayout_item}>
              <h4 className={style.dataLayout_num}>10</h4>
              <div className={style.dataLayout_value}>
                <CaretUpOutlined className={style.info_icon_style} />
                25%
              </div>
            </div>
          </div>
        </Col>
        <Col xl={{ span: 6 }} span={12}>
          <div className={style.dataLayout_wrap}>
            <div className={style.dataLayout_wran}>
              {intl.formatMessage({ id: 'marketingAbility.jinrigoumaishuliang' })}
            </div>
            <div className={style.dataLayout_item}>
              <h4 className={style.dataLayout_num}>200</h4>
              <div className={style.dataLayout_value}>
                <CaretUpOutlined className={style.info_icon_style} />
                25%
              </div>
            </div>
          </div>
        </Col>
        <Col xl={{ span: 6 }} span={12}>
          <div className={style.dataLayout_wrap}>
            <div className={style.dataLayout_wran}>
              {intl.formatMessage({ id: 'marketingAbility.jinrigoumaijine' })}
            </div>
            <div className={style.dataLayout_item}>
              <h4 className={style.dataLayout_num}>1,000.00</h4>
              <div className={style.dataLayout_value}>
                <CaretUpOutlined className={style.info_icon_style} />
                25%
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </CardLayout>
  )
}
export default DataLayout
