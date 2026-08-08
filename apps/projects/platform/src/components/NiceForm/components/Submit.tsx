import { QuestionCircleOutlined } from '@ant-design/icons'
import { Button, Space, Tooltip } from 'antd'
import { useIntl } from '@linkseeks/i18n'
const Submit = (props) => {
  const {
    tips, // 搜索框悬浮提示
  } = props.props['x-component-props']
  const intl = useIntl()

  return (
    <Space>
      <Button htmlType="submit" type="primary">
        {intl.formatMessage({ id: 'components.chaxun' })}
      </Button>
      {tips ? (
        <Tooltip title={intl.formatMessage({ id: 'components.dianjichaxunliebiaoke' })}>
          <QuestionCircleOutlined />
        </Tooltip>
      ) : null}
    </Space>
  )
}

Submit.defaultProps = {}

Submit.isFieldComponent = true

export default Submit
