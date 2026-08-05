/** 消息模板设置 */
import React, { Fragment, useState, useRef, useMemo, useEffect } from 'react'
import { Button, message, Popconfirm, Table, Tag, Card, Switch, Select } from 'antd'
import { AuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { formatTimeString } from '@/utils'
import {
  getPayWxAppTempList,
  getSupportPlatformTmplMangePage,
  getSupportSmsGetSmsTemplateList,
  postSupportPlatformTmplMangeSave,
} from '@apps/apis'
import { Form, Input, Radio, Modal, Space } from '@linkseeks/ui'
import { Link } from '@linkseeks/router-core'

const MessageTemplate: React.FC = () => {
  const ref = useRef({} as ActionType)
  const [tmplData, setTmplData] = useState<any>([])
  const [tmplList, setTmplList] = useState<any>([])

  useEffect(() => {
    getSupportPlatformTmplMangePage({}).then((res) => {
      if (res.code === 1000) {
        console.log(res.data.data)
        setTmplData(res.data.data)
      }
    })
    getPayWxAppTempList({}).then((res) => {
      if (res.code === 1000) {
        const tmpTmplList = []
        res.data.forEach((temp) => {
          tmpTmplList.push({
            value: temp.id,
            label: temp.title,
          })
        })
        setTmplList(tmpTmplList)
      }
    })
    getSupportSmsGetSmsTemplateList({}).then((res) => {
      if (res.code === 1000) {
        console.log(res.data)
      }
    })
  }, [])

  const handleSmsStatusChange = (id, type, tempId) => {
    postSupportPlatformTmplMangeSave({
      id: id,
      type: type,
      tempId: tempId,
    }).then((res) => {
      if (res.code === 1000) {
        ref.current.reload()
      }
    })
  }

  const fetchData = async (params: any) => {
    const { ...arg } = params
    const payload = { ...arg }

    return new Promise((resolve) => {
      getSupportPlatformTmplMangePage({ ...payload }).then((res) => {
        if (res.code === 1000) {
          resolve(res.data)
        }
      })
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
      key: 'wxAppTmplId',
      dataIndex: 'wxAppTmplId',
      width: 300,
      render: (text, record, index) => (
        <Select
          value={record.wxAppTmplId}
          style={{ width: 250 }}
          options={tmplList}
          onChange={(value: string) => {
            console.log(record.id)
            console.log(value)
            handleSmsStatusChange(record.id, 1, value)
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
