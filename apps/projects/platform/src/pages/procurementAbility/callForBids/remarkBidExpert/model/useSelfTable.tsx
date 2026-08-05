import { useRef } from 'react'
import { Button, Popconfirm } from 'antd'
import { StatusAuthButton } from '@apps/components'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { ExpertTypeMap, SpecialityTypeMap } from '@/constants/procurement'
import { postPurchaseExpertDeleteBatchExpert, postPurchaseExpertUpdateExpertStatus } from '@apps/apis'
import { AuthButton } from '@apps/components'
const intl = getIntl()

// 评标专家库 招标
export const useSelfTable = () => {
  const ref = useRef<any>({})

  const baseBidListColumns: any[] = [
    {
      title: intl.formatMessage({ id: 'table.purchase.xuhao' }),
      align: 'left',
      dataIndex: 'id',
      key: 'id',
      render: (t, r, i) => ++i,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.expert' }),
      align: 'left',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.orgName' }),
      align: 'left',
      dataIndex: 'userOrgName',
      key: 'userOrgName',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.zhiwei' }),
      align: 'left',
      dataIndex: 'userJobTitle',
      key: 'userJobTitle',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.speciality' }),
      align: 'left',
      dataIndex: 'speciality',
      key: 'speciality',
      render: (t, r) => SpecialityTypeMap[t],
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.qualification' }),
      align: 'left',
      dataIndex: 'qualification',
      key: 'qualification',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.title' }),
      align: 'left',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.years' }),
      align: 'left',
      dataIndex: 'years',
      key: 'years',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.type' }),
      align: 'left',
      dataIndex: 'type',
      key: 'type',
      render: (t, r) => ExpertTypeMap[t],
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.zhuangtai' }),
      align: 'left',
      dataIndex: 'status',
      key: 'status',
      render: (text: any, record: any) => (
        <StatusAuthButton
          handleConfirm={() => handleUpdateState(record)}
          record={record}
          fieldNames="status"
          expectTrueValue={true}
        />
      ),
    },
  ]

  const handleUpdateState = (record) => {
    postPurchaseExpertUpdateExpertStatus({ id: record.id, status: !record.status }).then((res) => {
      if (res.code === 1000) ref.current.reloadCurrent()
    })
  }

  const handleEdit = (id) => {
    history.push(`/procurementAbility/callForBids/remarkBidExpert/edit?id=${id}`)
  }

  const handleDelete = (id) => {
    postPurchaseExpertDeleteBatchExpert({ idList: [id] }).then((res) => {
      if (res.code === 1000) ref.current.reloadCurrent()
    })
  }

  const secondColumns: any[] = baseBidListColumns.concat([
    {
      title: intl.formatMessage({ id: 'table.purchase.caozuo' }),
      align: 'left',
      dataIndex: 'ctl',
      key: 'ctl',
      render: (text, record) => (
        <>
          <AuthButton type="custom" code="edit">
            <Button type="link" onClick={() => handleEdit(record.id)}>
              {intl.formatMessage({ id: 'detail.purchase.edit' })}
            </Button>
          </AuthButton>
          <AuthButton type="custom" code="del">
            <Popconfirm
              title={intl.formatMessage({ id: 'table.purchase.quedingyaozhixing' })}
              onConfirm={() => handleDelete(record.id)}
              okText={intl.formatMessage({ id: 'table.purchase.okText' })}
              cancelText={intl.formatMessage({ id: 'table.purchase.cancelText' })}
            >
              <Button
                type="link"
                // onClick={() => handleDelete(record.id)}
              >
                {intl.formatMessage({ id: 'table.purchase.delete' })}
              </Button>
            </Popconfirm>
          </AuthButton>
        </>
      ),
    },
  ])

  return {
    columns: secondColumns,
    ref,
  }
}
