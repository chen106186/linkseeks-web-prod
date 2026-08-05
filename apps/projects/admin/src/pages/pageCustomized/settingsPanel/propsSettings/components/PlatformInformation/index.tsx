import React, { useState, useEffect, useRef } from 'react'
import { Modal, Tabs, Input, Select, Button, Drawer, message, DatePicker } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import cx from 'classnames'
import { StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { getManageContentInformationPageByIdNotIn } from '@apps/apis'
import { clearSelectedStatus, changeProps } from '@apps/design-core'
import { GetManageContentColumnAllResponse, getManageContentColumnAll } from '@apps/apis'
import moment from 'moment'
import styles from './index.less'
import SettingPanel from '../../../../components/SettingPanel'
import { filterPropsFunction } from '../../../../utils'
import { useSelectUnit } from '@apps/services'

interface DatePriceItemType {
  date: string
  price: number
}

interface MarketItem {
  priceLabel: string
  goodsName: string
  unitId: number | undefined
  unitName: string
  datePriceBOList: DatePriceItemType[]
}

type keyType = 'priceLabel' | 'goodsName' | 'unitId' | 'unitName' | 'datePriceBOList'

interface InformationItemType {
  id: number
  title: string
  createTime: number
}

interface PlatformGoodsProps {
  marketList: MarketItem[]
  information: {
    allList: InformationItemType[]
    bazaarList: InformationItemType[]
    hotList: InformationItemType[]
    allIdList: number[]
    bazaarIdList: number[]
    hotIdList: number[]
  }
}

interface SelectItem {
  id: number
  name: string
  englishShortName: string
}

const { TabPane } = Tabs

const PlatformInformation: React.FC<PlatformGoodsProps> = (props) => {
  const [confirmLoading] = useState<boolean>(false)
  const [newProps, setNewProps] = useState(props)
  const { marketList, information } = newProps
  const [labelDrawerVisible, setLabelDrawerVisible] = useState<boolean>(false)
  const [priceDrawerVisible, setPriceDrawerVisible] = useState<boolean>(false)
  const [newLabelInfo, setNewLabelInfo] = useState<MarketItem>()
  const [priceDrawerTitle, setPriceDrawerTitle] = useState<string>('')
  const [priceSettingIndex, setPriceSettingIndex] = useState<number>(0)
  const [startDate, setStartDate] = useState<moment.Moment>() // moment().subtract(1, 'month')
  const [endDate, setEndDate] = useState<moment.Moment>()
  const [dateRangeList, setDateRangeList] = useState<DatePriceItemType[]>([])
  const [informationDrawerVisible, setInformationDrawerVisible] = useState<boolean>(false)
  const [columnList, setColumnList] = useState<GetManageContentColumnAllResponse>([])
  const [informationTabType, setInformationTabType] = useState<string>('0')
  const [columnId, setColumnId] = useState<number>()
  const { unitOptions } = useSelectUnit()
  const ref = useRef({} as ActionType)

  const fetchColumnAll = () => {
    const param: any = {}
    if (informationTabType !== '0') {
      param.type = informationTabType
    }

    getManageContentColumnAll(param).then((res) => {
      if (res.code === 1000) {
        setColumnList(res.data)
      }
    })
  }

  const changeNewProps = (key: string, data: any) => {
    const tempProps = filterPropsFunction(newProps)
    tempProps[key] = data
    setNewProps(tempProps)
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

  const handleAddLabel = () => {
    setLabelDrawerVisible(true)
  }

  const handleLabelDrawerClose = () => {
    setLabelDrawerVisible(false)
  }

  const handleLabelConfirmAdd = () => {
    if (newLabelInfo) {
      if (!newLabelInfo.priceLabel) {
        message.info('请输入价格标签')
        return
      }
      if (!newLabelInfo.goodsName) {
        message.info('请输入商品名称')
        return
      }
      if (!newLabelInfo.unitId) {
        message.info('请选择单位')
        return
      }
      let newList = [...marketList]
      newList = [...newList, newLabelInfo]
      changeNewProps('marketList', [...newList])
      setNewLabelInfo(undefined)
      setLabelDrawerVisible(false)
      return
    }
    message.info('请完善价格标签信息')
  }

  const handlePriceConfirmAdd = () => {
    if (!dateRangeList || dateRangeList.length === 0) {
      message.info('请添加日期')
      return
    }
    const newList: MarketItem[] = []
    marketList.forEach((item, index: number) => {
      const newItem = { ...item }
      if (index === priceSettingIndex) {
        newItem.datePriceBOList = dateRangeList
      }
      newList.push(newItem)
    })
    changeNewProps('marketList', [...newList])
    setPriceDrawerVisible(false)
  }

  const getUnitNameById = (id: string): string => {
    let unitName = ''
    for (const item of unitOptions) {
      if (item.value === id) {
        unitName = item.label
        return unitName
      }
    }
    return unitName
  }

  const handleLabelChangeForKey = (val: any, key: keyType) => {
    const newItem = {}
    if (key === 'unitId') {
      newItem['unitName'] = getUnitNameById(val)
      newItem[key] = val
    } else {
      newItem[key] = val
    }

    const tempLabelInfo = Object.assign(
      newLabelInfo
        ? { ...newLabelInfo }
        : {
            priceLabel: '',
            goodsName: '',
            unitId: undefined,
            unitName: 'undefined',
            datePriceBOList: [],
          },
      { ...newItem },
    )
    setNewLabelInfo(tempLabelInfo)
  }

  const handleDeleteMarketItem = (itemIndex: number) => {
    const newList: MarketItem[] = []
    marketList.forEach((item, index) => {
      if (index !== itemIndex) {
        newList.push(item)
      }
    })
    changeNewProps('marketList', [...newList])
  }

  const handleDeletePriceItem = (itemIndex: number) => {
    const newList: DatePriceItemType[] = []
    dateRangeList.forEach((item, index) => {
      if (index !== itemIndex) {
        newList.push(item)
      }
    })
    setDateRangeList(newList)
  }

  const handleMarketItemChange = (val: any, itemIndex: number, key: string) => {
    const newList: MarketItem[] = []
    marketList.forEach((item, index) => {
      const temp = { ...item }
      if (index === itemIndex) {
        temp[key] = val
        if (key === 'unitId') {
          temp['unitName'] = getUnitNameById(val)
        }
      }
      newList.push(temp)
    })
    changeNewProps('marketList', [...newList])
  }

  const handlePriceItemChange = (val: any, itemIndex: number, key: string) => {
    const newList: DatePriceItemType[] = []
    dateRangeList.forEach((item, index) => {
      const temp = { ...item }
      if (index === itemIndex) {
        temp[key] = val
      }
      newList.push(temp)
    })
    setDateRangeList(newList)
  }

  const disabledDate = (current) => {
    return (current && current > moment().endOf('day')) || (startDate && startDate > current)
  }

  const createDateRangeList = () => {
    if (!startDate) {
      message.info('请选择起始时间')
      return
    }
    if (!endDate) {
      message.info('请选择结束时间')
      return
    }
    const arr: string[] = []
    let startTime = moment(startDate).format('YYYY-MM-DD')
    const endTime = moment(endDate).format('YYYY-MM-DD')
    while (moment(startTime).isSameOrBefore(endTime)) {
      arr.push(startTime)
      startTime = moment(startTime).add(1, 'days').format('YYYY-MM-DD')
    }

    const newList: DatePriceItemType[] = []
    arr.forEach((item) => {
      newList.push({
        date: item,
        price: 0,
      })
    })
    setDateRangeList(newList)
  }

  const handleAddInformation = () => {
    setInformationDrawerVisible(true)
    fetchColumnAll()
    if (ref.current.reload) {
      ref.current.reload()
    }
  }

  const columns: RecordColumns<any>[] = [
    {
      title: '标题/摘要',
      key: 'title',
      dataIndex: 'title',
    },
    {
      title: '时间',
      key: 'createTime',
      dataIndex: 'createTime',
      render: (createTime) => moment(createTime).format('YYYY/MM/DD HH:mm'),
    },
  ]

  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      params.idList = [
        ...(information.allIdList || []),
        ...(information.bazaarIdList || []),
        ...(information.hotIdList || []),
      ].join(',')

      if (informationTabType !== '0') {
        params.type = Number(informationTabType)
      }

      if (columnId) {
        params.columnId = columnId
      }

      getManageContentInformationPageByIdNotIn(params).then((res) => {
        const { data } = res
        resolve(data)
      })
    })
  }

  const handleSearchByColumnId = () => {
    if (ref.current.reload) {
      ref.current.reload()
    }
  }

  const handleInformationConfirmAdd = () => {
    switch (informationTabType) {
      case '0':
        if ([...information.allIdList, ...ref.current.selectionKeys].length > 8) {
          message.info('最多选择8条资讯')
          return
        }
        changeNewProps(
          'information',
          Object.assign(information, {
            allList: [...information.allList, ...ref.current.getSelectionItems()],
            allIdList: [...information.allIdList, ...ref.current.selectionKeys],
          }),
        )
        break
      case '1':
        if ([...information.bazaarIdList, ...ref.current.selectionKeys].length > 8) {
          message.info('最多选择8条资讯')
          return
        }
        changeNewProps(
          'information',
          Object.assign(information, {
            bazaarList: [...information.bazaarList, ...ref.current.getSelectionItems()],
            bazaarIdList: [...information.bazaarIdList, ...ref.current.selectionKeys],
          }),
        )
        break
      case '2':
        if ([...information.hotIdList, ...ref.current.selectionKeys].length > 8) {
          message.info('最多选择8条资讯')
          return
        }
        changeNewProps(
          'information',
          Object.assign(information, {
            hotList: [...information.hotList, ...ref.current.getSelectionItems()],
            hotIdList: [...information.hotIdList, ...ref.current.selectionKeys],
          }),
        )
        break
    }
    setInformationDrawerVisible(false)
    ref.current.setSelectionKeys([])
  }

  const handleDeleteInformationItem = (informationItem: InformationItemType, key: string) => {
    const newList: InformationItemType[] = []
    let newIdList: number[] = []
    switch (key) {
      case 'allList':
        information.allList.forEach((item) => {
          if (item.id !== informationItem.id) {
            newList.push(item)
          }
        })
        newIdList = information.allIdList.filter((id) => id !== informationItem.id)
        changeNewProps(
          'information',
          Object.assign(information, {
            allList: newList,
            allIdList: newIdList,
          }),
        )
        break
      case 'bazaarList':
        information.bazaarList.forEach((item) => {
          if (item.id !== informationItem.id) {
            newList.push(item)
          }
        })
        newIdList = information.bazaarIdList.filter((id) => id !== informationItem.id)
        changeNewProps(
          'information',
          Object.assign(information, {
            bazaarList: newList,
            bazaarIdList: newIdList,
          }),
        )
        break
      case 'hotList':
        information.hotList.forEach((item) => {
          if (item.id !== informationItem.id) {
            newList.push(item)
          }
        })
        newIdList = information.hotIdList.filter((id) => id !== informationItem.id)
        changeNewProps(
          'information',
          Object.assign(information, {
            hotList: newList,
            hotIdList: newIdList,
          }),
        )
        break
    }
  }

  return (
    <SettingPanel confirmLoading={confirmLoading} onCancel={handleCancel} onOK={handleConfirmSave}>
      <div style={{ margin: -8, marginTop: -24 }}>
        <Tabs defaultActiveKey="information">
          <TabPane tab="价格标签" key="label">
            <div className={cx(styles.tb_line, styles.tb_head)}>
              <div className={cx(styles.tb_line_item, styles.w160)}>价格标签</div>
              <div className={cx(styles.tb_line_item, styles.w320)}>商品名称</div>
              <div className={cx(styles.tb_line_item, styles.w160)}>单位</div>
              <div className={cx(styles.tb_line_item, styles.w128)}>操作</div>
            </div>
            {marketList &&
              marketList.map((item, index) => (
                <div className={cx(styles.tb_line)} key={`tb_line_${index}`}>
                  <div className={cx(styles.tb_line_item, styles.w160)}>
                    <Input
                      value={item.priceLabel}
                      style={{ width: 144 }}
                      onChange={(e) => handleMarketItemChange(e.target.value, index, 'priceLabel')}
                    />
                  </div>
                  <div className={cx(styles.tb_line_item, styles.w320)}>
                    <Input
                      value={item.goodsName}
                      style={{ width: 304 }}
                      onChange={(e) => handleMarketItemChange(e.target.value, index, 'goodsName')}
                    />
                  </div>
                  <div className={cx(styles.tb_line_item, styles.w160)}>
                    <Select
                      value={item.unitId}
                      style={{ width: 144 }}
                      onChange={(val) => handleMarketItemChange(val, index, 'unitId')}
                    >
                      {unitOptions &&
                        unitOptions.map((item) => (
                          <Select.Option key={item.value} value={item.value}>
                            {item.label}
                          </Select.Option>
                        ))}
                    </Select>
                  </div>
                  <div className={cx(styles.tb_line_item, styles.w128)}>
                    <div className={styles.tb_line_item_btn_group}>
                      <Button type="link" style={{ marginLeft: -12 }} onClick={() => handleDeleteMarketItem(index)}>
                        删除
                      </Button>
                      <Button
                        type="link"
                        onClick={() => {
                          setPriceDrawerVisible(true)
                          setPriceSettingIndex(index)
                          setPriceDrawerTitle(`设置价格-${item.priceLabel}`)
                          if (item.datePriceBOList && item.datePriceBOList.length > 0) {
                            setDateRangeList(item.datePriceBOList)
                          } else {
                            setDateRangeList([])
                          }
                        }}
                      >
                        设置价格
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

            <div
              className={cx(styles.add_btn, marketList && marketList.length === 0 ? styles.martop : '')}
              onClick={handleAddLabel}
            >
              <PlusOutlined />
              <span>新增价格标签</span>
            </div>
            <Drawer title="新增价格标签" width={600} onClose={handleLabelDrawerClose} visible={labelDrawerVisible}>
              <SettingPanel
                confirmLoading={confirmLoading}
                onCancel={() => setLabelDrawerVisible(false)}
                onOK={handleLabelConfirmAdd}
              >
                <div style={{ margin: -8 }}>
                  <div className={styles.setting_line_addItem}>
                    <div className={styles.setting_line_addItem_line}>
                      <div className={cx(styles.setting_line_addItem_line_label, styles.height32)}>价格标签：</div>
                      <div className={styles.setting_line_addItem_line_brief}>
                        <Input
                          className={styles.setting_line_addItem_input}
                          value={newLabelInfo?.priceLabel}
                          maxLength={8}
                          onChange={(e) => handleLabelChangeForKey(e.target.value, 'priceLabel')}
                        />
                      </div>
                    </div>
                    <div className={styles.setting_line_addItem_line}>
                      <div className={cx(styles.setting_line_addItem_line_label, styles.height32)}>商品名称:</div>
                      <div className={styles.setting_line_addItem_line_brief}>
                        <Input
                          className={styles.setting_line_addItem_input}
                          value={newLabelInfo?.goodsName}
                          maxLength={16}
                          onChange={(e) => handleLabelChangeForKey(e.target.value, 'goodsName')}
                        />
                      </div>
                    </div>
                    <div className={styles.setting_line_addItem_line}>
                      <div className={cx(styles.setting_line_addItem_line_label, styles.height32)}>单位:</div>
                      <div className={styles.setting_line_addItem_line_brief}>
                        <Select
                          value={newLabelInfo?.unitId}
                          onChange={(value) => handleLabelChangeForKey(value, 'unitId')}
                          style={{ width: '100%' }}
                        >
                          {unitOptions &&
                            unitOptions.map((item) => (
                              <Select.Option key={item.value} value={item.value}>
                                {item.label}
                              </Select.Option>
                            ))}
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </SettingPanel>
            </Drawer>
            <Drawer
              title={priceDrawerTitle}
              width={600}
              onClose={() => setPriceDrawerVisible(false)}
              visible={priceDrawerVisible}
            >
              <SettingPanel
                confirmLoading={confirmLoading}
                onCancel={() => setPriceDrawerVisible(false)}
                onOK={handlePriceConfirmAdd}
              >
                <div style={{ margin: -8 }}>
                  <div className={styles.form_line}>
                    <DatePicker
                      value={startDate}
                      onChange={(date) => date && setStartDate(date)}
                      disabledDate={(current) => current && current > moment().endOf('day')}
                      className={styles.date_picker}
                    />
                    <div className={styles.date_picker_split}>～</div>
                    <DatePicker
                      value={endDate}
                      onChange={(date) => date && setEndDate(date)}
                      disabledDate={disabledDate}
                      className={styles.date_picker}
                    />
                    <Button type="primary" style={{ marginLeft: 16 }} onClick={() => createDateRangeList()}>
                      生成
                    </Button>
                  </div>
                  <div className={cx(styles.tb_line, styles.tb_head)}>
                    <div className={cx(styles.tb_line_item, styles.w160)}>日期</div>
                    <div className={cx(styles.tb_line_item, styles.w280)}>金额</div>
                    <div className={cx(styles.tb_line_item, styles.w128)}>操作</div>
                  </div>
                  {dateRangeList &&
                    dateRangeList.map((item, index) => (
                      <div className={cx(styles.tb_line)} key={`tb_line_${index}`}>
                        <div className={cx(styles.tb_line_item, styles.w160)}>
                          <span>{item.date}</span>
                        </div>
                        <div className={cx(styles.tb_line_item, styles.w280)}>
                          <Input
                            addonBefore="￥"
                            value={item.price}
                            style={{ width: 264 }}
                            onChange={(e) => handlePriceItemChange(Number(e.target.value), index, 'price')}
                          />
                        </div>
                        <div className={cx(styles.tb_line_item, styles.w128)}>
                          <div className={styles.tb_line_item_btn_group}>
                            <Button
                              type="link"
                              style={{ marginLeft: -12 }}
                              onClick={() => handleDeletePriceItem(index)}
                            >
                              删除
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </SettingPanel>
            </Drawer>
          </TabPane>
          <TabPane tab="行情资讯" key="infomation">
            <>
              <Tabs
                activeKey={informationTabType}
                onChange={(activeKey) => setInformationTabType(activeKey)}
                tabBarExtraContent={
                  <Button icon={<PlusOutlined />} type="primary" onClick={() => handleAddInformation()}>
                    选择行情资讯
                  </Button>
                }
              >
                <TabPane tab="全部" key="0">
                  <div className={cx(styles.tb_line, styles.tb_head)}>
                    <div className={cx(styles.tb_line_item, styles.w448)}>行情资讯标题</div>
                    <div className={cx(styles.tb_line_item, styles.w160)}>发布时间</div>
                    <div className={cx(styles.tb_line_item, styles.w128)}>操作</div>
                  </div>
                  {information.allList &&
                    information.allList.map((item, index) => (
                      <div className={cx(styles.tb_line)} key={`tb_line_${index}`}>
                        <div className={cx(styles.tb_line_item, styles.w448)}>
                          <div className={styles.information_title}>{item.title}</div>
                        </div>
                        <div className={cx(styles.tb_line_item, styles.w160)}>
                          {moment(item.createTime).format('YYYY/MM/DD HH:mm')}
                        </div>
                        <div className={cx(styles.tb_line_item, styles.w128)}>
                          <div className={styles.tb_line_item_btn_group}>
                            <Button
                              type="link"
                              style={{ marginLeft: -12 }}
                              onClick={() => handleDeleteInformationItem(item, 'allList')}
                            >
                              删除
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </TabPane>
                <TabPane tab="市场行情" key="1">
                  <div className={cx(styles.tb_line, styles.tb_head)}>
                    <div className={cx(styles.tb_line_item, styles.w448)}>行情资讯标题</div>
                    <div className={cx(styles.tb_line_item, styles.w160)}>发布时间</div>
                    <div className={cx(styles.tb_line_item, styles.w128)}>操作</div>
                  </div>
                  {information.bazaarList &&
                    information.bazaarList.map((item, index) => (
                      <div className={cx(styles.tb_line)} key={`tb_line_${index}`}>
                        <div className={cx(styles.tb_line_item, styles.w448)}>
                          <div className={styles.information_title}>{item.title}</div>
                        </div>
                        <div className={cx(styles.tb_line_item, styles.w160)}>
                          {moment(item.createTime).format('YYYY/MM/DD HH:mm')}
                        </div>
                        <div className={cx(styles.tb_line_item, styles.w128)}>
                          <div className={styles.tb_line_item_btn_group}>
                            <Button
                              type="link"
                              style={{ marginLeft: -12 }}
                              onClick={() => handleDeleteInformationItem(item, 'bazaarList')}
                            >
                              删除
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </TabPane>
                <TabPane tab="热门资讯" key="2">
                  <div className={cx(styles.tb_line, styles.tb_head)}>
                    <div className={cx(styles.tb_line_item, styles.w448)}>行情资讯标题</div>
                    <div className={cx(styles.tb_line_item, styles.w160)}>发布时间</div>
                    <div className={cx(styles.tb_line_item, styles.w128)}>操作</div>
                  </div>
                  {information.hotList &&
                    information.hotList.map((item, index) => (
                      <div className={cx(styles.tb_line)} key={`tb_line_${index}`}>
                        <div className={cx(styles.tb_line_item, styles.w448)}>
                          <div className={styles.information_title}>{item.title}</div>
                        </div>
                        <div className={cx(styles.tb_line_item, styles.w160)}>
                          {moment(item.createTime).format('YYYY/MM/DD HH:mm')}
                        </div>
                        <div className={cx(styles.tb_line_item, styles.w128)}>
                          <div className={styles.tb_line_item_btn_group}>
                            <Button
                              type="link"
                              style={{ marginLeft: -12 }}
                              onClick={() => handleDeleteInformationItem(item, 'hotList')}
                            >
                              删除
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </TabPane>
              </Tabs>
              <Drawer
                title="选择行情资讯"
                width={800}
                onClose={() => setInformationDrawerVisible(false)}
                visible={informationDrawerVisible}
              >
                <SettingPanel
                  confirmLoading={confirmLoading}
                  onCancel={() => setInformationDrawerVisible(false)}
                  onOK={handleInformationConfirmAdd}
                >
                  <div style={{ margin: -8 }}>
                    <div className={styles.form_line} style={{ marginBottom: 0 }}>
                      <Select
                        style={{ width: 128 }}
                        allowClear
                        placeholder="请选择"
                        value={columnId}
                        onChange={(value) => setColumnId(value)}
                      >
                        {columnList &&
                          columnList.map((item) => (
                            <Select.Option value={item.id} key={`column_item_${item.id}`}>
                              {item.name}
                            </Select.Option>
                          ))}
                      </Select>
                      <Button style={{ marginLeft: 16 }} onClick={() => handleSearchByColumnId()}>
                        搜索
                      </Button>
                    </div>
                    <StandardFormTable
                      columns={columns}
                      autoScrollX
                      request={(params) => fetchData(params)}
                      rowKey="id"
                      actionRef={ref}
                      isRowSelection
                    />
                  </div>
                </SettingPanel>
              </Drawer>
            </>
          </TabPane>
        </Tabs>
      </div>
    </SettingPanel>
  )
}

export default PlatformInformation
