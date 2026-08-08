import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Card, Button } from 'antd'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { PageHeaderWrapper } from '@apps/components'
import { LinkOutlined, SaveOutlined } from '@ant-design/icons'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import ReturnEle from '@/components/ReturnEle'
import NiceForm from '@/components/NiceForm'
import { InspectionAddSchema, userSchema } from '../common/schema/addSchema'
import FormilyUploadFiles from '@/components/UploadFiles/FormilyUploadFiles'
import TableModal from '../../components/TableModal'
import useModal from '../../memberEvaluate/hooks/useModal'
import { memberColumns } from '../common/columns/memberColumns'
import { userColumns } from '../common/columns/userColumns'
import { memberSchema } from '../common/schema/addSchema'
import {
  getMemberSupplierInspectGet,
  GetMemberInspectGetResponse,
  GetMemberInspectMembersRequest,
  GetMemberInspectMembersResponse,
  getMemberSupplierInspectAvailableTypes,
  getMemberSupplierInspectUsers,
  GetMemberInspectUsersRequest,
  GetMemberInspectUsersResponse,
  postMemberSupplierInspectAdd,
  postMemberSupplierInspectUpdate,
  postMemberSupplierLifecycleArchivesManagementPage,
} from '@apps/apis'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { usePageStatus } from '@/hooks/usePageStatus'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
type SubmitDataType = {
  inspectDay: string
  /**
   * 1-入库考察2-整改考察3-计划考察4-其他考察
   */
  inspectType: number
  reason: string
  reports: { name: string; url: string }[]
  result: string
  score: string
  subject: string
  userId: number
  userName: string
  name: string
  subMemberId: number
  subRoleId: number
  attachments: { name: string; url: string }[]
}
type EditPostData = Omit<SubmitDataType, 'name' | 'userName' | 'score'> & { id: number; score: number }
type PostData = Omit<SubmitDataType, 'name' | 'userName' | 'score'> & { score: number }

const formActions = createFormActions()
const { onFormInputChange$ } = FormEffectHooks
const DEFAULT_RETURN_DATA = {
  totalCount: 0,
  data: [],
}

