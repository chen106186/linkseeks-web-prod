/** 平台营销活动查询 */
import React, { Fragment, useState, useRef } from 'react'
import { Button } from 'antd'
import StatusTag from '@/components/StatusTag'
import { EyeAuthButton, AuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { formatTimeString } from '@/utils'
import ModalBox from '../components/modalBox'
import DateModalLayout from '../components/dateModal'
import {
  getMarketingPlatformActivityPage,
  postMarketingPlatformActivityCancel,
  postMarketingPlatformActivityRestart,
  postMarketingPlatformActivityStop,
} from '@apps/apis'
import useSelectOptions from './services/hooks/useSelectOptions'
import moment from 'moment'

type dateInfoProps = {
  /** id */
  id: number
  /** 标题 */
  title: string
  /** 接口 */
  fieldApi: any
}

const MarketingSearch: React.FC = () => {
  const ref = useRef({} as ActionType)
  const [visible, setVisible] = useState<boolean>(false)
  const [rowParams, setRowParams] = useState<any>({})
  const [dateInfo, setDateInfo] = useState<dateInfoProps>()
  const [dateVisible, setDateVisible] = useState<boolean>(false)
  const selectData = useSelectOptions()

  /** 修改时间 */
  const handleUpdateInterval = (data: any) => {
    setVisible(true)
    setRowParams(data)
  }

  const Api = (operate) => {
    switch (operate) {
      case 'cancel':
        return postMarketingPlatformActivityCancel
      case 'stop':
        return postMarketingPlatformActivityStop
      case 'start':
        return postMarketingPlatformActivityRestart
    }
  }

  const handleOperate = (record, operate) => {
    setDateInfo({
      id: record.id,
      title: operate === 'cancel' ? '取消' : operate === 'stop' ? '终止' : '启动',
      fieldApi: Api(operate),
    })
    setDateVisible(true)
  }

  const columns: RecordColumns<any>[] = [
    {
      title: '活动ID',
      key: 'id',
      dataIndex: 'id',
      fixed: 'left',
      width: 60,
      searchField: {
        type: 'InputNumber',
      },
    },
    {
      title: '活动名称',
      key: 'activityName',
      dataIndex: 'activityName',
      fixed: 'left',
      searchField: {
        main: true,
      },
      render: (text, record) => (
        <EyeAuthButton url={`/marketingManage/marketing/marketingSearch/detail?id=${record.id}`}>{text}</EyeAuthButton>
      ),
    },
    {
      title: '活动类型',
      key: 'activityType',
      dataIndex: 'activityType',
      searchField: 'Select',
      render: (_text, record) => <>{record.activityTypeName}</>,
    },
    {
      title: '活动开始时间',
      key: 'startTime',
      dataIndex: 'startTime',
      searchField: {
        type: 'DateRange',
        title: '发布时间',
        name: ['startTime', 'endTime'],
        placeholder: ['开始时间', '结束时间'],
      },
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: '活动结束时间',
      key: 'endTime',
      dataIndex: 'endTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: '报名开始时间',
      key: 'signUpStartTime',
      dataIndex: 'signUpStartTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: '报名结束时间',
      key: 'signUpEndTime',
      dataIndex: 'signUpEndTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: '外部状态',
      key: 'outerStatus',
      dataIndex: 'outerStatus',
      searchField: 'Select',
      render: (_text, record) => <StatusTag type="danger" title={record.outerStatusName} />,
    },
    {
      title: '内部状态',
      key: 'innerStatus',
      dataIndex: 'innerStatus',
      searchField: 'Select',
      render: (_text, record) => <StatusTag type="danger" title={record.innerStatusName} />,
    },
    {
      title: '操作',
      key: 'state',
      dataIndex: 'state',
      fixed: 'right',
      render: (_text, record) => (
        <Fragment>
          <AuthButton type="custom" code="update">
            {record.update && (
              <Button type="link" onClick={() => handleUpdateInterval(record)}>
                修改时间
              </Button>
            )}
          </AuthButton>
          <AuthButton type="custom" code="cancel">
            {record.cancel && (
              <Button type="link" onClick={() => handleOperate(record, 'cancel')}>
                取消
              </Button>
            )}
          </AuthButton>
          <AuthButton type="custom" code="stop">
            {record.stop && (
              <Button type="link" onClick={() => handleOperate(record, 'stop')}>
                终止
              </Button>
            )}
          </AuthButton>
          <AuthButton type="custom" code="restart">
            {record.restart && (
              <Button type="link" onClick={() => handleOperate(record, 'start')}>
                重新启动
              </Button>
            )}
          </AuthButton>
        </Fragment>
      ),
    },
  ]

  const handleConfirm = () => {
    setVisible(false)
    ref.current.reload()
  }

  const handleOnSubmit = () => {
    setDateVisible(false)
    setDateInfo({} as dateInfoProps)
    ref.current.reload()
  }

  const fetchData = async (params: any) => {
    const { startTime, endTime, ...arg } = params
    const payload = { ...arg }
    if (startTime) {
      payload.startTime = moment(startTime).format('YYYY-MM-DD')
    }

    if (endTime) {
      payload.endTime = moment(endTime).format('YYYY-MM-DD')
    }

    return new Promise((resolve) => {
      getMarketingPlatformActivityPage({ ...payload }).then((res) => {
        if (res.code === 1000) {
          resolve(res.data)
        }
      })
    })
  }

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        columns={columns}
        autoScrollX
        request={(params) => fetchData(params)}
        rowKey="id"
        actionRef={ref}
        searchSelectMaps={selectData}
      />
      <ModalBox visible={visible} params={rowParams} onCancel={() => setVisible(false)} onConfirm={handleConfirm} />
      <DateModalLayout
        id={dateInfo?.id}
        title={dateInfo?.title}
        visible={dateVisible}
        fieldApi={dateInfo?.fieldApi}
        onCancel={() => setDateVisible(false)}
        onSubmit={handleOnSubmit}
      />
    </PageHeaderWrapper>
  )
}
export default MarketingSearch
