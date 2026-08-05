import { useIntl } from '@linkseeks/i18n'
import React, { useEffect, useState } from 'react'
import { Form, Row, Col, Image } from 'antd'
import cx from 'classnames'
import { Card as CardLayout } from '@linkseeks/ui'
import defaultLogo from '@/assets/imgs/default_logo.jpg'
import style from './index.less'
import { isEmpty } from 'lodash'
import { getCommodityWebShopWebAll } from '@apps/apis'

type ShopItem = {
  describe?: string
  environment?: number
  id?: number
  isDefault?: number
  logoUrl?: string
  name?: string
  state?: number
  type?: number
  url?: string
  checked?: boolean
}

interface shopListProps {
  /** 返回选择商城 */
  onGetShopList?: (e: any) => void
  /** 回显数据 */
  onSetShopList?: any[]
}

const ShopLayout: React.FC<shopListProps> = (props: any) => {
  const intl = useIntl()
  const { onGetShopList, onSetShopList } = props
  const [mallList, setMallList] = useState<ShopItem[]>([])

  useEffect(() => {
    getCommodityWebShopWebAll({ isMemberType: true }, { ctlType: 'none' }).then((res) => {
      if (res.code !== 1000) {
        return
      }
      setMallList(res.data)
    })
  }, [])

  const handleShopList = (index) => {
    let mall = [...mallList]
    const newData = mall.map((_item, _i) => {
      if (_i === index) {
        console.log(_item, 10086)
        return {
          ..._item,
          checked: !_item.checked,
        }
      }
      return _item
    })
    setMallList(newData)
    onGetShopList(newData)
  }

  useEffect(() => {
    if (!isEmpty(onSetShopList)) {
      mallList.forEach((item) => {
        onSetShopList
          .filter((_item) => _item.shopId === item.id)
          .forEach((v) => {
            if (v.shopId === item.id) {
              item.checked = true
            }
          })
      })
      setMallList([...mallList])
      onGetShopList([...mallList])
    }
    console.log(onSetShopList, mallList)
  }, [onSetShopList])

  return (
    <CardLayout id="shopLayout" title={intl.formatMessage({ id: 'selfManagement.applyToMall' })}>
      <Form.Item name="shopList">
        <Row gutter={[16, 16]}>
          {mallList.map((item: ShopItem, index: number) => (
            <Col span={6} key={item.id}>
              <div
                className={cx(style.shopListLayout, item.checked && style.shopListLayoutChecked)}
                onClick={() => handleShopList(index)}
              >
                <div className={style.shopListLogo}>
                  <Image width={32} height={32} src={item.logoUrl || defaultLogo} preview={false} />
                </div>
                <span className={style.shopListName}>{item.name}</span>
              </div>
            </Col>
          ))}
        </Row>
      </Form.Item>
    </CardLayout>
  )
}
export default ShopLayout
