import React, { useState, useRef } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Card, Button, Input, Modal, Form } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import NiceForm from '@/components/NiceForm'
import { createFormActions } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { searchSchema } from './schema'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { DatePicker } from '@apps/formily'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import StatusTag from '@/components/StatusTag'
import { accountMemberType, accountStatusMap, memberStatusMap } from '../../constant'
import { validatorByte } from '@/utils/regExp'
import {
  getPayMemberAssetAccountGetMemberAssetAccountList,
  GetPayMemberAssetAccountGetMemberAssetAccountListResponseDetail,
  postPayMemberAssetAccountUpdateMemberAssetAccountEnable,
} from '@apps/apis'
import { getMemberManagePageitems } from '@apps/apis'
import { customAuthUrl as AuthUrl } from '@apps/domains'
import { AuthButton } from '@apps/components'

const formActions = createFormActions()
const { TextArea } = Input

const AccountLists: React.FC<{}> = () => {
  const ref = useRef<any>({})
  const intl = useIntl()
  const [checkForm] = Form.useForm()
  const [currentRecord, setCurrentRecord] = useState<GetPayMemberAssetAccountGetMemberAssetAccountListResponseDetail>()
  const [visibleModal, setVisibleModal] = useState<boolean>(false)

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'payandSettle.amountAccountManage.memberAccountManage.columns.memberName' }),
      dataIndex: 'memberName',
      key: 'memberName',
      className: 'commonPickColor',
      render: (text, record) => (
        <DetailAuthButton>
          <EyeAuthButton url={`/payandSettle/amountAccountManage/amountAccountManage/detail?id=${record.id}`}>
            {text}
          </EyeAuthButton>
        </DetailAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.amountAccountManage.memberAccountManage.columns.memberType' }),
      dataIndex: 'memberType',
      key: 'memberType',
      render: (t, r) => accountMemberType[t],
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.amountAccountManage.memberAccountManage.columns.memberRoleName' }),
      dataIndex: 'memberRoleName',
      key: 'memberRoleName',
    },
    // {
    //   title: '会员等级',
    //   dataIndex: 'memberLevel',
    //   key: 'memberLevel',
    //   render: (t, r) => <LevelBrand level={r.level} />
    // },
    {
      title: intl.formatMessage({ id: 'payandSettle.amountAccountManage.memberAccountManage.columns.accountBalance' }),
      dataIndex: 'accountBalance',
      key: 'accountBalance',
      render: (text) =>
        `${intl.formatMessage({ id: 'payandSettle.amountAccountManage.memberAccountManage.currency' })}${text.toFixed(
          2,
        )}`,
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.amountAccountManage.memberAccountManage.columns.lockBalance' }),
      dataIndex: 'lockBalance',
      key: 'lockBalance',
      render: (text) =>
        `${intl.formatMessage({ id: 'payandSettle.amountAccountManage.memberAccountManage.currency' })}${text.toFixed(
          2,
        )}`,
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.amountAccountManage.memberAccountManage.columns.usableBalance' }),
      dataIndex: 'usableBalance',
      key: 'usableBalance',
      render: (t, r) =>
        `${intl.formatMessage({ id: 'payandSettle.amountAccountManage.memberAccountManage.currency' })}${(
          (r.accountBalance * 100 - r.lockBalance * 100) /
          100
        ).toFixed(2)}`,
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.amountAccountManage.memberAccountManage.columns.memberStatus' }),
      dataIndex: 'memberStatus',
      key: 'memberStatus',
      render: (t, r) => <StatusTag title={memberStatusMap[t]['title']} type={memberStatusMap[t]['type']} />,
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.amountAccountManage.memberAccountManage.columns.accountStatus' }),
      dataIndex: 'accountStatus',
      key: 'accountStatus',
      render: (t, r) => (
        <>
          <span className={accountStatusMap[t]['className']}></span>
          {accountStatusMap[t]['title']}
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.amountAccountManage.memberAccountManage.columns.option' }),
      dataIndex: 'option',
      render: (t: any, r: any) => (
        <AuthButton type="custom" code="frozen">
          <Button type="link" onClick={() => handleRow(r)}>
            {r.accountStatus === 1
              ? intl.formatMessage({ id: 'payandSettle.amountAccountManage.memberAccountManage.columns.option.1' })
              : intl.formatMessage({ id: 'payandSettle.amountAccountManage.memberAccountManage.columns.option.2' })}
          </Button>
        </AuthButton>
      ),
    },
  ]

  const handleRow = (data: any) => {
    setCurrentRecord(data)
    setVisibleModal(true)
    checkForm.resetFields()
  }

  const fetchData = (params: any) => {
    console.log(params)
    return new Promise((resolve, reject) => {
      let obj = { ...params }
      getPayMemberAssetAccountGetMemberAssetAccountList(obj).then((res) => {
        resolve(res.data)
      })
    })
  }

  // 会员弹框筛选select值
  const fetchSelectOptions = async () => {
    const res = await getMemberManagePageitems()
    if (res.code === 1000) {
      const { data = {} }: any = res
      const { memberTypes = [], roles = [], levels = [] } = data

      return {
        memberType: memberTypes.map((item) => ({ label: item.memberTypeName, value: item.memberType })),
        memberRoleId: roles.map((item) => ({ label: item.roleName, value: item.roleId })),
        memberLevel: levels.map((item) => ({ label: item.levelTag, value: item.level })),
      }
    }
    return {}
  }

  const handleCancel = () => {
    setVisibleModal(false)
  }

  const handleOK = () => {
    checkForm.validateFields().then((values) => {
      setVisibleModal(false)
      postPayMemberAssetAccountUpdateMemberAssetAccountEnable({
        id: currentRecord.id,
        status: currentRecord.accountStatus === 1 ? 2 : 1,
        ...values,
      }).then((res) => {
        if (res.code === 1000) ref.current.reloadCurrent()
      })
    })
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          columns={columns}
          currentRef={ref}
          tableProps={{ rowKey: 'id' }}
          fetchTableData={(params: any) => fetchData(params)}
          controlRender={
            <NiceForm
              components={{
                RangePicker: DatePicker.RangePicker,
              }}
              actions={formActions}
              onSubmit={(values) => ref.current.reload(values)}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'memberName', FORM_FILTER_PATH)
                useAsyncInitSelect(['memberType', 'memberRoleId', 'memberLevel'], fetchSelectOptions)
              }}
              schema={searchSchema}
            />
          }
        />
      </Card>
      <Modal
        title={
          currentRecord?.accountStatus === 1
            ? intl.formatMessage({ id: 'payandSettle.amountAccountManage.memberAccountManage.modal.title.1' })
            : intl.formatMessage({ id: 'payandSettle.amountAccountManage.memberAccountManage.modal.title.2' })
        }
        visible={visibleModal}
        onOk={handleOK}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <Form layout="vertical" form={checkForm}>
          <Form.Item
            name="remark"
            label={
              currentRecord?.accountStatus === 1
                ? intl.formatMessage({ id: 'payandSettle.amountAccountManage.memberAccountManage.modal.remark.1' })
                : intl.formatMessage({ id: 'payandSettle.amountAccountManage.memberAccountManage.modal.remark.2' })
            }
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'payandSettle.amountAccountManage.memberAccountManage.modal.remark.message',
                }),
              },
              {
                validator: (r, v, c) => validatorByte(r, v, c, 120),
              },
            ]}
          >
            <TextArea
              rows={6}
              placeholder={intl.formatMessage({
                id: 'payandSettle.amountAccountManage.memberAccountManage.modal.remark.placeholder',
              })}
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageHeaderWrapper>
  )
}

export default AccountLists
