import React, { useState, useRef } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Card, Badge, Progress, Button, Modal, Descriptions, message } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import { PageHeaderWrapper } from '@apps/components'
import { createFormActions } from '@apps/formily'
import {
  postPayCreditHandleAdjustQuota,
  postPayCreditHandleUpdateStatus,
  getPayCreditHandlePageCredit,
  getPayCreditHandlePageItemsBySupplier,
} from '@apps/apis'
import { getMemberManagePageitems } from '@apps/apis'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { coverColFiltersItem } from '@/utils'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import StatusTag from '@/components/StatusTag'
import quotes from '@/assets/imgs/quotes.png'
import {
  CREDIT_STATUS_NOT_APPLIED,
  CREDIT_STATUS_APPLYING,
  CREDIT_STATUS_NORMAL,
  CREDIT_STATUS_FROZEN,
  CREDIT_STATUS,
  CREDIT_REPAYMENT_STATUS_OVERDUE,
} from '@/constants/payment'
import { CREDIT_REPAYMENT_STATUS_TAG_MAP, CREDIT_STATUS_BADGE_MAP } from '../../constant'
import { listSearchSchema } from './schema'
import styles from './index.less'

const formActions = createFormActions()
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'
import { getWebIntl } from '@apps/locales'
const translate = getWebIntl()
const QuotaMenage: React.FC = () => {
  const intl = useIntl()
  const [collectionModalVisible, setCollectionModalVisible] = useState(false)
  const [successModalVisible, setSuccessModalVisible] = useState(false)

  const ref = useRef<any>({})

  const handleCollection = () => {
    setCollectionModalVisible(true)
  }

  // 调额
  const handleAdjustment = (record) => {
    const msg = message.loading({
      content: intl.formatMessage({ id: 'payandSettle.creditManage.quotaMenage.handleAdjustment' }),
      duration: 0,
    })
    postPayCreditHandleAdjustQuota({
      creditId: record.id,
    })
      .then((res) => {
        if (res.code === 1000) {
          ref.current.reloadCurrent()
        }
      })
      .finally(() => {
        msg()
      })
  }

  // 冻结/解冻
  const handleFrozen = (record) => {
    const status = record.status === CREDIT_STATUS_NORMAL ? CREDIT_STATUS_FROZEN : CREDIT_STATUS_NORMAL

    const msg = message.loading({
      content:
        status === CREDIT_STATUS_NORMAL
          ? intl.formatMessage({ id: 'payandSettle.creditManage.quotaMenage.handleFrozen.1' })
          : intl.formatMessage({ id: 'payandSettle.creditManage.quotaMenage.handleFrozen.2' }),
      duration: 0,
    })
    postPayCreditHandleUpdateStatus({
      id: record.id,
      status,
    })
      .then((res) => {
        if (res.code === 1000) {
          ref.current.reloadCurrent()
        }
      })
      .finally(() => {
        msg()
      })
  }

  const defaultColumns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'payandSettle.creditManage.quotaMenage.defaultColumns.memberName' }),
      dataIndex: 'memberName',
      render: (text, record) => (
        <>
          {/* 未申请过，并且授信状态为未申请 或者 申请中 则显示文本 */}
          {!record.isHasApply &&
          (record.status === CREDIT_STATUS_NOT_APPLIED || record.status === CREDIT_STATUS_APPLYING) ? (
            <>
              {text}
              <div>{record.memberLevelName}</div>
            </>
          ) : (
            <DetailAuthButton>
              <EyeAuthButton url={`/payandSettle/creditManage/quotaMenage/detail?id=${record.id}`}>
                {text}
              </EyeAuthButton>
              <div>{record.memberLevelName}</div>
            </DetailAuthButton>
          )}
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditManage.quotaMenage.defaultColumns.memberTypeName' }),
      dataIndex: 'memberTypeName',
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditManage.quotaMenage.defaultColumns.memberRoleName' }),
      dataIndex: 'memberRoleName',
      render: (text, record) => <>{text}</>,
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditManage.quotaMenage.defaultColumns.canUseQuota' }),
      dataIndex: 'canUseQuota',
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditManage.quotaMenage.defaultColumns.quota' }),
      dataIndex: 'quota',
      render: (text, record) => (
        <>
          <div>
            {intl.formatMessage({ id: 'payandSettle.creditManage.quotaMenage.defaultColumns.quota.text.1' })}
            {text}
          </div>
          <div>
            {intl.formatMessage({ id: 'payandSettle.creditManage.quotaMenage.defaultColumns.quota.text.2' })}
            {record.useQuota}
          </div>
        </>
      ),
    },
    {
      title: '',
      dataIndex: 'used',
      render: (text, record) => (
        <Progress
          type="circle"
          percent={(record.useQuota / record.quota) * 100}
          strokeColor="#41CC9E"
          strokeWidth={12}
          width={40}
          format={() => ''}
        />
      ),
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditManage.quotaMenage.defaultColumns.repayStatusName' }),
      dataIndex: 'repayStatusName',
      render: (text, record) => (
        <>{text ? <StatusTag type={CREDIT_REPAYMENT_STATUS_TAG_MAP[record.repayStatus]} title={text} /> : null}</>
      ),
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditManage.quotaMenage.defaultColumns.statusName' }),
      dataIndex: 'statusName',
      render: (text, record) => <Badge color={CREDIT_STATUS_BADGE_MAP[record.status] || '#606266'} text={text} />,
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditManage.quotaMenage.defaultColumns.action' }),
      dataIndex: 'action',
      render: (text, record) => (
        <>
          {/* 授信状态为 正常 时可申请调额 */}
          {record.status === CREDIT_STATUS_NORMAL && !!record.isCanApply && (
            <AuthButton type="custom" code="update">
              <Button type="link" onClick={() => handleAdjustment(record)}>
                {intl.formatMessage({ id: 'payandSettle.creditManage.quotaMenage.defaultColumns.action.button.1' })}
              </Button>
            </AuthButton>
          )}
          {/* 暂时不做了 */}
          {/* <Button
            type="link"
            onClick={() => handleCollection()}
          >
            催收
          </Button> */}
          {/* 授信状态为 正常、冻结 可操作 */}
          {(record.status === CREDIT_STATUS_NORMAL || record.status === CREDIT_STATUS_FROZEN) && (
            <AuthButton type="custom" code="frozen">
              <Button type="link" onClick={() => handleFrozen(record)} danger>
                {record.status === CREDIT_STATUS_NORMAL
                  ? intl.formatMessage({ id: 'payandSettle.creditManage.quotaMenage.defaultColumns.action.button.2' })
                  : intl.formatMessage({ id: 'payandSettle.creditManage.quotaMenage.defaultColumns.action.button.3' })}
              </Button>
            </AuthButton>
          )}
        </>
      ),
    },
  ]

  const [columns, setColumns] = useState<any[]>(defaultColumns)

  const fetchListData = (params: any) => {
    const { status = 0, rePayStatus = 0, ...rest } = params
    return new Promise((resolve, reject) => {
      getPayCreditHandlePageCredit({
        status,
        rePayStatus,
        ...rest,
      })
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          }
          reject()
        })
        .catch(() => {
          reject()
        })
    })
  }

  // 初始化高级筛选选项
  const fetchSearchItems = async () => {
    const res = await getPayCreditHandlePageItemsBySupplier()

    if (res.code === 1000) {
      const { data } = res
      const { statusList = [], repayStatusList = [] } = data

      return {
        status: statusList.map((item) => ({ label: item.name, value: item.status })).filter((item) => item.value),
        rePayStatus: repayStatusList
          .map((item) => ({ label: item.name, value: item.status }))
          .filter((item) => item.value),
      }
    }
    return {}
  }

  // 初始化高级筛选会员选项
  const fetchSearchMemberItems = async () => {
    const res = await getMemberManagePageitems()

    if (res.code === 1000) {
      const { data = {} }: any = res
      const { memberTypes = [], roles = [], levels = [] } = data

      return {
        memberType: memberTypes.map((item) => ({ label: item.memberTypeName, value: item.memberType })),
        subRoleId: roles.map((item) => ({ label: item.roleName, value: item.roleId })),
        level: levels.map((item) => ({ label: item.levelTag, value: item.level })),
      }
    }
    return {}
  }

  const handleSentMsg = () => {
    setCollectionModalVisible(false)
    setSuccessModalVisible(true)
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'id',
          }}
          columns={columns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchListData(params)}
          controlRender={
            <NiceForm
              actions={formActions}
              onSubmit={(values) => ref.current.reload(values)}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'memberName', FORM_FILTER_PATH)
                useAsyncInitSelect(['rePayStatus', 'status'], fetchSearchItems)
                useAsyncInitSelect(['level', 'memberType', 'subRoleId'], fetchSearchMemberItems)
              }}
              schema={listSearchSchema}
            />
          }
        />
      </Card>

      <Modal
        title={intl.formatMessage({ id: 'payandSettle.creditManage.quotaMenage.modal.1' })}
        visible={collectionModalVisible}
        onOk={() => handleSentMsg()}
        onCancel={() => setCollectionModalVisible(false)}
        destroyOnClose
      >
        <div className={styles.tipWrap}>
          <div className={styles.tip}>
            <p>{intl.formatMessage({ id: 'payandSettle.creditManage.quotaMenage.modal.1.tip.1' })}</p>
            <p>{intl.formatMessage({ id: 'payandSettle.creditManage.quotaMenage.modal.1.tip.2' })}</p>
          </div>

          <Card
            type="inner"
            style={{
              background: '#FAFBFC',
            }}
          >
            <div className={styles.quotes}>
              <img src={quotes} width="20" height="20" />
            </div>
            <div className={styles.content}>
              <p>
                {intl.formatMessage({ id: 'payandSettle.creditManage.quotaMenage.modal.1.content.1' })}
                {translate('web.common.currencySymbol')} 1000.00，{' '}
              </p>
              <p>
                {intl.formatMessage({ id: 'payandSettle.creditManage.quotaMenage.modal.1.content.2' })}2014-07-01，{' '}
                {intl.formatMessage({ id: 'payandSettle.creditManage.quotaMenage.modal.1.content.3', data: '3' })}
              </p>
              <p>{intl.formatMessage({ id: 'payandSettle.creditManage.quotaMenage.modal.1.content.4' })}</p>
            </div>
          </Card>
        </div>
      </Modal>

      <Modal
        title={intl.formatMessage({ id: 'payandSettle.creditManage.quotaMenage.modal.2' })}
        visible={successModalVisible}
        footer={null}
        onCancel={() => setSuccessModalVisible(false)}
        destroyOnClose
      >
        <div className={styles.success}>
          <div className={styles.icon}>
            <CheckCircleOutlined />
          </div>
          <div className={styles.tip}>
            {intl.formatMessage({ id: 'payandSettle.creditManage.quotaMenage.modal.2.tip' })}
          </div>
          <div className={styles.action}>
            <Button type="primary" onClick={() => setSuccessModalVisible(false)}>
              {intl.formatMessage({ id: 'payandSettle.creditManage.quotaMenage.modal.2.button' })}
            </Button>
          </div>
        </div>
      </Modal>
    </PageHeaderWrapper>
  )
}

export default QuotaMenage
