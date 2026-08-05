import React, { useEffect, useState, useRef } from 'react'
import { Modal } from 'antd'
import { getContractContractSignOrderSettleSignDetail } from '@apps/apis'

export interface SimpleElectronModalProps {
  currentRef: any
  schemaAction?: any
}

const SimpleElectronModal: React.FC<SimpleElectronModalProps> = (props) => {
  const { currentRef, schemaAction } = props
  // @ts-ignore
  const [visible, setVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const signatureState = useRef(null)

  // 合同信息
  const contracts = schemaAction.getFieldState('usingElectronicContracts').props['x-component-props'].contract

  let timer = null

  useEffect(() => {
    return () => {
      clearInterval(timer)
      timer = null
    }
  }, [])

  useEffect(() => {
    currentRef.current = {
      visible,
      setVisible,
    }
  }, [])

  const handleSubmit = async () => {
    setConfirmLoading(true)
    // const res = await run(contracts)
    // const res = await postOrderContractSignProcurementOneStepSign(contracts, { ctlType: "none" })
    // if(res.code === 1000) {
    //   timer = setInterval(() => {
    //     if (signatureState.current !== 4) {
    //       getContractContractSignOrderSettleSignDetail({signatureLogId: res.data.signatureLogId + ''}).then(_res => {
    //         if(_res.code === 1000) {
    //           signatureState.current = _res.data.state
    //           if(_res.data.state === 4) {
    //             schemaAction.setFieldValue("electronicContractUrl", _res.data.contractUrl)
    //           }
    //         } else {
    //           clearInterval(timer)
    //           timer = null
    //           signatureState.current = null
    //         }
    //       })
    //     } else {
    //       clearInterval(timer)
    //       timer = null
    //       signatureState.current = null
    //       setVisible(false)
    //       schemaAction.setFieldValue("signatureLogId", res.data.signatureLogId)
    //       // message.success("操作成功")
    //     }
    //   }, 2000)
    // }
  }

  return (
    <Modal
      width={1000}
      style={{ minHeight: 600 }}
      title="签署电子合同"
      okText="签署合同并提交"
      cancelText="不签署"
      visible={visible}
      onOk={handleSubmit}
      confirmLoading={confirmLoading}
      onCancel={() => setVisible(false)}
    >
      {contracts && (
        <div style={{ height: 600, position: 'relative' }}>
          <iframe
            src={contracts.contractUrl}
            style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', display: 'block' }}
          />
        </div>
      )}
    </Modal>
  )
}

SimpleElectronModal.defaultProps = {}

export default SimpleElectronModal
function postOrderContractSignProcurementOneStepSign(contracts: any, arg1: { ctlType: string }) {
  throw new Error('Function not implemented.')
}
