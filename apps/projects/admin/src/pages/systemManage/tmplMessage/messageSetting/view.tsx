/** 消息模板设置 */
import React, { Fragment, useState, useRef, useMemo, useEffect } from 'react'
import { Button, message, Popconfirm, Table, Tag, Card, Switch } from 'antd'
import { AuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { formatTimeString } from '@/utils'
import {
  getSupportPlatformTmplMangePage,
  getSupportPlatformTmplStatusPage,
  postSupportPlatformTmplMangeSave,
  postSupportPlatformTmplStatusPage,
  postSupportPlatformTmplStatusUpdate,
  postSupportPlatformUpdateTmplStatus,
} from '@apps/apis'
import { Form, Input, Radio, Modal, Space } from '@linkseeks/ui'
import { Link } from '@linkseeks/router-core'

const MessageTemplate: React.FC = () => {
  const ref = useRef({} as ActionType)
  const [tmplData, setTmplData] = useState<any>([])

  const fetchData = async (params: any) => {
    const { ...arg } = params
    const payload = { ...arg }

    return new Promise((resolve) => {
      getSupportPlatformTmplStatusPage({ ...payload }).then((res) => {
        if (res.code === 1000) {
          resolve(res.data)
        }
      })
    })
  }

  const handleWxAppStatusChange = (id, type, status) => {
    postSupportPlatformTmplStatusUpdate({
      tmplManageId: id,
      type: type,
      status: status,
    }).then((res) => {
      if (res.code === 1000) {
        ref.current.reload()
      }
    })
  }

  const columns: RecordColumns<any>[] = [
    {
      title: '所属模块',
      key: 'module',
      dataIndex: 'module',
      width: 150,
    },
    {
      title: '消息类型',
      key: 'keyword',
      dataIndex: 'keyword',
      width: 200,
      searchField: 'Input',
      render: (_text, record) => <>{record.type}</>,
    },
    {
      title: '推送节点',
      key: 'description',
      dataIndex: 'description',
    },
    {
      title: '微信小程序消息',
      key: 'wxAppTmplStatus',
      dataIndex: 'wxAppTmplStatus',
      width: 300,
      render: (text, record, index) => (
        <Switch
          checked={record.wxAppTmplStatus} // 或 true/false，看你的值类型
          onChange={(checked) => {
            // 调用更新逻辑，例如：
            const newStatus = checked ? 1 : 0
            handleWxAppStatusChange(record.id, 1, newStatus)
          }}
        />
      ),
    },
  ]

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardFormTable columns={columns} autoScrollX request={(params) => fetchData(params)} actionRef={ref} />
      </Card>
    </PageHeaderWrapper>
  )
}
export default MessageTemplate
