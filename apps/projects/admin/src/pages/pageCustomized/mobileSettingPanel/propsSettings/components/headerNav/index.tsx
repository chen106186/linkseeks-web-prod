import React, { useState, useEffect } from 'react'
import { Button, Input, Radio } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
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
  content: string
  status: boolean
  expand: boolean
}

interface HeaderNavPropsType {
  dataList: DataItemType[]
}

const HeaderNav: React.FC<HeaderNavPropsType> = (props) => {
  const { dataList } = props
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

  const handleSearchContentChange = (e) => {
    const value = e.target.value
    const newList = [...list]
    newList.map((item) => {
      if (item.name === '搜索框') {
        item.content = value
      }
    })
    setList(newList)
    changeProps({
      props: Object.assign({ ...props }, { dataList: newList }),
    })
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

  const handleIconChange = (url: string, name: string) => {
    const newList = [...list]
    newList.map((item) => {
      if (item.name === name) {
        item.content = url
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
              {!!item.expand && (
                <div className={styles.setting_line_addItem}>
                  <div className={styles.setting_line_addItem_line}>
                    <div className={styles.setting_line_addItem_line_label}>名称：</div>
                    <div className={styles.setting_line_addItem_line_brief}>{item.name}</div>
                  </div>
                  {item.name === '搜索框' ? (
                    <div className={styles.setting_line_addItem_line}>
                      <div className={styles.setting_line_addItem_line_label}>提示语：</div>
                      <div className={styles.setting_line_addItem_line_brief}>
                        <Input
                          placeholder="请输入搜索关键词"
                          maxLength={8}
                          value={item.content}
                          onChange={handleSearchContentChange}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className={styles.setting_line_addItem_line}>
                      <div className={styles.setting_line_addItem_line_label}>图标：</div>
                      <div className={styles.setting_line_addItem_line_brief}>
                        <div className={styles.uploadIconWrap}>
                          <UploadImage onChange={(url) => handleIconChange(url, item.name)} listType="text">
                            <div className={cx(styles.uploadIconBtn, styles.small)}>
                              <PlusOutlined className={styles.uploadIconBtnIcon} />
                              <span>上传图标</span>
                            </div>
                          </UploadImage>
                          <label className={styles.uploadIconTip}>最佳尺寸：160*160</label>
                        </div>
                        <div className={styles.previewIconWrap}>
                          {item.content && <img src={item.content} className={styles.previewIcon} alt={item.name} />}
                        </div>
                      </div>
                    </div>
                  )}
                  {(item.name === '我的' || item.name === '客服') && (
                    <div className={styles.setting_line_addItem_line}>
                      <div className={styles.setting_line_addItem_line_label}>是否显示：</div>
                      <div className={styles.setting_line_addItem_line_brief}>
                        <Radio.Group onChange={(e) => handleStatusChange(e, item.name)} value={item.status}>
                          <Radio value={true}>显示</Radio>
                          <Radio value={false}>隐藏</Radio>
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

export default HeaderNav
