import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Drawer, Row, Col } from 'antd'
import { useScroll } from '@linkseeks/hooks'
import styles from './index.less'
// import useGetClientRect from './useGetClientRect';
import classnames from 'classnames'
import { useIntl } from '@linkseeks/i18n'
/**
 * 查看加工明细
 */

export type DataPropsType = {
  /**
   * 商品id
   */
  productId: number
  /**
   * 商品名
   */
  name: string
  /**
   * 商品品类
   */
  category: string
  /**
   * 商品品牌
   */
  brand: string
  /**
   * j加工数量
   */
  quantity: number
  /**
   * 单位
   */
  unitName: string
  /**
   * 加工单价
   */
  processUnitPrice: number
  /**
   * 商品其他属性
   */
  productProps: { name: string; value: string }[]
  /**
   * 是否含税
   */
  isHasTax: 0 | 1
  /**
   * 税率
   */
  taxRate: number
  /**
   * 文件
   */
  files: { name: string; value: string }[]
}
interface Iprops {
  visible: boolean
  onClose?: (() => void) | null
  dataProps: DataPropsType
}

const MachiningDetail: React.FC<Iprops> = (props: Iprops) => {
  const intl = useIntl()
  const { visible, onClose, dataProps } = props
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

  const productsPropsColumns = [
    {
      title: intl.formatMessage({ id: 'handling.assign.add.product.id' }),
      dataIndex: 'productId',
    },
    {
      title: intl.formatMessage({ id: 'handling.assign.add.product.name' }),
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({ id: 'handling.assign.add.product.category' }),
      dataIndex: 'category',
    },
    {
      title: intl.formatMessage({ id: 'handling.assign.add.product.brandName' }),
      dataIndex: 'brand',
    },
  ]

  const machiningPropsColumns = [
    {
      title: intl.formatMessage({ id: 'handling.assign.add.product.unitName' }),
      dataIndex: 'unitName',
    },
    {
      title: intl.formatMessage({ id: 'handling.assign.add.product.processNum' }),
      dataIndex: 'quantity',
    },
    {
      title: intl.formatMessage({ id: 'handling.assign.add.product.processUnitPrice' }),
      dataIndex: 'processUnitPrice',
      render: (text, record: DataPropsType) => {
        return `${intl.formatMessage({ id: 'common.money' })}${record.processUnitPrice}`
      },
    },
    {
      title: intl.formatMessage({ id: 'handling.assign.add.isHasTax' }),
      dataIndex: 'tax',
      render: (text, record: DataPropsType) => {
        return (
          <div>
            {record.isHasTax
              ? intl.formatMessage({ id: 'common.button.yes' })
              : intl.formatMessage({ id: 'common.button.no' })}{' '}
            / {record.taxRate || 0}%
          </div>
        )
      },
    },
  ]

  useEffect(() => {
    if (!visible) {
      return
    }
    const childNodes = ref.current.childNodes
    const menuData = []
    let sum = 0
    const ranges = [0]
    childNodes.forEach((_item) => {
      const headerChild = _item.childNodes?.[0].textContent
      const offsetHeight = (_item as any).offsetHeight
      menuData.push(headerChild)
      sum += offsetHeight
      ranges.push(sum)
    })

    setMenu(menuData)
    setRangeHeight(ranges)
  }, [visible, ref])

  const renderFiles = () => {
    if (!dataProps.files || dataProps.files.length === 0) {
      return null
    }
    return (
      <div className={styles.common}>
        <div className={styles.header}>{intl.formatMessage({ id: 'handling.assign.add.files' })}</div>
        <div className={styles.info}>
          {dataProps.files?.map((_item) => {
            return (
              <a key={_item.value} href={_item.value} target="_blank">
                {_item.name}
              </a>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <Drawer
      visible={visible}
      onClose={onClose}
      width={800}
      title={intl.formatMessage({ id: 'handling.view.process.detail' })}
      bodyStyle={{ padding: '0px' }}
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
          <div className={styles.common}>
            <div className={styles.header}>{intl.formatMessage({ id: 'handling.assign.add.basicInfo' })}</div>
            <div className={styles.info}>
              {productsPropsColumns.map((_item) => {
                return (
                  <Row className={styles.infoRow} key={_item.dataIndex}>
                    <Col className={styles.label} span={4}>
                      {_item.title}
                    </Col>
                    <Col span={12}>{dataProps?.[_item.dataIndex]}</Col>
                  </Row>
                )
              })}
            </div>
          </div>
          {dataProps.productProps &&
            dataProps.productProps.map((item, key) => {
              return (
                <div className={styles.common} key={key}>
                  <div className={styles.header}>{item.name}</div>
                  <div className={styles.info}>
                    <Row className={styles.infoRow}>
                      <Col className={styles.label} span={4}>
                        {item.name}
                      </Col>
                      <Col span={12}>{item.value}</Col>
                    </Row>
                  </div>
                </div>
              )
            })}
          {renderFiles()}
          <div className={styles.common} style={{ marginBottom: '585px' }}>
            <div className={styles.header}>{intl.formatMessage({ id: 'handling.process.require' })}</div>
            <div className={styles.info}>
              {machiningPropsColumns.map((_row) => {
                return (
                  <Row className={styles.infoRow} key={_row.dataIndex}>
                    <Col className={styles.label} span={4}>
                      {_row.title}
                    </Col>
                    <Col span={12}>
                      {(_row.render && _row.render(dataProps[_row.dataIndex], dataProps)) || dataProps[_row.dataIndex]}
                    </Col>
                  </Row>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  )
}

export default MachiningDetail
