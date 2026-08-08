import { getAftersalesReturnGoodsPageToBeSubmitByConsumer } from '@apps/apis'
import ReturnApplicationView from '../components/returnApplicationView'
import { history } from '@linkseeks/router-manager'
import { useWebIntl } from '@apps/locales'
import { PlusOutlined } from '@ant-design/icons'

const ReturnPrSubmit: React.FC = () => {
  const translate = useWebIntl()
  return (
    <ReturnApplicationView
      request={getAftersalesReturnGoodsPageToBeSubmitByConsumer}
      pageType="returnPrSubmit"
      searchButtons={[
        {
          key: 'add',
          children: translate('web.resource.logistics.xinjian'),
          type: 'primary',
          icon: <PlusOutlined />,
          onClick() {
            history.push('/afterAbility/returnApplication/returnPrSubmit/add')
          },
        },
      ]}
    />
  )
}
export default ReturnPrSubmit
