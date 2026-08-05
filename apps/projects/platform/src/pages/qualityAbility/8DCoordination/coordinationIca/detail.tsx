import MeasureContent from '../../8D/components/MeasureContent'
import { PageHeaderWrapper } from '@apps/components'
import React, { useEffect, useRef, useState } from 'react'
import ICAOrPCAContent from '../../8D/components/ICAOrPCAContent'
import { Button } from 'antd'
import { postOrderEightDRectificationDetail, postOrderEightDRectificationIcaFeedback } from '@apps/apis'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
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

  const [DMessage, setDMessage] = useState<any>({})
  const currentRef = useRef<any>({})
  const fnGetDetail = () => {
    const par = {
      id,
    }
    postOrderEightDRectificationDetail(par, { ctlType: 'none' }).then((res: any) => {
      console.log(res)
      if (res.code === 1000) {
        setDMessage(res.data)
      }
    })
  }

  const fnSubmit = () => {
    const changeMessage = currentRef.current.fnCallBlack()
    postOrderEightDRectificationIcaFeedback
    // console.log(DMessage)
    const { qualityOrderProductVOS } = changeMessage
    if (!qualityOrderProductVOS) {
      return
    }
    const desc = []
    qualityOrderProductVOS?.map((item: any) => {
      // 因为后台那边让不传采购商的小组成员,所以这边这届过滤掉
      if (item.roleType === 1) {
        desc.push(item)
      }
    })
    changeMessage.qualityOrderProductVOS = desc
    const obj = {
      id,
      // qualityOrderProductVOS: DMessage.qualityOrderProductVOS,
      ...changeMessage,
    }
    console.log(obj)
    postOrderEightDRectificationIcaFeedback(obj).then((res) => {
      if (res.code === 1000) {
        history.goBack()
      }
    })
  }

  useEffect(() => {
    fnGetDetail()
  }, [])

  return (
    <PageHeaderWrapper
      title={intl.formatMessage({ id: 'eightD.ICAfankui', defaultMessage: 'ICA反馈' })}
      items={TABLINK}
      extra={
        <Button
          onClick={() => {
            fnSubmit()
          }}
          type="primary"
        >
          {intl.formatMessage({ id: 'eightD.tijiao', defaultMessage: '提交' })}
        </Button>
      }
    >
      <ICAOrPCAContent
        onlyOut
        ref={currentRef}
        message={DMessage}
        canEdit
        shouldShowAddVOs
        shoulddescriptionUrlsBtn
        shouldrootCauseUrlsBtn
        showAddTeamBtn
        showICaOrPca="ica"
        isCoordination
      >
        {/* <MeasureContent message={DMessage}></MeasureContent> */}
      </ICAOrPCAContent>
    </PageHeaderWrapper>
  )
}

export default index
