import React, { useState, useEffect } from 'react'
import { Button, Input, Select, Checkbox } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { changeProps } from '@apps/design-core'
import { ReactSortable } from 'react-sortablejs'
import cx from 'classnames'
import { isEmpty, cloneDeep } from 'lodash'
import { UploadImage } from '@apps/components'
import arrowRightIcon from '@/assets/icons/arrow_right.png'
import arrowLeftIcon from '@/assets/icons/arrow_left.png'
import arrowUpIcon from '@/assets/icons/arrow_up.png'
import arrowDownIcon from '@/assets/icons/arrow_down.png'
import sortIcon from '@/assets/icons/sort_icon.png'

import styles from './index.less'

interface DataItemType {
  id: number
  name: string
  /** 跳转类型：1-找现货 2-找供应 3-发布求购 4求购列表 5-换积分 6-找店铺 7-看资讯 8-授信申请 9-人气店铺 10-求购动态 11-最新成交 12-外部链接(可多个) */
  type: number
  url: string
  icon: string
  expand: boolean
}

interface QuickNavPropsType {
  dataList: DataItemType[]
  visible: boolean
}

const RedirectTypeList = [
  {
    value: 1,
    label: '找现货',
  },
  {
    value: 2,
    label: '找供应',
  },
  {
    value: 3,
    label: '发布求购',
  },
  {
    value: 4,
    label: '求购列表',
  },
  {
    value: 5,
    label: '换积分',
  },
  {
    value: 6,
    label: '找店铺',
  },
  {
    value: 7,
    label: '看资讯',
  },
  {
    value: 8,
    label: '授信申请',
  },
  {
    value: 9,
    label: '人气店铺',
  },
  {
    value: 10,
    label: '求购动态',
  },
  {
    value: 11,
    label: '最新成交',
  },
  {
    value: 12,
    label: '外部链接',
  },
]

