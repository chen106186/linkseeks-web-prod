import React, { useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { useModalTable } from '../../model/useModalTable'
import ModalTable from '@/components/ModalTable'
import { columnsSetMember } from '../../constant'
import { formSearch } from '../../schema'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import ModalSearch from '@/components/NiceForm/components/Search'
import Submit from '@/components/NiceForm/components/Submit'
import { PageStatus, usePageStatus } from '@/hooks/usePageStatus'
import { clearModalParams } from '@/utils'
import { getProductCommodityUnitPriceStrategyGetStrategyMemberByCommodityId } from '@apps/apis'
import { postMemberManageLowerConsumerPage } from '@apps/apis'

export interface MemberModalProps {
  type?: 'radio' | 'checkbox'
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
}

const MemberModal: React.FC<MemberModalProps> = (props) => {
  const { type = 'checkbox', schemaAction, currentRef, ...restProps } = props
  const intl = useIntl()
  const { visible, setVisible, rowSelection, rowSelectionCtl } = useModalTable({ type, customKey: 'memberId' })

  const { id, preview, pageStatus } = usePageStatus()

  useEffect(() => {
    if (currentRef) {
      currentRef.current = {
        setVisible,
        visible,
        rowSelectionCtl,
      }
    }
  }, [])

  // 添加会员
  const handleOkAddMember = () => {
    setVisible(false)
    // let hasMember: any = schemaAction.setFieldValue('commodityMemberList') || []
    // // schemaAction.setFieldValue('commodityMemberList', hasMember.concat(rowSelectionCtl.selectRow))
    // schemaAction.setFieldValue('commodityMemberList', rowSelectionCtl.selectRow)
    // // rowSelectionCtl.setSelectedRowKeys([])

    if (pageStatus === PageStatus.EDIT) {
      schemaAction.setFieldState('commodityMemberList', (state) => {
        state.isDelete = true
      })
      let hasMember: any = schemaAction.getFieldValue('commodityMemberList') || []
      schemaAction.setFieldValue('commodityMemberList', hasMember.concat(rowSelectionCtl.selectRow))
      rowSelectionCtl.setSelectedRowKeys([])
      rowSelectionCtl.setSelectRow([])
    } else {
      schemaAction.setFieldValue('commodityMemberList', rowSelectionCtl.selectRow)
      schemaAction.setFieldState('commodityMemberList', (state) => {
        state.dataSource = rowSelectionCtl.selectRow
      })
    }
    clearModalParams()
  }

  const handleCancelAddMember = () => {
    setVisible(false)
    clearModalParams()
  }

  const fetchMemberList = async (params) => {
    const excludeIds = await getProductCommodityUnitPriceStrategyGetStrategyMemberByCommodityId(
      {
        commodityId: schemaAction.getFieldValue('productId'),
        shopId: schemaAction.getFieldValue('shopId'),
      },
      { ctlType: 'none' },
    )
    let checkedMember = schemaAction.getFieldValue('commodityMemberList')
    if (schemaAction.getFieldState('commodityMemberList').isDelete) {
      params.excludeList = checkedMember.map((item) => ({
        memberId: item.memberId,
        roleId: item.roleId,
      }))
    } else {
      params.excludeList = excludeIds.data.map((item) => ({
        memberId: item.memberId,
        roleId: item.memberRoleId,
      }))
    }
    const res = await postMemberManageLowerConsumerPage(params, { ctlType: 'none' })
    return res.data
  }

  return (
    <ModalTable
      modalTitle={intl.formatMessage({ id: 'priceManage.priceStrategy.memberModal.modalTitle' })}
      confirm={handleOkAddMember}
      cancel={handleCancelAddMember}
      visible={visible}
      columns={columnsSetMember}
      rowSelection={rowSelection}
      fetchTableData={(params) => fetchMemberList(params)}
      formilyProps={{
        ctx: {
          schema: formSearch,
          components: {
            ModalSearch,
            Submit,
          },
          effects: ($, actions) => {
            actions.reset()
            useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
          },
        },
      }}
      resetModal={{
        destroyOnClose: true,
      }}
      tableProps={{
        rowKey: 'memberId',
      }}
    />
  )
}

MemberModal.defaultProps = {}

export default MemberModal
