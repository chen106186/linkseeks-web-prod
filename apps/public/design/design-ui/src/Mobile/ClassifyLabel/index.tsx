import React, { useState } from 'react'
import cx from 'classnames'
import CommodityList from './CommodityList'
import StoreList from './StoreList'
import InformationList from './InformationList'
import BrandList from './BrandList'
import LabelItem from './LabelItem'
import styles from './index.less'

export interface ClassifyLabelProps {
  className: string
  clientWidth?: number
}

type ItemProps = {
  LabelItem: typeof LabelItem
  CommodityList: typeof CommodityList
  StoreList: typeof StoreList
  BrandList: typeof BrandList
  InformationList: typeof InformationList
}

const ClassifyLabel: React.FC<ClassifyLabelProps> & ItemProps = (props) => {
  const { children, className, clientWidth = 375, ...others } = props
  const [activeType, seActiveType] = useState<number>(1)

  const classNameString = cx(styles['classify-label'], className)

  return (
    <div className={classNameString} {...others}>
      {children &&
        React.Children.map(children, (child: any) => {
          return React.cloneElement(child, {
            clientWidth,
            activeType,
            updateActiveType: (type: number) => seActiveType(type),
          })
        })}
    </div>
  )
}

ClassifyLabel.LabelItem = LabelItem
ClassifyLabel.CommodityList = CommodityList
ClassifyLabel.StoreList = StoreList
ClassifyLabel.BrandList = BrandList
ClassifyLabel.InformationList = InformationList

export default ClassifyLabel