const InspectionAdd = () => {
  const { visible, toggle } = useModal()
  const { visible: userModalVisible, toggle: userModalToggle } = useModal()
  const { id } = usePageStatus()
  const isEdit = useMemo(() => id && typeof id === 'string', [id])
  const [userModalValue, setUserModalValue] = useState([])
  const [memberModalValue, setMemberModalValue] = useState([])
  const [initialValue, setInitialValue] = useState<GetMemberInspectGetResponse | null>(null)
  const [unsaved, setUnsaved] = useState<boolean>(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const intl = useIntl()

  usePrompt({ when: unsaved, message: intl.formatMessage({ id: 'common.tip.save.confirm' }) })

  useEffect(() => {
    if (!isEdit) {
      return
    }
    async function getInitValue() {
      const { data, code } = await getMemberSupplierInspectGet({ id: id.toString() })
      if (code === 1000) {
        setInitialValue(data)
      }
    }
    getInitValue()
  }, [isEdit])

  const formatedValue = useMemo(() => {
    if (!initialValue) {
      return {}
    }
    return initialValue
  }, [initialValue])

  const handleFetchData = useCallback(async (params: GetMemberInspectMembersRequest) => {
    const { data, code } = await postMemberSupplierLifecycleArchivesManagementPage(
      { ...(params as any), current: `${params.current}`, pageSize: `${params.pageSize}` },
      { ctlType: 'none' },
    )
    if (code === 1000) {
      return data
    }
    return DEFAULT_RETURN_DATA
  }, [])

  const handleOnOk = (selectRowKeys: string[] | number[], selectRowRecord: GetMemberInspectMembersResponse['data']) => {
    const target = selectRowRecord[0]
    formActions.setFieldValue('tabs.tab-1.layout.name', target.name)
    formActions.setFieldValue('tabs.tab-1.layout.subMemberId', target.memberId)
    formActions.setFieldValue('tabs.tab-1.layout.subRoleId', target.roleId)

    setMemberModalValue(selectRowRecord)
    toggle(false)
  }

  const handleFetchUserData = useCallback(async (params: GetMemberInspectUsersRequest) => {
    const { data, code } = await getMemberSupplierInspectUsers(params)
    if (code === 1000) {
      return data
    }
    return DEFAULT_RETURN_DATA
  }, [])

  const handleUserOnOk = (
    selectRowKeys: string[] | number[],
    selectRowRecord: GetMemberInspectUsersResponse['data'],
  ) => {
    const target = selectRowRecord[0]
    formActions.setFieldValue('tabs.tab-1.layout.userName', target?.name)
    formActions.setFieldValue('tabs.tab-1.layout.userId', target?.userId)
    const disabled = target?.userId

    formActions.setFieldState('tabs.tab-1.layout.userName', (state) => {
      state.props['x-component-props'].disabled = disabled
    })
    setUserModalValue(selectRowRecord)
    userModalToggle(false)
  }

  const fetchInspectType = useCallback(async () => {
    const { code, data } = await getMemberSupplierInspectAvailableTypes()
    if (code === 1000) {
      return data.map((_item) => ({ label: _item.text, value: _item.id }))
    }
    return []
  }, [])

  const handleOnSubmit = async (values: SubmitDataType) => {
    try {
      const { name, userName, userId, score, attachments, reports, ...rest } = values
      setSubmitLoading(true)
      const postTempData = {
        ...rest,
        score: +score,
        userEditName: userName,
        userId: userId || 0,
        attachments: attachments?.map((_row) => ({
          name: _row.name,
          url: _row.url,
        })),
        reports: reports?.map((_row) => ({
          name: _row.name,
          url: _row.url,
        })),
      }
      const service = isEdit ? postMemberSupplierInspectUpdate : postMemberSupplierInspectAdd
      const postData: EditPostData | PostData = isEdit ? { ...postTempData, id: id } : postTempData
      const { code, data } = await service(postData as any)
      if (code === 1000) {
        setUnsaved(false)
        setTimeout(() => {
          history.goBack()
        }, 200)
      }
    } catch (error) {
    } finally {
      setSubmitLoading(false)
    }
  }

  useEffect(() => {
    if (initialValue) {
      setUserModalValue([
        {
          userId: initialValue.userId,
          name: initialValue.userName,
        },
      ])
      setMemberModalValue([
        {
          name: initialValue.name,
          subMemberId: initialValue.memberId,
          subRoleId: initialValue.roleId,
        },
      ])
    }
  }, [initialValue])

  return (
    <PageHeaderWrapper
      title={
        isEdit
          ? `${intl.formatMessage({
              id: 'supplier.supplierInspection.add.modifyInvestigate',
            })}`
          : `${intl.formatMessage({
              id: 'supplier.supplierInspection.add.addInvestigate',
            })}`
      }
      extra={
        // <AuthButton type={id ? 'edit' : 'add'}>
        <Button loading={submitLoading} type="primary" icon={<SaveOutlined />} onClick={() => formActions.submit()}>
          {intl.formatMessage({ id: 'member.memberInspection.add.save' })}
        </Button>
        // </AuthButton>
      }
    >
      <Card>
        <NiceForm
          initialValues={formatedValue}
          editable={true}
          onSubmit={handleOnSubmit}
          schema={InspectionAddSchema}
          actions={formActions}
          components={{ FormilyUploadFiles }}
          effects={($, actions) => {
            useAsyncSelect('inspectType', fetchInspectType)
            onFormInputChange$().subscribe(() => {
              if (!unsaved) {
                setUnsaved(true)
              }
            })
          }}
          expressionScope={{
            connectMember: (
              <div onClick={() => toggle(true)}>
                <LinkOutlined style={{ marginRight: 4 }} />
                {intl.formatMessage({
                  id: 'supplier.supplierInspection.add.choosesupplier',
                })}
              </div>
            ),
            connectUser: (
              <div onClick={() => userModalToggle(true)}>
                <LinkOutlined style={{ marginRight: 4 }} />
                {intl.formatMessage({
                  id: 'member.memberInspection.add.chooseUser',
                })}
              </div>
            ),
          }}
        />
      </Card>
      <TableModal
        visible={visible}
        onClose={() => toggle(false)}
        title={`${intl.formatMessage({
          id: 'supplier.supplierInspection.add.choosesupplier',
        })}`}
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
      <TableModal
        visible={userModalVisible}
        onClose={() => userModalToggle(false)}
        title={`${intl.formatMessage({
          id: 'member.memberInspection.add.chooseUser',
        })}`}
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

export default InspectionAdd
