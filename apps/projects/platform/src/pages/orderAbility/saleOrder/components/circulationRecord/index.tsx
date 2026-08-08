import React, { useRef, useEffect, useState, useContext } from 'react'
import { Button, Table } from 'antd'
import StandardTable from '@/components/StandardTable'
import { formatTimeString } from '@/utils'
import './index.less'
import cx from 'classnames'
import { ReadyAddOrderDetailContext } from '../../context'
import StatusColors from '@/components/StatusColors'
import { useIntl } from '@linkseeks/i18n'

export interface CirculationRecordProps {}

const CirculationRecord: React.FC<CirculationRecordProps> = (props) => {
  const intl = useIntl()

  /**
   * 流转记录控制
   */
  const outOrderCols: any[] = [
    {
      title: intl.formatMessage({ id: 'saleOrder.liuzhuanshunxuhao', defaultMessage: '流转顺序号' }),
      dataIndex: 'no',

      key: 'no',
      render: (_, __, index: number) => index + 1,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.caozuojuese', defaultMessage: '操作角色' }),
      dataIndex: 'roleName',

      key: 'roleName',
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.zhuangtai', defaultMessage: '状态' }),
      dataIndex: 'state',

      key: 'state',
      render: (text) => <StatusColors status={text} type="out" />,
      // @todo 需传递工作流状态重新render
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.caozuo', defaultMessage: '操作' }),
      dataIndex: 'operation',

      key: 'operation',
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.caozuoshijian', defaultMessage: '操作时间' }),
      dataIndex: 'operationTime',

      key: 'operationTime',
      render: (time) => formatTimeString(time),
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.shenheyijian', defaultMessage: '审核意见' }),
      dataIndex: 'auditOpinion',

      key: 'auditOpinion',
    },
  ]
  const sideOrderCols: any[] = [
    {
      title: intl.formatMessage({ id: 'saleOrder.liuzhuanjilu', defaultMessage: '流转记录' }),
      dataIndex: 'no',

      key: 'no',
      render: (_, __, index: number) => index + 1,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.caozuoren', defaultMessage: '操作人' }),
      dataIndex: 'roleName',

      key: 'roleName',
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.bumen', defaultMessage: '部门' }),
      dataIndex: 'department',

      key: 'department',
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.zhiwei', defaultMessage: '职位' }),
      dataIndex: 'position',

      key: 'position',
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.zhuangtai', defaultMessage: '状态' }),
      dataIndex: 'state',

      key: 'state',
      render: (text) => <StatusColors status={text} type="inside" />,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.caozuo', defaultMessage: '操作' }),
      dataIndex: 'operation',

      key: 'operation',
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.caozuoshijian', defaultMessage: '操作时间' }),
      dataIndex: 'operationTime',

      key: 'operationTime',
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.shenheyijian', defaultMessage: '审核意见' }),
      dataIndex: 'auditOpinion',

      key: 'auditOpinion',
    },
  ]

  const colRef = useRef<any>({
    columns: outOrderCols,
  })
  const { detailData } = useContext(ReadyAddOrderDetailContext)
  const [orderState, setOrderState] = useState<number>(0)
  const [dataSource, setDataSource] = useState<any>([])
  useEffect(() => {
    if (detailData) {
      colRef.current = {
        columns: orderState === 1 ? sideOrderCols : outOrderCols,
      }
      setDataSource(
        orderState === 1
          ? detailData.interiorProcurementOrderLogResponses
          : detailData.externalProcurementOrderLogResponses,
      )
    }
  }, [colRef, orderState, detailData])
  return (
    <div>
      <div className="com-switch-btn-group" style={{ margin: '20px 0' }}>
        <div className={cx('switch-btn', orderState === 0 ? 'active' : '')} onClick={() => setOrderState(0)}>
          {intl.formatMessage({ id: 'saleOrder.waibudanju', defaultMessage: '外部单据' })}
        </div>
        <div className={cx('switch-btn', orderState === 1 ? 'active' : '')} onClick={() => setOrderState(1)}>
          {intl.formatMessage({ id: 'saleOrder.neibudanju', defaultMessage: '内部单据' })}
        </div>
      </div>
      <Table columns={colRef.current.columns} dataSource={dataSource} rowKey="id" />
    </div>
  )
}

CirculationRecord.defaultProps = {}

export default CirculationRecord
