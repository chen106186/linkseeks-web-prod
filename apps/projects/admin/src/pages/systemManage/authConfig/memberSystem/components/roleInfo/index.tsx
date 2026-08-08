import NiceForm from '@/components/NiceForm'
import useRoleInfo from '../../services/hooks/useRoleInfo'
import { useRoleAuthTreeContext } from '../../services/contexts'
import { PageStatus, usePageStatus } from '@/hooks/usePageStatus'
import {} from 'react'

export default () => {
  const { pageStatus } = usePageStatus()
  const { editable, roleInfo, loading } = useRoleInfo()
  const { menuActions } = useRoleAuthTreeContext()

  if (loading) {
    return null
  }

  return (
    <NiceForm
      labelCol={4}
      wrapperCol={12}
      initialValues={{ ...roleInfo, state: pageStatus === PageStatus.ADD ? 1 : roleInfo?.status } || {}}
      labelAlign="left"
      actions={menuActions}
      editable={editable}
      previewPlaceholder=" "
      schema={{
        type: 'object',
        properties: {
          roleName: {
            type: 'string',
            title: '角色名称',
            'x-rules': [
              {
                message: '请输入角色名称',
                required: true,
              },
              {
                limitByte: true,
                maxByte: 20,
              },
            ],
          },
          remark: {
            type: 'textarea',
            title: '备注',
            'x-rules': [
              {
                limitByte: true,
                maxByte: 120,
              },
            ],
            'x-component-props': {
              rows: 4,
            },
          },
          imFlag: {
            type: 'number',
            title: '是否具有IM通讯权限',
            default: 0,
            'x-component': 'CheckboxSingle',
          },
          state: {
            type: 'number',
            title: '状态',
            'x-component': 'CustomStatus',
          },
        },
      }}
    />
  )
}
