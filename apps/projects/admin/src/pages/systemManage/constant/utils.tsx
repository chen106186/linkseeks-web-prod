import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { history } from '@linkseeks/router-manager'
import { AddAuthButton } from '@apps/components'

export const controllerBtns = (url: string, text = '新增') => (
  <AddAuthButton>
    <Button type="primary" icon={<PlusOutlined />} onClick={() => history.push(url)}>
      {text}
    </Button>
  </AddAuthButton>
)
