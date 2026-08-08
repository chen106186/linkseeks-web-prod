import React, { useEffect, useRef } from 'react'
import { Drawer, Button } from 'antd'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import { createFormActions } from '@apps/formily'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { formSearch } from '../../../schema'
import { postMemberManageLowerProviderPage } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'

const formActions = createFormActions()

interface Iprops {
  rowCtl?: any
  visible: boolean
  onclose?()
  confirm?(e: any)
}
const intl = getIntl()
const SelectMenber: React.FC<Iprops> = (props: any) => {
  const ref = useRef({})
  const { visible, onclose, confirm, rowCtl } = props
  const [rowSelection, RowCtl] = useRowSelectionTable({ customKey: 'memberId' })
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'detail.purchase.memberId' }),
      key: 'memberId',
      dataIndex: 'memberId',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.memberName' }),
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.lifeCycleStage' }),
      key: 'lifeCycleStageName',
      dataIndex: 'lifeCycleStageName',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.depositTime' }),
      key: 'depositTime',
      dataIndex: 'depositTime',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.leveTag' }),
      key: 'levelTag',
      dataIndex: 'levelTag',
    },
  ]
  const fetchGoodsData = async (params) => {
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

  useEffect(() => {
    if (rowCtl) {
      console.log(rowCtl)
      RowCtl.setSelectRow(rowCtl)
      RowCtl.setSelectedRowKeys(rowCtl.map((v) => v.memberId))
    }
  }, [visible])

  return (
    <Drawer
      visible={visible}
      onClose={onclose}
      title={intl.formatMessage({ id: 'detail.purchase.selectMenber' })}
      width={900}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={onclose} style={{ marginRight: 8 }}>
            {intl.formatMessage({ id: 'detail.purchase.cancel' })}
          </Button>
          <Button onClick={() => confirm(RowCtl)} type="primary">
            {intl.formatMessage({ id: 'detail.purchase.confirm' })}
          </Button>
        </div>
      }
    >
      <StandardTable
        currentRef={ref}
        columns={columns}
        tableProps={{ rowKey: 'memberId' }}
        rowSelection={rowSelection}
        fetchTableData={(params) => fetchGoodsData(params)}
        formilyProps={{
          ctx: { schema: formSearch },
        }}
      />
    </Drawer>
  )
}
export default SelectMenber
