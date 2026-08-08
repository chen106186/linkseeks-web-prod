import React, { useState, useEffect, useRef } from 'react'
import { Button, Input, Select, Checkbox, message } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { changeProps } from '@apps/design-core'
import { ReactSortable } from 'react-sortablejs'
import { ImageBox } from '@apps/components'
import cx from 'classnames'
import { isEmpty, cloneDeep } from 'lodash'
import { UploadImage, ModalFormTable, ModalFormTableRef } from '@apps/components'
import {
  getProductMobileShopStoreGetCommodityDetail,
  postProductMobileShopEnterpriseGetCommodityList,
  postProductMobileShopScoreGetCommodityList,
} from '@apps/apis'
import { getCommodityMobileStoreMobileFindById } from '@apps/apis'
import { getCommodityWebStoreWebPageByIdNotIn } from '@apps/apis'
import { getManageContentInformationGet } from '@apps/apis'
import { getManageContentInformationPageByIdNotIn } from '@apps/apis'
import { numFormat, priceFormat } from '@/utils/numberFomat'
import arrowRightIcon from '@/assets/icons/arrow_right.png'
import arrowLeftIcon from '@/assets/icons/arrow_left.png'
import arrowUpIcon from '@/assets/icons/arrow_up.png'
import arrowDownIcon from '@/assets/icons/arrow_down.png'
import sortIcon from '@/assets/icons/sort_icon.png'
import tableColumn from './contant/column'
import useSelectOptions from './services/hooks/useSelectOptions'
import styles from './index.less'

interface DataItemType {
  sort: number
  id: number
  name: string
  img: string
  type: number
  expand: boolean
  selectInfo?: any
}

interface BannerPropsType {
  dataList: DataItemType[]
  visible: boolean
}

const RedirectTypeList = [
  {
    value: 1,
    label: '商品详情',
  },
  {
    value: 2,
    label: '积分详情',
  },
  {
    value: 3,
    label: '店铺主页',
  },
  {
    value: 4,
    label: '资讯详情',
  },
  {
    value: 5,
    label: '不跳转',
  },
]

const modalWidthMap = {
  1: 960,
  2: 960,
  3: 600,
  4: 600,
}

