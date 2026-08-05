/* 流转记录的组建 */
import React, { useState, useRef } from 'react'
import { Radio } from 'antd'
import { IAntdSchemaFormProps } from '@apps/formily'
import StandardTable from '@/components/StandardTable'
import { getContractCoordinationPageInnerRecordList, getContractCoordinationPageOuterRecordList } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
export interface Iprops extends IAntdSchemaFormProps {
  /* 显示隐藏 */
  contractId
}
const circulation: React.FC<Iprops> = ({ contractId }) => {
  const [listIndex, setlistIndex] = useState('1')
  const ref = useRef({})
  const intl = getIntl()
  /* 流转列表 */
  const CirculationList: any = [
    {
      title: intl.formatMessage({ id: 'contract.xuhao' }),
      dataIndex: 'name',
      align: 'center',
      render: (_, record, index) => index + 1,
    },
    { title: intl.formatMessage({ id: 'contract.caozuojuese' }), dataIndex: 'roleName', align: 'center' },
    { title: intl.formatMessage({ id: 'contract.zhuangtai' }), dataIndex: 'statusName', align: 'center' },
    { title: intl.formatMessage({ id: 'contract.caozuo' }), dataIndex: 'operate', align: 'center' },
    { title: intl.formatMessage({ id: 'contract.caozuoshijian' }), dataIndex: 'operateTime', align: 'center' },
    { title: intl.formatMessage({ id: 'contract.shenheyijian' }), dataIndex: 'opinion', align: 'center' },
  ]
  /* 内部 */
  const fetchDataListcolumns: any = [
    {
      title: intl.formatMessage({ id: 'contract.caozuoren' }),
      dataIndex: 'name',
      align: 'center',
      render: (_, record, index) => index + 1,
    },
    { title: intl.formatMessage({ id: 'contract.bumen' }), dataIndex: 'department', align: 'center' },
    { title: intl.formatMessage({ id: 'contract.zhiwei' }), dataIndex: 'jobTitle', align: 'center' },
    { title: intl.formatMessage({ id: 'contract.zhuangtai' }), dataIndex: 'statusName', align: 'center' },
    { title: intl.formatMessage({ id: 'contract.caozuo' }), dataIndex: 'operate', align: 'center' },
    { title: intl.formatMessage({ id: 'contract.caozuoshijian' }), dataIndex: 'operateTime', align: 'center' },
    { title: intl.formatMessage({ id: 'contract.shenheyijian' }), dataIndex: 'opinion', align: 'center' },
  ]
  const handleBatchChange = (e) => {
    setlistIndex(e.target.value)
    setTimeout(() => {
      ref.current.reloadCurrent()
    }, 300)
  }
  /* 流转记录内部 */
  const fetchData = (params) => {
    return new Promise((resolve, reject) => {
      let fn
      fn = listIndex == '1' ? getContractCoordinationPageOuterRecordList : getContractCoordinationPageInnerRecordList
      fn({
        ...params,
        contractId: contractId,
      })
        .then((res) => {
          console.log(res.data, listIndex)
          resolve(res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    })
  }
  return (
    <div id="record" className="ant-card ant-card-bordered">
      <div className="ant-card-head">
        <div className="ant-card-head-wrapper">
          <div className="ant-card-head-wrapper">{intl.formatMessage({ id: 'contract.liuzhuanjilu' })}</div>
          <div className="ant-card-extra">
            <Radio.Group defaultValue={listIndex} onChange={(e) => handleBatchChange(e)}>
              <Radio.Button value="1">{intl.formatMessage({ id: 'contract.waibuliuzhuan' })}</Radio.Button>
              <Radio.Button value="2">{intl.formatMessage({ id: 'contract.neibuliuzhuan' })}</Radio.Button>
            </Radio.Group>
          </div>
        </div>
      </div>
      <div className="ant-card-body">
        <StandardTable
          tableProps={{
            rowKey: 'id',
          }}
          currentRef={ref}
          columns={listIndex === '1' ? CirculationList : fetchDataListcolumns}
          fetchTableData={(params: any) => fetchData(params)}
        />
      </div>
    </div>
  )
}
export default circulation
