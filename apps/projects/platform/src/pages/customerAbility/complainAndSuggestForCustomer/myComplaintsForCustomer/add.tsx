/**
 * 投诉建议（客户端） > 我发起的投诉建议 > 新增/编辑
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Card, Button } from 'antd'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { PageHeaderWrapper } from '@apps/components'
import { LinkOutlined, SaveOutlined } from '@ant-design/icons'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { Input } from '@apps/formily'
import { complaintAddSchemaForCustomer } from './schema'
import FormilyCountryPhone from '../../complaintsAndSuggests/components/CountryPhone/FormilyCountryPhone'
import FormilyCustomizeRadioButton from '../../complaintsAndSuggests/components/CustomizeRadioButton/FormilyCustomizeRadioButton'
import useModal from '../../complaintsAndSuggests/common/hooks/useModal'
import TableModal from '../../components/TableModal'
import { memberColumnsForCustomer, userColumns } from '../../complaintsAndSuggests/common/columns'
import { memberSchema, userSchema } from '../../complaintsAndSuggests/common/schema/addSchema'
import useInitialValue from '@/hooks/useInitialValue'
import ReturnEle from '@/components/ReturnEle'
import NiceForm from '@/components/NiceForm'
import FormilyUploadFiles from '@/components/UploadFiles/FormilyUploadFiles'
import FormilyRangeTime from '@/components/RangeTime/FormilyRangeTime'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { usePageStatus } from '@/hooks/usePageStatus'
import {
  getMemberCustomerComplaintSubGet,
  GetMemberCustomerComplaintSubGetResponse,
  getMemberCustomerAbilityInfoPage,
  GetMemberCustomerAbilityInfoPageRequest,
  GetMemberCustomerAbilityInfoPageResponse,
  getMemberCustomerInspectUsers,
  GetMemberCustomerInspectUsersRequest,
  GetMemberCustomerInspectUsersResponse,
  postMemberCustomerComplaintSubAdd,
  postMemberCustomerComplaintSubUpdate,
} from '@apps/apis'

type SubmitType = {
  /**
   * 业务类型1-投诉2-建议
   */
  type: 1 | 2
  /**
   * 事件分类1-关于产品2-关于订单3-关于配送4-关于售后5-关于服务6-其他
   */
  classify: number
  subject: string
  upperName: string
  memberId: number
  roleId: number
  /**
   * 自定义用户时userId = 0
   */
  byUserId: number
  byUserEditName: string
  // phoneData: {
  //   code: string,
  //   phone: string,
  // },
  byUserEditPhone: string
  eventTime: string
  eventDesc: string
  eventSuggest: string
  attachments: {
    name: string
    url: string
  }[]
}

const formActions = createFormActions()
const { onFormInputChange$ } = FormEffectHooks
const DEFAULT_RETURN_DATA = {
  totalCount: 0,
  data: [],
}

