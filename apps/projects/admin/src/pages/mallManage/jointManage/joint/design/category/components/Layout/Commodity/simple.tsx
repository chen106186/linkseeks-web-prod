import React, { useEffect } from 'react'
import { SimpleCommodity, CustomizeTag } from '@apps/design-ui'
import cs from 'classnames'
import { PlusOutlined } from '@ant-design/icons'
import styles from './simple.less'
import Container from '../Container'
import { getIframe, getSelectedNode, useSelector } from '@apps/design-react'

interface Iprops {
  children: React.ReactElement
  title: string
  /** 显示、隐藏 */
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
  const { children, title, status } = props
  const cardProps = {
    title: title || '标题',
    headStyle: {
      padding: '0 12px',
    },
    bodyStyle: {
      padding: '0 12px 12px 12px',
      overflowX: 'auto',
    },
  }
  const listStyle = {
    marginRight: '-12px',
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
      visible={status}
      {...divProps}
    >
      {children}
    </Container>
  )
}

interface IsimpleItemprops {
  productImgUrl: string
  productName: string
  discount?: number
  price?: number
  footer?: React.ReactNode
  sale?: number
  id: number
}
const SimpleItem: React.FC<IsimpleItemprops> = (props: IsimpleItemprops) => {
  const { productImgUrl, discount, price, footer, sale, productName, id } = props
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
            月销{sale}件
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
    productName: props.name || productName,
    image: props.mainPic || productImgUrl,
    price: props.max || price,
    discount: props.min || props.activityPrice,
  }

  return (
    <div className={wrapClass} {...divProps}>
      <SimpleCommodity {...simpleData} {...rest} />
    </div>
  )
}

SimpleCommodityList.Item = SimpleItem

export default SimpleCommodityList
