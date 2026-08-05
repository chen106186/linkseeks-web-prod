import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Drawer, Row, Col, Space, Button } from 'antd'
import { useScroll } from '@linkseeks/hooks'
import styles from './index.less'
// import useGetClientRect from './useGetClientRect';
import { createFormActions, FormEffectHooks, registerVirtualBox } from '@apps/formily'
import classnames from 'classnames'
import NiceForm from '@/components/NiceForm'
import schema from './schema'
import FormilyProductAttrsLayout from './formilyProductAttrsLayout'
import { useIntl } from '@linkseeks/i18n'
const formActions = createFormActions()

/**
 * {intl.formatMessage({id: 'handling.view.process.detail'})}
 */

/** 查看或编辑 加工商品， 商品的属性 */
export type productInfo = {
  /** 当加工订单时，拥有id 唯一 */
  id?: number
  /** 当加工订单时，拥有orderid 订单id */
  orderId?: number
  /** 当加工订单时，拥有orderNo 订单👌 */
  orderNo?: number

  /** skuid 属于唯一值 */
  skuid: number
  commodityId: number
  /** 商品名 */
  name: string
  /** 品类 */
  category: string
  /** 品牌 */
  brand: string
  /** 单位 */
  unitName: string
  /** 含税跟税率合在一起的文字显示 */
  isHasTaxAndTaxRate?: string
  /** 是否含税 */
  isHasTax?: 0 | 1
  /** 税率 */
  taxRate?: string
  /** 加工数量 */
  processNum?: string
  /** 加工单价 */
  processUnitPrice?: string
  /** 加工数量 * 加工单价 */
  processTotalPrice?: number
  /** 附件 */
  enclosure?: {
    name: string
    url: string
  }[]
  /** 商品属性 */
  productProps: {
    name: string
    value: string
  }[]
}

interface Iprops {
  visible: boolean
  onClose?: (() => void) | null
  onSubmit?: ((values: any) => void) | null
  /**
   * 当前商品值
   */
  value: productInfo
  // dataProps: DataPropsType
  editable: boolean
}

/**
 * 修改商品 提交数据
 */
export type productSubmitType = {
  /** 当加工订单时，拥有id 唯一 */
  id?: number
  /** 当加工订单时，拥有orderid 订单id */
  orderId?: number
  /** 当加工订单时，拥有orderNo 订单👌 */
  orderNo?: number

  /** skuid, 用这个去判断工作流 */
  skuid: number
  commodityId: number
  brand: string
  category: string
  /** 商品名 */
  name: string
  enclosure: {
    name: string
    url: string
    status: 'done'
    type: 'image/jpeg'
  }[]
  /** 是否含税 */
  isHasTax: (0 | 1) & number
  /** 税率 */
  taxRate: string
  /** 加工数量 */
  processNum: string
  /** 商品属性 */
  productProps: { name: string; value: string }[]
  unitName: string
  /** 加工单价 */
  processUnitPrice: string
}

const ProductDrawer: React.FC<Iprops> = (props: Iprops) => {
  const intl = useIntl()
  const { visible, onClose, onSubmit, value, editable } = props
  const [scroll, ref] = useScroll<HTMLDivElement>()
  const [menu, setMenu] = useState<string[]>([])
  const [rangeHeight, setRangeHeight] = useState<number[]>([])
  const [activeIndex, setActiveIndex] = useState<number>(0)

  const activeAndScroll = (index: number) => {
    setActiveIndex(index)
    ref.current.scrollTop = rangeHeight[index]
  }

  /**
   * @tofix 这里有个bug，就是上面点击了之后，然后滚动，然后再做了一次计算，会有问题
   */
  useEffect(() => {
    const { top } = scroll
    let activeKey = 0
    for (let i = 0; i < rangeHeight.length - 1; i++) {
      if (top >= rangeHeight[i] && top < rangeHeight[i + 1]) {
        activeKey = i
        break
      }
      activeKey = i + 1
    }
    // console.log(activeKey)
    setActiveIndex(activeKey)
  }, [scroll])

  useEffect(() => {
    if (!visible) {
      return
    }
    const childNodes = ref.current.childNodes
    if (!childNodes) {
      return
    }

    const formNode = childNodes[0].childNodes[0].childNodes[0].childNodes
    const menuData = []
    let sum = 0
    const ranges = [0]
    formNode.forEach((_item) => {
      const { title, offsetHeight } = getMenuAndHeight(_item)
      if ((_item as any).className.includes('ant-row')) {
        const attributes = _item.childNodes[0].childNodes[0].childNodes[0].childNodes
        attributes.forEach((_row) => {
          const { title, offsetHeight } = getMenuAndHeight(_row)
          saveRangeAndMenuData(menuData, ranges, title, (sum += offsetHeight))
        })
        return
      }
      saveRangeAndMenuData(menuData, ranges, title, (sum += offsetHeight))
    })
    setMenu(menuData.filter(Boolean))
    setRangeHeight(ranges)
  }, [visible, ref])

  const getMenuAndHeight = (node) => {
    const title = (node.firstChild as any)?.innerText || ''
    const offsetHeight = (node as any).offsetHeight
    return { title, offsetHeight }
  }

  const saveRangeAndMenuData = (menuData: string[], ranges: number[], title: string, resultHeight: number) => {
    menuData.push(title)
    // sum += offsetHeight;
    ranges.push(resultHeight)
  }

  const handleConfirm = () => {
    formActions.submit()
  }

  const handleSubmit = (values: productSubmitType) => {
    onSubmit?.(values)
  }
  return (
    <Drawer
      visible={visible}
      onClose={onClose}
      width={800}
      title={intl.formatMessage({ id: 'handling.view.process.detail' })}
      bodyStyle={{ padding: '0px' }}
      footer={
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Space>
            <Button onClick={onClose}>{intl.formatMessage({ id: 'common.button.cancel' })}</Button>
            <Button type="primary" onClick={handleConfirm}>
              {intl.formatMessage({ id: 'common.button.confirm' })}
            </Button>
          </Space>
        </div>
      }
    >
      <div className={styles.container}>
        <div className={styles.menu}>
          {menu.map((item, key) => {
            return (
              <div key={item} className={classnames(styles.menuItem)} onClick={() => activeAndScroll(key)}>
                <span className={classnames(styles.menuTitle, { [styles.active]: activeIndex === key })}>{item}</span>
              </div>
            )
          })}
        </div>
        <div className={styles.body} ref={ref}>
          <NiceForm
            editable={editable}
            value={value}
            schema={schema}
            components={{
              FormilyProductAttrsLayout,
            }}
            actions={formActions}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </Drawer>
  )
}

export default ProductDrawer
