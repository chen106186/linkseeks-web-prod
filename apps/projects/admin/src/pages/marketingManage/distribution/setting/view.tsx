/** 分销配置 */
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { history } from '@linkseeks/router-manager'
import { Space } from '@linkseeks/ui'
import { useLocation, usePrompt } from '@linkseeks/router-core'
import { Form, Card, Select, Input, Checkbox, Button, Radio, message, InputNumber, Popconfirm } from 'antd'
import { Switch } from '@apps/formily'
import { usePageStatus } from '@/hooks/usePageStatus'
import { BraftEditor, EditAuthButton, PageHeaderWrapper, type RecordColumns, StandardFormTable } from '@apps/components'
import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons'
import { useEventEmitter } from '@linkseeks/hooks'
import { isEmpty } from 'lodash'
import {
  getMarketingSocialDistributionLevelPage,
  getMarketingSocialDistributionConfigBase,
  getMarketingSocialDistributionConfigRecruitment,
  postMarketingSocialDistributionConfigBase,
  postMarketingSocialDistributionConfigRecruitment,
  postMarketingSocialDistributionLevelDelete,
} from '@apps/apis'
import baseSchema from '@/pages/marketingManage/distribution/setting/schema/baseSchema.tsx'
import recruitmentSchema from '@/pages/marketingManage/distribution/setting/schema/recruitmentSchema.tsx'
import { SchemaForm, FormButtonGroup, Submit, createFormActions } from '@apps/formily'
import CustomUpload from '@/pages/contentManage/components/WrapCustomUpload'
import CustomEditor from '@/pages/contentManage/components/CustomEditor'
import { formatTimeString } from '@/utils'
import type { ActionType } from '@apps/components/src/web/StandardFormTable/types'
import ModalBox from './components/modalBox'

const actions = createFormActions()
const recruitmentActions = createFormActions()
const { TextArea } = Input
const layout: any = {
  colon: false,
  labelCol: { style: { width: '144px' } },
  labelAlign: 'left',
}

const Link = [
  { key: 'basicInfoLayout', label: '基本设置' },
  { key: 'recruitmentInfoLayout', label: '分销员招募设置' },
  { key: 'levelLayout', label: '多级分销设置' },
]

type objType = {
  lable: string
  value: number
}

