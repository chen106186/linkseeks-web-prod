import React from 'react'
import Container from '../Container'

const ProductContainer = (props) => {
  const { children, status } = props

  const listStyle = {
    marginRight: '-8px',
    flexWrap: 'wrap',
    alignItems: 'stretch',
    padding: '16 0',
    minHeight: '20px',
    // backgroundColor: 'red',
  }
  const itemStyle = {
    border: '1px solid #ccc',
    paddingRight: '8px',
    width: '50%',
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

  return (
    <Container
      card={false}
      listStyle={listStyle as any}
      itemStyle={itemStyle as any}
      {...divProps}
      toolTipTitle="精选商品"
      visible={status}
    >
      {children}
    </Container>
  )
}

export default ProductContainer
