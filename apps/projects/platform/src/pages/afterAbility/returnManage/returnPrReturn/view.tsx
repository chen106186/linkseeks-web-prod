import { getAftersalesReturnGoodsPageToBeRefund } from '@apps/apis'

import { AuthButton } from '@apps/components'
import { Button } from '@linkseeks/ui'
import { history } from '@linkseeks/router-manager'
import { useWebIntl } from '@apps/locales'
import ReturnManageView from '../components/ReturnManageView'

const ReturnPrReturn: React.FC = () => {
  const translate = useWebIntl()
  const renderAction = (record) => {
    return (
      <>
        <AuthButton type="custom" code="edit">
          <Button
            type="link"
            onClick={() => history.push(`/afterAbility/returnManage/returnPrReturn/edit?id=${record.returnId}`)}
          >
            {translate('web.resource.afterAbility.tuikuan')}
          </Button>
        </AuthButton>
      </>
    )
  }
  return (
    <ReturnManageView
      pageType="returnPrReturn"
      request={getAftersalesReturnGoodsPageToBeRefund}
      renderAction={renderAction}
    />
  )
}

export default ReturnPrReturn
