import React, { useState, useEffect } from 'react'
import { Button, Input, message } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { changeProps, produce } from '@apps/design-core'
import { ReactSortable } from 'react-sortablejs'
import { getIntl } from '@linkseeks/i18n'
import { ImageBox } from '@apps/components'
import cx from 'classnames'
import { isEmpty } from 'lodash'
import ModalTable from '@/components/ModalTable'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import SearchSelect from '@/components/NiceForm/components/SearchSelect'
import Search from '@/components/NiceForm/components/Search'
import Submit from '@/components/NiceForm/components/Submit'
import { formProduct } from './contant/schema'
import tableColumn from './contant/column'
import { priceFormat } from '@/utils/numberFomat'
import arrowRightIcon from '@/assets/icons/arrow_right.png'
import arrowLeftIcon from '@/assets/icons/arrow_left.png'
import arrowUpIcon from '@/assets/icons/arrow_up.png'
import arrowDownIcon from '@/assets/icons/arrow_down.png'
import sortIcon from '@/assets/icons/sort_icon.png'

import styles from './index.less'

interface DataItemType {
  id: number
  style: number
  title: string
  viceTitle: string
  productIdList: number[]
  productList?: any[]
  expand: boolean
}

interface QualityPropsType {
  dataList: DataItemType[]
  channelMemberId: number
  visible: boolean
}

