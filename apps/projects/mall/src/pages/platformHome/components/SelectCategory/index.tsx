import React, { useState } from 'react'
import { Tooltip, Tabs } from 'antd'
import { GetProductPlatformGetCategoryTreeResponse } from '@apps/apis'
import cx from 'classnames'
import { getWebIntl } from '@/utils/locales'
import arrowDownIcon from '../SelectCity/arrow_down_icon.png'
import styles from './index.module.less'

interface SelectCategoryProps {
  value: SelectCategoryType | undefined
  placeholder?: string
  onChange: (value: SelectCategoryType) => void
  categoryList: GetProductPlatformGetCategoryTreeResponse
  theme?: 'logistics' | 'process'
}

export interface SelectCategoryType {
  firstCateogryId: number
  firstCategoryName: string
  secondCategoryId?: number
  secondCategoryName?: string
  thirdCategoryId?: number
  thirdCategoryName?: string
}

interface CategoryItemType {
  id: string
  parentId: string
  name: string
  checked: boolean
  imageUrl: string
  children: CategoryItemType[]
}

const { TabPane } = Tabs

const SelectCategory: React.FC<SelectCategoryProps> = (props) => {
  const { value, placeholder, onChange, theme = 'logistics', categoryList } = props
  const [visible, setVisible] = useState<boolean>(false)
  const [tabActiveKey, setTabActiveKey] = useState<string>('first')
  const [secondCategoryList, setSecondCategoryList] = useState<CategoryItemType[]>([])
  const [thirdCategoryList, setThirdCategoryList] = useState<CategoryItemType[]>([])
  const [tempFirstCategory, setTempFirstCategory] = useState<CategoryItemType>() // 选择的一级品类信息
  const [tempSecondCategory, setTempSecondCategory] = useState<CategoryItemType>() // 选择的二级品类信息
  const translate = getWebIntl()

  const handleSelectCategory = (type: string, item: CategoryItemType) => {
    switch (type) {
      case 'first':
        setTempFirstCategory(item)
        if (item.children && item.children.length > 0) {
          setSecondCategoryList(item.children)
          setTabActiveKey('second')
        } else {
          onChange({
            firstCateogryId: Number(item.id),
            firstCategoryName: item.name,
          })
          setVisible(false)
        }
        break
      case 'second':
        setTempSecondCategory(item)
        if (item.children && item.children.length > 0) {
          setTabActiveKey('third')
          setThirdCategoryList(item.children)
        } else {
          if (tempFirstCategory) {
            onChange({
              firstCateogryId: Number(tempFirstCategory.id),
              firstCategoryName: tempFirstCategory.name,
              secondCategoryId: Number(item.id),
              secondCategoryName: item.name,
            })
            setVisible(false)
          }
        }
        break
      case 'third':
        if (tempFirstCategory && tempSecondCategory) {
          const selectValue: SelectCategoryType = {
            firstCateogryId: Number(tempFirstCategory.id),
            firstCategoryName: tempFirstCategory.name,
            secondCategoryId: Number(tempSecondCategory.id),
            secondCategoryName: tempSecondCategory.name,
            thirdCategoryId: Number(item.id),
            thirdCategoryName: item.name,
          }
          onChange(selectValue)
          setVisible(false)
        }
        break
      default:
        break
    }
  }

  const handleTabChange = (activeKey: string) => {
    let list: any = []
    switch (activeKey) {
      case 'first':
        list = categoryList
        break
      case 'second':
        list = secondCategoryList
        break
      case 'third':
        list = thirdCategoryList
        break
      default:
        break
    }
    if (list && list.length > 0) {
      setTabActiveKey(activeKey)
    }
  }

  const renderCityCategory = () => {
    return (
      <Tabs activeKey={tabActiveKey} onChange={(activeKey: string) => handleTabChange(activeKey)}>
        <TabPane tab={translate('web.resource.mall.yijipinlei')} key="first">
          <div className={styles.tab_body}>
            <div className={styles.category_list}>
              {categoryList &&
                categoryList.map((item) => (
                  <div
                    key={`first_category_${item.id}`}
                    className={cx(styles.select_item, tempFirstCategory?.id === item.id && styles.active)}
                    onClick={() => handleSelectCategory('first', item as unknown as CategoryItemType)}
                    title={item.name}
                  >
                    {item.name}
                  </div>
                ))}
            </div>
          </div>
        </TabPane>
        <TabPane tab={translate('web.resource.mall.erjipinlei')} key="second">
          <div className={styles.tab_body}>
            <div className={styles.category_list}>
              {secondCategoryList &&
                secondCategoryList.map((item) => (
                  <div
                    key={`second_category_${item.id}`}
                    className={cx(styles.select_item, tempSecondCategory?.id === item.id && styles.active)}
                    onClick={() => handleSelectCategory('second', item as unknown as CategoryItemType)}
                    title={item.name}
                  >
                    {item.name}
                  </div>
                ))}
            </div>
          </div>
        </TabPane>
        <TabPane tab={translate('web.resource.mall.sanjipinlei')} key="third">
          <div className={styles.tab_body}>
            <div className={styles.category_list}>
              {thirdCategoryList &&
                thirdCategoryList.map((item) => (
                  <div
                    key={`third_category_${item.id}`}
                    className={cx(
                      styles.select_item,
                      value && value.thirdCategoryId === Number(item.id) && styles.active,
                    )}
                    onClick={() => handleSelectCategory('third', item as unknown as CategoryItemType)}
                    title={item.name}
                  >
                    {item.name}
                  </div>
                ))}
            </div>
          </div>
        </TabPane>
      </Tabs>
    )
  }

  return (
    <Tooltip
      placement="bottomRight"
      title={renderCityCategory()}
      color="white"
      overlayClassName={cx(styles.tool_tip, theme === 'logistics' ? styles.logistics : styles.process)}
      open={visible}
    >
      <div className={styles.select_box} onClick={() => setVisible(!visible)}>
        <div className={styles.select_box_value}>
          {value ? (
            <span className={styles.value}>
              {value.firstCategoryName}
              {value.secondCategoryName ? `/${value.secondCategoryName}` : ''}
              {value.thirdCategoryName ? `/${value.thirdCategoryName}` : ''}
            </span>
          ) : (
            <span className={styles.placeholder}>{placeholder}</span>
          )}
        </div>
        <i className={styles.select_box_icon}>
          <img src={arrowDownIcon} />
        </i>
      </div>
    </Tooltip>
  )
}

export default SelectCategory
