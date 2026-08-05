import MeasureContent from '../../8D/components/MeasureContent'
import { PageHeaderWrapper } from '@apps/components'
import React, { useEffect, useRef, useState } from 'react'
import ICAOrPCAContent from '../../8D/components/ICAOrPCAContent'
import { Button, Input, Form } from 'antd'
import { postOrderEightDRectificationDetail, postOrderEightDRectificationPcaFeedback } from '@apps/apis'
import { Card } from '@linkseeks/ui'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import BasicLayoutCard from '../../8D/components/BasicLayoutCard'
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
        defaultMessage: '永久纠正措施验证',
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
  const { TextArea } = Input
  const [form] = Form.useForm()
  const [DMessage, setDMessage] = useState<any>({})
  const currentRef = useRef<any>({})
  const currentRefPCA = useRef<any>({})
  const fnGetDetail = () => {
    const par = {
      id,
    }
    postOrderEightDRectificationDetail(par, { ctlType: 'none' }).then((res: any) => {
      console.log(res)
      if (res.code === 1000) {
        setDMessage(res.data)
        if (res.data.correctionInformation?.effectConfirmed) {
          const obj = {
            effectConfirmed: res.data.correctionInformation?.effectConfirmed,
          }
          form.setFieldsValue(obj)
        }
      }
    })
  }

  const fnSubmit = () => {
    const changeMessage = currentRef.current.fnCallBlack()
    const fnCallBlackPCA = currentRefPCA.current.fnCallBlackPCA()
    form.validateFields()
    const effectConfirmed = form.getFieldValue('effectConfirmed')
    if (!fnCallBlackPCA || !changeMessage || !effectConfirmed) {
      return
    }
    const { qualityOrderProductVOS } = changeMessage
    const desc = []
    qualityOrderProductVOS.map((item: any) => {
      // 因为后台那边让不传采购商的小组成员,所以这边这届过滤掉
      if (item.roleType === 1) {
        desc.push(item)
      }
    })
    changeMessage.qualityOrderProductVOS = desc
    const obj = {
      id,
      eightDRectificationNo: DMessage.eightDRectificationNo,
      ...changeMessage,
      ...fnCallBlackPCA,
      effectConfirmed,
    }
    console.log(obj)
    postOrderEightDRectificationPcaFeedback(obj).then((res) => {
      if (res.code === 1000) {
        // message.success('操作成功');
        history.goBack()
      }
    })
  }

  useEffect(() => {
    fnGetDetail()
  }, [])

  return (
    <PageHeaderWrapper
      title={intl.formatMessage({ id: 'eightD.PCAfankui', defaultMessage: 'PCA反馈' })}
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
      <ICAOrPCAContent onlyOut ref={currentRef} message={DMessage} showICaOrPca="pca" hiddenConfig isCoordination>
        <MeasureContent
          ref={currentRefPCA}
          canEdit
          message={DMessage}
          shouldCorrectiveActionUrlsBtn
          shouldCorrectiveActionVerifyUrlsBtn
          shouldpreventionUrlsBtn
          shouldShowAction
          shouldShowpRevention
        ></MeasureContent>
        {/* <BasicLayoutCard effectBlock={problemDescribeDesc} CardTitle='效果验证' /> */}
        <Card id="basicLayout" title={intl.formatMessage({ id: 'eightD.xiaoguoqueren', defaultMessage: '效果确认' })}>
          <Form form={form}>
            <Form.Item
              label="效果验证"
              labelCol={{ span: 2 }}
              labelAlign="left"
              name="effectConfirmed"
              rules={[
                { required: true, message: intl.formatMessage({ id: 'eightD.qingshuru', defaultMessage: '请输入' }) },
              ]}
            >
              <TextArea
                style={{ width: '70%' }}
                rows={4}
                placeholder={intl.formatMessage({ id: 'eightD.xiaoguoqueren', defaultMessage: '效果确认' })}
              />
            </Form.Item>
          </Form>
        </Card>
      </ICAOrPCAContent>
    </PageHeaderWrapper>
  )
}

export default index
