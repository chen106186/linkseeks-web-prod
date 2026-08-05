import React, { useState, useRef } from 'react'
import { Button, Input, Modal, Form } from 'antd'
import { PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { EyeAuthButton, AuthButton } from '@apps/components'
import StatusTag from '@/components/StatusTag'
import { accountMemberType, accountStatusMap, memberStatusMap } from '../constant'
import { validatorByte } from '@/utils/regExp'
import {
  getPayPlatFormAssetAccountGetPlatFormAssetAccountList,
  postPayPlatFormAssetAccountUpdateMemberAssetAccountEnable,
} from '@apps/apis'
import useSelectOptions from './services/hooks/useSelectOptions'

const { TextArea } = Input

const AccountLists: React.FC = () => {
  const ref = useRef({} as ActionType)
  const selectData = useSelectOptions()
  const [checkForm] = Form.useForm()
  const [currentRecord, setCurrentRecord] = useState<any>()
  const [visibleModal, setVisibleModal] = useState<boolean>(false)

  const handleRow = (data: any) => {
    setCurrentRecord(data)
    setVisibleModal(true)
  }

  const columns: RecordColumns<any>[] = [
    {
      title: '会员名称',
      dataIndex: 'memberName',
      key: 'memberName',
      className: 'commonPickColor',
      searchField: {
        main: true,
      },
      fixed: 'left',
      render: (text, record) => (
        <>
          <EyeAuthButton url={`/settlementManage/capitalAccount/accountLists/detail?id=${record.id}`}>
            {text}
          </EyeAuthButton>
        </>
      ),
    },
    {
      title: '会员类型',
      dataIndex: 'memberType',
      key: 'memberType',
      render: (t) => accountMemberType[t],
      searchField: 'Select',
    },
    {
      title: '会员角色',
      dataIndex: 'memberRoleName',
      key: 'memberRoleName',
      searchField: {
        name: 'memberRoleId',
        type: 'Select',
      },
    },
    // {
    //   title: '会员等级',
    //   dataIndex: 'memberLevel',
    //   key: 'memberLevel',
    //   render: (t, r) => <LevelBrand level={r.level} />
    // },
    {
      title: '账户余额',
      dataIndex: 'accountBalance',
      key: 'accountBalance',
      render: (text) => `￥${text.toFixed(2)}`,
    },
    {
      title: '锁定余额',
      dataIndex: 'lockBalance',
      key: 'lockBalance',
      render: (text) => `￥${text.toFixed(2)}`,
    },
    {
      title: '可用余额',
      dataIndex: 'usableBalance',
      key: 'usableBalance',
      render: (t, r) => `￥${((r.accountBalance * 100 - r.lockBalance * 100) / 100).toFixed(2)}`,
    },
    {
      title: '会员状态',
      dataIndex: 'memberStatus',
      key: 'memberStatus',
      searchField: {
        type: 'Select',
        valueEnum: [
          {
            label: '正常',
            value: 1,
          },
          {
            label: '已冻结',
            value: 2,
          },
        ],
      },
      render: (t) => <StatusTag title={memberStatusMap[t]['title']} type={memberStatusMap[t]['type']} />,
    },
    {
      title: '账户状态',
      dataIndex: 'accountStatus',
      key: 'accountStatus',
      searchField: {
        type: 'Select',
        valueEnum: [
          {
            label: '正常',
            value: 1,
          },
          {
            label: '已冻结',
            value: 2,
          },
        ],
      },
      render: (t) => (
        <>
          <span className={accountStatusMap[t]['className']} />
          {accountStatusMap[t]['title']}
        </>
      ),
    },
    {
      title: '操作',
      key: 'option',
      fixed: 'right',
      render: (t: any, r: any) => (
        <AuthButton type="custom" code="freeze">
          <Button style={{ paddingLeft: 0 }} type="link" onClick={() => handleRow(r)}>
            {r.accountStatus === 1 ? '冻结' : '解除'}
          </Button>
        </AuthButton>
      ),
    },
  ]

  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      const obj = { ...params }
      getPayPlatFormAssetAccountGetPlatFormAssetAccountList(obj).then((res) => {
        resolve(res.data)
      })
    })
  }

  const handleCancel = () => {
    setVisibleModal(false)
  }

  const handleOK = () => {
    checkForm.validateFields().then((values) => {
      setVisibleModal(false)
      postPayPlatFormAssetAccountUpdateMemberAssetAccountEnable({
        id: currentRecord.id,
        status: currentRecord.accountStatus === 1 ? 2 : 1,
        ...values,
      }).then((res) => {
        if (res.code === 1000) ref.current.reload()
      })
    })
  }

  return (
    <PageHeaderWrapper backDom={false}>
      <StandardFormTable
        columns={columns}
        autoScrollX
        request={(params) => fetchData(params)}
        rowKey="id"
        actionRef={ref}
        searchSelectMaps={selectData}
      />
      <Modal
        title={currentRecord?.accountStatus === 1 ? '会员冻结' : '会员解冻'}
        visible={visibleModal}
        onOk={handleOK}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <Form layout="vertical" form={checkForm}>
          <Form.Item
            name="remark"
            label={currentRecord?.accountStatus === 1 ? '会员账户冻结原因' : '会员账户解冻原因'}
            rules={[
              {
                required: true,
                message: '请填写原因',
              },
              {
                validator: (r, v, c) => validatorByte(r, v, c, 120),
              },
            ]}
          >
            <TextArea rows={6} placeholder="请填写原因" />
          </Form.Item>
        </Form>
      </Modal>
    </PageHeaderWrapper>
  )
}

export default AccountLists
