import { Button } from '@linkseeks/ui'
import { PageHeaderWrapper } from '@apps/components'
import {
  postOrderEightDRectificationDetail,
  postOrderEightDRectificationFeedback,
  postOrderEightDRectificationSubmit,
} from '@apps/apis'
import React, { useEffect, useRef, useState } from 'react'
import ICAOrPCAContent from '../components/ICAOrPCAContent'
import MeasureContent from '../components/MeasureContent'

import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { useQuery, useLocation } from '@linkseeks/router-core'
import ModalAudit from '@/components/ModalAudit'
import BasicLayoutCard from '../components/BasicLayoutCard'

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
    {
      key: 'permanent',
      label: intl.formatMessage({
        id: 'eightD.yongjiujiuzhengcuoshi',
        defaultMessage: intl.formatMessage({ id: 'eightD.yongjiujiuzhengcuoshi', defaultMessage: '永久纠正措施' }),
      }),
    },
    {
      key: 'permanentCode',
      label: intl.formatMessage({
        id: 'eightD.yongjiujiuzhengcuoshiyanzheng',
        defaultMessage: intl.formatMessage({
          id: 'eightD.yongjiujiuzhengcuoshiyanzheng',
          defaultMessage: '永久纠正措施验证',
        }),
      }),
    },
    {
      key: 'prevent',
      label: intl.formatMessage({
        id: 'eightD.yufang',
        defaultMessage: intl.formatMessage({ id: 'eightD.yufang', defaultMessage: '预防' }),
      }),
    },
    {
      key: 'confirmation',
      label: intl.formatMessage({
        id: 'eightD.xiaoguoqueren',
        defaultMessage: intl.formatMessage({ id: 'eightD.xiaoguoqueren', defaultMessage: '效果确认' }),
      }),
    },
  ]

  const ref = useRef<any>({})
  const [DMessage, setDMessage] = useState<any>({})
  const [summary, setSummary] = useState([])

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
        fnResetSummary(res.data)
        // fnResetSummary(res.data);
      }
    })
  }

  const handleSubmit = () => {
    const obj = {
      id,
      eightDRectificationNo: DMessage.eightDRectificationNo,
      auditResult: '',
    }
    console.log(obj)
    postOrderEightDRectificationSubmit(obj).then((res) => {
      if (res.code === 1000) {
        // message.success('操作成功');
        history.goBack()
      }
    })
  }
  const fnResetSummary = (messageDesc) => {
    const summaryDesc = [{ label: '效果确认', extra: messageDesc.correctionInformation?.effectConfirmed }]
    setSummary(summaryDesc)
  }

  useEffect(() => {
    fnGetDetail()
  }, [])

  return (
    <div>
      <PageHeaderWrapper
        title={intl.formatMessage({ id: 'eightD.tijiaoshenhePCAfankui', defaultMessage: '提交审核PCA反馈' })}
        items={TABLINK}
        extra={
          <Button
            onClick={() => {
              handleSubmit()
            }}
            type="primary"
          >
            {intl.formatMessage({ id: 'eightD.tijiao', defaultMessage: '提交' })}
          </Button>
        }
      >
        <ICAOrPCAContent message={DMessage} showICaOrPca="pca">
          <MeasureContent message={DMessage} />
          <div style={{ marginTop: '16px' }} id="confirmation">
            <BasicLayoutCard
              effectBlock={summary}
              CardTitle={intl.formatMessage({ id: 'eightD.xiaoguoqueren', defaultMessage: '效果确认' })}
            />
          </div>
        </ICAOrPCAContent>
      </PageHeaderWrapper>
      {/* <ModalAudit
              formref={ref}
              modalTypes={{
                title: intl.formatMessage({ id: 'dealAbility.danjushenhe', defaultMessage: '单据审核' }),
                visible: visible,
                destroyOnClose: true,
                onOk: () => handleSubmit(),
                onCancel: () => setVisible(false),
                confirmLoading: confirmLoading
              }}
            /> */}
    </div>
  )
}

export default index
