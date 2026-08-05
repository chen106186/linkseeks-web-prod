import React, { forwardRef, useImperativeHandle } from 'react'
import { Form, FormInstance, Card, Radio } from 'antd'
import cx from 'classnames'
import { useIntl } from '@linkseeks/i18n'
import { useWebIntl } from '@apps/locales'
import useMemberType from '../../services/hooks/useMemberType'
import styles from './index.less'

interface IProps {
  form: FormInstance<any>
  show: boolean
  onNextAction?: Function
  ref?: any
}

const Roles: React.FC<IProps> = forwardRef((props, ref) => {
  const { show } = props
  const { memberRoleList } = useMemberType(props)
  const translate = useWebIntl()

  useImperativeHandle(ref, () => {
    return {
      getMemberType: (roleId) => {
        const item = memberRoleList.find((e) => e.roleId === roleId)
        return item?.memberType || ''
      },
    }
  })

  return (
    <Form.Item hidden={!show}>
      <Form.Item
        style={{
          marginBottom: 0,
        }}
      >
        <Card bordered={false} className={styles['common-card']} title={translate('web.common.xuanzeshenfeng')}>
          <Form.Item
            style={{
              marginBottom: 0,
            }}
            name="memberRoleId"
            rules={[
              {
                required: show,
                message: translate('web.common.xuanzeshenfeng'),
              },
            ]}
          >
            <Radio.Group className={cx(styles['common-radio'], styles.role)}>
              {memberRoleList &&
                memberRoleList.map((v, i) => (
                  <Radio.Button key={v.roleId} value={v.roleId}>
                    {v.roleName}
                  </Radio.Button>
                ))}
            </Radio.Group>
          </Form.Item>
        </Card>
      </Form.Item>
    </Form.Item>
  )
})

export default Roles
