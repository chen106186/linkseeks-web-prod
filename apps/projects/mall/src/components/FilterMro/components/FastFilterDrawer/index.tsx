import React, { useState, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { Drawer, Input, Checkbox, Button, Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import cx from 'classnames'
import { LinkTo } from '@/utils'
import { useEffect } from 'react'
import { LAYOUT_TYPE } from '@/types/global'
import { getWebIntl } from '@/utils/locales'
import { changeURLArg } from '@/utils/getUrlParam'
import styles from './index.module.less'

interface FastFilterDrawerPropsType {
  layoutType: LAYOUT_TYPE
  visible: boolean
  mroCategoryTree?: any[]
  onClose?: () => void
  onSubmit?: () => void
  mroFilterSelected?: any
  selectedItem?: any
}

const FastFilterDrawer: React.FC<FastFilterDrawerPropsType> = (props) => {
  const { visible, mroCategoryTree, layoutType, onClose, onSubmit, mroFilterSelected, selectedItem } = props
  const [selectItem, setSelectItem] = useState<any>(selectedItem || mroCategoryTree?.[0])
  const [text, setText] = useState<string>('')
  // const { setMroFilter, clearMroFilter } = FilterStore
  const [display, setDisplay] = useState<boolean>(false)
  const { pathname, search } = useLocation()
  const translate = getWebIntl()
  const _attrName = layoutType === LAYOUT_TYPE.joint ? 'attributeValueList' : 'customerAttributeValueList'

  const _itemClick = (item: any) => {
    setSelectItem(item)
  }

  const _setMroFilter = (parentId: number, id: number, isAble?: boolean) => {
    if (isAble) {
      // setMroFilter(parentId, id, layoutType)
    }
  }

  const _handleSubmit = () => {
    let _list: any = []
    let url = `${pathname}${search}`
    for (let key in mroFilterSelected['attr']) {
      mroFilterSelected['attr'][key]?.forEach((item: number) => _list.push(`c${item}`))
    }
    for (let key2 in mroFilterSelected['brand']) {
      mroFilterSelected['brand'][key2]?.forEach((item: number) => _list.push(`b${item}`))
    }
    if (url.indexOf('mroFilter') > -1) {
      url = changeURLArg(url, 'mroFilter', _list.join('_'))
    } else {
      url += `${search ? `&` : '?'}mroFilter=${_list.join('_')}`
    }
    LinkTo(url)
  }

  useEffect(() => {
    setSelectItem(selectedItem)
  }, [selectedItem])

  useEffect(() => {
    setText('')
  }, [selectItem])

  const _children = useMemo(() => {
    if (!text) {
      return selectItem?.[_attrName]
        ?.filter((item: any) => {
          if (!display || (display && (item?.able === undefined || item?.able))) return item
        })
        .filter((item: any) => item != undefined)
    } else {
      return selectItem?.[_attrName]
        ?.map((child: any) => {
          if (child.value.indexOf(text) >= 0) return child
        })
        .filter((item: any) => {
          if (!display || (display && (item?.able === undefined || item?.able))) return item
        })
        .filter((item: any) => item != undefined)
    }
  }, [text, selectItem, mroFilterSelected, display])

  const _returnKeyName = (item: any) => {
    if (item.id === 'brand999') {
      return 'brand'
    }
    return 'attr'
  }

  return (
    <Drawer
      title={translate('web.resource.mall.kuaisushaixuan')}
      width={1200}
      onClose={onClose}
      open={visible}
      closable={false}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onClose}>{translate('web.common.cancel')}</Button>
            <Button type="primary" onClick={_handleSubmit}>
              {translate('web.common.confirm')}
            </Button>
          </Space>
        </div>
      }
    >
      <div className={styles.filterMro_fastFilterDrawer}>
        <div className={styles.filterMro_fastFilterDrawer_left}>
          {mroCategoryTree?.map((item: any, index: any) => (
            <div
              key={`${item.id}_${index}`}
              className={cx(
                styles.filterMro_fastFilterDrawer_left_item,
                item?.id === selectItem?.id ? styles.active : null,
              )}
              onClick={() => {
                _itemClick(item)
              }}
            >
              <span className={styles.filterMro_fastFilterDrawer_left_item_title}>
                {item.id === 'brand999' ? translate('web.resource.mall.brand') : item.name}
              </span>
              {mroFilterSelected[_returnKeyName(item)]
                ? mroFilterSelected[_returnKeyName(item)][item.id]?.length > 0 &&
                  `(${mroFilterSelected[_returnKeyName(item)][item.id]?.length})`
                : ''}
            </div>
          ))}
        </div>
        <div className={styles.filterMro_fastFilterDrawer_right}>
          <div className={styles.filterMro_fastFilterDrawer_right_top}>
            <div className={styles.filterMro_fastFilterDrawer_right_top_search}>
              {selectItem?.id === 'brand999' ? translate('web.resource.mall.brand') : selectItem?.name}
              <Input
                value={text}
                key={'Input_Filter'}
                className={styles.filterMro_fastFilterDrawer_right_top_search_input}
                suffix={<SearchOutlined />}
                allowClear
                onChange={(e: any) => {
                  setText(e.target.value)
                }}
              />
            </div>
            <Checkbox
              onChange={(e) => {
                setDisplay(e.target.checked)
              }}
            >
              {translate('web.resource.mall.yincangbukexuan')}
            </Checkbox>
            <div
              className={styles.filterMro_fastFilterDrawer_right_top_btn}
              // onClick={() => { clearMroFilter(selectItem?.id,layoutType) }}
            >
              {translate('web.resource.mall.qingchushaixuan')}
            </div>
          </div>
          <div className={styles.filterMro_fastFilterDrawer_right_box}>
            {_children?.length > 0 &&
              _children?.map((item: any, index: any) => (
                <div
                  key={`${selectItem?.id}_${item?.id}_${index}`}
                  className={cx(
                    styles.filterMro_fastFilterDrawer_right_box_item,
                    item?.able !== undefined && !item?.able
                      ? styles.disable
                      : mroFilterSelected[_returnKeyName(selectItem)]?.[selectItem?.id]?.indexOf(item?.id) >= 0
                      ? styles.active
                      : null,
                  )}
                  onClick={() => {
                    _setMroFilter(selectItem?.id, item?.id, item?.able === undefined || item?.able)
                  }}
                >
                  {item?.value}
                </div>
              ))}
          </div>
        </div>
      </div>
    </Drawer>
  )
}

export default FastFilterDrawer
