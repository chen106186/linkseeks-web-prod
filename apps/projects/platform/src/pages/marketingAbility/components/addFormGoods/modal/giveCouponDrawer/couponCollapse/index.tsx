import { useIntl } from '@linkseeks/i18n'
import React, { useState, useEffect } from 'react'
import { Button, Select, Input, Drawer, Row, Col, Space, Form } from 'antd'
import { CaretDownOutlined, CaretRightOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'

import CouponItem from '../../../../couponItem'
import GoodsItem from '../../../../goodsItem'

import styles from './index.less'

interface CouponCollapseProps {
  field: any
  remove: Function
}

const CouponCollapse: React.FC<CouponCollapseProps> = (props: any) => {
  const intl = useIntl()
  const { field, remove } = props
  console.log(field)
  const [visible, setVisible] = useState<boolean>(false)
  const [couponList, setCouponList] = useState<any>([{}])

  const _addCoupon = () => {
    let _couponList = [...couponList]
    _couponList.push({})
    setCouponList(_couponList)
  }

  return (
    <div className={styles.CouponCollapse}>
      <div className={styles.CouponCollapse_index}>1</div>
      <div className={styles.CouponCollapse_context}>
        <div
          className={styles.CouponCollapse_context_header}
          onClick={() => {
            setVisible(!visible)
          }}
        >
          {visible ? <CaretDownOutlined /> : <CaretRightOutlined />}
          <span className={styles.CouponCollapse_context_header_span}>
            {intl.formatMessage({ id: 'marketingAbility.man100yuanzengsong' })}
          </span>
          <DeleteOutlined
            onClick={() => {
              remove(field.name)
            }}
          />
        </div>
        {visible && (
          <>
            <Form.Item
              label={intl.formatMessage({ id: 'marketingAbility.youhuimenkan' })}
              labelCol={{ style: { width: '80px' } }}
              labelAlign="left"
            >
              <Row align="middle" wrap={false} gutter={8}>
                <Col>{intl.formatMessage({ id: 'marketingAbility.man' })}</Col>
                <Col flex="auto">
                  <Input addonAfter={intl.formatMessage({ id: 'marketingAbility.yuan' })} />
                </Col>
              </Row>
            </Form.Item>
            {couponList.map((item, index) => (
              <div key={index}>
                <div className={styles.CouponCollapse_context_title}>
                  <span className={styles.CouponCollapse_context_title_span}>
                    {intl.formatMessage({ id: 'marketingAbility.zengsongyouhuiquan1' })}
                  </span>
                  <DeleteOutlined />
                </div>
                <div className={styles.CouponCollapse_context_coupon}>
                  <span className={styles.CouponCollapse_context_coupon_span}>
                    {intl.formatMessage({ id: 'marketingAbility.zengsongyouhuiquan:' })}
                  </span>
                  <div style={{ flex: 1 }}>
                    {/* <CouponItem /> */}
                    <GoodsItem />
                  </div>
                </div>
                <Form.Item
                  label={intl.formatMessage({ id: 'marketingAbility.zengsongshuliang' })}
                  labelCol={{ style: { width: '80px' } }}
                  labelAlign="left"
                >
                  <Input addonAfter={intl.formatMessage({ id: 'marketingAbility.ge' })} />
                </Form.Item>
              </div>
            ))}
            <Button type="dashed" block icon={<PlusOutlined />} onClick={_addCoupon}>
              {intl.formatMessage({ id: 'marketingAbility.tianjiazengsongyouhuiquan' })}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default CouponCollapse
