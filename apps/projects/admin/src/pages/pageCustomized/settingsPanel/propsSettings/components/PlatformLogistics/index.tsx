import React, { useState, useRef, useEffect } from 'react'
import { Modal, Input, Button, Drawer, message, Pagination, Col, Form } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import cx from 'classnames'
import { getCommodityAdornWebPlatformFindLogisticsList, getCommodityShopListShopByReq } from '@apps/apis'
import { createFormActions } from '@apps/formily'
import { clearSelectedStatus, changeProps } from '@apps/design-core'
import { UploadImage } from '@apps/components'
import LogisticsItem from './LogisticsItem'
import SelectItem from './selectItem'
import styles from './index.less'
import SettingPanel from '../../../../components/SettingPanel'
import { filterProps, filterPropsFunction } from '../../../../utils'
import SettingList from '../../../../components/SettingList'
import { MallItemType } from '@/pages/mallManage/services/types'

export interface LogisticsItemType {
  id: number
  describe: string
  logo: string
  memberName: string
  mainBusiness: string
}

interface LogisticsInfo {
  advertImg: string
  link: string
  advertTitle: string
  advertDescribe: string
  logisticsMerchantList: LogisticsItemType[]
}

interface PlatformLogisticsProps {
  dataInfo: LogisticsInfo
  adornId: number
}

const formActions = createFormActions()

