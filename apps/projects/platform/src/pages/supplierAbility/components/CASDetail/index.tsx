import React, { useCallback, useMemo, useState } from 'react'
import { Spin, Card, Table, Button, Drawer } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import CustomizeColumn from '@/components/CustomizeColumn'
import theme from '../../../../../config/lingxi.theme.config'
import useGetAnchorHeader from '../../complaintsAndSuggests/common/hooks/useGetAnchorHeader'
import useGetDetailCommon from '../../complaintsAndSuggests/common/hooks/useGetDetailCommon'
import useModal from '../../memberEvaluate/hooks/useModal'
import SchemaForm, { createFormActions } from '@apps/formily'
import NiceForm from '@/components/NiceForm'
import FormilyUploadFiles from '@/components/UploadFiles/FormilyUploadFiles'
import FormilyCountryPhone from '../../complaintsAndSuggests/components/CountryPhone/FormilyCountryPhone'
import { handleFormSchema } from '../../complaintsAndSuggests/common/schema/handle'
import { LinkOutlined } from '@ant-design/icons'
import FormilySelectMember from '../../memberEvaluate/components/FormilySelectMember'
import { usePageStatus } from '@/hooks/usePageStatus'
import useInitialValue from '@/hooks/useInitialValue'
import {
  getMemberSupplierComplaintSubGet,
  GetMemberSupplierComplaintSubGetRequest,
  GetMemberSupplierComplaintSubGetResponse,
  getMemberSupplierComplaintUpperGet,
  GetMemberSupplierComplaintUpperGetRequest,
  GetMemberSupplierComplaintUpperGetResponse,
  getMemberSupplierInspectUsers,
  GetMemberSupplierInspectUsersRequest,
  GetMemberSupplierInspectUsersResponse,
  postMemberSupplierComplaintSubSend,
  postMemberSupplierComplaintUpperSend,
} from '@apps/apis'
import TableModal from '../TableModal'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { userColumns } from '../../complaintsAndSuggests/common/columns'
import { memberSchema, userSchema } from '../../complaintsAndSuggests/common/schema/addSchema'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'

type SubmitData = {
  handleUserEditName: string
  handleUserId: number
  handleUserEditPhone: string
  handleResult: string
  handleTime: string
  handleAttachments: {
    name: string
    url: string
  }[]
}

const formActions = createFormActions()
const DEFAULT_RETURN_DATA = {
  totalCount: 0,
  data: [],
}

