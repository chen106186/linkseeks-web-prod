import React, { useState } from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import { createFormActions, FormButtonGroup, Submit } from '@apps/formily'
import advertisementInfoSchema from './schema/advertisementInfoSchema'
import { Select, Button, Card } from 'antd'
import useInitialValue from '@/hooks/useInitialValue'
import CustomUpload from '../components/WrapCustomUpload'
import { ADVERTISE_WEB_COLUMN_TYPE } from '../utils/utils'
import { getManageMemberAdvertGet, postManageMemberAdvertAdd, postManageMemberAdvertUpdate } from '@apps/apis'
import NiceForm from '@/components/NiceForm'
import { PageHeaderWrapper } from '@apps/components'

export const WEB_COLUMN_TYPE = Object.keys(ADVERTISE_WEB_COLUMN_TYPE).map((item) => {
  return {
    label: ADVERTISE_WEB_COLUMN_TYPE[item],
    value: parseInt(item),
  }
})

const actions = createFormActions()

const AdvertisementInfo: React.FC = () => {
  // useCustomValidator()
  const intl = useIntl()
  const { id, preview } = usePageStatus()
  const { initialValue } = useInitialValue(getManageMemberAdvertGet, { id: id })
  const [submitLoading, setSubmitLoading] = useState(false)
  const [unsaved, setUnsaved] = useState(true)
  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })
  const isEdit = id && !preview
  const isAdd = !id && !preview
  const isView = id && preview

  const handleSubmit = (value) => {
    const serviceActions = isAdd ? postManageMemberAdvertAdd : postManageMemberAdvertUpdate

    let tempData = value
    const postData = isAdd ? tempData : { ...tempData, id }
    setSubmitLoading(true)
    setUnsaved(false)
    serviceActions(postData).then((data) => {
      setSubmitLoading(false)
      if (data.code === 1000) {
        history.push('/contentAbility/advertisement')
      }
    })
  }

  const handleCancel = () => {
    history.push('/contentAbility/advertisement')
  }

  return (
    <PageHeaderWrapper
      title={
        isAdd
          ? intl.formatMessage({ id: 'advertisement.add' })
          : isEdit
          ? intl.formatMessage({ id: 'advertisement.edit' })
          : intl.formatMessage({ id: 'advertisement.detail' })
      }
    >
      <Card>
        <NiceForm
          schema={advertisementInfoSchema}
          actions={actions}
          components={{
            Select,
            Submit,
            CustomUpload,
          }}
          initialValues={initialValue}
          onSubmit={handleSubmit}
          editable={isAdd || isEdit}
          expressionScope={{
            label: (
              <div>
                {isAdd || isEdit ? <span style={{ color: '#ff4d4f' }}>* </span> : null}
                {intl.formatMessage({ id: 'advertisement.img' })}
              </div>
            ),
          }}
        >
          {isAdd || isEdit ? (
            <FormButtonGroup offset={3}>
              <Submit loading={submitLoading}>{intl.formatMessage({ id: 'common.button.submit' })}</Submit>
              <Button onClick={handleCancel}>{intl.formatMessage({ id: 'common.button.cancel' })}</Button>
            </FormButtonGroup>
          ) : (
            <></>
          )}
        </NiceForm>
      </Card>
    </PageHeaderWrapper>
  )
}

export default AdvertisementInfo
