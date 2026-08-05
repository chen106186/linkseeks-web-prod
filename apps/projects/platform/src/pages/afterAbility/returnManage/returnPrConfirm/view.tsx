import { getAftersalesReturnGoodsPageToBeConfirmVerify } from '@apps/apis'

import { AuthButton } from '@apps/components'
import { Button } from '@linkseeks/ui'
import { history } from '@linkseeks/router-manager'
import { useWebIntl } from '@apps/locales'
import ReturnManageView from '../components/ReturnManageView'

const ReturnPrConfirm: React.FC = () => {
  const translate = useWebIntl()
  const renderAction = (record) => {
    return (
      <>
        <AuthButton type="custom" code="edit">
          <Button
            type="link"
            onClick={() => history.push(`/afterAbility/returnManage/returnPrConfirm/edit?id=${record.returnId}`)}
          >
            {translate('web.resource.afterAbility.querenshenqingdan')}
          </Button>
        </AuthButton>
      </>
    )
  }
  return (
    <ReturnManageView
      pageType="returnPrConfirm"
      request={getAftersalesReturnGoodsPageToBeConfirmVerify}
      renderAction={renderAction}
    />
  )
}

export default ReturnPrConfirm
