import React, { Fragment, useState } from 'react'
import useHistory from '@/hooks/useHistory'
import { Checkbox, Tree, CheckboxOptionType } from 'antd'
import { LAYOUT_TYPE } from '@/types/global'
import { getWebIntl } from '@/utils/locales'
import { changeURLArg, getQueryString, removeURLArg } from '@/utils/getUrlParam'
import FilterBox from '../FilterBox'
import { AttributeType, AttributeValueItem, FILTER_PARAM, FILTER_SEARCH_TYPE } from '../types'
import { useEffect } from 'react'
import './index.less'

const CheckboxGroup = Checkbox.Group

export interface CategoryItemType {
  id: number
  categoryId: number
  key: string
  title: string | React.ReactNode
  link?: string
  name: string
  treeName: string
  children?: CategoryItemType[]
  brandList?: {
    brandId: number
    brandLogo: string
    brandName: string
  }[]
}

interface CategoryProps {
  innerValue: FILTER_PARAM | undefined
  layoutType?: LAYOUT_TYPE
  source: CategoryItemType[]
  /** 是否显示属性筛选 */
  showAttrFilter?: boolean
  attributeList?: AttributeType[]
  pathname?: string
  search?: string
  onChange?: (values: FILTER_PARAM) => void
}

const Category: React.FC<CategoryProps> = (props) => {
  const {
    source: categoryList,
    innerValue,
    layoutType,
    showAttrFilter,
    attributeList,
    pathname,
    search,
    onChange,
  } = props
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [expandedKeys, setExpandedKeys] = useState<string[]>([])
  const [selectAttrbuteList, setSelectAttrbuteList] = useState<any>([])
  const history = useHistory()
  const translate = getWebIntl()

  const initKey = () => {
    setSelectedKeys([])
    setExpandedKeys([])
    setSelectAttrbuteList([])
  }

  useEffect(() => {
    if (innerValue) {
      if (innerValue.categoryKey) {
        const initSelectKeys = () => {
          const categoryIds = innerValue.categoryKey.split('_')
          const initKeys: string[] = []
          let tempKey = ''
          for (const key of categoryIds) {
            if (!tempKey) {
              tempKey = `${key}`
            } else {
              tempKey = `${tempKey}_${key}`
            }

            if (key.indexOf('c') > -1) {
              initKeys.push(tempKey)
            }
          }

          setExpandedKeys(initKeys)
          setSelectedKeys([initKeys[initKeys.length - 1]])
        }
        initSelectKeys()
      } else {
        initKey()
      }

      if (innerValue?.customerAttributeList && innerValue?.customerAttributeList.length > 0) {
        const selectKey: number[] = []
        innerValue?.customerAttributeList.forEach((item: any) => {
          if (item.customerAttributeValueList && item.customerAttributeValueList.length > 0) {
            item.customerAttributeValueList.forEach((childItem: any) => {
              selectKey.push(Number(childItem.id))
            })
          }
        })

        setSelectAttrbuteList(selectKey)
      } else {
        setSelectAttrbuteList([])
      }
    } else {
      initKey()
    }
  }, [innerValue])

  const handleExpand = (expandedKeys: any) => {
    setExpandedKeys(expandedKeys)
  }

  /**
   * @param e
   * @param path
   */
  const linkToPath = (e: any, path: string) => {
    e.preventDefault()
    window.location.href = path
  }

  const linkAndAttr = (param: string) => {
    history.push(`${pathname}${param}`)
  }

  const getDetailById = (attrId: any, attrValId: any, state = 2) => {
    let detail = {}
    if (attributeList) {
      for (const item of attributeList) {
        if (item.id === attrId) {
          if (state === 1) {
            detail = item
          } else {
            for (const childItem of item.attributeValueList) {
              if (childItem.id === attrValId) {
                detail = childItem
              }
            }
          }
        }
      }
    }
    return detail
  }

  const handleChange = (attrId: any, checkedList: any[]) => {
    const common = `${attrId}-${checkedList
      .map((item) => {
        const detail: any = getDetailById(attrId, item)
        return detail.id
      })
      .join(',')}`

    if (search) {
      const attr = getQueryString('attr', search)
      if (attr) {
        const attrList = attr.split(';').filter((item) => item)
        let isExist = false
        /**
         * 判断所选属性是否存在
         */
        let exitsAttr = ''
        for (let i = 0; i < attrList.length; i++) {
          const searchAttrId = attrList[i].split('-')[0]
          if (attrId === Number(searchAttrId)) {
            isExist = true
            exitsAttr = attrList[i]
            break
          }
        }
        if (isExist) {
          let newSearch = ''
          if (checkedList.length > 0) {
            newSearch = changeURLArg(search, 'attr', attr.replace(exitsAttr, common))
          } else {
            if (attrList.length > 1) {
              newSearch = changeURLArg(search, 'attr', attr.replace(exitsAttr, ''))
            } else {
              newSearch = removeURLArg(search, 'attr')
            }
          }
          linkAndAttr(newSearch)
        } else {
          const newSearch = changeURLArg(search, 'attr', `${attr}${search.indexOf(';') > -1 ? '' : ';'}${common}`)
          linkAndAttr(newSearch)
        }
      } else {
        linkAndAttr(`${search}&attr=${common}`)
      }
    } else {
      linkAndAttr(`?attr=${common}`)
    }
  }

  const formatAttributeValueList = (list: AttributeValueItem[]) => {
    if (list && list.length > 0) {
      return list.map((item, index) => {
        return {
          label: item.value,
          value: item?.id || index,
        }
      })
    }
    return []
  }

  return categoryList && categoryList.length > 0 ? (
    <Fragment>
      <FilterBox title={translate('web.resource.mall.category')}>
        <div className="filter_category">
          <Tree
            expandedKeys={expandedKeys}
            selectedKeys={selectedKeys}
            treeData={categoryList}
            titleRender={(nodeData: any) => {
              return (
                <a
                  onClick={(e) => linkToPath(e, nodeData?.link)}
                  href={nodeData?.link}
                  title={nodeData?.name}
                  className={nodeData?.children && nodeData?.children.length > 0 ? '' : 'sub_category_title'}
                >
                  {nodeData?.name}
                </a>
              )
            }}
            onExpand={handleExpand}
          />
        </div>
      </FilterBox>
      {showAttrFilter &&
        attributeList &&
        attributeList.length > 0 &&
        attributeList.map((attrItem, attrIndex: number) => (
          <FilterBox key={`filter_box_${attrItem.id}_${attrIndex}`} title={attrItem.name}>
            <div className="filter_style">
              <CheckboxGroup
                value={selectAttrbuteList}
                options={formatAttributeValueList(attrItem.attributeValueList) as CheckboxOptionType[]}
                onChange={(val) => handleChange(attrItem.id, val)}
              />
            </div>
          </FilterBox>
        ))}
    </Fragment>
  ) : null
}

export default Category
