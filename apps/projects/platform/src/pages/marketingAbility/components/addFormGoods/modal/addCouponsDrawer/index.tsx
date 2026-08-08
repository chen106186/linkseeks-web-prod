import { useIntl } from '@linkseeks/i18n'
import React, { useRef, useCallback, useEffect, useState } from 'react'
import { Button, Select, Input, Drawer, Row, Col, Checkbox } from 'antd'

import CouponItem from '../../../couponItem'

import styles from './index.less'

const { Search } = Input

interface AddCouponsDrawerProps {
  visible: boolean
  onClose?: Function
  onConfirm?: Function
  fetch?: Promise<any>
}

const AddCouponsDrawer: React.FC<AddCouponsDrawerProps> = (props: any) => {
  const intl = useIntl()
  const { visible, onClose, onConfirm, fetch } = props

  const [couponType, setCouponType] = useState<any>('')
  const [couponName, setCouponName] = useState<any>('')
  const [couponList, setCouponList] = useState<Array<any>>([{ id: 1 }, { id: 2 }])
  // const [checkList, setCheckList] = useState<Array<number>>([]);
  const [checkItem, setCheckItem] = useState<any>({})

  const _onConfirm = () => {
    onConfirm && onConfirm(checkItem)
  }

  const _setCouponType = (value: any) => {
    setCouponType(value)
  }

  const _setCouponName = (e: any) => {
    setCouponName(e.target.value)
  }

  const onSearch = () => {
    const _params = {
      couponType,
      couponName,
    }
    fetch &&
      fetch(_params).then((res) => {
        if (res.code === 1000) {
          setCouponList(res.data)
        }
      })
  }

  const _reSet = () => {
    setCouponType('')
    setCouponName('')
    onSearch()
  }

  const _setCheckList = (item: any) => {
    // let _checkList = [...checkList];
    // if (isCheck) {
    //     _checkList.push(id);
    // } else {
    //     const _i = _checkList.indexOf(id);
    //     _checkList.splice(_i, 1);
    // }
    setCheckItem(item)
  }

  useEffect(() => {
    // setCheckList([]);
    setCheckItem({})
    if (visible) {
      onSearch()
    }
  }, [visible])

  return (
    <Drawer
      title={intl.formatMessage({ id: 'marketingAbility.xuanzeyouhuiquan' })}
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
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col>
          <Select
            value={couponType}
            className={styles.customs}
            style={{ width: 160 }}
            onChange={_setCouponType}
          ></Select>
        </Col>
        <Col>
          <Search
            value={couponName}
            className={styles.customs}
            placeholder={intl.formatMessage({ id: 'marketingAbility.sousuo' })}
            onSearch={onSearch}
            style={{ width: 256 }}
            onChange={_setCouponName}
            allowClear
          />
        </Col>
        <Col>
          <Button onClick={_reSet}>{intl.formatMessage({ id: 'marketingAbility.zhongzhi' })}</Button>
        </Col>
      </Row>
      <Row>
        {couponList.map((item: any, index: number) => {
          return (
            <Col span={22} key={`Col_${index}`} style={{ marginTop: 24 }}>
              <Checkbox
                checked={checkItem?.id === item.id}
                className={styles.customsCheckbox}
                onChange={(e) => {
                  _setCheckList(item)
                }}
              >
                <CouponItem />
              </Checkbox>
            </Col>
          )
        })}
      </Row>
    </Drawer>
  )
}

export default AddCouponsDrawer
