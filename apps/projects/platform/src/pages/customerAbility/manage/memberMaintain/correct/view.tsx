import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Card, Button } from 'antd'
import { history } from '@linkseeks/router-manager'
import { usePrompt, useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { PageHeaderWrapper } from '@apps/components'
import { LinkOutlined, SaveOutlined } from '@ant-design/icons'
import SchemaForm, { createFormActions, FormEffectHooks } from '@apps/formily'
import ReturnEle from '@/components/ReturnEle'
import NiceForm from '@/components/NiceForm'
import { rectificationAddSchema } from './common/schema/addSchema'
import FormilyUploadFiles from '@/components/UploadFiles/FormilyUploadFiles'
import FormilyRangeTime from '@/components/RangeTime/FormilyRangeTime'
import TableModal from './common/components/TableModal'
import useModal from './common/hooks/useModal'
import { useGetCommonSubMember } from './common/hooks/useGetCommonSubMember'
import {
  getMemberCustomerInspectMembers,
  GetMemberInspectMembersResponse,
  getMemberCustomerRectifyWaitAddGet,
  GetMemberRectifyWaitAddGetResponse,
  postMemberCustomerRectifyWaitAddAdd,
  postMemberCustomerRectifyWaitAddUpdate,
} from '@apps/apis'
import { Moment } from 'moment'
import { usePageStatus } from '@/hooks/usePageStatus'
import useInitialValue from '@/hooks/useInitialValue'
import moment from 'moment'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { postMemberCustomerLifecycleArchivesManagementPage, GetMemberInspectMembersRequest } from '@apps/apis'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

const { onFormInputChange$ } = FormEffectHooks
type SubmitData = {
  /**
   * 选择会员信息
   */
  name: string
  subRoleId: number
  subMemberId: number
  reason: string
  require: string
  rectifyDayStart: Moment
  rectifyDayEnd: Moment
  subject: string
  attachments: {
    name: string
    url: string
  }[]
}

const formActions = createFormActions()
const format = 'YYYY-MM-DD'
const InspectionAdd = (props) => {
  const location = useLocation()
  const { id, memberId, memberName, roleId } = usePageStatus()
  const { visible, toggle } = useModal()
  const { memberColumns, memberSchema } = useGetCommonSubMember(getMemberCustomerInspectMembers)
  const [memberModalValue, setMemberModalValue] = useState<{ subMemberId: number; subRoleId: number; name: string }[]>(
    [],
  )
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const isPreview = location.pathname.includes('/supplierAbility/memberRectification/rectificationAdd/detail')
  const isEdit = useMemo(() => id && typeof id === 'string', [id])
  const params = useMemo(() => {
    return id ? { id: id.toString() } : null
  }, [id])
  const { loading, initialValue } = useInitialValue<GetMemberRectifyWaitAddGetResponse, { id: string }>(
    getMemberCustomerRectifyWaitAddGet,
    params,
  )
  const [unsaved, setUnsaved] = useState(false)
  const intl = useIntl()
  usePrompt({ when: unsaved, message: intl.formatMessage({ id: 'common.tip.save.confirm' }) })
  /** 从会员信息列表设置默认会员 */
  const shouldSetInitiialMember = useMemo(() => {
    if (memberId && roleId) {
      return {
        subMemberId: memberId,
        name: memberName,
        subRoleId: roleId,
      }
    }
    return null
  }, [memberId, memberName, roleId])
  console.log(memberId, memberName, roleId, shouldSetInitiialMember)

  // 获取供应商会员
  const handleFetchData = async (params: GetMemberInspectMembersRequest) => {
    const res = await postMemberCustomerLifecycleArchivesManagementPage(
      {
        ...(params as any),
        current: `${params.current}`,
        pageSize: `${params.pageSize}`,
      },
      {
        ctlType: 'none',
      },
    )
    if (res.code === 1000) {
      return res.data
    }
    return { data: [], totalCount: 0 }
  }

  /**
   * 格式化初始化值
   */
  const formatedInitialValue = useMemo(() => {
    if (!isEdit && shouldSetInitiialMember !== null) {
      return shouldSetInitiialMember
    }

    if (!isEdit || !initialValue) {
      return {}
    }
    const { rectifyDayStart, rectifyDayEnd, ...rest } = initialValue
    return {
      rectifyDayStart: moment(rectifyDayStart, 'YYYY-MM-DD'),
      rectifyDayEnd: moment(rectifyDayEnd, 'YYYY-MM-DD'),
      ...rest,
    }
  }, [initialValue, isEdit, shouldSetInitiialMember])

  useEffect(() => {
    if (!isEdit && shouldSetInitiialMember !== null) {
      setMemberModalValue([
        {
          subMemberId: shouldSetInitiialMember.memberId,
          subRoleId: shouldSetInitiialMember.roleId,
          name: shouldSetInitiialMember.name,
        },
      ])
    }
    if (initialValue) {
      setMemberModalValue([
        {
          subMemberId: initialValue.memberId,
          subRoleId: initialValue.roleId,
          name: initialValue.name,
        },
      ])
    }
  }, [initialValue, isEdit, shouldSetInitiialMember])

  const handleSubmit = useCallback(
    async (value: SubmitData) => {
      const { name, rectifyDayStart, rectifyDayEnd, attachments, ...rest } = value
      const tempPostData = {
        rectifyDayStart: rectifyDayStart.format(format),
        rectifyDayEnd: rectifyDayEnd.format(format),
        attachments: attachments?.map((_row) => ({
          name: _row.name,
          url: _row.url,
        })),
        ...rest,
      }
      setSubmitLoading(() => true)
      const service = isEdit ? postMemberCustomerRectifyWaitAddUpdate : postMemberCustomerRectifyWaitAddAdd
      const postData = isEdit ? { ...tempPostData, id: id } : tempPostData
      const { data, code } = await service(postData)
      setSubmitLoading(() => false)
      setUnsaved(() => false)
      if (code === 1000) {
        history.goBack()
      }
    },
    [isEdit, id],
  )

  const handleOnOk = (selectRowKeys: string[] | number[], selectRowRecord: GetMemberInspectMembersResponse['data']) => {
    const target = selectRowRecord[0]
    formActions.setFieldValue('tabs.tab-1.layout.name', target.name)
    formActions.setFieldValue('tabs.tab-1.layout.subMemberId', target.memberId)
    formActions.setFieldValue('tabs.tab-1.layout.subRoleId', target.roleId)

    setMemberModalValue(selectRowRecord)
    toggle(false)
  }

  const titleRender = () => {
    if (isPreview) {
      return `${intl.formatMessage({ id: 'member.memberRectification.rectificationAdd.add.viewRectifyNo' })}`
    }
    if (isEdit) {
      return `${intl.formatMessage({ id: 'member.memberRectification.rectificationAdd.add.editRectifyNo' })}`
    }
    return `${intl.formatMessage({ id: 'member.memberRectification.rectificationAdd.add.addRectifyNo' })}`
  }

  return (
    <PageHeaderWrapper
      title={titleRender()}
      backDom
      extra={
        !isPreview && (
          // <AuthButton type={!id ? 'add' : 'edit'}>
          <Button type="primary" loading={submitLoading} icon={<SaveOutlined />} onClick={() => formActions.submit()}>
            {intl.formatMessage({ id: 'member.memberInspection.add.save' })}
          </Button>
          // </AuthButton>
        )
      }
    >
      <Card>
        <NiceForm
          onSubmit={handleSubmit}
          editable={!isPreview}
          initialValues={formatedInitialValue}
          schema={rectificationAddSchema}
          actions={formActions}
          components={{ FormilyUploadFiles, FormilyRangeTime }}
          expressionScope={{
            connectMember: !isPreview ? (
              <div onClick={() => toggle(true)}>
                <LinkOutlined style={{ marginRight: 4 }} />
                {intl.formatMessage({
                  id: 'member.memberEvaluate.createEvaluate.add.choose',
                })}
              </div>
            ) : null,
          }}
          effects={() => {
            onFormInputChange$().subscribe(() => {
              if (!unsaved) {
                setUnsaved(true)
              }
            })
          }}
        />
      </Card>
      <TableModal
        visible={visible}
        onClose={() => toggle(false)}
        title={translate('web.resource.member.xuanzekehu')}
        columns={memberColumns}
        schema={memberSchema}
        onOk={handleOnOk}
        fetchData={handleFetchData}
        tableProps={{
          rowKey: (record) => `${record.memberId}_${record.roleId}`,
        }}
        mode={'radio'}
        value={memberModalValue}
      />
    </PageHeaderWrapper>
  )
}

export default InspectionAdd