const SuggestAdd = () => {
  const { visible, toggle } = useModal()
  const { visible: userModalVisible, toggle: userModalToggle } = useModal()
  const [userModalValue, setUserModalValue] = useState([])
  const [memberModalValue, setMemberModalValue] = useState([])

  const { id } = usePageStatus()
  const isEdit = useMemo(() => id && typeof id === 'string', [id])
  const params = useMemo(() => {
    return id ? { id: id.toString() } : null
  }, [id])
  const { initialValue } = useInitialValue(getMemberCustomerComplaintSubGet, params)
  const [unsaved, setUnsaved] = useState<boolean>(false)
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const intl = useIntl()

  usePrompt({ when: unsaved, message: intl.formatMessage({ id: 'common.tip.save.confirm' }) })

  useEffect(() => {
    if (!initialValue) {
      return
    }
    const { name, memberId, roleId, byUserName, byUserPhone, byUserId, ...rest } =
      initialValue as unknown as GetMemberCustomerComplaintSubGetResponse
    setMemberModalValue([
      {
        name,
        memberId,
        roleId,
      },
    ])
    setUserModalValue([
      {
        name: byUserName,
        userId: byUserId,
        phone: byUserPhone,
      },
    ])
    formActions.setFieldState('*(byUserEditName, phone)', (state) => {
      state.props['x-component-props'].disabled = byUserId
    })
  }, [initialValue])

  const formatedValue = useMemo(() => {
    if (!initialValue) {
      return { type: 1 }
    }
    const { byUserName, byUserPhone, ...rest } = initialValue as unknown as GetMemberCustomerComplaintSubGetResponse
    return {
      ...rest,
      byUserEditName: byUserName,
      byUserEditPhone: byUserPhone,
    }
  }, [initialValue])

  const handleSubmit = async (value: SubmitType) => {
    setSubmitLoading(true)
    const { upperName, attachments, ...rest } = value
    const service = !isEdit ? postMemberCustomerComplaintSubAdd : postMemberCustomerComplaintSubUpdate
    const tempPostData = {
      attachments: attachments?.map((_row) => ({
        name: _row.name,
        url: _row.url,
      })),
      ...rest,
    }
    const postData = isEdit ? { ...tempPostData, id: id } : tempPostData
    const { data, code } = await service(postData as any)
    setSubmitLoading(false)
    setUnsaved(false)
    if (code === 1000) {
      setTimeout(() => {
        history.goBack()
      }, 200)
    }
  }

  const handleFetchData = useCallback(async (params: GetMemberCustomerAbilityInfoPageRequest) => {
    const { data, code } = await getMemberCustomerAbilityInfoPage(params)
    if (code === 1000) {
      return data
    }
    return DEFAULT_RETURN_DATA
  }, [])

  const handleOnOk = (
    selectRowKeys: string[] | number[],
    selectRowRecord: GetMemberCustomerAbilityInfoPageResponse['data'],
  ) => {
    const target = selectRowRecord[0]
    formActions.setFieldValue('upperName', target.name)
    formActions.setFieldValue('memberId', target.memberId)
    formActions.setFieldValue('roleId', target.roleId)

    setMemberModalValue(selectRowRecord)
    toggle(false)
  }

  const handleFetchUserData = useCallback(async (params: GetMemberCustomerInspectUsersRequest) => {
    const { data, code } = await getMemberCustomerInspectUsers(params)
    if (code === 1000) {
      return data
    }
    return DEFAULT_RETURN_DATA
  }, [])

  const handleUserOnOk = (
    selectRowKeys: string[] | number[],
    selectRowRecord: GetMemberCustomerInspectUsersResponse['data'],
  ) => {
    const target = selectRowRecord[0]
    formActions.setFieldValue('byUserEditName', target?.name)
    formActions.setFieldValue('byUserId', target?.userId)
    formActions.setFieldValue('byUserEditPhone', target?.phone)

    const disabled = target?.userId ? true : false

    formActions.setFieldState('*(byUserEditName, byUserEditPhone)', (state) => {
      state.props['x-component-props'].disabled = disabled
    })
    setUserModalValue(selectRowRecord)
    userModalToggle(false)
  }

  return (
    <PageHeaderWrapper
      title={
        isEdit
          ? `${intl.formatMessage({ id: 'member.complaintsAndSuggests.add.editComplaintSuggest' })}`
          : `${intl.formatMessage({ id: 'member.complaintsAndSuggests.add.addComplaintSuggest' })}`
      }
      extra={
        <Button type="primary" icon={<SaveOutlined />} loading={submitLoading} onClick={() => formActions.submit()}>
          {intl.formatMessage({ id: 'member.memberInspection.add.save' })}
        </Button>
      }
    >
      <Card>
        <NiceForm
          onSubmit={handleSubmit}
          editable={true}
          value={formatedValue}
          schema={complaintAddSchemaForCustomer}
          actions={formActions}
          components={{
            TextArea: Input.TextArea,
            FormilyUploadFiles,
            FormilyRangeTime,
            FormilyCountryPhone,
            FormilyCustomizeRadioButton,
          }}
          expressionScope={{
            connectMember: (
              <div onClick={() => toggle(true)}>
                <LinkOutlined />
              </div>
            ),
            connectUser: (
              <div onClick={() => userModalToggle(true)}>
                <LinkOutlined />
              </div>
            ),
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
        title={`选择采购商`}
        columns={memberColumnsForCustomer}
        schema={memberSchema}
        onOk={handleOnOk}
        fetchData={handleFetchData}
        tableProps={{
          rowKey: (record) => `${record.memberId}_${record.roleId}`,
        }}
        mode={'radio'}
        value={memberModalValue}
      />
      <TableModal
        visible={userModalVisible}
        onClose={() => userModalToggle(false)}
        title={`${intl.formatMessage({ id: 'member.memberInspection.add.chooseUser' })}`}
        columns={userColumns}
        schema={userSchema}
        customizeRadio
        onOk={handleUserOnOk}
        fetchData={handleFetchUserData}
        effects={($, actions) => {
          useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
        }}
        tableProps={{
          rowKey: 'userId',
        }}
        mode={'radio'}
        value={userModalValue}
      />
    </PageHeaderWrapper>
  )
}

export default SuggestAdd
