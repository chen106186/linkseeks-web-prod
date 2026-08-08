import React from 'react'
import Container from '../Container'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

const ProductContainer = (props) => {
  const { children, status } = props

  const listStyle = {
    marginRight: '-8px',
    flexWrap: 'wrap',
    alignItems: 'stretch',
    minHeight: '20px',
  }
  const itemStyle = {
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
      visible={status}
      card={false}
      listStyle={listStyle as any}
      itemStyle={itemStyle as any}
      {...divProps}
      tooltipTitle={intl.formatMessage({ id: 'editor.category.product.container.title' })}
    >
      {children}
    </Container>
  )
}

export default ProductContainer
