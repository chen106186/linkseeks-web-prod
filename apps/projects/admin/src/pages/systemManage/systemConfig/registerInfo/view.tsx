import React, { useRef, useState, useEffect } from 'react'
import { Button, Spin, Drawer, message, Modal, Tooltip, Space } from '@linkseeks/ui'
import { QuestionCircleIcon, PlusCircleIcon } from '@linkseeks/icons'
import { FormEffectHooks, createAsyncFormActions, FormPath } from '@apps/formily'
import { drawerFormSchema, listFieldDrawerFormSchema } from './schema'
import DeleteItem from '@/components/DeleteItem'
import NiceForm from '@/components/NiceForm'
import { PageHeaderWrapper, StandardFormTable, ArrayFormTable, AuthButton, StatusAuthButton } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import ControlRegisterDrawer from './components/ControlRegisterDrawer'
import {
  getMemberRegisterConfigGetRegisterConfig,
  getMemberRegisterConfigGetRegisterConfigById,
  postMemberRegisterConfigChangeStatus,
  postMemberRegisterConfigDelete,
} from '@apps/apis'
import { SwitchlanguageIcon } from '@linkseeks/icons'

export const LanguagePreviewRender = (props) => {
  const { languageList = [], defaultLocale = 'zh-CN' } = props

  const defaultText = Array.isArray(languageList)
    ? languageList.find((v) => v.language === defaultLocale)?.value || ''
    : ''

  const renderTitle = Array.isArray(languageList)
    ? languageList?.map((v) => (
        <div key={v.language}>
          {v.language} - {v.value}
        </div>
      ))
    : null

  return (
    <Tooltip placement="rightBottom" title={renderTitle}>
      <Space>
        <span>{defaultText}</span>
        <SwitchlanguageIcon size={16} />
      </Space>
    </Tooltip>
  )
}

const View = () => {
  const controlRef = useRef<any>({})
  const tableRef = useRef<any>({})
  const tagRender = (flag) => {
    const tagStyle = flag ? { color: '#EF3346', background: '#FFEBE6' } : { color: '#5C626A', background: '#F4F5F7' }
    return (
      <div style={{ display: 'inline-block', padding: '0 4px', fontSize: 12, borderRadius: 4, ...tagStyle }}>
        {flag ? '是' : '否'}
      </div>
    )
  }

  const handleStatusChange = (record) => {
    postMemberRegisterConfigChangeStatus({
      id: record.id,
      fieldStatus: record.fieldStatus === 1 ? 0 : 1,
    }).then(() => {
      tableRef.current.reload()
    })
  }

  const handleModifyRecord = async (record) => {
    handleRecord(record, 'edit')
  }

  const handlePreview = async (record) => {
    handleRecord(record, 'preview')
  }

  const handleRecord = async (record, status) => {
    const { data } = await getMemberRegisterConfigGetRegisterConfigById({
      id: record.id,
    })
    controlRef.current.setAppStatus(status)
    controlRef.current.toggle(data)
  }
  const deleteItem = async (record) => {
    await postMemberRegisterConfigDelete({
      id: record.id,
    } as any)
    tableRef.current.reload()
  }

  const columns: any[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
    },
    {
      title: '字段编码',
      dataIndex: 'fieldName',
      key: 'fieldName',
      className: 'commonPickColor',
      fixed: 'left',
      searchField: {
        main: true,
      },
      render: (text, record) => (
        <Button type="link" onClick={() => handlePreview(record)}>
          {text}
        </Button>
      ),
    },
    {
      title: '字段名称',
      dataIndex: 'fieldLocalName',
      key: 'fieldLocalName',
      fixed: 'left',
      render: (text, record) => <LanguagePreviewRender languageList={text} />,
    },
    {
      title: '字段类型',
      dataIndex: 'fieldTypeName',
      key: 'fieldTypeName',
    },
    {
      title: '字段长度',
      dataIndex: 'fieldLength',
      key: 'fieldLength',
    },
    {
      title: '是否可以为空',
      dataIndex: 'fieldEmpty',
      key: 'fieldEmpty',
      render: (text) => (text === 1 ? '是' : '否'),
    },
    {
      title: '分组名称',
      dataIndex: 'fieldGroupName',
      key: 'fieldGroupName',
      searchField: 'Input',
      render: (text, record) => <LanguagePreviewRender languageList={text} />,
    },
    {
      title: '排序',
      dataIndex: 'fieldOrder',
      key: 'fieldOrder',
    },
    {
      title: '变更是否需审核',
      dataIndex: 'validate',
      key: 'validate',
      render: (text) => tagRender(text),
    },
    {
      title: '搜索项',
      dataIndex: 'allowSelect',
      key: 'allowSelect',
      render: (text) => tagRender(text),
    },
    {
      title: '状态',
      dataIndex: 'fieldStatus',
      key: 'fieldStatus',
      fixed: 'right',
      render: (fieldStatus: number, record: any) => (
        <StatusAuthButton
          title={`确认要把当前字段从${fieldStatus === 1 ? '”有效”' : '”无效”'}状态改为${
            fieldStatus === 1 ? '”无效”' : '”有效”'
          }状态`}
          fieldNames="fieldStatus"
          handleCancel={() => {}}
          handleConfirm={() => handleStatusChange(record)}
          record={record}
        />
      ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      fixed: 'right',
      render: (text: any, record: any) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {record.fieldStatus === 0 ? (
              <Space>
                <AuthButton type="custom" code="edit">
                  <Button type="link" onClick={() => handleModifyRecord(record)}>
                    编辑
                  </Button>
                </AuthButton>
                <AuthButton type="custom" code="delete">
                  <DeleteItem title="确认要删除该“无效”字段?" confirm={() => deleteItem(record)} />
                </AuthButton>
              </Space>
            ) : null}
          </div>
        )
      },
    },
  ]
  return (
    <PageHeaderWrapper
      extra={
        <AuthButton type="custom" code="add">
          <Button
            type="primary"
            icon={<PlusCircleIcon />}
            onClick={() => {
              controlRef.current.setAppStatus('add')
              controlRef.current.form.resetFields()
              controlRef.current.toggle()
            }}
          >
            新增会员注册资料
          </Button>
        </AuthButton>
      }
    >
      <StandardFormTable
        columns={columns}
        actionRef={tableRef}
        autoScrollX
        rowKey="id"
        request={getMemberRegisterConfigGetRegisterConfig}
      />
      <ControlRegisterDrawer ref={controlRef} tableRef={tableRef} />
    </PageHeaderWrapper>
  )
}

export default View
