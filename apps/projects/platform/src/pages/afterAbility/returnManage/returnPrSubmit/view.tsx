import { getAftersalesReturnGoodsPageToBeSubmitBySupplier } from '@apps/apis'

import { AuthButton } from '@apps/components'
import { Button } from '@linkseeks/ui'
import { history } from '@linkseeks/router-manager'
import { useWebIntl } from '@apps/locales'
import ReturnManageView from '../components/ReturnManageView'

const ReturnPrSubmit: React.FC = () => {
  const translate = useWebIntl()
  const renderAction = (record, tableRef) => {
    return (
      <>
        <AuthButton type="custom" code="edit">
          <Button
            type="link"
            onClick={() => history.push(`/afterAbility/returnManage/returnPrSubmit/edit?id=${record.returnId}`)}
          >
            {translate('web.common.tijiaoshenhe')}
          </Button>
        </AuthButton>
      </>
    )
  }
  return (
    <ReturnManageView
      pageType="returnPrSubmit"
      request={getAftersalesReturnGoodsPageToBeSubmitBySupplier}
      renderAction={renderAction}
    />
  )
}

export default ReturnPrSubmit
