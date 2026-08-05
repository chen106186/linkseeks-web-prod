import React, { useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { useModalTable } from '../../model/useModalTable'
import ModalTable from '@/components/ModalTable'
import { columnsSetMemberLevel } from '../../constant'
import { formSearch, formSearchMemberLevel } from '../../schema'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import ModalSearch from '@/components/NiceForm/components/Search'
import Submit from '@/components/NiceForm/components/Submit'
import { PageStatus, usePageStatus } from '@/hooks/usePageStatus'
import { clearModalParams } from '@/utils'
import { getMemberAbilityLevelConsumerPage } from '@apps/apis'

export interface MemberLevelModalProps {
  type?: 'radio' | 'checkbox'
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
}

const MemberLevelModal: React.FC<MemberLevelModalProps> = (props) => {
  const { type = 'checkbox', schemaAction, currentRef, ...restProps } = props
  const intl = useIntl()
  const { visible, setVisible, rowSelection, rowSelectionCtl } = useModalTable({ type, customKey: 'levelId' })

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

  // 添加会员等级
  const handleOkAddMemberLevel = () => {
    setVisible(false)

    if (pageStatus === PageStatus.EDIT) {
      schemaAction.setFieldState('commodityMemberLevelList', (state) => {
        state.isDelete = true
      })
      // let hasMember: any = schemaAction.getFieldValue('commodityMemberLevelList') || []
      // schemaAction.setFieldValue('commodityMemberLevelList', hasMember.concat(rowSelectionCtl.selectRow))
      // rowSelectionCtl.setSelectedRowKeys([])
      // rowSelectionCtl.setSelectRow([])
      schemaAction.setFieldValue('commodityMemberLevelList', rowSelectionCtl.selectRow)
    } else {
      schemaAction.setFieldValue('commodityMemberLevelList', rowSelectionCtl.selectRow)
      schemaAction.setFieldState('commodityMemberLevelList', (state) => {
        state.dataSource = rowSelectionCtl.selectRow
      })
    }
    clearModalParams()
  }

  const handleCancelAddMemberLevel = () => {
    setVisible(false)
    clearModalParams()
  }

  const fetchMemberLevelList = async (params) => {
    const res = await getMemberAbilityLevelConsumerPage(params, { ctlType: 'none' })
    return res.data
  }

  return (
    <ModalTable
      modalTitle={intl.formatMessage({ id: 'priceManage.priceStrategy.memberModal.modalTitle1' })}
      confirm={handleOkAddMemberLevel}
      cancel={handleCancelAddMemberLevel}
      visible={visible}
      columns={columnsSetMemberLevel}
      rowSelection={rowSelection}
      fetchTableData={(params) => fetchMemberLevelList(params)}
      formilyProps={{
        ctx: {
          schema: formSearchMemberLevel,
          components: {
            ModalSearch,
            Submit,
          },
          effects: ($, actions) => {
            actions.reset()
            useStateFilterSearchLinkageEffect($, actions, 'levelTag', FORM_FILTER_PATH)
          },
        },
      }}
      resetModal={{
        destroyOnClose: true,
      }}
      tableProps={{
        rowKey: 'levelId',
      }}
    />
  )
}

MemberLevelModal.defaultProps = {}

export default MemberLevelModal
