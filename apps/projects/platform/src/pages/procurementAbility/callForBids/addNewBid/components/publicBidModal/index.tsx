import React, { useContext } from 'react'
import { createFormActions, ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { Tooltip } from 'antd'
import ModalForm from '@/components/ModalForm'
import { BidDetailContext } from '@/pages/procurement/_public/bid/context'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { publicBidModalSchema } from '../../schema/modal'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { omit } from '@/utils'
import { getCommodityShopListShopByReq, postContractContractSignSaleSignContractCreate } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'

export interface PublicBidModalProps {
  currentRef?: any
  pageAction?: ISchemaFormActions | ISchemaFormAsyncActions
}

const schemaActions = createFormActions()

// 公开招标方式 发布商城弹窗
const PublicBidModal: React.FC<PublicBidModalProps> = (props) => {
  const { pageStatus } = usePageStatus()
  const intl = getIntl()

  const { currentRef, pageAction, ...restProps } = props
  const { data } = useContext(BidDetailContext)
  const { run, loading } = useHttpRequest(postContractContractSignSaleSignContractCreate, { ctlType: 'none' })

  const handleSubmit = async (value) => {
    const { publishShop } = value
    const shopList = schemaActions.getFieldState('publishShop')?.props.enum || []
    const result = shopList.filter((item) => publishShop.includes(item.id))
    console.log(result, 'result')
    if (pageStatus === PageStatus.ADD)
      pageAction.setFieldValue(
        'inviteTenderShopList',
        result.map((item) => {
          item.shopId = item['id']
          return omit(item, ['id'])
        }),
      )
    else if (pageStatus === PageStatus.EDIT) pageAction.setFieldValue('inviteTenderShopList', result)
    currentRef.current.setVisible(false)
  }

  const handleConfirm = () => {
    schemaActions.submit()
  }

  const help = (text: string, desc: string) => (
    <>
      {text}&nbsp;
      <Tooltip title={desc}>
        <QuestionCircleOutlined />
      </Tooltip>
    </>
  )

  const fetchShopOption = async () => {
    const { data } = await getCommodityShopListShopByReq({ type: 2 } as any)
    return data
  }

  return (
    <ModalForm
      modalTitle={intl.formatMessage({ id: 'detail.purchase.modalTitle' })}
      previewPlaceholder=" "
      currentRef={currentRef}
      schema={publicBidModalSchema}
      actions={schemaActions}
      onSubmit={handleSubmit}
      confirm={handleConfirm}
      modalProps={{
        confirmLoading: loading,
      }}
      effects={($, actions) => {
        $('onFormInit').subscribe(async () => {})
        useAsyncSelect('publishShop', fetchShopOption, ['name', 'id'])
      }}
      expressionScope={{
        help,
      }}
    />
  )
}

PublicBidModal.defaultProps = {}

export default PublicBidModal