const QuickNav: React.FC<QuickNavPropsType> = (props) => {
  const { dataList, visible } = props
  const [list, setList] = useState<DataItemType[]>([])

  useEffect(() => {
    initDataList()
  }, [dataList])

  const initDataList = () => {
    if (dataList) {
      const newDataList = cloneDeep(dataList).map((item: DataItemType, index: number) => {
        item.id = index + 1
        item.expand = item.expand || false
        return item
      })
      setList(newDataList)
    }
  }

  const handleExpand = (id: number, expand: boolean) => {
    const newList = [...list]
    newList.map((item) => {
      if (item.id === id) {
        item.expand = expand
      } else {
        item.expand = false
      }
    })
    setList(newList)
  }

  const sortUp = (index: number, item: DataItemType) => {
    const newList = JSON.parse(JSON.stringify(list))
    const tempItem = JSON.parse(JSON.stringify(item))
    const temp = newList[index - 1]
    newList[index - 1] = item
    newList[index - 1].id = temp.id
    newList[index] = temp
    newList[index].id = tempItem.id
    setList(newList)
    changeProps({
      props: Object.assign({ ...props }, { dataList: newList }),
    })
  }

  const sortDown = (index: number, item: DataItemType) => {
    const newList = JSON.parse(JSON.stringify(list))
    const temp = newList[index + 1]
    const tempItem = JSON.parse(JSON.stringify(item))
    newList[index + 1] = item
    newList[index + 1].id = temp.id
    newList[index] = temp
    newList[index].id = tempItem.id
    setList(newList)
    changeProps({
      props: Object.assign({ ...props }, { dataList: newList }),
    })
  }

  const handleDeleteItem = (index: number) => {
    console.log('handleDeleteItem', index)
  }

  const handleIconChange = (url: string, id: number) => {
    const newList = [...list]
    newList.map((item) => {
      if (item.id === id) {
        item.icon = url
      }
    })
    setList(newList)
    changeProps({
      props: Object.assign({ ...props }, { dataList: newList }),
    })
  }

  const handleSortableChange = (evt, sortable, store) => {
    console.log(evt, sortable, store)
  }

  /**
   * 显示隐藏模块
   */
  const handleHideChange = (e) => {
    const checked = e.target.checked
    changeProps({
      props: Object.assign({ ...props }, { visible: !checked }),
    })
  }

  /**
   * 根据id删除某一项
   * @param id
   */
  const handleClickItem = (id: number) => {
    const newList = [...list]
    const result = newList.filter((item) => item.id !== id)
    setList(result)
    changeProps({
      props: Object.assign({ ...props }, { dataList: result }),
    })
  }

  /**
   * 修改跳转类型
   */
  const handleTypeChange = (type: number, id: number) => {
    const newList = [...list]
    newList.map((item) => {
      if (item.id === id) {
        item.type = type
        if (!item.name) {
          item.name = findNameByType(item.type)
        }
      }
    })
    setList(newList)
    changeProps({
      props: Object.assign({ ...props }, { dataList: newList }),
    })
  }

  /**
   * 根据类型查询导航栏链接名称
   * @param type
   */
  const findNameByType = (type: number) => {
    const result = RedirectTypeList.filter((item) => item.value === type)[0]
    if (!isEmpty(result)) {
      return result.label
    }
    return ''
  }

  /**
   * 修改广告名称
   * @param value
   * @param id
   */
  const handleNameChange = (value: string, id: number) => {
    const newList = [...list]
    newList.map((item) => {
      if (item.id === id) {
        item.name = value
      }
    })
    setList(newList)
    changeProps({
      props: Object.assign({ ...props }, { dataList: newList }),
    })
  }

  /**
   * 修改链接地址
   * @param value
   * @param id
   */
  const handleUrlChange = (value: string, id: number) => {
    const newList = [...list]
    newList.map((item) => {
      if (item.id === id) {
        item.url = value
      }
    })
    setList(newList)
    changeProps({
      props: Object.assign({ ...props }, { dataList: newList }),
    })
  }

  /**
   * 添加广告
   */
  const handleAddItem = () => {
    const newList = [...list]
    const newItem: DataItemType = {
      id: newList.length + 1,
      expand: true,
      icon: '',
      type: 0,
      name: '',
      url: '',
    }
    handleExpand(newItem.id, true)
    setList([...newList, newItem])
    changeProps({
      props: Object.assign({ ...props }, { dataList: [...newList, newItem] }),
    })
  }

  return (
    <div className={styles.setting}>
      <div className={styles.hideModule}>
        <Checkbox checked={!visible} onChange={handleHideChange}>
          隐藏整个模块
        </Checkbox>
      </div>
      <ReactSortable
        list={list}
        setList={(newList) => {
          setList(newList)
          if (!isEmpty(newList)) {
            changeProps({
              props: Object.assign({ ...props }, { dataList: newList }),
            })
          }
        }}
        onChange={handleSortableChange}
        handle=".draghandle"
      >
        {list.map((item, index) => (
          <div className={styles.setting_line} key={`setting_${index}`}>
            <div className={styles.setting_line_main}>
              <div className={styles.setting_line_name}>
                <div style={{ flex: 1 }} onClick={() => handleExpand(item.id, !item.expand)}>
                  {item.expand ? (
                    <img className={styles.icon} src={arrowLeftIcon} />
                  ) : (
                    <img className={styles.icon} src={arrowRightIcon} />
                  )}
                  <span>{item.name}</span>
                </div>
                <div className={styles.setting_line_operation}>
                  <Button
                    type="link"
                    disabled={index === 0}
                    onClick={() => sortUp(index, item)}
                    className={styles.setting_line_operation_btn}
                    icon={<img className={styles.setting_line_operation_btn_icon} src={arrowUpIcon} />}
                  ></Button>
                  <Button
                    type="link"
                    disabled={index === list.length - 1}
                    onClick={() => sortDown(index, item)}
                    className={styles.setting_line_operation_btn}
                    icon={<img className={styles.setting_line_operation_btn_icon} src={arrowDownIcon} />}
                  ></Button>
                  <Button
                    type="link"
                    className={cx(styles.setting_line_operation_btn, 'draghandle')}
                    onClick={() => handleDeleteItem(index)}
                    icon={<img className={styles.setting_line_operation_btn_icon} src={sortIcon} />}
                  ></Button>
                </div>
              </div>
              {!!item.expand && (
                <div className={styles.setting_line_addItem}>
                  <div className={styles.deleteItem}>
                    <label onClick={() => handleClickItem(item.id)}>
                      <DeleteOutlined className={styles.deleteItem_icon} />
                      <span>删除入口</span>
                    </label>
                  </div>
                  <div className={styles.setting_line_addItem_line}>
                    <div className={styles.setting_line_addItem_line_label}>名称：</div>
                    <div className={styles.setting_line_addItem_line_brief}>
                      <Input
                        value={item.name}
                        maxLength={6}
                        onChange={(e) => handleNameChange(e.target.value, item.id)}
                      />
                    </div>
                  </div>
                  <div className={styles.setting_line_addItem_line}>
                    <div className={styles.setting_line_addItem_line_label}>导航链接：</div>
                    <div className={styles.setting_line_addItem_line_brief}>
                      <Select
                        style={{ width: '100%' }}
                        value={item.type || undefined}
                        onChange={(value) => handleTypeChange(value, item.id)}
                      >
                        {RedirectTypeList.map((item) => (
                          <Select.Option value={item.value} key={`redirect_type_${item.value}`}>
                            {item.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                  {item.type === 12 && (
                    <div className={styles.setting_line_addItem_line}>
                      <div className={styles.setting_line_addItem_line_label}>链接地址：</div>
                      <div className={styles.setting_line_addItem_line_brief}>
                        <Input value={item.url} onChange={(e) => handleUrlChange(e.target.value, item.id)} />
                      </div>
                    </div>
                  )}
                  <div className={styles.setting_line_addItem_line}>
                    <div className={styles.setting_line_addItem_line_label}>图标：</div>
                    <div className={styles.setting_line_addItem_line_brief}>
                      <div className={styles.uploadIconWrap}>
                        <UploadImage onChange={(url) => handleIconChange(url, item.id)} listType="text">
                          <div className={cx(styles.uploadIconBtn, styles.small)}>
                            <PlusOutlined className={styles.uploadIconBtnIcon} />
                            <span>上传图标</span>
                          </div>
                        </UploadImage>
                        <label className={styles.uploadIconTip}>最佳尺寸：160*160</label>
                      </div>
                      <div className={styles.previewIconWrap}>
                        {item.icon && (
                          <img src={item.icon} className={cx(styles.previewIcon, styles.large)} alt={item.name} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </ReactSortable>
      <Button className={styles.selectBtn} icon={<PlusOutlined />} onClick={handleAddItem}>
        添加功能模块
      </Button>
    </div>
  )
}

export default QuickNav
