import React, { useState, useMemo } from 'react'
import { Input } from 'antd'
import { SearchOutlined, FilterOutlined } from '@ant-design/icons'
import cx from 'classnames'
import { getWebIntl } from '@/utils/locales'
import FastFilterDrawer from '../FastFilterDrawer'
import styles from './index.module.less'
import { LAYOUT_TYPE } from '@/types/global'
import { MroCategoryItemType } from '@/types/commodity'

interface ControllerPropsType {
  layoutType: LAYOUT_TYPE
  mroCategoryTree: MroCategoryItemType[]
  mroFilterSelected: Record<string, any>
  display?: boolean
  setMroFilter: (parentId: string, id: number, layoutType: LAYOUT_TYPE) => void
}

interface ControllerItemPropsType {
  item: any
  layoutType: LAYOUT_TYPE
  mroFilterSelected: Record<string, any>
  display?: boolean
  setMroFilter: (parentId: string, id: number, layoutType: LAYOUT_TYPE) => void
}

const ControllerItem: React.FC<ControllerItemPropsType> = (props: ControllerItemPropsType) => {
  const { item, mroFilterSelected, setMroFilter, layoutType, display } = props
  const [text, setText] = useState<string>('')
  const _attrName = layoutType === LAYOUT_TYPE.joint ? 'attributeValueList' : 'customerAttributeValueList'

  const _children = useMemo(() => {
    if (!text) {
      return item?.[_attrName]
        ?.filter((item: any) => {
          if (!display || (display && (item?.able === undefined || item?.able))) return item
        })
        .filter((item: any) => item != undefined)
    } else {
      return item?.[_attrName]
        ?.map((child: any) => {
          if (child.value.indexOf(text) >= 0) return child
        })
        .filter((item: any) => {
          if (!display || (display && (item?.able === undefined || item?.able))) return item
        })
        .filter((item: any) => item != undefined)
    }
  }, [item, text, mroFilterSelected, display])

  const _keyName = useMemo(() => {
    if (item.id === 'brand999') {
      return 'brand'
    }
    return 'attr'
  }, [item])

  const _setMroFilter = (parentId: string, id: number, isAble?: boolean) => {
    console.log('_setMroFilter', parentId, id, isAble)
    if (isAble) {
      setMroFilter(parentId, id, layoutType)
    }
  }

  return (
    <div className={styles.filterMro_controller_item_container}>
      <Input
        className={styles.filterMro_controller_item_container_search}
        suffix={<SearchOutlined />}
        allowClear
        onChange={(e: any) => {
          setText(e.target.value)
        }}
      />
      <div className={styles.filterMro_controller_item_container_list}>
        {_children?.length > 0 &&
          _children?.map((child: any, childIndex: any) => (
            <div
              className={cx(
                styles.filterMro_controller_item_container_list_child,
                child?.able !== undefined && !child?.able
                  ? styles.disable
                  : mroFilterSelected[_keyName]?.[item?.id]?.indexOf(child?.id) >= 0
                  ? styles.active
                  : null,
              )}
              key={`${item?.id}_${child?.id}_${childIndex}`}
              onClick={() => {
                _setMroFilter(item?.id, child?.id, child?.able === undefined || child?.able)
              }}
            >
              {child?.value}
            </div>
          ))}
      </div>
    </div>
  )
}

const Controller: React.FC<ControllerPropsType> = (props) => {
  const { mroCategoryTree, mroFilterSelected, setMroFilter, layoutType, display } = props
  const translate = getWebIntl()
  const [visible, setVisible] = useState<boolean>(false)
  const [selectItem, setSelectItem] = useState<MroCategoryItemType>()

  const _toFastFilter = (item: MroCategoryItemType) => {
    setSelectItem(item)
    setVisible(true)
  }

  return (
    <>
      <div className={styles.filterMro_controller}>
        {mroCategoryTree?.map((item, index: number) => (
          <div className={styles.filterMro_controller_item} key={`${item.id}_${index}`}>
            <div
              className={styles.filterMro_controller_item_title}
              onClick={() => {
                _toFastFilter(item)
              }}
            >
              {item.id === 'brand999' ? translate('web.resource.mall.brand') : item.name}
              <FilterOutlined />
            </div>
            <ControllerItem
              setMroFilter={setMroFilter}
              layoutType={layoutType}
              item={item}
              mroFilterSelected={mroFilterSelected}
              display={display}
            />
          </div>
        ))}
      </div>
      <FastFilterDrawer
        layoutType={layoutType}
        mroFilterSelected={mroFilterSelected}
        selectedItem={selectItem}
        visible={visible}
        mroCategoryTree={mroCategoryTree}
        onClose={() => {
          setVisible(false)
        }}
      />
    </>
  )
}

export default Controller
