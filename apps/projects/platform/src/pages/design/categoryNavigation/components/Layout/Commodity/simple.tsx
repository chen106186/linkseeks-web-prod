import React, { useEffect } from 'react'
import { SimpleCommodity, CustomizeTag } from '@apps/design-ui'
import cs from 'classnames'
import { getIntl } from '@linkseeks/i18n'
import { PlusOutlined } from '@ant-design/icons'
import styles from './simple.less'
import Container from '../Container'
import { useSelector, getIframe, getSelectedNode } from '@apps/design-react'

const intl = getIntl()
interface Iprops {
  children: React.ReactElement
  title: string
  /** 控制显示隐藏 */
  status: boolean
}

const scrollNode = (key: string) => {
  const iframe = getIframe()
  const splitCode = key.split('-')
  if (splitCode.length < 3) {
    return
  }
  const parentNode = getSelectedNode(`${splitCode.slice(0, 2).join('-')}-0`, iframe)
  if (!parentNode) {
    return
  }
  const cardBody = parentNode.querySelector('.ant-card-body')
  if (!cardBody) {
    return
  }
  const selectedNode = getSelectedNode(`${key}-0`, iframe)
  if (!selectedNode) {
    return
  }
  const { x, y, width } = selectedNode.getBoundingClientRect()

  if (cardBody.scrollWidth > selectedNode.scrollWidth) {
    const position: { left?: number; top?: number } = {
      left: x - 18,
      top: 0,
    }
    cardBody.scrollBy({ ...position, behavior: 'smooth' })
  }
}

const SimpleCommodityList: React.FC<Iprops> & { Item: typeof SimpleItem } = (props: Iprops) => {
  // console.log(props);
  const { children, title, status } = props
  const cardProps = {
    title: title || intl.formatMessage({ id: 'editor.setting.form.title' }),
    headStyle: {
      padding: '0 12px',
    },
    bodyStyle: {
      padding: '0 12px 12px 12px',
      overflowX: 'auto',
    },
  }
  const listStyle = {
    marginRight: '0px',
  }
  const itemStyle = {
    marginRight: '12px',
  }

  const { onClick, onDrag, onDragEnd, onDragEnter, onDragStart, onMouseOver, getOperateState, className, ...rest } =
    props as any
  const divProps = {
    onClick,
    onDrag,
    onDragEnd,
    onDragEnter,
    onDragStart,
    onMouseOver,
    getOperateState,
    className,
  }
  const { selectedInfo, hoverKey } = useSelector(['pageConfig', 'shopId', 'selectedInfo', 'hoverKey'])

  useEffect(() => {
    if (hoverKey !== null) {
      scrollNode(hoverKey)
    }
  }, [hoverKey])

  return (
    <Container
      card={true}
      cardProps={cardProps as any}
      listStyle={listStyle}
      itemStyle={itemStyle}
      {...divProps}
      visible={status}
    >
      {children}
    </Container>
  )
}

/** 活动商品属性 */
interface IsimpleItemprops {
  productImgUrl: string
  productName: string
  /** 折扣 */
  discount?: number
  /** 活动价 */
  activityPrice?: number
  price?: number
  footer?: React.ReactNode
  sale?: number
  id: number
}

/** 商品字段 */
interface IsimpleProductItemProps {
  name: string
  mainPic: string
  max: number
  min: string
}

const SimpleItem: React.FC<IsimpleItemprops> = (props: IsimpleItemprops | IsimpleProductItemProps) => {
  const { productImgUrl, discount, price, footer, sale, productName, id, activityPrice } = props as IsimpleItemprops
  const { onClick, onDrag, onDragEnd, onDragEnter, onDragStart, onMouseOver, getOperateState, className } = props as any
  const divProps = {
    onClick,
    onDrag,
    onDragEnd,
    onDragEnter,
    onDragStart,
    onMouseOver,
  }
  const rest = sale
    ? {
        footer: (
          <CustomizeTag mode="doubleColor" background="#FFF0F2" color="#EF3346">
            {intl.formatMessage({ id: 'editor.category.month.sales' })}
            {sale}
            {intl.formatMessage({ id: 'common.text.unit.piece', defaultMessage: '件' })}
          </CustomizeTag>
        ),
      }
    : { originalPrice: price }
  const wrapClass = cs(className, styles.simple)

  const isEmpty = typeof productName === 'undefined' && typeof id === 'undefined'
  if (isEmpty) {
    return (
      <div className={cs(wrapClass, styles.empty)} {...divProps}>
        <PlusOutlined />
      </div>
    )
  }

  const simpleData = {
    productName: (props as IsimpleProductItemProps).name || productName,
    image: (props as IsimpleProductItemProps).mainPic || productImgUrl,
    price: (props as IsimpleProductItemProps).max || price,
    discount: (props as IsimpleProductItemProps).min || activityPrice,
  }

  return (
    <div className={wrapClass} {...divProps}>
      <SimpleCommodity {...simpleData} {...rest} />
    </div>
  )
}

SimpleCommodityList.Item = SimpleItem

export default SimpleCommodityList