const PlatformLogistics: React.FC<PlatformLogisticsProps> = (props) => {
  const { dataInfo, adornId } = props
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [newProps, setNewProps] = useState(props)
  const [selectDrawerVisible, setSelectDrawerVisible] = useState<boolean>(false)
  const [current, setCurrent] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [logisticsList, setLogisticsList] = useState<LogisticsItemType[]>([])
  const [selectLogisticsList, setSelectLogisticsList] = useState<LogisticsItemType[]>([])
  const [logisticsIds, setLogisticsIds] = useState<number[]>([])
  const [filterParam, setFilterParam] = useState()
  const [logisticPoralInfo, setLogisticPoralInfo] = useState<MallItemType>()
  const ref = useRef<any>({})
  const [form] = Form.useForm()

  const fetchLogisticInfo = () => {
    getCommodityShopListShopByReq({
      environment: '1',
      isSelf: 'false',
    }).then((res) => {
      if (res.data && res.data.length > 0) {
        const logisticsItem = res.data.find(
          (item) => item.environment === 1 && item.type === 3,
        ) as unknown as MallItemType
        if (logisticsItem) {
          setLogisticPoralInfo(logisticsItem)
        }
      }
    })
  }

  useEffect(() => {
    fetchLogisticInfo()
  }, [])

  useEffect(() => {
    if (logisticPoralInfo) {
      fetchLogisticsList()
    }
  }, [filterParam, logisticPoralInfo, current, pageSize])

  const fetchLogisticsList = () => {
    let params: any = {
      type: 0,
      adornId,
      shopId: logisticPoralInfo?.id,
      current,
      pageSize,
    }

    if (dataInfo) {
      const ids = dataInfo.logisticsMerchantList.map((item) => item.id)
      params.logisticsIdList = ids
    }

    if (filterParam) {
      params = Object.assign(params, filterParam)
    }

    getCommodityAdornWebPlatformFindLogisticsList(params).then((res) => {
      if (res.code === 1000) {
        const dataInfo = res.data
        setTotalCount(dataInfo.totalCount)
        setLogisticsList((dataInfo.data as unknown as LogisticsItemType[]) || [])
      }
    })
  }

  const changeNewProps = (key: string, data: any) => {
    const newProps = filterPropsFunction(props)
    newProps[key] = data
    setNewProps(newProps)
  }

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

  const handleDrawerClose = () => {
    setSelectDrawerVisible(false)
  }

  // 搜索
  const handleReset = () => {
    form.resetFields()
    setCurrent(1)
    setFilterParam(undefined)
  }

  const handleChangeForKey = (value: string, key: string) => {
    changeNewProps('dataInfo', Object.assign(dataInfo, { [key]: value }))
  }

  const handleConfirmSelect = () => {
    if (selectedRows.length > 6 || [...(dataInfo.logisticsMerchantList || []), ...selectLogisticsList].length > 6) {
      message.info('最多选择推荐6个物流商')
      return
    } else {
      changeNewProps(
        'dataInfo',
        Object.assign(dataInfo, {
          logisticsMerchantList: [...(dataInfo.logisticsMerchantList || []), ...selectLogisticsList],
        }),
      )
      setSelectDrawerVisible(false)
    }
  }

  const handleDeleteSelect = (goodItem: any) => {
    const newList: any[] = []
    dataInfo.logisticsMerchantList?.forEach((item) => {
      if (item.id !== goodItem.id) {
        newList.push(item)
      }
    })
    changeNewProps(
      'dataInfo',
      Object.assign(dataInfo, {
        logisticsMerchantList: newList,
      }),
    )
  }

  const handleSelectItem = (logisticsItem: LogisticsItemType) => {
    const status = selectLogisticsList.some((item) => item.id === logisticsItem.id)
    if (status) {
      setSelectLogisticsList(selectLogisticsList.filter((item) => item.id !== logisticsItem.id))
      setLogisticsIds(logisticsIds.filter((id) => id !== logisticsItem.id))
    } else {
      setSelectLogisticsList([...selectLogisticsList, logisticsItem])
      setLogisticsIds([...logisticsIds, logisticsItem.id])
    }
  }

  const handlePageChange = (page: number, pageSize?: number | undefined) => {
    setCurrent(page)
    setPageSize(pageSize || 10)
  }

  const handleItemChange = (val: string, logisticsItem: LogisticsItemType) => {
    const newList = [...dataInfo.logisticsMerchantList]
    newList.forEach((item) => {
      if (item.id === logisticsItem.id) {
        item.describe = val
      }
    })
    changeNewProps(
      'dataInfo',
      Object.assign(dataInfo, {
        logisticsMerchantList: newList,
      }),
    )
  }

  const handleItemDelete = (logisticsItem: LogisticsItemType) => {
    const newList: LogisticsItemType[] = []
    dataInfo.logisticsMerchantList.forEach((item) => {
      if (item.id !== logisticsItem.id) {
        newList.push(item)
      }
    })
    changeNewProps(
      'dataInfo',
      Object.assign(dataInfo, {
        logisticsMerchantList: newList,
      }),
    )
  }

  const handleSearch = () => {
    setCurrent(1)
    const param = filterProps(form.getFieldsValue())
    setFilterParam(param)
  }

  return (
    <SettingPanel confirmLoading={confirmLoading} onCancel={handleCancel} onOK={handleConfirmSave}>
      <div className={styles.platform_goods}>
        <div className={styles.setting_title}>
          <span>模块信息设置</span>
        </div>
        <div className={styles.setting_line_addItem}>
          <div className={styles.setting_line_addItem_line}>
            <div className={styles.setting_line_addItem_line_label}>广告图:</div>
            <div className={styles.setting_line_addItem_line_brief}>
              <UploadImage
                imgUrl={dataInfo.advertImg}
                size="48*48"
                fileMaxSize={200}
                onChange={(val) => handleChangeForKey(val, 'advertImg')}
              />
            </div>
          </div>
          <div className={styles.setting_line_addItem_line}>
            <div className={cx(styles.setting_line_addItem_line_label, styles.height32)}>广告标题:</div>
            <div className={styles.setting_line_addItem_line_brief}>
              <Input
                className={styles.setting_line_addItem_input}
                value={dataInfo.advertTitle}
                maxLength={10}
                onChange={(e) => handleChangeForKey(e.target.value, 'advertTitle')}
              />
            </div>
          </div>
          <div className={styles.setting_line_addItem_line}>
            <div className={cx(styles.setting_line_addItem_line_label, styles.height32)}>跳转链接:</div>
            <div className={styles.setting_line_addItem_line_brief}>
              <Input
                className={styles.setting_line_addItem_input}
                value={dataInfo.link}
                onChange={(e) => handleChangeForKey(e.target.value, 'link')}
              />
            </div>
          </div>
          <div className={styles.setting_line_addItem_line}>
            <div className={cx(styles.setting_line_addItem_line_label, styles.height32)}>广告描述:</div>
            <div className={styles.setting_line_addItem_line_brief}>
              <Input
                className={styles.setting_line_addItem_input}
                value={dataInfo.advertDescribe}
                maxLength={30}
                onChange={(e) => handleChangeForKey(e.target.value, 'advertDescribe')}
              />
            </div>
          </div>
        </div>
        <div className={styles.setting_title}>
          <span>模块内容设置</span>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            if (!logisticPoralInfo) {
              message.error('物流门户不存在')
              return
            }
            setSelectDrawerVisible(true)
            setSelectedRowKeys([])
            setSelectedRows([])
          }}
          style={{ marginBottom: 12 }}
        >
          添加推荐物流商
        </Button>
        <SettingList size="small" type="select">
          {dataInfo.logisticsMerchantList &&
            dataInfo.logisticsMerchantList.map((item) => (
              <SettingList.SettingItem
                size="small"
                onDelete={() => handleDeleteSelect(item)}
                key={`setting_item_${item.id}`}
              >
                <SelectItem dataInfo={item} onChange={handleItemChange} onDelete={handleItemDelete} />
              </SettingList.SettingItem>
            ))}
        </SettingList>
        <Drawer title="选择推荐物流商" width={800} onClose={handleDrawerClose} visible={selectDrawerVisible}>
          <SettingPanel
            confirmLoading={confirmLoading}
            onCancel={() => setSelectDrawerVisible(false)}
            onOK={handleConfirmSelect}
          >
            <div style={{ margin: -8 }}>
              <Form form={form}>
                <Col span={18} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <Col>
                    <Form.Item className={styles.mar_bot_0} name="memberName">
                      <Input.Search
                        style={{ width: 240 }}
                        placeholder="物流商名称"
                        allowClear
                        onSearch={handleSearch}
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Button type="primary" onClick={handleSearch} style={{ marginLeft: 16 }}>
                      搜索
                    </Button>
                  </Col>
                  <Col>
                    <Button onClick={handleReset} style={{ marginLeft: 16 }}>
                      重置
                    </Button>
                  </Col>
                </Col>
              </Form>
              <SettingList type="select" size="small">
                {logisticsList &&
                  logisticsList.length > 0 &&
                  logisticsList.map((item) => (
                    <SettingList.SettingItem
                      size="small"
                      hasBorder
                      onClick={() => handleSelectItem(item)}
                      key={item.id}
                      selected={logisticsIds.includes(item.id)}
                    >
                      <LogisticsItem dataInfo={item} />
                    </SettingList.SettingItem>
                  ))}
              </SettingList>
              <div className={styles.pagintion_wrap}>
                <Pagination
                  current={current}
                  total={totalCount}
                  showSizeChanger
                  showQuickJumper
                  onChange={handlePageChange}
                  showTotal={(total) => `共 ${totalCount} 条`}
                />
              </div>
            </div>
          </SettingPanel>
        </Drawer>
      </div>
    </SettingPanel>
  )
}

export default PlatformLogistics
