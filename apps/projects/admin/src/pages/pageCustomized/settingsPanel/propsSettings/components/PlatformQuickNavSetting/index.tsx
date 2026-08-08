import React, { useState, useEffect } from 'react'
import { Modal, Input, Button } from 'antd'
import { clearSelectedStatus, changeProps, produce } from '@apps/design-core'
import { ReactSortable } from 'react-sortablejs'
import cx from 'classnames'
import { CaretDownOutlined, CaretRightOutlined, PlusOutlined } from '@ant-design/icons'
import { UploadImage } from '@apps/components'
import { isEmpty } from 'lodash'
import upIcon from '@/assets/icons/up_icon.png'
import downIcon from '@/assets/icons/down_icon.png'
import deleteIcon from '@/assets/icons/delete_icon.png'
import sortIcon from '@/assets/icons/sort_icon.png'
import styles from './index.less'
import { filterPropsFunction } from '../../../../utils'
import SettingPanel from '../../../../components/SettingPanel'

interface ItemType {
  id: number
  icon: string
  link: string
  name: string
  sort: number
  expand?: boolean
}

interface PlatformQuickNavSettingProps {
  sellQuickNavList: ItemType[]
  buyQuickNavList: ItemType[]
  quickNavList: ItemType[]
}

const PlatformQuickNavSetting: React.FC<PlatformQuickNavSettingProps> = (props) => {
  const { sellQuickNavList, buyQuickNavList, quickNavList } = props
  const [confirmLoading] = useState<boolean>(false)
  const [sellList, setSellList] = useState<ItemType[]>([])
  const [buyList, setBuyList] = useState<ItemType[]>([])
  const [navList, setNavList] = useState<ItemType[]>([])
  const [newProps, setNewProps] = useState(props)

  const initSellList = () => {
    if (sellQuickNavList) {
      const newDataList = produce(sellQuickNavList, (oldSellQuickNavList) => {
        oldSellQuickNavList.map((item: ItemType, index: number) => {
          item.sort = index + 1
          item.expand = item.expand || false
          return item
        })
      })
      setSellList(newDataList)
    }
  }

  const initBuyList = () => {
    if (buyQuickNavList) {
      const newDataList = produce(buyQuickNavList, (oldList) => {
        oldList.map((item: ItemType, index: number) => {
          item.sort = index + 1
          item.expand = item.expand || false
          return item
        })
      })
      setBuyList(newDataList)
    }
  }

  const initNavList = () => {
    if (quickNavList) {
      const newDataList = produce(quickNavList, (oldList) => {
        oldList.map((item: ItemType, index: number) => {
          item.sort = index + 1
          item.expand = item.expand || false
          return item
        })
      })
      setNavList(newDataList)
    }
  }

  useEffect(() => {
    initSellList()
  }, [sellQuickNavList])

  useEffect(() => {
    initBuyList()
  }, [buyQuickNavList])

  useEffect(() => {
    initNavList()
  }, [quickNavList])

  const handleCancel = () => {
    if (JSON.stringify(props) !== JSON.stringify(newProps)) {
      Modal.confirm({
        content: '您还没有保存修改的内容，是否确认关闭？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          clearSelectedStatus()
        },
      })
    } else {
      clearSelectedStatus()
    }
  }

  const handleConfirmSave = () => {
    changeProps({
      props: newProps,
    })
    clearSelectedStatus()
  }

  const handleListExpand = (sort: number, state: boolean, type: 'sell' | 'buy' | 'nav') => {
    let newList: ItemType[] = []
    switch (type) {
      case 'sell':
        newList = [...sellList]
        newList = produce(newList, (oldList) => {
          oldList.map((item) => {
            if (item.sort === sort) {
              item.expand = state
            } else {
              item.expand = false
            }
          })
        })
        setSellList(newList)
        break
      case 'buy':
        newList = [...buyList]
        newList = produce(newList, (oldList) => {
          oldList.map((item) => {
            if (item.sort === sort) {
              item.expand = state
            } else {
              item.expand = false
            }
          })
        })
        setBuyList(newList)
        break
      case 'nav':
        newList = [...navList]
        newList = produce(newList, (oldList) => {
          oldList.map((item) => {
            if (item.sort === sort) {
              item.expand = state
            } else {
              item.expand = false
            }
          })
        })
        setNavList(newList)
        break
    }
  }

  const changeNewProps = (key: string, data: any) => {
    const newProps = filterPropsFunction(props)
    newProps[key] = data
    setNewProps(newProps)
  }

  const handleKeyChange = (value: string, sort: number, key: string, type: 'sell' | 'buy' | 'nav') => {
    let newList: ItemType[] = []
    switch (type) {
      case 'sell':
        newList = [...sellList]
        newList = produce(newList, (oldList) => {
          oldList.map((item) => {
            if (item.sort === sort) {
              item[key] = value
            }
          })
        })
        setSellList(newList)
        changeNewProps('sellQuickNavList', newList)
        break
      case 'buy':
        newList = [...buyList]
        newList = produce(newList, (oldList) => {
          oldList.map((item) => {
            if (item.sort === sort) {
              item[key] = value
            }
          })
        })
        setBuyList(newList)
        changeNewProps('buyQuickNavList', newList)
        break
      case 'nav':
        newList = [...navList]
        newList = produce(newList, (oldList) => {
          oldList.map((item) => {
            if (item.sort === sort) {
              item[key] = value
            }
          })
        })
        setNavList(newList)
        changeNewProps('quickNavList', newList)
        break
    }
  }

  const handleDeleteItem = (index: number, type: 'sell' | 'buy' | 'nav') => {
    let newList: ItemType[] = []
    let sort = 1
    switch (type) {
      case 'sell':
        newList = [...sellList]
        newList.splice(index, 1)
        newList = produce(newList, (oldList) => {
          oldList.map((item) => {
            item.sort = sort
            sort++
          })
        })
        setSellList(newList)
        changeNewProps('sellQuickNavList', newList)
        break
      case 'buy':
        newList = [...buyList]
        newList.splice(index, 1)
        newList = produce(newList, (oldList) => {
          oldList.map((item) => {
            item.sort = sort
            sort++
          })
        })
        setBuyList(newList)
        changeNewProps('buyQuickNavList', newList)
        break
      case 'nav':
        newList = [...navList]
        newList.splice(index, 1)
        newList = produce(newList, (oldList) => {
          oldList.map((item) => {
            item.sort = sort
            sort++
          })
        })
        setNavList(newList)
        changeNewProps('quickNavList', newList)
        break
    }
  }

  const sortUp = (index: number, item: ItemType, type: 'sell' | 'buy' | 'nav') => {
    let newList: ItemType[] = []
    let temp: ItemType
    const tempItem = { ...item }
    switch (type) {
      case 'sell':
        newList = [...sellList]
        temp = newList[index - 1]
        newList[index - 1] = item
        newList[index - 1].sort = temp.sort
        newList[index] = temp
        newList[index].sort = tempItem.sort
        setSellList(newList)
        changeNewProps('sellQuickNavList', newList)
        break
      case 'buy':
        newList = [...buyList]
        temp = newList[index - 1]
        newList[index - 1] = item
        newList[index - 1].sort = temp.sort
        newList[index] = temp
        newList[index].sort = tempItem.sort
        setBuyList(newList)
        changeNewProps('buyQuickNavList', newList)
        break
      case 'nav':
        newList = [...navList]
        temp = newList[index - 1]
        newList[index - 1] = item
        newList[index - 1].sort = temp.sort
        newList[index] = temp
        newList[index].sort = tempItem.sort
        setNavList(newList)
        changeNewProps('quickNavList', newList)
        break
      default:
        break
    }
  }

  const sortDown = (index: number, item: ItemType, type: 'sell' | 'buy' | 'nav') => {
    let newList: ItemType[] = []
    let temp: ItemType
    const tempItem = { ...item }
    switch (type) {
      case 'sell':
        newList = [...sellList]
        temp = newList[index + 1]
        newList[index + 1] = item
        newList[index + 1].sort = temp.sort
        newList[index] = temp
        newList[index].sort = tempItem.sort
        setSellList(newList)
        changeNewProps('sellQuickNavList', newList)
        break
      case 'buy':
        newList = [...buyList]
        temp = newList[index + 1]
        newList[index + 1] = item
        newList[index + 1].sort = temp.sort
        newList[index] = temp
        newList[index].sort = tempItem.sort
        setBuyList(newList)
        changeNewProps('buyQuickNavList', newList)
        break
      case 'nav':
        newList = [...navList]
        temp = newList[index + 1]
        newList[index + 1] = item
        newList[index + 1].sort = temp.sort
        newList[index] = temp
        newList[index].sort = tempItem.sort
        setNavList(newList)
        changeNewProps('quickNavList', newList)
        break
      default:
        break
    }
  }

  const addItem = (type: 'sell' | 'buy' | 'nav') => {
    let newList: ItemType[] = []
    let sort = 0
    let tempItem: ItemType
    switch (type) {
      case 'sell':
        newList = [...sellList]
        if (newList.length <= 0) {
          sort = 1
        } else {
          sort = newList[newList.length - 1].sort + 1
        }
        tempItem = {
          id: 0,
          name: '',
          icon: '',
          link: '',
          sort,
          expand: true,
        }
        newList.push(tempItem)
        setSellList(newList)
        changeNewProps('sellQuickNavList', newList)
        break
      case 'buy':
        newList = [...buyList]
        if (newList.length <= 0) {
          sort = 1
        } else {
          sort = newList[newList.length - 1].sort + 1
        }
        tempItem = {
          id: 0,
          name: '',
          icon: '',
          link: '',
          sort,
          expand: true,
        }
        newList.push(tempItem)
        setBuyList(newList)
        changeNewProps('buyQuickNavList', newList)
        break
      case 'nav':
        newList = [...navList]
        if (newList.length <= 0) {
          sort = 1
        } else {
          sort = newList[newList.length - 1].sort + 1
        }
        tempItem = {
          id: 0,
          name: '',
          icon: '',
          link: '',
          sort,
          expand: true,
        }
        newList.push(tempItem)
        setNavList(newList)
        changeNewProps('quickNavList', newList)
        break
      default:
        break
    }
  }

  return (
    <SettingPanel confirmLoading={confirmLoading} onCancel={handleCancel} onOK={handleConfirmSave}>
      <div className={styles.setting_wrap}>
        <div className={styles.setting_title}>
          <span>卖家服务</span>
        </div>
        <ReactSortable
          className={styles.sort_list}
          list={sellList}
          setList={(newList) => {
            setSellList(newList)
            if (!isEmpty(newList)) {
              changeProps({
                props: Object.assign({ ...props }, { sellQuickNavList: newList }),
              })
            }
          }}
          handle=".draghandle"
        >
          {sellList &&
            sellList.map((item, index) => (
              <div className={styles.setting_line} key={`setting_line_${index}`}>
                <div className={styles.setting_line_sort}>{item.sort}</div>
                <div className={styles.setting_line_main}>
                  <div
                    className={styles.setting_line_name}
                    onClick={() => handleListExpand(item.sort, !item.expand, 'sell')}
                  >
                    {item.expand ? (
                      <CaretDownOutlined className={styles.icon} />
                    ) : (
                      <CaretRightOutlined className={styles.icon} />
                    )}
                    <span>{item.name}</span>
                  </div>
                  {!!item.expand && (
                    <div className={styles.setting_line_addItem}>
                      <div className={styles.setting_line_addItem_line}>
                        <div className={styles.setting_line_addItem_line_label}>名称</div>
                        <div className={styles.setting_line_addItem_line_brief}>
                          <Input
                            className={styles.setting_line_addItem_input}
                            value={item.name}
                            onChange={(e) => handleKeyChange(e.target.value, item.sort, 'name', 'sell')}
                            maxLength={15}
                          />
                        </div>
                      </div>
                      <div className={styles.setting_line_addItem_line}>
                        <div className={styles.setting_line_addItem_line_label}>图片</div>
                        <div className={styles.setting_line_addItem_line_brief}>
                          <UploadImage
                            imgUrl={item.icon}
                            size="32*32"
                            fileMaxSize={20}
                            onChange={(val) => handleKeyChange(val, item.sort, 'icon', 'sell')}
                          />
                        </div>
                      </div>
                      <div className={styles.setting_line_addItem_line}>
                        <div className={styles.setting_line_addItem_line_label}>链接</div>
                        <div className={styles.setting_line_addItem_line_brief}>
                          <Input
                            className={styles.setting_line_addItem_input}
                            value={item.link}
                            onChange={(e) => handleKeyChange(e.target.value, item.sort, 'link', 'sell')}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className={styles.setting_line_operation}>
                  <Button
                    type="link"
                    onClick={() => handleDeleteItem(index, 'sell')}
                    className={styles.setting_line_operation_btn}
                    icon={<img className={styles.setting_line_operation_btn_icon} src={deleteIcon} />}
                  ></Button>
                  <Button
                    type="link"
                    disabled={index === 0}
                    onClick={() => sortUp(index, item, 'sell')}
                    className={styles.setting_line_operation_btn}
                    icon={<img className={styles.setting_line_operation_btn_icon} src={upIcon} />}
                  ></Button>
                  <Button
                    type="link"
                    disabled={index === sellList.length - 1}
                    onClick={() => sortDown(index, item, 'sell')}
                    className={styles.setting_line_operation_btn}
                    icon={<img className={styles.setting_line_operation_btn_icon} src={downIcon} />}
                  ></Button>
                  <Button
                    type="link"
                    className={cx(styles.advert_setting_line_operation_btn, 'draghandle')}
                    icon={<img className={styles.setting_line_operation_btn_icon} src={sortIcon} />}
                  ></Button>
                </div>
              </div>
            ))}
        </ReactSortable>
        {sellList.length < 3 && (
          <Button onClick={() => addItem('sell')} className={styles.add_btn} icon={<PlusOutlined />}>
            添加
          </Button>
        )}
        <div className={cx(styles.setting_title)}>
          <span>买家服务</span>
        </div>
        <ReactSortable
          className={styles.sort_list}
          list={buyList}
          setList={(newList) => {
            setBuyList(newList)
            if (!isEmpty(newList)) {
              changeProps({
                props: Object.assign({ ...props }, { buyQuickNavList: newList }),
              })
            }
          }}
          handle=".draghandle"
        >
          {buyList &&
            buyList.map((item, index) => (
              <div className={styles.setting_line} key={`setting_line_${index}`}>
                <div className={styles.setting_line_sort}>{item.sort}</div>
                <div className={styles.setting_line_main}>
                  <div
                    className={styles.setting_line_name}
                    onClick={() => handleListExpand(item.sort, !item.expand, 'buy')}
                  >
                    {item.expand ? (
                      <CaretDownOutlined className={styles.icon} />
                    ) : (
                      <CaretRightOutlined className={styles.icon} />
                    )}
                    <span>{item.name}</span>
                  </div>
                  {!!item.expand && (
                    <div className={styles.setting_line_addItem}>
                      <div className={styles.setting_line_addItem_line}>
                        <div className={styles.setting_line_addItem_line_label}>名称</div>
                        <div className={styles.setting_line_addItem_line_brief}>
                          <Input
                            className={styles.setting_line_addItem_input}
                            value={item.name}
                            onChange={(e) => handleKeyChange(e.target.value, item.sort, 'name', 'buy')}
                            maxLength={15}
                          />
                        </div>
                      </div>
                      <div className={styles.setting_line_addItem_line}>
                        <div className={styles.setting_line_addItem_line_label}>图片</div>
                        <div className={styles.setting_line_addItem_line_brief}>
                          <UploadImage
                            imgUrl={item.icon}
                            size="32*32"
                            fileMaxSize={20}
                            onChange={(val) => handleKeyChange(val, item.sort, 'icon', 'buy')}
                          />
                        </div>
                      </div>
                      <div className={styles.setting_line_addItem_line}>
                        <div className={styles.setting_line_addItem_line_label}>链接</div>
                        <div className={styles.setting_line_addItem_line_brief}>
                          <Input
                            className={styles.setting_line_addItem_input}
                            value={item.link}
                            onChange={(e) => handleKeyChange(e.target.value, item.sort, 'link', 'buy')}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className={styles.setting_line_operation}>
                  <Button
                    type="link"
                    onClick={() => handleDeleteItem(index, 'buy')}
                    className={styles.setting_line_operation_btn}
                    icon={<img className={styles.setting_line_operation_btn_icon} src={deleteIcon} />}
                  ></Button>
                  <Button
                    type="link"
                    disabled={index === 0}
                    onClick={() => sortUp(index, item, 'buy')}
                    className={styles.setting_line_operation_btn}
                    icon={<img className={styles.setting_line_operation_btn_icon} src={upIcon} />}
                  ></Button>
                  <Button
                    type="link"
                    disabled={index === sellList.length - 1}
                    onClick={() => sortDown(index, item, 'buy')}
                    className={styles.setting_line_operation_btn}
                    icon={<img className={styles.setting_line_operation_btn_icon} src={downIcon} />}
                  ></Button>
                  <Button
                    type="link"
                    className={cx(styles.advert_setting_line_operation_btn, 'draghandle')}
                    icon={<img className={styles.setting_line_operation_btn_icon} src={sortIcon} />}
                  ></Button>
                </div>
              </div>
            ))}
        </ReactSortable>
        {sellList.length < 3 && (
          <Button onClick={() => addItem('buy')} className={styles.add_btn} icon={<PlusOutlined />}>
            添加
          </Button>
        )}
        <div className={styles.setting_title}>
          <span>快捷功能</span>
        </div>
        <ReactSortable
          className={styles.sort_list}
          list={navList}
          setList={(newList) => {
            setBuyList(newList)
            if (!isEmpty(newList)) {
              changeProps({
                props: Object.assign({ ...props }, { quickNavList: newList }),
              })
            }
          }}
          handle=".draghandle"
        >
          {navList &&
            navList.map((item, index) => (
              <div className={styles.setting_line} key={`setting_line_${index}`}>
                <div className={styles.setting_line_sort}>{item.sort}</div>
                <div className={styles.setting_line_main}>
                  <div
                    className={styles.setting_line_name}
                    onClick={() => handleListExpand(item.sort, !item.expand, 'nav')}
                  >
                    {item.expand ? (
                      <CaretDownOutlined className={styles.icon} />
                    ) : (
                      <CaretRightOutlined className={styles.icon} />
                    )}
                    <span>{item.name}</span>
                  </div>
                  {!!item.expand && (
                    <div className={styles.setting_line_addItem}>
                      <div className={styles.setting_line_addItem_line}>
                        <div className={styles.setting_line_addItem_line_label}>名称</div>
                        <div className={styles.setting_line_addItem_line_brief}>
                          <Input
                            className={styles.setting_line_addItem_input}
                            value={item.name}
                            onChange={(e) => handleKeyChange(e.target.value, item.sort, 'name', 'nav')}
                            maxLength={15}
                          />
                        </div>
                      </div>
                      <div className={styles.setting_line_addItem_line}>
                        <div className={styles.setting_line_addItem_line_label}>图片</div>
                        <div className={styles.setting_line_addItem_line_brief}>
                          <UploadImage
                            imgUrl={item.icon}
                            size="32*32"
                            fileMaxSize={20}
                            onChange={(val) => handleKeyChange(val, item.sort, 'icon', 'nav')}
                          />
                        </div>
                      </div>
                      <div className={styles.setting_line_addItem_line}>
                        <div className={styles.setting_line_addItem_line_label}>链接</div>
                        <div className={styles.setting_line_addItem_line_brief}>
                          <Input
                            className={styles.setting_line_addItem_input}
                            value={item.link}
                            onChange={(e) => handleKeyChange(e.target.value, item.sort, 'link', 'nav')}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className={styles.setting_line_operation}>
                  <Button
                    type="link"
                    onClick={() => handleDeleteItem(index, 'nav')}
                    className={styles.setting_line_operation_btn}
                    icon={<img className={styles.setting_line_operation_btn_icon} src={deleteIcon} />}
                  ></Button>
                  <Button
                    type="link"
                    disabled={index === 0}
                    onClick={() => sortUp(index, item, 'nav')}
                    className={styles.setting_line_operation_btn}
                    icon={<img className={styles.setting_line_operation_btn_icon} src={upIcon} />}
                  ></Button>
                  <Button
                    type="link"
                    disabled={index === sellList.length - 1}
                    onClick={() => sortDown(index, item, 'nav')}
                    className={styles.setting_line_operation_btn}
                    icon={<img className={styles.setting_line_operation_btn_icon} src={downIcon} />}
                  ></Button>
                  <Button
                    type="link"
                    className={cx(styles.advert_setting_line_operation_btn, 'draghandle')}
                    icon={<img className={styles.setting_line_operation_btn_icon} src={sortIcon} />}
                  ></Button>
                </div>
              </div>
            ))}
        </ReactSortable>
        {navList.length < 6 && (
          <Button onClick={() => addItem('nav')} className={styles.add_btn} icon={<PlusOutlined />}>
            添加
          </Button>
        )}
      </div>
    </SettingPanel>
  )
}

export default PlatformQuickNavSetting
