import { AuthButton } from '@apps/components'
import {
  RETURN_INNER_STATUS_NOT_ADDED_RETURN_STORAGE,
  RETURN_INNER_STATUS_UNREVIEWED_RETURN_STORAGE,
} from '@/constants/afterService'
import {
  postAftersalesReturnGoodsVerifyReturnGoodsStorage,
  getAftersalesReturnGoodsPageToBeAddReturnGoodsStorage,
} from '@apps/apis'
import { Button, Modal } from '@linkseeks/ui'
import { history } from '@linkseeks/router-manager'
import { useWebIntl } from '@apps/locales'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import ReturnManageView from '../components/ReturnManageView'

const { confirm } = Modal
const ReturnPrAddWarehousing: React.FC = () => {
  const translate = useWebIntl()
  const handleVerify = (record, tableRef) => {
    confirm({
      title: translate('web.resource.afterAbility.querenshenhecaozuo'),
      icon: <ExclamationCircleOutlined />,
      content: translate('web.resource.afterAbility.returnPrAddDeliverVerifyContent', {
        returnDeliveryNo: record.returnDeliveryNo,
      }),
      onOk() {
        return new Promise((resolve, reject) => {
          postAftersalesReturnGoodsVerifyReturnGoodsStorage({
            id: record.returnId,
          })
            .then((res) => {
              if (res.code === 1000) {
                tableRef.current.reload()
              }
              resolve(res)
            })
            .catch((err) => {
              reject(err)
            })
        })
      },
    })
  }
  const renderAction = (record, tableRef) => {
    return (
      <>
        {record.innerStatus === RETURN_INNER_STATUS_NOT_ADDED_RETURN_STORAGE && (
          <AuthButton type="add" code="add">
            <Button
              type="link"
              onClick={() =>
                history.push(
                  `/afterAbility/returnManage/returnPrAddWarehousing/add?applyId=${record.returnId}&deliveryId=${record.returnDeliveryId}`,
                )
              }
            >
              {translate('web.common.add')}
            </Button>
          </AuthButton>
        )}
        {record.innerStatus === RETURN_INNER_STATUS_UNREVIEWED_RETURN_STORAGE && (
          <AuthButton type="custom" code="verify">
            <Button type="link" onClick={() => handleVerify(record, tableRef)}>
              {translate('web.common.approved')}
            </Button>
          </AuthButton>
        )}
      </>
    )
  }
  return (
    <ReturnManageView
      pageType="returnPrAddWarehousing"
      request={getAftersalesReturnGoodsPageToBeAddReturnGoodsStorage}
      renderAction={renderAction}
    />
  )
}

export default ReturnPrAddWarehousing
