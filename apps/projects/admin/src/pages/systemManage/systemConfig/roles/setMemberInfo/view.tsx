import React, { useState, useEffect, useRef } from 'react'
import { Row, Col, Button, Space, Tag, Modal } from 'antd'
import {
  getMemberMemberRoleConfigGetMemberRoleById,
  getMemberRegisterConfigGetRegisterConfig,
  getMemberMemberRoleConfigGetRegisterConfigByMemberRoleId,
  postMemberMemberRoleConfigSetRoleConfig,
} from '@apps/apis'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons'
import { StandardFormTable } from '@apps/components'
import { ArrayTable } from '@apps/formily'
import { findItemAndDelete } from '@/utils'
import { ModalFormTable, ModalFormTableRef } from '@apps/components'
import type { RecordColumns } from '@apps/components/src/web/StandardFormTable/types'
import { history } from '@linkseeks/router-manager'
import NiceForm from '@/components/NiceForm'
import { modelFormSchema } from '../schema'
import selfStyle from './index.less'
import { fieldTypeEnumMapper } from '../constants'
import { LanguagePreviewRender } from '../../registerInfo/view'
import { unionBy } from 'lodash'

const SetMemberAuth: React.FC<{}> = () => {
  const { pageStatus, id } = usePageStatus()
  const modalRef = ModalFormTable.useTableRef()

  const sortOrder = (list: any[]) => {
    if (list) {
      return list.sort((a, b) => (b.fieldOrder > a.fieldOrder ? 1 : -1))
    }
    return []
  }

  const fetchTableData = async () => {
    const res = await getMemberMemberRoleConfigGetRegisterConfigByMemberRoleId({
      id,
    })
    return sortOrder(res.data)
  }

  const fetchData = async (params) => {
    const data = await getMemberRegisterConfigGetRegisterConfig({
      ...params,
      status: 1,
    })
    return data.data
  }

  const [fieldData, setFieldData] = useState<any>([])
  const [addVisible, setAddVisible] = useState(false)
  const [editData, setEditData] = useState<any | undefined>(undefined)
  const fieldDataRef = useRef<any>({
    fieldData,
  })
  fieldDataRef.current.fieldData = fieldData

  const handlePreview = (record) => {
    setEditData(record)
    setAddVisible(true)
  }

  // 会员选择后的表格
  const handleDeleteTable = (id) => {
    setFieldData(sortOrder(findItemAndDelete(fieldDataRef.current.fieldData, id)))
  }

  const columns: any[] = [
    {
      title: '字段ID',
      dataIndex: 'id',
      align: 'left',
      key: 'id',
      width: 96,
      fixed: 'left',
    },
    {
      title: '字段编码',
      dataIndex: 'fieldName',
      align: 'left',
      key: 'fieldName',
      width: 224,
      className: 'commonPickColor',
      fixed: 'left',
      render: (text, record) => (
        <>
          <span style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handlePreview(record)}>
            {text}
          </span>
        </>
      ),
      // render: (text: any, record: any) => <EyeAuthButton handleClick={handlePreview.bind(null, record)} type='button'>{text}</EyeAuthButton>
    },
    {
      title: '字段名称',
      align: 'left',
      dataIndex: 'fieldLocalName',
      key: 'fieldLocalName',
      width: 160,
      fixed: 'left',
      render: (text) => <LanguagePreviewRender languageList={text} />,
    },
    {
      title: '字段类型',
      align: 'left',
      dataIndex: 'fieldType',
      key: 'fieldType',
      width: 128,
      render: (text) => fieldTypeEnumMapper.find((type) => type.value === text)?.label,
    },
    {
      title: '字段长度',
      align: 'left',
      dataIndex: 'fieldLength',
      key: 'fieldLength',
      width: 96,
    },
    {
      title: '是否为空',
      align: 'left',
      dataIndex: 'fieldEmpty',
      key: 'fieldEmpty',
      width: 96,
      render: (_) => <Tag color={_ === 1 ? 'red' : 'blue'}>{_ === 1 ? '是' : '否'}</Tag>,
    },
    {
      title: '分组名称',
      align: 'left',
      dataIndex: 'fieldGroupName',
      key: 'fieldGroupName',
      render: (text) => <LanguagePreviewRender languageList={text} />,
      width: 160,
    },
    {
      title: '排序',
      align: 'left',
      dataIndex: 'fieldOrder',
      key: 'fieldOrder',
      width: 96,
    },
    {
      title: '操作',
      key: 'option',
      align: 'left',
      width: 128,
      fixed: 'right',
      render: (text: any, record: any) => {
        return (
          <Button type="link" onClick={() => handleDeleteTable(record.id)}>
            删除
          </Button>
        )
      },
    },
  ]

  const columnsSetMember: RecordColumns<any>[] = [
    {
      title: '字段名称',
      dataIndex: 'fieldName',
      key: 'fieldName',
      className: 'commonPickColor',
    },
    {
      title: '字段名称',
      dataIndex: 'fieldLocalName',
      key: 'fieldLocalName',
      searchField: 'Input',
      render: (text) => <LanguagePreviewRender languageList={text} />,
    },
    {
      title: '分组名称',
      dataIndex: 'fieldGroupName',
      key: 'fieldGroupName',
      render: (text) => <LanguagePreviewRender languageList={text} />,
    },
    {
      title: '字段类型',
      dataIndex: 'fieldTypeName',
      key: 'fieldTypeName',
    },
  ]

  const [formValue, setFormValue] = useState<any>(null)
  const [formData, setFormData] = useState<any>(null)

  const resetTable = () => {
    fetchTableData().then((data) => {
      setFieldData(data)
    })
  }

  useEffect(() => {
    resetTable()
  }, [])

  const handleAddTemplateConfig = async () => {
    setFormData(null)
    modalRef.current.setVisible(true)
  }

  // 会员添加弹窗控制
  const handleOkAddMember = (selectedRows: Record<string, any>[], selectionKeys: string[]) => {
    const list = [...selectedRows, ...fieldData]
    modalRef.current.setVisible(false)
    modalRef.current.clearSelection()
    setFieldData(sortOrder(unionBy(list, 'id')))
  }

  useEffect(() => {
    if (!id) return
    getMemberMemberRoleConfigGetMemberRoleById({ id }).then((res) => {
      const { data } = res
      setFormValue(data)
    })
  }, [])

  const handleSubmit = async () => {
    const keys = fieldDataRef.current.fieldData.map((v) => v.id)
    await postMemberMemberRoleConfigSetRoleConfig({
      id,
      configIds: keys,
    })

    resetTable()
  }

  const extraButtons = (
    <Space>
      <Button type="primary" disabled={pageStatus === PageStatus.PREVIEW} onClick={handleSubmit}>
        保存
      </Button>
    </Space>
  )

  const renderHeader = (
    <div>
      <div>
        <Row align="middle">
          <Col style={{ marginRight: 24 }}>
            <ArrowLeftOutlined onClick={() => history.goBack()} />
          </Col>
          <Col style={{ marginRight: 24 }} className={selfStyle.titleAvator}>
            {formValue?.roleTypeName[0]}
          </Col>
          <div className={selfStyle.fontBold18}>{formValue?.roleTypeName}</div>
        </Row>
      </div>
      <div>
        <Row style={{ marginTop: 24, fontSize: 12 }}>
          <Col span={10} offset={2}>
            会员类型：{formValue?.memberTypeName}
          </Col>
          <Col>会员角色：{formValue?.roleName}</Col>
        </Row>
      </div>
    </div>
  )

  return (
    <div className="common-scroll-wrap">
      <Row className={selfStyle.memberHeader} align="middle" justify="space-between">
        <Col flex={1}>{renderHeader}</Col>
        <Col>{extraButtons}</Col>
      </Row>
      <div
        className="common-wrapper-gray"
        style={{
          background: 'transparent',
          flex: 1,
          height: 0,
          overflowY: 'auto',
        }}
      >
        <div className="wrapper-white">
          <Button
            onClick={() => handleAddTemplateConfig()}
            icon={<PlusOutlined />}
            style={{ marginBottom: 16, marginTop: 16, width: '100%' }}
          >
            选择会员注册资料
          </Button>
          <StandardFormTable
            columns={columns}
            autoScrollX
            rowKey="id"
            tableProps={{
              pagination: false,
              dataSource: fieldData,
            }}
            request={() => ({ data: [] })}
          />
        </div>
      </div>
      <Modal
        title="查看字段"
        open={addVisible}
        onOk={() => setAddVisible(false)}
        onCancel={() => {
          setAddVisible(false)
        }}
        okText="确认"
        width={550}
        cancelText="取消"
        destroyOnClose
      >
        <NiceForm
          editable={false}
          value={editData}
          schema={modelFormSchema}
          components={{
            ArrayTable,
          }}
          previewPlaceholder="暂无"
        />
      </Modal>
      <ModalFormTable
        modalTitle="选择注册字段"
        actionRef={modalRef}
        request={fetchData}
        columns={columnsSetMember}
        getCheckboxProps={(record) => {
          return {
            disabled: fieldData.map((item) => item.id).includes(record.id),
          }
        }}
        isRowSelection
        rowSelectionType="checkbox"
        rowKey="id"
        pagination={false}
        onOk={handleOkAddMember}
      />
    </div>
  )
}

export default SetMemberAuth