const SocialDistributionSetting = (props: { isEdit?: boolean }) => {
  const { pathname } = useLocation()
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [rowParams, setRowParams] = useState<any>({})
  const [unsaved, setUnsaved] = useState<boolean>(false)
  const [isAdd, setIsAdd] = useState<boolean>(false)
  const [tabLink, setTabLink] = useState<any[]>(Link)
  const [basicInfo, setBasicInfo] = useState<any>(null)
  const [recruitmentInfo, setRecruitmentInfo] = useState<any>(null)
  const [submitRecruitmentLoading, setSubmitRecruitmentLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const ref = useRef({} as ActionType)
  usePrompt({ when: unsaved, message: '您还有未保存的内容，是否确定要离开？' })

  const handleBaseSubmit = (value) => {
    let html = ''
    const contentValue = value.distributionPerformanceRuleDescription
    if (contentValue && typeof contentValue.toHTML === 'function') {
      html = contentValue.toHTML()
    } else if (typeof contentValue === 'string') {
      html = contentValue // 已是 HTML 字符串
    } else {
      html = ''
    }

    const tempPostData = {
      enableDistributionActivity: value.enableDistributionActivity ? 1 : 0,
      staffName: value.staffName,
      shareImage: value.shareImage,
      commissionRebatePriority: value.commissionRebatePriority,
      distributionPerformanceRuleDescription: html,
    }
    setSubmitLoading(true)
    postMarketingSocialDistributionConfigBase(tempPostData).then((data) => {
      setSubmitLoading(false)
      if (data.code !== 1000) {
        message.warning('保存失败')
      }
    })
  }

  const handleRecruitmentSubmit = (value) => {
    let html = ''
    const contentValue = value.ruleDescription
    if (contentValue && typeof contentValue.toHTML === 'function') {
      html = contentValue.toHTML()
    } else if (typeof contentValue === 'string') {
      html = contentValue // 已是 HTML 字符串
    } else {
      html = ''
    }

    const tempPostData = {
      showApplicationEntry: value.showApplicationEntry ? 1 : 0,
      applicationConditions: value.applicationConditions,
      requiredSuccessfulInviteCount: value.requiredSuccessfulInviteCount,
      requiredOrderAmount: value.requiredOrderAmount,
      ruleDescription: html,
    }
    setSubmitRecruitmentLoading(true)
    postMarketingSocialDistributionConfigRecruitment(tempPostData).then((data) => {
      setSubmitRecruitmentLoading(false)
      if (data.code !== 1000) {
        message.warning('保存失败')
      }
    })
  }

  const fetchData = async (params) => {
    const payload = { ...params }
    const { data, code } = await getMarketingSocialDistributionLevelPage(payload)
    if (code === 1000) {
      return data
    }
    return {
      totalCount: 0,
      data: [],
    }
  }

  const handleConfirm = () => {
    setVisible(false)
    ref.current.reload()
  }

  const handleAddLevel = () => {
    setRowParams({})
    setVisible(true)
    setIsAdd(true)
  }

  const handleEditLevel = (record) => {
    setRowParams(record)
    setIsAdd(false)
    setVisible(true)
  }

  const handleDeleteLevel = (id) => {
    postMarketingSocialDistributionLevelDelete({
      id: id,
    }).then((data) => {
      setSubmitRecruitmentLoading(false)
      if (data.code !== 1000) {
        message.warning('保存失败')
      }
      ref.current.reload()
    })
  }

  useEffect(() => {
    getMarketingSocialDistributionConfigBase().then((res) => {
      if (res.code !== 1000) {
        return
      }
      const editorState = BraftEditor.createEditorState(res.data.distributionPerformanceRuleDescription)
      actions.setFieldValue('layout.contentLayout.distributionPerformanceRuleDescription', editorState)
      setBasicInfo(res)
    })
    getMarketingSocialDistributionConfigRecruitment().then((res) => {
      if (res.code !== 1000) {
        return
      }

      const editorState = BraftEditor.createEditorState(res.data.ruleDescription)
      recruitmentActions.setFieldValue('layout.contentLayout.ruleDescription', editorState)
      setRecruitmentInfo(res)
    })
  }, [])

  const columns: RecordColumns<any>[] = [
    {
      title: '等级值',
      key: 'level',
      dataIndex: 'level',
      fixed: 'left',
      width: 60,
    },
    {
      title: '分销员等级名称',
      key: 'levelName',
      dataIndex: 'levelName',
      render: (_text, record) => <>{record.levelName}</>,
    },
    {
      title: '业绩金额下限￥',
      key: 'minimumPerformanceAmount',
      dataIndex: 'minimumPerformanceAmount',
      render: (_text, record) => <>{record.minimumPerformanceAmount}</>,
    },
    {
      title: '到账收益额下限￥',
      key: 'minimumEarningsAmount',
      dataIndex: 'minimumEarningsAmount',
      render: (_text, record) => <>{record.minimumEarningsAmount}</>,
    },
    {
      title: '邀请人数下限',
      key: 'minimumInviteCount',
      dataIndex: 'minimumInviteCount',
      render: (_text, record) => <>{record.minimumInviteCount}</>,
    },
    {
      title: '直接佣金比例',
      key: 'directCommissionRate',
      dataIndex: 'directCommissionRate',
      render: (_text, record) => <>{(record.directCommissionRate * 100).toFixed(2) + '%'}</>,
    },
    {
      title: '佣金提成比例',
      key: 'commissionRate',
      dataIndex: 'commissionRate',
      render: (_text, record) => <>{(record.commissionRate * 100).toFixed(2) + '%'}</>,
    },
    {
      title: '操作',
      key: 'state',
      dataIndex: 'state',
      render: (_text, record) => (
        <>
          {
            <Fragment>
              <Button type="link" onClick={() => handleEditLevel(record)}>
                修改
              </Button>
              <Popconfirm
                title="确定要删除吗？"
                okText="是"
                cancelText="否"
                onConfirm={() => handleDeleteLevel(record.id)}
              >
                <Button type="link">删除</Button>
              </Popconfirm>
            </Fragment>
          }
        </>
      ),
    },
  ]

  return (
    <Fragment>
      <PageHeaderWrapper title="分销设置" isAnchor items={tabLink}>
        <Space direction="vertical" size="middle">
          <Card id="basicInfoLayout" title="基本设置">
            <SchemaForm
              value={basicInfo?.data}
              actions={actions}
              schema={baseSchema}
              onSubmit={handleBaseSubmit}
              components={{
                Input,
                Switch,
                Radio,
                'Radio.Group': Radio.Group,
                Submit,
                CustomUpload,
                CustomEditor,
              }}
            >
              <FormButtonGroup offset={3}>
                <Submit loading={submitLoading}>提交</Submit>
              </FormButtonGroup>
            </SchemaForm>
          </Card>

          <Card id="recruitmentInfoLayout" title="分销员招募设置">
            <SchemaForm
              value={recruitmentInfo?.data}
              schema={recruitmentSchema}
              actions={recruitmentActions}
              onSubmit={handleRecruitmentSubmit}
              components={{
                Input,
                InputNumber,
                Switch,
                Radio,
                'Radio.Group': Radio.Group,
                Submit,
                CustomEditor,
              }}
            >
              <FormButtonGroup offset={3}>
                <Submit loading={submitRecruitmentLoading}>提交</Submit>
              </FormButtonGroup>
            </SchemaForm>
          </Card>

          <Card id="levelLayout" title="多级分销设置">
            <Button type="primary" onClick={() => handleAddLevel()}>
              新增
            </Button>
            <StandardFormTable
              columns={columns}
              autoScrollX
              rowKey="id"
              actionRef={ref}
              request={(params) => fetchData(params)}
            />

            <ModalBox
              isAdd={isAdd}
              visible={visible}
              params={rowParams}
              onCancel={() => setVisible(false)}
              onConfirm={handleConfirm}
            />
          </Card>
        </Space>
      </PageHeaderWrapper>
    </Fragment>
  )
}
export default SocialDistributionSetting
