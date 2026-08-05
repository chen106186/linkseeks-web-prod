import { getAftersalesReturnGoodsPageToBeReturnReceiveGoods } from '@apps/apis'

import { AuthButton } from '@apps/components'
import { Button } from '@linkseeks/ui'
import { history } from '@linkseeks/router-manager'
import { useWebIntl } from '@apps/locales'
import ReturnManageView from '../components/ReturnManageView'

const ReturnPrReceived: React.FC = () => {
  const translate = useWebIntl()
  const renderAction = (record) => {
    return (
      <>
        <AuthButton type="custom" code="edit">
          <Button
            type="link"
            onClick={() => history.push(`/afterAbility/returnManage/returnPrReceived/edit?id=${record.returnId}`)}
          >
            {translate('web.resource.afterAbility.tuihuoshouhuo')}
          </Button>
        </AuthButton>
      </>
    )
  }
  return (
    <ReturnManageView
      pageType="returnPrReceived"
      request={getAftersalesReturnGoodsPageToBeReturnReceiveGoods}
      renderAction={renderAction}
    />
  )
}

export default ReturnPrReceived
