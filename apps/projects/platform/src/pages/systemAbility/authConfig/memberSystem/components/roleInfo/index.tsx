import NiceForm from '@/components/NiceForm'
import { useEffect } from 'react'
import { createFormActions } from '@apps/formily'
import useRoleInfo from '../../services/hooks/useRoleInfo'
import { useRoleAuthTreeContext } from '../../services/contexts'
import { useIntl } from '@linkseeks/i18n'

export default () => {
  const { editable, roleInfo, loading } = useRoleInfo()
  const { menuActions } = useRoleAuthTreeContext()
  const intl = useIntl()

  if (loading) {
    return null
  }
  return (
    <NiceForm
      labelCol={4}
      wrapperCol={12}
      initialValues={roleInfo || {}}
      labelAlign="left"
      actions={menuActions}
      editable={editable}
      previewPlaceholder=" "
      schema={{
        type: 'object',
        properties: {
          roleName: {
            type: 'string',
            title: intl.formatMessage({ id: 'authConfig.roleName' }),
            'x-rules': [
              {
                required: true,
                message: intl.formatMessage({ id: 'common.form.input.placeholder' }),
              },
            ],
          },
          remark: {
            type: 'textarea',
            title: intl.formatMessage({ id: 'authConfig.secondName' }),
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
            type: 'boolean',
            title: intl.formatMessage({ id: 'authConfig.ifHasIM' }),
            default: true,
            // 'x-component': 'CheckboxSingle',
          },
          status: {
            type: 'number',
            title: intl.formatMessage({ id: 'authConfig.state' }),
            'x-component': 'CustomStatus',
          },
        },
      }}
    ></NiceForm>
  )
}
