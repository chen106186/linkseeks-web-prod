import React, { useState, useEffect, useRef } from 'react'
import { Button, Input, Select, Checkbox, message } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { changeProps } from '@apps/design-core'
import { ReactSortable } from 'react-sortablejs'
import { ImageBox, ModalFormTable, ModalFormTableRef } from '@apps/components'
import cx from 'classnames'
import { isEmpty, cloneDeep } from 'lodash'
import {
  postProductMobileShopEnterpriseGetCommodityList,
  postProductMobileShopEnterpriseGetBrandList,
  postProductMobileShopEnterpriseGetCategoryBrand,
} from '@apps/apis'
import { getCommodityWebStoreWebPageByIdIn, getCommodityWebStoreWebPageByIdNotIn } from '@apps/apis'
import { getManageContentInformationPageByIdIn, getManageContentInformationPageByIdNotIn } from '@apps/apis'
import { priceFormat } from '@/utils/numberFomat'
import arrowRightIcon from '@/assets/icons/arrow_right.png'
import arrowLeftIcon from '@/assets/icons/arrow_left.png'
import arrowUpIcon from '@/assets/icons/arrow_up.png'
import arrowDownIcon from '@/assets/icons/arrow_down.png'
import sortIcon from '@/assets/icons/sort_icon.png'
import tableColumn from './contant/column'
import useSelectOptions from './services/hooks/useSelectOptions'
import styles from './index.less'

interface DataItemType {
  id: number
  name: string
  markerWord: string
  /** 类型：1-商品 2-店铺 3-品牌 4-资讯 */
  type: number
  recommend: number[]
  recommendList?: any[]
  expand: boolean
}

interface QualityPropsType {
  dataList: DataItemType[]
  visible: boolean
}

const modalWidthMap = {
  1: 960,
  2: 600,
  3: 600,
  4: 600,
}

const RedirectTypeList = [
  {
    value: 1,
    label: '商品',
  },
  {
    value: 2,
    label: '店铺',
  },
  {
    value: 3,
    label: '品牌',
  },
  {
    value: 4,
    label: '资讯',
  },
]

