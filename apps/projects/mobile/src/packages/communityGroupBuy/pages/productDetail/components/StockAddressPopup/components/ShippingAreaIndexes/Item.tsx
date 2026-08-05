/**
 * @Deprecated 配送至区域选择项组件
 */
import React, { useState, useEffect } from 'react'
import { View, Text, Icons, IndexList } from '@apps/mobile-ui'
import './index.scss'

export type AreaItemType = {
  /**
   * 名称
   */
  name: string
  /**
   * 编码
   */
  code: string
}

interface ShippingAreaIndexesItemProps {
  /**
   * 父级code
   */
  pcode: string | undefined
  /**
   * 当前选择的地址id
   */
  checked?: string
  /**
   * 选择区域触发事件
   */
  onChange?: (value: AreaItemType) => void
}

export type ItemsType = {
  /**
   * 名称
   */
  name: string
} & { [key: string]: any }

export type ListItemType = {
  /**
   * key
   */
  key: string | number
  /**
   * 标题
   */
  title?: string | number
  /**
   * 数据集
   */
  items: ItemsType[]
}

export const ShippingAreaIndexesItem: React.FC<ShippingAreaIndexesItemProps> = (props) => {
  const { pcode, checked, onChange } = props

  const [innerChecked, setInnerChecked] = useState<string>('')
  const [dataSource, setDataSource] = useState<ListItemType[]>([])
  const [loading, setLoading] = useState(false)

  const getAreaByPcode = (code?: string) => {
    console.log('code', code)
    return Promise.resolve({
      code: 1000,
      data: [
        {
          key: 'A',
          items: [
            {
              name: '安能物流',
              code: '1',
            },
          ],
        },
        {
          key: 'B',
          items: [
            {
              name: '百世快递',
              code: '2',
            },
            {
              name: '百世物流',
              code: '3',
            },
          ],
        },
        {
          key: 'C',
          items: [
            {
              name: '长城快递1',
              code: '4',
            },
            {
              name: '长城快递2',
              code: '5',
            },
            {
              name: '长城快递3',
              code: '6',
            },
            {
              name: '长城快递4',
              code: '7',
            },
            {
              name: '长城快递5',
              code: '8',
            },
          ],
        },
        {
          key: 'D',
          items: [
            {
              name: '达达快递1',
              code: '9',
            },
            {
              name: '达达快递2',
              code: '10',
            },
            {
              name: '达达快递3',
              code: '11',
            },
            {
              name: '达达快递4',
              code: '12',
            },
            {
              name: '达达快递5',
              code: '13',
            },
          ],
        },
      ],
    })
  }

  const initAreas = async () => {
    if (pcode === null) {
      setDataSource([])
      return
    }
    setLoading(true)
    const res = await getAreaByPcode(pcode)
    if (res.code === 1000) {
      setDataSource(res.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    initAreas()
  }, [pcode])

  useEffect(() => {
    if ('checked' in props) {
      setInnerChecked(checked!)
    }
  }, [checked])

  const triggerChange = (value: AreaItemType) => {
    onChange?.(value)
  }

  const handleChooseArea = (value: AreaItemType) => {
    if (!('checked' in props)) {
      setInnerChecked(value.code)
    }
    triggerChange(value)
  }

  return (
    <View>123</View>
    // <IndexList
    //   list={dataSource as any}
    //   customScrollStyle={myStyle['area-indexes-scroll']}
    //   customGroupStyle={myStyle['area-indexes-group']}
    //   customRenderContent={(indexItem) => (
    //     <View style={myStyle['area-indexes-swiper-item-group']}>
    //       {indexItem.items.map((grand, index) => (
    //         <TouchableOpacity
    //           key={`${grand.name}+${index}`}
    //           style={myStyle['area-indexes-swiper-item-group-item']}
    //           onPress={() => handleChooseArea(grand as AreaItemType)}
    //           activeOpacity={0.9}
    //         >
    //           <View style={myStyle['area-indexes-swiper-item-titleWrap']}>
    //             <Text style={myStyle['area-indexes-swiper-item-key']}>
    //               {index === 0 ? indexItem.key : ''}
    //             </Text>
    //             <Text style={myStyle['area-indexes-swiper-item-title']}>
    //               {grand.name}
    //             </Text>
    //             {grand.code === innerChecked ? (
    //               <View style={myStyle['area-indexes-swiper-item-icon']}>
    //                 <Icons
    //                   name="check"
    //                   size={14}
    //                   color={appTheme.colors.primary}
    //                 />
    //               </View>
    //             ) : null}
    //           </View>
    //         </TouchableOpacity>
    //       ))}
    //     </View>
    //   )}
    // />
  )
}

export default ShippingAreaIndexesItem
