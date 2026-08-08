import React, { useState, forwardRef } from 'react'
import { Radio } from 'antd'
import styles from '../index.less'
import { getIntl } from '@linkseeks/i18n'
import TableList from '../../details/components/TableList'
const intl = getIntl()
const ContractVersions = (props: any) => {
  const {
    contractId,
    // outerTaskStepList,
    // innerTaskStepList
  } = props
  const [listIndex, setlistIndex] = useState('1')
  // const [StepList, setStepList] = useState<any>([]);
  // const [currentBatch, setCurrentBatch] = useState('1');

  /**
   * 流转进度点击
   */
  const handleBatchChange = (e, key) => {
    console.log(key)
    if (key == 'Steps') {
      // const StepLists = e.target.value == 1 ? outerTaskStepList : innerTaskStepList;
      // setCurrentBatch(e.target.value);
      // setStepList(StepLists)
      return
    } else {
      setlistIndex(e.target.value)
    }
  }

  return (
    <div className={styles.noBorder}>
      {/* 流转记录 */}
      <div id="record" className="ant-card ant-card-bordered">
        <div className="ant-card-head">
          <div className="ant-card-head-wrapper">
            <div className="ant-card-head-wrapper">{intl.formatMessage({ id: 'contract.liuzhuanjilu' })}</div>
            <div className="ant-card-extra">
              <Radio.Group defaultValue={listIndex} onChange={(e) => handleBatchChange(e, 'list')}>
                <Radio.Button value="1">{intl.formatMessage({ id: 'contract.waibuliuzhuan' })}</Radio.Button>
                <Radio.Button value="2">{intl.formatMessage({ id: 'contract.neibuliuzhuan' })}</Radio.Button>
              </Radio.Group>
            </div>
          </div>
        </div>
        <div className="ant-card-body">
          <TableList contractId={contractId} listIndex={listIndex} />
        </div>
      </div>
    </div>
  )
}

export default forwardRef(ContractVersions)
