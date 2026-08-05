/*
 * @Description: 信息折叠卡片
 */
import React from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { themeLayout } from '@/constants/theme'
import CollapseCard, { CollapseCardProps } from '@/components/CollapseCard'
import Cell from '@/components/Cell'
import './index.scss'
import { Image } from '@apps/mobile-ui'

export interface CellListCardProps extends CollapseCardProps {
  /**
   * 数据项的背景颜色
   */
  dataItemBgc?: string
  /**
   * 数据
   */
  dataSource: {
    /**
     * 标题
     */
    title: React.ReactNode
    /**
     * 内容
     */
    value?: React.ReactNode
    /**
     * 描述内容
     */
    label?: React.ReactNode
  }[]
}

const CellListCard: React.FC<CellListCardProps> = (props: CellListCardProps) => {
  const { dataItemBgc = '#ffffff', dataSource, ...restProps } = props

  // const renderContent = (item, type = 'string') => {
  // 	switch(type) {
  // 		case 'string': {
  // 			return item.value
  // 		}

  // 		case 'file': {
  // 			return <Image style={{ width: 60, height: 60 }} src={item.value}/>
  // 		}

  // 		default: {
  // 			return item.value
  // 		}
  // 	}
  // }
  return (
    <CollapseCard
      // headStyle={{
      //   borderBottom: 'none',
      // }}
      customContentStyle={{
        padding: 0,
      }}
      headStyle={{
        paddingRight: 0,
        paddingLeft: 0,
        marginRight: pxTransform(themeLayout['margin-s']),
        marginLeft: pxTransform(themeLayout['margin-s']),
      }}
      {...restProps}
    >
      <Cell border={false}>
        {dataSource.map((item, index) => (
          <Cell.Item
            key={index}
            title={item.title}
            value={item.value}
            label={item.label}
            customHeadStyle={{
              alignItems: 'flex-start',
              backgroundColor: dataItemBgc,
            }}
          />
        ))}
      </Cell>
    </CollapseCard>
  )
}

export default CellListCard