const ChannelGoods: React.FC<QualityPropsType> = (props) => {
  const { dataList, channelMemberId, visible } = props
  const [list, setList] = useState<DataItemType[]>([])
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [currentInfo, setCurrentInfo] = useState<DataItemType>()
  const [productRowSelection, productRowCtl] = useRowSelectionTable()
  const intl = getIntl()

  useEffect(() => {
    initDataList()
  }, [dataList])

  const initDataList = async () => {
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

  const handleExpand = async (id: number, expand: boolean) => {
    const newList = produce(list, (oldList) => {
      for (const item of oldList) {
        if (item.id === id) {
          item.expand = expand
        } else {
          item.expand = false
        }
      }
    })
    setList(newList)
    changeProps({
      props: Object.assign({ ...props }, { dataList: newList }),
    })
  }

  const sortUp = (index: number, item: DataItemType) => {
    const newList = produce(list, (oldList) => {
      const temp = oldList[index - 1]
      oldList[index - 1] = item
      oldList[index - 1].id = temp.id
      oldList[index] = temp
      oldList[index].id = item.id
    })
    setList(newList)
    changeProps({
      props: Object.assign({ ...props }, { dataList: newList }),
    })
  }

  const sortDown = (index: number, item: DataItemType) => {
    const newList = produce(list, (oldList) => {
      const temp = oldList[index + 1]
      oldList[index + 1] = item
      oldList[index + 1].id = temp.id
      oldList[index] = temp
      oldList[index].id = item.id
    })
    setList(newList)
    changeProps({
      props: Object.assign({ ...props }, { dataList: newList }),
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
   * 根据key修改内容
   * @param value
   * @param id
   */
  const handleNameChange = (value: string, id: number, key: string) => {
    const newList = produce(list, (oldList) => {
      oldList.map((item) => {
        if (item.id === id) {
          item[key] = value
        }
      })
    })
    setList(newList)
    changeProps({
      props: Object.assign({ ...props }, { dataList: newList }),
    })
  }

  /**
   * 添加栏目
   */
  const handleAddItem = () => {
    const newList = [...list]
    const newItem: DataItemType = {
      id: newList.length + 1,
      style: 0,
      expand: true,
      title: '',
      viceTitle: '',
      productIdList: [],
    }
    handleExpand(newItem.id, true)
    setList([...newList, newItem])
    changeProps({
      props: Object.assign({ ...props }, { dataList: [...newList, newItem] }),
    })
  }

  /**
   * 删除跳转选项
   * @param sort
   */
  const handleDeleteSelectItem = (id: number, delelteId: number) => {
    const newList = produce(list, (oldList) => {
      oldList.map((item) => {
        if (item.id === id) {
          item.productIdList = item.productIdList.filter((recommendId) => recommendId !== delelteId)
          item.productList = item.productList
            ? item.productList.filter((selectInfoItem) => selectInfoItem.id !== delelteId)
            : undefined
        }
      })
    })

    setList(newList)
    changeProps({
      props: Object.assign({ ...props }, { dataList: newList }),
    })
  }

  /**
   * 根据类型显示选择的信息
   * @param type 1-商品详情 2-积分详情 3-店铺主页 4-资讯详情 5-不跳转
   */
  const renderSelectItemByType = (item: DataItemType) => {
    return (
      <div>
        {item.productList &&
          item.productList.map((selectItem, selectIndex) => (
            <div className={styles.setting_line_addItem_line} key={`${selectItem.id}${selectIndex}`}>
              <div className={styles.setting_line_addItem_line_label}></div>
              <div className={styles.setting_line_addItem_line_brief}>
                <div className={styles.selectInfoBox}>
                  <ImageBox width={60} height={60} src={selectItem.mainPic} />
                  <div className={styles.selectInfo}>
                    <div className={styles.selectInfo_name}>{selectItem.name}</div>
                    <div className={styles.selectInfo_price}>
                      {intl.formatMessage({ id: 'common.money' })}
                      {priceFormat(selectItem.min)}
                    </div>
                  </div>
                  <div
                    className={styles.selectInfoBox_delete}
                    onClick={() => handleDeleteSelectItem(item.id, selectItem.id)}
                  >
                    <DeleteOutlined />
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    )
  }

  /**
   * 打开选择模态框
   * @param type
   */
  const handleOpenSelectModal = (item: DataItemType) => {
    setCurrentInfo(item)
    setModalVisible(true)
  }

  const handleModalOk = async () => {
    const selectResult = productRowCtl.selectRow
    if (!selectResult) {
      message.info(intl.formatMessage({ id: 'common.text.pleaseSelect' }))
      return null
    }
    const newList = [...list]
    for (const item of newList) {
      if (item.id === currentInfo?.id) {
        if (item.productIdList) {
          item.productIdList = [...item.productIdList, ...productRowCtl.selectedRowKeys]
        } else {
          item.productIdList = [...productRowCtl.selectedRowKeys]
        }

        if (item.productList) {
          item.productList = [...item.productList, ...selectResult]
        } else {
          item.productList = [...selectResult]
        }
      }
    }
    setList(newList)
    changeProps({
      props: Object.assign({ ...props }, { dataList: newList }),
    })
    setModalVisible(false)
    productRowCtl.setSelectRow([])
    productRowCtl.setSelectedRowKeys([])
  }

  const handleModalCancel = async () => {
    setModalVisible(false)
  }

  /**
   * 获取模态框数据
   * @param param
   */
  const fetchTableList = async (param: any) => {
    return []
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
                  <span>{item.title}</span>
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
                      {intl.formatMessage({ id: 'editor.setting.form.title' })}：
                    </div>
                    <div className={styles.setting_line_addItem_line_brief}>
                      <Input value={item.title} onChange={(e) => handleNameChange(e.target.value, item.id, 'title')} />
                    </div>
                  </div>
                  <div className={styles.setting_line_addItem_line}>
                    <div className={styles.setting_line_addItem_line_label}>
                      {intl.formatMessage({ id: 'editor.setting.form.viceTitle' })}：
                    </div>
                    <div className={styles.setting_line_addItem_line_brief}>
                      <Input
                        value={item.viceTitle}
                        onChange={(e) => handleNameChange(e.target.value, item.id, 'viceTitle')}
                      />
                    </div>
                  </div>
                  <div className={styles.setting_line_addItem_line}>
                    <div className={styles.setting_line_addItem_line_label}>
                      {intl.formatMessage({ id: 'editor.template.channel.product.title' })}：
                    </div>
                    <div className={styles.setting_line_addItem_line_brief}>
                      <Button
                        className={styles.selectBtn}
                        icon={<PlusOutlined />}
                        onClick={() => handleOpenSelectModal(item)}
                      >
                        {intl.formatMessage({ id: 'editor.select.commodity.btn' })}
                      </Button>
                    </div>
                  </div>
                  {item.productList ? renderSelectItemByType(item) : null}
                </div>
              )}
            </div>
          </div>
        ))}
      </ReactSortable>
      <Button disabled={list.length >= 4} className={styles.selectBtn} icon={<PlusOutlined />} onClick={handleAddItem}>
        {intl.formatMessage({ id: 'editor.add.column.btn' })}
      </Button>
      <ModalTable
        modalTitle={intl.formatMessage({ id: 'editor.drawer.commodity.title' })}
        confirm={handleModalOk}
        width={960}
        cancel={handleModalCancel}
        visible={modalVisible}
        scroll={{ y: 400 }}
        columns={tableColumn[1]}
        rowSelection={productRowSelection}
        fetchTableData={(params) => fetchTableList(params)}
        formilyProps={{
          ctx: {
            schema: formProduct,
            components: { ModalSearch: Search, SearchSelect, Submit },
            effects: ($, actions) => {
              actions.reset()
              useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
            },
          },
        }}
        resetModal={{
          destroyOnClose: true,
        }}
        tableProps={{
          rowKey: 'id',
          onRow: (record) => ({
            onClick: () => {
              if (!productRowCtl.selectRow.includes(record)) {
                productRowCtl.setSelectRow([...productRowCtl.selectRow, record])
                productRowCtl.setSelectedRowKeys([...productRowCtl.selectRow.map((item) => item.id), record.id])
              } else {
                productRowCtl.setSelectRow(
                  productRowCtl.selectRow.filter((selectRowItem) => selectRowItem.id !== record.id),
                )
                productRowCtl.setSelectedRowKeys(
                  productRowCtl.selectedRowKeys.filter((selectedRowKeysItem) => selectedRowKeysItem !== record.id),
                )
              }
            },
          }),
        }}
      />
    </div>
  )
}

export default ChannelGoods
