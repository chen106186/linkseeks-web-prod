import { PageHeaderWrapper } from '@apps/components'
import { postOrderEightDRectificationDetail, postOrderEightDRectificationConfirmFeedback } from '@apps/apis'
import React, { useEffect, useRef, useState } from 'react'
import ICAOrPCAContent from '../components/ICAOrPCAContent'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import { Button } from '@linkseeks/ui'
import IcaPcaModalAudit from '../components/IcaPcaModalAudit'
import { useQuery, useLocation } from '@linkseeks/router-core'

const index: React.FC = () => {
  const { id } = useQuery()
  const { pathname } = useLocation()
  const intl = getIntl()
  const TABLINK = [
    {
      key: 'circulation',
      label: intl.formatMessage({
        id: 'eightD.liuzhuanjindu',
        defaultMessage: intl.formatMessage({ id: 'eightD.liuzhuanjindu', defaultMessage: '流转进度' }),
      }),
    },
    {
      key: 'basis',
      label: intl.formatMessage({
        id: 'eightD.jichuxinxi',
        defaultMessage: intl.formatMessage({ id: 'eightD.jichuxinxi', defaultMessage: '基础信息' }),
      }),
    },
    {
      key: 'problem',
      label: intl.formatMessage({
        id: 'eightD.wentimiaoshu',
        defaultMessage: intl.formatMessage({ id: 'eightD.wentimiaoshu', defaultMessage: '问题描述' }),
      }),
    },
    {
      key: 'attachment',
      label: intl.formatMessage({
        id: 'eightD.fujian',
        defaultMessage: intl.formatMessage({ id: 'eightD.fujian', defaultMessage: '附件' }),
      }),
    },
    {
      key: 'group',
      label: intl.formatMessage({
        id: 'eightD.xiaozuchengyuan',
        defaultMessage: intl.formatMessage({ id: 'eightD.xiaozuchengyuan', defaultMessage: '小组成员' }),
      }),
    },
    {
      key: 'temporary',
      label: intl.formatMessage({
        id: 'eightD.linshiezhicuoshi',
        defaultMessage: intl.formatMessage({ id: 'eightD.linshiezhicuoshi', defaultMessage: '临时遏制措施' }),
      }),
    },
    {
      key: 'atAll',
      label: intl.formatMessage({
        id: 'eightD.genbenyuanyin',
        defaultMessage: intl.formatMessage({ id: 'eightD.genbenyuanyin', defaultMessage: '根本原因' }),
      }),
    },
  ]

  const ref = useRef<any>({})
  const [DMessage, setDMessage] = useState<any>({})

  const [visible, setVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)

  const fnGetDetail = () => {
    const par = {
      id,
    }
    postOrderEightDRectificationDetail(par, { ctlType: 'none' }).then((res: any) => {
      console.log(res)
      if (res.code === 1000) {
        setDMessage(res.data)
        // fnResetSummary(res.data);
      }
    })
  }

  const handleSubmit = () => {
    ref.current
      .formref()
      .validateFields()
      .then((values) => {
        console.log(values)
        const obj = {
          id,
          eightDRectificationNo: DMessage.eightDRectificationNo,
          approvalStatus: values.state === 0 ? 3 : values.state,
          auditResult: values.auditOpinion,
        }
        console.log(obj)
        postOrderEightDRectificationConfirmFeedback(obj).then((res) => {
          if (res.code === 1000) {
            // message.success('操作成功');
            history.goBack()
          }
        })
      })
  }

  const fnGetCanAdopt = () => {
    const unAdopt = [5, 7] // 外部状态为5 7 的时候 一级或者二级不通过
    if (unAdopt.indexOf(DMessage.internalStatus) > -1) {
      return false
    }
    return true
  }
  useEffect(() => {
    fnGetDetail()
  }, [])

  return (
    <div>
      <PageHeaderWrapper
        title={intl.formatMessage({ id: 'eightD.querenICAfankui', defaultMessage: '确认ICA反馈' })}
        items={TABLINK}
        extra={
          <Button
            onClick={() => {
              setVisible(true)
            }}
            type="primary"
          >
            {intl.formatMessage({ id: 'eightD.shenhe', defaultMessage: '审核' })}
          </Button>
        }
      >
        <ICAOrPCAContent message={DMessage} />
      </PageHeaderWrapper>
      <IcaPcaModalAudit
        formref={ref}
        canAdopt={fnGetCanAdopt()}
        initialValue={fnGetCanAdopt() ? 1 : 0}
        modalTypes={{
          title: intl.formatMessage({ id: 'dealAbility.danjushenhe', defaultMessage: '单据审核' }),
          visible: visible,
          destroyOnClose: true,
          onOk: () => handleSubmit(),
          onCancel: () => setVisible(false),
          confirmLoading: confirmLoading,
        }}
      />
    </div>
  )
}

export default index
