import React, { useEffect } from 'react'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { useModalTable } from '../../model/useModalTable'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import ModalSearch from '@/components/NiceForm/components/Search'
import Submit from '@/components/NiceForm/components/Submit'
import { clearModalParams, omit } from '@/utils'
import { formSearch } from '../../schema/modal'
import { inviteMemberModalColumns } from '../../constant'
import DrawerTable from '@/components/DrawerTable'
import { postMemberManageLowerProviderPage } from '@apps/apis'

export interface MemberModalProps {
  type?: 'radio' | 'checkbox'
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
}

const MemberModal: React.FC<MemberModalProps> = (props) => {
  const { type = 'checkbox', schemaAction, currentRef, ...restProps } = props

  const { visible, setVisible, rowSelection, rowSelectionCtl } = useModalTable({ type, customKey: 'memberId' })

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
    let processedData = rowSelectionCtl.selectRow.map((item) => {
      delete item['id']
      return { ...item, isSubMember: true, isSend: true }
    })
    schemaAction.setFieldValue('memberList', [])
    setTimeout(() => {
      schemaAction.setFieldValue('memberList', processedData)
    }, 300)
    clearModalParams()
  }

  const handleCancelAddMember = () => {
    setVisible(false)
    clearModalParams()
  }

  const fetchMemberList = async (params) => {
    try {
      const { data } = await postMemberManageLowerProviderPage(
        { lifeCycleStageRuleId: 1, ...params },
        { ctlType: 'none' },
      )
      return data
    } catch (error) {
      return { data: [], totalCount: 0 }
    }
  }

  return (
    <DrawerTable
      confirm={handleOkAddMember}
      cancel={handleCancelAddMember}
      visible={visible}
      columns={inviteMemberModalColumns}
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
      resetDrawer={{
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
