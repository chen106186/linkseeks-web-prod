import React, { useEffect, useState } from 'react'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { PageHeaderWrapper } from '@apps/components'
import ReturnEle from '@/components/ReturnEle'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { Button, Card, message } from 'antd'
import { createFormActions } from '@apps/formily'
import { SaveOutlined } from '@ant-design/icons'
import NiceForm from '@/components/NiceForm'
import './index.less'
import { formSchema } from './schema'
import { ArrayTable } from '@apps/formily'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { fieldTransformRender, formDataTransformParams } from './constant'
import {
  getPurchaseInviteTenderGetInviteTenderRegister,
  postPurchaseSubmitTenderSubmitTenderRegister,
} from '@apps/apis'
import { getTelCodeOptions } from '@apps/services'
const intl = getIntl()

export interface AddBidRegisterProps {}

// 页面表单全部提交
const addSchemaAction = createFormActions()

// 新增待招标报名 包含新增和编辑
const AddBidRegister: React.FC<AddBidRegisterProps> = (props) => {
  const [formLoading, setFormLoading] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const [initFormValue, setInitFormValue] = useState<any>({})

  const { id, preview, pageStatus } = usePageStatus()

  useEffect(() => {
    if (id) {
      getPurchaseInviteTenderGetInviteTenderRegister({ inviteTenderId: id }).then((res) => {
        if (res.code === 1000) {
          // 转换字段渲染
          const fixedData = fieldTransformRender(res.data)
          setInitFormValue(fixedData)
        }
      })
    }
  }, [id])

  const handleSubmit = async (value) => {
    setBtnLoading(true)
    const result = formDataTransformParams(value)
    postPurchaseSubmitTenderSubmitTenderRegister(result)
      .then((res) => {
        if (res.code === 1000) {
          // history.goBack()
          history.push('/procurementAbility/tender/readyBidRegister')
        }
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }

  const getCountryCodeId = async () => {
    const data = await getTelCodeOptions()
    return { phoneCode: data }
  }

  const beforeUpload = (file) => {
    if (file.size / 1024 / 1024 > 20) {
      message.warning(intl.formatMessage({ id: 'table.purchase.yicishangchuanyi' }))
      return Promise.reject()
    }
  }

  return (
    <PageHeaderWrapper
      style={{ margin: 0 }}
      title={intl.formatMessage({ id: 'table.purchase.zhaobiaobaoming' })}
      extra={[
        <Button
          key="1"
          onClick={() => addSchemaAction.submit()}
          loading={btnLoading}
          type="primary"
          icon={<SaveOutlined />}
        >
          {intl.formatMessage({ id: 'table.purchase.baocun' })}
        </Button>,
      ]}
    >
      <Card>
        <NiceForm
          loading={formLoading}
          previewPlaceholder=" "
          editable={pageStatus !== PageStatus.PREVIEW}
          value={initFormValue}
          actions={addSchemaAction}
          schema={formSchema}
          onSubmit={handleSubmit}
          components={{
            ArrayTable,
          }}
          effects={($, ctx) => {
            $('onFormMount').subscribe(() => {})
            useAsyncInitSelect(['phoneCode'], getCountryCodeId)
            $('onFieldValidateEnd', 'phone').subscribe((result) => {
              // 处理自定义formItem组件底部外边距问题
              const ele: any = document.getElementsByClassName('clearParentMargin')[0]
              if (result.errors.length) {
                ele.style.marginBottom = '0px'
              } else {
                ele.style.marginBottom = '24px'
              }
            })
            $('onFieldChange', 'phoneCode').subscribe((result) => {
              if (result.props.enum.length) {
                ctx.setFieldValue('phoneCode', '86')
              }
            })
          }}
          expressionScope={{
            beforeUpload,
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

AddBidRegister.defaultProps = {}

export default AddBidRegister
