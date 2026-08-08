import React, { useState, useRef, useEffect } from 'react'
import { Modal, Input, Button, Drawer, message, Pagination, Form, Col } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ColumnType } from 'antd/lib/table/interface'
import cx from 'classnames'
import { getCommodityAdornWebPlatformFindProcessList, getCommodityShopListShopByReq } from '@apps/apis'
import { clearSelectedStatus, changeProps } from '@apps/design-core'
import { UploadImage } from '@apps/components'
import ProcessItem from './ProcessItem'
import SelectItem from './selectItem'
import styles from './index.less'
import SettingPanel from '../../../../components/SettingPanel'
import { filterProps, filterPropsFunction } from '../../../../utils'
import SettingList from '../../../../components/SettingList'
import { MallItemType } from '@/pages/mallManage/services/types'

export interface ProcessItemType {
  id: number
  describe: string
  logo: string
  memberName: string
  categoryBOList: string
  plantArea: number // 厂房面积
  yearProcessAmount: number // 年加工额
}

interface ProcessInfo {
  advertImg: string
  link: string
  advertTitle: string
  advertDescribe: string
  processMerchantList: ProcessItemType[]
}

interface PlatformLogisticsProps {
  dataInfo: ProcessInfo
  adornId: number
}

const PlatformProcess: React.FC<PlatformLogisticsProps> = (props) => {
  const { dataInfo, adornId } = props
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [newProps, setNewProps] = useState(props)
  const [selectDrawerVisible, setSelectDrawerVisible] = useState<boolean>(false)
  const [current, setCurrent] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [processList, setProcessList] = useState<ProcessItemType[]>([])
  const [selectProcessList, setSelectProcessList] = useState<ProcessItemType[]>([])
  const [processIds, setProcessIds] = useState<number[]>([])
  const [filterParam, setFilterParam] = useState()
  const [processPoralInfo, setProcessPoralInfo] = useState<MallItemType>()
  const ref = useRef<any>({})
  const [form] = Form.useForm()

  const fetchProcessInfo = () => {
    getCommodityShopListShopByReq({
      environment: '1',
      isSelf: 'false',
    }).then((res) => {
      if (res.data && res.data.length > 0) {
        const processItem = res.data.find(
          (item) => item.environment === 1 && item.type === 4,
        ) as unknown as MallItemType

        if (processItem) {
          setProcessPoralInfo(processItem)
        }
      }
    })
  }

  useEffect(() => {
    fetchProcessInfo()
  }, [])

  useEffect(() => {
    if (processPoralInfo) {
      fetchLogisticsList()
    }
  }, [processPoralInfo, filterParam, current, pageSize])

  const fetchLogisticsList = () => {
    let params: any = {
      type: 0,
      adornId,
      current,
      pageSize,
    }
    if (dataInfo) {
      const ids = dataInfo.processMerchantList.map((item) => item.id)
      params.processIdList = ids
    }

    if (filterParam) {
      params = Object.assign(params, filterParam)
    }

    getCommodityAdornWebPlatformFindProcessList(params).then((res) => {
      if (res.code === 1000) {
        const dataInfo = res.data
        setTotalCount(dataInfo.totalCount)
        setProcessList((dataInfo.data as unknown as ProcessItemType[]) || [])
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

  const handleChangeForKey = (value: string, key: string) => {
    changeNewProps('dataInfo', Object.assign(dataInfo, { [key]: value }))
  }

  const handleConfirmSelect = () => {
    if (selectedRows.length > 6 || [...dataInfo.processMerchantList, ...selectProcessList].length > 6) {
      message.info('最多选择推荐6个物流商')
      return
    } else {
      changeNewProps(
        'dataInfo',
        Object.assign(dataInfo, {
          processMerchantList: [...(dataInfo.processMerchantList || []), ...selectProcessList],
        }),
      )
      setSelectDrawerVisible(false)
    }
  }

  const handleDeleteSelect = (goodItem: any) => {
    const newList: any[] = []
    dataInfo.processMerchantList?.forEach((item) => {
      if (item.id !== goodItem.id) {
        newList.push(item)
      }
    })
    changeNewProps(
      'dataInfo',
      Object.assign(dataInfo, {
        processMerchantList: newList,
      }),
    )
  }

  const handleSelectItem = (processItem: ProcessItemType) => {
    const status = selectProcessList.some((item) => item.id === processItem.id)
    if (status) {
      setSelectProcessList(selectProcessList.filter((item) => item.id !== processItem.id))
      setProcessIds(processIds.filter((id) => id !== processItem.id))
    } else {
      setSelectProcessList([...selectProcessList, processItem])
      setProcessIds([...processIds, processItem.id])
    }
  }

  const handlePageChange = (page: number, pageSize?: number | undefined) => {
    setCurrent(page)
    setPageSize(pageSize || 10)
  }

  const handleItemChange = (val: string, logisticsItem: ProcessItemType) => {
    const newList = [...dataInfo.processMerchantList]
    newList.forEach((item) => {
      if (item.id === logisticsItem.id) {
        item.describe = val
      }
    })
    changeNewProps(
      'dataInfo',
      Object.assign(dataInfo, {
        processMerchantList: newList,
      }),
    )
  }

  const handleItemDelete = (logisticsItem: ProcessItemType) => {
    const newList: ProcessItemType[] = []
    dataInfo.processMerchantList.forEach((item) => {
      if (item.id !== logisticsItem.id) {
        newList.push(item)
      }
    })
    changeNewProps(
      'dataInfo',
      Object.assign(dataInfo, {
        processMerchantList: newList,
      }),
    )
  }

  const handleSearch = () => {
    setCurrent(1)
    const param = filterProps(form.getFieldsValue())
    setFilterParam(param)
  }

  // 搜索
  const handleReset = () => {
    form.resetFields()
    setCurrent(1)
    setFilterParam(undefined)
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
            if (!processPoralInfo) {
              message.error('加工门户不存在')
              return
            }
            setSelectDrawerVisible(true)
            setSelectedRowKeys([])
            setSelectedRows([])
          }}
          style={{ marginBottom: 12 }}
        >
          添加推荐加工企业
        </Button>
        <SettingList size="small" type="select">
          {dataInfo.processMerchantList &&
            dataInfo.processMerchantList.map((item) => (
              <SettingList.SettingItem
                size="small"
                onDelete={() => handleDeleteSelect(item)}
                key={`setting_item_${item.id}`}
              >
                <SelectItem dataInfo={item} onChange={handleItemChange} onDelete={handleItemDelete} />
              </SettingList.SettingItem>
            ))}
        </SettingList>
        <Drawer title="选择推荐加工企业" width={800} onClose={handleDrawerClose} visible={selectDrawerVisible}>
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
                        placeholder="加工企业名称"
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
                {processList &&
                  processList.length > 0 &&
                  processList.map((item) => (
                    <SettingList.SettingItem
                      size="small"
                      hasBorder
                      onClick={() => handleSelectItem(item)}
                      key={item.id}
                      selected={processIds.includes(item.id)}
                    >
                      <ProcessItem dataInfo={item} />
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

export default PlatformProcess
