import { useIntl } from '@linkseeks/i18n'
import React, { useRef, useCallback, useEffect, useState } from 'react'
import { Button, Select, Input, Drawer, Row, Col, Collapse, Form } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

import CouponItem from '../../../couponItem'

import CouponCollapse from './couponCollapse'

const { Panel } = Collapse

interface GiveCouponDrawerProps {
  visible: boolean
  onClose?: Function
  onConfirm?: Function
  fetch?: Promise<any>
}

const GiveCouponDrawer: React.FC<GiveCouponDrawerProps> = (props: any) => {
  const intl = useIntl()
  const { visible, onClose, onConfirm, fetch } = props
  const [form] = Form.useForm()

  const _onConfirm = () => {}

  return (
    <Drawer
      title={intl.formatMessage({ id: 'marketingAbility.shezhizengpinmane' })}
      width={600}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            {intl.formatMessage({ id: 'marketingAbility.quxiao' })}
          </Button>
          <Button onClick={_onConfirm} type="primary">
            {intl.formatMessage({ id: 'marketingAbility.queding' })}
          </Button>
        </div>
      }
    >
      <Form form={form}>
        <Form.List name="coupons">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <Form.Item key={field.key} noStyle>
                  <CouponCollapse field={field} remove={remove} />
                </Form.Item>
              ))}
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                {intl.formatMessage({ id: 'marketingAbility.tianjia' })}
              </Button>
            </>
          )}
        </Form.List>
      </Form>
    </Drawer>
  )
}

export default GiveCouponDrawer
