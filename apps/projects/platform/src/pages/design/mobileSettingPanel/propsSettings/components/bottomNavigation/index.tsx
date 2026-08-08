import React, { useState, useEffect } from 'react'
import { Button, Input, Radio, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useIntl } from '@linkseeks/i18n'
import { changeProps, produce } from '@apps/design-core'
import { ReactSortable } from 'react-sortablejs'
import cx from 'classnames'
import { isEmpty } from 'lodash'
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
  icon: string
  selectIcon: string
  /** 类型：1-首页 2-积分 3-工作台 4-资讯 5-购物车 6-我的 */
  type: number
  status: boolean
  expand: boolean
}

interface BottomNavigationPropsType {
  dataList: DataItemType[]
}

const BottomNavigation: React.FC<BottomNavigationPropsType> = (props) => {
  const { dataList } = props
  const [list, setList] = useState<DataItemType[]>([])
  const intl = useIntl()

  const RedirectTypeList = [
    {
      value: 1,
      label: intl.formatMessage({ id: 'editor.bottom.link.type.home' }), // 首页
    },
    {
      value: 2,
      label: intl.formatMessage({ id: 'editor.bottom.link.type.integral' }), // 积分
    },
    {
      value: 3,
      label: intl.formatMessage({ id: 'editor.bottom.link.type.workbench' }), // 工作台
    },
    {
      value: 4,
      label: intl.formatMessage({ id: 'editor.bottom.link.type.information' }), // 资讯
    },
    {
      value: 5,
      label: intl.formatMessage({ id: 'editor.bottom.link.type.purchase' }), // 购物车
    },
    {
      value: 6,
      label: intl.formatMessage({ id: 'editor.bottom.link.type.mine' }), // 我的
    },
  ]

  useEffect(() => {
    initDataList()
  }, [dataList])

  const initDataList = () => {
    if (dataList) {
      const newDataList = produce(dataList, (oldList) => {
        oldList.map((item: DataItemType, index: number) => {
          item.id = index + 1
          item.expand = item.expand || false
          return item
        })
      })
      setList(newDataList)
    }
  }

  /**
   * 修改名称
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
   * 修改导航链接
   */
  const handleTypeChange = (type: number, id: number) => {
    const newList = [...list]
    newList.map((item) => {
      if (item.id === id) {
        item.type = type
        item.name = findNameByType(type)
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

  const judgedItemNotInList = (item, type: number) => {
    if (item.value === type) {
      return true
    }
    return list.every((listItem) => listItem.type !== item.value)
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
    console.log('handleDeleteItem')
  }

  const handleStatusChange = (e, name: string) => {
    const check = e.target.value
    const newList = [...list]
    newList.map((item) => {
      if (item.name === name) {
        item.status = check
      }
    })
    setList(newList)
    changeProps({
      props: Object.assign({ ...props }, { dataList: newList }),
    })
  }

  const handleIconChange = (url: string, id: number, key: string) => {
    const newList = [...list]
    newList.map((item) => {
      if (item.id === id) {
        item[key] = url
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

  return (
    <div className={styles.setting}>
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
              {item.expand && (
                <div className={styles.setting_line_addItem}>
                  <div className={styles.setting_line_addItem_line}>
                    <div className={styles.setting_line_addItem_line_label}>
                      {intl.formatMessage({ id: 'editor.setting.form.name' })}：
                    </div>
                    <div className={styles.setting_line_addItem_line_brief}>
                      <Input
                        value={item.name}
                        maxLength={4}
                        onChange={(e) => handleNameChange(e.target.value, item.id)}
                      />
                    </div>
                  </div>
                  <div className={styles.setting_line_addItem_line}>
                    <div className={styles.setting_line_addItem_line_label}>
                      {intl.formatMessage({ id: 'editor.form.label.navlink' })}：
                    </div>
                    <div className={styles.setting_line_addItem_line_brief}>
                      <Select
                        style={{ width: '100%' }}
                        value={item.type || undefined}
                        onChange={(value) => handleTypeChange(value, item.id)}
                      >
                        {RedirectTypeList.map(
                          (selectItem) =>
                            judgedItemNotInList(selectItem, item.type) && (
                              <Select.Option value={selectItem.value} key={`redirect_type_${selectItem.value}`}>
                                {selectItem.label}
                              </Select.Option>
                            ),
                        )}
                      </Select>
                    </div>
                  </div>
                  <div className={styles.setting_line_addItem_line}>
                    <div className={styles.setting_line_addItem_line_label}>
                      {intl.formatMessage({ id: 'editor.form.label.icon.default' })}：
                    </div>
                    <div className={styles.setting_line_addItem_line_brief}>
                      <div className={styles.uploadIconWrap}>
                        <UploadImage onChange={(url) => handleIconChange(url, item.id, 'icon')} listType="text">
                          <div className={cx(styles.uploadIconBtn, styles.small)}>
                            <PlusOutlined className={styles.uploadIconBtnIcon} />
                            <span>{intl.formatMessage({ id: 'editor.form.btn.upload.icon' })}</span>
                          </div>
                        </UploadImage>
                        <label className={styles.uploadIconTip}>
                          {intl.formatMessage({ id: 'editor.form.tip.best.size' })}：160*160
                        </label>
                      </div>
                      <div className={styles.previewIconWrap}>
                        {item.icon && <img src={item.icon} className={styles.previewIcon} alt={item.name} />}
                      </div>
                    </div>
                  </div>
                  <div className={styles.setting_line_addItem_line}>
                    <div className={styles.setting_line_addItem_line_label}>
                      {intl.formatMessage({ id: 'editor.form.label.icon.select' })}：
                    </div>
                    <div className={styles.setting_line_addItem_line_brief}>
                      <div className={styles.uploadIconWrap}>
                        <UploadImage onChange={(url) => handleIconChange(url, item.id, 'selectIcon')} listType="text">
                          <div className={cx(styles.uploadIconBtn, styles.small)}>
                            <PlusOutlined className={styles.uploadIconBtnIcon} />
                            <span>{intl.formatMessage({ id: 'editor.form.btn.upload.icon' })}</span>
                          </div>
                        </UploadImage>
                        <label className={styles.uploadIconTip}>
                          {intl.formatMessage({ id: 'editor.form.tip.best.size' })}：160*160
                        </label>
                      </div>
                      <div className={styles.previewIconWrap}>
                        {item.selectIcon && (
                          <img src={item.selectIcon} className={styles.previewIcon} alt={item.name} />
                        )}
                      </div>
                    </div>
                  </div>
                  {item.type !== 1 && item.type !== 4 && (
                    <div className={styles.setting_line_addItem_line}>
                      <div className={styles.setting_line_addItem_line_label}>
                        {intl.formatMessage({ id: 'editor.form.label.hideOrShow' })}：
                      </div>
                      <div className={styles.setting_line_addItem_line_brief}>
                        <Radio.Group onChange={(e) => handleStatusChange(e, item.name)} value={item.status}>
                          <Radio value={false}>{intl.formatMessage({ id: 'editor.form.radio.show' })}</Radio>
                          <Radio value={true}>{intl.formatMessage({ id: 'editor.form.radio.hide' })}</Radio>
                        </Radio.Group>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </ReactSortable>
    </div>
  )
}

export default BottomNavigation
