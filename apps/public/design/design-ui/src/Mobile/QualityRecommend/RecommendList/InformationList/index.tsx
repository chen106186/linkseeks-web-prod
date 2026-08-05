import React from 'react'
import cx from 'classnames'
import InformationItem, { InformationEmpty } from './item'
import styles from '../index.less'

export interface InformationItemType {
  id: number
  title: string
  imageUrl: string
  content?: string
  columnName: string
  createTime: number
  readCount: number
}

export interface BrandListProps {
  className: string
  activeType?: number
  dataList: InformationItemType[]
}

type ItemProps = {
  Item: typeof InformationItem
}

const InformationList: React.FC<BrandListProps> & ItemProps = (props) => {
  const { children, activeType, dataList, className, ...others } = props

  const classNameString = cx(styles['recommend_information_list'], className)

  return activeType === 4 ? (
    <div className={classNameString} {...others}>
      {children ? (
        React.Children.map(children, (child: any) => {
          return (
            <div className={styles['recommend_information_list_item']}>
              {child}
            </div>
          )
        })
      ) : dataList && dataList.length > 0 ? (
        dataList.map((item, index) => (
          <InformationItem key={`${item.title}-${index}`} {...item} />
        ))
      ) : (
        <InformationEmpty />
      )}
    </div>
  ) : null
}

InformationList.Item = InformationItem

export default InformationList