const Banner: React.FC<BannerPropsType> = (props) => {
  const { dataList, visible } = props
  const [list, setList] = useState<DataItemType[]>([])
  const [currentInfo, setCurrentInfo] = useState<DataItemType>()
  const modalRef = ModalFormTable.useTableRef()
  const selectData = useSelectOptions()

  const headers = {
    environment: 4,
  }

  const initDataList = () => {
    if (dataList) {
      const newDataList = cloneDeep(dataList).map((item: DataItemType, index: number) => {
        item.sort = index + 1
        item.expand = item.expand || false
        return item
      })
      setList(newDataList)
    }
  }

  useEffect(() => {
    initDataList()
  }, [dataList])

  const handleExpand = async (sort: number, expand: boolean) => {
    const newList = [...list]
    for (const item of newList) {
      if (item.sort === sort) {
        item.expand = expand
        // 获取当前选择链接的信息
        if (item.id && !item.selectInfo) {
          item.selectInfo = await getSelectInfo(item)
          console.log(item.selectInfo, 'item.selectInfo')
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
  const getSelectInfo = (data: DataItemType) => {
    return new Promise((resolve) => {
      let getFn: any = null
      const param: any = {}

      switch (data.type) {
        case 1:
        case 2:
          param.commodityId = data.id
          getFn = getProductMobileShopStoreGetCommodityDetail
          break
        case 3:
          param.id = data.id
          getFn = getCommodityMobileStoreMobileFindById
          break
        case 4:
          param.id = data.id
          getFn = getManageContentInformationGet
          break
        default:
          break
      }
      if (getFn) {
        getFn(param, { headers }).then((res) => {
          resolve(res.data)
        })
      } else {
        resolve({})
      }
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

  const handleIconChange = (url: string, sort: number) => {
    const newList = [...list]
    newList.map((item) => {
      if (item.sort === sort) {
        item.img = url
      }
    })
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
  const handleClickItem = (sort: number) => {
    const newList = [...list]
    const result = newList.filter((item) => item.sort !== sort)
    setList(result)
    changeProps({
      props: Object.assign({ ...props }, { dataList: result }),
    })
  }

  /**
   * 修改跳转类型
   */
  const handleTypeChange = (type: number, sort: number) => {
    const newList = [...list]
    newList.map((item) => {
      if (item.sort === sort) {
        item.type = type
        item.selectInfo = null
      }
    })
    setList(newList)
    changeProps({
      props: Object.assign({ ...props }, { dataList: newList }),
    })
  }

  /**
   * 修改名称
   * @param value
   * @param id
   */
  const handleNameChange = (value: string, sort: number) => {
    const newList = [...list]
    newList.map((item) => {
      if (item.sort === sort) {
        item.name = value
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
      sort: newList.length + 1,
      id: 0,
      expand: true,
      img: '',
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
  const handleDeleteSelectItem = (sort: number) => {
    const newList = [...list]
    newList.map((item) => {
      if (item.sort === sort) {
        ;(item.id = 0), (item.selectInfo = null)
      }
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
  const renderSelectItemByType = (type: number, item: DataItemType) => {
    switch (type) {
      case 1:
        return (
          <div className={styles.setting_line_addItem_line}>
            <div className={styles.setting_line_addItem_line_label}></div>
            <div className={styles.setting_line_addItem_line_brief}>
              <div className={styles.selectInfoBox}>
                <ImageBox width={60} height={60} src={item.selectInfo.mainPic} />
                <div className={styles.selectInfo}>
                  <div className={styles.selectInfo_name}>{item.selectInfo.name}</div>
                  <div className={styles.selectInfo_price}>￥{priceFormat(item.selectInfo.min)}</div>
                </div>
                <div className={styles.selectInfoBox_delete} onClick={() => handleDeleteSelectItem(item.sort)}>
                  <DeleteOutlined />
                </div>
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div className={styles.setting_line_addItem_line}>
            <div className={styles.setting_line_addItem_line_label}></div>
            <div className={styles.setting_line_addItem_line_brief}>
              <div className={styles.selectInfoBox}>
                <ImageBox width={60} height={60} src={item.selectInfo.mainPic} />
                <div className={cx(styles.selectInfo, styles.integral)}>
                  <div className={styles.selectInfo_name}>{item.selectInfo.name}</div>
                  <div className={styles.selectInfo_price}>{numFormat(item.selectInfo.min)} 积分</div>
                </div>
                <div className={styles.selectInfoBox_delete} onClick={() => handleDeleteSelectItem(item.sort)}>
                  <DeleteOutlined />
                </div>
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div className={styles.setting_line_addItem_line}>
            <div className={styles.setting_line_addItem_line_label}></div>
            <div className={styles.setting_line_addItem_line_brief}>
              <div className={styles.selectInfoBox}>
                <ImageBox width={60} height={60} src={item.selectInfo.logo} />
                <div className={cx(styles.selectInfo, styles.shop)}>
                  <div className={styles.selectInfo_name}>{item.selectInfo.memberName}</div>
                </div>
                <div className={styles.selectInfoBox_delete} onClick={() => handleDeleteSelectItem(item.sort)}>
                  <DeleteOutlined />
                </div>
              </div>
            </div>
          </div>
        )
      case 4:
        return (
          <div className={styles.setting_line_addItem_line}>
            <div className={styles.setting_line_addItem_line_label}></div>
            <div className={styles.setting_line_addItem_line_brief}>
              <div className={styles.selectInfoBox}>
                <ImageBox width={60} height={60} src={item.selectInfo.imageUrl} />
                <div className={cx(styles.selectInfo, styles.information)}>
                  <div className={styles.selectInfo_name}>{item.selectInfo.title}</div>
                </div>
                <div className={styles.selectInfoBox_delete} onClick={() => handleDeleteSelectItem(item.sort)}>
                  <DeleteOutlined />
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  /**
   * 打开选择模态框
   * @param sort
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
    newList.map((item) => {
      if (item.sort === currentInfo?.sort) {
        item.id = selectResult.id
        item.selectInfo = selectResult
      }
    })
    setList(newList)
    changeProps({
      props: Object.assign({ ...props }, { dataList: newList }),
    })
    modalRef.current.setVisible(false)
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
        params.idNotInList = [currentInfo.id]
        getFn = postProductMobileShopEnterpriseGetCommodityList
        break
      case 2:
        params.priceTypeList = [3]
        params.idNotInList = [currentInfo.id]
        getFn = postProductMobileShopScoreGetCommodityList
        break
      case 3:
        params.idList = [currentInfo.id]
        getFn = getCommodityWebStoreWebPageByIdNotIn
        break
      case 4:
        params.idList = [currentInfo.id]
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
        return '商品'
      case 3:
        return '店铺'
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
                <div style={{ flex: 1 }} onClick={() => handleExpand(item.sort, !item.expand)}>
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
                    <label onClick={() => handleClickItem(item.sort)}>
                      <DeleteOutlined className={styles.deleteItem_icon} />
                      <span>删除入口</span>
                    </label>
                  </div>
                  <div className={styles.setting_line_addItem_line}>
                    <div className={styles.setting_line_addItem_line_label}>名称：</div>
                    <div className={styles.setting_line_addItem_line_brief}>
                      <Input value={item.name} onChange={(e) => handleNameChange(e.target.value, item.sort)} />
                    </div>
                  </div>
                  <div className={styles.setting_line_addItem_line}>
                    <div className={styles.setting_line_addItem_line_label}>图片：</div>
                    <div className={styles.setting_line_addItem_line_brief}>
                      <div className={styles.uploadIconWrap}>
                        <ImageBox className={styles.uploadPreview} width={90} height={90} imgUrl={item.img} />
                        <UploadImage
                          fileMaxSize={200}
                          onChange={(url) => handleIconChange(url, item.sort)}
                          listType="text"
                        >
                          <div className={styles.uploadIconBtn}>
                            <PlusOutlined className={styles.uploadIconBtnIcon} />
                            <span>点击上传</span>
                          </div>
                        </UploadImage>
                      </div>
                      <label className={styles.uploadIconTip}>图片建议尺寸：1920*750</label>
                      <label className={styles.uploadIconTip}>大小：不超过200k</label>
                    </div>
                  </div>
                  <div className={styles.setting_line_addItem_line}>
                    <div className={styles.setting_line_addItem_line_label}>跳转类型：</div>
                    <div className={styles.setting_line_addItem_line_brief}>
                      <Select
                        style={{ width: '100%' }}
                        value={item.type || undefined}
                        onChange={(value) => handleTypeChange(value, item.sort)}
                      >
                        {RedirectTypeList.map((item) => (
                          <Select.Option value={item.value} key={`redirect_type_${item.value}`}>
                            {item.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                  {item.type !== 5 && (
                    <div className={styles.setting_line_addItem_line}>
                      <div className={styles.setting_line_addItem_line_label}>跳转{showTextByType(item.type)}：</div>
                      <div className={styles.setting_line_addItem_line_brief}>
                        <Button
                          className={styles.selectBtn}
                          icon={<PlusOutlined />}
                          onClick={() => handleOpenSelectModal(item)}
                        >
                          选择{showTextByType(item.type)}
                        </Button>
                      </div>
                    </div>
                  )}
                  {item.selectInfo ? renderSelectItemByType(item.type, item) : null}
                </div>
              )}
            </div>
          </div>
        ))}
      </ReactSortable>
      <Button className={styles.selectBtn} icon={<PlusOutlined />} onClick={handleAddItem}>
        添加广告
      </Button>
      <ModalFormTable
        modalTitle={`选择${showTextByType(currentInfo?.type || 1)}`}
        width={modalWidthMap[currentInfo?.type || 1]}
        actionRef={modalRef}
        request={fetchTableList}
        columns={tableColumn[currentInfo?.type || 1]}
        isRowSelection
        rowSelectionType="radio"
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

export default Banner
