import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { history } from '@linkseeks/router-manager'
import { getIntl } from '@linkseeks/i18n'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'

export const controllerBtns = (
  btnCode: string,
  url: string,
  text = getIntl().formatMessage({ id: 'common.button.add', defaultMessage: '新增' }),
) => (
  <AuthButton type="custom" code={btnCode}>
    <Button type="primary" icon={<PlusOutlined />} onClick={() => history.push(url)}>
      {text}
    </Button>
  </AuthButton>
)
