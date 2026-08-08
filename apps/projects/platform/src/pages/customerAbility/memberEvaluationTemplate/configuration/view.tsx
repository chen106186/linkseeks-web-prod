/*
 * @Description: 客户评分模板 > 客户评分模板配置
 */
import React, { useRef, useState } from 'react'
import { Link, useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'

import { Card, Space, Button, Switch, message, Popconfirm } from 'antd'
import { ExclamationCircleFilled, InfoCircleFilled, PlusOutlined } from '@ant-design/icons'
import { PageHeaderWrapper } from '@apps/components'
import { ColumnsType } from 'antd/lib/table'
import { createFormActions } from '@apps/formily'
import NiceForm from '@/components/NiceForm'
import StandardTable from '@/components/StandardTable'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { memberEvaluationTemplateListQuerySchema } from './schema'

import {
  getMemberCustomerScoringTemplatePage,
  postMemberCustomerScoringTemplateDelete,
  postMemberCustomerScoringTemplateStartOrStop,
  GetMemberCustomerScoringTemplatePageRequest,
} from '@apps/apis'
import { useWebIntl } from '@apps/locales'

const formActions = createFormActions()

const EMPTY_DATA = {
  data: [],
  totalCount: 0,
}

const MemberEvaluationTemplateConfiguration: React.FC<{}> = () => {
  const intl = useIntl()
  const { pathname } = useLocation()
  const ref = useRef<any>({})
  const translate = useWebIntl()

  const defaultColumns: ColumnsType<any> = [
    {
      title: intl.formatMessage({
        id: 'supplier.memberEvaluationTemplate.query.defaultColumns.templateId',
        defaultMessage: '评分模板ID',
      }),
      dataIndex: 'id',
      width: 128,
    },
    {
      title: intl.formatMessage({
        id: 'supplier.memberEvaluationTemplate.query.defaultColumns.templateName',
        defaultMessage: '评分模板名称',
      }),
      dataIndex: 'templateName',
      width: 392,
      render: (templateName, template) =>
        /* 客户评分模板-查看权限 */
        authUrl(pathname, 'detail') ? (
          <Link to={`${pathname}/detail?id=${template.id}&preview=1`}>{templateName}</Link>
        ) : (
          templateName
        ),
    },
    {
      title: intl.formatMessage({
        id: 'supplier.memberEvaluationTemplate.query.defaultColumns.templateType',
        defaultMessage: '评分模板类型',
      }),
      dataIndex: 'templateTypeName',
      width: 392,
    },
    {
      title: intl.formatMessage({
        id: 'supplier.memberEvaluationTemplate.query.defaultColumns.templateDescribe',
        defaultMessage: '评分模板说明',
      }),
      dataIndex: 'templateDescribe',
      width: 384,
    },
    {
      title: intl.formatMessage({
        id: 'supplier.memberEvaluationTemplate.query.defaultColumns.templateState',
        defaultMessage: '状态',
      }),
      dataIndex: 'state',
      width: 192,
      render: (state, template) => (
        <Popconfirm
          title={`${
            template.state ^ 1
              ? translate('web.resource.member.yiqiyongpingfenmuban')
              : translate('web.resource.member.yitingyongpingfenmuban')
          }：${template.templateName}？`}
          icon={
            state ? (
              <ExclamationCircleFilled style={{ color: '#e34d59' }} />
            ) : (
              <InfoCircleFilled style={{ color: '#c8cacd' }} />
            )
          }
          onConfirm={() => postEvaluationTemplateStateSwitching(template)}
        >
          <Switch checked={state} />
        </Popconfirm>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'supplier.memberEvaluationTemplate.query.defaultColumns.operations',
        defaultMessage: '操作',
      }),
      dataIndex: 'id',
      width: 128,
      fixed: 'right',
      render: (id, template) =>
        !template.state && (
          <Space>
            {/* 客户评分模板-编辑权限 */}
            <EditAuthButton>
              <Link to={`${pathname}/edit?id=${id}`}>{translate('web.common.edit')}</Link>
            </EditAuthButton>
            {/* 客户评分模板-删除权限 */}
            <AuthButton type="custom" code="delete">
              <Popconfirm
                placement="topRight"
                title={`${translate('web.resource.member.shifoushanchupingfenmuban')}：${template.templateName}？`}
                icon={<ExclamationCircleFilled style={{ color: '#e34d59' }} />}
                onConfirm={() => postEvaluationTemplateDeletion(template)}
              >
                <Link to={void 0}>{translate('web.common.delete')}</Link>
              </Popconfirm>
            </AuthButton>
          </Space>
        ),
    },
  ]

  const [columns] = useState([...defaultColumns])
  const [isLoading, setIsLoading] = useState(false)

  /** 查询 评分模板配置列表 */
  const getEvaluationTemplates = async (params: GetMemberCustomerScoringTemplatePageRequest) => {
    try {
      const res = await getMemberCustomerScoringTemplatePage({ ...params })
      if (res.code === 1000) {
        return {
          data: res.data,
          totalCount: 0, // 接口没有分页
        }
      }
      return EMPTY_DATA
    } catch (error) {
      console.error(error)
      return EMPTY_DATA
    } finally {
      setIsLoading(false)
    }
  }

  /** 启用/停用 评分模板状态 */
  const postEvaluationTemplateStateSwitching = async (template: any) => {
    setIsLoading(true)
    const res = await postMemberCustomerScoringTemplateStartOrStop(
      {
        id: template.id,
        state: template.state ^ 1, // 位运算切换 0、1 值
      },
      { ctlType: 'none' },
    )
    if (res.code === 1000) {
      message.success(
        `${
          template.state ^ 1
            ? translate('web.resource.member.yiqiyongpingfenmuban')
            : translate('web.resource.member.yitingyongpingfenmuban')
        }：${template.templateName}`,
      )
    } else {
      message.error(res.message)
    }
    ref.current.reload()
  }

  /** 删除 评分模板 */
  const postEvaluationTemplateDeletion = async (template: any) => {
    setIsLoading(true)
    const res = await postMemberCustomerScoringTemplateDelete({ id: template.id }, { ctlType: 'none' })
    if (res.code === 1000) {
      message.success(`${translate('web.resource.member.yichenggongshanchupingfenmuban')}：${template.templateName}`)
    }
    ref.current.reload()
  }

  const OperationButtons = () => (
    <>
      <div>
        {/* 客户评分模板-新增权限 */}
        <AddAuthButton>
          <Link to={`${pathname}/add`}>
            <Button type="primary" icon={<PlusOutlined />}>
              {intl.formatMessage({
                id: 'supplier.memberEvaluationTemplate.template.add',
                defaultMessage: '新增',
              })}
            </Button>
          </Link>
        </AddAuthButton>
      </div>
    </>
  )

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          currentRef={ref}
          columns={columns}
          loading={isLoading}
          fetchTableData={getEvaluationTemplates}
          tableProps={{
            rowKey: 'id',
            pagination: false,
            scroll: { x: 1600 },
          }}
          controlRender={
            <NiceForm
              schema={memberEvaluationTemplateListQuerySchema}
              actions={formActions}
              components={{ OperationButtons }}
              onSubmit={ref.current.reload}
              effects={($, actions) => {
                // 列表筛选器初始化
                useStateFilterSearchLinkageEffect($, actions, 'templateName', FORM_FILTER_PATH)
              }}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default MemberEvaluationTemplateConfiguration
