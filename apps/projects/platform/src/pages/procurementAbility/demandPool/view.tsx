import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Card, Space, Button, Tabs, TreeSelect, Dropdown, Menu, Modal, message } from 'antd'
import { CaretDownOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import StandardTable from '@/components/StandardTable'
import { PageHeaderWrapper } from '@apps/components'
import { demandPoolColumns, demandPoolSchema } from '../constants/demandPool'
import { useCustomerCategoriesBusinessEffects } from '@/formSchema/effects/useCustomerCategoriesBusinessEffects'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import Submit from '@/components/NiceForm/components/Submit'
import NiceForm from '@/components/NiceForm'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'
import { createFormActions } from '@apps/formily'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { dupliArr } from '@/utils'
import { getPurchaseRequisitionDemandPoolCountList, postPurchaseRequisitionDemandPoolPage } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'

const { TabPane } = Tabs

// 采购工作台

export interface DemandPoolProps {}

const formActions = createFormActions()

const DemandPool: React.FC<DemandPoolProps> = () => {
  const intl = useIntl()
  const ref = useRef<any>({})
  const fetchParams = useRef<any>({})
  const [demandTabs, setDemandTabs] = useState<any>()
  const [listStatus, setListStatus] = useState<number>(1)

  const [selectRow, selectRowFns] = useRowSelectionTable({
    customKey: 'id',
  })

  const fetchTableData = async (params) => {
    const { data } = await postPurchaseRequisitionDemandPoolPage(params)
    message.destroy()
    return data
  }

  useEffect(() => {
    getPurchaseRequisitionDemandPoolCountList().then((res) => {
      if (res.code === 1000) {
        setDemandTabs(res.data)
      }
    })
  }, [])

  useEffect(() => {
    selectRowFns.setSelectRow([])
    selectRowFns.setSelectedRowKeys([])
    ref.current?.reload && ref.current?.reload?.()
  }, [listStatus])

  const loadingTableData = (params) => {
    const _params = { ...params, status: listStatus }
    fetchParams.current = _params
    return fetchTableData(_params)
  }

  const _returnBaseData = (data: any, type: string) => {
    const _baseData = {}
    _baseData['vendorMemberId'] = data['vendorMemberId']
    _baseData['vendorMemberName'] = data['vendorMemberName']
    _baseData['vendorRoleId'] = data['vendorRoleId']
    _baseData['deliveryMethod'] = data['deliveryMethod']
    _baseData['deliveryMethodName'] = data['deliveryMethodName']
    _baseData['deliveryType'] = data['deliveryType']
    _baseData['deliveryTypeName'] = data['deliveryTypeName']
    _baseData['deliveryAddressId'] = data['deliveryAddressId']
    _baseData['deliveryAddress'] = data['deliveryAddress']
    if (type === '2') {
      //转请购单订单
      _baseData['requisitionNo'] = data['requisitionNo']
      _baseData['requisitionId'] = data['purchaseRequisitionId']
    }
    return _baseData
  }

  const _toMixFunc = (type: string, baseData: any, list: any[]) => {
    console.log(baseData)
    switch (type) {
      case '1': //合同
        history.push('/contract/manage/addList/add', {
          demandPoolData: baseData,
          demandPoolRows: list,
        })
        break
      case '2': //订单
        history.push('/orderAbility/purchaseOrder/readyAddRequisitionOrder/add', {
          demandPoolData: baseData,
          demandPoolRows: list,
        })
        break
    }
  }

  const handleMenuClick = (e: any, record: any) => {
    const _list = [{ ...record }]
    const _data = { ...record }
    _toMixFunc(e.key, _returnBaseData(_data, e.key), _list)
  }

  const _topMixBtns = (type: string) => {
    if (selectRowFns.selectRow.length === 1) {
      _toMixFunc(type, _returnBaseData(selectRowFns.selectRow[0], type), selectRowFns.selectRow)
    } else {
      let _vendorMemberId = []
      let _deliveryMethod = []
      let _deliveryType = []
      let _deliveryAddressId = []
      let _requisitionNo = []
      selectRowFns.selectRow.forEach((item) => {
        _vendorMemberId.push(item.vendorMemberId)
        _deliveryMethod.push(item.deliveryMethod)
        _deliveryType.push(item.deliveryType)
        _deliveryAddressId.push(item.deliveryAddressId)
        _requisitionNo.push(item.requisitionNo)
      })
      _vendorMemberId = dupliArr(_vendorMemberId)
      _deliveryMethod = dupliArr(_deliveryMethod)
      _deliveryType = dupliArr(_deliveryType)
      _deliveryAddressId = dupliArr(_deliveryAddressId)
      _requisitionNo = dupliArr(_requisitionNo)
      if (type === '2' && _requisitionNo.length > 1) {
        message.error(intl.formatMessage({ id: 'purchaseAbility.demandPool.createMessage' }))
        return
      }
      const _baseData = {}
      if (_vendorMemberId.length === 1) {
        _baseData['vendorMemberId'] = selectRowFns.selectRow[0]['vendorMemberId']
        _baseData['vendorMemberName'] = selectRowFns.selectRow[0]['vendorMemberName']
        _baseData['vendorRoleId'] = selectRowFns.selectRow[0]['vendorRoleId']
      }
      if (_deliveryMethod.length === 1) {
        _baseData['deliveryMethod'] = selectRowFns.selectRow[0]['deliveryMethod']
        _baseData['deliveryMethodName'] = selectRowFns.selectRow[0]['deliveryMethodName']
      }
      if (_deliveryType.length === 1) {
        _baseData['deliveryType'] = selectRowFns.selectRow[0]['deliveryType']
        _baseData['deliveryTypeName'] = selectRowFns.selectRow[0]['deliveryTypeName']
      }
      if (_deliveryAddressId.length === 1) {
        _baseData['deliveryAddressId'] = selectRowFns.selectRow[0]['deliveryAddressId']
        _baseData['deliveryAddress'] = selectRowFns.selectRow[0]['deliveryAddress']
      }
      if (type === '2') {
        //转请购单订单
        _baseData['requisitionNo'] = selectRowFns.selectRow[0]['requisitionNo']
        _baseData['requisitionId'] = selectRowFns.selectRow[0]['purchaseRequisitionId']
      }
      if (
        _vendorMemberId.length > 1 ||
        _deliveryMethod.length > 1 ||
        _deliveryType.length > 1 ||
        _deliveryAddressId.length > 1
      ) {
        Modal.confirm({
          title: intl.formatMessage({ id: 'material.pendingAdd.list.submit.tips', defaultMessage: '提交提醒' }),
          icon: <ExclamationCircleOutlined />,
          content: intl.formatMessage({ id: 'purchaseAbility.demandPool.createMessage.error' }),
          okText: intl.formatMessage({ id: 'contract.purchase.continue' }),
          cancelText: intl.formatMessage({ id: 'common.button.cancel' }),
          onOk: () => {
            _toMixFunc(type, _baseData, selectRowFns.selectRow)
          },
        })
      } else {
        _toMixFunc(type, _baseData, selectRowFns.selectRow)
      }
    }
  }

  const secondColumns = () => {
    const alreadyColumns = demandPoolColumns()
    if (alreadyColumns) {
      return alreadyColumns.concat(
        listStatus === 1
          ? [
              {
                title: intl.formatMessage({
                  id: 'purchaseRequisition.caozuo',
                  defaultMessage: '操作',
                }),
                align: 'center',
                dataIndex: 'ctl',
                key: 'ctl',
                width: 128,
                fixed: 'right',
                render: (_, record) =>
                  listStatus === 1 && (
                    <Dropdown
                      overlay={
                        <Menu onClick={(e) => handleMenuClick(e, record)}>
                          {AuthUrl('toContract') && (
                            <Menu.Item key="1">
                              {intl.formatMessage({ id: 'purchaseAbility.demandPool.btn.2' })}
                            </Menu.Item>
                          )}
                          {AuthUrl('toOrder') && (
                            <Menu.Item key="2">
                              {intl.formatMessage({ id: 'purchaseAbility.demandPool.btn.3' })}
                            </Menu.Item>
                          )}
                          {AuthUrl('toInquiry') && (
                            <Menu.Item key="3">
                              {intl.formatMessage({ id: 'purchaseAbility.demandPool.btn.4' })}
                            </Menu.Item>
                          )}
                          {AuthUrl('toBidding') && (
                            <Menu.Item key="4">
                              {intl.formatMessage({ id: 'purchaseAbility.demandPool.btn.5' })}
                            </Menu.Item>
                          )}
                          {AuthUrl('toBidding2') && (
                            <Menu.Item key="5">
                              {intl.formatMessage({ id: 'purchaseAbility.demandPool.btn.6' })}
                            </Menu.Item>
                          )}
                        </Menu>
                      }
                    >
                      <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                        {intl.formatMessage({ id: 'purchaseRequisition.caozuo', defaultMessage: '操作' })}{' '}
                        <CaretDownOutlined />
                      </a>
                    </Dropdown>
                  ),
              },
            ]
          : [],
      )
    }
  }

  const ControllerBtns = (
    <Space>
      <AuthButton type="custom" code={'import'}>
        <Button type="primary" icon={<PlusOutlined />}>
          {intl.formatMessage({ id: 'purchaseAbility.demandPool.btn.1' })}
        </Button>
      </AuthButton>
      <AuthButton type="custom" code={'toContract'}>
        <Button
          type="default"
          disabled={selectRowFns.selectRow.length <= 0}
          onClick={() => {
            _topMixBtns('1')
          }}
        >
          {intl.formatMessage({ id: 'purchaseAbility.demandPool.btn.2' })}
        </Button>
      </AuthButton>
      <AuthButton type="custom" code={'toOrder'}>
        <Button
          type="default"
          disabled={selectRowFns.selectRow.length <= 0}
          onClick={() => {
            _topMixBtns('2')
          }}
        >
          {intl.formatMessage({ id: 'purchaseAbility.demandPool.btn.3' })}
        </Button>
      </AuthButton>
      <AuthButton type="custom" code={'toInquiry'}>
        <Button
          type="default"
          disabled={selectRowFns.selectRow.length <= 0}
          onClick={() => {
            _topMixBtns('3')
          }}
        >
          {intl.formatMessage({ id: 'purchaseAbility.demandPool.btn.4' })}
        </Button>
      </AuthButton>
      <AuthButton type="custom" code={'toBidding'}>
        <Button
          type="default"
          disabled={selectRowFns.selectRow.length <= 0}
          onClick={() => {
            _topMixBtns('4')
          }}
        >
          {intl.formatMessage({ id: 'purchaseAbility.demandPool.btn.5' })}
        </Button>
      </AuthButton>
      <AuthButton type="custom" code={'toBidding2'}>
        <Button
          type="default"
          disabled={selectRowFns.selectRow.length <= 0}
          onClick={() => {
            _topMixBtns('5')
          }}
        >
          {intl.formatMessage({ id: 'purchaseAbility.demandPool.btn.6' })}
        </Button>
      </AuthButton>
    </Space>
  )

  const onChange = (key: string) => {
    setListStatus(Number(key))
  }

  const _renderTabsTitle = (status: string) => {
    return intl.formatMessage({ id: `purchaseAbility.demandPool.tabs.${status}` })
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <Tabs defaultActiveKey="1" onChange={onChange}>
          {demandTabs?.map((item, index) => (
            <TabPane
              tab={`${_renderTabsTitle(item.status)}${item.status ? `(${item.count})` : ''}`}
              key={item.status}
            ></TabPane>
          ))}
        </Tabs>
        <StandardTable
          fetchTableData={(params) => loadingTableData(params)}
          columns={secondColumns()}
          currentRef={ref}
          rowSelection={selectRow}
          rowKey="id"
          controlRender={
            <NiceForm
              key="DemandPool"
              actions={formActions}
              onSubmit={(values) => ref.current.reload(values)}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'productNo', FORM_FILTER_PATH)
                // 初始化品类数据
                useCustomerCategoriesBusinessEffects(
                  $,
                  actions,
                  {
                    fieldName: 'categoryIds',
                  },
                  'props.x-component-props.treeData',
                )
              }}
              schema={demandPoolSchema()}
              components={{
                DateRangePickerUnix,
                TreeSelect,
                Submit,
                controllerBtns: () => (listStatus === 1 ? ControllerBtns : null),
              }}
            />
          }
          tableProps={{
            scroll: {
              x: '100%',
            },
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

DemandPool.defaultProps = {}

export default DemandPool
