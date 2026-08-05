import React, { useState, useEffect } from 'react'
import { Button, Input, Select } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
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

const QuickNav: React.FC<QuickNavPropsType> = (props) => {
  const { dataList, visible } = props
  const [list, setList] = useState<DataItemType[]>([])
  const intl = useIntl()

  // 跳转类型：1-商品 2-分类 3-积分兑换 4-公司介绍 5-成为会员 12-外部链接(可多个)
  const RedirectTypeList = [
    {
      value: 1,
      label: intl.formatMessage({ id: 'editor.nav.link.type.product' }), // '商品',
    },
    {
      value: 2,
      label: intl.formatMessage({ id: 'editor.bottom.link.type.classify' }), // '分类',
    },
    {
      value: 3,
      label: intl.formatMessage({ id: 'editor.nav.link.type.integral.exchange' }), // '积分兑换',
    },
    {
      value: 4,
      label: intl.formatMessage({ id: 'editor.nav.link.type.company.about' }), // '公司介绍',
    },
    {
      value: 5,
      label: intl.formatMessage({ id: 'editor.nav.link.type.apply.member' }), // '成为会员',
    },
    {
      value: 12,
      label: intl.formatMessage({ id: 'editor.nav.link.type.webview' }), // '外部链接',
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
   * 修改广告链接
   * @param value
   * @param id
   */
  const handleUrlChange = (value: string, id: number) => {
    console.log(value, 'value')
    const newList = [...list]
    newList.map((item) => {
      if (item.id === id) {
        item.url = `https://${value}`
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

  const judgedItemNotInList = (item, type: number) => {
    if (item.value === type) {
      return true
    }
    return list.every((listItem) => listItem.type !== item.value)
  }

  return (
    <div className={styles.setting}>
      {/* <div className={styles.hideModule}>
        <Checkbox checked={!visible} onChange={handleHideChange}>隐藏整个模块</Checkbox>
      </div> */}
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
                      <span>{intl.formatMessage({ id: 'editor.setting.delete.entrance' })}</span>
                    </label>
                  </div>
                  <div className={styles.setting_line_addItem_line}>
                    <div className={styles.setting_line_addItem_line_label}>
                      {intl.formatMessage({ id: 'common.form.label.name' })}：
                    </div>
                    <div className={styles.setting_line_addItem_line_brief}>
                      <Input
                        value={item.name}
                        maxLength={6}
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
                  {item.type === 12 && (
                    <div className={styles.setting_line_addItem_line}>
                      <div className={styles.setting_line_addItem_line_label}>
                        {intl.formatMessage({ id: 'editor.setting.nav.link' })}：
                      </div>
                      <div className={styles.setting_line_addItem_line_brief}>
                        <Input
                          addonBefore="https://"
                          value={item.url}
                          onChange={(e) => handleUrlChange(e.target.value, item.id)}
                        />
                      </div>
                    </div>
                  )}
                  <div className={styles.setting_line_addItem_line}>
                    <div className={styles.setting_line_addItem_line_label}>
                      {intl.formatMessage({ id: 'common.form.label.icon' })}：
                    </div>
                    <div className={styles.setting_line_addItem_line_brief}>
                      <div className={styles.uploadIconWrap}>
                        <UploadImage onChange={(url) => handleIconChange(url, item.id)} listType="text">
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
      {list.length <= 5 && (
        <Button className={styles.selectBtn} icon={<PlusOutlined />} onClick={handleAddItem}>
          {intl.formatMessage({ id: 'editor.add.module.btn' })}
        </Button>
      )}
    </div>
  )
}

export default QuickNav