const TobeEvaluateDetail = () => {
  const { id, lastTypeParams, isSupplier } = usePageStatus()
  const params = useMemo(() => {
    return id ? { id: id.toString() } : null
  }, [id])
  const isSupplierBoolean = useMemo(() => Boolean(Number(isSupplier)), [isSupplier])
  const { initialValue } = isSupplierBoolean
    ? useInitialValue<GetMemberSupplierComplaintSubGetResponse, GetMemberSupplierComplaintSubGetRequest>(
        getMemberSupplierComplaintSubGet,
        params,
      )
    : useInitialValue<GetMemberSupplierComplaintUpperGetResponse, GetMemberSupplierComplaintUpperGetRequest>(
        getMemberSupplierComplaintUpperGet,
        params,
      )
  const { visible, toggle } = useModal()
  const { visible: userModalVisible, toggle: userModalToggle } = useModal()
  const [userModalValue, setUserModalValue] = useState<any>([])
  const { headers } = useGetAnchorHeader([], { initialValue })
  const { basicInfo, resultInfo } = useGetDetailCommon({ initialValue }, isSupplierBoolean)
  const intl = useIntl()

  const isView = useMemo(() => lastTypeParams === '/preview', [lastTypeParams])

  const onSubmitRes = () => {
    toggle(true)
  }

  const handleSubmit = async (value: SubmitData) => {
    console.log(value)
    const { handleAttachments, ...rest } = value
    const postData = {
      id: id,
      ...rest,
      handleAttachments: handleAttachments?.map((_row) => ({
        name: _row.name,
        url: _row.url,
      })),
    }
    const requestFunction = isSupplierBoolean
      ? postMemberSupplierComplaintSubSend
      : postMemberSupplierComplaintUpperSend
    const { data, code } = await requestFunction(postData)
    if (code === 1000) {
      history.goBack()
    }
  }

  const handleFetchUserData = useCallback(async (params: GetMemberSupplierInspectUsersRequest) => {
    const { data, code } = await getMemberSupplierInspectUsers(params)
    if (code === 1000) {
      return data
    }
    return DEFAULT_RETURN_DATA
  }, [])

  const handleUserOnOk = (
    selectRowKeys: string[] | number[],
    selectRowRecord: GetMemberSupplierInspectUsersResponse['data'],
  ) => {
    const target = selectRowRecord[0]
    formActions.setFieldValue('handleUserEditName', target?.name)
    formActions.setFieldValue('handleUserId', target?.userId)
    formActions.setFieldValue('handleUserEditPhone', target?.phone)

    const disabled = target?.userId ? true : false

    formActions.setFieldState('*(handleUserEditName, handleUserEditPhone)', (state) => {
      state.props['x-component-props'].disabled = disabled
    })
    setUserModalValue(selectRowRecord)
    userModalToggle(false)
  }

  return (
    <Spin spinning={false}>
      <PageHeaderWrapper
        title={`${intl.formatMessage({ id: 'member.complaintsAndSuggests.common.columns.index.caseTopic' })}：${
          initialValue?.subject
        }`}
        items={headers}
        extra={
          (initialValue?.handleResult === null && !isView && (
            <Button type="primary" onClick={onSubmitRes}>
              {intl.formatMessage({ id: 'member.complaintsAndSuggests.detail.dealResultInfo' })}
            </Button>
          )) ||
          null
        }
      >
        <CustomizeColumn
          id="detail"
          data={basicInfo}
          title={intl.formatMessage({ id: 'member.complaintsAndSuggests.detail.complaintSuggest' })}
          column={3}
        />
        {initialValue?.handleResult && (
          <div style={{ margin: `${theme['@margin-md']} 0` }}>
            <CustomizeColumn
              id="result"
              data={resultInfo}
              title={intl.formatMessage({ id: 'member.complaintsAndSuggests.detail.dealResultInfo' })}
              column={3}
            />
          </div>
        )}
      </PageHeaderWrapper>
      <Drawer
        visible={visible}
        onClose={() => toggle(false)}
        width={600}
        title={intl.formatMessage({ id: 'member.complaintsAndSuggests.detail.dealResultInfo' })}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => toggle(false)} style={{ marginRight: 8 }}>
              {intl.formatMessage({ id: 'member.memberEvaluate.components.FormilySelectMember.index.cancel' })}
            </Button>
            <Button onClick={() => formActions.submit()} type="primary">
              {intl.formatMessage({ id: 'member.memberEvaluate.components.FormilySelectMember.index.submit' })}
            </Button>
          </div>
        }
      >
        <NiceForm
          schema={handleFormSchema}
          components={{ FormilyUploadFiles, FormilyCountryPhone, FormilySelectMember }}
          actions={formActions}
          onSubmit={handleSubmit}
          expressionScope={{
            connectUser: (
              <div onClick={() => userModalToggle(true)}>
                <LinkOutlined style={{ marginRight: 4 }} />
                {intl.formatMessage({ id: 'member.memberEvaluate.createEvaluate.add.choose' })}
              </div>
            ),
            handleFetchUserData,
          }}
        />
      </Drawer>
      <TableModal
        modalType="Drawer"
        visible={userModalVisible}
        onClose={() => userModalToggle(false)}
        title={`${intl.formatMessage({ id: 'member.memberInspection.add.chooseUser' })}`}
        columns={userColumns}
        schema={userSchema}
        customizeRadio
        onOk={handleUserOnOk}
        fetchData={handleFetchUserData}
        value={userModalValue}
        effects={($, actions) => {
          useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
        }}
        tableProps={{
          rowKey: 'userId',
        }}
        mode={'radio'}
      />
    </Spin>
  )
}

export default TobeEvaluateDetail
