import React, { useState } from 'react'
import { Button, Input, message } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { changeProps } from '@apps/design-core'
import { ImageBox } from '@apps/components'
import { isEmpty } from 'lodash'
import ModalTable from '@/components/ModalTable'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import cx from 'classnames'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import SearchSelect from '@/components/NiceForm/components/SearchSelect'
import Search from '@/components/NiceForm/components/Search'
import Submit from '@/components/NiceForm/components/Submit'
import { basicSchema } from './contant/schema'
import informationColumn from './contant/column'
import arrowRightIcon from '@/assets/icons/arrow_right.png'
import arrowLeftIcon from '@/assets/icons/arrow_left.png'
import styles from './index.less'
// import { getManageContentInformationPageByIdNotIn } from '@apps/apis'
import { postProductMobileShopStoreGetCategoryByCommodityId } from '@apps/apis'
import { getManageContentInformationPageByIdNotIn } from '@apps/apis'

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
  selectInfo?: any
  informationIdList: number[]
  storeId: number
  title: string
}

const ChannelInformation: React.FC<BannerPropsType> = (props) => {
  const { title, informationIdList, dataList } = props
  const [expandState, setExpandState] = useState<boolean>(true)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [recommendTitle, setRecommendTitle] = useState<string>(title)
  const [productRowSelection, productRowCtl] = useRowSelectionTable()
  const intl = useIntl()

  /**
   * 修改名称
   * @param value
   * @param id
   */
  const handleNameChange = (value: string) => {
    setRecommendTitle(value)
    changeProps({
      props: Object.assign({ ...props }, { title: value }),
    })
  }

  const getDataListByList = (list) => {
    let result: any = []
    if (list) {
      list.forEach((listItem) => {
        if (listItem.productList && listItem.productList.length > 0) {
          result = [...result, ...listItem.productList]
        }
      })
    }
    return result
  }

  /**
   * 删除已选商品
   */
  const handleDeleteItem = (id: number) => {
    let informationIds = [...informationIdList]
    informationIds = informationIds.filter((item) => item !== id)

    const informationList = []

    dataList.forEach((listItem: any) => {
      if (listItem.id !== id) {
        informationList.push(listItem)
      }
    })

    changeProps({
      props: Object.assign(
        { ...props },
        {
          informationIdList: informationIds,
          dataList: informationList,
        },
      ),
    })
  }

  /**
   * 根据类型显示选择的信息
   * @param type 1-商品详情 2-积分详情 3-店铺主页 4-资讯详情 5-不跳转
   */
  const renderSelectItemByType = (list: any[]) => {
    // const selectList = getDataListByList(list)

    return (
      <div>
        {list &&
          list.map((selectItem) => (
            <div className={styles.setting_line_addItem_line} key={selectItem.id}>
              <div className={styles.setting_line_addItem_line_label}></div>
              <div className={styles.setting_line_addItem_line_brief}>
                <div className={styles.selectInfoBox}>
                  <ImageBox width={60} height={60} src={selectItem.imageUrl} />
                  <div className={cx(styles.selectInfo, styles.shop)}>
                    <div className={styles.selectInfo_name}>{selectItem.title}</div>
                  </div>
                  <div className={styles.selectInfoBox_delete} onClick={() => handleDeleteItem(selectItem.id)}>
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
   * @param sort
   * @param type
   */
  const handleOpenSelectModal = () => {
    setModalVisible(true)
  }

  const fetchCategoryByCommodityId = (idList: number[]) => {
    return new Promise((resolve) => {
      const param = {
        idList,
      }
      postProductMobileShopStoreGetCategoryByCommodityId(param)
        .then((res) => {
          message.destroy()
          if (res.code === 1000) {
            resolve(changeData(res.data))
          } else {
            resolve([])
          }
        })
        .catch(() => {
          resolve([])
        })
    })
  }

  const changeData = (dataList) => {
    if (dataList) {
      return dataList.map((dataItem) => {
        return {
          categoryId: dataItem.id,
          categoryName: dataItem.name,
          categoryImage: dataItem.imageUrl || '',
          productList: dataItem.commodityResponseList
            ? dataItem.commodityResponseList.map((commodityItem) => {
                return {
                  id: commodityItem.id,
                  name: commodityItem.name,
                  sellPoints: commodityItem.sellingPoint,
                  min: commodityItem.min,
                  unitName: commodityItem.unitName,
                  sold: commodityItem.sold,
                  mainPic: commodityItem.mainPic,
                }
              })
            : [],
        }
      })
    }
    return []
  }

  const handleModalOk = async () => {
    let selectedRowKeys = productRowCtl.selectedRowKeys
    const selectResult = productRowCtl.selectRow

    if (!selectedRowKeys || isEmpty(selectedRowKeys)) {
      message.info(intl.formatMessage({ id: 'common.text.pleaseSelect' }))
      return null
    }
    if (informationIdList) {
      selectedRowKeys = [...informationIdList, ...selectedRowKeys]
    } else {
      selectedRowKeys = [...selectedRowKeys]
    }

    changeProps({
      props: Object.assign(
        { ...props },
        {
          informationIdList: selectedRowKeys,
          dataList: [...dataList, ...selectResult],
        },
      ),
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
    const params: any = {
      ...param,
      idList: informationIdList,
    }

    /** manage/contentInformation/pageByIdNotIn*/
    const res = await getManageContentInformationPageByIdNotIn(params, { ctlType: 'none' })
    return res.data
  }

  return (
    <div className={styles.setting}>
      {/* <div className={styles.hideModule}>
        <Checkbox checked={!visible} onChange={handleHideChange}>隐藏整个模块</Checkbox>
      </div> */}

      <div className={styles.setting_line}>
        <div className={styles.setting_line_main}>
          <div className={styles.setting_line_name}>
            <div style={{ flex: 1 }} onClick={() => setExpandState(!expandState)}>
              {expandState ? (
                <img className={styles.icon} src={arrowLeftIcon} />
              ) : (
                <img className={styles.icon} src={arrowRightIcon} />
              )}
              <span>{title}</span>
            </div>
          </div>
          {expandState && (
            <div className={styles.setting_line_addItem}>
              <div className={styles.setting_line_addItem_line}>
                <div className={styles.setting_line_addItem_line_label}>
                  {intl.formatMessage({ id: 'editor.setting.form.title' })}：
                </div>
                <div className={styles.setting_line_addItem_line_brief}>
                  <Input value={recommendTitle} onChange={(e) => handleNameChange(e.target.value)} />
                </div>
              </div>
              <div className={styles.setting_line_addItem_line}>
                <div className={styles.setting_line_addItem_line_label}>
                  {intl.formatMessage({ id: 'editor.form.label.information.recommend' })}：
                </div>
                <div className={styles.setting_line_addItem_line_brief}>
                  <Button className={styles.selectBtn} icon={<PlusOutlined />} onClick={() => handleOpenSelectModal()}>
                    {intl.formatMessage({ id: 'editor.drawer.mix.title.map_4' })}
                  </Button>
                </div>
              </div>
              {dataList && dataList.length > 0 ? renderSelectItemByType(dataList) : null}
            </div>
          )}
        </div>
      </div>
      <ModalTable
        modalTitle={intl.formatMessage({ id: 'editor.drawer.commodity.title' })}
        width={600}
        confirm={handleModalOk}
        cancel={handleModalCancel}
        scroll={{ y: 400 }}
        visible={modalVisible}
        columns={informationColumn}
        rowSelection={productRowSelection}
        fetchTableData={(params) => fetchTableList(params)}
        formilyProps={{
          ctx: {
            schema: basicSchema,
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

export default ChannelInformation
