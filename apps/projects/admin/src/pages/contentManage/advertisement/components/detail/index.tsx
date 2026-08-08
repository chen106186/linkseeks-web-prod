import React, { useState } from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import { createFormActions, FormButtonGroup, Submit, FormEffectHooks } from '@apps/formily'
import advertisementInfoSchema from '../../schema/advertisementInfoSchema'
import { Select, Button, Card } from 'antd'
import { useInitialValues } from '../../../hooks/useInitialValues'
import CustomUpload from '../../../components/WrapCustomUpload'
import { ADVERTISE_WEB_COLUMN_TYPE, ADVERTISE_APP_COLUMN_TYPE } from '../../../utils/utils'
import { getManageContentAdvertGet, postManageContentAdvertAdd, postManageContentAdvertUpdate } from '@apps/apis'
import NiceForm from '@/components/NiceForm'
import { PageHeaderWrapper } from '@apps/components'

enum ChannelEnum {
  WEB = 1,
  APP = 2,
}

const WEB_COLUMN_TYPE = Object.keys(ADVERTISE_WEB_COLUMN_TYPE).map((item) => {
  return {
    label: ADVERTISE_WEB_COLUMN_TYPE[item],
    value: item,
  }
})
const APP_COLUMN_TYPE = Object.keys(ADVERTISE_APP_COLUMN_TYPE).map((item) => {
  return {
    label: ADVERTISE_APP_COLUMN_TYPE[item],
    value: item,
  }
})

const actions = createFormActions()
const { onFieldValueChange$ } = FormEffectHooks

const AdvertisementInfo: React.FC = () => {
  const { id, preview } = usePageStatus()
  const initialValues = useInitialValues({ id: id }, getManageContentAdvertGet)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [unsaved, setUnsaved] = useState(true)
  const isEdit = id && !preview
  const isAdd = !id && !preview
  usePrompt({ when: unsaved && (isAdd || isEdit), message: '内容未保存，确定离开？' })

  const handleSubmit = (value) => {
    const serviceActions = isAdd ? postManageContentAdvertAdd : postManageContentAdvertUpdate

    const tempData = value
    const postData = isAdd ? tempData : { ...tempData, id }
    setSubmitLoading(true)
    setUnsaved(false)
    serviceActions(postData).then((data) => {
      setSubmitLoading(false)
      if (data.code === 1000) {
        history.goBack()
      }
    })
  }

  const formEffects = () => () => {
    onFieldValueChange$('channel').subscribe((fieldState) => {
      const isActive = fieldState.active
      let options: { label: string; value: number | string }[] = []
      if (fieldState.value === ChannelEnum.WEB) {
        options = WEB_COLUMN_TYPE
      } else {
        options = APP_COLUMN_TYPE
      }

      actions.setFieldState('columnType', (state) => {
        state.props['enum'] = options
        if (isActive) {
          state.value = ''
        }
      })
    })
  }
  const handleCancel = () => {
    history.goBack()
  }

  return (
    <PageHeaderWrapper title={isAdd ? '新建广告' : isEdit ? '编辑广告' : '查看广告'}>
      <Card>
        <NiceForm
          schema={advertisementInfoSchema}
          actions={actions}
          components={{
            Select,
            Submit,
            CustomUpload,
          }}
          initialValues={initialValues?.data}
          onSubmit={handleSubmit}
          editable={isAdd || isEdit}
          effects={formEffects()}
        >
          {isAdd || isEdit ? (
            <FormButtonGroup offset={3}>
              <Submit loading={submitLoading}>提交</Submit>
              <Button onClick={handleCancel}>取消</Button>
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
