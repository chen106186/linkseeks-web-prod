import { getAftersalesReturnGoodsPageToBeVerifyStepTwo } from '@apps/apis'

import { AuthButton } from '@apps/components'
import { Button } from '@linkseeks/ui'
import { history } from '@linkseeks/router-manager'
import { useWebIntl } from '@apps/locales'
import ReturnManageView from '../components/ReturnManageView'

const ReturnPr2: React.FC = () => {
  const translate = useWebIntl()
  const renderAction = (record, tableRef) => {
    return (
      <>
        <AuthButton type="custom" code="edit">
          <Button
            type="link"
            onClick={() => history.push(`/afterAbility/returnManage/returnPr2/edit?id=${record.returnId}`)}
          >
            {translate('web.common.tijiaoshenhe')}
          </Button>
        </AuthButton>
      </>
    )
  }
  return (
    <ReturnManageView
      pageType="returnPr2"
      request={getAftersalesReturnGoodsPageToBeVerifyStepTwo}
      renderAction={renderAction}
    />
  )
}

export default ReturnPr2