const Quality: React.FC<QualityPropsType> = (props) => {
  const { dataList, visible } = props
  const [list, setList] = useState<DataItemType[]>([])
  const [currentInfo, setCurrentInfo] = useState<DataItemType>()
  const modalRef = ModalFormTable.useTableRef()
  const selectData = useSelectOptions()

  const headers = {
    environment: '4',
  }

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

  const handleExpand = async (id: number, expand: boolean) => {
    const newList = [...list]
    for (const item of newList) {
      if (item.id === id) {
        item.expand = expand
        // 获取当前选择链接的信息
        if (!isEmpty(item.recommend) && !item.recommendList) {
          item.recommendList = await getSelectInfo(item)
        }
      } else {
        item.expand = false
      }
    }
    setList(newList)
  }

  /**
   * 根据选中的类型和id获取信息
   * @param data
   */
  const getSelectInfo = (data: DataItemType): Promise<any[] | undefined> => {
    return new Promise((resolve) => {
      let getFn: any = null
      const param: any = {
        current: 1,
        pageSize: 100,
      }
      switch (data.type) {
        case 1:
          param.idInList = data.recommend
          getFn = postProductMobileShopEnterpriseGetCommodityList
          break
        case 2:
          param.idList = data.recommend
          getFn = getCommodityWebStoreWebPageByIdIn
          break
        case 3:
          param.idInList = data.recommend
          getFn = postProductMobileShopEnterpriseGetBrandList
          break
        case 4:
          param.idList = data.recommend
          getFn = getManageContentInformationPageByIdIn
          break
        default:
          break
      }
      getFn
        ? getFn(param, { headers })
            .then((res) => {
              message.destroy()
              resolve(res.data.data)
            })
            .catch(() => {
              resolve(undefined)
            })
        : resolve(undefined)
    })
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
        item.recommendList = undefined
      }
    })
    setList(newList)
    changeProps({
      props: Object.assign({ ...props }, { dataList: newList }),
    })
  }

  /**
   * 修改广告名称
   * @param value
   * @param id
   */
  const handleNameChange = (value: string, id: number, key: string) => {
    const newList = [...list]
    newList.map((item) => {
      if (item.id === id) {
        item[key] = value
      }
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
      expand: true,
      markerWord: '',
      recommend: [],
      type: 0,
      name: '',
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
    const newList = [...list]
    newList.map((item) => {
      if (item.id === id) {
        item.recommend = item.recommend.filter((recommendId) => recommendId !== delelteId)
        item.recommendList = item.recommendList
          ? item.recommendList.filter((selectInfoItem) => selectInfoItem.id !== delelteId)
          : undefined
      }
    })
    setList(newList)
    changeProps({
      props: Object.assign({ ...props }, { dataList: newList }),
    })
  }

  /**
   * 删除品牌
   * @param sort
   */
  const handleDeleteSelectBrandItem = async (id: number, delelteId: number) => {
    const newList = [...list]
    for (const item of newList) {
      if (item.id === id) {
        item.recommend = item.recommend.filter((recommendId) => recommendId !== delelteId)
        const param = {
          idList: item.recommend,
        }
        const result = await postProductMobileShopEnterpriseGetCategoryBrand(param, { headers })
        message.destroy()
        item.recommendList = result.data
      }
    }

    setList(newList)
    changeProps({
      props: Object.assign({ ...props }, { dataList: newList }),
    })
  }

  const changeBrandData = (list: any[] | undefined) => {
    if (list) {
      const newList: any[] = []
      list.forEach((item) => {
        if (item.brandResponseList) {
          if (item.brandResponseList && item.brandResponseList.length > 0) {
            item.brandResponseList.forEach((childItem) => {
              if (newList.every((newItem) => newItem.id !== childItem.id)) {
                newList.push(childItem)
              }
            })
          }
        }
      })
      return newList
    }
    return []
  }

  /**
   * 根据类型显示选择的信息
   * @param type 1-商品详情 2-积分详情 3-店铺主页 4-资讯详情 5-不跳转
   */
  const renderSelectItemByType = (type: number, item: DataItemType) => {
    switch (type) {
      case 1:
        return (
          <div>
            {item.recommendList &&
              item.recommendList.map((selectItem) => (
                <div className={styles.setting_line_addItem_line} key={selectItem.id}>
                  <div className={styles.setting_line_addItem_line_label}></div>
                  <div className={styles.setting_line_addItem_line_brief}>
                    <div className={styles.selectInfoBox}>
                      <ImageBox width={60} height={60} src={selectItem.mainPic} />
                      <div className={styles.selectInfo}>
                        <div className={styles.selectInfo_name}>{selectItem.name}</div>
                        <div className={styles.selectInfo_price}>￥{priceFormat(selectItem.min)}</div>
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
      case 2:
        return (
          <div>
            {item.recommendList &&
              item.recommendList.map((selectItem) => (
                <div className={styles.setting_line_addItem_line} key={selectItem.id}>
                  <div className={styles.setting_line_addItem_line_label}></div>
                  <div className={styles.setting_line_addItem_line_brief}>
                    <div className={styles.selectInfoBox}>
                      <ImageBox width={60} height={60} src={selectItem.logo} />
                      <div className={cx(styles.selectInfo, styles.shop)}>
                        <div className={styles.selectInfo_name}>{selectItem.memberName}</div>
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
      case 3:
        // eslint-disable-next-line no-case-declarations
        const brandList = changeBrandData(item.recommendList)

        return (
          <div>
            {brandList &&
              brandList.map((selectItem) => (
                <div className={styles.setting_line_addItem_line} key={selectItem.id}>
                  <div className={styles.setting_line_addItem_line_label}></div>
                  <div className={styles.setting_line_addItem_line_brief}>
                    <div className={styles.selectInfoBox}>
                      <ImageBox width={60} height={60} src={selectItem.logoUrl} />
                      <div className={cx(styles.selectInfo, styles.shop)}>
                        <div className={styles.selectInfo_name}>{selectItem.name}</div>
                      </div>
                      <div
                        className={styles.selectInfoBox_delete}
                        onClick={() => handleDeleteSelectBrandItem(item.id, selectItem.id)}
                      >
                        <DeleteOutlined />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )
      case 4:
        return (
          <div>
            {item.recommendList &&
              item.recommendList.map((selectItem) => (
                <div className={styles.setting_line_addItem_line} key={selectItem.id}>
                  <div className={styles.setting_line_addItem_line_label}></div>
                  <div className={styles.setting_line_addItem_line_brief}>
                    <div className={styles.selectInfoBox}>
                      <ImageBox width={60} height={60} src={selectItem.imageUrl} />
                      <div className={cx(styles.selectInfo, styles.shop)}>
                        <div className={styles.selectInfo_name}>{selectItem.title}</div>
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
      default:
        return null
    }
  }

  /**
   * 根据类型查询导航栏链接名称
   * @param type
   */
  const findNameByType = (type: number) => {
    switch (type) {
      case 1:
        return '商品'
      case 2:
        return '店铺'
      case 3:
        return '品牌'
      case 4:
        return '资讯'
      default:
        return ''
    }
  }

  /**
   * 打开选择模态框
   * @param type
   */
  const handleOpenSelectModal = (item: DataItemType) => {
    setCurrentInfo(item)
    modalRef.current.setVisible(true)
  }

  const handleModalOk = async () => {
    const selectResult = modalRef.current.getSelectionItems()
    if (!selectResult) {
      message.info('请选择')
      return null
    }
    const newList = [...list]
    for (const item of newList) {
      if (item.id === currentInfo?.id) {
        item.recommend = [...item.recommend, ...modalRef.current.selectionKeys]
        // 是品牌的情况下
        if (item.type === 3) {
          const param = {
            idList: item.recommend,
          }
          const result = await postProductMobileShopEnterpriseGetCategoryBrand(param, { headers })
          message.destroy()
          item.recommendList = result.data
        } else {
          if (item.recommendList) {
            item.recommendList = [...item.recommendList, ...selectResult]
          } else {
            item.recommendList = [...selectResult]
          }
        }
      }
    }
    setList(newList)
    changeProps({
      props: Object.assign({ ...props }, { dataList: newList }),
    })
    modalRef.current.setVisible(false)
    modalRef.current.setSelectionKeys([])
  }

  /**
   * 获取模态框数据
   * @param param
   */
  const fetchTableList = async (param: any) => {
    const params: any = {
      ...param,
    }
    let getFn: any = null
    switch (currentInfo?.type) {
      case 1:
        params.priceTypeList = [1]
        params.idNotInList = currentInfo.recommend
        getFn = postProductMobileShopEnterpriseGetCommodityList
        break
      case 2:
        params.idList = currentInfo.recommend
        getFn = getCommodityWebStoreWebPageByIdNotIn
        break
      case 3:
        params.idNotInList = currentInfo.recommend
        getFn = postProductMobileShopEnterpriseGetBrandList
        break
      case 4:
        params.idList = currentInfo.recommend
        getFn = getManageContentInformationPageByIdNotIn
        break
      default:
        break
    }

    const res = getFn
      ? await getFn(params, { ctlType: 'none', headers })
      : await new Promise((resolve) => resolve({ data: [], totolCount: 0 }))
    return res.data
  }

  /**
   * 根据类型显示文案
   * @param type
   */
  const showTextByType = (type: number) => {
    switch (type) {
      case 1:
        return '商品'
      case 2:
        return '店铺'
      case 3:
        return '品牌'
      case 4:
        return '资讯'
      default:
        return ''
    }
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
                      <Input value={item.name} onChange={(e) => handleNameChange(e.target.value, item.id, 'name')} />
                    </div>
                  </div>
                  <div className={styles.setting_line_addItem_line}>
                    <div className={styles.setting_line_addItem_line_label}>提示语：</div>
                    <div className={styles.setting_line_addItem_line_brief}>
                      <Input
                        value={item.markerWord}
                        onChange={(e) => handleNameChange(e.target.value, item.id, 'markerWord')}
                      />
                    </div>
                  </div>
                  <div className={styles.setting_line_addItem_line}>
                    <div className={styles.setting_line_addItem_line_label}>类型：</div>
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
                  <div className={styles.setting_line_addItem_line}>
                    <div className={styles.setting_line_addItem_line_label}>推荐{findNameByType(item.type)}：</div>
                    <div className={styles.setting_line_addItem_line_brief}>
                      <Button
                        className={styles.selectBtn}
                        icon={<PlusOutlined />}
                        onClick={() => handleOpenSelectModal(item)}
                      >
                        选择{findNameByType(item.type)}
                      </Button>
                    </div>
                  </div>
                  {item.recommendList ? renderSelectItemByType(item.type, item) : null}
                </div>
              )}
            </div>
          </div>
        ))}
      </ReactSortable>
      <Button disabled={list.length >= 4} className={styles.selectBtn} icon={<PlusOutlined />} onClick={handleAddItem}>
        添加橱窗位
      </Button>
      <ModalFormTable
        modalTitle={`选择${showTextByType(currentInfo?.type || 1)}`}
        width={modalWidthMap[currentInfo?.type || 1]}
        actionRef={modalRef}
        request={fetchTableList}
        columns={tableColumn[currentInfo?.type || 1]}
        isRowSelection
        rowSelectionType="checkbox"
        rowKey="id"
        pagination={false}
        onOk={handleModalOk}
        searchSelectMaps={selectData}
        modalProps={{
          destroyOnClose: true,
        }}
      />
    </div>
  )
}

export default Quality
