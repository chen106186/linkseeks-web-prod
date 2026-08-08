import { PageHeaderWrapper } from '@apps/components'
import { postOrderEightDRectificationDetail, postOrderEightDRectificationFeedback } from '@apps/apis'
import { Button } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import ICAOrPCAContent from '../components/ICAOrPCAContent'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { useQuery, useLocation } from '@linkseeks/router-core'
import ModalAudit from '@/components/ModalAudit'

const index: React.FC = () => {
  const { id } = useQuery()
  const { pathname } = useLocation()
  const ref = useRef<any>({})
  const [DMessage, setDMessage] = useState<any>({})
  const intl = getIntl()
  const [visible, setVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
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
          examinationPassed: values.state === 1,
          auditResult: values.auditOpinion,
        }
        console.log(obj)
        postOrderEightDRectificationFeedback(obj).then((res) => {
          if (res.code === 1000) {
            // message.success('操作成功');
            history.goBack()
          }
        })
      })
  }

  useEffect(() => {
    fnGetDetail()
  }, [])

  return (
    <div>
      <PageHeaderWrapper
        title={intl.formatMessage({ id: 'eightD.shenheICAfankuiyiji', defaultMessage: '审核ICA反馈(一级)' })}
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
      <ModalAudit
        formref={ref}
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
