import React from 'react'
import cs from 'classnames'
import { PlusOutlined } from '@ant-design/icons'
import styles from './index.less'
import Container from '../Container'

interface Iprops {
  children: React.ReactElement
  /** 显示/ 隐藏 */
  status: boolean
}
/** 这里是品牌, 名字写错了写错了。。。 */
const CategoryList: React.FC<Iprops> & { Item: typeof CategoryItem } = (props: Iprops) => {
  const { children, status } = props
  const cardProps = {
    bodyStyle: {
      padding: '12px 16px',
    },
    bordered: false,
  }
  const listStyle = {
    marginRight: '-34px',
    marginBottom: '-12px',
    flexWrap: 'wrap',
    alignItems: 'center',
  }
  const itemStyle = {
    flexBasic: '25%',
    paddingRight: '24px',
    marginBottom: '12px',
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
      cardProps={cardProps}
      listStyle={listStyle as any}
      itemStyle={itemStyle as any}
      visible={status}
      {...divProps}
    >
      {children}
    </Container>
  )
}

interface IcategoryItemProps {
  name: string
  id: number
  logoUrl: string
}

const CategoryItem: React.FC<IcategoryItemProps> = (props: IcategoryItemProps) => {
  const { name, logoUrl, id } = props
  const { onClick, onDrag, onDragEnd, onDragEnter, onDragStart, onMouseOver, getOperateState, className, ...rest } =
    props as any
  const divProps = {
    onClick,
    onDrag,
    onDragEnd,
    onDragEnter,
    onDragStart,
    onMouseOver,
  }
  const wrapClass = cs(className, styles.container)

  const isEmpty = typeof name === 'undefined' && typeof id === 'undefined'
  if (isEmpty) {
    return (
      <div className={cs(wrapClass, styles.empty)} {...divProps}>
        <PlusOutlined />
      </div>
    )
  }

  return (
    <div className={wrapClass} {...divProps}>
      <img src={logoUrl} className={styles.image} />
      <span className={styles.name}>{name}</span>
    </div>
  )
}

CategoryList.Item = CategoryItem

export default CategoryList
