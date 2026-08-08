import React, { useContext, useEffect } from 'react'
import { createFormActions, FormEffectHooks, ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { Tooltip } from 'antd'
import ModalForm from '@/components/ModalForm'
import { BidDetailContext } from '@/pages/procurement/_public/bid/context'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { publicBidModalSchema } from '../../schema/modal'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { omit } from '@/utils'
import { postContractContractSignSaleSignContractCreate } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { values } from 'lodash'

const { onFormInputChange$, onFormInit$, onFieldInputChange$ } = FormEffectHooks
export interface PublicBidModalProps {
  currentRef?: any
  pageAction?: ISchemaFormActions | ISchemaFormAsyncActions
  shopInfo?: Array<any>
  inviteTenderShopList?: Array<any>
}

const schemaActions = createFormActions()

// 公开招标方式 发布商城弹窗
const PublicBidModal: React.FC<PublicBidModalProps> = (props) => {
  const { pageStatus } = usePageStatus()
  const intl = getIntl()

  const { currentRef, pageAction, shopInfo, inviteTenderShopList, ...restProps } = props
  const { data } = useContext(BidDetailContext)
  const { run, loading } = useHttpRequest(postContractContractSignSaleSignContractCreate, {
    ctlType: 'none',
  })

  const handleSubmit = async (value) => {
    console.log('选中value', value)
    const { publishShop } = value
    const result = shopInfo.filter((item) => publishShop.includes(item.id))
    pageAction.setFieldValue(
      'inviteTenderShopList',
      result.map((item) => {
        item.shopId = item['id']
        return omit(item, ['id'])
      }),
    )
    // if (pageStatus === PageStatus.ADD){
    //   pageAction.setFieldValue(
    //     'inviteTenderShopList',
    //     result.map(item => {
    //       item.shopId = item['id'];
    //       return omit(item, ['id']);
    //     }),
    //   );
    //   console.log('result--------',result)
    // }

    // else if (pageStatus === PageStatus.EDIT){
    //   console.log('result--------2222',result)
    //   pageAction.setFieldValue('inviteTenderShopList', result);
    // }

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
  console.log('inviteTenderShopList', inviteTenderShopList)
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
        const { setFieldState } = actions
        onFormInit$().subscribe(() => {
          schemaActions.setFieldState('publishShop', (state) => {
            state.props.enum = shopInfo?.map((item) => ({
              label: item.name,
              value: item.id,
            }))
          })
          if (inviteTenderShopList?.length) {
            setTimeout(() => {
              schemaActions.setFieldValue(
                'publishShop',
                inviteTenderShopList.map((item) => {
                  return item.shopId
                }),
              )
            }, 200)
          }
        })
      }}
      expressionScope={{
        help,
      }}
    />
  )
}

PublicBidModal.defaultProps = {}

export default PublicBidModal
