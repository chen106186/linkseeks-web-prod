import { Loading } from '@apps/components'
import {
  postMemberMemberRoleConfigSetRegisterProcess,
  getMemberMemberRoleConfigFindRegisterProcessByRoleId,
} from '@apps/apis'
import type { ModalProps } from 'antd'
import { Col, Modal, Radio, Row, Checkbox } from 'antd'
import React, { useEffect, useState } from 'react'
import './memberFlow.less'
import type { CheckboxChangeEvent } from 'antd/lib/checkbox'
import classNames from 'classnames'

export interface MemberFlowProps extends ModalProps {
  memberInfo: any
}

const MemberFlow: React.FC<MemberFlowProps> = (props) => {
  const [flowList, setFlowList] = useState<any[]>([])
  const [processKey, setProcessKey] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const { open, ...restProps } = props
  const [isShow, setIsShow] = useState<boolean>(true)

  useEffect(() => {
    if (open) {
      setLoading(true)
      getMemberMemberRoleConfigFindRegisterProcessByRoleId({
        id: props.memberInfo.id,
      })
        .then((res) => {
          setProcessKey(res.data.processKey)
          setFlowList(res.data.processes)
          setIsShow(res.data.isShow)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [open])

  const handleConfirm = async (e) => {
    if (!processKey) {
      props.onCancel && props.onCancel(e)
      return false
    }
    const { code } = await postMemberMemberRoleConfigSetRegisterProcess({
      id: props.memberInfo.id,
      processKey,
      isShow,
    })
    if (code === 1000) {
      setProcessKey('')
      props.onCancel && props.onCancel(e)
    }
  }

  const handleRadio = (e, id) => {
    setProcessKey(e.target.checked ? id : 0)
  }
  const onChange = (e: CheckboxChangeEvent) => {
    setIsShow(e.target.checked)
  }

  return (
    <Modal title="会员流程配置" open={open} width={800} onOk={handleConfirm} {...restProps}>
      <Row>
        <Checkbox
          className={classNames('member-flow-top', isShow ? 'member-flow-top-show' : '')}
          checked={isShow}
          onChange={onChange}
        >
          商城注册入口展示该会员角色
        </Checkbox>
      </Row>
      <Row className="member-flow-header">
        <Col span={8}>流程名称</Col>
        <Col span={8}>流程类型</Col>
        <Col span={8}>流程说明</Col>
      </Row>
      {loading ? (
        <Loading />
      ) : (
        <div className="member-flow-form">
          {flowList.map((v) => (
            <Row key={v.processId}>
              <Col span={8}>
                <Radio checked={v.processKey === processKey} onChange={(e) => handleRadio(e, v.processKey)}>
                  {v.processName}
                </Radio>
              </Col>
              <Col span={8}>{v.processTypeName}</Col>
              <Col span={8}>{v.description}</Col>
            </Row>
          ))}
        </div>
      )}
    </Modal>
  )
}

MemberFlow.defaultProps = {}

export default MemberFlow
