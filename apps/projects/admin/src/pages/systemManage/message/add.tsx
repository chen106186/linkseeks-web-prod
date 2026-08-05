import React, { useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Button, Card } from 'antd'
import { history } from '@linkseeks/router-manager'
import NiceForm from '@/components/NiceForm'
import { createFormActions, FormButtonGroup, Reset, Submit, FormEffectHooks } from '@apps/formily'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import ReturnEle from '@/components/ReturnEle'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { postSupportPlatformSend } from '@apps/apis'
import { getMemberManageRoleAll } from '@apps/apis'
const addSchemaAction = createFormActions()

interface Irole {
  label: string
  value: number
}

type SubmitType = {
  /** 消息标题 */
  title: string
  /** 消息内容 */
  content: string
  /** 跳转链接 */
  url: string
  /** 发送对象 */
  roleIds: number
}

const AddMessage: React.FC<{}> = () => {
  const [roles, setRoles] = useState<Irole[]>([])
  const { pageStatus } = usePageStatus()
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = async (val: SubmitType) => {
    setLoading(true)
    const postData = {
      ...val,
      roleIds: val.roleIds === 0 ? roles.map((item) => item.value) : [val.roleIds],
    }
    const { data, code } = await postSupportPlatformSend(postData)
    setLoading(false)
    if (code === 1000) {
      history.goBack()
    }
  }
  const getSendTargets = async () => {
    const res = await getMemberManageRoleAll()
    if (res.code === 1000) {
      return [{ label: '所有', value: 0 }].concat(
        res.data.map((item) => ({ label: item.roleName, value: item.roleId })),
      )
    }
    return []
  }

  const creatEffect = () => ($) => {
    useAsyncSelect('roleIds', getSendTargets)
    $('requestAsyncSelect', 'roleIds').subscribe((state) => {
      setRoles(state.payload)
    })
  }

  return (
    <PageHeaderWrapper title="新建消息">
      <Card>
        <NiceForm
          labelCol={4}
          labelAlign="left"
          wrapperCol={12}
          editable={pageStatus !== PageStatus.PREVIEW}
          actions={addSchemaAction}
          schema={{
            type: 'object',
            properties: {
              roleIds: {
                type: 'string',
                title: '发送对象',
                required: true,
                enum: [],
              },
              title: {
                type: 'textarea',
                title: '发送标题',
                'x-rules': [
                  {
                    required: true,
                  },
                  {
                    limitByte: true,
                    maxByte: 120,
                  },
                ],
                'x-component-props': {
                  rows: 4,
                },
              },
              url: {
                type: 'string',
                title: '消息跳转链接',
              },
              content: {
                type: 'textarea',
                title: '消息内容',
                required: true,
                'x-rules': [
                  {
                    required: true,
                  },
                  {
                    limitByte: true,
                    maxByte: 200,
                  },
                ],
                'x-component-props': {
                  rows: 4,
                },
              },
            },
          }}
          onSubmit={handleSubmit}
          effects={creatEffect()}
        >
          <FormButtonGroup offset={4}>
            <Submit loading={loading}>发送</Submit>
            {/* <Button onClick={()=>history.goBack()}>取消</Button> */}
          </FormButtonGroup>
        </NiceForm>
      </Card>
    </PageHeaderWrapper>
  )
}

export default AddMessage
