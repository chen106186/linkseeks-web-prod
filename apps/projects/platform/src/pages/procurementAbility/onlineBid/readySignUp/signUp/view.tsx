import React, { useState, useEffect } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { PageHeaderWrapper } from '@apps/components'
import { Card, Button, message } from 'antd'
import { createFormActions } from '@apps/formily'
import { SaveOutlined } from '@ant-design/icons'
import { ArrayTable } from '@apps/formily'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { postPurchaseOnlineBiddingOnlineSignup, getPurchaseOnlineBiddingDetails } from '@apps/apis'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import NiceForm from '@/components/NiceForm'
import ReturnEle from '@/components/ReturnEle'
import { formatTimeString } from '@/utils'
import { authService, getTelCodeOptions } from '@apps/services'
import { useQuery } from '@linkseeks/router-core'
const intl = getIntl()

import { formSchema } from '../schema'

// 页面表单全部提交
const addSchemaAction = createFormActions()

const SignUpForm = () => {
  const { number } = useQuery()

  const { id, pageStatus } = usePageStatus()

  const [formLoading, setFormLoading] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const [refundDisabled, setRefundDisabled] = useState(false)
  const [formValue, setFormValue] = useState<any>({ areas: [] })
  const { accessToken, userName } = authService.getAuth() || {}

  const getCountryCodeId = async () => {
    const data = await getTelCodeOptions()
    return { telPrefix: data }
  }

  const handleSubmit = async (value) => {
    console.log(value)
    const _address = `${value['signUpAreas'].province}${value['signUpAreas'].city}${value['signUpAreas'].area}${value.address}`
    const _params = {
      biddingId: value.id,
      mail: value.mail,
      demandUrls: value.demandUrls,
      enclosureUrls: value.enclosureUrls,
      address: _address,
      tel: value.tel,
      telPrefix: value.telPrefix,
      contacts: value.contacts,
      areas: value.areas,
      signUpAreas: { ...value['signUpAreas'], address: value.address },
    }
    console.log(_params)
    setBtnLoading(true)
    setRefundDisabled(true)
    postPurchaseOnlineBiddingOnlineSignup(_params).then((res) => {
      if (res.code === 1000) {
        history.redirect('/procurementAbility/onlineBid/search')
      } else {
        setBtnLoading(false)
        setRefundDisabled(false)
      }
    })
  }

  const beforeUpload = (file) => {
    if (file.size / 1024 / 1024 > 20) {
      message.warning(intl.formatMessage({ id: 'detail.purchase.message21' }))
      return Promise.reject()
    }
    setRefundDisabled(true)
  }

  const handleUploadChange = () => {
    setRefundDisabled(false)
  }

  const fetchDataSource = async () => {
    const params = {
      id,
      number,
      current: '1',
      pageSize: '1',
    }
    setFormLoading(true)
    await getPurchaseOnlineBiddingDetails({ ...params }).then((res) => {
      setFormLoading(false)
      if (res.code !== 1000) {
        history.goBack()
        return
      }
      const { data } = res
      setFormValue({
        ...data,
        areas: data['areas'] || [],
        createTime: formatTimeString(data.createTime),
        member: userName,
        startSignUp: formatTimeString(data.startSignUp),
        endSignUp: formatTimeString(data.endSignUp),
        telPrefix: '86',
        address: data['signUpAreas']?.address || '',
      })
    })
  }

  useEffect(() => {
    fetchDataSource()
  }, [])

  return (
    <PageHeaderWrapper
      backDom
      extra={
        <Button
          disabled={refundDisabled}
          type="primary"
          onClick={() => addSchemaAction.submit()}
          loading={btnLoading}
          icon={<SaveOutlined />}
        >
          {' '}
          {intl.formatMessage({ id: 'detail.purchase.save' })}
        </Button>
      }
    >
      <Card>
        <NiceForm
          loading={formLoading}
          value={formValue}
          previewPlaceholder=" "
          editable={pageStatus !== PageStatus.PREVIEW}
          actions={addSchemaAction}
          schema={formSchema}
          onSubmit={handleSubmit}
          components={{
            ArrayTable,
          }}
          effects={($, ctx) => {
            $('onFormMount').subscribe(() => {})
            useAsyncInitSelect(['telPrefix'], getCountryCodeId)
          }}
          expressionScope={{
            beforeUpload,
            onUploadChange: handleUploadChange,
            accessToken: { accessToken },
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}
export default SignUpForm
