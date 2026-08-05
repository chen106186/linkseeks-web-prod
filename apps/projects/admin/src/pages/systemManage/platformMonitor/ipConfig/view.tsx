import React, { Fragment, useMemo } from 'react'
import { Button, Popconfirm, Space } from '@linkseeks/ui'
import { RecordColumns, StandardFormTable } from '@apps/components'
import {
  GetManageIpMonitorPageResponse,
  GetManageIpMonitorPageResponseDetail,
  getManageIpMonitorPage,
} from '@apps/apis'
import useIPList from './services/useIPList'
import IpModal from './components/IpModal'

const IPList: React.FC = () => {
  const {
    modalVisible,
    monitorType,
    operateType,
    modalForm,
    modalConfirmLoading,
    tableRef,
    setOperateType,
    setMonitorType,
    setModalVisible,
    modalConfirm,
    deleteIpConfig,
  } = useIPList()

  const tabsItems = [
    {
      key: '1',
      label: '白名单',
      value: '1',
    },
    {
      key: '2',
      label: '黑名单',
      value: '1',
    },
  ]

  const columns: RecordColumns<GetManageIpMonitorPageResponseDetail>[] = [
    {
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip',
      searchField: 'Search',
      width: 200,
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      ellipsis: false,
    },
    {
      title: '添加时间',
      dataIndex: 'opTime',
      key: 'opTime',
      width: 200,
    },
    {
      title: '添加方式',
      dataIndex: 'addModeMsg',
      key: 'addModeMsg',
      width: 160,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      fixed: 'right',
      width: 160,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setOperateType('edit')
              setModalVisible(true)
              modalForm.setFieldsValue(record)
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="是否确认要删除？"
            onConfirm={async () => await deleteIpConfig(record.id)}
            okText="是"
            cancelText="否"
          >
            <Button type="link">删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const fetchData = async (params) => {
    const requestParam = { ...params }
    if (!requestParam.monitorType) {
      requestParam.monitorType = 1
    }
    setMonitorType(Number(requestParam.monitorType))
    const res = await getManageIpMonitorPage(requestParam)
    if (res.code === 1000) {
      return res.data
    }
    return { data: [], totalCount: 0 }
  }

  const modalTitle = useMemo(() => {
    let operateText = operateType === 'add' ? '新增' : '编辑'
    let title = monitorType === 1 ? 'IP白名单' : 'IP黑名单'
    return operateText + title
  }, [monitorType, operateType])

  return (
    <Fragment>
      <StandardFormTable
        actionRef={tableRef}
        type="tabs"
        tabsItems={tabsItems}
        tabsKey="monitorType"
        tabsDefaultAll={false}
        request={(params) => fetchData(params)}
        columns={columns}
        searchButtons={[
          {
            children: '添加',
            type: 'primary',
            icon: 'add',
            onClick() {
              setOperateType('add')
              setModalVisible(true)
            },
          },
        ]}
      />
      <IpModal
        visible={modalVisible}
        setVisible={setModalVisible}
        monitorType={monitorType}
        title={modalTitle}
        form={modalForm}
        operateType={operateType}
        confirmLoading={modalConfirmLoading}
        onOk={modalConfirm}
      />
    </Fragment>
  )
}

export default IPList
